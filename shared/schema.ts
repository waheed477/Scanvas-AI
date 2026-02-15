import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  score: integer("score").notNull(),
  results: jsonb("results").notNull(), // Stores the full axe-core result object
  summary: jsonb("summary").notNull(), // Stores a summarized version for list views
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditSchema = createInsertSchema(audits).omit({ 
  id: true, 
  createdAt: true 
});

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = z.infer<typeof insertAuditSchema>;

// Helper types for the JSONB structures
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
