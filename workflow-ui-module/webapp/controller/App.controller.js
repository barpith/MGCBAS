sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        'sap/ui/core/Fragment',
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
          "sap/ui/core/date/UI5Date",
          "sap/m/MessageBox",
          "sap/m/BusyIndicator"
    ],
    function(BaseController,JSONModel,Fragment, Filter, FilterOperator, UI5Date, MessageBox, BusyIndicator) {
      "use strict";
      var timesheetDataFilter=[];
                    
      return BaseController.extend("com.mgc.bpadispatch.workflowuimodule.controller.App", {
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







               //  timesheetDataFilter.push(new Filter({
               //      path: "AppName",
               //      operator: FilterOperator.EQ,
               //      value1: "DD"
               //  }));
               //  timesheetDataFilter.push(new Filter({
               //      path: "EmployeeID",
               //      operator: FilterOperator.EQ,
               //      value1: "9084822"
               //  }));
               //  oModel.read("/TimeSheetDetails",{
               //      filters: timesheetDataFilter,
               //      async: false,
               //      success : function(oData, oResponse){
               //          data = oData;
               //          console.log(data);
               //      }.bind(this),
               //      error : function(oError){
               //          // BusyIndicator.setBusy(false);
               //          var sMsg = JSON.parse(oError.responseText).error.message.value;
               //          MessageBox.error(sMsg);
               //      }.bind(this)
               //  });

            

            //     $.ajax({
            //       url:  "/TimeSheetDetails",
            //       type: "GET",
            //       // async: false,
            //       // contentType: "application/json",
            //       success: function (odata) {
            //         console.log(odata);
            //           // resolve(odata);
            //       },
            //       error:  function (err) {
            //         console.log(err);
            //           // reject(err);
            //        },
            //   });

        //   var oModel = new JSONModel({
        //     items: [
        //        { Date: "01/11/2023", Resource: "Rs-01", Activity: "", ReceivingUnit: "Value1", SendingUnit: "Value1", WBS: "J 02.Section-99.Phase-111", CostCenter: "Value1", WorkOrder: "Value1", PayCode: "Value1", EnterHours: "8:30" }
        //        // Add more rows as needed
        //     ]
        //  });

        //  this.getView().setModel(oModel, "myModel");

        //  var oModel = new JSONModel({
        //     items: [
        //        { key: "1", costcenter: "ABC123" },
        //        { key: "2", costcenter: "QWE345" },
        //        // Add more options as needed
        //     ],
        //     selectedValue: ""
        //  });

        //  this.getView().setModel(oModel, "valueHelpModel");
         
        },
      //   onValueHelpPress: function () {
      //     if (!this._oValueHelpDialog) {
      //        Fragment.load({
      //           name: "com.mgc.bpadispatch.workflowuimodule.view.Fragments.activityValues",
      //           controller: this
      //        }).then(function(oValueHelpDialog) {
      //           this._oValueHelpDialog = oValueHelpDialog;
      //           this.getView().addDependent(this._oValueHelpDialog);
      //           this._oValueHelpDialog.open();
      //        }.bind(this));
      //     } else {
      //        this._oValueHelpDialog.open();
      //     }
      //  },
 
      //  onValueHelpOK: function () {
      //     // Handle OK button press
      //     // Close the dialog and update the main Input field with the selected value
      //     var oSelectedItem = this._oValueHelpDialog.getContent()[0].getSelectedItem();
      //     if (oSelectedItem) {
      //        var sSelectedKey = oSelectedItem.getKey();
      //        this.getView().getModel().setProperty("/selectedValue", sSelectedKey);
      //     }
 
      //     this._oValueHelpDialog.close();
      //  },
 
      //  onValueHelpCancel: function () {
      //     // Handle Cancel button press
      //     // Close the dialog without making any changes
      //     this._oValueHelpDialog.close();
      //  },
      //  onValueHelpRowSelectionChange: function (oEvent) {
      //     // Handle row selection change event
      //     var oTable = oEvent.getSource();
      //     var oSelectedItem = oTable.getSelectedItem();
      //     if (oSelectedItem) {
      //        var sSelectedKey = oSelectedItem.getCells()[1].getText(); // Assuming key is in the first cell
      //        this.getView().getModel("valueHelpModel").setProperty("/selectedValue", sSelectedKey);
      //        this._oValueHelpDialog.close();
      //     }
      //  }
      });
    }
  );
  