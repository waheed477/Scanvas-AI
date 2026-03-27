import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, getUserId, Audit } from "@shared/routes";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "wouter";

// Fetch all audits
export function useAudits() {
  return useQuery<Audit[]>({
    queryKey: ['audits'],
    queryFn: async () => {
      try {
        console.log('📡 Fetching audits...');
        const data = await api.get(api.audits.list);
        console.log('✅ Audits fetched:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('❌ Error fetching audits:', error);
        // Return empty array on error to prevent UI crash
        return [];
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single audit by ID
export function useAudit(id: string) {
  return useQuery<Audit>({
    queryKey: ['audit', id],
    queryFn: async () => {
      try {
        if (!id || id === 'undefined') {
          throw new Error('Invalid audit ID');
        }
        
        console.log('📡 Fetching audit:', id);
        const url = buildUrl('/api/audit/:id', { id });
        const data = await api.get(url);
        console.log('✅ Audit fetched:', data?.url);
        return data;
      } catch (error) {
        console.error('❌ Error fetching audit:', error);
        throw error;
      }
    },
    enabled: !!id && id !== 'undefined',
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create new audit
export function useCreateAudit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async ({ url, standards }: { url: string; standards: string[] }) => {
      try {
        // Validate input
        if (!url || url.trim() === '') {
          throw new Error('URL is required');
        }

        console.log('🚀 Creating audit for URL:', url, 'with standards:', standards || ['wcag2aa']);
        
        // Format URL if needed
        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = `https://${formattedUrl}`;
        }

        // Validate URL format
        try {
          new URL(formattedUrl);
        } catch {
          throw new Error('Invalid URL format. Please enter a valid website URL');
        }

        const data = await api.post(api.audits.create, { 
          url: formattedUrl,
          standards: standards || ['wcag2aa']
        });
        
        console.log('✅ Audit created:', data);
        
        if (!data || (!data.id && !data._id)) {
          throw new Error('Server returned no audit ID');
        }
        
        return data;
      } catch (error: any) {
        console.error('❌ Error creating audit:', error);
        
        // Show user-friendly error message
        toast({
          title: "❌ Audit Failed",
          description: error.message || "Failed to start audit. Please try again.",
          variant: "destructive",
        });
        
        throw error;
      }
    },
    onSuccess: (data) => {
      const auditId = data.id || data._id;
      console.log('🎯 Audit success, redirecting to:', auditId);
      
      // Invalidate and refetch audits list
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      
      // Show success toast
      toast({
        title: "✅ Audit Complete",
        description: `Successfully audited ${data.url}`,
      });
      
      // Redirect to audit details page
      setLocation(`/audit/${auditId}`);
    },
    onError: (error: any) => {
      // Error already shown in mutationFn, but we can log it
      console.error('Mutation error:', error);
    },
    retry: 1,
  });
}

// Delete audit (optional feature)
export function useDeleteAudit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        if (!id) throw new Error('Audit ID required');
        
        console.log('🗑️ Deleting audit:', id);
        const url = buildUrl('/api/audit/:id', { id });
        const data = await api.delete(url); // Note: You'll need to add delete method in routes.ts
        console.log('✅ Audit deleted:', data);
        return data;
      } catch (error) {
        console.error('❌ Error deleting audit:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      toast({
        title: "✅ Deleted",
        description: "Audit has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Delete Failed",
        description: error.message || "Failed to delete audit",
        variant: "destructive",
      });
    },
  });
}

// Get statistics
export function useAuditStats() {
  const { data: audits } = useAudits();
  
  const stats = {
    total: audits?.length || 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 100,
    bySeverity: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    },
  };

  if (audits && audits.length > 0) {
    const scores = audits.map(a => a.score || 0);
    stats.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    stats.bestScore = Math.max(...scores);
    stats.worstScore = Math.min(...scores);

    // Calculate total issues by severity
    audits.forEach(audit => {
      if (audit.summary) {
        stats.bySeverity.critical += audit.summary.critical || 0;
        stats.bySeverity.serious += audit.summary.serious || 0;
        stats.bySeverity.moderate += audit.summary.moderate || 0;
        stats.bySeverity.minor += audit.summary.minor || 0;
      }
    });
  }

  return stats;
}