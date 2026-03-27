import puppeteer from 'puppeteer';
import fs from 'fs';

export interface ScanResult {
  violations: any[];
  passes: any[];
  incomplete: any[];
  inapplicable: any[];
  url: string;
  timestamp: string;
  score?: number;
  summary?: any;
  error?: string;
  success: boolean;  // Added success flag
}

export async function runPuppeteerScan(url: string, selectedStandards?: string[]): Promise<ScanResult> {
  let browser = null;
  
  try {
    console.log('🚀 Launching Puppeteer...');
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set realistic viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('📡 Navigating to:', url);
    
    // TRIPLE ATTEMPT STRATEGY
    let response = null;
    let navigationSuccess = false;
    
    // Attempt 1: Standard navigation with networkidle0
    try {
      response = await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 45000 
      });
      navigationSuccess = true;
      console.log('✅ Navigation successful with networkidle0');
    } catch (error) {
      console.log('⚠️ networkidle0 failed, trying networkidle2...');
      
      // Attempt 2: networkidle2
      try {
        response = await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        navigationSuccess = true;
        console.log('✅ Navigation successful with networkidle2');
      } catch (error) {
        console.log('⚠️ networkidle2 failed, trying domcontentloaded...');
        
        // Attempt 3: domcontentloaded (fastest, works for most sites)
        try {
          response = await page.goto(url, { 
            waitUntil: 'domcontentloaded',
            timeout: 20000 
          });
          navigationSuccess = true;
          console.log('✅ Navigation successful with domcontentloaded');
        } catch (error) {
          console.log('❌ All navigation attempts failed');
          throw new Error('Could not load website after multiple attempts');
        }
      }
    }
    
    if (!navigationSuccess || !response) {
      throw new Error('Failed to load website');
    }
    
    console.log('✅ Page loaded with status:', response.status());
    
    // Wait a bit for dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Scroll to trigger lazy-loaded content
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      window.scrollTo(0, 0);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // SIMPLE FIX - Hardcoded path to avoid module resolution issues
    console.log('📦 Loading axe-core...');
    
    // Direct path - using hardcoded absolute path to avoid [project] placeholder issue
    const axePath = 'D:/Scanvas/backend/node_modules/axe-core/axe.js';
    console.log('✅ Using axe-core path:', axePath);

    try {
      const axeContent = fs.readFileSync(axePath, 'utf8');
      await page.addScriptTag({ content: axeContent });
      console.log('✅ Axe-core injected successfully');
    } catch (error) {
      console.error('❌ Failed to load axe-core:', error);
      throw new Error(`Axe-core not found at: ${axePath}`);
    }
    
    console.log('🔍 Running axe-core scan...');
    
    const standards = selectedStandards || ['wcag2a', 'wcag2aa', 'best-practice'];
    
    const results = await page.evaluate((standards) => {
      return axe.run({
        runOnly: {
          type: 'tag',
          values: standards
        }
      });
    }, standards);
    
    console.log(`✅ Scan complete! Found ${results.violations.length} violations`);
    
    if (results.violations.length > 0) {
      console.log('📊 Top violations:');
      results.violations.slice(0, 3).forEach((v: any) => {
        console.log(`   - ${v.help} (${v.impact}, ${v.nodes.length} elements)`);
      });
    } else {
      console.log('🎉 No violations found!');
    }
    
    // Calculate score using the fixed function
    const score = calculateScore(results.violations);
    const summary = createSummary(results.violations);
    
    return {
      violations: results.violations || [],
      passes: results.passes || [],
      incomplete: results.incomplete || [],
      inapplicable: results.inapplicable || [],
      url: url,
      timestamp: new Date().toISOString(),
      score,
      summary,
      success: true
    };
    
  } catch (error: any) {
    console.error('❌ Scan error:', error.message);
    
    // Return error object with success: false
    return {
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: [],
      url: url,
      timestamp: new Date().toISOString(),
      error: error.message,
      success: false
    };
    
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed');
    }
  }
}

export function calculateScore(violations: any[]): number {
  // ✅ No violations = near perfect
  if (!violations || violations.length === 0) {
    return 98; // Professional tools never give 100
  }
  
  let score = 100;
  
  violations.forEach(violation => {
    const impact = violation.impact || 'minor';
    const nodes = violation.nodes?.length || 1;
    
    // Realistic penalty system
    switch (impact) {
      case 'critical':
        score -= 15 * nodes;
        break;
      case 'serious':
        score -= 10 * nodes;
        break;
      case 'moderate':
        score -= 6 * nodes;
        break;
      default: // minor
        score -= 3 * nodes;
        break;
    }
  });
  
  // ✅ Ensure score is never 0 unless truly catastrophic
  const finalScore = Math.max(50, Math.min(98, Math.round(score)));
  
  return finalScore;
}

export function createSummary(violations: any[]) {
  const summary = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    total: violations.length
  };

  violations.forEach(v => {
    const impact = v.impact || 'minor';
    switch (impact) {
      case 'critical': summary.critical++; break;
      case 'serious': summary.serious++; break;
      case 'moderate': summary.moderate++; break;
      default: summary.minor++; break;
    }
  });

  return summary;
}