var socket = io();
var startPressed=false;
var pausePressed=false;
var initialConfig;

// Socket to emit type of connection to server
socket.emit('type', 'remote');

// Button handler to send signal to server to pause time
$('#start').click(function () {
	if(!startPressed){
		startPressed = true;
		pausePressed = false;
		socket.emit('start time', '');
	}
});

// Button handler to send signal to server to start time
$('#stop').click(function () {
	if(!pausePressed){
		pausePressed =true;
		startPressed =false;
		socket.emit('pause time', '');
	}
});

// Button handler to send signal to server to reset clock
$('#resetclock').click(function () {
	socket.emit('reset clock', '');
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
	$('#teamhometitle').text(initialConfig.team_home);
	$('#teamawaytitle').text(initialConfig.team_away);
	$('#teamhomescore').attr('value', initialConfig.team_home_score);
	$('#teamawayscore').attr('value', initialConfig.team_away_score);
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