CREATE TABLE profiles (
    id UUID REFERENCES auth.users (id) ON DELETE CASCADE PRIMARY KEY,
    is_admin BOOLEAN
);

GRANT ALL ON profiles TO service_role;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin
  );
$$;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Allow INSERT for admins

GRANT INSERT, UPDATE ON songs TO authenticated;
GRANT INSERT, UPDATE ON artists TO authenticated;

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_select_songs"
ON songs
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_insert_song"
ON songs
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "admin_update_song"
ON songs
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "all_select_artists"
ON artists
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_insert_artist"
ON artists
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "admin_update_artist"
ON artists
FOR UPDATE
TO authenticated
USING (is_admin());
