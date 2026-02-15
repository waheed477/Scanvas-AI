import { db } from "./db";
import { audits } from "@shared/schema";
import { runAudit } from "./audit";

async function seed() {
  console.log("Seeding database...");

  try {
    // Check if audits exist
    const existing = await db.select().from(audits).limit(1);
    if (existing.length > 0) {
      console.log("Database already seeded.");
      return;
    }

    // Create a mock audit for example.com
    const mockAudit = {
      url: "https://example.com",
      score: 95,
      summary: {
        critical: 0,
        serious: 0,
        moderate: 1,
        minor: 2,
        total: 3
      },
      results: {
        violations: [
          {
            id: "html-has-lang",
            impact: "serious",
            description: "<html> element must have a lang attribute",
            help: "The <html> element must have a lang attribute",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/html-has-lang?application=axeAPI",
            nodes: [
              {
                html: "<html>",
                target: ["html"],
                failureSummary: "Fix any of the following:\n  Element does not have a lang attribute"
              }
            ]
          },
          {
            id: "landmark-one-main",
            impact: "moderate",
            description: "Document should have one main landmark",
            help: "Document should have one main landmark",
            helpUrl: "https://dequeuniversity.com/rules/axe/4.4/landmark-one-main?application=axeAPI",
            nodes: [
              {
                html: "<body>...</body>",
                target: ["body"],
                failureSummary: "Fix any of the following:\n  Document does not have a main landmark"
              }
            ]
          }
        ],
        passes: [],
        incomplete: [],
        inapplicable: []
      }
    };

    await db.insert(audits).values(mockAudit);
    console.log("Seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed().catch(console.error);
