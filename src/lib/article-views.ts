import { supabase } from "@/integrations/supabase/client";

export type ArticleViewRow = {
  manuscript_id: string;
  view_count: number;
  updated_at: string;
};

/**
 * Increments an article's view counter atomically via a Postgres RPC.
 * De-duplicates per browser session via sessionStorage so a single reader
 * refreshing the page doesn't inflate the count.
 */
export async function incrementArticleView(manuscriptId: string): Promise<void> {
  if (!manuscriptId) return;
  if (typeof window !== "undefined") {
    const key = `viewed:${manuscriptId}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  }
  // Types are cast because article_views / RPC aren't in the generated types yet.
  const client = supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
  await client.rpc("increment_article_view", { _manuscript_id: manuscriptId });
}

export async function getTopViewedArticles(limit = 5): Promise<ArticleViewRow[]> {
  const { data, error } = await (supabase as any)
    .from("article_views")
    .select("manuscript_id, view_count, updated_at")
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as ArticleViewRow[];
}

export async function getArticleViewCount(manuscriptId: string): Promise<number> {
  if (!manuscriptId) return 0;
  const { data, error } = await (supabase as any)
    .from("article_views")
    .select("view_count")
    .eq("manuscript_id", manuscriptId)
    .maybeSingle();
  if (error || !data) return 0;
  return Number((data as { view_count: number }).view_count) || 0;
}
