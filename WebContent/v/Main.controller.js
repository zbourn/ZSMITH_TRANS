jQuery.sap.require("smithfield.transportation.util.Formatter");
sap.ui.controller("smithfield.transportation.v.Main", {
	
	onAfterRendering: function() {
		
	},
	
	actBack: function(evt) {
		this.nav.back("Empty");
		if(sap.ui.Device.system.phone){
			this.nav.back("Customers");
		};
		sap.ui.getCore().byId("App").app.showMaster();
	},
	
	handleShipmentSelect: function(evt){
		var thiscontext = evt.getParameter("listItem").getBindingContext();
		var thisModel = this.getView().getModel();
		var thisShipTo = thisModel.getProperty("ShipTo",thiscontext);
		var thisShipmentid = thisModel.getProperty("Shipmentid",thiscontext);
		
		this.nav.to("Detail", {acontext:thiscontext, ShipTo:thisShipTo, Shipmentid:thisShipmentid});
	},
	
	handleSearch: function(evt){
		// create model filter
		var filters = [];
		var query = evt.getParameter("query");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("CustomerPo", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
		}
		
		// update list binding
		var list = this.getView().byId("oShipmentsList");
		var binding = list.getBinding("items");
		binding.filter(filters);
	},
	
	handleRefresh : function (evt) {
		this.getView().getModel().refresh();
		this.refreshDone();
	},
	
	refreshDone:function () {
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