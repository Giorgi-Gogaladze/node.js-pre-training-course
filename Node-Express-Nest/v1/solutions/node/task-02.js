const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    // TODO: Implement CSV parsing
    // 1. Convert chunk to string and add to buffer
    // 2. Split buffer by newlines
    // 3. Keep last incomplete line in buffer
    // 4. Process complete lines:
    //    - First line: extract headers
    //    - Other lines: create objects with headers as keys
    // 5. Push objects to next stream

    this.buffer += chunk.toString();

    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop();

    try {
      for(const line of lines){
        this._processLine(line)
      }
      callback();
    } catch (error) {
      callback(error)
    }
  }

  _flush(callback) {
    // TODO: Process any remaining data in buffer
    try {
      if (this.buffer.length > 0) {
        this._processLine(this.buffer);
        this.buffer = "";
      }
      callback();
    } catch (error) {
      callback(error);
    }
  };



  _processLine(line) {
    this.lineNumber++;
    if (line.trim() === "") return; // ცარიელი ხაზი გამოვტოვოთ

    const values = this._parseLine(line);

    // პირველი ხაზი = სათაურები
    if (!this.headers) {
      this.headers = values;
      return;
    }

    if (values.length !== this.headers.length) {
      throw new Error(
        `Malformed CSV at line ${this.lineNumber}: expected ${this.headers.length} columns, got ${values.length}`
      );
    }

    const record = {};
    this.headers.forEach((header, i) => {
      record[header] = values[i];
    });
    this.push(record);
  }

  _parseLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());
    return values;
  }
}

/**
 * Data Transformer Stream
 * Applies transformations to each record
 */
class DataTransformer extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
    // TODO: Apply transformations to record
    // 1. Capitalize name using capitalizeName()
    // 2. Normalize email using normalizeEmail()
    // 3. Format phone using formatPhone()
    // 4. Standardize date using standardizeDate()
    // 5. Capitalize city name
    // 6. Push transformed record
    const transformed = {
      ...record,
      name: capitalizeName(record.name),
      email: normalizeEmail(record.email),
      phone: formatPhone(record.phone),
      birthdate: standardizeDate(record.birthdate),
      city: capitalizeName(record.city),
    };

    this.push(transformed);
    callback();
  }
}

/**
 * CSV Writer Transform Stream
 * Converts objects back to CSV format
 */
class CSVWriter extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    // TODO: Initialize properties
    // - this.headerWritten = false;
  }

  _transform(record, encoding, callback) {
   const keys = Object.keys(record);

    // პირველ ჩანაწერზე ჯერ სათაურების ხაზი
    if (!this.headerWritten) {
      this.push(keys.map((k) => this._escape(k)).join(",") + "\n");
      this.headerWritten = true;
    }

    this.push(keys.map((k) => this._escape(record[k])).join(",") + "\n");
    callback();
  }

  // მნიშვნელობა ბრჭყალებში, თუ შეიცავს მძიმეს, ბრჭყალს ან ახალ ხაზს
  _escape(value) {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}

/**
 * Helper Functions
 */

/**
 * Capitalize names properly
 * @param {string} name - Name to capitalize
 * @returns {string} Capitalized name
 */
function capitalizeName(name) {
  // TODO: Implement name capitalization
  // 1. Handle empty/null names
  // 2. Split by spaces and hyphens
  // 3. Capitalize each part
  // 4. Join back together
  // Examples:
  // "john doe" → "John Doe"
  // "mary-jane smith" → "Mary-Jane Smith"

  if(!name || typeof name !== "string") return name;

  return name
    .trim()
    .toLocaleLowerCase()
    .split(" ")
    .map((word) => 
      word
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() +part.slice(1))
        .join("-")
    )
    .join(" ")
}



/**
 * Normalize email addresses
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email or original if invalid
 */
function normalizeEmail(email) {
  // TODO: Implement email normalization
  // 1. Convert to lowercase
  // 2. Validate basic email format (contains @ and .)
  // 3. Return normalized email or original if invalid

  if(!email || typeof email !== "string") return email;

  const normalized = email.trim().toLocaleLowerCase();
  const isValid = normalized.includes("@") && normalized.includes(".")

  return isValid ? normalized : email;

}

/**
 * Format phone numbers
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone or "INVALID"
 */
function formatPhone(phone) {
  // TODO: Implement phone formatting
  // 1. Extract only digits
  // 2. Check if exactly 10 digits
  // 3. Format as (XXX) XXX-XXXX
  // 4. Return "INVALID" if not valid

  if(!phone) return "INVALID";

  const digits = String(phone).replace(/\D/g, "")
  if(digits.length !== 10) return "INVALID";
  
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Standardize date formats
 * @param {string} date - Date to standardize
 * @returns {string} Date in YYYY-MM-DD format
 */
function standardizeDate(date) {
  // TODO: Implement date standardization
  // 1. Handle different input formats:
  //    - MM/DD/YYYY
  //    - YYYY-MM-DD
  //    - YYYY/MM/DD
  // 2. Convert to YYYY-MM-DD format
  // 3. Validate date is real
  // 4. Return original if invalid

  if(!date || typeof date !== "string") return date;

  const value = date.trim();
  let year, month, day;

  let match;
  if((match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) {
    [, month, day, year] = match;
  } else if((match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/))) {
    [, year, month, day] = match;
  } else {
    return date;
  }

  
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const check = new Date(y, m -1, d);
  if(
    check.getFullYear() !== y || 
    check.getMonth() !== m -1 ||
    check.getDate() !== d
  ){
    return date;
  }

  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * Main function to process CSV file
 * @param {string} inputPath - Path to input CSV file
 * @param {string} outputPath - Path to output CSV file
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function processCSVFile(inputPath, outputPath) {
  // TODO: Implement the main processing pipeline
  // 1. Create read stream from input file
  // 2. Create transform streams (CSVParser, DataTransformer, CSVWriter)
  // 3. Create write stream to output file
  // 4. Use pipeline() to connect all streams
  // 5. Handle errors appropriately
  // 6. Return promise that resolves when complete
  if(!inputPath || !outputPath) {
    throw new Error("Input and output file paths are required");
  }

  try {
    await pipeline(
    fs.createReadStream(inputPath),
    new CSVParser(),
    new DataTransformer(),
    new CSVWriter(),
    fs.createWriteStream(outputPath)
    );
  } catch (error) {
    if(error.code === 'ENOENT') {
      throw new Error(`Failed to process CSV file: input file not found (${inputPath})`);
    }
    if (error.code === "EACCES" || error.code === "EPERM") {
      throw new Error(`Failed to process CSV file: permission denied (${error.path})`);
    }
    throw new Error(`failed to porcess CVS file: ${error.message}`)
  }
}

/**
 * Create sample input data for testing
 */
function createSampleData() {
  // TODO: Create data directory and sample CSV file
  // 1. Create 'data' directory if it doesn't exist
  // 2. Write sample CSV data as specified in task description

  const dir = "data";
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});

    const csv = [
    "name,email,phone,birthdate,city",
    "john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york",
    "jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles",
    "bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago",
    "alice brown,alice.brown@company.org,9876543210,1988/07/04,houston",
  ].join("\n") + "\n";

  fs.writeFileSync(`${dir}/users.csv`, csv);
}
}

// Export classes and functions
module.exports = {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  createSampleData,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  // Create sample data
  createSampleData();

  // Process the file
  processCSVFile("data/users.csv", "data/users_transformed.csv")
    .then(() => {
      console.log("✅ File transformation completed successfully!");

      // Read and display results
      const output = fs.readFileSync("data/users_transformed.csv", "utf-8");
      console.log("\n📄 Transformed CSV output:");
      console.log(output);
    })
    .catch((error) => {
      console.error("❌ Error processing file:", error.message);
    });
}
