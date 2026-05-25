import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "moderator" | "user";

interface AuthState {
  user: User | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isEditor: boolean;
  /** True if user can manage content tables (admin OR editor). */
  canManageContent: boolean;
}

async function loadRoles(userId: string): Promise<AppRole[]> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  return ((data ?? []) as { role: AppRole }[]).map((r) => r.role);
}

export function useAuth(): AuthState & { signOut: () => Promise<void> } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    // 1) Subscribe FIRST to avoid missing the initial event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // defer the role fetch to avoid deadlocks inside the auth callback
        setTimeout(() => {
          loadRoles(session.user.id).then((r) => {
            setRoles(r);
            setLoading(false);
          });
        }, 0);
      } else {
        setRoles([]);
        setLoading(false);
      }
    });

    // 2) Then read existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRoles(session.user.id).then((r) => {
          setRoles(r);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");

  return {
    user,
    loading,
    roles,
    isAdmin,
    isEditor,
    canManageContent: isAdmin || isEditor,
    signOut,
  };
}

/** Require admin role; redirect to /admin/login otherwise. */
export function useRequireAdmin() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && (!auth.user || !auth.isAdmin)) {
      navigate("/admin/login");
    }
  }, [auth.loading, auth.user, auth.isAdmin, navigate]);

  return auth;
}

/**
 * Require admin OR editor — used for content management pages
 * (stores, blog, deals, jobs, faqs, events, products, downtown,
 * spin prizes/competition stores/campaign settings, etc.).
 */
export function useRequireContentAccess() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && (!auth.user || !auth.canManageContent)) {
      navigate("/admin/login");
    }
  }, [auth.loading, auth.user, auth.canManageContent, navigate]);

  return auth;
}
