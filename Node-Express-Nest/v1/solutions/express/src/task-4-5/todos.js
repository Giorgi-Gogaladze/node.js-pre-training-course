const express = require("express");
const todoService = require("./todoService");
const vlaidateTodo = require("./validateTodo");
const HttpError = require("../task-two/routes/HttpError");

const router = express.Router();



router.param("id", (req, res, next, value) => {
  if (!/^\d+$/.test(value)) {
    return next(new HttpError(400, "id must be a number"));
  }
  req.todoId = Number(value);
  next();
});


router.get("/", (req, res) => {
  const { completed } = req.query;
  let filter;
  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      throw new HttpError(400, "completed must be 'true' or 'false'");
    }
    filter = completed === "true";
  }
  const data = todoService.findAll(filter);
  res.json({ success: true, data, count: data.length });
});


router.get("/:id", (req, res) => {
  res.json({ success: true, data: todoService.findById(req.todoId) });
});



router.post("/", validateTodo({ isCreate: true }), (req, res) => {
  const todo = todoService.create(req.body);
  res.status(201).json({ success: true, data: todo });
});


router.put("/:id", validateTodo({ isCreate: false }), (req, res) => {
  const todo = todoService.update(req.todoId, req.body);
  res.json({ success: true, data: todo });
});


router.delete("/:id", (req, res) => {
  todoService.remove(req.todoId);
  res.json({ success: true, message: "Todo deleted successfully" });
});



module.exports = router;