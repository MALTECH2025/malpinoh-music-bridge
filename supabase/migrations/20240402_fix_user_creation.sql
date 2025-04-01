
-- Fix the error that's causing problems when creating new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into artists table
  INSERT INTO public.artists (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  
  -- Add default 'user' role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;
