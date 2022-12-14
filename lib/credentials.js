const fs = require('fs');

let argumentFileCredentials
try {
  const commandLineArgs = process.argv.slice(2);
  const argumentFilename = commandLineArgs[0]
  if(argumentFilename) {
    const argumentFile = fs.readFileSync(argumentFilename)
    argumentFileCredentials = JSON.parse(argumentFile);
  }
} catch(err) {
  /* Quietly fail if file doesn't exist */
}

/**
 * Copy credentials.json.dist to credentials.json
 * and replace the values for username, password and url
 * for the target controller
 */
let jsonCredentials
try {
  jsonCredentials = require('../credentials.json')
} catch(err) {
  /* Quietly fail if file doesn't exist */
}

/**
 * Alternatively, define username, password and url
 * in a .env file, as
 * UNIFI_POE_USERNAME=<admin username>
 * UNIFI_POE_PASSWORD=<admin password>
 * UNIFI_POE_USERNAME=<controller url>
 */
const envCredentials = {
  username: process.env.UNIFI_POE_USERNAME,
  password: process.env.UNIFI_POE_PASSWORD,
  url: process.env.UNIFI_POE_URL
}

module.exports = argumentFileCredentials || jsonCredentials || envCredentials
