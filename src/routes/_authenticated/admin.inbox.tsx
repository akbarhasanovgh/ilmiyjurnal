import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Loader2, FileText } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkflowBadge } from "@/components/workflow-badge";
import { adminListInbox } from "@/lib/admin.functions";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  head: () => ({
    meta: [{ title: "Tahririyat qutisi — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Inbox,
});

function Inbox() {
  const list = useServerFn(adminListInbox);
  const q = useQuery({ queryKey: ["admin-inbox"], queryFn: () => list() });

  const [term, setTerm] = useState("");
  const [state, setState] = useState<string>("all");

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const t = term.trim().toLowerCase();
    return rows.filter((r) => {
      if (state !== "all" && r.workflow_state !== state) return false;
      if (!t) return true;
      return (
        (r.title ?? "").toLowerCase().includes(t) ||
        (r.manuscript_id ?? "").toLowerCase().includes(t) ||
        (r.owner?.full_name ?? "").toLowerCase().includes(t) ||
        (r.owner?.email ?? "").toLowerCase().includes(t)
      );
    });
  }, [q.data, term, state]);

  const totalByState = useMemo(() => {
    const rows = q.data ?? [];
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.workflow_state] = (counts[r.workflow_state] ?? 0) + 1;
    return counts;
  }, [q.data]);

  return (
    <AdminLayout
      title="Tahririyat qutisi"
      description="Faol tahririyat jarayonidagi barcha maqolalar."
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sarlavha, ID yoki muallif…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Holat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha holatlar</SelectItem>
              <SelectItem value="submitted">Yuborilgan</SelectItem>
              <SelectItem value="screening">Ko‘rib chiqilmoqda</SelectItem>
              <SelectItem value="editor_assigned">Muharrir tayinlangan</SelectItem>
              <SelectItem value="under_review">Taqrizda</SelectItem>
              <SelectItem value="revision_requested">Qayta ishlash so‘ralgan</SelectItem>
              <SelectItem value="revised">Qayta ishlangan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {q.error ? (
          <Card>
            <CardContent className="py-6 text-sm text-destructive">
              {(q.error as Error).message}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-0">
            {q.isPending ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Maqolalar topilmadi</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">ID</TableHead>
                    <TableHead>Sarlavha</TableHead>
                    <TableHead>Muallif</TableHead>
                    <TableHead className="w-32">Turi</TableHead>
                    <TableHead className="w-32">Yuborilgan</TableHead>
                    <TableHead className="w-44 text-right">Holat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} className="cursor-pointer">
                      <TableCell className="font-mono text-xs">
                        <Link
                          to="/submissions/$id"
                          params={{ id: s.id }}
                          className="hover:underline"
                        >
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
                      <TableCell className="text-sm">
                        <p className="truncate max-w-[180px]">
                          {s.owner?.full_name || s.owner?.email || "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {s.article_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.submitted_at ? format(new Date(s.submitted_at), "dd MMM yyyy") : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <WorkflowBadge state={s.workflow_state as WorkflowState} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "submitted", label: "Yuborilgan" },
            { key: "under_review", label: "Taqrizda" },
            { key: "revision_requested", label: "Qayta ishlash" },
            { key: "editor_assigned", label: "Muharrirda" },
          ].map((k) => (
            <Card key={k.key}>
              <CardContent className="pt-5 text-center">
                <p className="text-2xl font-bold">{totalByState[k.key] ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
