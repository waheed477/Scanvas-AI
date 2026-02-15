import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@shared/routes";
import { format } from "date-fns";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  
  const { data: audits, isLoading } = useQuery({
    queryKey: [api.audits.list.path],
  });

  const filteredAudits = audits?.filter(audit => 
    audit.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit History</h1>
          <p className="text-muted-foreground">View and compare your past accessibility scans.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search URLs..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : filteredAudits && filteredAudits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website URL</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {audit.url}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          audit.score >= 90 ? "bg-green-500" : 
                          audit.score >= 50 ? "bg-yellow-500 text-black" : 
                          "bg-red-500"
                        }
                      >
                        {audit.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(audit.summary as any).total} issues
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(audit.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/audit/${audit.id}`}>View Report</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-20 space-y-4">
              <p className="text-muted-foreground text-lg">No audits found.</p>
              <Button asChild>
                <Link href="/">Run your first scan</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Inline Button import since it's used as child and might be missing from local imports
import { Button } from "@/components/ui/button";
