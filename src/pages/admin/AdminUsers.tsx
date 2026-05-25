import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  UserPlus, KeyRound, Ban, Trash2, ShieldCheck, RefreshCw, Loader2, Send, CheckCircle2,
} from "lucide-react";

type Role = "admin" | "editor" | "reviewer" | "none";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  roles: string[];
};

const ROLE_LABEL: Record<Role, string> = {
  admin: "مسؤول",
  editor: "محرر",
  reviewer: "مراجع",
  none: "بدون",
};

function roleOf(u: AdminUser): Role {
  if (u.roles.includes("admin")) return "admin";
  if (u.roles.includes("editor")) return "editor";
  if (u.roles.includes("reviewer")) return "reviewer";
  return "none";
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
}

function relativeAgo(iso: string | null) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "اليوم";
  if (days < 7) return `قبل ${days} يوم`;
  if (days < 30) return `قبل ${Math.floor(days / 7)} أسبوع`;
  if (days < 365) return `قبل ${Math.floor(days / 30)} شهر`;
  return `قبل ${Math.floor(days / 365)} سنة`;
}

export default function AdminUsers() {
  const auth = useRequireAdmin();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<Role, "none">>("editor");
  const [confirm, setConfirm] = useState<
    | { kind: "delete"; user: AdminUser }
    | { kind: "disable"; user: AdminUser }
    | { kind: "enable"; user: AdminUser }
    | null
  >(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-users"],
    enabled: auth.isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error) throw error;
      return (data?.users ?? []) as AdminUser[];
    },
  });

  const call = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data, error } = await supabase.functions.invoke("admin-manage-user", { body });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const users = useMemo(() => {
    let list = data ?? [];
    if (search) list = list.filter((u) => (u.email ?? "").toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== "all") list = list.filter((u) => roleOf(u) === roleFilter);
    return list.sort((a, b) => {
      const order: Record<Role, number> = { admin: 0, editor: 1, reviewer: 2, none: 3 };
      return order[roleOf(a)] - order[roleOf(b)];
    });
  }, [data, search, roleFilter]);

  const counts = useMemo(() => {
    const list = data ?? [];
    return {
      total: list.length,
      admins: list.filter((u) => roleOf(u) === "admin").length,
      editors: list.filter((u) => roleOf(u) === "editor").length,
      reviewers: list.filter((u) => roleOf(u) === "reviewer").length,
      pending: list.filter((u) => !u.last_sign_in_at).length,
      disabled: list.filter((u) => !!u.banned_until && new Date(u.banned_until) > new Date()).length,
    };
  }, [data]);

  if (!auth.isAdmin) return null;

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await call.mutateAsync({ action: "invite", email: inviteEmail, role: inviteRole });
      toast.success("تم إرسال الدعوة بنجاح");
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("editor");
    } catch (e: any) {
      toast.error(e.message ?? "تعذّر إرسال الدعوة");
    }
  };

  const setRole = async (user_id: string, role: Role) => {
    try {
      await call.mutateAsync({ action: "set_role", user_id, role });
      toast.success("تم تحديث الصلاحية");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const resetPwd = async (email: string | null) => {
    if (!email) return;
    try {
      await call.mutateAsync({ action: "reset_password", email });
      toast.success("تم إرسال رابط إعادة التعيين إلى " + email);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const resendInvite = async (u: AdminUser) => {
    if (!u.email) return;
    try {
      await call.mutateAsync({ action: "resend_invite", email: u.email });
      toast.success("تم إعادة إرسال الدعوة");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const performConfirm = async () => {
    if (!confirm) return;
    try {
      if (confirm.kind === "delete") {
        await call.mutateAsync({ action: "delete", user_id: confirm.user.id });
        toast.success("تم حذف الحساب");
      } else if (confirm.kind === "disable") {
        await call.mutateAsync({ action: "disable", user_id: confirm.user.id, disabled: true });
        toast.success("تم تعطيل الحساب");
      } else {
        await call.mutateAsync({ action: "disable", user_id: confirm.user.id, disabled: false });
        toast.success("تم تفعيل الحساب");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setConfirm(null);
    }
  };

  return (
    <AdminShell>
      <div className="p-4 md:p-6 space-y-5">
        <AdminPageHeader
          title="مستخدمو لوحة التحكم"
          subtitle="إدارة الأدمن والمحررين والمراجعين، الصلاحيات، إعادة التعيين والتعطيل."
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`w-4 h-4 ml-1 ${isFetching ? "animate-spin" : ""}`} /> تحديث
              </Button>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="w-4 h-4 ml-1" /> دعوة مستخدم
              </Button>
            </div>
          }
        />

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatChip label="إجمالي" value={counts.total} />
          <StatChip label="مسؤولون" value={counts.admins} tone="primary" />
          <StatChip label="محررون" value={counts.editors} tone="success" />
          <StatChip label="مراجعون" value={counts.reviewers} tone="warning" />
          <StatChip label="معطّلون" value={counts.disabled} tone="danger" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="بحث بالبريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="كل الأدوار" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأدوار</SelectItem>
              <SelectItem value="admin">مسؤول</SelectItem>
              <SelectItem value="editor">محرر</SelectItem>
              <SelectItem value="reviewer">مراجع</SelectItem>
              <SelectItem value="none">بدون صلاحية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-10 grid place-items-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <AdminEmptyState title="لا يوجد مستخدمون" description="ابدأ بدعوة عضو فريق." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>البريد</TableHead>
                  <TableHead>الصلاحية</TableHead>
                  <TableHead>آخر دخول</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const role = roleOf(u);
                  const banned = !!u.banned_until && new Date(u.banned_until) > new Date();
                  const isSelf = u.id === auth.user?.id;
                  const pendingInvite = !u.last_sign_in_at;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium align-top">
                        <div className="flex flex-col">
                          <span>{u.email}</span>
                          {isSelf && <span className="text-[10px] text-muted-foreground">(أنت)</span>}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Select value={role} onValueChange={(v) => setRole(u.id, v as Role)} disabled={isSelf}>
                          <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">مسؤول</SelectItem>
                            <SelectItem value="editor">محرر</SelectItem>
                            <SelectItem value="reviewer">مراجع</SelectItem>
                            <SelectItem value="none">بدون</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        <div>{fmtDate(u.last_sign_in_at)}</div>
                        {u.last_sign_in_at && (
                          <div className="text-[10px] opacity-70">{relativeAgo(u.last_sign_in_at)}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">{fmtDate(u.created_at)}</TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col gap-1">
                          {banned ? (
                            <AdminStatusBadge tone="danger">معطّل</AdminStatusBadge>
                          ) : role === "none" ? (
                            <AdminStatusBadge tone="neutral">بدون صلاحية</AdminStatusBadge>
                          ) : (
                            <AdminStatusBadge tone="success">نشط</AdminStatusBadge>
                          )}
                          {pendingInvite && !banned && (
                            <AdminStatusBadge tone="warning">دعوة معلّقة</AdminStatusBadge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex gap-1 justify-start flex-wrap">
                          {pendingInvite && (
                            <Button size="sm" variant="ghost" onClick={() => resendInvite(u)} title="إعادة إرسال الدعوة">
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => resetPwd(u.email)} title="إرسال رابط إعادة تعيين">
                            <KeyRound className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirm({ kind: banned ? "enable" : "disable", user: u })}
                            disabled={isSelf}
                            title={banned ? "تفعيل" : "تعطيل"}
                          >
                            {banned ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Ban className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirm({ kind: "delete", user: u })}
                            disabled={isSelf}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="rounded-lg border border-border bg-secondary/40 p-4 text-xs text-muted-foreground flex gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div>
              <strong className="text-foreground">المسؤول</strong>: وصول كامل (محتوى + مستخدمون + إعدادات + نظام).
            </div>
            <div>
              <strong className="text-foreground">المحرر</strong>: إدارة المحتوى فقط (محلات، منتجات، عروض، مدونة، حملات).
            </div>
            <div>
              <strong className="text-foreground">المراجع</strong>: مراجعة عروض السوشيال ومسار العروض/المنتجات فقط، بدون وصول للإعدادات أو المستخدمين.
            </div>
          </div>
        </div>
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>دعوة عضو جديد</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold mb-1 block">البريد الإلكتروني</label>
              <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="name@elbostan.com" />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block">الصلاحية</label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">محرر محتوى</SelectItem>
                  <SelectItem value="reviewer">مراجع (سوشيال/عروض)</SelectItem>
                  <SelectItem value="admin">مسؤول (وصول كامل)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {inviteRole === "admin" && "سيحصل على وصول كامل بما في ذلك إدارة المستخدمين والإعدادات."}
                {inviteRole === "editor" && "سيدير المحتوى فقط (محلات، منتجات، عروض، مدونة)."}
                {inviteRole === "reviewer" && "سيراجع منشورات السوشيال والعروض فقط، بدون أي تعديل في الإعدادات."}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">سيستلم المدعو بريدًا لتعيين كلمة مرور والدخول إلى لوحة التحكم.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>إلغاء</Button>
            <Button onClick={handleInvite} disabled={call.isPending || !inviteEmail}>
              {call.isPending && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
              إرسال الدعوة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "delete" && "حذف الحساب نهائيًا؟"}
              {confirm?.kind === "disable" && "تعطيل الحساب؟"}
              {confirm?.kind === "enable" && "تفعيل الحساب؟"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "delete" && (
                <>سيتم حذف <strong>{confirm.user.email}</strong> نهائيًا مع جميع صلاحياته. لا يمكن التراجع.</>
              )}
              {confirm?.kind === "disable" && (
                <>سيُمنع <strong>{confirm.user.email}</strong> من تسجيل الدخول. يمكنك إعادة التفعيل لاحقًا.</>
              )}
              {confirm?.kind === "enable" && (
                <>سيتمكّن <strong>{confirm.user.email}</strong> من تسجيل الدخول مرة أخرى.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={performConfirm}
              className={confirm?.kind === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              تأكيد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}

function StatChip({
  label, value, tone = "neutral",
}: { label: string; value: number; tone?: "primary" | "success" | "warning" | "danger" | "neutral" }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    danger: "bg-destructive/10 text-destructive",
    neutral: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${toneCls}`}>{label}</span>
      </div>
    </div>
  );
}
