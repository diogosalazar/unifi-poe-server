/**
 * Copy credentials.json.dist to credentials.json
 * and replace the values for username, password and url
 * for the target controller
 */
const jsonCredentials = require('./credentials.json')

/**
 * Alternatively, define username, password and url
 * in a .env file, as
 * UNIFI_CONTROLLER_USERNAME=<admin username>
 * UNIFI_CONTROLLER_PASSWORD=<admin password>
 * UNIFI_CONTROLLER_USERNAME=<controller url>
 */
const envCredentials = {
  username: process.env.UNIFI_CONTROLLER_USERNAME,
  password: process.env.UNIFI_CONTROLLER_PASSWORD,
  url: process.env.UNIFI_CONTROLLER_URL
}

module.exports = jsonCredentials || envCredentials
