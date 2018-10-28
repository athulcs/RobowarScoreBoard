var socket = io();
var startPressed=false;
var pausePressed=false;
var initialConfig;
var CURRENT_TIME;
var TIME_INTERVAL = 100;
var TIME_CUTOFF = 59999;

// Socket to emit type of connection to server
socket.emit('type', 'remote');

// Button handler to send signal to server to pause time
$('#start').click(function () {
	if(!startPressed){
		startPressed = true;
		pausePressed = false;
		startClock();
		socket.emit('start time', '');
	}
});

// Button handler to send signal to server to start time
$('#stop').click(function () {
	if(!pausePressed){
		pausePressed =true;
		startPressed =false;
		stopClock();
		socket.emit('pause time', '');
	}
});

// Button handler to send signal to server to reset clock
$('#resetclock').click(function () {
	socket.emit('reset clock', '');
	stopClock();
	CURRENT_TIME = initialConfig.half_length;
	$('#mainclock').css('color', 'white');
	updateClock();
});

// Button handler to send signal to server to reset shot clock
$('#shotclockremote').click(function () {
	socket.emit('reset shot clock', '');
});

// Button handler to send signal to server to start a timeout
$('#timeout').click(function () {
	socket.emit('start timeout', '');
});

// Functions to give functionality to plus and minus buttons

$('#teamhomeplus').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val+=10;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamhomeplustw').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val+=20;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamhomeplusth').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val+=30;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamawayplus').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val+=10;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

$('#teamawayplustw').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val+=20;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

$('#teamawayplusth').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val+=30;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

$('#teamhomeminus').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val-=10;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamhomeminustw').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val-=20;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamhomeminusth').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val-=30;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});



$('#teamawayminus').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val-=10;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

$('#teamawayminustw').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val-=20;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

$('#teamawayminusth').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val-=30;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});


$('#resetbutton').click(function () {
		initialConfig.team_home=document.getElementById("team1").value;
		initialConfig.team_away=document.getElementById("team2").value;
		initialConfig.team_home_score=0;
		initialConfig.team_away_score=0;
		$('#teamhometitle').text(initialConfig.team_home);
		$('#teamawaytitle').text(initialConfig.team_away);
		$('#teamhomescore').attr('value', initialConfig.team_home_score);
		$('#teamawayscore').attr('value', initialConfig.team_away_score);
		var teams = {
		team1: initialConfig.team_home,
		team2: initialConfig.team_away
		}
		pausePressed =true;
		startPressed =false;
		stopClock();
		CURRENT_TIME = initialConfig.half_length;
		updateClock();
		socket.emit('new game',teams);
});


/**
 * Function to change the score of a team
 * @param  {Strong} scoreTeam Name of the team that scored
 * @param  {Number} newScore  New score of the team
 */
function changeScore (scoreTeam, newScore) {
	var out = {
		score: newScore,
		team: scoreTeam
	}
	socket.emit('update score', out);
}

socket.on('initial game state', function (state) {
	initialConfig = state;
	if (CURRENT_TIME === undefined) {
		CURRENT_TIME = initialConfig.half_length;
	}
	$('#teamhometitle').text(initialConfig.team_home);
	$('#teamawaytitle').text(initialConfig.team_away);
	$('#teamhomescore').attr('value', initialConfig.team_home_score);
	$('#teamawayscore').attr('value', initialConfig.team_away_score);
	updateClock();
});

socket.on('current time status',function(status){
	if(status==='pause'){
		pausePressed =true;
		startPressed =false;
		stopClock();
	}
});

function updatePageTimeStatus (status) {
	var status;
	if (status === 'start') {
		status = 'Clock Running';
	} else {
		status = 'Clock Stopped';
	}
	$('#timerstatus').text(status);
}


// Maintimer scripts

function startClock () {
	if (CURRENT_TIME != 0) {
		var prevCycleTime = new Date().getTime();
		clockInterval = setInterval(function () {
			var currentTime = new Date().getTime();
			if (currentTime - prevCycleTime >= TIME_INTERVAL) {
				CURRENT_TIME = CURRENT_TIME - TIME_INTERVAL;
				updateClock();
				prevCycleTime = currentTime;
			}
		}, 1);
	} 
}

function updateClock () {
	var printTime;
	if (CURRENT_TIME === 0) {
		clearInterval(clockInterval);
		stopClock();
		$('#mainclock').css('color', 'red');
	}
	var formattedTime = msToTime(CURRENT_TIME);
	if (CURRENT_TIME >= TIME_CUTOFF) {
		// Greater than TIME_CUTOFF
		printTime = formattedTime[1] + ':' + formattedTime[2];
	} else {
		// Less than TIME_CUTOFF
		var ms = formattedTime[3];
		ms = ms / 100;
		printTime = formattedTime[2] + '.' + ms;
	}
	$('#mainclock').text(printTime);
}

function msToTime (s) {
	
	function addZ (n) {
		return (n < 10? '0' : '') + n;
	}
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	return [addZ(hrs), mins, addZ(secs), addZ(ms)];
}

function stopClock () {
	clearInterval(clockInterval);
}
