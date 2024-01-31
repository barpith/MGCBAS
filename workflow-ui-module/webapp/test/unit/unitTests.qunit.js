/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"bpadispatch2/workflow-ui-module/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
