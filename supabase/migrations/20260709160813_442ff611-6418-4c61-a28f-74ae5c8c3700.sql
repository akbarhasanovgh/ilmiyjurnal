
-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE public.workflow_state AS ENUM (
  'draft','submitted','screening','editor_assigned','under_review',
  'revision_requested','revised','accepted','rejected','withdrawn'
);
CREATE TYPE public.article_type AS ENUM ('research','review','short_communication','book_review','editorial');
CREATE TYPE public.primary_language AS ENUM ('uz','en','ru','qq');
CREATE TYPE public.contributor_role AS ENUM ('author','co_author','corresponding','translator','editor');
CREATE TYPE public.file_kind AS ENUM ('manuscript','anonymous_manuscript','cover_letter','figure','table','supplementary','data','other');
CREATE TYPE public.notification_kind AS ENUM (
  'submission_received','editor_assigned','state_changed',
  'revision_requested','decision_made','file_added'
);

-- ============================================================================
-- HELPER: updated_at trigger fn
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============================================================================
-- INSTITUTIONS
-- ============================================================================
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institutions TO authenticated, anon;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "institutions readable by all"
  ON public.institutions FOR SELECT TO authenticated, anon USING (true);

-- ============================================================================
-- PROFILES
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  orcid TEXT,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  institution_text TEXT,
  department TEXT,
  academic_degree TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROLES / PERMISSIONS / has_permission
-- ============================================================================
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.roles TO authenticated;
GRANT ALL ON public.roles TO service_role;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles readable by authenticated"
  ON public.roles FOR SELECT TO authenticated USING (true);

CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  "group" TEXT NOT NULL,
  description TEXT NOT NULL
);
GRANT SELECT ON public.permissions TO authenticated;
GRANT ALL ON public.permissions TO service_role;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "permissions readable by authenticated"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_permissions readable by authenticated"
  ON public.role_permissions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see their own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Central permission check (SECURITY DEFINER, avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_key TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id AND p.key = _permission_key
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role_key TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id AND r.key = _role_key
  );
$$;

-- Additional profile read policies now that has_permission exists
CREATE POLICY "profiles: self read"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "profiles: staff read"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'users.view'));
CREATE POLICY "profiles: self update"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ============================================================================
-- SUBMISSIONS + related
-- ============================================================================
CREATE SEQUENCE public.manuscript_seq;

CREATE OR REPLACE FUNCTION public.generate_manuscript_id()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  yr INT := EXTRACT(YEAR FROM now());
  n  INT := nextval('public.manuscript_seq');
BEGIN
  RETURN 'OTA-' || yr::TEXT || '-' || LPAD(n::TEXT, 4, '0');
END; $$;

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id TEXT NOT NULL UNIQUE DEFAULT public.generate_manuscript_id(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  title_en TEXT,
  title_original TEXT,
  article_type public.article_type NOT NULL DEFAULT 'research',
  research_field TEXT,
  primary_language public.primary_language NOT NULL DEFAULT 'uz',
  abstract TEXT,
  abstract_en TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  keywords_en TEXT[] NOT NULL DEFAULT '{}',
  declarations JSONB NOT NULL DEFAULT '{}'::jsonb,
  workflow_state public.workflow_state NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_subs_owner ON public.submissions(owner_id);
CREATE INDEX idx_subs_state ON public.submissions(workflow_state);

-- Assignment table needs to be referenced by RLS policies below
CREATE TABLE public.submission_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  editor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unassigned_at TIMESTAMPTZ,
  deadline DATE,
  instructions TEXT
);
GRANT SELECT ON public.submission_assignments TO authenticated;
GRANT ALL ON public.submission_assignments TO service_role;
ALTER TABLE public.submission_assignments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_assign_editor_active ON public.submission_assignments(editor_id) WHERE unassigned_at IS NULL;
CREATE INDEX idx_assign_submission ON public.submission_assignments(submission_id);

-- Helper: is user the current assigned editor?
CREATE OR REPLACE FUNCTION public.is_assigned_editor(_user_id UUID, _submission_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.submission_assignments
    WHERE submission_id = _submission_id
      AND editor_id = _user_id
      AND unassigned_at IS NULL
  );
$$;

-- Submission policies
CREATE POLICY "subs: owner read" ON public.submissions FOR SELECT TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "subs: assigned editor read" ON public.submissions FOR SELECT TO authenticated
  USING (public.is_assigned_editor(auth.uid(), id));
CREATE POLICY "subs: staff read all" ON public.submissions FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'submissions.view_all'));
CREATE POLICY "subs: owner create" ON public.submissions FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND public.has_permission(auth.uid(), 'submissions.create'));
-- Owner may edit their draft; workflow_state changes must go through the transition function
CREATE POLICY "subs: owner update draft" ON public.submissions FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() AND workflow_state = 'draft')
  WITH CHECK (owner_id = auth.uid() AND workflow_state = 'draft');

-- Assignment policies
CREATE POLICY "assign: staff read all" ON public.submission_assignments FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'submissions.view_all'));
CREATE POLICY "assign: assigned editor read own" ON public.submission_assignments FOR SELECT TO authenticated
  USING (editor_id = auth.uid());
CREATE POLICY "assign: submission owner read" ON public.submission_assignments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.owner_id = auth.uid()));

-- Authors on a submission
CREATE TABLE public.submission_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  institution TEXT,
  department TEXT,
  country TEXT,
  orcid TEXT,
  academic_degree TEXT,
  contributor_role public.contributor_role NOT NULL DEFAULT 'author',
  is_corresponding BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_authors TO authenticated;
GRANT ALL ON public.submission_authors TO service_role;
ALTER TABLE public.submission_authors ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_authors_sub ON public.submission_authors(submission_id);

CREATE POLICY "authors: read via submission" ON public.submission_authors FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND (s.owner_id = auth.uid()
      OR public.is_assigned_editor(auth.uid(), s.id)
      OR public.has_permission(auth.uid(), 'submissions.view_all'))));
CREATE POLICY "authors: owner writes on draft" ON public.submission_authors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND s.owner_id = auth.uid() AND s.workflow_state IN ('draft','revision_requested')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND s.owner_id = auth.uid() AND s.workflow_state IN ('draft','revision_requested')));

-- Versions
CREATE TABLE public.submission_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  version_no INT NOT NULL,
  note TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (submission_id, version_no)
);
GRANT SELECT, INSERT ON public.submission_versions TO authenticated;
GRANT ALL ON public.submission_versions TO service_role;
ALTER TABLE public.submission_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "versions: read via submission" ON public.submission_versions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND (s.owner_id = auth.uid()
      OR public.is_assigned_editor(auth.uid(), s.id)
      OR public.has_permission(auth.uid(), 'submissions.view_all'))));

-- Files
CREATE TABLE public.submission_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.submission_versions(id) ON DELETE SET NULL,
  kind public.file_kind NOT NULL DEFAULT 'manuscript',
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime TEXT,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.submission_files TO authenticated;
GRANT ALL ON public.submission_files TO service_role;
ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_files_sub ON public.submission_files(submission_id);

CREATE POLICY "files: read via submission" ON public.submission_files FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND (s.owner_id = auth.uid()
      OR public.is_assigned_editor(auth.uid(), s.id)
      OR public.has_permission(auth.uid(), 'submissions.view_all'))));
CREATE POLICY "files: owner writes on draft/revision" ON public.submission_files FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid()
    AND EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
      AND s.owner_id = auth.uid()
      AND s.workflow_state IN ('draft','revision_requested','submitted')));
CREATE POLICY "files: owner deletes on draft" ON public.submission_files FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND s.owner_id = auth.uid() AND s.workflow_state = 'draft'));

-- Status history (append-only)
CREATE TABLE public.submission_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  from_state public.workflow_state,
  to_state public.workflow_state NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  reason TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.submission_status_history TO authenticated;
GRANT ALL ON public.submission_status_history TO service_role;
ALTER TABLE public.submission_status_history ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_status_sub ON public.submission_status_history(submission_id, created_at DESC);
CREATE POLICY "status: read via submission" ON public.submission_status_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id
    AND (s.owner_id = auth.uid()
      OR public.is_assigned_editor(auth.uid(), s.id)
      OR public.has_permission(auth.uid(), 'submissions.view_all'))));

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind public.notification_kind NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_notif_user ON public.notifications(user_id, read_at, created_at DESC);
CREATE POLICY "notif: own read" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notif: own mark read" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- AUDIT LOG (append-only)
-- ============================================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id, created_at DESC);
CREATE POLICY "audit: staff read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'audit.view'));
-- No INSERT/UPDATE/DELETE policies: writes only via SECURITY DEFINER functions.

-- ============================================================================
-- JOURNAL SETTINGS
-- ============================================================================
CREATE TABLE public.journal_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journal_settings TO authenticated, anon;
GRANT ALL ON public.journal_settings TO service_role;
ALTER TABLE public.journal_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings: readable" ON public.journal_settings FOR SELECT TO authenticated, anon USING (true);

-- ============================================================================
-- SEED: permissions, roles, role->permission mapping, journal settings
-- ============================================================================
INSERT INTO public.permissions (key, "group", description) VALUES
  ('users.view','users','View user directory'),
  ('users.manage','users','Create, edit, suspend users'),
  ('users.assign_roles','users','Grant and revoke roles'),
  ('roles.view','roles','View roles and permissions'),
  ('roles.manage','roles','Create, edit, delete roles and edit permissions'),
  ('submissions.create','submissions','Create own submissions'),
  ('submissions.view_own','submissions','View own submissions'),
  ('submissions.view_assigned','submissions','View submissions assigned to me'),
  ('submissions.view_all','submissions','View all submissions in the system'),
  ('submissions.screen','submissions','Perform initial screening'),
  ('submissions.assign_editor','submissions','Assign editors to submissions'),
  ('submissions.change_state','submissions','Advance submissions through review states'),
  ('submissions.decide','submissions','Issue editorial decisions'),
  ('submissions.withdraw','submissions','Withdraw own submissions'),
  ('submissions.download_files','submissions','Download manuscript files'),
  ('audit.view','system','View the audit log'),
  ('settings.manage','system','Manage journal settings');

INSERT INTO public.roles (key, name, description, is_system) VALUES
  ('author','Muallif','Maqola muallifi',true),
  ('editor','Muharrir','Tayinlangan muharrir',true),
  ('managing_editor','Bosh muharrir yordamchisi','Topshiriqlarni taqsimlaydi',true),
  ('administrator','Administrator','Tizim boshqaruvchisi',true),
  ('super_admin','Super administrator','Tizimning to''liq boshqaruvi',true);

-- Author
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.key = 'author' AND p.key IN
  ('submissions.create','submissions.view_own','submissions.withdraw','submissions.download_files');

-- Editor
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.key = 'editor' AND p.key IN
  ('submissions.create','submissions.view_own','submissions.withdraw',
   'submissions.view_assigned','submissions.change_state','submissions.decide',
   'submissions.download_files');

-- Managing Editor
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.key = 'managing_editor' AND p.key IN
  ('submissions.create','submissions.view_own','submissions.withdraw',
   'submissions.view_assigned','submissions.view_all','submissions.screen',
   'submissions.assign_editor','submissions.change_state','submissions.decide',
   'submissions.download_files','users.view','roles.view');

-- Administrator
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.key = 'administrator' AND p.key IN
  ('submissions.create','submissions.view_own','submissions.withdraw',
   'submissions.view_assigned','submissions.view_all','submissions.screen',
   'submissions.assign_editor','submissions.change_state','submissions.decide',
   'submissions.download_files','users.view','users.manage','users.assign_roles',
   'roles.view','audit.view','settings.manage');

-- Super Admin gets everything
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p WHERE r.key = 'super_admin';

INSERT INTO public.journal_settings (key, value) VALUES
  ('review_model', '"double_blind"'::jsonb),
  ('journal_name_uz', '"O''zbek tili va adabiyoti"'::jsonb),
  ('journal_issn', '"2010-5584"'::jsonb),
  ('primary_locale', '"uz"'::jsonb),
  ('supported_locales', '["uz","en","ru"]'::jsonb);

-- ============================================================================
-- STATE MACHINE: transition_submission
-- ============================================================================
CREATE OR REPLACE FUNCTION public.transition_submission(
  _submission_id UUID,
  _to_state public.workflow_state,
  _reason TEXT DEFAULT NULL,
  _payload JSONB DEFAULT '{}'::jsonb
) RETURNS public.submissions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.submissions;
  actor UUID := auth.uid();
  allowed BOOLEAN := false;
  required_perm TEXT;
BEGIN
  IF actor IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO s FROM public.submissions WHERE id = _submission_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'submission not found' USING ERRCODE = 'P0002';
  END IF;

  -- Transition matrix
  -- (from, to) => required permission (special: 'OWNER' or 'ASSIGNED_EDITOR')
  CASE
    WHEN s.workflow_state = 'draft'                AND _to_state = 'submitted'           THEN required_perm := 'OWNER';
    WHEN s.workflow_state = 'submitted'            AND _to_state = 'screening'           THEN required_perm := 'submissions.screen';
    WHEN s.workflow_state IN ('submitted','screening') AND _to_state = 'editor_assigned' THEN required_perm := 'submissions.assign_editor';
    WHEN s.workflow_state = 'editor_assigned'      AND _to_state = 'under_review'        THEN required_perm := 'ASSIGNED_EDITOR';
    WHEN s.workflow_state = 'under_review'         AND _to_state = 'revision_requested'  THEN required_perm := 'ASSIGNED_EDITOR';
    WHEN s.workflow_state = 'revision_requested'   AND _to_state = 'revised'             THEN required_perm := 'OWNER';
    WHEN s.workflow_state IN ('revised')           AND _to_state = 'under_review'        THEN required_perm := 'ASSIGNED_EDITOR';
    WHEN s.workflow_state IN ('under_review','revised') AND _to_state = 'accepted'       THEN required_perm := 'ASSIGNED_EDITOR';
    WHEN s.workflow_state NOT IN ('accepted','rejected','withdrawn','published','archived') AND _to_state = 'rejected'
      THEN required_perm := 'submissions.decide';
    WHEN s.workflow_state IN ('draft','submitted') AND _to_state = 'withdrawn'           THEN required_perm := 'OWNER';
    ELSE
      RAISE EXCEPTION 'invalid transition from % to %', s.workflow_state, _to_state USING ERRCODE = '22023';
  END CASE;

  -- Enforce permission
  IF required_perm = 'OWNER' THEN
    allowed := (s.owner_id = actor);
  ELSIF required_perm = 'ASSIGNED_EDITOR' THEN
    allowed := public.is_assigned_editor(actor, s.id)
            OR public.has_permission(actor, 'submissions.view_all');
  ELSE
    allowed := public.has_permission(actor, required_perm);
  END IF;

  IF NOT allowed THEN
    RAISE EXCEPTION 'permission denied for transition' USING ERRCODE = '42501';
  END IF;

  -- Required-data checks
  IF _to_state = 'submitted' THEN
    IF s.title IS NULL OR length(trim(s.title)) < 5 THEN
      RAISE EXCEPTION 'title is required (min 5 chars)' USING ERRCODE = '22023';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.submission_authors WHERE submission_id = s.id) THEN
      RAISE EXCEPTION 'at least one author is required' USING ERRCODE = '22023';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.submission_files
                   WHERE submission_id = s.id AND kind = 'manuscript') THEN
      RAISE EXCEPTION 'a manuscript file is required' USING ERRCODE = '22023';
    END IF;
  END IF;

  -- Apply transition
  UPDATE public.submissions
     SET workflow_state = _to_state,
         submitted_at = CASE WHEN _to_state = 'submitted' AND submitted_at IS NULL
                             THEN now() ELSE submitted_at END,
         updated_at = now()
   WHERE id = s.id
   RETURNING * INTO s;

  -- History
  INSERT INTO public.submission_status_history
    (submission_id, from_state, to_state, actor_id, reason, payload)
  VALUES (s.id, (SELECT workflow_state FROM public.submissions WHERE id = s.id), _to_state, actor, _reason, _payload);

  -- Audit
  INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id, after)
  VALUES (actor, 'submission.transition', 'submission', s.id,
          jsonb_build_object('to_state', _to_state, 'reason', _reason));

  -- Notifications
  IF _to_state = 'submitted' THEN
    INSERT INTO public.notifications (user_id, kind, title, body, payload)
    VALUES (s.owner_id, 'submission_received',
            'Maqolangiz qabul qilindi',
            'Maqolangiz tahririyatga muvaffaqiyatli topshirildi: ' || s.manuscript_id,
            jsonb_build_object('submission_id', s.id));
    -- Notify managing editors
    INSERT INTO public.notifications (user_id, kind, title, body, payload)
    SELECT ur.user_id, 'submission_received',
           'Yangi maqola topshirildi',
           s.manuscript_id || ' — ' || s.title,
           jsonb_build_object('submission_id', s.id)
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE r.key IN ('managing_editor','administrator','super_admin');
  ELSIF _to_state IN ('under_review','revision_requested','accepted','rejected') THEN
    INSERT INTO public.notifications (user_id, kind, title, body, payload)
    VALUES (s.owner_id, 'state_changed',
            'Maqola holati o''zgardi',
            s.manuscript_id || ' — yangi holat: ' || _to_state::TEXT,
            jsonb_build_object('submission_id', s.id, 'to_state', _to_state));
  END IF;

  RETURN s;
END; $$;

REVOKE ALL ON FUNCTION public.transition_submission(UUID, public.workflow_state, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transition_submission(UUID, public.workflow_state, TEXT, JSONB) TO authenticated;

-- ============================================================================
-- ASSIGN EDITOR
-- ============================================================================
CREATE OR REPLACE FUNCTION public.assign_editor(
  _submission_id UUID,
  _editor_id UUID,
  _deadline DATE DEFAULT NULL,
  _instructions TEXT DEFAULT NULL
) RETURNS public.submissions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.submissions;
  actor UUID := auth.uid();
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'unauthenticated' USING ERRCODE='28000'; END IF;
  IF NOT public.has_permission(actor, 'submissions.assign_editor') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE='42501';
  END IF;

  SELECT * INTO s FROM public.submissions WHERE id = _submission_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'submission not found' USING ERRCODE='P0002'; END IF;

  -- Deactivate previous active assignments
  UPDATE public.submission_assignments
     SET unassigned_at = now()
   WHERE submission_id = s.id AND unassigned_at IS NULL;

  INSERT INTO public.submission_assignments (submission_id, editor_id, assigned_by, deadline, instructions)
  VALUES (s.id, _editor_id, actor, _deadline, _instructions);

  -- Auto-transition if we're on submitted/screening
  IF s.workflow_state IN ('submitted','screening') THEN
    UPDATE public.submissions SET workflow_state = 'editor_assigned', updated_at = now()
    WHERE id = s.id RETURNING * INTO s;

    INSERT INTO public.submission_status_history (submission_id, from_state, to_state, actor_id, reason)
    VALUES (s.id, 'submitted', 'editor_assigned', actor, 'Editor assigned');
  END IF;

  INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id, after)
  VALUES (actor, 'submission.editor_assigned', 'submission', s.id,
          jsonb_build_object('editor_id', _editor_id, 'deadline', _deadline));

  INSERT INTO public.notifications (user_id, kind, title, body, payload)
  VALUES (_editor_id, 'editor_assigned',
          'Sizga yangi topshiriq',
          s.manuscript_id || ' — ' || s.title,
          jsonb_build_object('submission_id', s.id));
  INSERT INTO public.notifications (user_id, kind, title, body, payload)
  VALUES (s.owner_id, 'editor_assigned',
          'Maqolangizga muharrir tayinlandi',
          s.manuscript_id,
          jsonb_build_object('submission_id', s.id));

  RETURN s;
END; $$;
REVOKE ALL ON FUNCTION public.assign_editor(UUID, UUID, DATE, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_editor(UUID, UUID, DATE, TEXT) TO authenticated;

-- ============================================================================
-- BOOTSTRAP SUPER ADMIN (one-time)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.bootstrap_super_admin(_provided_token TEXT, _expected_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  actor UUID := auth.uid();
  sa_role_id UUID;
  existing_count INT;
BEGIN
  IF actor IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE='28000';
  END IF;
  IF _provided_token IS NULL OR _expected_token IS NULL
     OR length(_provided_token) < 16
     OR _provided_token <> _expected_token THEN
    RAISE EXCEPTION 'invalid bootstrap token' USING ERRCODE='42501';
  END IF;

  SELECT id INTO sa_role_id FROM public.roles WHERE key='super_admin';

  SELECT count(*) INTO existing_count FROM public.user_roles WHERE role_id = sa_role_id;
  IF existing_count > 0 THEN
    RAISE EXCEPTION 'super administrator already exists' USING ERRCODE='42501';
  END IF;

  INSERT INTO public.user_roles (user_id, role_id, granted_by)
  VALUES (actor, sa_role_id, actor);

  INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id, after)
  VALUES (actor, 'role.bootstrap_super_admin', 'user_role', actor,
          jsonb_build_object('role','super_admin'));

  RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.bootstrap_super_admin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_super_admin(TEXT, TEXT) TO authenticated;

-- ============================================================================
-- STORAGE POLICIES on manuscripts bucket
-- Paths: <submission_id>/<version>/<filename>
-- ============================================================================
CREATE POLICY "manuscripts: owner read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'manuscripts' AND EXISTS (
    SELECT 1 FROM public.submissions s
    WHERE s.id::text = split_part(name, '/', 1) AND s.owner_id = auth.uid()
  ));

CREATE POLICY "manuscripts: assigned editor read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'manuscripts' AND public.is_assigned_editor(auth.uid(),
    (split_part(name,'/',1))::uuid));

CREATE POLICY "manuscripts: staff read all"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'manuscripts' AND public.has_permission(auth.uid(),'submissions.view_all'));

CREATE POLICY "manuscripts: owner upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'manuscripts' AND EXISTS (
    SELECT 1 FROM public.submissions s
    WHERE s.id::text = split_part(name, '/', 1)
      AND s.owner_id = auth.uid()
      AND s.workflow_state IN ('draft','revision_requested','submitted')
  ));

CREATE POLICY "manuscripts: owner delete on draft"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'manuscripts' AND EXISTS (
    SELECT 1 FROM public.submissions s
    WHERE s.id::text = split_part(name, '/', 1)
      AND s.owner_id = auth.uid()
      AND s.workflow_state = 'draft'
  ));
