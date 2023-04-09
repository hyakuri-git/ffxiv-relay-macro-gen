const { QSettings } = require('@nodegui/nodegui');

const settings = new QSettings('jbrent', 'relay-gen');

module.exports = { settings };
