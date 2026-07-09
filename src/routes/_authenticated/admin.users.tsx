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
      <div className="space-y-5">
        {/* Toolbar shell */}
        <div className="rounded-3xl bg-muted/30 border border-border/60 p-3">
          <div className="flex flex-col sm:flex-row gap-2.5 mb-3 px-1 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ism, email, muassasa bo‘yicha qidirish…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-11 h-11 rounded-full bg-background border-transparent shadow-sm focus-visible:border-border text-[14.5px]"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-56 h-11 rounded-full bg-background border-transparent shadow-sm text-[13.5px]">
                <span className="text-muted-foreground mr-1">Rol:</span>
                <SelectValue placeholder="Barchasi" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
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
            <div className="mb-3 rounded-2xl bg-destructive/5 border border-destructive/20 py-3 px-4 text-sm text-destructive">
              {(error as Error).message}
            </div>
          ) : null}

          {/* Table */}
          <div className="rounded-2xl bg-background border border-border/50 overflow-hidden">
            {users.isPending || roles.isPending ? (
              <div className="flex items-center justify-center py-20">
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
                                    onClick={() =>
                                      setPendingRevoke({
                                        user_id: u.id,
                                        role_id: r.id,
                                        role_name: r.name,
                                        user_label: u.full_name || u.email || "",
                                      })
                                    }
                                    disabled={revokeMut.isPending}
                                    className="rounded-full hover:bg-background/40 transition-colors p-0.5"
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
                            <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-transparent hover:bg-muted/70 transition-colors">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <UserPlus className="h-3.5 w-3.5" />
                                <SelectValue placeholder="Rol qo‘shish" />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
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
              <div className="text-center py-20 animate-fade-in">
                <p className="text-[15px] font-medium">Foydalanuvchi topilmadi</p>
                <p className="text-sm text-muted-foreground mt-1">Filtrlarni tozalab ko‘ring</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 text-xs text-muted-foreground">
            {filtered.length} ta ko‘rsatilmoqda
            {filtered.length !== (users.data ?? []).length
              ? ` · jami ${(users.data ?? []).length}`
              : ""}
          </div>
        </div>

        {(grantMut.error || revokeMut.error) && (
          <p className="text-sm text-destructive px-1">
            {((grantMut.error ?? revokeMut.error) as Error).message}
          </p>
        )}


        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-3xl border-border/60 shadow-sm transition-transform hover:-translate-y-0.5">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-violet-500" />
              </div>
              <p className="text-3xl font-semibold tracking-tight">{totals.total}</p>
              <p className="text-sm text-muted-foreground mt-1">Jami foydalanuvchilar</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/60 shadow-sm transition-transform hover:-translate-y-0.5">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-semibold tracking-tight">{totals.staff}</p>
              <p className="text-sm text-muted-foreground mt-1">Tahririyat xodimlari</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/60 shadow-sm transition-transform hover:-translate-y-0.5">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-semibold tracking-tight">{totals.admins}</p>
              <p className="text-sm text-muted-foreground mt-1">Administratorlar</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={pendingRevoke !== null}
        onOpenChange={(o) => !o && setPendingRevoke(null)}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl tracking-tight">
              Rolni olib tashlash?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[14.5px]">
              {pendingRevoke ? (
                <>
                  <span className="font-medium text-foreground">"{pendingRevoke.role_name}"</span>{" "}
                  rolini{" "}
                  <span className="font-medium text-foreground">{pendingRevoke.user_label}</span>{" "}
                  dan olib tashlaysizmi? Bu amalni bekor qilib bo‘lmaydi.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full h-11 px-6">Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRevoke) {
                  revokeMut.mutate({
                    user_id: pendingRevoke.user_id,
                    role_id: pendingRevoke.role_id,
                  });
                  setPendingRevoke(null);
                }
              }}
              className="rounded-full h-11 px-6 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Olib tashlash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
