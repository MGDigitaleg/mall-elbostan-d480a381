import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "reviewer" | "moderator" | "user";

interface AuthState {
  user: User | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isEditor: boolean;
  isReviewer: boolean;
  /** True if user can manage content tables (admin OR editor). */
  canManageContent: boolean;
  /** True if user can review moderation queues (admin OR reviewer). */
  canReview: boolean;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
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
  const isReviewer = roles.includes("reviewer");

  return {
    user,
    loading,
    roles,
    isAdmin,
    isEditor,
    isReviewer,
    canManageContent: isAdmin || isEditor,
    canReview: isAdmin || isReviewer,
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
 * (stores, blog, deals, jobs, faqs, events, products, etc.).
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

/**
 * Require admin OR reviewer — for moderation queues
 * (social offers intake, offers pipeline review).
 */
export function useRequireReviewerAccess() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && (!auth.user || !auth.canReview)) {
      navigate("/admin/login");
    }
  }, [auth.loading, auth.user, auth.canReview, navigate]);

  return auth;
}
