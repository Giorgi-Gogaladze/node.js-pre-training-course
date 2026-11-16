const express = require('express');
const app = express();

const logger = require('./task_one/logger');
const timer = require('./task_one/timer');
const headerInjector = require('./task_one/header-injector')
const usersRouter = require("./task-two/routes/user");
const HttpError = require("./task-two/routes/HttpError")
const errorHandler = require("./task-two/routes/errorHandler");

app.use(logger);
app.use(timer);
app.use(headerInjector);

const PORT = 3000;

app.get("/error/http", () => {
  throw new HttpError(404, "Resource not found");
});

app.get("/error/crash", () => {
  throw new Error("Database exploded");
});

app.get("/error/async", async () => {
  await Promise.resolve();
  throw new HttpError(403, "Forbidden from async");
});


app.get('/', (req, res) => {
    res.json({ message: "hello from express"})
});

app.use("/users", usersRouter);

app.use((req, res, next) => {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${3000}`)
})
