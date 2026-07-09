import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { Loader2, ClipboardList } from "lucide-react";

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
import { WorkflowBadge } from "@/components/workflow-badge";
import { editorListMyQueue } from "@/lib/admin.functions";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/editor/queue")({
  head: () => ({
    meta: [{ title: "Menga tayinlangan" }, { name: "robots", content: "noindex" }],
  }),
  component: EditorQueue,
});

function EditorQueue() {
  const list = useServerFn(editorListMyQueue);
  const q = useQuery({ queryKey: ["editor-queue"], queryFn: () => list() });

  return (
    <AdminLayout
      title="Menga tayinlangan"
      description="Sizga tayinlangan faol maqolalar va muddatlar."
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
              <ClipboardList className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Hozircha topshiriq yo‘q</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">ID</TableHead>
                  <TableHead>Sarlavha</TableHead>
                  <TableHead className="w-28">Turi</TableHead>
                  <TableHead className="w-32">Tayinlangan</TableHead>
                  <TableHead className="w-28">Muddat</TableHead>
                  <TableHead className="w-40 text-right">Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {q.data!.map((a) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const s: any = a.submissions;
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">
                        <Link to="/submissions/$id" params={{ id: s.id }} className="hover:underline">
                          {s.manuscript_id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to="/submissions/$id"
                          params={{ id: s.id }}
                          className="font-medium hover:underline line-clamp-2"
                        >
                          {s.title || (
                            <span className="italic text-muted-foreground">Sarlavhasiz</span>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {s.article_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(a.assigned_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {a.deadline ? a.deadline : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <WorkflowBadge state={s.workflow_state as WorkflowState} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
