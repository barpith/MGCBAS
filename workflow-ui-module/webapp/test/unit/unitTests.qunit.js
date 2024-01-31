/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"bpadispatch3/workflow-ui-module/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
