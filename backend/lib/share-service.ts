import { getDb } from './mongodb';
import { randomBytes } from 'crypto';

export interface SharedReport {
  shareId: string;
  auditId: string;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  password?: string;
  isPublic: boolean;
}

export async function createShareLink(auditId: string, options?: {
  expiresIn?: number; // hours
  password?: string;
  isPublic?: boolean;
}): Promise<string> {
  const db = await getDb();
  
  // Generate unique share ID
  const shareId = randomBytes(8).toString('hex');
  
  // Set expiration (default 7 days)
  const expiresIn = options?.expiresIn || 7 * 24; // 7 days in hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresIn);
  
  const shareData: SharedReport = {
    shareId,
    auditId,
    createdAt: new Date(),
    expiresAt,
    views: 0,
    password: options?.password,
    isPublic: options?.isPublic ?? true
  };
  
  await db.collection('shared_reports').insertOne(shareData);
  
  return shareId;
}

export async function getSharedReport(shareId: string, password?: string): Promise<any> {
  const db = await getDb();
  
  // Find share record
  const share = await db.collection('shared_reports').findOne({ shareId });
  
  if (!share) {
    throw new Error('Share link not found');
  }
  
  // Check expiration
  if (new Date() > new Date(share.expiresAt)) {
    throw new Error('Share link has expired');
  }
  
  // Check password if required
  if (share.password && share.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Increment view count
  await db.collection('shared_reports').updateOne(
    { shareId },
    { $inc: { views: 1 } }
  );
  
  // Get the actual audit
  const audit = await db.collection('audits').findOne({ 
    _id: new ObjectId(share.auditId) 
  });
  
  if (!audit) {
    throw new Error('Audit not found');
  }
  
  return {
    ...audit,
    shareInfo: {
      views: share.views + 1,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt
    }
  };
}

export async function getShareStats(shareId: string): Promise<any> {
  const db = await getDb();
  
  const share = await db.collection('shared_reports').findOne({ shareId });
  
  if (!share) {
    throw new Error('Share link not found');
  }
  
  return {
    shareId: share.shareId,
    views: share.views,
    createdAt: share.createdAt,
    expiresAt: share.expiresAt,
    isExpired: new Date() > new Date(share.expiresAt)
  };
}

export async function revokeShareLink(shareId: string): Promise<void> {
  const db = await getDb();
  await db.collection('shared_reports').deleteOne({ shareId });
}