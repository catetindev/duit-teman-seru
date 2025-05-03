
-- Function to check if a user is a collaborator for a goal
CREATE OR REPLACE FUNCTION public.is_collaborator(p_goal_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.goal_collaborators
    WHERE goal_id = p_goal_id AND user_id = p_user_id
  );
END;
$$;

-- Function to add a collaborator
CREATE OR REPLACE FUNCTION public.add_collaborator(p_goal_id UUID, p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_collaborator_id UUID;
BEGIN
  -- Check if the collaboration already exists
  IF EXISTS (
    SELECT 1 FROM public.goal_collaborators
    WHERE goal_id = p_goal_id AND user_id = p_user_id
  ) THEN
    SELECT id INTO v_collaborator_id FROM public.goal_collaborators
    WHERE goal_id = p_goal_id AND user_id = p_user_id;
    
    RETURN v_collaborator_id;
  END IF;
  
  -- Add the collaborator
  INSERT INTO public.goal_collaborators (goal_id, user_id)
  VALUES (p_goal_id, p_user_id)
  RETURNING id INTO v_collaborator_id;
  
  RETURN v_collaborator_id;
END;
$$;

-- Function to remove a collaborator
CREATE OR REPLACE FUNCTION public.remove_collaborator(p_goal_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.goal_collaborators
  WHERE goal_id = p_goal_id AND user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Function to get all collaborators for a goal
CREATE OR REPLACE FUNCTION public.get_goal_collaborators(p_goal_id UUID)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gc.user_id,
    p.email,
    p.full_name
  FROM public.goal_collaborators gc
  JOIN public.profiles p ON gc.user_id = p.id
  WHERE gc.goal_id = p_goal_id;
END;
$$;
