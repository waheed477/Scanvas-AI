import { runPuppeteerScan, ScanResult } from './puppeteer-scanner';

export interface BatchScanResult {
  results: {
    url: string;
    success: boolean;
    result?: ScanResult;
    error?: string;
    timeTaken: number;
  }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageScore: number;
    totalTime: number;
  };
}

export async function runBatchScan(urls: string[], standards?: string[]): Promise<BatchScanResult> {
  console.log(`🚀 Starting batch scan for ${urls.length} URLs`);
  const startTime = Date.now();
  
  const results = await Promise.all(
    urls.map(async (url) => {
      const urlStartTime = Date.now();
      try {
        const result = await runPuppeteerScan(url, standards);
        return {
          url,
          success: true,
          result,
          error: undefined,
          timeTaken: Date.now() - urlStartTime
        };
      } catch (error: any) {
        return {
          url,
          success: false,
          result: undefined,
          error: error.message,
          timeTaken: Date.now() - urlStartTime
        };
      }
    })
  );

  const successful = results.filter(r => r.success);
  const averageScore = successful.length > 0
    ? Math.round(successful.reduce((sum, r) => sum + (r.result?.score || 0), 0) / successful.length)
    : 0;

  return {
    results,
    summary: {
      total: urls.length,
      successful: successful.length,
      failed: results.length - successful.length,
      averageScore,
      totalTime: Date.now() - startTime
    }
  };
}

// Compare multiple URLs
export async function compareUrls(urls: string[], standards?: string[]) {
  const scanResults = await runBatchScan(urls, standards);
  
  return {
    ...scanResults,
    comparison: {
      bestScore: Math.max(...scanResults.results.filter(r => r.success).map(r => r.result?.score || 0)),
      worstScore: Math.min(...scanResults.results.filter(r => r.success).map(r => r.result?.score || 0)),
      averageScore: scanResults.summary.averageScore,
      ranked: scanResults.results
        .filter(r => r.success)
        .sort((a, b) => (b.result?.score || 0) - (a.result?.score || 0))
    }
  };
}