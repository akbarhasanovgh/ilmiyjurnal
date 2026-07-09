import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { Search, Loader2, Users as UsersIcon, Shield, UserPlus, X } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  adminListUsers,
  adminListRoles,
  adminGrantRole,
  adminRevokeRole,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [{ title: "Foydalanuvchilar — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminUsersPage,
});

function initials(name: string | null, email: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

function AdminUsersPage() {
  const listUsers = useServerFn(adminListUsers);
  const listRoles = useServerFn(adminListRoles);
  const grant = useServerFn(adminGrantRole);
  const revoke = useServerFn(adminRevokeRole);
  const qc = useQueryClient();

  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => listUsers() });
  const roles = useQuery({ queryKey: ["admin-roles"], queryFn: () => listRoles() });

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pendingRevoke, setPendingRevoke] = useState<{
    user_id: string;
    role_id: string;
    role_name: string;
    user_label: string;
  } | null>(null);

  const grantMut = useMutation({
    mutationFn: (v: { user_id: string; role_id: string }) => grant({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const revokeMut = useMutation({
    mutationFn: (v: { user_id: string; role_id: string }) => revoke({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const filtered = useMemo(() => {
    const list = users.data ?? [];
    const term = q.trim().toLowerCase();
    return list.filter((u) => {
      if (roleFilter !== "all") {
        const has = (u.roles ?? []).some((r) => r.key === roleFilter);
        const isPlainAuthor = (u.roles ?? []).length === 0;
        if (roleFilter === "author" ? !isPlainAuthor : !has) return false;
      }
      if (!term) return true;
      return (
        (u.full_name ?? "").toLowerCase().includes(term) ||
        (u.email ?? "").toLowerCase().includes(term) ||
        (u.institution_text ?? "").toLowerCase().includes(term) ||
        (u.country ?? "").toLowerCase().includes(term)
      );
    });
  }, [users.data, q, roleFilter]);

  const totals = useMemo(() => {
    const list = users.data ?? [];
    const staff = list.filter((u) =>
      (u.roles ?? []).some((r) =>
        ["editor", "managing_editor", "administrator", "super_admin"].includes(r.key),
      ),
    ).length;
    const admins = list.filter((u) =>
      (u.roles ?? []).some((r) => ["administrator", "super_admin"].includes(r.key)),
    ).length;
    return { total: list.length, staff, admins };
  }, [users.data]);

  const error = users.error ?? roles.error;

  return (
    <AdminLayout
      title="Foydalanuvchilar boshqaruvi"
      description="Ro‘yxatdan o‘tgan foydalanuvchilar va ularga tayinlangan rollar."
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ism, email, muassasa bo‘yicha qidirish…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Rol bo‘yicha filtr" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha rollar</SelectItem>
              <SelectItem value="author">Muallif (standart)</SelectItem>
              {(roles.data ?? []).map((r) => (
                <SelectItem key={r.id} value={r.key}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error */}
        {error ? (
          <Card>
            <CardContent className="py-6 text-sm text-destructive">
              {(error as Error).message}
            </CardContent>
          </Card>
        ) : null}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {users.isPending || roles.isPending ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Muassasa</TableHead>
                    <TableHead>Rollar</TableHead>
                    <TableHead className="w-56">Rol berish</TableHead>
                    <TableHead className="w-32">Ro‘yxatdan o‘tgan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => {
                    const userRoleIds = new Set((u.roles ?? []).map((r) => r.id));
                    const isAdmin = (u.roles ?? []).some((r) =>
                      ["administrator", "super_admin"].includes(r.key),
                    );
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback className="text-xs font-medium">
                                {initials(u.full_name, u.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium truncate flex items-center gap-1.5">
                                {u.full_name || (
                                  <span className="italic text-muted-foreground">Ismsiz</span>
                                )}
                                {isAdmin ? (
                                  <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                                ) : null}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="truncate max-w-[220px]">{u.institution_text || "—"}</p>
                            {u.country ? (
                              <p className="text-xs text-muted-foreground truncate">{u.country}</p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          {(u.roles ?? []).length === 0 ? (
                            <Badge variant="secondary" className="font-normal">
                              Muallif
                            </Badge>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                              {u.roles.map((r) => (
                                <Badge
                                  key={r.id}
                                  variant={
                                    ["administrator", "super_admin"].includes(r.key)
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="font-normal gap-1 pr-1"
                                >
                                  {r.name}
                                  <button
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `"${r.name}" rolini ${u.full_name || u.email} dan olib tashlaysizmi?`,
                                        )
                                      ) {
                                        revokeMut.mutate({ user_id: u.id, role_id: r.id });
                                      }
                                    }}
                                    disabled={revokeMut.isPending}
                                    className="rounded-sm hover:bg-background/40 transition-colors"
                                    title="Rolni olib tashlash"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value=""
                            onValueChange={(role_id) => {
                              if (role_id) grantMut.mutate({ user_id: u.id, role_id });
                            }}
                            disabled={grantMut.isPending}
                          >
                            <SelectTrigger className="h-9">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <UserPlus className="h-3.5 w-3.5" />
                                <SelectValue placeholder="Rol qo‘shish" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {(roles.data ?? [])
                                .filter((r) => !userRoleIds.has(r.id))
                                .map((r) => (
                                  <SelectItem key={r.id} value={r.id}>
                                    {r.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.created_at ? format(new Date(u.created_at), "dd MMM yyyy") : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Foydalanuvchi topilmadi
              </div>
            )}
          </CardContent>
        </Card>

        {(grantMut.error || revokeMut.error) && (
          <p className="text-sm text-destructive">
            {((grantMut.error ?? revokeMut.error) as Error).message}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <UsersIcon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-3xl font-bold">{totals.total}</p>
              <p className="text-sm text-muted-foreground">Jami foydalanuvchilar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <UserPlus className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-3xl font-bold">{totals.staff}</p>
              <p className="text-sm text-muted-foreground">Tahririyat xodimlari</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{totals.admins}</p>
              <p className="text-sm text-muted-foreground">Administratorlar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
