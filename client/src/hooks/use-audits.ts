import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type AuditResponse, type AuditListResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useAudits() {
  return useQuery({
    queryKey: [api.audits.list.path],
    queryFn: async () => {
      const res = await fetch(api.audits.list.path);
      if (!res.ok) throw new Error("Failed to fetch audits");
      return api.audits.list.responses[200].parse(await res.json());
    },
  });
}

export function useAudit(id: number) {
  return useQuery({
    queryKey: [api.audits.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.audits.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch audit details");
      return api.audits.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateAudit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (url: string) => {
      // Validate locally first
      const validatedInput = api.audits.create.input.parse({ url });

      const res = await fetch(api.audits.create.path, {
        method: api.audits.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.audits.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to start audit");
      }

      return api.audits.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.audits.list.path] });
      toast({
        title: "Audit Complete",
        description: `Successfully audited ${data.url}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Audit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
