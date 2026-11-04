const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function processData() {
  console.log("Starting data processing...");

  readFile("input.txt", "utf8")
    .then((data) => {
      console.log("File read successfully");
      const processedData = data.toUpperCase();

      return writeFile("output.txt", processedData);
    })
    .then(() => {
      console.log('file written successfully');
      return readFile("output.txt", "utf8");
    })
    .then((verfyData) => {
      console.log("verifications successl=ful");
      console.log("data length", verfyData.length);
    })
    .catch((err) => {
      if(err.code === 'ENOENT'){
        console.log("red error: input.txt notfound");

        return writeFile("input.txt", "Hello World!")
        .then(() => {
          console.log("created input file, please run again")
        })
      };
      console.error("general error", err)
    });
}

processData();
