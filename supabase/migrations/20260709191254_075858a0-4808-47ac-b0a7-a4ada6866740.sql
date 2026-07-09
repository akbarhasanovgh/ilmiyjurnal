
-- 1. Extend submissions with stable core fields (no reaction_prompt)
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS terms_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS article_format text,
  ADD COLUMN IF NOT EXISTS cover_letter text,
  ADD COLUMN IF NOT EXISTS special_issue boolean,
  ADD COLUMN IF NOT EXISTS ai_section text,
  ADD COLUMN IF NOT EXISTS originality_confirmed boolean NOT NULL DEFAULT false;

ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_article_format_check;
ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_article_format_check
  CHECK (article_format IS NULL OR article_format IN ('word','latex'));

-- 2. Extend submission_authors with the fields that don't already exist
ALTER TABLE public.submission_authors
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS institution_url text,
  ADD COLUMN IF NOT EXISTS scopus_url text,
  ADD COLUMN IF NOT EXISTS credit_roles text[] NOT NULL DEFAULT '{}'::text[];

-- 3. submission_declarations — one current row per (submission, key)
-- Change history is captured via audit_logs; no version column.
CREATE TABLE IF NOT EXISTS public.submission_declarations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  declaration_key text NOT NULL,
  response_type text NOT NULL CHECK (response_type IN ('yes_no','choice','text')),
  response_value text,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (submission_id, declaration_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_declarations TO authenticated;
GRANT ALL ON public.submission_declarations TO service_role;

ALTER TABLE public.submission_declarations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "declarations_owner_select" ON public.submission_declarations
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s
                 WHERE s.id = submission_id AND s.owner_id = auth.uid()));

CREATE POLICY "declarations_owner_write" ON public.submission_declarations
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s
                      WHERE s.id = submission_id AND s.owner_id = auth.uid()
                        AND s.workflow_state IN ('draft','revision_requested')));

CREATE POLICY "declarations_owner_update" ON public.submission_declarations
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s
                 WHERE s.id = submission_id AND s.owner_id = auth.uid()
                   AND s.workflow_state IN ('draft','revision_requested')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s
                      WHERE s.id = submission_id AND s.owner_id = auth.uid()
                        AND s.workflow_state IN ('draft','revision_requested')));

CREATE POLICY "declarations_owner_delete" ON public.submission_declarations
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s
                 WHERE s.id = submission_id AND s.owner_id = auth.uid()
                   AND s.workflow_state IN ('draft','revision_requested')));

CREATE POLICY "declarations_staff_select" ON public.submission_declarations
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'submissions.view_all')
         OR EXISTS (SELECT 1 FROM public.submission_assignments a
                    WHERE a.submission_id = submission_declarations.submission_id
                      AND a.editor_id = auth.uid()
                      AND a.unassigned_at IS NULL));

CREATE TRIGGER trg_submission_declarations_updated_at
  BEFORE UPDATE ON public.submission_declarations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS submission_declarations_submission_id_idx
  ON public.submission_declarations(submission_id);

-- 4. submission_suggested_reviewers — owner-only, editors read-only
CREATE TABLE IF NOT EXISTS public.submission_suggested_reviewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  institution text,
  reason text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_suggested_reviewers TO authenticated;
GRANT ALL ON public.submission_suggested_reviewers TO service_role;

ALTER TABLE public.submission_suggested_reviewers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sug_rev_owner_all" ON public.submission_suggested_reviewers
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s
                 WHERE s.id = submission_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s
                      WHERE s.id = submission_id AND s.owner_id = auth.uid()
                        AND s.workflow_state IN ('draft','revision_requested')));

CREATE POLICY "sug_rev_staff_select" ON public.submission_suggested_reviewers
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'submissions.view_all')
         OR EXISTS (SELECT 1 FROM public.submission_assignments a
                    WHERE a.submission_id = submission_suggested_reviewers.submission_id
                      AND a.editor_id = auth.uid()
                      AND a.unassigned_at IS NULL));

CREATE TRIGGER trg_submission_suggested_reviewers_updated_at
  BEFORE UPDATE ON public.submission_suggested_reviewers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS submission_suggested_reviewers_submission_id_idx
  ON public.submission_suggested_reviewers(submission_id);
