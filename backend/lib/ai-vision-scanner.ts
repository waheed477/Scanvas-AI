import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import Together from 'together-ai';

// Initialize Together AI client
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export interface VisionIssue {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: { html: string; target: string[] }[];
}

export async function scanWithVision(url: string, mode: 'local' | 'cloud'): Promise<VisionIssue[]> {
  console.log(`👁️ Running vision scan with ${mode} mode...`);
  
  // Take screenshot
  const screenshot = await takeScreenshot(url);
  
  if (mode === 'cloud') {
    return await scanWithCloudVision(screenshot, url);
  } else {
    return await scanWithLocalVision(screenshot, url);
  }
}

async function takeScreenshot(url: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  const screenshot = await page.screenshot({ encoding: 'base64' });
  await browser.close();
  return `data:image/png;base64,${screenshot}`;
}

// Cloud Mode: Llama 3.2 Vision via Together AI
async function scanWithCloudVision(screenshot: string, url: string): Promise<VisionIssue[]> {
  try {
    const response = await together.chat.completions.create({
      model: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
      messages: [{
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Analyze this website screenshot for accessibility issues. Return ONLY valid JSON array with this exact format. No markdown, no extra text.

            [
              {
                "id": "unique-id",
                "impact": "critical|serious|moderate|minor",
                "description": "clear description of the visual issue",
                "help": "how to fix this issue",
                "helpUrl": "https://www.w3.org/WAI/WCAG21/quickref/",
                "nodes": [{"html": "affected element description", "target": ["css-selector"]}]
              }
            ]

            Look for:
            1. Color contrast problems (text not readable)
            2. Text that's too small (<16px body text)
            3. Elements with insufficient spacing
            4. Focus indicators not visible
            5. Content overlapping or cut off
            6. Missing alt text on important images
            7. Improper heading hierarchy visually
            8. Form labels not associated visually
            
            If no issues found, return empty array []`
          },
          { type: 'image_url', image_url: { url: screenshot } }
        ]
      }],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    console.log('🤖 Cloud AI response:', content.substring(0, 200));
    
    // Clean response and parse JSON
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const issues = JSON.parse(cleanContent);
    return Array.isArray(issues) ? issues : [];
    
  } catch (error) {
    console.error('❌ Cloud vision failed:', error);
    return [];
  }
}

// Local Mode: SmolVLM via Python subprocess
async function scanWithLocalVision(screenshot: string, url: string): Promise<VisionIssue[]> {
  return new Promise((resolve) => {
    // Save screenshot temporarily
    const tempPath = path.join(__dirname, 'temp_screenshot.png');
    const base64Data = screenshot.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(tempPath, base64Data, 'base64');
    
    // Python script path
    const scriptPath = path.join(__dirname, 'smolvlm-scanner.py');
    
    // Call Python script
    const pythonProcess = spawn('python', [scriptPath, tempPath, url]);
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      fs.unlinkSync(tempPath);
      
      if (code === 0 && output.trim()) {
        try {
          const issues = JSON.parse(output);
          resolve(Array.isArray(issues) ? issues : []);
        } catch (e) {
          console.error('❌ Failed to parse local AI output:', e);
          resolve([]);
        }
      } else {
        if (errorOutput) console.error('❌ Python error:', errorOutput);
        resolve([]);
      }
    });
    
    pythonProcess.on('error', (err) => {
      console.error('❌ Failed to start Python process:', err);
      fs.unlinkSync(tempPath);
      resolve([]);
    });
  });
}