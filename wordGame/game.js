var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 800,
    backgroundColor: '#f5f6fa',
    physicas: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    dom: {
        createContainer: true
    },
    scene: {

        preload: preload,
        create: create,
        update: update
    }
    //scene : [ Main ]
};

var lastWindoWidth = window.innerWidth;
var phaserPositionAdjX = config.width < window.innerWidth ? ((window.innerWidth - config.width) / 2) : 0;
var phaserPositionAdjY = 13;

var str_tour = '          Tour';
var str_team = 'Nom d\'équipe';
var str_addTeam = '      +      '
var str_clearScore = ' Remis à zéro ';
var str_top3 = ' Final '
var top3StartY = -200;
var top3EndY = 240;
var top3StartX = config.width * 0.5;

var style_title = {
    fontFamily: 'Arial',
    fontSize: 25,
    //color: '#000000' ,
    align: 'center'
};


var style_top3 = {
    fontFamily: 'Arial',
    fontSize: 25,
    color: '#000000',
    align: 'center'
};

var style_letters = {
    fontFamily: 'Arial',
    fontSize: 120,
    color: '#000000',
    align: 'center'
};

var style_timer = {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#666666',
    align: 'center'
};

var style_subtitle = {
    fontFamily: 'Arial',
    fontSize: 15,
    color: '#000000',
    align: 'left'
};

var style_button = {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#000000',
    backgroundColor: '#46b890',
    align: 'left'
};

var style_team = {
    fontFamily: 'Arial',
    fontSize: 25,
    //color: '#000000' ,
    backgroundColor: '#000000',
    align: 'center'
}

var style_TurnScore = {
    fontFamily: 'Arial',
    fontSize: 15,
    color: '#000000',
    //backgroundColor : '#46b860',
    align: 'left'
};

//var style_InputNumStr = "width:40px; height: 30px; margin-top: 24px; margin-left: 10px;border-style: solid;";
var style_InputNumStr = "width:40px; height: 22px; border-style: solid; padding: 2px;ext-align: left;font-weight: bold;font-family: Arial;";
var tiltleStartFrom = 363;
var subTiltleStartFrom = tiltleStartFrom + 43;

var teamStartY = 438;
var tourStartX = config.width * 0.2;
var tourwidth = config.width * 0.17;
var teamHight = 38;

var timerPositionX = config.width * 0.9;
var timerPositionY = 80;

var lettersPositionX = config.width * 0.5;
var lettersPositionY = 240;

var teams = new Array();
var me;
var game;
var timer;
var timerIcon;
var startTimerButton;
var timerMax = 2;
var timedEvent;
var timerStarted = false;
var letterindex = 0;
var tournIndex = 0;
var lettersSrc = [
    "A B C D E F G H",
    "A B C D E F G J",
    "A B C D E F G K",
    "A B C D E F G L",
    "A B C D E F G N",
    "A B C D E F G Y",
    "A B C D E F G Z",
    "A B C D E F G X",
    "A B C D E F G V"
];
var explication;
var lettersImags = new Array();
var tournBackGroundColor = [
    "#b0dadb",
    "#f0e9e1",
    "#d6e1f1"
];

var tournInputBackGroundColor = [
    "background-color: #b0dadb; border-color:#3cafa2;",
    "background-color: #f0e9e1; border-color:#f6a91f;",
    "background-color: #d6e1f1; border-color:#00509d;"
]

function comuteTopNumber() {
    teams.sort(function(a, b) {
        return +b.score - +a.score;
    });

    teams.forEach(
        function myFunction(item, index) {
            item.scoreOutput.setText(item.score);
            item.ranking = index;
            item.topOutput.setText(index + 1);
            // item.topOutput.setHTML("<img style='right: 50px;' src='./img/main/medal_" + (index+1) + ".png' />"); // MEDAL_CODE
        });
}

function top3() {
    comuteTopNumber();
    if (teams.length < 1)
        reture;
    var top1 = new Array();
    var top2 = new Array();
    var top3 = new Array();
    var top123s = [top1, top2, top3];
    var shoulTop3 = false;

    var topScore = teams[0].score;
    var topIndex = 0;
    teams.forEach(
        function myFunction(item, index) {
            if (item.ranking >= 0)
                shoulTop3 = true;

            if (topScore == item.score)
                top123s[topIndex].push(item.name);
            else {
                topIndex++;
                topScore = item.score;
                top123s[topIndex].push(item.name);
            }

        });
    if (shoulTop3) {
        var top1s = "";
        var top2s = "";
        var top3s = "";
        top1.forEach(
            function myFunction(item, index) {
                top1s += item;
                top1s += "\n";
            });

        top2.forEach(
            function myFunction(item, index) {
                top2s += item;
                top2s += "\n";
            });
        top3.forEach(
            function myFunction(item, index) {
                top3s += item;
                top3s += "\n";
            });

        me.top1text.setText(top1s);
        me.top2text.setText(top2s);
        me.top3text.setText(top3s);
        me.tweens.add({
            targets: me.top3img,
            y: +top3EndY,
            duration: 500

        });
        me.tweens.add({
            targets: me.top1text,
            y: +top3EndY - 20,
            duration: 1000

        });
        me.tweens.add({
            targets: me.top2text,
            y: +top3EndY - 20,
            duration: 900

        });
        me.tweens.add({
            targets: me.top3text,
            y: +top3EndY - 20,
            duration: 800
        });
        lettersImags.forEach(
            function myFunction(item, index) {
                item.visible = false;
            });

        timer.visible = false;
        timerIcon.visible = false;
        startTimerButton.visible = false;
        me.showLetterButton.visible = false;
        me.showLetterButton2.visible = false;
    }
}

function formatTime(seconds) {
    // Minutes
    var minutes = Math.floor(seconds / 60);
    // Seconds
    var partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}

function showLetters() {
    me.showLetterButton.visible = false;
    me.showLetterButton2.visible = false;
    if (letterindex >= 8)
        letterindex = 0;

    lettersImags.forEach(
        function myFunction(item, index) {
            item.visible = false;
        });
    lettersImags[letterindex].visible = true;
    letterindex++;
}

function startTimer() {
    if (!timerStarted) {
        me.initialTime = timerMax;
        timerStarted = true;
        startTimerButton.visible = false;
        me.addTeamButton.visible = false;
    }
}


function onEvent() {
    if (timerStarted) {
        if (me.initialTime <= 0) {
            tournIndex++;
            timerStarted = false;
            startTimerButton.visible = true;

            me.showLetterButton.visible = false;
            me.showLetterButton2.visible = true;
            lettersImags.forEach(
                function myFunction(item, index) {
                    item.visible = false;
                });
        } else {
            me.initialTime -= 1; // One second
            timer.setText(formatTime(me.initialTime));
        }
    }

    if (tournIndex > 2) {
        me.showLetterButton.visible = false;
        me.showLetterButton2.visible = false;
        me.finalButton.visible = true;
    }
}




function showAddTeam() {
    //console.log("Add team");
    document.getElementById('nameField').value = '';
    document.getElementById("myTeamNameInput").style.left = (config.width < window.innerWidth ? ((window.innerWidth - config.width) / 2) : 0) + 200 + "px";
    document.getElementById("myTeamNameInput").style.display = "block";
}

function computeScore(previsionScore, realScore) {
    if (realScore < previsionScore)
        return realScore;
    else
        return realScore + previsionScore;
}

function showTeam(team) {
    var teamYPosition = teamStartY + teamHight * (teams.length - 1);
    me.add.text(40, teamYPosition, team.name, style_team);
    for (var loopIndex = 0; loopIndex < 3; loopIndex++) {
        var tournIndex = loopIndex + 1;
        var tourOffsetX = tourwidth * loopIndex * 1.1;

        team.tours[loopIndex].output = me.add.text(tourStartX + tourwidth * 0.7 + tourOffsetX, teamYPosition + 3, '0', style_TurnScore);

        var prevision = me.add.dom(phaserPositionAdjX + tourStartX + tourOffsetX, teamYPosition + phaserPositionAdjY).createFromHTML("<div class=\"prevision\" style=\"background-color:" + tournBackGroundColor[loopIndex] + "\"><input type=\"number\" min=\"0\" style = \"" + style_InputNumStr + tournInputBackGroundColor[loopIndex] + "\" name = '" + loopIndex + "'></input></div>");
        team.tours[loopIndex].previsionInput = prevision;

        prevision.addListener('input');

        prevision.on('input', function(event) {
            var inputText = this.getChildByName(event.target.name);

            if (event.target.name === '0') {
                //inputText.readOnly = true;
                team.tours[0].prediction = inputText.value;
                //console.log(team.tours[0].prediction);


            } else if (event.target.name === '1') {
                //inputText.readOnly = true;
                team.tours[1].prediction = inputText.value;
                //console.log(team.tours[1].prediction);

            } else if (event.target.name === '2') {
                //inputText.readOnly = true;
                team.tours[2].prediction = inputText.value;
                ////console.log(team.tours[2].prediction);

            }

        });
        var real = me.add.dom(phaserPositionAdjX + tourStartX + tourwidth * 0.4 + tourOffsetX, teamYPosition + phaserPositionAdjY).createFromHTML("<div class=\"real\" style=\"background-color:" + tournBackGroundColor[loopIndex] + "\"><input type=\"number\" min=\"0\" style = \"" + style_InputNumStr + tournInputBackGroundColor[loopIndex] + "\" name = '" + loopIndex + "'></input></div>");
        team.tours[loopIndex].realInput = real;

        real.addListener('input');

        real.on('input', function(event) {
            var inputText = this.getChildByName(event.target.name);
            if (event.target.name === '0') {
                //inputText.readOnly = true;
                //console.log(inputText.value);
                team.tours[0].real = inputText.value;
                team.tours[0].score = computeScore(+team.tours[0].prediction, +team.tours[0].real);
                team.tours[0].output.setText(team.tours[0].score);
            } else if (event.target.name === '1') {
                // inputText.readOnly = true;
                //console.log(inputText.value);
                team.tours[1].real = inputText.value;
                team.tours[1].score = computeScore(+team.tours[1].prediction, +team.tours[1].real);
                team.tours[1].output.setText(team.tours[1].score);
            } else if (event.target.name === '2') {
                // inputText.readOnly = true;
                //console.log(inputText.value);
                team.tours[2].real = inputText.value;
                team.tours[2].score = computeScore(+team.tours[2].prediction, +team.tours[2].real);
                team.tours[2].output.setText(team.tours[2].score);

                team.score = +team.tours[0].score + +team.tours[1].score + +team.tours[2].score;
            }
        });
    }
    team.scoreOutput = me.add.text(tourStartX + 3.5 * tourwidth, teamYPosition, ' 0', style_TurnScore);
    team.topOutput = me.add.text(tourStartX + tourwidth * 3 + tourStartX + 10, teamYPosition, ' ', style_TurnScore);
    // team.topOutput = me.add.dom(tourStartX + tourwidth * 3 + tourStartX + 10,   teamYPosition).createFromHTML(''); // MEDAL_CODE
}


function clearAllScores() {
    /*teams.sort(function(a, b){
    return  +a.index - +b.index;
    });
        lettersImags.forEach(
    function myFunction(item, index) {
    item.visible = false;
    });
    tournIndex = 0;
        timer.visible = true;
    timerIcon.visible = true;
    startTimerButton.visible = true;
    me.showLetterButton.visible = true;
    me.showLetterButton2.setVisible(false);
    me.addTeamButton.visible = true;



    teams.forEach(
    function myFunction(item, index) {
    item.score = 0;
    item.scoreOutput.setText('0');
    item.ranking = -1;
    item.topOutput.setText('');
    //item.topOutput.setHTML(''); // MEDAL_CODE

    item.tours.forEach(function(oneTour, index){
    oneTour.output.setText('0');
    var previsionInputText = oneTour.previsionInput.getChildByName(''+index);
    //previsionInputText.readOnly = false;
    previsionInputText.value = '';
    var realInputText = oneTour.realInput.getChildByName(''+index);
    //realInputText.readOnly = false;
    realInputText.value = '';
    });
    });
    me.initialTime = 0;

        me.top1text.setText("");
    me.top2text.setText("");
    me.top3text.setText("");

    me.top3img.y = top3StartY;
    me.top1text.y=top3StartY- 50;
    me.top2text.y= top3StartY-10;
    me.top3text.y= top3StartY;*/
    location.reload();
}

function help() {
    window.open('/pdf.pdf');
}

function preload() {
    this.load.image('top3img', 'img/main/top3img.png');
    this.load.image('backGround', 'img/main/backGround.png');
    this.load.image('final', 'img/main/finalButton.png');
    this.load.image('clear', 'img/main/clearButton.png');
    this.load.image('addTeam', 'img/main/addTeamButton.png');
    this.load.image('timerIcon', 'img/main/timerIcon.png');
    this.load.image('startTimerButton', 'img/main/startTimer.png');
    this.load.image('explication', 'img/main/explicationImg.png');
    this.load.image('showLetterButton', 'img/main/showLetterButton.png');
    this.load.image('showLetterButton2', 'img/main/showLetterButton2.png');
    this.load.image('letters0', 'img/main/letters/lettersImg0.png');
    this.load.image('letters1', 'img/main/letters/lettersImg1.png');
    this.load.image('letters2', 'img/main/letters/lettersImg2.png');
    this.load.image('letters3', 'img/main/letters/lettersImg3.png');
    this.load.image('letters4', 'img/main/letters/lettersImg4.png');
    this.load.image('letters5', 'img/main/letters/lettersImg5.png');
    this.load.image('letters6', 'img/main/letters/lettersImg6.png');
    this.load.image('letters7', 'img/main/letters/lettersImg7.png');
    this.load.image('letters8', 'img/main/letters/lettersImg8.png');
    // this.load.image('letters9', 'img/main/letters/lettersImg9.png'); // missing file
    this.load.image('bgstrip0', 'img/main/bg_strip0.png');
    this.load.image('bgstrip1', 'img/main/bg_strip1.png');
    this.load.image('aide', 'img/main/aide.png');
    me = this;
}

function create() {
    //teamNameInput = me.add.dom( 110, teamStartY + teams.length*teamHight - 20).createFromHTML("<div id = \"myTeamNameInput\" style = \"display: none\">Nom: <input type=\"text\" id=\"nameField\"><button id = \"InputTeamNameYes\" type=\"button\">Oui</button><button id = \"InputTeamNameNo\" type=\"button\">Non</button></div>");

    this.add.image(640, 370, 'backGround');
    explication = this.add.image(640, 200, 'explication');

    this.add.text(50, tiltleStartFrom, str_team, style_title);
    this.add.text(tourStartX, tiltleStartFrom, str_tour + ' 1', style_title);
    this.add.text(tourStartX + tourwidth, tiltleStartFrom, str_tour + ' 2', style_title);
    this.add.text(tourStartX + tourwidth * 2, tiltleStartFrom, str_tour + ' 3', style_title);
    this.add.text(tourStartX + tourwidth * 3.4, tiltleStartFrom, 'Score', style_title);
    this.add.text(tourStartX + tourwidth * 3 + tourStartX, tiltleStartFrom, 'Top', style_title);
    for (var j = 0; j < 3; j++) {
        var tourOffsetX = tourwidth * j * 1.1;
        this.add.text(tourStartX - 19 + tourOffsetX, subTiltleStartFrom, 'Prevision', style_subtitle);
        this.add.text(tourStartX - 10 + tourwidth * 0.4 + tourOffsetX, subTiltleStartFrom, 'Reel', style_subtitle);
        this.add.text(tourStartX - 10 + tourwidth * 0.69 + tourOffsetX, subTiltleStartFrom, 'Score', style_subtitle);
    }
    this.addTeamButton = this.add.image(110, teamStartY + teams.length * teamHight + 20, 'addTeam');
    this.addTeamButton.setInteractive();
    this.addTeamButton.on('pointerdown', () => showAddTeam());

    this.clearScoreButton = this.add.image(tourStartX + tourwidth * 2.3, teamStartY + teams.length * teamHight + 30, 'clear');
    this.clearScoreButton.setInteractive();
    this.clearScoreButton.on('pointerdown', () => clearAllScores());

    this.finalButton = this.add.image(tourStartX + tourwidth * 3, teamStartY + teams.length * teamHight + 30, 'final');
    this.finalButton.setInteractive();
    this.finalButton.on('pointerdown', () => top3());
    this.finalButton.visible = false;

    this.aideButton = this.add.image(100, 150, 'aide');
    this.aideButton.setInteractive();
    this.aideButton.on('pointerdown', () => help());

    //var element = this.add.dom(400, 0).createFromCache('teamNameInput');
    //this.addTeamInput = this.add.dom(200, 200, 'div', 'background-color: lime').createFromCache('teamNameInput');
    //element.setVisible(true);
    this.yes = document.getElementById('InputTeamNameYes');
    this.no = document.getElementById('InputTeamNameNo');


    this.yes.addEventListener('click', addTeamYes, false);

    function addTeamYes() {
        var setTeamName = document.getElementById('nameField');

        document.getElementById("myTeamNameInput").style.display = "none";
        me.addTeamButton.y += teamHight;

        me.clearScoreButton.y += teamHight;
        me.finalButton.y += teamHight;
        var teamTour1 = {
            prediction: 0,
            result: 0,
            score: 0,
            output: 0
        }
        var teamTour2 = {
            prediction: 0,
            result: 0,
            score: 0,
            output: 0,
        }
        var teamTour3 = {
            prediction: 0,
            result: 0,
            score: 0,
            output: 0
        }
        var team = {
            index: teams.length + 1,
            name: setTeamName.value,
            tours: [
                teamTour1,
                teamTour2,
                teamTour3
            ],
            score: 0,
            ranking: -1,
            scoreOutput: 0,
            topOutput: 0
        }
        teams.push(team);
        if (teams.length >= 6) {
            me.addTeamButton.visible = false;
        }
        //console.log(teams);
        me.add.image(635, me.addTeamButton.y - 45, 'bgstrip' + (teams.length % 2));
        showTeam(team);
        if (team.index == 1) {
            me.initialTime = 0;

            timer = me.add.text(timerPositionX, timerPositionY, formatTime(timerMax), style_timer);
            timedEvent = me.time.addEvent({
                delay: 1000,
                callback: onEvent,
                callbackScope: this,
                loop: true
            });
            timerIcon = me.add.image(timerPositionX - 50, timerPositionY + 15, 'timerIcon');
            startTimerButton = me.add.image(timerPositionX + 30, timerPositionY + 15 /*+60*/ , 'startTimerButton');
            startTimerButton.setInteractive();
            startTimerButton.on('pointerdown', () => startTimer());
            explication.setVisible(false);

            me.showLetterButton = me.add.image(lettersPositionX, lettersPositionY, 'showLetterButton');
            me.showLetterButton.setInteractive();
            me.showLetterButton.on('pointerdown', () => showLetters());
            me.showLetterButton2 = me.add.image(lettersPositionX, lettersPositionY, 'showLetterButton2');
            me.showLetterButton2.setInteractive();
            me.showLetterButton2.on('pointerdown', () => showLetters());
            me.showLetterButton2.setVisible(false);
            hide()
        }

    }

    this.no.addEventListener('click', addTeamNo, false);

    function addTeamNo() {
        document.getElementById("myTeamNameInput").style.display = "none";
    }

    for (var i = 0; i < 9; ++i) {
        var letterTemp = me.add.image(lettersPositionX, lettersPositionY, 'letters' + i);
        letterTemp.visible = false;
        lettersImags.push(letterTemp);
    }


    // Each 1000 ms call onEvent
    this.top3img = this.add.image(top3StartX, top3StartY, 'top3img');

    this.top1text = this.add.text(top3StartX - 200, top3StartY - 50, 'top1team', style_top3);
    this.top2text = this.add.text(top3StartX - 50, top3StartY - 10, 'top2team', style_top3);
    this.top3text = this.add.text(top3StartX + 120, top3StartY, 'top3team', style_top3);

}

function update() {
    if (lastWindoWidth != window.innerWidth) {
        var newphaserPositionAdjX = config.width < window.innerWidth ? ((window.innerWidth - config.width) / 2) : 0;
        var delta = newphaserPositionAdjX - phaserPositionAdjX;
        phaserPositionAdjX = newphaserPositionAdjX;
        teams.forEach(
            function myFunction(item, index) {
                item.tours.forEach(function(oneTour, index) {

                    oneTour.previsionInput.x += delta;

                    oneTour.realInput.x += delta;

                });
            });
        lastWindoWidth = window.innerWidth;
        document.getElementById("myTeamNameInput").style.left = newphaserPositionAdjX + 200 + "px";
    }
    document.getElementById("myTeamNameInput").style.top = me.addTeamButton.y + "px";

}


game = new Phaser.Game(config);
