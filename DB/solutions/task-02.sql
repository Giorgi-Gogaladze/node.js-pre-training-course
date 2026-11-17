INSERT INTO users (name, email)
VALUES ('gio', 'gogaladze@gmail.com');

INSERT INTO todos (title, description, status, user_id)
VALUES('learn sql', 'you gotta learn', 'active', 1);

SELECT * FROM todos;


UPDATE todos SET status = 'compmleted' WHERE id = 1;

SELECT * FROM todos WHERE id = 1;

DELETE FROM todos WHERE id = 2;

SELECT * FROM todos;

/*
all the baseic commands: insert for creating new record with specific values,
select * means to select everything from table, so it returns all the records,
for the update we use SET to set/(set new values) some specific values,
delete removes by specific features, 
*/