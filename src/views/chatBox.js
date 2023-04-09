const { QCheckBox, QLabel } = require('@nodegui/nodegui');
const { createWidget } = require('../utils');
const { settings } = require('../settings');

const chatOptions = [
  { short: 's', label: 'Say', },
  { short: 'y', label: 'Yell', },
  { short: 'sh', label: 'Shout', },
  { short: 'p', label: 'Party', },
  { short: 'fc', label: 'Free Company', },
  { short: 'l1', label: 'Linkshell 1', },
  { short: 'l2', label: 'Linkshell 2', },
  { short: 'l3', label: 'Linkshell 3', },
  { short: 'l4', label: 'Linkshell 4', },
  { short: 'l5', label: 'Linkshell 5', },
  { short: 'l6', label: 'Linkshell 6', },
  { short: 'l7', label: 'Linkshell 7', },
  { short: 'l8', label: 'Linkshell 8', },
  { short: 'cwl1', label: 'Cross-world Linkshell 1', },
  { short: 'cwl2', label: 'Cross-world Linkshell 2', },
  { short: 'cwl3', label: 'Cross-world Linkshell 3', },
  { short: 'cwl4', label: 'Cross-world Linkshell 4', },
  { short: 'cwl5', label: 'Cross-world Linkshell 5', },
  { short: 'cwl6', label: 'Cross-world Linkshell 6', },
  { short: 'cwl7', label: 'Cross-world Linkshell 7', },
  { short: 'cwl8', label: 'Cross-world Linkshell 8', },
];

const { widget: chatOptionsView, widgetLayout: chatOptionsViewLayout } = createWidget('chatOptionsView');

const chatSelectLabel = new QLabel();
chatSelectLabel.setText('Select chats to include in the macro');
chatSelectLabel.setObjectName('chatSelectLabel');

const { widget: chatCheckBoxView, widgetLayout: chatCheckBoxViewLayout } = createWidget('chatCheckBoxView');
const { widget: mainChatCheckBoxView, widgetLayout: mainChatCheckBoxViewLayout } = createWidget('mainChatCheckBoxView');
const { widget: lsChatCheckBoxView, widgetLayout: lsChatCheckBoxViewLayout } = createWidget('lsChatCheckBoxView');
const { widget: cwlsChatCheckBoxView, widgetLayout: cwlsChatCheckBoxViewLayout } = createWidget('cwlsChatCheckBoxView');

for (option of chatOptions) {
    const checkbox = new QCheckBox();
    checkbox.setText(option.label);
    checkbox.setObjectName(option.short);
    checkbox.setChecked(settings.value(option.short).toBool() ?? false);
    checkbox.addEventListener('clicked', (checked) => {
      settings.setValue(checkbox.objectName(), checked);
    });

    if (option.short.startsWith('l')) {
        lsChatCheckBoxViewLayout.addWidget(checkbox);
    } else if (option.short.startsWith('cwl')) {
        cwlsChatCheckBoxViewLayout.addWidget(checkbox);
    } else {
        mainChatCheckBoxViewLayout.addWidget(checkbox);
    }
}

chatOptionsViewLayout.addWidget(chatSelectLabel);
chatCheckBoxViewLayout.addWidget(mainChatCheckBoxView);
chatCheckBoxViewLayout.addWidget(lsChatCheckBoxView);
chatCheckBoxViewLayout.addWidget(cwlsChatCheckBoxView);
chatOptionsViewLayout.addWidget(chatCheckBoxView);

module.exports = {
  mainChatCheckBoxView,
  lsChatCheckBoxView,
  cwlsChatCheckBoxView,
  chatOptionsView,
};
