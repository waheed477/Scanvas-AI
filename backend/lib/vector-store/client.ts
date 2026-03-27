import { Db } from 'mongodb';
import { getDb } from '../db';

export interface IssueDocument {
  _id?: any;
  text: string;
  metadata: {
    issueId: string;
    impact: string;
    helpUrl?: string;
    ruleId: string;
  };
}

export async function getIssuesCollection() {
  const db = getDb();
  return db.collection<IssueDocument>('issues');
}

export async function addIssueToStore(issue: any) {
  try {
    const collection = await getIssuesCollection();
    
    const text = `${issue.help || ''}: ${issue.description || ''}`.trim();
    if (!text) return;

    const doc: IssueDocument = {
      text,
      metadata: {
        issueId: issue.id,
        impact: issue.impact || 'unknown',
        helpUrl: issue.helpUrl,
        ruleId: issue.id,
      },
    };

    await collection.updateOne(
      { 'metadata.issueId': issue.id },
      { $set: doc },
      { upsert: true }
    );
    
    console.log('✅ Issue added to store:', issue.id);
  } catch (error) {
    console.error('❌ Failed to add issue:', error);
  }
}