ALTER TABLE profiles ALTER COLUMN is_admin SET NOT NULL;

REVOKE ALL ON profiles FROM anon;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only"
ON profiles
FOR ALL
TO authenticated
WITH CHECK (is_admin());
