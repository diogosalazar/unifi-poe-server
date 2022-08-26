const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const unifiPoE = require('./unifi-poe')

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.get('/unifi-poe/:device_name/:port_idx', async (req, res) => {
  try {
    const poe_mode = await unifiPoE.getPoEPortMode(req.params.device_name, req.params.port_idx, req.query.site_name)
    res.json({
      poe_mode
    })
  } catch (error) {
    res.json({ error: error.message })
  }
});

app.post('/unifi-poe/:device_name/:port_idx/:poe_mode', async (req, res) => {
  try {
    await unifiPoE.setPoEPortMode(req.params.device_name, req.params.port_idx, req.params.poe_mode, req.query.site_name)
    res.json({
      success: true
    })
  } catch (error) {
    res.json({ error: error.message })
  }
});

module.exports = {
  start(port) {
    // starting the server
    app.listen(port, () => {
      console.log(`Unifi PoE server listening on port ${port}`);
    });
  }
}
