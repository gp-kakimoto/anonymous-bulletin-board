ALTER TABLE threads ADD COLUMN latest_activity_at TIMESTAMPTZ
                    DEFAULT CURRENT_TIMESTAMP NOT NULL;
 
-- スレ立て時は自動で現在時刻
-- コメントINSERT/UPDATE時に AFTER INSERT トリガで更新
CREATE OR REPLACE FUNCTION bump_latest_activity() RETURNS trigger AS $$
BEGIN
  SET search_path = public;
  UPDATE threads
     SET latest_activity_at = NEW.created_at
   WHERE id = NEW.thread_id
     AND latest_activity_at < NEW.created_at;
  RETURN NULL;
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;
 
CREATE TRIGGER trg_bump_activity
AFTER INSERT ON comments
FOR EACH ROW EXECUTE FUNCTION bump_latest_activity();