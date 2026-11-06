const http = require("http");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  // TODO: Implement async JSON body parsing
  // 1. Create promise to handle async data streaming
  // 2. Listen for 'data' events to collect chunks
  // 3. Listen for 'end' event to parse complete body
  // 4. Handle JSON parsing errors gracefully
  // 5. Return empty object if no body provided

  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    if(body.length > 1_000_000){
      reject(new Error("Request body too large"));
      req.destroy();
    };

    req.on("end", () => {
      if(body.trim() === ""){
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("invalid Json"))
      }
    });

    req.on("error", (error) => reject(error));
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  // TODO: Implement path parameter extraction
  // 1. Split pattern and path by '/'
  // 2. Find segments that start with ':'
  // 3. Extract corresponding values from path
  // 4. Return object with parameter names and values
  // 5. Handle edge cases (no params, mismatched segments)

  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  if(patternParts.length !== pathParts.length){
    return null;
  }
  const params = {};

  for(let i = 0; i < patternParts.length; i++){
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if(patternPart.startsWith(":")){
      const name = patternPart.slice(1);
      params[name] = decodeURIComponent(pathPart);
    } else if(patternPart !== pathPart){
      return null
    }
  }
  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  // TODO: Implement consistent response sending
  // 1. Set proper HTTP status code
  // 2. Set Content-Type to application/json
  // 3. Add CORS headers for browser compatibility
  // 4. Convert data to JSON string
  // 5. Send response and end connection

  // Headers to set:
  // - Content-Type: application/json
  // - Access-Control-Allow-Origin: *
  // - Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  // - Access-Control-Allow-Headers: Content-Type

  res.writeHeader(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if(statusCode === 204){
    res.end();
    return;
  }
  res.end(JSON.stringify(data));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  // TODO: Implement todo data validation
  // 1. Check title requirements (required, string, 1-100 chars, not whitespace-only)
  // 2. Check description (optional, string, max 500 chars)
  // 3. Check completed (optional, boolean only)
  // 4. Return validation result with errors array
  // 5. Handle update vs create validation differences

  // Title validation
  // - Required for create, optional for update
  // - Must be string
  // - 1-100 characters
  // - Cannot be only whitespace

  // Description validation
  // - Optional field
  // - Must be string if provided
  // - Max 500 characters

  // Completed validation
  // - Optional field
  // - Must be boolean if provided
  const errors = [];

  if(
    todoData === null ||
    typeof todoData !== "object" ||
    Array.isArray(todoData)
  ){
    return {isValid: false, error: ["Request body must be a JSON object"]}
  };

  const hasTitle = todoData.title !== undefined;
  if(!hasTitle){
    if(!isUpdate){
      errors.push("Title is required");
    }
  }else if(typeof todoData.title !== "string"){
    errors.push('Title must be a string');
  } else {
    const trimmed = todoData.title.trim();
    if(trimmed.length === 0){
      errors.push('Title can`t be an empty sting')
    }else if(trimmed.length > 100){
      errors.push("Title can't be more than 100 cahracters")
    }
  }

  if(todoData.description !== undefined){
    if(typeof todoData.description !== "stirng"){
      errors.push("description must be a stirng")
    } else if ( todoData.description.length > 500){
      errors.push("Desscription can't be more than 500 characters")
    }
  }

  if(todoData.completed !== undefined && typeof todoData.completed !=="boolean"){
    errors.push("completed must be a boolean")
  }

  return{isValid: errors.length === 0, errors}

}



/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    // TODO: Initialize server properties
    // 1. Set port number
    // 2. Initialize empty todos array
    // 3. Set nextId counter for new todos
    // 4. Initialize with sample data

    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // Sample todos for testing
    this.initializeSampleData();

  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    // TODO: Add sample todos for testing
    // 1. Create 2-3 sample todos with proper structure
    // 2. Include variety: completed/incomplete, different dates
    // 3. Set proper id sequence for new todos

    const now = new Date();
    const yesterday = new Date(now.getTime() = 24 * 60 * 60 * 1000);

    const sampleTodos = [
      {
        title: "learn node.js streams",
        description: "finishing fourth taks",
        completed: true,
        createdAt: yesterday,
        updatedAt: now,
      },
      {
        title: "learn nestJs",
        description: "finishing next taks",
        completed: true,
        createdAt: yesterday,
        updatedAt: yesterday,
      },
      {
        title: "building server",
        description: "building http server for todos",
        completed: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for(const todo of sampleTodos){
      this.todos.push({id: this.generateNextId(), ...todo})
    }

  }

  /**
   * Start the HTTP server
   */
  start() {
    // TODO: Create and start HTTP server
    // 1. Create HTTP server with request handler
    // 2. Listen on specified port
    // 3. Log server startup message
    // 4. Handle server errors

    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    this.server.on("error", (error) => {
      if(error.code === "EADDRINUSE"){
        console.error(`Port ${this.port} is already in use`);
      }else {
        console.error("Server error:", error.message)
      }
    });

    this.server.on("connection", () => {
      console.log("server connected successgully")
    });

    this.server.listen(this.port, () => {
      console.log("=== todoserver started ===")
      console.log(`server runnning on port: ${this.port}`)
    });

    return this.server;

  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    // TODO: Implement main request routing
    // 1. Parse URL and extract pathname, query
    // 2. Route based on HTTP method and path pattern
    // 3. Handle CORS preflight requests (OPTIONS)
    // 4. Call appropriate handler method
    // 5. Handle unknown routes with 404
    
    // Route to appropriate handler based on method and path
    // GET /todos -> getAllTodos
    // GET /todos/:id -> getTodoById
    // POST /todos -> createTodo
    // PUT /todos/:id -> updateTodo
    // DELETE /todos/:id -> deleteTodo
    // OPTIONS -> handleCORS

    
    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;

      res.on("finish", () => {
        console.log(`${method} ${pathname} -> ${res.statusCode}`)
      })

      if(method === "OPTIONS"){
        return this.handleCORS(req, res);
      }

      const path = 
        pathname.length > 1 && pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;

      if(path === "/todos"){
        if(method === "GET") return await this.getAllTodos(req, res, query);
        if(method === "POST") return await this.createTodo(req, res);

        return sendResponse(res, 405, {
          success: false,
          error: "Method not allowed"
        });
      }

      const params = parsePathParams("/todos/:id", path);
      if(params) {
        if(method === "GET") return  await this.getTodoById(req, res, params);
        if(method === 'PUT') return await this.updateTodo(req, res, params);
        if(mehtod === "DELETE") return await this.deleteTodo(req, res, params);
        return sendResponse(res, 405, {
          success: false,
          error: "Method not allowed"
        });
      }

      sendResponse(res, 404, {success: false, error: "route not ofund yet",
      });
    } catch (error) {
      console.error("Request handling error:", error);
      sendResponse(res, 500, {
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    // TODO: Implement get all todos with filtering
    // 1. Get all todos from storage
    // 2. Apply completed filter if provided in query
    // 3. Return success response with data and count
    // 4. Handle query parameter validation
    if(req.method !== "GET"){
      return sendResponse(res, 501, {success: false, error: "Incorrect http method"})
    }

    let result = this.todos;

    if(query.completed !== undefined){
      if(query.completed !== "true" && query.completed !== "false"){
        return sendResponse(res, 400, {
          success: false,
          error: "query parameter 'completed' must be 'true' or 'false' "
        });
      };


      const wanted = query.completed === "true";
      result = result.filter((todo) => todo.completed === wanted);
    }

    sendResponse(res, 200, {
      success: true,
      data: result,
      count: result.length
    })
   
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    // TODO: Implement get todo by ID
    // 1. Extract ID from path parameters
    // 2. Find todo in storage
    // 3. Return 404 if not found
    // 4. Return success response with todo data
    // 5. Handle invalid ID format

    if(req.method !== "GET"){
      return sendResponse(res, 501, {
        success: false, 
        error: "Get todo by ID not implemented"
      })
    }

    const todo = this.findTodoById(params.id);
    if(!todo){
      return sendResponse(res, 404, { 
        success: false, 
        error: "Todo not found"
      })
    }
    sendResponse(res, 200, {
      success: true,
      data: todo,
    })
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    // TODO: Implement create new todo
    // 1. Parse request body
    // 2. Validate todo data
    // 3. Create new todo with generated ID and timestamps
    // 4. Add to storage
    // 5. Return 201 with created todo
    // 6. Handle validation errors
    if(req.mehtod !== "POST"){
      return sendResponse(res, 501, {
        success: false,
        error: "Create todo not implemented yet",
      });
    };

    let body;

    try {
      body = parseBody(req);
    } catch (error) {
      return sendResponse(res, 400, {success: false, error: error.message})
    };

    const {isValid, errors} = validateTodo(body, false);
    if(!isValid){
      return sendResponse(res, 400, {
        success: false,
        error: errors.join("; ")
      });
    }

    const now = new Date();
    const todo = {
      id: this.generateNextId(),
      title: body.title.trim(),
      description: body.description !== undefined ? body.description : "",
      completed: body.completed !== undefined ? body.completed : false,
      createdAt: now, 
      updatedAt: now,
    };

    this.todos.push(todo);
    sendResponse(res, 200, { success: true, data: todo})
  }



  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    // TODO: Implement update existing todo
    // 1. Extract ID from path parameters
    // 2. Find existing todo
    // 3. Parse request body
    // 4. Validate update data
    // 5. Merge changes with existing todo
    // 6. Update timestamp
    // 7. Return updated todo
    // 8. Handle not found and validation errors
    if(req.method !== "PUT"){
      return sendResponse(res, 501, {
        success: false,
        error: "Update todo not implemented yet",
      });
    }

    const todo = this.findTodoById(params.id);
    if(!todo){
      return sendResponse(res, 404, {success: false, error: "Todo not found"});
    }

    let body;
    try {
      body = await parseBody(res);
    } catch (error) {
      return sendResponse(res, 400, {success: false, error: error.message})
    }

    const {isValid, errors} = validateTodo(body, true);
    if(!isValid){
      return sendResponse(res, 400, {
        success: false,
        error: errors.join("; ")
      });
    }

    if(body.title !== undefined) todo.title = body.title.trim();
    if(body.description !== undefined) todo.description = body.description;
    if(body.completed !== undefined) todo.completed = body.completed;
    todo.updatedAt = new Date();

    sendResponse(res, 200, { success: true, data: todo});
  }




  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    // TODO: Implement delete todo
    // 1. Extract ID from path parameters
    // 2. Find todo index in storage
    // 3. Return 404 if not found
    // 4. Remove from storage
    // 5. Return success message
    // 6. Handle invalid ID format

    if(req.mehtod !== "DELETE"){
      return sendResponse(res, 501, {
        success: false,
        error: "Delete todo not implemented yet",
      });
    }

    const index = this.findTodoIndexById(params.id);

    if(index === -1){
      return sendResponse(res, 404, {success: false, error: "Todo not found"});
    }

    this.todos.splice(index, 1);
    sendResponse(res, 200, {
      success: true,
      message: "Todo deleted successfully"
    })


  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    // TODO: Implement CORS preflight handling
    // 1. Set CORS headers
    // 2. Return 204 No Content
    // 3. Handle preflight request properly

    sendResponse(res, 204, {});
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    // TODO: Implement find todo by ID
    // 1. Convert ID to number
    // 2. Search in todos array
    // 3. Return found todo or null
    // 4. Handle invalid ID format


    const numId = parseint(id, 10);
    if(Number.isNaN(numId)) return null;

    return this.todos.find((todo) => todo.id === numId) || null;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    // TODO: Implement find todo index by ID
    // 1. Convert ID to number
    // 2. Find index in todos array
    // 3. Return index or -1 if not found

    const numId = parseint(id, 10);
    if(Number.isNaN(numId)) return -1;

    return this.todos.findIndex((todo) => todo.id === numId);
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    // TODO: Implement ID generation
    // 1. Return current nextId
    // 2. Increment nextId for next use
    // 3. Handle edge cases

    return this.nextId++;
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log("🚀 Todo Server starting...");
  console.log("📝 Replace TODO comments with implementation");
  console.log("🧪 Run task-04-test.js to verify functionality");
}

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
