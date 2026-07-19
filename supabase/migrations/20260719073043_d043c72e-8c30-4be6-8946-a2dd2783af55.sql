
CREATE TABLE public.article_views (
  manuscript_id TEXT PRIMARY KEY,
  view_count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.article_views TO anon, authenticated;
GRANT ALL ON public.article_views TO service_role;

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read view counts"
  ON public.article_views
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.increment_article_view(_manuscript_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  IF _manuscript_id IS NULL OR length(trim(_manuscript_id)) = 0 THEN
    RAISE EXCEPTION 'manuscript_id required' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.article_views (manuscript_id, view_count, updated_at)
  VALUES (_manuscript_id, 1, now())
  ON CONFLICT (manuscript_id) DO UPDATE
    SET view_count = public.article_views.view_count + 1,
        updated_at = now()
  RETURNING view_count INTO new_count;

  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_article_view(TEXT) TO anon, authenticated;

CREATE INDEX article_views_count_idx
  ON public.article_views (view_count DESC);
