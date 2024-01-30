sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageBox",
      "sap/ui/core/CustomData",
      "sap/ui/core/Fragment",
      "sap/m/MessageToast",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator"
    ],
    function(BaseController, JSONModel, MessageBox, CustomData, Fragment, MessageToast, Filter, FilterOperator) {
      "use strict";
      var  cells, wbsindex, oModel,oSModel;
      return BaseController.extend("com.mgc.conscrewprd.workflowuimodule.controller.App", {
        onInit: function (oEvent) {

            //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
              oModel = this.getView().getModel("mgcdb-prd-srv");
            //   oSModel = this.getOwnerComponent().getModel("v2");
            oSModel = this.getView().getModel("v2");
    
          //    this.onJobhelperAPI();
          //    this.onActivityhelperAPI();
          //    this.onSectionhelperAPI();
          //    this.onPhasehelperAPI();
          //    this.onWorkOrderhelperAPI();
          //    this.onCostCenterhelperAPI();
          //    this.onPayCodehelperAPI();
          //    this.onUOMhelperAPI();
          //    this.onEquipmentreceivinghelperAPI();
          //    this.onEquipmentsendinghelperAPI();
          //    this.onDateValue();
    
          },  
          // onBeforeRendering: function(){
          //    
          //     var worktab = this.getOwnerComponent().getModel("context").getProperty("/main");
          //     var line = 0;
          //     var Items = this.getView().byId("workDetailTab").getItems();
          //     for (let wa_work of worktab){
          //         var cells = Items[line].getCells();
          //         line = line + 1;
          //         for( var j = 0; j < cells.length; j++){
          //         if (cells[j] instanceof sap.m.Input){
          //             if(cells[j].getValue() == ''){
          //                 cells[j].setEditable(false);
          //                 }
          //             }
          //         }
          //     }
          // },
    
          onAfterRendering: function(){
            //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
            oModel = this.getView().getModel("mgcdb-prd-srv");
            //   oSModel = this.getOwnerComponent().getModel("v2"); 
            oSModel = this.getView().getModel("v2");
              
            
    
              // var worktab = this.getOwnerComponent().getModel("context").getProperty("/main");
              // var line = 0;
              // var Items = this.getView().byId("workDetailTab").getItems();
              // for (let wa_work of worktab){
              //     var cells = Items[line].getCells();
              //     line = line + 1;
              //     for( var j = 0; j < cells.length; j++){
              //     if (cells[j] instanceof sap.m.Input){
              //         if(cells[j].getValue() == ''){
              //             cells[j].setEditable(false);
              //             }
              //         }
              //     }
              // }
    
             this.onJobhelperAPI();
             this.onActivityhelperAPI();
             this.onSectionhelperAPI();
             this.onPhasehelperAPI();
             this.onWorkOrderhelperAPI();
             this.onCostCenterhelperAPI();
             this.onPayCodehelperAPI();
             this.onUOMhelperAPI();
             this.onEquipmentreceivinghelperAPI();
             this.onEquipmentsendinghelperAPI();
             
          },
          onDateValue: function(){
              var contextData;
              console.log("onInit"); 
              contextData = this.getView().byId("workDetailTab").getModel("context").getProperty("/main/0/Date");
              var oText = this.getView().byId("dateTextField");
              oText.setText(contextData);
          },
    
          onSearch: function (oEvent) {
              // add filter for search
              var aFilters = [];
              // var aFiltersEmployeeID = [];
              var sQuery = oEvent.getSource().getValue();
              if (sQuery && sQuery.length > 0) {
                  var EmployeeFilter =  new Filter({
                      filters: [
                        new Filter({
                          path: 'EmployeeName',
                          operator: FilterOperator.Contains,
                          value1: sQuery
                        }),
                        new Filter({
                          path: 'Resource',
                          operator: FilterOperator.Contains,
                          value1: sQuery
                        })
                      ]
                    });
                  aFilters.push(Filter);
              }
    
              // update list binding
              var oList = this.byId("workDetailTab");
              var oBinding = oList.getBinding("items");
              oBinding.filter(EmployeeFilter, "Application");
          },
    
          onJobhelperAPI : function(){
        //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
        oModel = this.getView().getModel("mgcdb-prd-srv");
           oModel.read("/Job_prd",{
              //  filters: wbsFilter,
               async: false,
               success : function(oData, oResponse){
                   var jobData = oData;
                   console.log( "Job :" + jobData.results);
                   var jsonModel = new JSONModel(jobData.results);
                   this.getView().setModel(jsonModel,"searchHelpJob");
               }.bind(this),
               error : function(oError){
                   MessageBox.error("Job Data not found");
                   sap.ui.core.BusyIndicator.hide();
               }.bind(this)
           });
          },
    
          onActivityhelperAPI : function(){
            //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
            oModel = this.getView().getModel("mgcdb-prd-srv");
               oModel.read("/Activities_prd",{
                   async: false,
                   success : function(oData, oResponse){
                       var jobData = oData;
                       console.log( "Activity :" + jobData.results);
                       var jsonModel = new JSONModel(jobData.results);
                       this.getView().setModel(jsonModel,"searchHelpActivity");
                   }.bind(this),
                   error : function(oError){
                       MessageBox.error("Activity Data not found");
                       sap.ui.core.BusyIndicator.hide();
                   }.bind(this)
               });
              },
    
              onSectionhelperAPI : function(){
                //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
                oModel = this.getView().getModel("mgcdb-prd-srv");
                   oModel.read("/Section_prd",{
                       async: false,
                       success : function(oData, oResponse){
                           var sectionData = oData;
                           console.log( "Section :" + sectionData.results);
                           var jsonModel = new JSONModel(sectionData.results);
                           this.getView().setModel(jsonModel,"searchHelpSection");
                       }.bind(this),
                       error : function(oError){
                           MessageBox.error("Section Data not found");
                       }.bind(this)
                   });
                  },
    
              onPhasehelperAPI : function(){
                //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
                oModel = this.getView().getModel("mgcdb-prd-srv");
                      oModel.read("/Phase_prd",{
                          async: false,
                          success : function(oData, oResponse){
                              var PhaseData = oData;
                              console.log( "Phase :" + PhaseData.results);
                              var jsonModel = new JSONModel(PhaseData.results);
                              this.getView().setModel(jsonModel,"searchHelpPhase");
                          }.bind(this),
                          error : function(oError){
                              MessageBox.error("Phase Data not found");
                          }.bind(this)
                      });
                  },
    
              
              onWorkOrderhelperAPI : function(){
                //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
                oModel = this.getView().getModel("mgcdb-prd-srv");
                  oModel.read("/WorkOrder_prd",{
                      async: false,
                      success : function(oData, oResponse){
                          var WorkOrderData = oData;
                          console.log( "WorkOrder :" + WorkOrderData.results);
                          var jsonModel = new JSONModel(WorkOrderData.results);
                          this.getView().setModel(jsonModel,"searchHelpWorkOrder");
                      }.bind(this),
                      error : function(oError){
                          MessageBox.error("WorkOrder Data not found");
                      }.bind(this)
                  });  
              },
          
              onCostCenterhelperAPI : function(){
                //   this.oSModel = this.getOwnerComponent().getModel("v2");
                oSModel = this.getView().getModel("v2");
                  oSModel.read("/FOCostCenter",{
                      async: false,
                      success : function(oData, oResponse){
                          var CostCenterData = oData;
                          console.log( "CostCenter :" + CostCenterData.results);
                          var jsonModel = new JSONModel(CostCenterData.results);
                          this.getView().setModel(jsonModel,"searchHelpCostCenter");
                          this.onDateValue();
                      }.bind(this),
                      error : function(oError){
                          MessageBox.error("CostCenter Data not found");
                      }.bind(this)
                  });  
              },
    
              onPayCodehelperAPI : function(){
                //   oSModel = this.getOwnerComponent().getModel("v2");  
                oSModel = this.getView().getModel("v2");
                  oSModel.read("/cust_paycode",{
                      async: false,
                      success : function(oData, oResponse){
                          var PayCodeData = oData;
                          console.log( "PayCode :" + PayCodeData.results);
                          var jsonModel = new JSONModel(PayCodeData.results);
                          this.getView().setModel(jsonModel,"searchHelpPayCode");
                      }.bind(this),
                      error : function(oError){
                          MessageBox.error("PayCode Data not found");
                      }.bind(this)
                  });  
              },
    
    
              
              onUOMhelperAPI : function(){
                //   oSModel = this.getOwnerComponent().getModel("v2");  
                oSModel = this.getView().getModel("v2");
                  oSModel.read("/cust_UOM",{
                      async: false,
                      success : function(oData, oResponse){
                          var UOMData = oData;
                          console.log( "UOM :" + UOMData.results);
                          var jsonModel = new JSONModel(UOMData.results);
                          this.getView().setModel(jsonModel,"searchHelpUOM");
                      }.bind(this),
                      error : function(oError){
                          MessageBox.error("UOM Data not found");
                      }.bind(this)
                  });  
              },
    
    
              onEquipmentreceivinghelperAPI : function(){
                //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv");
                oModel = this.getView().getModel("mgcdb-prd-srv");
                  oModel.read("/Equipment_prd",{
                      async: false,
                      success : function(oData, oResponse){
                          var EquipmentData = oData;
                          console.log( "Equipment :" + EquipmentData.results);
                          var jsonModel = new JSONModel(EquipmentData.results);
                          this.getView().setModel(jsonModel,"searchHelpEquipmentreceiving");
                      }.bind(this),
                      error : function(oError){
                          MessageBox.error("Equipment Data not found");
                      }.bind(this)
                  });  
              },
    
              onEquipmentsendinghelperAPI : function(){
                //   oModel = this.getOwnerComponent().getModel("mgcdb-prd-srv"); 
                oModel = this.getView().getModel("mgcdb-prd-srv");
                  oModel.read("/Equipment_prd",{
                      async: false,
                      success : function(oData, oResponse){
                          var EquipmentData = oData;
                          console.log( "Equipment :" + EquipmentData.results);
                          var jsonModel = new JSONModel(EquipmentData.results);
                          this.getView().setModel(jsonModel,"searchHelpEquipmentsending");
                      }.bind(this),
                      error : function(oError){
                          MessageBox.error("Equipment Data not found");
                      }.bind(this)
                  });  
              },
    
          //JOB 
    
          jobHandleValueHelp: function (oEvent) {
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
    
              // create value help dialog
              if (!this._pJobValueHelpDialog) {
                  this._pJobValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.JobValueHelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
    
          //ACTIVITY
    
          activityHandleValueHelp: function (oEvent) {
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
    
              // create value help dialog
              if (!this._pActivityValueHelpDialog) {
                  this._pActivityValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.ActivityValueHelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
    
          //SECTION 
    
          sectionHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
    
              // create value help dialog
              if (!this._pSectionValueHelpDialog) {
                  this._pSectionValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.SectionHelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
          // PHASE
    
          phaseHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
    
              // create value help dialog
              if (!this._pPhaseValueHelpDialog) {
                  this._pPhaseValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.PhaseHelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
          // WORK ORDER
    
          workorderHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
      
              // create value help dialog
              if (!this._pWorkOrderValueHelpDialog) {
                  this._pWorkOrderValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.WorkOrderValueHelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
    
             // COST CENTER
    
             costcenterHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
              
                  cells[3].setEditable(false);
                  cells[5].setEditable(false);
                  cells[7].setEditable(false);
                  cells[9].setEditable(false);
                  cells[10].setEditable(false);
    
    
    
              // create value help dialog
              if (!this._pCostCenterValueHelpDialog) {
                  this._pCostCenterValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.CostCenterValueHelp",
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
                  cells[3].setEditable(true);
                  cells[5].setEditable(true);
                  cells[7].setEditable(true);
                  cells[9].setEditable(true);
                  cells[10].setEditable(true);
    
              }
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
          // PAYCODE
    
          paycodeHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
      
              // create value help dialog
              if (!this._pPayCodeValueHelpDialog) {
                  this._pPayCodeValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.PayCodeValueHelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
    
    
    
           // UoM
    
           uomHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
      
              // create value help dialog
              if (!this._pUOMValueHelpDialog) {
                  this._pUOMValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.Uomvaluehelp",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
          // Receiving Unit - Truck
    
          receivingunitHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
    
              // create value help dialog
              if (!this._preceivingunitValueHelpDialog) {
                  this._preceivingunitValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.Equipmentreceiving",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
    
          //Sending unit
    
          sendingunitHandleValueHelp: function(oEvent){
              wbsindex = oEvent.getSource().sId.split("workDetailTab-")[1];
              var oView = this.getView();
              this._sMainInputId = oEvent.getSource().getId();
              cells = oEvent.getSource().getParent().getCells();
    
              // create value help dialog
              if (!this._psendingunitValueHelpDialog) {
                  this._psendingunitValueHelpDialog = Fragment.load({
                      id: oView.getId(),
                      name: "com.mgc.crewprd.workflowuimodule.view.Fragments.Equipmentsending",
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
              this.getView().byId("workDetailTab").getModel('context').updateBindings();              
          },
    
    
          costCenterLiveChange: function(oEvent){
              if(oEvent.getParameters().value !== ''){
                  oEvent.getSource().setValue("");
                  cells = oEvent.getSource().getParent().getCells();
                  cells[12].setEditable(true);
                  MessageToast.show("Use Values From F4 Help", { duration : 10000, width : "30em", closeOnBrowserNavigation: false  });
              }
              else if(oEvent.getParameters().value == ''){
                  cells = oEvent.getSource().getParent().getCells();
                  cells[3].setEditable(true);
                  cells[5].setEditable(true);
                  cells[7].setEditable(true);
                  cells[9].setEditable(true);
                  cells[10].setEditable(true);
              }
          }
    
          });
        }
      );
  