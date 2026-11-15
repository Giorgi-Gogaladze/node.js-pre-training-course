const express = require('express');
const app = express();

const logger = require('./task_one/logger');
const timer = require('./task_one/timer');
const headerInjector = require('./task_one/header-injector')
const usersRouter = require("./task-two/routes/user");

app.use(logger);
app.use(timer);
app.use(headerInjector);

const PORT = 3000;

app.get('/', (req, res) => {
    res.json({ message: "hello from express"})
});

app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${3000}`)
})
