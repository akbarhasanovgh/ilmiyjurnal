
ALTER TABLE public.article_views
  ADD COLUMN IF NOT EXISTS download_count BIGINT NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_article_download(_manuscript_id text)
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

  INSERT INTO public.article_views (manuscript_id, view_count, download_count, updated_at)
  VALUES (_manuscript_id, 0, 1, now())
  ON CONFLICT (manuscript_id) DO UPDATE
    SET download_count = public.article_views.download_count + 1,
        updated_at = now()
  RETURNING download_count INTO new_count;

  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_article_download(text) TO anon, authenticated;
