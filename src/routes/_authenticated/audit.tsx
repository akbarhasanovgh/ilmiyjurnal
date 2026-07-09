import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn, createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { format } from "date-fns";
import { Loader2, History } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({ meta: [{ title: "Audit jurnali" }, { name: "robots", content: "noindex" }] }),
  component: Audit,
});

function Audit() {
  const list = useServerFn(listAuditLog);
  const q = useQuery({ queryKey: ["audit-log"], queryFn: () => list() });

  return (
    <AdminLayout
      title="Audit jurnali"
      description="Barcha muhim amallar shu yerda qayd etiladi. Yozuvlar o‘zgartirilmaydi."
    >
      <Card>
        <CardContent className="p-0">
          {q.isPending ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : q.error ? (
            <div className="p-6 text-sm text-destructive">{(q.error as Error).message}</div>
          ) : (q.data ?? []).length === 0 ? (
            <div className="text-center py-16">
              <History className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Hali yozuvlar yo‘q</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-44">Vaqt</TableHead>
                  <TableHead className="w-56">Amal</TableHead>
                  <TableHead className="w-36">Turi</TableHead>
                  <TableHead>Resurs ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {q.data!.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {format(new Date(r.created_at), "dd MMM yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs font-normal">
                        {r.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.resource_type}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono truncate">
                      {r.resource_id ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
