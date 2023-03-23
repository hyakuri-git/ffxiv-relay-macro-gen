const { FlexLayout, QMainWindow, QCheckBox, QGroupBox, QTextEdit, QPushButton, QClipboard, QApplication, QClipboardMode } = require('@nodegui/nodegui');


const chatOptions = [
    { short: 's', label: 'Say', checked: false },
    { short: 'y', label: 'Yell', checked: false },
    { short: 'sh', label: 'Shout', checked: false },
    { short: 'p', label: 'Party', checked: false },
    { short: 'fc', label: 'Free Company', checked: false },
    { short: 'l1', label: 'Linkshell 1', checked: false },
    { short: 'l2', label: 'Linkshell 2', checked: false },
    { short: 'l3', label: 'Linkshell 3', checked: false },
    { short: 'l4', label: 'Linkshell 4', checked: false },
    { short: 'l5', label: 'Linkshell 5', checked: false },
    { short: 'cwl1', label: 'Cross-world Linkshell 1', checked: false },
    { short: 'cwl2', label: 'Cross-world Linkshell 2', checked: false },
    { short: 'cwl3', label: 'Cross-world Linkshell 3', checked: false },
    { short: 'cwl4', label: 'Cross-world Linkshell 4', checked: false },
    { short: 'cwl5', label: 'Cross-world Linkshell 5', checked: false },
];

const win = new QMainWindow();
win.setWindowTitle('FFXIV Relay Macro Generator')

const groupBoxLayout = new FlexLayout();
const groupBox = new QGroupBox();
groupBox.setLayout(groupBoxLayout);

for (option of chatOptions) {
    const checkbox = new QCheckBox();
    checkbox.setText(option.label);
    checkbox.setObjectName(option.short);
    groupBoxLayout.addWidget(checkbox);
}

const input = new QTextEdit();
input.setObjectName('InputTextBox');
const output = new QTextEdit();
output.setAcceptRichText(true);
output.setReadOnly(true);

const generateButton = new QPushButton();
const copyButton = new QPushButton();
generateButton.setText('Generate Macro');
generateButton.addEventListener('clicked', () => {
    const input = groupBox.children().find(c => c.objectName() === 'InputTextBox');
    let outputText = '';
    for (child of groupBox.children()) {
        if (child instanceof QCheckBox && child.isChecked()) {
            outputText = outputText + `/${child.objectName()} ${input.toPlainText()}\n`
        }
    }
    output.setPlainText(outputText);
    copyButton.setText('Copy Macro');
});

copyButton.setText('Copy Macro');
copyButton.addEventListener('clicked', () => {
    QApplication.clipboard().setText(output.toPlainText(), QClipboardMode.Clipboard);
    copyButton.setText('Copied!');
    setTimeout(() => { copyButton.setText('Copy Macro') }, 3000);
});

groupBoxLayout.addWidget(input);
groupBoxLayout.addWidget(generateButton);
groupBoxLayout.addWidget(output);
groupBoxLayout.addWidget(copyButton);

win.setCentralWidget(groupBox);
win.show();
global.win = win;
