sap.ui.controller("smithfield.transportation.v.Customers", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
	//onInit: function(oEvent) {
	//},
 
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//	onBeforeRendering: function() {
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
	//onAfterRendering: function() {
		
		/*this.getView().getModel().read("/ShipmentDetailItemCol(ShipTo='0000416200',Shipmentid='0020170334')", undefined, undefined, true,
				function (data, response){
				alert(data.Comments);
			},
			function (err){
				alert("ERROR Comments   " + err);
			}
		);*/

	//},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
	onExit: function() {
		if (this._oPopover) {
		    this._oPopover.destroy();
		}
	},
	
	logOff: function (oEvent) {
	    this.nav.openDialog("LogOut");
	},
	
	doRefresh : function () {
		this.getView().getModel().refresh();
	},
	
	handleCustomerSelect: function(evt){
		var thisContext = evt.getParameter("listItem").getBindingContext();
		this.nav.to("Main",thisContext);
		sap.ui.getCore().byId("App").app.hideMaster();
	},
	
	handleSearch: function(evt){
		// create model filter
		var filters = [];
		var query = evt.getParameter("query");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("ShipToName", sap.ui.model.FilterOperator.Contains, query);
			//var filter = new sap.ui.model.odata.Filter("ShipToName", [{operator:"EQ",value1:query}], true);//for odata search
			filters.push(filter);
		}
		
		// update list binding
		var list = this.getView().byId("oCustomersList");
		var binding = list.getBinding("items");
		binding.filter(filters);
	},
	
	handleRefresh : function (evt) {
		this.getView().getModel().refresh();
		this.refreshDone();
	},
	
	refreshDone: function () {
		if (this.getView().getModel("loadedModel").getProperty("/loaded")){
			this.getView().byId("pullToRefresh").hide();
		}else{
			var thisController = this;
		    setTimeout(function () {
		    	thisController.refreshDone();
		    }, 200);
		}
	}	

});