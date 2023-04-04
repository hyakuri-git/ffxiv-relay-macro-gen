const { FlexLayout, QMainWindow, QCheckBox, QTextEdit, QPushButton, QApplication, QClipboardMode, QWidget, QLabel, QComboBox, QSettings } = require('@nodegui/nodegui');
const { datacenters } = require('./datacenters');

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

const settings = new QSettings('jbrent', 'relay-gen');

const win = new QMainWindow();
win.setWindowTitle('FFXIV Relay Macro Generator')

const rootView = new QWidget();
const rootViewLayout = new FlexLayout();
rootView.setLayout(rootViewLayout);

const chatOptionsView = new QWidget();
const chatOptionsViewLayout = new FlexLayout();
chatOptionsView.setObjectName('chatOptionsView');
chatOptionsView.setLayout(chatOptionsViewLayout);

const chatSelectLabel = new QLabel();
chatSelectLabel.setText('Select chats to include in the macro');
chatSelectLabel.setObjectName('chatSelectLabel');

const chatCheckBoxView = new QWidget();
const chatCheckBoxViewLayout = new FlexLayout();
chatCheckBoxView.setObjectName('chatCheckBoxView');
chatCheckBoxView.setLayout(chatCheckBoxViewLayout);

const mainChatCheckBoxView = new QWidget();
const mainChatCheckBoxViewLayout = new FlexLayout();
mainChatCheckBoxView.setObjectName('mainChatCheckBoxView');
mainChatCheckBoxView.setLayout(mainChatCheckBoxViewLayout);

const lsChatCheckBoxView = new QWidget();
const lsChatCheckBoxViewLayout = new FlexLayout();
lsChatCheckBoxView.setObjectName('lsChatCheckBoxView');
lsChatCheckBoxView.setLayout(lsChatCheckBoxViewLayout);

const cwlsChatCheckBoxView = new QWidget();
const cwlsChatCheckBoxViewLayout = new FlexLayout();
cwlsChatCheckBoxView.setObjectName('cwlsChatCheckBoxView');
cwlsChatCheckBoxView.setLayout(cwlsChatCheckBoxViewLayout);

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

const worldBoxView = new QWidget();
const worldBoxViewLayout = new FlexLayout();
worldBoxView.setObjectName('worldBoxView');
worldBoxView.setLayout(worldBoxViewLayout);

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

worldBoxViewLayout.addWidget(worldSelectLabel);
worldBoxViewLayout.addWidget(dataCenterDropdown);
worldBoxViewLayout.addWidget(worldSelectDropdown);
mainChatCheckBoxViewLayout.addWidget(worldBoxView);

const macroBoxView = new QWidget();
const macroBoxViewLayout = new FlexLayout();
macroBoxView.setObjectName('macroBoxView');
macroBoxView.setLayout(macroBoxViewLayout);

const inputBoxView = new QWidget();
const inputBoxViewLayout = new FlexLayout();
inputBoxView.setObjectName('inputBoxView');
inputBoxView.setLayout(inputBoxViewLayout);

const inputTextEdit = new QTextEdit();
inputTextEdit.setObjectName('inputTextEdit');
const lastInputText = settings.value('inputText').toString();
lastInputText ? inputTextEdit.setText(lastInputText) : inputTextEdit.setPlaceholderText('Type something here and click Generate!');

const generateButton = new QPushButton();
generateButton.setObjectName('generateButton');
generateButton.setText('Generate Macro');

const outputBoxView = new QWidget();
const outputBoxViewLayout = new FlexLayout();
outputBoxView.setObjectName('outputBoxView');
outputBoxView.setLayout(outputBoxViewLayout);

const outputTextEdit = new QTextEdit();
outputTextEdit.setObjectName('outputTextEdit');
outputTextEdit.setAcceptRichText(true);
outputTextEdit.setReadOnly(true);

const copyButton = new QPushButton();
copyButton.setObjectName('generateButton');
copyButton.setText('Copy Macro');

generateButton.addEventListener('clicked', () => {
    const children = [...mainChatCheckBoxView.children(), ...lsChatCheckBoxView.children(), ...cwlsChatCheckBoxView.children()];
    const inputText = inputTextEdit.toPlainText();
    let outputText = '';

    settings.setValue('inputText', inputText);
    for (child of children) {
        if (child instanceof QCheckBox && child.isChecked()) {
            outputText = outputText + `/${child.objectName()} ${inputText.replace(/%w/g, worldSelectDropdown.currentText())}\n`
        }
    }
    outputTextEdit.setPlainText(outputText);
    copyButton.setText('Copy Macro');
});

copyButton.addEventListener('clicked', () => {
    QApplication.clipboard().setText(outputTextEdit.toPlainText(), QClipboardMode.Clipboard);
    copyButton.setText('Copied!');
    setTimeout(() => { copyButton.setText('Copy Macro') }, 3000);
});

chatOptionsViewLayout.addWidget(chatSelectLabel);
chatCheckBoxViewLayout.addWidget(mainChatCheckBoxView);
chatCheckBoxViewLayout.addWidget(lsChatCheckBoxView);
chatCheckBoxViewLayout.addWidget(cwlsChatCheckBoxView);
chatOptionsViewLayout.addWidget(chatCheckBoxView);

inputBoxViewLayout.addWidget(inputTextEdit);
inputBoxViewLayout.addWidget(generateButton);

outputBoxViewLayout.addWidget(outputTextEdit);
outputBoxViewLayout.addWidget(copyButton);

macroBoxViewLayout.addWidget(inputBoxView);
macroBoxViewLayout.addWidget(outputBoxView);

rootViewLayout.addWidget(chatOptionsView);
rootViewLayout.addWidget(macroBoxView);

const rootStyleSheet = `
  #rootView {
    padding: 5em;
    height: 800em;
    width: 600em;
  }
  #chatOptionsView {
    width: 600em;
  }
  #macroBoxView {
    width: 600em;
    flex-direction: row;
  }
  #chatCheckBoxView {
    padding: 10em;
    width: 600em;
    border: 0.2em ridge #B2BEB5;
    margin-right: 0.2em;
    margin-left: 0.2em;
    margin-bottom: 0.2em;
    flex-direction: row;
  }
  #chatSelectLabel {
    width: 400em;
    padding: 0.2em;
    text-align: center;
    font-size: 2rem;
  }
  #mainChatCheckBoxView, #lsChatCheckBoxView, #cwlsChatCheckBoxView {
    width: 200em;
    padding: 2em;
    margin-bottom: 2em;
    flex-direction: column;
  }
  #worldBoxView {
    width: 150em;
    padding: 2em;
    margin-top: 5em;
    margin-bottom: 2em;
    flex-direction: column;
    align-content: flex-end;
    justify-content: flex-end;
  }
  #worldSelectLabel {
    width: 150em;
  }
  #inputTextEdit, #outputTextEdit {
    margin-right: 0.2em;
    margin-left: 0.2em;
    width: 300em;
  }
  #generateButton, #copyButton {
    margin-right: 1em;
    margin-left: 1em;
    margin-top: 0.1em;
    margin-bottom: 0.1em;
  }
`;

rootView.setStyleSheet(rootStyleSheet);

win.setCentralWidget(rootView);
win.show();
global.win = win;
