CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE todos 
ADD COLUMN user_id INTEGER;

ALTER TABLE todos
ADD CONSTRAINT fk_todos_user
FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE;


/*
__ALTER means that we wanna make some changes in the tabl , like 'ADD COLUMN' to add new comumn.
__add constraint is the kindof restriction we want to add, like we did, we assigned the foreign key to the user_id filed and connect it to the users id filed.
*/