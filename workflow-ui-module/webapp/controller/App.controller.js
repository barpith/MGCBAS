sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
	      "sap/ui/model/FilterOperator",
    ],
    function(BaseController, Filter, FilterOperator) {
      "use strict";

      var empID, oModel, managerName, managerEmail;
  
      return BaseController.extend("com.mgc.bpaoffice.workflowuimodule.controller.App", {
        onInit() {

          // empID = sap.ushell.Container.getService("UserInfo").getUser().getId();
          empID = "9081740";
          oModel = this.getOwnerComponent().getModel();

          var managerFilter = [];
            managerFilter.push(new Filter({
              path: "ID",
              operator: FilterOperator.EQ,
              value1: empID
            }));

          oModel.read("/Employees", {
            filters: managerFilter,
            async: false,
            success: function (oData, oResponse) {
                var data = oData;
                managerName = data.results[0].FirstName+" "+data.results[0].LastName;
            }.bind(this),
            error: function (oError) {
                // BusyIndicator.hide();
                var sMsg = JSON.parse(oError.responseText).error.message.value;
                MessageBox.error(sMsg);
            }.bind(this)
          });

        },
        onAfterRendering: function(){
          console.log("onAfterRendering");
        }
      });
    }
  );
  