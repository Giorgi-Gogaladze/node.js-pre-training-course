
CREATE TABLE audit_log (
    id SERIAL  PRIMARY KEY,
    todo_id INT,
    action TEXT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_todo_changes()
RETURNS TRIGGER AS $$
BEGIN 
    IF(TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (todo_id, action, changed_at)
        VALUES (NEW.id, "UPDATE", NOW());
        RETURN NEW;

    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log (todo_id, action, changed_at)
        VALUES (OLD.id, 'DELETE', NOW());
        RETURN OLD;
    END IF;

    RETURN NULL;

END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER log_todo_update
AFTER UPDATE ON todos 
FOR EACH ROW 
EXECUTE FUNCTION log_todo_changes();


CREATE TRIGGER log_todo_delete
AFTER DELETE ON todos 
FOR EACH ROW
EXECUTE FUNCTION log_todo_changes();



/*
creating triggers that triggers to some actions/operations like update, delete and we assign functions to those triggers so that on every operations that have triggers they will automatically execute some commands, basically used for audit logs.
*/