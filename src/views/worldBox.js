const { QCheckBox, QLabel, QComboBox } = require('@nodegui/nodegui');
const { createWidget } = require('../utils');
const { datacenters } = require('../datacenters');
const { settings } = require('../settings');

const { widget: worldBoxView, widgetLayout: worldBoxViewLayout } = createWidget('worldBoxView');

const { widget: worldSelectView, widgetLayout: worldSelectViewLayout } = createWidget('worldSelectView');

const worldSelectLabel = new QLabel();
worldSelectLabel.setText('Optional: \nSelect world and use \'%w\'\nas a placeholder.');
worldSelectLabel.setObjectName('worldSelectLabel');

const dataCenterDropdown = new QComboBox();
dataCenterDropdown.setObjectName('dataCenterDropdown');

const worldSelectDropdown = new QComboBox();
worldSelectDropdown.setObjectName('worldSelectDropdown');

for (dc of datacenters) {
  dataCenterDropdown.addItem(undefined, dc.name);
}

dataCenterDropdown.addEventListener('currentTextChanged', async (text) => {
  worldSelectDropdown.clear();
  for (dc of datacenters) {
    if (dc.name === text) {
      settings.setValue('lastDc', dc.name);
      for (world of dc.worlds) {
        worldSelectDropdown.addItem(undefined, world);
      }
    }
  }
});

dataCenterDropdown.setCurrentText(settings.value('lastDc').toString() ?? '');
worldSelectDropdown.setCurrentText(settings.value('lastWorld').toString() ?? '');

worldSelectDropdown.addEventListener('currentTextChanged', async (text) => {
  settings.setValue('lastWorld', text);
});

const { widget: worldFormatView, widgetLayout: worldFormatViewLayout } = createWidget('worldFormatView');

const capitalizeWorldCheckBox = new QCheckBox();
capitalizeWorldCheckBox.setText("Capitalize world names");
capitalizeWorldCheckBox.setObjectName("capitalizeWorldCheckBox");
capitalizeWorldCheckBox.setChecked(settings.value("capitalizeWorldCheckBox").toBool() ?? false);
capitalizeWorldCheckBox.addEventListener('clicked', (checked) => {
  settings.setValue(capitalizeWorldCheckBox.objectName(), checked);
});

const shortenWorldCheckBox = new QCheckBox();
shortenWorldCheckBox.setText("Use short world names");
shortenWorldCheckBox.setObjectName("shortenWorldCheckBox");
shortenWorldCheckBox.setChecked(settings.value("shortenWorldCheckBox").toBool() ?? false);
shortenWorldCheckBox.addEventListener('clicked', (checked) => {
  settings.setValue(shortenWorldCheckBox.objectName(), checked);
});

worldBoxViewLayout.addWidget(worldSelectLabel);
worldSelectViewLayout.addWidget(dataCenterDropdown);
worldSelectViewLayout.addWidget(worldSelectDropdown);
worldBoxViewLayout.addWidget(worldSelectView);
worldFormatViewLayout.addWidget(capitalizeWorldCheckBox);
worldFormatViewLayout.addWidget(shortenWorldCheckBox);
worldBoxViewLayout.addWidget(worldFormatView);

module.exports = {
  worldSelectDropdown,
  capitalizeWorldCheckBox,
  shortenWorldCheckBox,
  worldBoxView,
};
