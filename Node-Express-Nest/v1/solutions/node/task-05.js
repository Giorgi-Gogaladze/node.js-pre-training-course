const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");


function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    // TODO: implement daily stats tracking
    // - use YYYY-MM-DD date keys
    // - track created, updated, deleted, views per day
    const day = new Date().toISOString().slice(0, 10);

    if(!this.stats.dailyStats[day]){
      this.stats.dailyStats[day] = {
        created: 0, 
        updated: 0, 
        deleted: 0, 
        views: 0
      };
    }
    this.stats.dailyStats[day][field]++;
  }


  trackCreated() {
    this.stats.totalCreated++;
    this._bumpDaily('created')
  }

  trackUpdated() {
    this.stats.totalUpdated++;
    this._bumpDaily('updated')
  }

  trackDeleted() {
    this.stats.totalDeleted++;
    this._bumpDaily('deleted')
  }

  trackViewed() {
    this.stats.totalViews++;
    this._bumpDaily('views')
  }

  trackError() {
    this.stats.errors++;
  }

  getStats() {
    return JSON.parse(JSON.stringify(this.stats));
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`
    );
  }
  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`
    );
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  // TODO: implement full validation logic
  // - title: required, non-empty string
  // - description: optional, string
  // - completed: optional, boolean (default false)

  if(payload === null || typeof payload !== "object" || Array.isArray(payload)){
    return {errors: ['Request body must be a json object'], values: out};
  }

  if(payload.title === undefined){
    if(isCreate) errors.push('Title is required')
  } else if(typeof payload.title !== "string"){
    errors.push('Title must be a string')
  } else {
    const title = payload.title.trim();
    if(title.length === 0){
      errors.push("Title can't be empty or whitespace");
    } else if(title.length > 100){
      errors.push("Title can't be more than 100 chars")
    } else{
      out.title = title;
    }
  }

  if(payload.description !== undefined){
    if(typeof payload.description !== "string"){
      errors.push("DEscription must be a string")
    }else if(payload.description.length > 500){
      errors.push("Description cant be more than 500 characters")
    } else {
      out.description = payload.description;
    }
  };

  if(payload.completed !== undefined){
    if(typeof payload.completed !== "boolean"){
      errors.push("completed must be a boolean")
    } else {
      out.completed = payload.completed;
    }
  }


  if(isCreate){
    if(out.description === undefined) out.description = "";
    if(out.completed === undefined) out.completed = false;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;


    // TODO: initialize analytics tracker
    // TODO: initialize logger
    // TODO: initialize recent events list keeping last 100 events
    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger();
    this.recentEvents = [];

    this.server = null;

    this._wireDefaultListeners();
  }


  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));

    // Analytics
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }

  /**
   * Start the server
   */
  async start() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this._handleRequest(req, res).catch(() => {
          if(!res.headersSent){
            sendJson(res, 500, {success: false, error: "Internal server error"})
          }
        });
      });

      this.server.once("error", reject);

      this.server.listen(this.port, () => {
        this.server.removeListener("error", reject);
        console.log("---todo server started---");
        console.log(`Server running on http://localhost:${this.port}`);
        resolve();
      })

    })
  }

  /**
   * Stop the server
   */
  async stop() {
    if(!this.server) return;

    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        this.server = null;
        error ? reject(error) : resolve();
      });
      this.server.closeAllConnections?.();
    })

  }

  /**
   * Handle incoming requests
   */

  async _handleRequest(req, res) {
    // TODO: implement CORS preflight handling
    // TODO: implement routes:
    // - /todos (GET, POST)
    // - /todos/:id (GET, PUT, DELETE)
    // - /analytics (GET)
    // - /events (GET)
    // TODO: emit events for CRUD, errors, validation, etc.
    // TODO: send JSON responses with proper status codes

    const {pathname, query} = url.parse(req.url, true);
    const method = req.method

    const path = 
      pathname.length > 1 && pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;

    this._lastEmitted = null;
    res.on("finish", () => {
      const emitted = this._lastEmitted ? ` | emitted: ${this._lastEmitted}` : "";
      console.log(` ${method} ${pathname} -> ${res.statusCode} ${emitted}`)
    });

    try {
      if(method === 'OPTIONS'){
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        return res.end();
      }


      if(path ==="/todos"){
        if(method === "GET") return this._handleList(req, res, query);
        if(method === "POST") return await this._handleCreate(req, res);
        return sendJson(res, 405, {success: false, error: "Method not allowed" });
      }

      if(path === "/analytics"){
        if(method !== "GET"){
          return sendJson(res, 405, {success: false, error: "Method not allwoed"});
        }
        return sendJson(res, 200, {success: true, data: this.analytics.getStats()});
      };

      if(path === "/events"){
        if(method !== "GET"){
          return sendJson(res, 405, {success: false, error: "Method not allowed"});
        }
        const last = Number(query.last);
        const count = Number.isInteger(last) && last > 0 ? last : 10;
        return sendJson(res, 200, {
          success: true,
          data: this.recentEvents.slice(-count),
        });
      }  

      if(/^\/todos\/[^/]+$/.test(path)){
        const id = parseIdFromPath(path);

        if(id === null){
          this._emitEvent("todoNotFound", req, {
            todoId: path.split("/")[2],
            operation: method,
          });
          return sendJson(res, 404, {success: false, error: "Todo not found"});
        }

        if (method === "GET") return this._handleGet(req, res, id);
        if (method === "PUT") return await this._handleUpdate(req, res, id);
        if (method === "DELETE") return this._handleDelete(req, res, id);
        return sendJson(res, 405, { success: false, error: "Method not allowed" });
      }
      sendJson(res, 404, {success: false, error: "Route not found"})
    } catch (error) {
      this._emitEvent("serverError", req, {
        error, 
        operation: `${method} ${pathname}`,
      });

      if(!res.headersSent){
        sendJson(res, 500, {success: false, error: "Internal server error"});
      }
    }
  }


  _handleList(req, res, query){
    let result = this.todos;
    const filters = {};

    if(query.completed !== undefined){
      if(query.completed !== "true" && query.completed !== "false"){
        const errors = ["Query parameter 'completed' muts  be 'true' or 'false'"];
        this._emitEvent("validationError", req, {errors, data: query});
        return sendJson(res, 400, {success: false, error: errors.join("; ")});
      }
      const wanted = query.completed === "true";
      filters.completed = wanted;
      result = result.filter((t) => t.completed === wanted);
    }

    this._emitEvent("todoListed", req, {
      todos: result,
      count: result.length,
      filters,
    });
    sendJson(res, 200, { success: true, data: result, count: result.length });
  }



  _handleGet(req, res, id){
    const todo = this.todos.find((t) => t.id === id);

    if(!todo){
      this._emitEvent("todoNotFound", req, {todoId: id, operation: "GET"});
      return sendJson(res, 404, {success: false, error: "Todo not found"});
    }

    this._emitEvent("todoViewed", req, {todo});
    sendJson(res, 200, {success: true, data: todo});
  }


  _requestInfo(req){
    return{
      method: req.method,
      url: req.url, 
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.socket?.remoteAddress,
    }
  }


  async _handleCreate(req, res){
    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
       this._emitEvent("validationError", req, {
        errors: [error.message],
        data: null,
      });
      return sendJson(res, 400, { success: false, error: error.message });
    }

    const { errors, values } = validateTodoPayload(body, true);
    if (errors.length > 0) {
      this._emitEvent("validationError", req, { errors, data: body });
      return sendJson(res, 400, { success: false, error: errors.join("; ") });
    }

    const now = nowISO();
    const todo = {
      id: this.nextId++,
      ...values,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.push(todo);

    this._emitEvent("todoCreated", req, { todo });
    sendJson(res, 201, { success: true, data: todo });    
}


  async _handleUpdate(req, res, id) {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      this._emitEvent("todoNotFound", req, { todoId: id, operation: "PUT" });
      return sendJson(res, 404, { success: false, error: "Todo not found" });
    }

    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      this._emitEvent("validationError", req, {
        errors: [error.message],
        data: null,
      });
      return sendJson(res, 400, { success: false, error: error.message });
    }

    const { errors, values } = validateTodoPayload(body, false);
    if (errors.length > 0) {
      this._emitEvent("validationError", req, { errors, data: body });
      return sendJson(res, 400, { success: false, error: errors.join("; ") });
    }

    const oldTodo = { ...todo };

    const changes = Object.keys(values).filter((key) => values[key] !== todo[key]);

    Object.assign(todo, values); 
    todo.updatedAt = nowISO();

    this._emitEvent("todoUpdated", req, { oldTodo, newTodo: todo, changes });
    sendJson(res, 200, { success: true, data: todo });
}

  _handleDelete(req, res, id){
    const index = this.todos.findIndex((t) => t.id === id);
    if(index === -1){
      this._emitEvent("todoNotFound", req, {todoId:id, operation: "DELETE"});
      return sendJson(res, 404, {success: false, error: "Todo not found"});
    }

    const [todo] = this.todos.splice(index, 1);
    this._emitEvent("todoDeleted", req, {todo});
    sendJson(res, 200, {success: true, message: "todo deleted successfully"})
  }


  _emitEvent(eventType, req, payload){
    this._lastEmitted = eventType;
    this.emit(eventType, {
      ...payload, 
      timestamp: nowISO(),
      requestInfo: this._requestInfo(req)
    })
  }
}

module.exports = { TodoServer };

if(require.main === module){
  const server = new TodoServer(3000);
  server.start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}