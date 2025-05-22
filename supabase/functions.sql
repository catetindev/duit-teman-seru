
-- Function to update user profile as a secure RPC call (bypassing RLS)
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  profile_updates JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  current_user_id UUID := auth.uid();
BEGIN
  -- Only allow users to update their own profile
  IF current_user_id != user_id THEN
    RAISE EXCEPTION 'You can only update your own profile';
  END IF;
  
  -- Update the profile and return the updated record
  UPDATE public.profiles
  SET 
    full_name = COALESCE(profile_updates->>'full_name', full_name),
    email = COALESCE(profile_updates->>'email', email)
    -- Add other fields as needed
  WHERE id = user_id
  RETURNING to_jsonb(profiles.*) INTO result;
  
  RETURN result;
END;
$$;
