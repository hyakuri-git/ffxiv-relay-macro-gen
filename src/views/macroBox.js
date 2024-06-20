const { QApplication, QCheckBox, QClipboardMode, QTextEdit, QPushButton } = require('@nodegui/nodegui');
const { createWidget } = require('../utils');
const { settings } = require('../settings');
const { mainChatCheckBoxView, lsChatCheckBoxView, cwlsChatCheckBoxView } = require('./chatBox');
const { worldSelectDropdown, capitalizeWorldCheckBox, shortenWorldCheckBox } = require('./worldBox');

const { widget: macroBoxView, widgetLayout: macroBoxViewLayout } = createWidget('macroBoxView');
const { widget: inputBoxView, widgetLayout: inputBoxViewLayout } = createWidget('inputBoxView');

const inputTextEdit = new QTextEdit();
inputTextEdit.setObjectName('inputTextEdit');
const lastInputText = settings.value('inputText').toString();
lastInputText ? inputTextEdit.setText(lastInputText) : inputTextEdit.setPlaceholderText('Type something here and click Generate!');

const generateButton = new QPushButton();
generateButton.setObjectName('generateButton');
generateButton.setText('Generate Macro');

const { widget: outputBoxView, widgetLayout: outputBoxViewLayout } = createWidget('outputBoxView');

const outputTextEdit = new QTextEdit();
outputTextEdit.setObjectName('outputTextEdit');
outputTextEdit.setAcceptRichText(true);
outputTextEdit.setReadOnly(true);

const copyButton = new QPushButton();
copyButton.setObjectName('copyButton');
copyButton.setText('Copy Macro');

generateButton.addEventListener('clicked', () => {
    const children = [...mainChatCheckBoxView.children(), ...lsChatCheckBoxView.children(), ...cwlsChatCheckBoxView.children()];
    const inputText = inputTextEdit.toPlainText();
    let outputText = '';

    let world = worldSelectDropdown.currentText();
    if (capitalizeWorldCheckBox.isChecked()) {
      world = world.toUpperCase();
    }
    if (shortenWorldCheckBox.isChecked()) {
      world = world.slice(0, 4);
    }

    settings.setValue('inputText', inputText);
    for (child of children) {
        if (child instanceof QCheckBox && child.isChecked()) {
            outputText = outputText + `/${child.objectName()} ${inputText.replace(/%w/g, world)}\n`
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


inputBoxViewLayout.addWidget(inputTextEdit);
inputBoxViewLayout.addWidget(generateButton);

outputBoxViewLayout.addWidget(outputTextEdit);
outputBoxViewLayout.addWidget(copyButton);

macroBoxViewLayout.addWidget(inputBoxView);
macroBoxViewLayout.addWidget(outputBoxView);

module.exports = { macroBoxView };
