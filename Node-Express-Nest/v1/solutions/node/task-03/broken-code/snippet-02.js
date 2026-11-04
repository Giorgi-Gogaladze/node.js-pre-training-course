const fs = require("fs/promises");

async function processUserData(userId) {
  try {
    const userData = await fs.readFile(`user-${userId}.json`, "utf8");
    const user = JSON.parse(userData);

    const prefData = await fs.readFile(`preferences-${user.id}.json`, "utf8");
    const preferences = JSON.parse(prefData);

    const activityData = await fs.readFile(`activity-${user.id}.json`, "utf8");
    const activity = JSON.parse(activityData);

    const combinedData = {
      user, 
      preferences,
      activity,
      processedAt: `${new Date().toISOString().slice(0, 10)} at ${new Date().toTimeString().slice(0, 9)}`
    };

    await fs.writeFile(
      `processed-${userId}.json`,
      JSON.stringify(combinedData, null, 2)
    );

    return combinedData;
  } catch (error) {
    throw error; 
  }
}

processUserData(123)
  .then(result => console.log('Success: ', result))
  .catch(error => console.log('Error:', error.message));