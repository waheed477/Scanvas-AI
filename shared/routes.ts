import { z } from 'zod';
import { insertAuditSchema, audits } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  audits: {
    create: {
      method: 'POST' as const,
      path: '/api/audits' as const,
      input: z.object({
        url: z.string().url(),
      }),
      responses: {
        201: z.custom<typeof audits.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/audits' as const,
      responses: {
        200: z.array(z.custom<typeof audits.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/audits/:id' as const,
      responses: {
        200: z.custom<typeof audits.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AuditResponse = z.infer<typeof api.audits.get.responses[200]>;
export type AuditListResponse = z.infer<typeof api.audits.list.responses[200]>;
