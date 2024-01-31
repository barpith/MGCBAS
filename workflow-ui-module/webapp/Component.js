sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/core/Fragment',
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
    "com/mgc/crewprd/workflowuimodule/model/models",
    "sap/ui/core/mvc/XMLView"
  ],
  function (UIComponent, Device, JSONModel, MessageBox, Fragment, Filter, FilterOperator, models,XMLView) {
    "use strict";
    var  oModel;
    return UIComponent.extend(
      "com.mgc.crewprd.workflowuimodule.Component",
      {
       
        metadata: {
          manifest: "json",
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
          // call the base component's init function
          UIComponent.prototype.init.apply(this, arguments);

          // enable routing
          this.getRouter().initialize();

          // set the device model
          this.setModel(models.createDeviceModel(), "device");

          this.setTaskModels();

          oModel = this.getModel("mgcdb-prd-srv");

            // // Load the XML view
            // var oView = XMLView.create({
            //     id: this.createId("myView"), // set an ID for the view
            //     viewName: "com.mgc.crew.workflowuimodule.view.App"
            // });

            // // Access the table by ID
            // oView.loaded().then(function() {
            //     var oTable = sap.ui.getCore().byId(oView.createId("workDetailTab"));
            //     if (oTable) {
            //     // Do something with the table
            //     console.log("Found the table:", oTable);
            //     } else {
            //     console.error("Table not found");
            //     }
            // });

            // Place the view in the UIComponent container
            // this.setAggregation("rootControl", oView);




            
        //   var worktab = this.getModel("context").getProperty("/main");
        //   var line = 0;
        //   var Items = sap.ui.getCore().byId("workDetailTab").getItems();
        //   for (let wa_work of worktab){
        //       var cells = Items[line].getCells();
        //       line = line + 1;
        //       for( var j = 0; j < cells.length; j++){
        //       if (cells[j] instanceof sap.m.Input){
        //           if(cells[j].getValue() == ''){
        //               cells[j].setEditable(false);
        //               }
        //           }
        //       }
        //   }

          
          const rejectOutcomeId = "reject";
          this.getInboxAPI().addAction(
              {
              action: rejectOutcomeId,
              label: "Reject",
              type: "reject",
              },
              function () {

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
                              "AppName": "CP_CREW_1",
                              "EmployeeID": tableData[i].Resource,
                              "Date":tableData[i].Date,
                              "Activity":tableData[i].Activity,
                              "ReceivingUnitTruck":tableData[i].ReceivingUnitTruck,
                              "SendingUnitTrailer":tableData[i].SendingUnitTrailer,
                              "Job":tableData[i].Job,
                              "Section":tableData[i].Section,
                              "Phase":tableData[i].Phase,
                              "CostCenter":tableData[i].CostCenter,
                              "WorkOrder": tableData[i].Workorder,
                              "PayCode":tableData[i].PayCode,
                              //what is EnterHours??
                              "TotalHours":tableData[i].Hours,
                                "SaveSubmitStatus":"Rejected",
                            };
                            var batchOperation = oDataModel.createBatchOperation("/TimeSheetDetails_prd(ID="+dataPayload.ID+",AppName='CP_CREW_1',Date='"+dataPayload.Date+"')", "PATCH", dataPayload);
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

              this.completeTask(false, rejectOutcomeId);
              },
              this
          );
          const approveOutcomeId = "approve";
          this.getInboxAPI().addAction(
              {
              action: approveOutcomeId,
              label: "Approve",
              type: "accept",
              },
              function () {
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
                                "AppName": "CP_CREW_1",
                                "EmployeeID": tableData[i].Resource,
                                "Date":tableData[i].Date,
                                "Activity":tableData[i].Activity,
                                "ReceivingUnitTruck":tableData[i].ReceivingUnitTruck,
                                "SendingUnitTrailer":tableData[i].SendingUnitTrailer,
                                "Job":tableData[i].Job,
                                "Section":tableData[i].Section,
                                "Phase":tableData[i].Phase,
                                "CostCenter":tableData[i].CostCenter,
                                "WorkOrder": tableData[i].Workorder,
                                "PayCode":tableData[i].PayCode,
                                //what is EnterHours??
                                "TotalHours":tableData[i].Hours,
                                "SaveSubmitStatus":"Approved",
                            };
                            var batchOperation = oDataModel.createBatchOperation("/TimeSheetDetails_prd(ID="+dataPayload.ID+",AppName='CP_CREW_1',Date='"+dataPayload.Date+"')", "PATCH", dataPayload);
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

              this.completeTask(true, approveOutcomeId);
              },
              this
          );
          },

          setTaskModels: function () {
          // set the task model
          var startupParameters = this.getComponentData().startupParameters;
          this.setModel(startupParameters.taskModel, "task");

          // set the task context model
          var taskContextModel = new sap.ui.model.json.JSONModel(
              this._getTaskInstancesBaseURL() + "/context"
          );
          this.setModel(taskContextModel, "context");
          },

          _getTaskInstancesBaseURL: function () {
          return (
              this._getWorkflowRuntimeBaseURL() +
              "/task-instances/" +
              this.getTaskInstanceID()
          );
          },

          _getWorkflowRuntimeBaseURL: function () {
          var appId = this.getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          var appModulePath = jQuery.sap.getModulePath(appPath);

          return appModulePath + "/bpmworkflowruntime/v1";
          },

          getTaskInstanceID: function () {
          return this.getModel("task").getData().InstanceID;
          },

          getInboxAPI: function () {
          var startupParameters = this.getComponentData().startupParameters;
          return startupParameters.inboxAPI;
          },

          completeTask: function (approvalStatus, outcomeId) {
          this.getModel("context").setProperty("/approved", approvalStatus);
          this._patchTaskInstance(outcomeId);
          this._refreshTaskList();
          },

          _fetchToken: function() {
                var fetchedToken;
    
                jQuery.ajax({
                    url: this._getWorkflowRuntimeBaseURL() + "/xsrf-token",
                    method: "GET",
                    async: false,
                    headers: {
                    "X-CSRF-Token": "Fetch",
                    },
                    success(result, xhr, data) {
                    fetchedToken = data.getResponseHeader("X-CSRF-Token");
                    },
                });
                return fetchedToken;
          },

          _patchTaskInstance: function (outcomeId) {
          const context = this.getModel("context").getData();
          var data = {
              status: "COMPLETED",
              context: {...context, comment: context.comment || ''},
              decision: outcomeId
          };

          jQuery.ajax({
              url: `${this._getTaskInstancesBaseURL()}`,
              method: "PATCH",
              contentType: "application/json",
              async: true,
              data: JSON.stringify(data),
              headers: {
              "X-CSRF-Token": this._fetchToken(),
              },
          }).done(() => {
              this._refreshTaskList();
          })
          },

          _refreshTaskList: function () {
          this.getInboxAPI().updateTask("NA", this.getTaskInstanceID());
          },
      }
    );
  }
);
