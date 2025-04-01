
-- Function to safely increment numeric fields with validation
CREATE OR REPLACE FUNCTION increment(x numeric, row_id uuid, table_name text, column_name text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_value numeric;
BEGIN
  EXECUTE format('SELECT %I FROM %I WHERE id = $1', column_name, table_name)
  INTO current_value
  USING row_id;

  IF current_value IS NULL THEN
    current_value := 0;
  END IF;

  RETURN current_value + x;
END;
$$;
