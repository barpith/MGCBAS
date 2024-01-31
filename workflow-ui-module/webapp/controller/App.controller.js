sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageBox",
      "sap/ui/core/CustomData",
      "sap/ui/core/Fragment",
      "sap/m/MessageToast",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      'sap/ui/export/library',
      'sap/ui/export/Spreadsheet'
    ],
    function(BaseController, JSONModel, MessageBox, CustomData, Fragment, MessageToast, Filter, FilterOperator,exportLibrary,Spreadsheet) {
      "use strict";
      var  cells, wbsindex, oModel,oSModel;
      var EdmType = exportLibrary.EdmType;
      var dateToBeFiltered="", resourceToBeFiltered="", costCenterToBeFiltered="";
      return BaseController.extend("com.mgc.taskuicrew.workflowuimodule.controller.App", {
        onInit() {
          
          oModel = this.getOwnerComponent().getModel("mgcdb-srv");
          oSModel = this.getOwnerComponent().getModel("v2");

          var batchPromise = jQuery.Deferred();
          var oDataModel = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);

          var batchOperation0 = oDataModel.createBatchOperation("/Job?$format=json", "GET");
          var batchOperation1 = oDataModel.createBatchOperation("/Activities?$format=json", "GET");
          var batchOperation2 = oDataModel.createBatchOperation("/Section?$format=json", "GET");
          var batchOperation3 = oDataModel.createBatchOperation("/Phase?$format=json", "GET");
          var batchOperation4 = oDataModel.createBatchOperation("/WorkOrder?$format=json", "GET");
          var batchOperation5 = oDataModel.createBatchOperation("/Equipment?$format=json", "GET");
          
          

          var batchArray = [batchOperation0,batchOperation1,batchOperation2,batchOperation3,batchOperation4,batchOperation5];
          oDataModel.addBatchReadOperations(batchArray);
          oDataModel.submitBatch(function (oResult) {
              console.log("batch response HANADB :", oResult);

              //Get Employee Info and set to global model
              try{

                  //Get Job and set to Job model
                  var jsonJobModel = new JSONModel(oResult.__batchResponses[0].data.results);
                  this.getView().setModel(jsonJobModel,"Job");


                  //Get Activities and set to Activities model
                  var jsonActivitiesModel = new JSONModel(oResult.__batchResponses[1].data.results);
                  this.getView().setModel(jsonActivitiesModel,"Activities");


                  //Get Section and set to Section model
                  var jsonSectionModel = new JSONModel(oResult.__batchResponses[2].data.results);
                  this.getView().setModel(jsonSectionModel,"Section");


                  //Get Phase and set to Phase model
                  var jsonPhaseModel = new JSONModel(oResult.__batchResponses[3].data.results);
                  this.getView().setModel(jsonPhaseModel,"Phase");


                  //Get WorkOrder and set to WorkOrder model
                  var jsonWorkOrderModel = new JSONModel(oResult.__batchResponses[4].data.results);
                  this.getView().setModel(jsonWorkOrderModel,"WorkOrder");


                  
                  //Get receivingEquipment and set to receivingEquipment model
                  var jsonreceivingEquipmentModel = new JSONModel(oResult.__batchResponses[5].data.results);
                  this.getView().setModel(jsonreceivingEquipmentModel,"receivingEquipment");


                  //Get sendingEquipment Values and set to sendingEquipment model
                  var jsonsendingEquipmentModel = new JSONModel(oResult.__batchResponses[5].data.results);
                  this.getView().setModel(jsonsendingEquipmentModel,"sendingEquipment");

                  batchPromise.resolve();
                                          
              }
              catch(err){
                  console.log("error in hanadb data");
              }
          }.bind(this), function (oError) {
              sap.ui.core.BusyIndicator.hide();
              MessageBox.error("Oops! Something went wrong.");
          }.bind(this));



          //SF OData Call
          var sfBatchPromise = jQuery.Deferred();
          var sfModel = this.getOwnerComponent().getModel("v2");
          var oSFDataModel = new sap.ui.model.odata.ODataModel(sfModel.sServiceUrl);

          var batchOperationSF0 = oSFDataModel.createBatchOperation("/FOCostCenter?$format=json", "GET");
          var batchOperationSF1 = oSFDataModel.createBatchOperation("/cust_paycode?$format=json", "GET");
          var batchOperationSF2 = oSFDataModel.createBatchOperation("/cust_UOM?$format=json", "GET");

          var sfBatchArray = [batchOperationSF0, batchOperationSF1, batchOperationSF2];
          oSFDataModel.addBatchReadOperations(sfBatchArray);
          oSFDataModel.submitBatch(function (oResult) {
              console.log("batch response SF :", oResult);

              //Get Employee Info and set to global model
              try{

                  //Get CostCenter Values and set to FOCostCenter model
                  var jsonFOCostCenterModel = new JSONModel(oResult.__batchResponses[0].data.results);
                  this.getView().setModel(jsonFOCostCenterModel,"FOCostCenter");


                  //Get Paycode and set to cust_paycode model
                  var jsonPaycodeModel = new JSONModel(oResult.__batchResponses[1].data.results);
                  this.getView().setModel(jsonPaycodeModel,"cust_paycode");


                  //Get UOM and set to cust_UOM model
                  var jsonUOMModel = new JSONModel(oResult.__batchResponses[2].data.results);
                  this.getView().setModel(jsonUOMModel,"cust_UOM");


                  sfBatchPromise.resolve();
              }
              catch(err){
                  console.log("error in sf data");
              }
          }.bind(this), function (oError) {
            //   sap.ui.core.BusyIndicator.hide();
              MessageBox.error("Oops! Something went wrong.");
          }.bind(this));



          $.when(batchPromise, sfBatchPromise).done(
              function () {
                  // sap.ui.core.BusyIndicator.hide();
                  this.onDateValue();
                  // this.onTest();
                  console.log("API's fetch successful");
              }.bind(this));
        },

        onDateValue: function(){
          // var contextData;
          // console.log("Now Inside Date function"); 
          var contextData;
          console.log("Inside Date Function!!"); 
          contextData = this.getView().getModel("context").getProperty("/main/0/Date");
          var oText = this.getView().byId("dateTextField");
          oText.setText(contextData);
          // oText.setValue(contextData)
      },
        onSearch: function () {
          var aFilterGroupItems = this.getView().byId("filterbar").getFilterGroupItems();
          var oTable = this.getView().byId("idUiTable");
          var aFilters = [];
          
          // Iterate over FilterGroupItems
          aFilterGroupItems.forEach(function(oFilterGroupItem) {
              var sPath = oFilterGroupItem.getName(); // Property path
              var sValue = oFilterGroupItem.getControl().getValue(); // Filter value
              var sOperator = oFilterGroupItem.getControl().getSelectedKey(); // Selected operator
          
              // Create a filter for the current FilterGroupItem
              if (sValue) {
              var oFilter = new Filter({
                  path: sPath,
                  operator: FilterOperator.Contains,
                  value1: sValue
              });
          
              aFilters.push(oFilter);
              }
          });
          
          // Apply the filters to the table
          oTable.getBinding("rows").filter(aFilters);
            
      },

      onClearFilters: function() {
        // var oFilterBar = this.getView().byId("filterbar");
        // var oTable = this.getView().byId("idUiTable");
        // oFilterBar.clear();
        // oTable.getBinding("rows").refresh();

        var oFilterBar = this.getView().byId("filterbar");

        // Get all filter items and reset their values
        var aFilterItems = oFilterBar.getAllFilterItems();
        aFilterItems.forEach(function(oFilterItem) {
            var oControl = oFilterItem.getControl();

            if (oControl && oControl.setValue) {
            oControl.setValue("");
            }
            
            if (oControl && oControl.setSelectedKey) {
            oControl.setSelectedKey("");
            }
        });
        this.onSearch();
      },

      on_MenuAction: function (oEvent) {
        let sClicked = oEvent.getSource().getText(),
            oCEStatic = this.getView().byId("idUiTable"); // Cost Object headings

        switch (sClicked) {
            // PayCode
            case 'Hide PayCode':
                for(var i=0;i<19;i++){
                    if(oCEStatic.getColumns()[i].getName() === 'PayCode'){
                        oCEStatic.getColumns()[i].setVisible(false);
                        break;
                    }
                }
                oEvent.getSource().setText(sClicked.replace('Hide', 'Show'));
                oEvent.getSource().setIcon('sap-icon://show');
            break;
            case 'Show PayCode' :
                for(var i=0;i<19;i++){
                    if(oCEStatic.getColumns()[i].getName() === 'PayCode'){
                        oCEStatic.getColumns()[i].setVisible(true);
                        break;
                    }
                }
                oEvent.getSource().setText(sClicked.replace('Show', 'Hide'));
                oEvent.getSource().setIcon('sap-icon://hide');
            break;

            // WBS elements
            case 'Hide WBS' :

            for(var i=0;i<19;i++){
                if(oCEStatic.getColumns()[i].getName() === 'Job' || oCEStatic.getColumns()[i].getName() === 'JobDescription' || oCEStatic.getColumns()[i].getName() === 'Section' || oCEStatic.getColumns()[i].getName() === 'SectionDescription' || oCEStatic.getColumns()[i].getName() === 'Phase' || oCEStatic.getColumns()[i].getName() === 'PhaseDescription' ||  oCEStatic.getColumns()[i].getName() === 'Qty' || oCEStatic.getColumns()[i].getName() === 'UoM' ){
                    oCEStatic.getColumns()[i].setVisible(false);
                }
            }
                oEvent.getSource().setText(sClicked.replace('Hide', 'Show'));
                oEvent.getSource().setIcon('sap-icon://show');
            break;
            case 'Show WBS' :
            
            for(var i=0;i<19;i++){
                if(oCEStatic.getColumns()[i].getName() === 'Job' || oCEStatic.getColumns()[i].getName() === 'JobDescription' || oCEStatic.getColumns()[i].getName() === 'Section' || oCEStatic.getColumns()[i].getName() === 'SectionDescription' || oCEStatic.getColumns()[i].getName() === 'Phase' || oCEStatic.getColumns()[i].getName() === 'PhaseDescription' ||  oCEStatic.getColumns()[i].getName() === 'Qty' || oCEStatic.getColumns()[i].getName() === 'UoM' ){
                    oCEStatic.getColumns()[i].setVisible(true);
                }
            }
                oEvent.getSource().setText(sClicked.replace('Show', 'Hide'));
                oEvent.getSource().setIcon('sap-icon://hide');
            break;

            // Work Order
            case 'Hide Work Order':

            for(var i=0;i<19;i++){
                if(oCEStatic.getColumns()[i].getName() === 'Workorder'){
                    oCEStatic.getColumns()[i].setVisible(false);
                    break;
                }
            }
            oEvent.getSource().setText(sClicked.replace('Hide', 'Show'));
            oEvent.getSource().setIcon('sap-icon://show');
            break;


            case 'Show Work Order':

            for(var i=0;i<19;i++){
                if(oCEStatic.getColumns()[i].getName() === 'Workorder'){
                    oCEStatic.getColumns()[i].setVisible(true);
                    break;
                }
            }
            oEvent.getSource().setText(sClicked.replace('Show', 'Hide'));
            oEvent.getSource().setIcon('sap-icon://hide');

            break;

            // Cost Center
            case 'Hide Cost Center':

             for(var i=0;i<19;i++){
                if(oCEStatic.getColumns()[i].getName() === 'CostCenter'){
                    oCEStatic.getColumns()[i].setVisible(false);
                    break;
                }
            }
            oEvent.getSource().setText(sClicked.replace('Hide', 'Show'));
            oEvent.getSource().setIcon('sap-icon://show');

            break;
            case 'Show Cost Center':
                for(var i=0;i<19;i++){
                    if(oCEStatic.getColumns()[i].getName() === 'CostCenter'){
                        oCEStatic.getColumns()[i].setVisible(true);
                        break;
                    }
                }
                oEvent.getSource().setText(sClicked.replace('Show', 'Hide'));
                oEvent.getSource().setIcon('sap-icon://hide');
            break;

            // Equipment
            case 'Hide Equipment':

            for(var i=0;i<19;i++){
                if(oCEStatic.getColumns()[i].getName() === 'Equipment'){
                    oCEStatic.getColumns()[i].setVisible(false);
                    break;
                }
            }
            oEvent.getSource().setText(sClicked.replace('Hide', 'Show'));
            oEvent.getSource().setIcon('sap-icon://show');

            break;

            case 'Show Equipment' :
                for(var i=0;i<19;i++){
                    if(oCEStatic.getColumns()[i].getName() === 'Equipment'){
                        oCEStatic.getColumns()[i].setVisible(true);
                        break;
                    }
                }
                oEvent.getSource().setText(sClicked.replace('Show', 'Hide'));
                oEvent.getSource().setIcon('sap-icon://hide');
            break;

            case "Hide All":
                for(var i=0;i<19;i++){
                        oCEStatic.getColumns()[i].setVisible(false);
                }
                oEvent.getSource().setText(sClicked.replace('Hide', 'Show'));
                oEvent.getSource().setIcon('sap-icon://show');
            break;
            case "Show All" :
                for(var i=0;i<19;i++){
                        oCEStatic.getColumns()[i].setVisible(true);
                }
                oEvent.getSource().setText(sClicked.replace('Show', 'Hide'));
                oEvent.getSource().setIcon('sap-icon://hide');
            break;
        }
    },
    onExport: function() {
        var aCols, oRowBinding, oSettings, oSheet, oTable;

        if (!this._oTable) {
            this._oTable = this.getView().byId('idUiTable');
        }

        oTable = this._oTable;
        oRowBinding = oTable.getBinding("rows");
        aCols = this.createColumnConfig();

        oSettings = {
            workbook: {
                columns: aCols,
                hierarchyLevel: 'Level'
            },
            dataSource: oRowBinding,
            fileName: 'CrewApprovalStatus.xlsx',
            worker: false // We need to disable worker because we are using a MockServer as OData Service
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function() {
            oSheet.destroy();
        });
    },
    

    createColumnConfig: function() {
        var aCols = [];

        aCols.push({
            label: 'Resource ID',
            type: EdmType.String,
            property: 'Resource',
            scale: 0
        });

        aCols.push({
            label: 'Employee Name',
            type: EdmType.String,
            property: 'EmployeeName',
            scale: 0
        });

        aCols.push({
            label: 'Activity',
            type: EdmType.String,
            property: 'Activity',
            scale: 0
        });

        aCols.push({
            label: 'Job',
            type: EdmType.String,
            property: 'Job',
            scale: 0
        });

        aCols.push({
            label: 'Job Description',
            type: EdmType.String,
            property: 'JobDescription',
            scale: 0
        });

        aCols.push({
            label: 'Section',
            type: EdmType.String,
            property: 'Section',
            scale: 0
        });

        aCols.push({
            label: 'Section Description',
            type: EdmType.String,
            property: 'SectionDescription',
            scale: 0
        });

        aCols.push({
            label: 'Phase',
            type: EdmType.String,
            property: 'Phase',
            scale: 0
        });

        aCols.push({
            label: 'Phase Description',
            type: EdmType.String,
            property: 'PhaseDescription',
            scale: 0
        });

        aCols.push({
            label: 'Qty',
            type: EdmType.String,
            property: 'Qty',
            scale: 0
        });

        aCols.push({
            label: 'WorkOrder',
            type: EdmType.String,
            property: 'WorkOrder',
            scale: 0
        });

        aCols.push({
            label: 'WorkOrder Description',
            type: EdmType.String,
            property: 'WorkOrderDescription',
            scale: 0
        });

        aCols.push({
            label: 'Cost Center',
            type: EdmType.String,
            property: 'CostCenter',
            scale: 0
        });

        aCols.push({
            label: 'ReceivingUnit Truck',
            type: EdmType.String,
            property: 'ReceivingUnitTruck',
            scale: 0
        });

        aCols.push({
            label: 'SendingUnit Trailer',
            type: EdmType.String,
            property: 'SendingUnitTrailer',
            scale: 0
        });

        aCols.push({
            label: 'UoM',
            type: EdmType.String,
            property: 'UoM',
            scale: 0
        });

        aCols.push({
            label: 'PayCode',
            type: EdmType.String,
            property: 'PayCode',
            scale: 0
        });

        aCols.push({
            label: 'Hours',
            type: EdmType.String,
            property: 'Hours',
            scale: 0
        });

        aCols.push({
            label: 'Comments',
            type: EdmType.String,
            property: 'Comments',
            scale: 0
        });  

        return aCols;
    },

              // F4 Functions


        //JOB 

        jobHandleValueHelp: function (oEvent) {
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }

            // create value help dialog
            if (this._pJobValueHelpDialog) {
                this._pJobValueHelpDialog.then(function (oJobValueHelpDialog) {
                    // Clear filters
                    oJobValueHelpDialog.getBinding("items").filter([]);
                    oJobValueHelpDialog.open();
                });
            }

            
            else  {
                this._pJobValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.JobValueHelp",
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
        handleJobClose: function (oEvent) {
            // reset the filter
            // var oBinding = oEvent.getSource().getBinding("items");
            // oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].Job = aContexts[0].getObject().ID;
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].JobDescription = aContexts[0].getObject().Description;
            }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },



        //ACTIVITY

        activityHandleValueHelp: function (oEvent) {
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._pActivityValueHelpDialog) {
                this._pActivityValueHelpDialog.then(function (oActivityValueHelpDialog) {
                    // Clear filters
                    oActivityValueHelpDialog.getBinding("items").filter([]);
                    oActivityValueHelpDialog.open();
                });
            }

            else {
                this._pActivityValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.ActivityValueHelp",
                    controller: this
                }).then(function (oActivityValueHelpDialog) {
                    oView.addDependent(oActivityValueHelpDialog);
                    return oActivityValueHelpDialog;
                });
            }
            // open value help dialog
            this._pActivityValueHelpDialog.then(function (oActivityValueHelpDialog) {
                oActivityValueHelpDialog.open();
            });
        },
        handleActivityClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].Activity = aContexts[0].getObject().ActivityID;
            }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },



        //SECTION 

        sectionHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._pSectionValueHelpDialog) {
                this._pSectionValueHelpDialog.then(function (oSectionValueHelpDialog) {
                    // Clear filters
                    oSectionValueHelpDialog.getBinding("items").filter([]);
                    oSectionValueHelpDialog.open();
                });
            }
            else {
                this._pSectionValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.SectionHelp",
                    controller: this
                }).then(function (oSectionValueHelpDialog) {
                    oView.addDependent(oSectionValueHelpDialog);
                    return oSectionValueHelpDialog;
                });
            }
            // open value help dialog
            this._pSectionValueHelpDialog.then(function (oSectionValueHelpDialog) {
                oSectionValueHelpDialog.open();
            });
        },
        handleSectionClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].Section = aContexts[0].getObject().ID;
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].SectionDescription = aContexts[0].getObject().Description;
            }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },


        // PHASE

        phaseHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._pPhaseValueHelpDialog) {
                this._pPhaseValueHelpDialog.then(function (oPhaseValueHelpDialog) {
                    // Clear filters
                    oPhaseValueHelpDialog.getBinding("items").filter([]);
                    oPhaseValueHelpDialog.open();
                });
            }
            else {
                this._pPhaseValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.PhaseHelp",
                    controller: this
                }).then(function (oPhaseValueHelpDialog) {
                    oView.addDependent(oPhaseValueHelpDialog);
                    return oPhaseValueHelpDialog;
                });
            }
            // open value help dialog
            this._pPhaseValueHelpDialog.then(function (oPhaseValueHelpDialog) {
                oPhaseValueHelpDialog.open();
            });
        },
        handlePhaseClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].Phase = aContexts[0].getObject().ID;
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].PhaseDescription = aContexts[0].getObject().Description;
            }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },


        // WORK ORDER

        workorderHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._pWorkOrderValueHelpDialog) {
                this._pWorkOrderValueHelpDialog.then(function (oWorkOrderValueHelpDialog) {
                    // Clear filters
                    oWorkOrderValueHelpDialog.getBinding("items").filter([]);
                    oWorkOrderValueHelpDialog.open();
                });
            }
            else {
                this._pWorkOrderValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.WorkOrderValueHelp",
                    controller: this
                }).then(function (oWorkOrderValueHelpDialog) {
                    oView.addDependent(oWorkOrderValueHelpDialog);
                    return oWorkOrderValueHelpDialog;
                });
            }
            // open value help dialog
            this._pWorkOrderValueHelpDialog.then(function (oWorkOrderValueHelpDialog) {
                oWorkOrderValueHelpDialog.open();
            });
        },
        handleWorkOrderClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].Workorder = aContexts[0].getObject().ID;
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].WorkOrderDescription = aContexts[0].getObject().Name;
                }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },



          // COST CENTER

          costcenterHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();
            
                // cells[3].setEditable(false);
                // cells[5].setEditable(false);
                // cells[7].setEditable(false);
                // cells[9].setEditable(false);
                // cells[10].setEditable(false);



            // create value help dialog
            if (this._pCostCenterValueHelpDialog) {
                this._pCostCenterValueHelpDialog.then(function (oCostCenterValueHelpDialog) {
                    // Clear filters
                    oCostCenterValueHelpDialog.getBinding("items").filter([]);
                    oCostCenterValueHelpDialog.open();
                });
            }
            else{
                this._pCostCenterValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.CostCenterValueHelp",
                    controller: this
                }).then(function (oCostCenterValueHelpDialog) {
                    oView.addDependent(oCostCenterValueHelpDialog);
                    return oCostCenterValueHelpDialog;
                });
            }
            // open value help dialog
            this._pCostCenterValueHelpDialog.then(function (oCostCenterValueHelpDialog) {
                oCostCenterValueHelpDialog.open();
            });
        },
        handleCostCenterClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].CostCenter = aContexts[0].getObject().costcenterExternalObjectID;
                }
            else {
                // cells[3].setEditable(true);
                // cells[5].setEditable(true);
                // cells[7].setEditable(true);
                // cells[9].setEditable(true);
                // cells[10].setEditable(true);

            }
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },


        // PAYCODE

        paycodeHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();


            // create value help dialog
            if (this._pPayCodeValueHelpDialog) {
                this._pPayCodeValueHelpDialog.then(function (oPayCodeValueHelpDialog) {
                    // Clear filters
                    oPayCodeValueHelpDialog.getBinding("items").filter([]);
                    oPayCodeValueHelpDialog.open();
                });
            }

            
            else {
                this._pPayCodeValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.PayCodeValueHelp",
                    controller: this
                }).then(function (oPayCodeValueHelpDialog) {
                    oView.addDependent(oPayCodeValueHelpDialog);
                    return oPayCodeValueHelpDialog;
                });
            }
            // open value help dialog
            this._pPayCodeValueHelpDialog.then(function (oPayCodeValueHelpDialog) {
                oPayCodeValueHelpDialog.open();
            });
        },
        handlePayCodeClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].PayCode = aContexts[0].getObject().PaycodeID;
                }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },





        // UoM

        uomHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._pUOMValueHelpDialog) {
                this._pUOMValueHelpDialog.then(function (oUOMValueHelpDialog) {
                    // Clear filters
                    oUOMValueHelpDialog.getBinding("items").filter([]);
                    oUOMValueHelpDialog.open();
                });
            }

            else {
                this._pUOMValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.Uomvaluehelp",
                    controller: this
                }).then(function (oUOMValueHelpDialog) {
                    oView.addDependent(oUOMValueHelpDialog);
                    return oUOMValueHelpDialog;
                });
            }
            // open value help dialog
            this._pUOMValueHelpDialog.then(function (oUOMValueHelpDialog) {
                oUOMValueHelpDialog.open();
            });
        },
        handleUOMClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].UoM = aContexts[0].getObject().externalCode;
                }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },


        // Receiving Unit - Truck

        receivingunitHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._preceivingunitValueHelpDialog) {
                this._preceivingunitValueHelpDialog.then(function (oreceivingunitValueHelpDialog) {
                    // Clear filters
                    oreceivingunitValueHelpDialog.getBinding("items").filter([]);
                    oreceivingunitValueHelpDialog.open();
                });
            }

            else {
                this._preceivingunitValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.Equipmentreceiving",
                    controller: this
                }).then(function (oreceivingunitValueHelpDialog) {
                    oView.addDependent(oreceivingunitValueHelpDialog);
                    return oreceivingunitValueHelpDialog;
                });
            }
            // open value help dialog
            this._preceivingunitValueHelpDialog.then(function (oreceivingunitValueHelpDialog) {
                oreceivingunitValueHelpDialog.open();
            });
        },
        handlereceivingunitClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].ReceivingUnitTruck = aContexts[0].getObject().ID;
                }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },



        //Sending unit

        sendingunitHandleValueHelp: function(oEvent){
            // wbsindex = oEvent.getSource().sId.split("idUiTable-")[1];
            var oBindingContext = oEvent.getSource().getBindingContext("context");
    
            if (oBindingContext) {
                wbsindex = oBindingContext.getPath().split("/")[2];
                console.log("Row index: " + wbsindex);
            }
            var oView = this.getView();
            this._sMainInputId = oEvent.getSource().getId();
            cells = oEvent.getSource().getParent().getCells();

            // create value help dialog
            if (this._psendingunitValueHelpDialog) {
                this._psendingunitValueHelpDialog.then(function (osendingunitValueHelpDialog) {
                    // Clear filters
                    osendingunitValueHelpDialog.getBinding("items").filter([]);
                    osendingunitValueHelpDialog.open();
                });
            }
            else {
                this._psendingunitValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.mgc.taskuicrew.workflowuimodule.view.Fragments.Equipmentsending",
                    controller: this
                }).then(function (osendingunitValueHelpDialog) {
                    oView.addDependent(osendingunitValueHelpDialog);
                    return osendingunitValueHelpDialog;
                });
            }
            // open value help dialog
            this._psendingunitValueHelpDialog.then(function (osendingunitValueHelpDialog) {
                osendingunitValueHelpDialog.open();
            });
        },
        handlesendingunitClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
            this.getOwnerComponent().getModel('context').getData().main[wbsindex].SendingUnitTrailer = aContexts[0].getObject().ID;
                }
            else {}
            this.getView().byId("idUiTable").getModel('context').updateBindings();              
        },


        // costCenterLiveChange: function(oEvent){
        //     if(oEvent.getParameters().value !== ''){
        //         oEvent.getSource().setValue("");
        //         cells = oEvent.getSource().getParent().getCells();
        //         cells[12].setEditable(true);
        //         MessageToast.show("Use Values From F4 Help", { duration : 10000, width : "30em", closeOnBrowserNavigation: false  });
        //     }
        //     else if(oEvent.getParameters().value == ''){
        //         cells = oEvent.getSource().getParent().getCells();
        //         cells[3].setEditable(true);
        //         cells[5].setEditable(true);
        //         cells[7].setEditable(true);
        //         cells[9].setEditable(true);
        //         cells[10].setEditable(true);
        //     }
        // }


        
      // ========================================  F4 search function  =================================== //

        // F4 search function

        //Cost center

        on_CostCenterSearch : function(oEvent) {
            let sQuery = oEvent.getParameter("value"),
                costcenterExternalObjectID = new Filter("costcenterExternalObjectID", FilterOperator.Contains, sQuery),
                name = new Filter("name", FilterOperator.Contains, sQuery),
                legalEntity = new Filter("legalEntity", FilterOperator.Contains, sQuery),
                CompanyDescription = new Filter("CompanyDescription", FilterOperator.Contains, sQuery),
                mfilters = new Filter([costcenterExternalObjectID, name, legalEntity, CompanyDescription]);

            oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
        },

        //Activity 

        onActivitySearchValue : function(oEvent) {
            let sQuery = oEvent.getParameter("value"),
                ActivityID = new Filter("ActivityID", FilterOperator.Contains, sQuery),
                ActivityName = new Filter("ActivityName", FilterOperator.Contains, sQuery),
                mfilters = new Filter([ActivityID, ActivityName]);

            oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
        },

        //Job, Phase, Section

        on_liveSearch : function (oEvent) {
            let sQuery = oEvent.getParameter("value"),
                ID = new Filter("ID", FilterOperator.Contains, sQuery),
                Name = new Filter("Name", FilterOperator.Contains, sQuery),
                Description = new Filter("Description", FilterOperator.Contains, sQuery),
                ProjectManager = new Filter("ProjectManager", FilterOperator.Contains, sQuery),
                CompanyDescription = new Filter("CompanyDescription", FilterOperator.Contains, sQuery),
                ProfitCenter = new Filter("ProfitCenter", FilterOperator.Contains, sQuery),
                mfilters = new Filter([ID, Name, Description, ProjectManager, CompanyDescription, ProfitCenter]);

            oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
        },

        //Pay Code

        on_PayCodeSearch : function(oEvent) {
            let sQuery = oEvent.getParameter("value"),
                PaycodeName = new Filter("PaycodeName", FilterOperator.Contains, sQuery),
                PaycodeID = new Filter("PaycodeID", FilterOperator.Contains, sQuery),
                mfilters = new Filter([PaycodeName, PaycodeID]);

            oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
        },

        //UoM

        on_UOM_Search : function(oEvent) {
            let sQuery = oEvent.getParameter("value"),
                e_code = new Filter("externalCode", FilterOperator.Contains, sQuery),
                e_name = new Filter("externalName", FilterOperator.Contains, sQuery),
                mfilters = new Filter([e_code, e_name]);

            oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
        },

        //Work order

        on_WorkorderSearchValue : function(oEvent) {
            let sQuery = oEvent.getParameter("value"),
                ID = new Filter("ID", FilterOperator.Contains, sQuery),
                Name = new Filter("Name", FilterOperator.Contains, sQuery),
                CompanyCode = new Filter("CompanyCode", FilterOperator.Contains, sQuery),
                CompanyCodeDescription = new Filter("CompanyCodeDescription", FilterOperator.Contains, sQuery),
                mfilters = new Filter([ID, Name, CompanyCode, CompanyCodeDescription]);

            oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
        }


      });
    }
  );
  