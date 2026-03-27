export interface BenchmarkData {
  category: string;
  averageScore: number;
  topPercentile: number;
  bottomPercentile: number;
  sampleSize: number;
}

export const industryBenchmarks: BenchmarkData[] = [
  {
    category: "E-commerce",
    averageScore: 72,
    topPercentile: 88,
    bottomPercentile: 45,
    sampleSize: 1250
  },
  {
    category: "News & Media",
    averageScore: 68,
    topPercentile: 84,
    bottomPercentile: 42,
    sampleSize: 890
  },
  {
    category: "Government",
    averageScore: 58,
    topPercentile: 76,
    bottomPercentile: 35,
    sampleSize: 450
  },
  {
    category: "Education",
    averageScore: 65,
    topPercentile: 82,
    bottomPercentile: 40,
    sampleSize: 620
  },
  {
    category: "Healthcare",
    averageScore: 62,
    topPercentile: 79,
    bottomPercentile: 38,
    sampleSize: 380
  },
  {
    category: "Technology",
    averageScore: 75,
    topPercentile: 91,
    bottomPercentile: 48,
    sampleSize: 2100
  },
  {
    category: "Finance",
    averageScore: 70,
    topPercentile: 86,
    bottomPercentile: 44,
    sampleSize: 560
  },
  {
    category: "Travel & Hospitality",
    averageScore: 66,
    topPercentile: 81,
    bottomPercentile: 41,
    sampleSize: 310
  }
];

export function getBenchmarkForUrl(url: string): BenchmarkData {
  // Simple category detection based on URL
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('shop') || urlLower.includes('store') || urlLower.includes('amazon') || urlLower.includes('ebay')) {
    return industryBenchmarks.find(b => b.category === "E-commerce")!;
  }
  if (urlLower.includes('news') || urlLower.includes('bbc') || urlLower.includes('cnn') || urlLower.includes('times')) {
    return industryBenchmarks.find(b => b.category === "News & Media")!;
  }
  if (urlLower.includes('gov') || urlLower.includes('govt') || urlLower.includes('state') || urlLower.includes('federal')) {
    return industryBenchmarks.find(b => b.category === "Government")!;
  }
  if (urlLower.includes('edu') || urlLower.includes('school') || urlLower.includes('university') || urlLower.includes('college')) {
    return industryBenchmarks.find(b => b.category === "Education")!;
  }
  if (urlLower.includes('health') || urlLower.includes('hospital') || urlLower.includes('medical') || urlLower.includes('clinic')) {
    return industryBenchmarks.find(b => b.category === "Healthcare")!;
  }
  if (urlLower.includes('tech') || urlLower.includes('github') || urlLower.includes('software') || urlLower.includes('app')) {
    return industryBenchmarks.find(b => b.category === "Technology")!;
  }
  if (urlLower.includes('bank') || urlLower.includes('finance') || urlLower.includes('invest') || urlLower.includes('capital')) {
    return industryBenchmarks.find(b => b.category === "Finance")!;
  }
  if (urlLower.includes('travel') || urlLower.includes('hotel') || urlLower.includes('vacation') || urlLower.includes('trip')) {
    return industryBenchmarks.find(b => b.category === "Travel & Hospitality")!;
  }
  
  // Default to technology (most common)
  return industryBenchmarks.find(b => b.category === "Technology")!;
}