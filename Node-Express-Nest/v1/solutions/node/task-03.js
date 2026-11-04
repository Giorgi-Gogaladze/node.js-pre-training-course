const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");
const net = require("net");
const { readJsonConfigFile } = require("typescript");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
  // TODO: Implement event loop analysis
  // 1. Create examples showing each event loop phase
  // 2. Demonstrate microtask vs macrotask priority
  // 3. Show execution order with detailed logging
  // 4. Return analysis object with explanations

  const analysis = {
    phases: [
      "timers",
      "pending callbacks",
      "idle, prepare",
      "poll",
      "check",
      "close callbacks",
    ],
    executionOrder: [
      "Synchronous code runs first: Start, then End",
      "process.nextTick callbacks run before Promise microtasks",
      "Promise callbacks run before the next event-loop phase",
      "Timer callbacks run in the timers phase",
      "setImmediate callbacks run in the check phase",
    ],
    explanations: [
      "Synchronous JavaScript runs before event-loop callbacks.",
      "At each callback boundary, Node.js drains process.nextTick callbacks and then Promise microtasks before continuing to another event-loop callback.",
      "Timers and setImmediate callbacks belong to different event-loop phases; their relative order at the top level is not guaranteed.",
      "I/O callbacks are handled in the poll phase, while setImmediate callbacks are handled in the check phase.",
      "Socket close events are handled in the close callbacks phase.",
    ],
  };
  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  // TODO: Implement execution order prediction
  // 1. Analyze the provided code snippets
  // 2. Apply event loop phase rules
  // 3. Consider microtask priority
  // 4. Return predicted order with explanations

  const predictions = {
    snippet1: [
      "Start",       
      "End",      
      "Next Tick 1",  
      "Next Tick 2",
      "Promise 1",  
      "Promise 2",
      "Timer 1",  
      "Timer 2",
      "Immediate 1", 
      "Immediate 2",
    ],
    snippet2: [
      "=== Start ===",          
      "=== End ===",            
      "NextTick",               
      "Nested NextTick",        
      "Timer",                  
      "NextTick in Timer",      
      "Immediate",              
      "NextTick in Immediate",
      "fs.readFile",            
      "NextTick in readFile",
      "Immediate in readFile",  
      "Timer in readFile"
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  // TODO: Fix the race condition in file processing
  // Issues to fix:
  // 1. Race condition in file processing
  // 2. Incorrect error handling
  // 3. Missing await keywords
  // 4. Array index might be wrong due to closure

  const files = ["file1.txt", "file2.txt", "file3.txt"];

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await fsPromises.readFile(file, "utf8");
          return content.toUpperCase();
        } catch (error) {
          if(error.code === "ENOENT"){
            const defaultCaontent = `Content of ${file}`;
            await fsPromises.writeFile(file, defaultCaontent);
            return defaultCaontent.toUpperCase();
          }
          throw error;
        }
      })
    );
    console.log("Race condition fix not implemented yet");
    return results;
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
*/


async function readJSON(fileName){
  let text;
  try {
    text = await fsPromises.readFile(fileName, "utf8");
  } catch (error) {
    if(error.code === 'ENOENT'){
      throw Error(`file no found: ${fileName}`)
    }
    throw error;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`invalid JSON in ${fileName}: ${error.message}`)
  }
}

async function fixCallbackHell(userId) {
  // TODO: Convert callback hell to async/await
  // Issues to fix:
  // 1. Callback hell structure
  // 2. No error handling for JSON.parse
  // 3. Repetitive error handling code
  // 4. No file existence checking
  // 5. Blocking operations

  
  try {
    const user = await readJSON(`user-${userId}.json`);
    const [preferences, activity] = await Promise.all([
      readJSON(`preferences-${user.id}.json`),
      readJSON(`activity-${user.id}.json`),
    ]);

    const combinedData = {
      user, 
      preferences, 
      activity,
      processedAt: `${new Date().toTimeString().slice(0, 10)}-${new Date().toTimeString().slice(11, 19)}`
    }

    await fsPromises.writeFile(
      `processed-${userId}.json`,
      JSON.stringify(combinedData, null, 2)
    );

    return combinedData;
  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  // TODO: Fix mixed promises and callbacks
  // Issues to fix:
  // 1. Mixing promises and callbacks inconsistently
  // 2. Nested async operations without proper chaining
  // 3. Error handling inconsistencies
  // 4. No proper async/await usage

  try {
    console.log("Processing input data...");
    let data;
    try {
      data = await fsPromises.readFile("input.txt", "utf8");
      console.log("Input file read successfully.");
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      data = "hello world";
      await fsPromises.writeFile("input.txt", data, "utf8");
      console.log("Input file was missing; created it with sample data.");
    }

    const processedData = data.toUpperCase();
    await fsPromises.writeFile("output.txt", processedData, "utf8");
    console.log("Processing completed; output file written successfully.");

    const verifiedData = await fsPromises.readFile("output.txt", "utf8");
    if (verifiedData !== processedData) {
      throw new Error("Output verification failed.");
    }
    console.log("Result verified successfully; character count:", verifiedData.length);
    return { input: data, result: verifiedData, length: verifiedData.length };
  } catch (error) {
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */

function runInMacrotask(fn) {
  return new Promise((resolve) => {
    setImmediate(() => fn(resolve))
  })
}

async function demonstrateEventLoop() {
  // TODO: Create comprehensive event loop demonstration
  // 1. Show timers phase (setTimeout, setInterval)
  // 2. Show pending callbacks phase
  // 3. Show poll phase (I/O operations)
  // 4. Show check phase (setImmediate)
  // 5. Show close callbacks phase
  // 6. Demonstrate microtask priority (nextTick, Promises)

  logWithPhase("--- 1. microtask vs macrotask", "sync");
  await runInMacrotask((done) => {
    logWithPhase("sync start", "sync");

    setTimeout(() => {
      logWithPhase("setTimeout callback(macrotask)", "timers");
      done();
    }, 0);

    Promise.resolve().then(() => logWithPhase("promise.then(microtask)", "promise"));
    process.nextTick(() => logWithPhase("process.nextTick (microtask)", "nextTick"))

    logWithPhase("sync end", "sync")
  });




  logWithPhase("--- 3. Pending callbacks: system callbacks ---", "pending");



  logWithPhase("--- 4. Poll & Check phases (fs.readFile) ---", "sync");
  await new Promise((resolve) => {
    fs.readFile(__filename, () => {
      logWithPhase("readFile callback (I/O)", "poll");
      setTimeout(() => {
        logWithPhase("setTimeout 0 ", "timers");
        resolve();
      }, 0);
      setImmediate(() => logWithPhase("setImmediate", "check"));
      process.nextTick(() => logWithPhase("nextTick in readFile", "nextTick"));
    });
  });



  logWithPhase("--- 5. Close callbacks phase (socket) ---", "sync");
  await new Promise((resolve) => {
    const server = net.createServer();

    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();

      const client = net.connect(port, "127.0.0.1", () => {
        logWithPhase("client connected → destroy()", "poll");
        client.destroy();
        setImmediate(() => logWithPhase("setImmediate", "check"));
      });

      client.on("close", () => {
        logWithPhase("socket 'close' event", "close");
        server.close(() => resolve());
      });

      client.on("error", () => resolve());
    });
  });

  logWithPhase("demonsarion finished", "sync");
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  // TODO: Create test files for the exercises
  // 1. Create sample user data files
  // 2. Create input files for processing
  // 3. Handle file creation errors gracefully

  const testData = {
    "user-123.json": {
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    },
    "preferences-123.json": {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    "activity-123.json": {
      lastLogin: "2025-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    },
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };

  try {
    const writes = Object.entries(testData).map(([fileName, content]) => {

      const text =
        typeof content === "string" ? content : JSON.stringify(content, null, 2);

        return fsPromises.writeFile(fileName, text);
    });

    await Promise.all(writes);

    logWithPhase(`Created ${writes.length} test files`, "sync");
  } catch (error) {
    console.error("Failed to create test files:", error.message);
  }
}


const RESET = "\x1b[0m";
const PHASE_COLORS = {
  sync: "\x1b[37m",     // white
  nextTick: "\x1b[35m", // red
  promise: "\x1b[36m",  // sky blue
  timers: "\x1b[33m",   // yellow
  pending: "\x1b[90m",  // gray
  poll: "\x1b[34m",     // blue
  check: "\x1b[32m",    // green
  close: "\x1b[31m",    // dark red
  unknown: "\x1b[0m",
};

function logWithPhase(message, phase = "unknown") {
  const time = new Date().toISOString().slice(11, 23);

  const color = PHASE_COLORS[phase] || PHASE_COLORS.unknown;

  console.log(`${color}[${time}] [${phase.toLowerCase().padEnd(8)}] ${message}${RESET}`);
}



// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  async function runExamples() {
    console.log("🔄 Starting Event Loop Analysis Examples...\n");

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    console.log("=== Event Loop Demonstration ===");
    await demonstrateEventLoop();

    // Analyze execution order
    console.log("\n=== Execution Order Analysis ===");
    const analysis = analyzeEventLoop();
    console.log("Analysis:", analysis);

    // Fix broken code
    console.log("\n=== Fixing Broken Code ===");
    try {
      await fixRaceCondition();
      console.log("✅ Race condition fixed");

      await fixCallbackHell(123);
      console.log("✅ Callback hell converted");

      await fixMixedAsync();
      console.log("✅ Mixed async resolved");
    } catch (error) {
      console.error("❌ Error fixing code:", error.message);
    }
  }

  runExamples();
}
