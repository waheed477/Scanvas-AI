import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';

// Types matching our schema structure
interface AuditOutput {
  score: number;
  results: any; // Full axe results
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    total: number;
  };
}

export async function runAudit(url: string): Promise<AuditOutput> {
  let browser;
  try {
    // Launch puppeteer
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true // 'new' is now default, but being explicit
    });

    const page = await browser.newPage();
    
    // Set viewport to desktop size
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Run axe-core
    const results = await new AxePuppeteer(page).analyze();

    // Calculate score (simple algorithm based on violations)
    // 100 base score
    // - Critical: 10 pts
    // - Serious: 5 pts
    // - Moderate: 2 pts
    // - Minor: 1 pt
    
    const summary = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      total: 0
    };

    let penalty = 0;

    results.violations.forEach((violation) => {
      const count = violation.nodes.length;
      summary.total += count;

      switch (violation.impact) {
        case 'critical':
          summary.critical += count;
          penalty += 10 * count;
          break;
        case 'serious':
          summary.serious += count;
          penalty += 5 * count;
          break;
        case 'moderate':
          summary.moderate += count;
          penalty += 2 * count;
          break;
        case 'minor':
          summary.minor += count;
          penalty += 1 * count;
          break;
        default:
          summary.minor += count;
          penalty += 1 * count;
      }
    });

    const score = Math.max(0, 100 - penalty);

    return {
      score,
      results,
      summary
    };

  } catch (error) {
    console.error("Puppeteer/Axe error:", error);
    throw new Error(`Failed to audit ${url}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
