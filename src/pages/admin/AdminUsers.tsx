import { useState } from "react";
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
import { toast } from "sonner";
import { UserPlus, KeyRound, Ban, Trash2, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  roles: string[];
};

export default function AdminUsers() {
  const auth = useRequireAdmin();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor">("editor");

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  if (!auth.isAdmin) return null;

  const users = (data ?? []).filter((u) =>
    !search ? true : (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await call.mutateAsync({ action: "invite", email: inviteEmail, role: inviteRole });
      toast.success("تم إرسال الدعوة");
      setInviteOpen(false);
      setInviteEmail("");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const setRole = async (user_id: string, role: "admin" | "editor" | "none") => {
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
      toast.success("تم إرسال رابط إعادة التعيين");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleDisable = async (u: AdminUser) => {
    try {
      await call.mutateAsync({ action: "disable", user_id: u.id, disabled: !u.banned_until });
      toast.success(u.banned_until ? "تم تفعيل المستخدم" : "تم تعطيل المستخدم");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (u: AdminUser) => {
    if (!confirm(`حذف ${u.email}؟ لا يمكن التراجع.`)) return;
    try {
      await call.mutateAsync({ action: "delete", user_id: u.id });
      toast.success("تم الحذف");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminShell>
      <div className="p-4 md:p-6 space-y-5">
        <AdminPageHeader
          title="مستخدمو لوحة التحكم"
          subtitle="إدارة الأدمن والمحررين، الصلاحيات، إعادة التعيين والتعطيل."
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

        <div className="flex gap-2">
          <Input placeholder="بحث بالبريد..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
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
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const role = u.roles.includes("admin") ? "admin" : u.roles.includes("editor") ? "editor" : "none";
                  const banned = !!u.banned_until && new Date(u.banned_until) > new Date();
                  const isSelf = u.id === auth.user?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.email}
                        {isSelf && <span className="mr-2 text-[10px] text-muted-foreground">(أنت)</span>}
                      </TableCell>
                      <TableCell>
                        <Select value={role} onValueChange={(v) => setRole(u.id, v as any)} disabled={isSelf}>
                          <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">مسؤول</SelectItem>
                            <SelectItem value="editor">محرر</SelectItem>
                            <SelectItem value="none">بدون</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("ar-EG") : "لم يدخل بعد"}
                      </TableCell>
                      <TableCell>
                        {banned ? (
                          <AdminStatusBadge tone="danger">معطّل</AdminStatusBadge>
                        ) : role === "none" ? (
                          <AdminStatusBadge tone="muted">بدون صلاحية</AdminStatusBadge>
                        ) : (
                          <AdminStatusBadge tone="success">نشط</AdminStatusBadge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-start">
                          <Button size="sm" variant="ghost" onClick={() => resetPwd(u.email)} title="إرسال رابط إعادة تعيين">
                            <KeyRound className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toggleDisable(u)} disabled={isSelf} title={banned ? "تفعيل" : "تعطيل"}>
                            <Ban className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(u)} disabled={isSelf} title="حذف">
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
          <div>
            <strong className="text-foreground">المسؤول</strong> يدير المحتوى والمستخدمين بالكامل. <strong className="text-foreground">المحرر</strong> يدير المحتوى فقط (المحلات، المنتجات، العروض، المدونة...) ولا يصل إلى إدارة المستخدمين أو الإعدادات الحساسة.
          </div>
        </div>
      </div>

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
                  <SelectItem value="admin">مسؤول</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[11px] text-muted-foreground">سيستلم المدعو بريدًا لتعيين كلمة مرور والدخول.</p>
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
    </AdminShell>
  );
}
