const { FlexLayout, QWidget } = require('@nodegui/nodegui');

/**
 * Creates and returns a QWidget and FlexLayout
 * 
 * @param {string} objectName 
 * @returns { QWidget, FlexLayout }
 */
const createWidget = (objectName) => {
	const widget = new QWidget();
	const widgetLayout = new FlexLayout();
	widget.setObjectName(objectName);
	widget.setLayout(widgetLayout);

	return { widget, widgetLayout };
};

module.exports = { createWidget };
