DEBUG_PHYSICS = false;
GRAVITY_VALUE = 1000;
TIMESCALE     = 0.65;

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width:  Resolution.DEFAULT_WIDTH, // initial width that determines the scaled size
    height: Resolution.DEFAULT_HEIGHT,
    scale: {
        mode: Phaser.Scale.NONE,
        width: Resolution.DEFAULT_WIDTH,
        height: Resolution.DEFAULT_HEIGHT
    },
    dom: { createContainer: true },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            // debug: DEBUG_PHYSICS,
            // timeScale: TIMESCALE,
            // //fixedStep: true,
            // //fps: 60,
            // //customUpdate: false,
            // useTree: false,
            // tileBias: 30,
        }
    },
    fps: {
        min: 40,
        target: 60,
        //limit: 60,
        //forceSetTimeOut: true,
        deltaHistory: 10
    },
    id: 'gameCanvas',
    backgroundColor: 	'#87ceeb',
    scene: [ ScenePreload, SceneGame ],
    banner: false,
    // activePointers: 3,
    plugins: {
        scene: [
        ],
    },
};

function phaserInit () {
    game = new Phaser.Game(config);
    globalThis.__PHASER_GAME__ = game;
    game.canvas.id = 'gameCanvas';

    window.addEventListener('resize', function (event) {
        resize();
        setTimeout(function(){
            resize();
        }, 250);

    });
    resize();

    window.addEventListener("contextmenu", function(e) { e.preventDefault();});
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only

    window.addEventListener("keydown", function(e) {
        // Check if editing is active, if so, do not prevent default behavior
        if (prevendDefEditing) return;

        e.preventDefault();
        return false;
    });
    window.addEventListener("keypressed", function(e) { e.preventDefault(); return false;});
    window.addEventListener("keyup", function(e) {e.preventDefault(); return false;});
}


window.addEventListener('load', function() {
    runningOnIE = areWeOnInternetExplorer();
    runningOnIoS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    phaserInit();
});

function resize()
{
    console.log('resize()');

    var w = window.innerWidth;
    var h = window.innerHeight;

    var width = Resolution.DEFAULT_WIDTH;
    var height = Resolution.DEFAULT_HEIGHT;
    var maxWidth = Resolution.MAX_WIDTH;
    var maxHeight = Resolution.MAX_HEIGHT;
    var scaleMode = Resolution.SCALE_MODE;

    var scale = Math.min(w / width, h / height);
    var newWidth = Math.min(w / scale, maxWidth);
    var newHeight = Math.min(h / scale, maxHeight);

    var defaultRatio = Resolution.DEFAULT_WIDTH / Resolution.DEFAULT_HEIGHT;
    var maxRatioWidth = Resolution.MAX_WIDTH / Resolution.DEFAULT_HEIGHT;
    var maxRatioHeight = Resolution.DEFAULT_WIDTH / Resolution.MAX_HEIGHT;

    // smooth scaling
    var smooth = 1;
    if (scaleMode === 'SMOOTH') {
        var maxSmoothScale = 1;
        var normalize = function (value, min, max) {
            return (value - min) / (max - min)
        }
        if (width / height < w / h)
            smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
        else
            smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;

    }

    console.log('window.size [ ' + window.innerWidth + ', ' + window.innerHeight + ' ] ');

    if(myIsNaN(smooth))
        smooth = 1;
    
    if (window.innerHeight< window.innerWidth)
        leaveIncorrectOrientation();
    else
        enterIncorrectOrientation();

    game.scale.resize(newWidth * smooth, newHeight * smooth);
    console.log('game.size [ ' + newWidth * smooth + ', ' + newHeight * smooth + ' ] ');

    game.canvas.style.width = newWidth * scale + 'px'
    game.canvas.style.height = newHeight * scale + 'px'

    game.canvas.style.marginTop = ((h - newHeight * scale) / 2) + 'px';
    game.canvas.style.marginLeft = ((w - newWidth * scale) / 2) + 'px';
}

function enterIncorrectOrientation()
{
    if (game.device.os.desktop) return;

    LOG("enterIncorrectOrientation()");
    showDiv("wrongRotation");
    hideDiv("gameCanvas");

    pauseMusic(this.scene);
    pauseSounds(this.scene)
}

function leaveIncorrectOrientation()
{
    if (game.device.os.desktop) return;

    LOG("leaveIncorrectOrientation()");
    hideDiv("wrongRotation");
    showDiv("gameCanvas");

    resumeMusic(this.scene);
    resumeSounds(this.scene)
}

function areWeOnInternetExplorer()
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return true;
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11, return version number
        return true;
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        //Edge (IE 12+), return version number
        return true;
    }
    // User uses other browser
    return false;
}


window.onscroll = function () {
    window.scrollTo(0, 0);
}