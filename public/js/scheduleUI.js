$(document).on('click', '.cell', function(evt) {
	evt.preventDefault();
	alert("just some test");
});

$(document).ready(function(){
	$.ajax({
	    type: "POST",
	    url: "users/employers/",
	    data: { schedule_name: "Test",
	    	first_name: "Hello",
	    	last_name: "Kitty",
	    	email: "hkitty@mit.edu",
	    	password: "sanrio"
		},
	    success: function(data){
	    },
	    failure: function(data){
	    	console.log("API call failed, probably because an incorrect URL was queried");}
	});
	    
	$.ajax({
	    type: "POST",
	    url: "shifts/",
	    data: { shift: {_id: 1,
			assignee: {
				_id: 2,
		    	firstName: "Hello",
		    	lastName: "Kitty",
		    	email: "hkitty@mit.edu",
			},
			claimant: null,
			position: {
				_id: 3,
			    name: "Mascot"
			},
			startTime: 8*60,
			endTime: 9*60,
			date: Date,
			trading: Boolean
		}},
	    success: function(data){
	    	console.log(data);
	    },
	    failure: function(data){
	    	console.log("API call failed, probably because an incorrect URL was queried");
	    }
	});
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