$(document).on('click', '.cell', function(evt) {
	console.log(evt.target);
	console.log(evt.target[0]);
	evt.preventDefault();
	alert("hello");
});