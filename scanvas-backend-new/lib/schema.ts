import { ObjectId } from 'mongodb';

export interface Audit {
  _id?: ObjectId;
  url: string;
  score: number;
  results: any;
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    total: number;
  };
  userId: string;
  createdAt: Date;
}

export type NewAudit = Omit<Audit, '_id' | 'createdAt'> & {
  createdAt?: Date;
};