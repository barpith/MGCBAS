sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("bpadispatch3.workflowuimodule.controller.App", {
        onInit() {

          console.log("init");
          var oModel = this.getOwnerComponent().getModel();
         //  var sfModel = this.getOwnerComponent().getModel("mgcdb-srv");
          oModel.read("/TimeSheetDetails", {
               async: false,
               success: function (oData) {
                  var data = oData;
                  console.log(data);
               }.bind(this),
               error: function (oError) {
                  console.log("Error");
               }.bind(this)
         });
        }
      });
    }
  );
  