import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  ShieldCheck, ShieldAlert, Check, X, RefreshCw, Loader2, Users as UsersIcon,
  Store, ShoppingBag, Tag, FileText, Sparkles, Settings, Globe, Database,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Role = "admin" | "editor" | "reviewer" | "none";
type AccessLevel = "admin" | "editor" | "reviewer";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  roles: string[];
};

type Section = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  access: AccessLevel;
  to: string;
};

// Permission matrix — derived from existing RLS policies in the database
const SECTIONS: Section[] = [
  { key: "stores", label: "المحلات والوحدات", description: "إدارة بطاقات المحلات والوحدات والأصول.", icon: Store, access: "editor", to: "/admin/stores" },
  { key: "products", label: "المنتجات والفئات", description: "كتالوج المنتجات والتصنيفات.", icon: ShoppingBag, access: "editor", to: "/admin/products" },
  { key: "offers", label: "مسار العروض", description: "مراجعة واعتماد العروض (متاح للمراجع).", icon: Tag, access: "reviewer", to: "/admin/offers" },
  { key: "social", label: "عروض السوشيال", description: "مراجعة منشورات السوشيال (متاح للمراجع).", icon: Globe, access: "reviewer", to: "/admin/social-offers" },
  { key: "content", label: "المدونة والفعاليات", description: "المحتوى التحريري والفعاليات والوظائف.", icon: FileText, access: "editor", to: "/admin/blog" },
  { key: "campaigns", label: "أدر واربح والمكافآت", description: "الحملات والجوائز والمتاجر المشاركة.", icon: Sparkles, access: "editor", to: "/admin/spin-system" },
  { key: "leads", label: "العملاء المحتملون", description: "نماذج التواصل والاستفسارات.", icon: UsersIcon, access: "admin", to: "/admin/leads" },
  { key: "seo", label: "SEO والفهرسة", description: "التدقيق وسجلات IndexNow.", icon: Globe, access: "admin", to: "/admin/seo-audit" },
  { key: "users", label: "مستخدمو الأدمن", description: "إدارة الأعضاء والصلاحيات.", icon: UsersIcon, access: "admin", to: "/admin/users" },
  { key: "settings", label: "الإعدادات والنظام", description: "إعدادات الموقع، النسخ، السجلات، قاعدة البيانات.", icon: Settings, access: "admin", to: "/admin/settings" },
  { key: "database", label: "قاعدة البيانات والسجلات", description: "Edge Functions والنسخ الاحتياطية والتدقيق.", icon: Database, access: "admin", to: "/admin/database" },
];

const ROLE_LABEL: Record<Role, string> = { admin: "مسؤول", editor: "محرر", reviewer: "مراجع", none: "بدون" };

function roleOf(u: AdminUser): Role {
  if (u.roles.includes("admin")) return "admin";
  if (u.roles.includes("editor")) return "editor";
  if (u.roles.includes("reviewer")) return "reviewer";
  return "none";
}

function hasAccess(role: Role, level: AccessLevel) {
  if (role === "admin") return true;
  if (role === "editor" && (level === "editor" || level === "reviewer")) return true;
  if (role === "reviewer" && level === "reviewer") return true;
  return false;
}

export default function AdminRoles() {
  const auth = useRequireAdmin();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"matrix" | "assignments" | "reference">("matrix");

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-users"],
    enabled: auth.isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error) throw error;
      return (data?.users ?? []) as AdminUser[];
    },
  });

  const setRoleMut = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: Role }) => {
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "set_role", user_id, role },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("تم تحديث الصلاحية");
    },
    onError: (e: any) => toast.error(e.message ?? "تعذّر تحديث الصلاحية"),
  });

  const users = useMemo(() => {
    const list = data ?? [];
    return list
      .filter((u) => (search ? (u.email ?? "").toLowerCase().includes(search.toLowerCase()) : true))
      .sort((a, b) => {
        const ra = roleOf(a), rb = roleOf(b);
        const order: Record<Role, number> = { admin: 0, editor: 1, reviewer: 2, none: 3 };
        return order[ra] - order[rb];
      });
  }, [data, search]);

  const counts = useMemo(() => {
    const list = data ?? [];
    return {
      total: list.length,
      admins: list.filter((u) => roleOf(u) === "admin").length,
      editors: list.filter((u) => roleOf(u) === "editor").length,
      reviewers: list.filter((u) => roleOf(u) === "reviewer").length,
      none: list.filter((u) => roleOf(u) === "none").length,
    };
  }, [data]);

  if (!auth.isAdmin) return null;

  return (
    <AdminShell>
      <div className="p-4 md:p-6 space-y-5">
        <AdminPageHeader
          title="الأدوار والصلاحيات"
          subtitle="مصفوفة الوصول لكل قسم في لوحة التحكم — تعيين الأدوار بسرعة لكل عضو."
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`w-4 h-4 ml-1 ${isFetching ? "animate-spin" : ""}`} /> تحديث
              </Button>
              <Link to="/admin/users">
                <Button size="sm" variant="default">
                  <UsersIcon className="w-4 h-4 ml-1" /> إدارة المستخدمين
                </Button>
              </Link>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="إجمالي الأعضاء" value={counts.total} icon={UsersIcon} tone="neutral" />
          <StatCard label="مسؤولون" value={counts.admins} icon={ShieldCheck} tone="primary" />
          <StatCard label="محررون" value={counts.editors} icon={FileText} tone="success" />
          <StatCard label="بدون صلاحية" value={counts.none} icon={ShieldAlert} tone="danger" />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="matrix">مصفوفة الوصول</TabsTrigger>
            <TabsTrigger value="assignments">تعيين الأدوار</TabsTrigger>
            <TabsTrigger value="reference">دليل الصلاحيات</TabsTrigger>
          </TabsList>

          {/* MATRIX: users x sections */}
          <TabsContent value="matrix" className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="بحث بالبريد..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-lg border border-border bg-card overflow-x-auto">
              {isLoading ? (
                <div className="p-10 grid place-items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : users.length === 0 ? (
                <AdminEmptyState title="لا يوجد مستخدمون" description="ادعُ عضوًا من صفحة المستخدمين." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px] sticky right-0 bg-card">العضو</TableHead>
                      <TableHead className="min-w-[140px]">الدور</TableHead>
                      {SECTIONS.map((s) => (
                        <TableHead key={s.key} className="text-center min-w-[110px]">
                          <div className="flex flex-col items-center gap-1">
                            <s.icon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-[11px] font-normal leading-tight">{s.label}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => {
                      const role = roleOf(u);
                      const isSelf = u.id === auth.user?.id;
                      return (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium sticky right-0 bg-card">
                            <div className="flex flex-col">
                              <span className="text-sm">{u.email ?? "—"}</span>
                              {isSelf && <span className="text-[10px] text-muted-foreground">(أنت)</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={role}
                              onValueChange={(v) => setRoleMut.mutate({ user_id: u.id, role: v as Role })}
                              disabled={isSelf || setRoleMut.isPending}
                            >
                              <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">مسؤول</SelectItem>
                                <SelectItem value="editor">محرر</SelectItem>
                                <SelectItem value="none">بدون</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {SECTIONS.map((s) => (
                            <TableCell key={s.key} className="text-center">
                              {hasAccess(role, s.access) ? (
                                <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 text-primary items-center justify-center" title="مسموح">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="inline-flex w-6 h-6 rounded-full bg-muted text-muted-foreground/60 items-center justify-center" title="غير مسموح">
                                  <X className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ASSIGNMENTS: per-section quick assigner */}
          <TabsContent value="assignments" className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {SECTIONS.map((s) => {
                const eligible = (data ?? []).filter((u) => hasAccess(roleOf(u), s.access));
                return (
                  <div key={s.key} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-md bg-primary/10 grid place-items-center shrink-0">
                          <s.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <Link to={s.to} className="text-sm font-bold hover:text-primary">{s.label}</Link>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>
                        </div>
                      </div>
                      <AdminStatusBadge tone={s.access === "admin" ? "danger" : "success"}>
                        {s.access === "admin" ? "مسؤول فقط" : "محرر+مسؤول"}
                      </AdminStatusBadge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>أعضاء لديهم وصول: <strong className="text-foreground">{eligible.length}</strong></span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {eligible.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground">لا أحد بعد.</span>
                      ) : (
                        eligible.map((u) => (
                          <span key={u.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-secondary text-secondary-foreground">
                            {u.email}
                            <span className="text-[10px] text-muted-foreground">· {ROLE_LABEL[roleOf(u)]}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* REFERENCE: role-permission matrix */}
          <TabsContent value="reference" className="space-y-3">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>القسم</TableHead>
                    <TableHead className="text-center w-24">مسؤول</TableHead>
                    <TableHead className="text-center w-24">محرر</TableHead>
                    <TableHead className="text-center w-24">بدون</TableHead>
                    <TableHead>الوصف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SECTIONS.map((s) => (
                    <TableRow key={s.key}>
                      <TableCell>
                        <Link to={s.to} className="inline-flex items-center gap-2 hover:text-primary">
                          <s.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{s.label}</span>
                        </Link>
                      </TableCell>
                      <Cell yes />
                      <Cell yes={s.access === "editor"} />
                      <Cell yes={false} />
                      <TableCell className="text-xs text-muted-foreground">{s.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-4 text-xs text-muted-foreground flex gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                النظام يعتمد دورين فقط: <strong className="text-foreground">مسؤول</strong> (وصول كامل) و
                <strong className="text-foreground"> محرر</strong> (محتوى فقط: محلات، منتجات، عروض، مدونة، حملات).
                الصلاحيات مطبّقة على مستوى قاعدة البيانات عبر RLS مع دالة <code>has_role</code> الآمنة.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}

function Cell({ yes }: { yes: boolean }) {
  return (
    <TableCell className="text-center">
      {yes ? (
        <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 text-primary items-center justify-center">
          <Check className="w-3.5 h-3.5" />
        </span>
      ) : (
        <span className="inline-flex w-6 h-6 rounded-full bg-muted text-muted-foreground/60 items-center justify-center">
          <X className="w-3.5 h-3.5" />
        </span>
      )}
    </TableCell>
  );
}

function StatCard({
  label, value, icon: Icon, tone,
}: { label: string; value: number; icon: LucideIcon; tone: "primary" | "success" | "danger" | "neutral" }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    danger: "bg-destructive/10 text-destructive",
    neutral: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-md grid place-items-center ${toneCls}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-bold leading-tight">{value}</div>
      </div>
    </div>
  );
}
