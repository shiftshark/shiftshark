/*
 *  6.170 Schedule UI interface and Library
 *  Lead Author: Michael Belland
 *
 */

$(document).on('click', '.cell', function(evt) {
	$(this).addClass('active');
    var shiftId = $(this).parent().attr('shift');
    var shift = client_shifts_get_one(shiftId).data;
    var startDate = new Date(shift.startDate);
    var endDate = new Date(shift.endDate);

    // var startMonth = 
});

var changeColor = function(shift, color){
    //$(shiftId)

}

var addShift = function(shiftId){
	
}

var deleteShift = function(shiftId){
	//$("something").find("#"+shiftId);
}

var createShift = function(shiftId){
	
}