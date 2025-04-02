
-- Fix the error that's causing problems when creating new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into artists table with default values for financial fields
  INSERT INTO public.artists (id, name, email, total_earnings, available_balance, wallet_balance, status)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', new.email), 
    new.email, 
    0, 
    0, 
    0,
    'active'
  );
  
  -- Add default 'user' role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;
