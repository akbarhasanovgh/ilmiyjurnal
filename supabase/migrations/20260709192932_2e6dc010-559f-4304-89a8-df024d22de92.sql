
CREATE POLICY "subs: owner delete draft" ON public.submissions
FOR DELETE TO authenticated
USING (owner_id = auth.uid() AND workflow_state = 'draft');
