sap.ui.controller("smithfield.transportation.v.Login", {
	onInit : function () {
		//attache the validation to the app
		sap.ui.getCore().attachValidationError(function(evt) {
			var control = evt.getParameter("element");
			if (control && control.setValueState) {
				control.setValueState("Error");
			}
		});
		sap.ui.getCore().attachValidationSuccess(function(evt) {
			var control = evt.getParameter("element");
			if (control && control.setValueState) {
				control.setValueState("None");
			}
		});
	},
	 
	onAfterRendering: function() {
		sap.ui.getCore().byId("App").app.setMode("StretchCompressMode");
	},
	
	focusName: function() {
		this.getView().byId("inptLoginName").focus();
	},
	
	focusPass: function() {
		this.getView().byId("inptLoginPassword").focus();
	},
	
	updateLocalStorage:function(evt){
		var rememberUser = evt.getParameter("selected");
		console.log("rememberUser: " + rememberUser);
		
		if(!rememberUser){
			//clear local web storage if availabel
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			
			if (oStorage.get("smithfieldUserData")) {
				oStorage.clear();
				console.log("LocalStorage Cleared");
			};
			
		};
	},
	
	actLogin: function(evt) {
		
		// collect input controls
		var view = this.getView();
		var inputs = [
			view.byId("inptLoginName"),
			view.byId("inptLoginPassword")
		];

		// check that inputs are not empty
		// this does not happen during data binding as this is only triggered by changes
		jQuery.each(inputs, function (i, input) {
			if (!input.getValue()) {
				input.setValueState("Error");
			}
		});

		// check states of inputs
		var canContinue = true;
		jQuery.each(inputs, function (i, input) {
			if ("Error" === input.getValueState()) {
				canContinue = false;
				return false;
			}
		});

		// output result
		if (canContinue) {
			this.nav.openDialog('Loading');
			var oUser = this.getView().byId("inptLoginName").getValue();
			var oPass = this.getView().byId("inptLoginPassword").getValue();
			var remember = this.getView().byId("idRememberChkb").getSelected();
			this.nav.loadModel(oUser,oPass,remember);
		} else {
			var LoginErrorMsg= this.getView().getModel("i18n").getResourceBundle().getText("LoginErrorMsg");
			
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert(LoginErrorMsg);
		}
	}
});