const { Controller } = require('unifi-client')
const controllerCredentials = require('./credentials')

const POE_MODES = {
  OFF: 'off',
  AUTO: 'auto'
}

let _initializedController = null

async function getController() {
  if(!_initializedController) {
    if(!controllerCredentials || !controllerCredentials.url) {
      throw new Error('Invalid credentials')
    }
    const controller = new Controller({
      ...controllerCredentials,
      strictSSL: false,
    });

    controller.auth.autoReLogin = true
    const user = await controller.login()
    if(!user) throw new Error('Unable to initialize controller')
    _initializedController = controller
  }

  return _initializedController
}

async function getSite(site_name = 'default') {
  // Get controller
  const controller = await getController()

  // Find the target site
  const sites = await controller.getSites()
  const targetSite = sites.find(site => site.name == site_name)
  if(!targetSite) throw new Error(`No site with name '${site_name}'`)

  return targetSite
}

async function getDevice(device_name, site_name = 'default') {
  // Get site
  const targetSite = await getSite(site_name)

  // Find the target device
  const devices = await targetSite.devices.list()
  const targetDevice = devices.find(device => device.name == device_name)
  if(!targetDevice) throw new Error(`No device with name '${device_name}' at site '${site_name}'`)

  return targetDevice
}

function getPort(device, port_idx) {
  // Check if port exits in the device
  const targetPort = device.portTable.find(port => port.port_idx == port_idx)
  if(!targetPort) throw new Error(`No port with index ${port_idx} on device '${device.name}' at site '${device.site.name}'`)

  return targetPort
}

async function getPoEPortMode(device_name, port_idx, site_name = 'default') {
  // Get device
  const targetDevice = await getDevice(device_name, site_name)

  // Get port
  const port = getPort(targetDevice, port_idx)

  return port.poe_mode
}

async function setPoEPortMode(device_name, port_idx, poe_mode, site_name = 'default') {
  // Check poe mode
  const validPoEModes = Object.values(POE_MODES)
  const validPoEMode = validPoEModes.includes(poe_mode)
  if(!validPoEMode) throw new Error(`Invalid PoE port mode '${poe_mode}'`)

  // Get device
  const targetDevice = await getDevice(device_name, site_name)

  // Get port
  getPort(targetDevice, port_idx)

  // Get current port overrides
  const portOverrides = [ ...targetDevice.portOverrides ]
  const targetPortOverride = portOverrides.find(portOverride => portOverride.port_idx == port_idx)
  // Set poe mode
  if(targetPortOverride) {
    targetPortOverride.poe_mode = poe_mode
  } else {
    portOverrides.push({ port_idx, poe_mode })
  }
  // Sort by port index
  portOverrides.sort((a, b) => a.port_idx - b.port_idx)

  targetDevice.updateDevice({
    port_overrides: portOverrides
  })
}

async function setPoEPortOn(device_name, port_idx) {
  await setPoEPortMode(device_name, port_idx, POE_MODES.AUTO)
}

async function setPoEPortOff(device_name, port_idx) {
  await setPoEPortMode(device_name, port_idx, POE_MODES.OFF)
}

async function powerCyclePoEPort(device_name, port_idx, delay = 10000) {
  await setPoEPortOff(device_name, port_idx)
  await new Promise(r => setTimeout(r, delay))
  await setPoEPortOn(device_name, port_idx)
}

module.exports = {
  getPoEPortMode,
  setPoEPortOff,
  setPoEPortOn,
  setPoEPortMode,
}
