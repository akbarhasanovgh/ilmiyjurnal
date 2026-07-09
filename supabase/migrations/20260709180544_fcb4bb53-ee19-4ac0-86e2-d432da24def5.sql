
CREATE POLICY "user_roles: staff read"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_permission(auth.uid(), 'users.view'));

CREATE POLICY "user_roles: staff insert"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_permission(auth.uid(), 'users.assign_roles'));

CREATE POLICY "user_roles: staff delete"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_permission(auth.uid(), 'users.assign_roles'));

CREATE POLICY "audit_logs: staff insert"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (actor_id = auth.uid());
