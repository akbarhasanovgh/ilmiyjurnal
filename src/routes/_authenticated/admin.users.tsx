import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { EditorialShell } from "@/components/editorial-shell";
import {
  adminListUsers,
  adminListRoles,
  adminGrantRole,
  adminRevokeRole,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Foydalanuvchilar" }, { name: "robots", content: "noindex" }] }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const listUsers = useServerFn(adminListUsers);
  const listRoles = useServerFn(adminListRoles);
  const grant = useServerFn(adminGrantRole);
  const revoke = useServerFn(adminRevokeRole);
  const qc = useQueryClient();

  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => listUsers() });
  const roles = useQuery({ queryKey: ["admin-roles"], queryFn: () => listRoles() });

  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const list = users.data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (u) =>
        (u.full_name ?? "").toLowerCase().includes(term) ||
        (u.email ?? "").toLowerCase().includes(term) ||
        (u.roles ?? []).some((r) => r.name.toLowerCase().includes(term)),
    );
  }, [users.data, q]);

  const grantMut = useMutation({
    mutationFn: (v: { user_id: string; role_id: string }) => grant({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const revokeMut = useMutation({
    mutationFn: (v: { user_id: string; role_id: string }) => revoke({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const error = users.error ?? roles.error;

  return (
    <EditorialShell>
      <div className="p-8 md:p-12 max-w-6xl">
        <div className="mb-10">
          <p className="label-mono">Admin</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">Foydalanuvchilar va rollar</h1>
          <p className="text-sm text-ink-muted mt-2 max-w-lg">
            Ro‘yxatdan o‘tgan foydalanuvchilarni ko‘ring va ularga tahririyat rollarini bering yoki olib
            tashlang.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ism, email yoki rol bo‘yicha qidiring…"
            className="w-full max-w-sm border border-rule bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-ink"
          />
          <span className="label-mono">
            {filtered.length} / {users.data?.length ?? 0}
          </span>
        </div>

        {error ? (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        ) : users.isPending || roles.isPending ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-sunken animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-rule p-12 text-center">
            <p className="label-mono">Bo‘sh</p>
            <p className="font-serif text-2xl mt-3">Foydalanuvchi topilmadi</p>
          </div>
        ) : (
          <div className="divide-y divide-rule border-y border-rule">
            {filtered.map((u) => {
              const userRoleIds = new Set((u.roles ?? []).map((r) => r.id));
              return (
                <div key={u.id} className="py-5 grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5">
                    <p className="text-base font-medium leading-snug">
                      {u.full_name || <span className="italic text-ink-faint">Ismsiz</span>}
                    </p>
                    <p className="text-xs text-ink-muted mt-1">{u.email}</p>
                    {u.institution_text ? (
                      <p className="text-xs text-ink-faint mt-0.5">{u.institution_text}</p>
                    ) : null}
                  </div>

                  <div className="col-span-4">
                    {(u.roles ?? []).length === 0 ? (
                      <p className="label-mono text-ink-faint">Muallif (standart)</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              if (confirm(`"${r.name}" rolini olib tashlaysizmi?`)) {
                                revokeMut.mutate({ user_id: u.id, role_id: r.id });
                              }
                            }}
                            disabled={revokeMut.isPending}
                            className="label-mono border border-rule px-2 py-0.5 hover:border-ink hover:text-destructive transition-colors group"
                            title="Olib tashlash uchun bosing"
                          >
                            {r.name}
                            <span className="ml-1 opacity-40 group-hover:opacity-100">×</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        const role_id = e.target.value;
                        e.currentTarget.value = "";
                        if (role_id) grantMut.mutate({ user_id: u.id, role_id });
                      }}
                      disabled={grantMut.isPending}
                      className="label-mono border border-rule bg-transparent px-2 py-1 focus:outline-none focus:border-ink"
                    >
                      <option value="">+ Rol berish</option>
                      {(roles.data ?? [])
                        .filter((r) => !userRoleIds.has(r.id))
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(grantMut.error || revokeMut.error) && (
          <p className="mt-4 text-sm text-destructive">
            {((grantMut.error ?? revokeMut.error) as Error).message}
          </p>
        )}
      </div>
    </EditorialShell>
  );
}
