select * from todos
WHERE status = 'active';

select * from todos
ORDER BY created_at ASC;

select * from todos
ORDER BY created_at DESC;

SELECT * FROM todos WHERE title ILIKE '%meeting%'
OR description ILIKE '%meeting%'

/*
_'where' is used to select a filed by value.
_the 'order by' orders records by specific field, usially ordering with alphabetical order or data, and we pass second value like 'asc' or 'desc' depends if we wanna order them by ascending or descending.
_and for searching specific stirng in the record we use 'like' or 'ilike' depending on case sensitivity.
*/