var sTimeDisplayFormat = 'Full'; // default to "Full"

var oHourglass = (function () {
	var fTimeout1, fTimeout2, fTimeout3, nHourglassSpeed = 500;
	var animate = function () {
		$('#time').html('&#xf251;');
		fTimeout1 = setTimeout(function () {
			$('#time').html('&#xf252;');
		}, nHourglassSpeed);
		fTimeout2 = setTimeout(function () {
			$('#time').html('&#xf253;');
		}, nHourglassSpeed * 2);
		fTimeout3 = setTimeout(animate, nHourglassSpeed * 3);
	};
	return {
		start: function () {
			$('#time').addClass('fa');
			animate();
		},
		stop: function () {
			clearTimeout(fTimeout1);
			clearTimeout(fTimeout2);
			clearTimeout(fTimeout3);
			$('#time').removeClass('fa');
		}
	}
})();
oHourglass.start();

$('#datetimepicker').datetimepicker({
	//defaultDate : new Date().setDate(new Date().getDate() + 1),
	format: 'Do MMM YY, H:mm',
	showClear: true,
	showTodayButton: true,
	ignoreReadonly: true,
	useCurrent: false,
	widgetPositioning: {
		horizontal: 'right'
	}
});

var oEndTime = null, fCountdownInterval = null;
$("#datetimepicker").on("dp.change", function (e) {
	if (!e.date || !e.date._d) {
		oEndTime = null;
		clearInterval(fCountdownInterval);
		oHourglass.start();
	} else {
		if (!oEndTime) {
			fCountdownInterval = setInterval(fCountDown, 1000);
		}
		oEndTime = e.date._d.getTime();
		oHourglass.stop();
		fCountDown();
	}
});

var oActiveItem = $('#mySideNav').children().first();
oActiveItem.addClass('activeitem');
$('#mySideNav').children().each(function () {
	$(this).on('click', function (e) {
		// console.log($(this).text());
		oActiveItem.removeClass('activeitem');
		oActiveItem = $(this);
		oActiveItem.addClass('activeitem');
		sTimeDisplayFormat = $(this).text();
		fCountDown();
	});
});

function fCountDown() {
	if (!oEndTime) { return; }
	// Find the distanceInMillisecond between NOW an the count down date/time
	var distanceInMillisecond = oEndTime - new Date().getTime();
	if (distanceInMillisecond < 0) {
		//clearInterval(fCountdownInterval);
		$('#time').html('IT COMES!');
	} else {
		$("#time").html(calculation(sTimeDisplayFormat, distanceInMillisecond));
	}
};

function calculation(sTimeDisplayFormat, distanceInMillisecond) {
	switch (sTimeDisplayFormat) {
		case 'Full':
			var days = Math.floor(distanceInMillisecond / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distanceInMillisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distanceInMillisecond % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distanceInMillisecond % (1000 * 60)) / 1000);
			return "<b>" + days + "</b>" + "d " + "<b>" + hours + "</b>" + "h " + "<b>" + minutes + "</b>" + "m " + "<b>" + seconds + "</b>" + "s";
		case 'Second':
			var seconds = Math.floor(distanceInMillisecond / 1000);
			return "<b>" + seconds + "</b> " + (seconds > 1 ? "seconds" : "second");
		case 'Minute':
			var minutes = Math.floor(distanceInMillisecond / (1000 * 60));
			return "<b>" + minutes + "</b> " + (minutes > 1 ? "minutes" : "minute");
		case 'Hour':
			var hours = Math.floor(distanceInMillisecond / (1000 * 60 * 60));
			return "<b>" + hours + "</b> " + (hours > 1 ? "hours" : "hour");
		case 'Day':
			var days = Math.round(distanceInMillisecond / (1000 * 60 * 60 * 24) * 100) / 100;
			return "<b>" + days + "</b> " + (days > 1 ? "days" : "day");
		case 'Month':
			var months = Math.round(distanceInMillisecond / (1000 * 60 * 60 * 24 * 30) * 100) / 100; // generalize each month having 30 days
			return "<b>" + months + "</b> " + (months > 1 ? "months" : "month");
		case 'Year':
			var years = Math.round(distanceInMillisecond / (1000 * 60 * 60 * 24 * 365) * 100) / 100; // generalize each year having 365 days
			return "<b>" + years + "</b> " + (years > 1 ? "years" : "year");
	}
}