jQuery.sap.declare("smithfield.transportation.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

smithfield.transportation.util.Formatter = {
	date : function (value) { 
		if (value) {
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd/yyyy"});  
			
			//when Odata
			return oDateFormat.format( new Date(value.getTime() + TZOffsetMs));
			
			//when JSON
			//return oDateFormat.format( new Date(value));
			
		} else {
			return value;
		}
	},
	time: function (value) {
		if (value) {
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
			var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "kk:mm"});
			
			//when Odata
			return oTimeFormat.format(new Date(value.ms + TZOffsetMs));
			
			//when JSON
			//return oTimeFormat.format(new Date(value));
			
		} else {
			return value;
		}
	},
	ETAdate : function (value) { 
		if (value) {
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd/yyyy"});
			
			//when Odata
			return oDateFormat.format( new Date(value.getTime() + TZOffsetMs));
			
			//when JSON
			//return oDateFormat.format( new Date(value));
			
		} else {
			return value;
		}
	},
	
	lineBreak: function(value){
		if (value) {
			var str = value;
		    var res = str.replace(/###/g, "\n");
		    return res;
		}else{
			return value;
		}
	},
	
	ponumber: function(value){
		if (value) {
			var str = value;
		    var res = str.replace(/###/g, "   |   ");
		    return res;
		}else{
			return value;
		}
	}
};