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
      var  cells, wbsindex, oModel;
      return BaseController.extend("bpadispatch2.workflowuimodule.controller.App", {
        onInit() {

          console.log("init");
          oModel = this.getOwnerComponent().getModel("mgcdb-srv");
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


         
        //  var oModel = this.getOwnerComponent().getModel();
         var wbsFilter = [];
         wbsFilter.push(new Filter({
             path: "COMPANYID",
             operator: FilterOperator.EQ,
             value1: '2006',
         }));
         oModel.read("/WbsElement",{
             filters: wbsFilter,
             async: false,
             success : function(oData, oResponse){
                 var wbsData = oData;
                 console.log( "wbs :" + wbsData.results);
                 var jsonModel = new JSONModel(wbsData.results);
                 this.getView().setModel(jsonModel,"WBSValues");
             }.bind(this),
             error : function(oError){
                 MessageBox.error("WBS Data not found");
                 sap.ui.core.BusyIndicator.hide();
             }.bind(this)
         });
         
         var wbsF4value = [{selectedValue: ""}];

         var selectedValuejson = new JSONModel({selectedValue: ""});
 
          this.getView().setModel(selectedValuejson, "valueHelpModel");

        },
        wbsHandleValueHelp: function (oEvent) {
          wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
          var oView = this.getView();
          this._sMainInputId = oEvent.getSource().getId();
          cells = oEvent.getSource().getParent().getCells();

          // create value help dialog
          if (!this._pJobValueHelpDialog) {
              this._pJobValueHelpDialog = Fragment.load({
                  id: oView.getId(),
                  name: "bpadispatch2.workflowuimodule.view.Fragments.wbsValues",
                  controller: this
              }).then(function (oJobValueHelpDialog) {
                  oView.addDependent(oJobValueHelpDialog);
                  return oJobValueHelpDialog;
              });
          }
          // open value help dialog
          this._pJobValueHelpDialog.then(function (oJobValueHelpDialog) {
              oJobValueHelpDialog.open();
          });
      },
      handleWBSClose: function (oEvent) {
          // reset the filter
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([]);

          var aContexts = oEvent.getParameter("selectedContexts");
          if (aContexts && aContexts.length) {
            //   var wbsInput = sap.ui.getCore().byId(this._sMainInputId);
              // var wbs = this.getView().byId("workDetailTab").getModel("myModel").getData().items[wbsindex].WBS
              // this.getView().byId("workDetailTab").getModel("myModel").setProperty("/wbsvalue", wbs);

              // this.getView().byId("workDetailTab").getModel("mgcdb-srv").getData().items[wbsindex].WBS = aContexts[0].getObject().JOBS
              this.getOwnerComponent().getModel('context').getData().main[wbsindex].Job = aContexts[0].getObject().JOBS
           }
                  else {
                   
              }
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
      },
      on_Approve:function(){
        var oDataModel = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);
        var batchArray = [];
        var tableData = this.getModel("context").getData().main;
        console.log("context " +tableData);
            //update the existing entries in DB
            if (tableData.length > 0){
                for (var i = 0; i < tableData.length; i++) {
                    // tableData[i].EmployeeID = tableData[i].Resource;
                    var dataPayload = {
                        "ID":tableData[i].ID,
                        "AppName":tableData[i].AppName,
                        "EmployeeID": tableData[i].Resource,
                        "Date":tableData[i].Date,
                        "Activity":tableData[i].Activity,
                        "ReceivingUnitTruck":tableData[i].ReceivingUnit,
                        "SendingUnitTrailer":tableData[i].SendingUnit,
                        "Job":tableData[i].Job,
                        "Section":tableData[i].Section,
                        "Phase":tableData[i].Phase,
                        "CostCenter":tableData[i].CostCenter,
                        "WorkOrder": tableData[i].WorkOrder,
                        "PayCode":tableData[i].PayCode,
                        //what is EnterHours??
                        "TotalHours":tableData[i].TotalHours,
                        "SaveSubmitStatus":"Approved",
                    };
                    var batchOperation = oDataModel.createBatchOperation("/TimeSheetDetails(ID="+tableData[i].ID+",AppName='"+tableData[i].AppName+"',Date='"+tableData[i].Date+"')", "PATCH", dataPayload);
                    batchArray.push(batchOperation);
                }
            }

            if(batchArray.length > 0){
                oDataModel.addBatchChangeOperations(batchArray);
                oDataModel.submitBatch(function (oResult) {
                    MessageBox.success("Entries posted successfully..!");
                    // this.getOwnerComponent().completeTask(true,"approve");
                }.bind(this), function (oError) {
                    MessageBox.error("Error in Approval process");
                }.bind(this));
            }
    },
    on_Reject:function(){
        var oDataModel = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);
        var batchArray = [];
        var tableData = this.getView().getModel("context").getData().main;
        console.log("context " +tableData);
            //update the existing entries in DB
            if (tableData.length > 0){
                for (var i = 0; i < tableData.length; i++) {
                    // tableData[i].EmployeeID = tableData[i].Resource;
                    var dataPayload = {
                        "ID":tableData[i].ID,
                        "AppName":tableData[i].AppName,
                        "EmployeeID": tableData[i].Resource,
                        "Date":tableData[i].Date,
                        "Activity":tableData[i].Activity,
                        "ReceivingUnitTruck":tableData[i].ReceivingUnit,
                        "SendingUnitTrailer":tableData[i].SendingUnit,
                        "Job":tableData[i].Job,
                        "Section":tableData[i].Section,
                        "Phase":tableData[i].Phase,
                        "CostCenter":tableData[i].CostCenter,
                        "WorkOrder": tableData[i].WorkOrder,
                        "PayCode":tableData[i].PayCode,
                        //what is EnterHours??
                        "TotalHours":tableData[i].TotalHours,
                        "SaveSubmitStatus":"Rejected",
                    };
                    var batchOperation = oDataModel.createBatchOperation("/TimeSheetDetails(ID="+tableData[i].ID+",AppName='"+tableData[i].AppName+"',Date='"+tableData[i].Date+"')", "PATCH", dataPayload);
                    batchArray.push(batchOperation);
                }
            }

            if(batchArray.length > 0){
                oDataModel.addBatchChangeOperations(batchArray);
                oDataModel.submitBatch(function (oResult) {
                    MessageBox.success("Entries posted successfully..!");
                    // this.getOwnerComponent().completeTask(false,"reject");
                }.bind(this), function (oError) {
                    MessageBox.error("Error in Rejection process");
                }.bind(this));
            }

    }
      });
    }
  );
  