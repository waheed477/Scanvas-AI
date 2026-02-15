import { db } from "./db";
import { audits, type InsertAudit, type Audit } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createAudit(audit: InsertAudit): Promise<Audit>;
  getAudit(id: number): Promise<Audit | undefined>;
  getAudits(): Promise<Audit[]>;
}

export class DatabaseStorage implements IStorage {
  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const [audit] = await db
      .insert(audits)
      .values(insertAudit)
      .returning();
    return audit;
  }

  async getAudit(id: number): Promise<Audit | undefined> {
    const [audit] = await db
      .select()
      .from(audits)
      .where(eq(audits.id, id));
    return audit;
  }

  async getAudits(): Promise<Audit[]> {
    return await db
      .select()
      .from(audits)
      .orderBy(desc(audits.createdAt));
  }
}

export const storage = new DatabaseStorage();
