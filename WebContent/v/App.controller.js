sap.ui.controller("smithfield.transportation.v.App", {
	 
	/**
	 * Navigates to another page
	 * @param {string} pageId The id of the next page
	 * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
	 */
	to : function (pageId, context) {
		
		var app = this.getView().app;
		
		// load page on demand
		var master = ("Customers" === pageId);
		
		if (app.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id : pageId,
				viewName : "smithfield.transportation.v." + pageId,
				type : "XML"
			});
			page.getController().nav = this;
			app.addPage(page, master);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}
		
		if (context) {
			
			var page = app.getPage(pageId);
			
			if(pageId == "Main"){
				
				var templateItem = page.byId("oShipmentsListItem");
				page.byId("oShipmentsList").bindItems(context.getPath()+'/ShipmentDetailItemSet', templateItem);
				page.setBindingContext(context);
				this.goTo(pageId);
				
			}else if(pageId == "Detail"){
				
				//Odata
				page.bindElement("/ShipToHeaderCol(ShipTo='" + context.ShipTo + "',Shipmentid='" + context.Shipmentid + "')");
				
				//JSON
				//page.setBindingContext(context.acontext);
				
				this.goTo(pageId);
				
			}else{
				
				page.setBindingContext(context);
				this.goTo(pageId);
				
			};
			
		}else{
			
			this.goTo(pageId);
			
		}
	},
	
	goTo: function(whatpage){
		if (this.getView().getModel("loadedModel").getProperty("/loaded")){
			this.getView().app.to(whatpage);
		}else{
			var towhatpage = whatpage;
			var thisController = this;
		    setTimeout(function () {
		    	thisController.goTo(towhatpage);
		    }, 200);
		}
	},
	    
	/**
	 * Navigates back to a previous page
	 * @param {string} pageId The id of the next page
	 */
	back : function (pageId) {
		this.getView().app.backToPage(pageId);
	},
	
	/**
	 * Open a dialog
	 */
	openDialog: function (sType) {
	    if (!this[sType]) {
	      this[sType] = sap.ui.xmlfragment("smithfield.transportation.v." + sType,this);
	    }
	    this[sType].open();
	},
	
	/**
	 * Close a dialog
	 */
	closeDialog: function (sType) {
		if (this[sType]) {
			this[sType].close();
		}
	},
	

	/**
	 * check if the service user and pass correct and Load the app odata model
	 * Navigate to Customers (ship to) screen
	 */
	loadModel: function(user, pass, remem){
		
		/*//JSON MODEL
		var oModel = new sap.ui.model.json.JSONModel("d/data.json");
		if((user.toLowerCase()=="nikir" && pass.toLowerCase()=="welcome")||(user.toLowerCase()=="admin" && pass.toLowerCase()=="admin")){*/
		
		
		//ODATA MODEL
		//when Local
		//var oServiceUrl = "proxy/http/ddcffiwin10.ffi.local:8000/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/";
		
		//when ABAP NG Server
		var oServiceUrl = "/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/";
		
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true, user, pass);
		oModel.setSizeLimit(1000);
		oModel.setDefaultCountMode("Inline");
		
		//check odata status
		//var metadataRead = oModel.getServiceMetadata();
		//var dataServicesRead = metadataRead && metadataRead.dataServices || null;
		
		var dataServicesRead = false;
		
		oModel.refreshSecurityToken(
				function(){
					dataServicesRead = true;
				},
				function(oError){ 
					//alert(oError.message);
					});
		
		if(dataServicesRead){
			
			if(remem){
				//updated the local storage data for user and password
				var smithfieldUserData = {"name":user,"password":pass};
				jQuery.sap.require("jquery.sap.storage");
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);  
				oStorage.put("smithfieldUserData", smithfieldUserData);
				
				console.log("Correct User Data saved at local storage.");
			};
			
			
			//close the loding dialog from login controller
			this.closeDialog('Loading');
			
			// When Request sent
			oModel.attachRequestSent(jQuery.proxy(function(oEvent) {
				this.openDialog('Loading');
				this.getView().getModel("loadedModel").setProperty("/loaded",false);
		    }, this));

		    // When Request completed
			oModel.attachRequestCompleted(jQuery.proxy(function(oEvent) {
				this.closeDialog('Loading');
				this.getView().getModel("loadedModel").setProperty("/loaded",true);
		    }, this));
			
			//Set the model to the App view
			this.getView().setModel(oModel);
			
			var LoginSucssesWelcomeMsg= this.getView().getModel("i18n").getResourceBundle().getText("LoginSucssesWelcomeMsg");
			
			jQuery.sap.require("sap.m.MessageToast");
			sap.m.MessageToast.show(LoginSucssesWelcomeMsg);
			
			this.getView().app.setMode("ShowHideMode");
			this.getView().app.showMaster();
			
			//go to ship to screen
			this.to("Customers");
			
		}else{
			
			var LoginErrorMsg= this.getView().getModel("i18n").getResourceBundle().getText("LoginErrorMsg");
			
			this.closeDialog('Loading');
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert(LoginErrorMsg);
			
		};
		
	},
	
	
	/**
	 * Logout dialog buttons
	 */
	LogOutButton: function() {
		this.back("Empty");
		this.back("Login");
		sap.ui.getCore().byId("App").app.setMode("StretchCompressMode");
		this.closeDialog("LogOut");
		this.logOut();
	},

	LogOutCancelButton: function () {
	    this.closeDialog("LogOut");
	},
	
	/**
	 * Log Out function
	 */
	logOut: function(){
		
		sap.ui.getCore().byId("App").destroy();
		
		/*//JSON Logoff
		jQuery.sap.delayedCall(400, this, function () {
        	location.reload();
        });*/
		
		//Odata logoff
		$.ajax({
			type: "GET",
			url: "/sap/public/bc/icf/logoff",  //Clear SSO cookies: SAP Provided service to do that
			//url: "proxy/http/ddcffiwin10.ffi.local:8000/sap/public/bc/icf/logoff",  //when local testing
			}).done(function(data){ //Now clear the authentication header stored in the browser
				if (!document.execCommand("ClearAuthenticationCache")) {
					//"ClearAuthenticationCache" will work only for IE. Below code for other browsers
					/*$.ajax({
						type: "GET",
						url: "/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/", //any URL to a Gateway service
						//url: "proxy/http/ddcffiwin10.ffi.local:8000/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/", //when local testing
						username: 'dummy', //dummy credentials: when request fails, will clear the authentication header  
	                    password: 'dummy',  
	                    statusCode: {401: function() {
	                    		//This empty handler function will prevent authentication pop-up in chrome/firefox
	                    	} },  
	                        error: function() {
	                        	//alert('reached error of wrong username password')
	                        	}
	                });*/
					
					var oServiceUrl = "/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/";
					//oServiceUrl= "proxy/http/ddcffiwin10.ffi.local:8000/sap/opu/odata/sap/ZSMITHFIELD_TRANSPORTATION_SRV/"; //when local testing
					var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true, "dummy", "dummy");
					
					oModel.refreshSecurityToken(
							function(){
								console.log("Loged Out");
							},
							function(oError){ 
								console.log(oError.message);
							});
	            };
	            
	            jQuery.sap.delayedCall(200, this, function () {
	            	location.reload();
	            });
	            
	     });
	}
	
});