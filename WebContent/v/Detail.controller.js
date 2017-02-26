jQuery.sap.require("smithfield.transportation.util.Formatter");
 
sap.ui.controller("smithfield.transportation.v.Detail", {
	onAfterRendering: function() {
		/*var cContext = this.getView().getBindingContext();
		
		this.getView().getModel().read(cContext.getPath(), undefined, undefined, true,
				function (data, response){
				alert(data.Comments);
			},
			function (err){
				alert("ERROR Comments   " + err);
			}
		);*/
	},

	actBack: function(evt) {
		this.nav.back("Main");
	}
	
});