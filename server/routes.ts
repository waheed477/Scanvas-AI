import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { runAudit } from "./audit"; // We will create this

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.audits.create.path, async (req, res) => {
    try {
      const { url } = api.audits.create.input.parse(req.body);
      
      // Run the audit
      const auditResult = await runAudit(url);

      const audit = await storage.createAudit({
        url,
        score: auditResult.score,
        results: auditResult.results,
        summary: auditResult.summary,
      });

      res.status(201).json(audit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Audit error:", err);
      res.status(500).json({ message: "Failed to perform audit. " + (err instanceof Error ? err.message : String(err)) });
    }
  });

  app.get(api.audits.list.path, async (req, res) => {
    const audits = await storage.getAudits();
    res.json(audits);
  });

  app.get(api.audits.get.path, async (req, res) => {
    const audit = await storage.getAudit(Number(req.params.id));
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    res.json(audit);
  });

  return httpServer;
}
