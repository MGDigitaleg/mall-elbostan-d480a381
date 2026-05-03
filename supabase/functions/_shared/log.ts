// Shared logger for Edge Functions.
// Records every invocation into `public.edge_function_logs` so the
// admin diagnostics page can surface failures without external tooling.
//
// Usage:
//   import { withLogging } from "../_shared/log.ts";
//   Deno.serve(withLogging("my-fn", async (req) => { ... }));

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

type Handler = (req: Request) => Promise<Response> | Response;

function getClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  try {
    return createClient(url, key, { auth: { persistSession: false } });
  } catch {
    return null;
  }
}

function safeUrlPath(req: Request): string {
  try {
    return new URL(req.url).pathname;
  } catch {
    return "";
  }
}

async function record(entry: {
  function_name: string;
  status: "success" | "error";
  status_code: number | null;
  duration_ms: number;
  method: string;
  path: string;
  request_summary: Record<string, unknown>;
  error_message?: string;
  error_stack?: string;
}) {
  // Fire-and-forget — never block the request on logging.
  try {
    const client = getClient();
    if (!client) return;
    await client.from("edge_function_logs").insert(entry);
  } catch {
    // Swallow logging errors silently.
  }
}

export function withLogging(name: string, handler: Handler): Handler {
  return async (req: Request) => {
    const start = Date.now();
    const method = req.method;
    const path = safeUrlPath(req);
    const summary: Record<string, unknown> = {
      query: Object.fromEntries(new URL(req.url).searchParams.entries()),
      ua: req.headers.get("user-agent") ?? null,
    };

    // Skip logging for OPTIONS preflights to keep the table lean.
    if (method === "OPTIONS") {
      return handler(req);
    }

    try {
      const res = await handler(req);
      const duration_ms = Date.now() - start;
      const status_code = res.status;
      const status = status_code >= 500 ? "error" : "success";
      void record({
        function_name: name,
        status,
        status_code,
        duration_ms,
        method,
        path,
        request_summary: summary,
      });
      return res;
    } catch (e: any) {
      const duration_ms = Date.now() - start;
      void record({
        function_name: name,
        status: "error",
        status_code: 500,
        duration_ms,
        method,
        path,
        request_summary: summary,
        error_message: String(e?.message ?? e),
        error_stack: typeof e?.stack === "string" ? e.stack.slice(0, 4000) : undefined,
      });
      throw e;
    }
  };
}
