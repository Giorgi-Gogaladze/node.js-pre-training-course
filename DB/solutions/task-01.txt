
CREATE DATABASE todo_app;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT, 
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


/*
--terminal commands(powershell)
   postgreSQL -package search: winget search PostgreSQL
--installaditon with winget: 
   winget install PostgreSQL.18

    queryes: create tdatabase _ creates database,
    every table has id as a primary key and related table should have other tables primary key as a foreign key, we use word 'references' for pointing to it.
    types: text, integer, nut null means it cant an empty, unique_ it should not be repetitive, shoul be unique, check checks on some conditions, 
    default gives default value, 
*/