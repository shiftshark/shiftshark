$(document).on('click', '.cell', function(evt) {
	evt.preventDefault();
	alert("just some test");
});

$(document).ready(function(){
	console.log("shifts/");
	$.ajax({
	    type: "GET",
	    url: "shifts/",
	    data: { startDate: undefined, endDate: undefined, trading: undefined, assignee: undefined, claimant: undefined},
	    success: function(data){
	    	console.log(data);
	    },
	    failure: function(data){
	    	console.log("API call failed, probably because an incorrect URL was queried");
	    }
	});
});