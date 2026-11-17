select status, count(*) as total from todos group by status;

select users.name, count(todos.id) as todo_count
from users join todos on todos.user_id = users.id
group by users.id, users.name;


select users.id, users.name, users.email 
from users 
left join todos on todos.user_id = users.id
where todos.users_id is null;


/*
we use count method to count records by specific values, also we can use the keyword "as" and define another name for the showcase.
here we use the inner join to get the records that has 'common'. 
left join brings everything from left table and from right_if they have no common fields, it displays nulls.
*/