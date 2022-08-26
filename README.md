# Unifi PoE Server

Express server that exposes control of PoE ports on compatible Unifi devices via REST API.
It just works!

## Installation

Have node installed on your system as a prerequisite

```bash
# Install the server globally
npm install -g diogosalazar/unifi-poe-server
```

Start the server by running from a command prompt or terminal:

```bash
# start the server
unifi-poe-server
```

## Starting the server from source

Clone this repository and configure your controller credentials.

```bash
# Clone the repository
git clone https://github.com/diogosalazar/unifi-poe-server.git

# Change into the cloned directory
cd unifi-poe-server

# Install dependencies
npm install
```

Start the server by running at the root of the `unifi-poe-server` folder:

```bash
# start the server
node index.js
```
The server should start at `http://localhost:3000`.

## API Endpoints

Send a GET request to query a port status: `http://localhost:3000/unifi-poe/[device-name]/[port-index]`

Send a POST request to set a port status: `http://localhost:3000/unifi-poe/[device-name]/[port-index]/[port-status]`

Where `[device-name]` corresponds to the name of the device registered with the target controller that has the PoE port to be controlled/queried, `[port-index]` corresponds to the port number, and `[port-status]` should be one of `off` or `auto` to set a new port mode.

### Return values and Errors

The PoE port can be set to an 'on' or 'off' value, where on signifies power is available at the port for compatible connected devices, and off signifies the port transmits data but does not provide power to any connect devices on that port.

In the API, the 'on' value corresponds to `auto` and the 'off' value corresponds to `off`.

A successful GET request to query a port status will return a JSON object with the port PoE mode.

Example response for a port with PoE disabled:
```json
{
  "poe_mode": "off",
}
```

Example response for a port with PoE enabled:
```json
{
  "poe_mode": "auto",
}
```

A successful POST request to set a new PoE mode will return a JSON object indicating whether the request was successful or not:

Example for successful request setting a new PoE mode:
```json
{
  "success": true,
}
```

Example for failed request setting a new PoE mode:
```json
{
  "error": "Invalid credentials",
}
```
