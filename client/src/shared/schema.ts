import { z } from "zod";

// Audit type for frontend
export interface Audit {
  id?: string;
  _id?: string;
  url: string;
  score: number;
  results?: AuditResult;
  summary: AuditSummary;
  createdAt: string;
  error?: string;
  standards?: string[];
}

// Insert audit schema (for API requests)
export const insertAuditSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type InsertAudit = z.infer<typeof insertAuditSchema>;

// Audit result types
export interface AuditResult {
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
      failureSummary?: string;
    }>;
  }>;
  passes: Array<any>;
  incomplete: Array<any>;
  inapplicable: Array<any>;
}

export interface AuditSummary {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  total: number;
}

// User type (for future auth)
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

// Shared API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}