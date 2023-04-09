const { QMainWindow } = require('@nodegui/nodegui');
const { createWidget } = require('./utils');
const { chatOptionsView } = require('./views/chatBox');
const { worldBoxView } = require('./views/worldBox');
const { macroBoxView } = require('./views/macroBox');

const win = new QMainWindow();
win.setWindowTitle('FFXIV Relay Macro Generator')

const { widget: rootView, widgetLayout: rootViewLayout } = createWidget('rootView');

rootViewLayout.addWidget(chatOptionsView);
rootViewLayout.addWidget(worldBoxView);
rootViewLayout.addWidget(macroBoxView);

const rootStyleSheet = `
  #rootView {
    padding: 5em;
    height: 500em;
    width: 610em;
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
    width: 600em;
    margin-top: 2em;
    margin-bottom: 2em;
    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
  }
  #worldSelectLabel {
    width: 150em;
    padding: 0.2em;
    margin-bottom: 0.2em;
  }
  #dataCenterDropdown, #worldSelectDropdown {
    width: 150em;
    padding: 0.2em;
    margin-bottom: 0.2em;
  }
  #capitalizeWorldCheckBox {
    width: 150em;
    margin-left: 0.5em; 
    margin-top: 1.2em;
  }
  #shortenWorldCheckBox {
    width: 150em;
    margin-top: 0.2em;
    margin-left: 0.5em;
  }
  #inputTextEdit, #outputTextEdit {
    margin-right: 0.2em;
    margin-left: 0.2em;
    width: 300em;
  }
  #generateButton, #copyButton {
    height: 30em;
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
