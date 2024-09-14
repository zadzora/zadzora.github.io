var GameData = function()
{
};
GameData.BuildTitle     = 'Zadzora CV';
GameData.BuildVersion   = '0.0.1';
GameData.BuildString    = '13.9.2024 10:30';
GameData.BuildDebug     = false;
GameData.Copyright      = 'David Zadzora';

console.info('%c %c   ' + GameData.Copyright + ' | ' + GameData.BuildTitle + ' ' + GameData.BuildVersion + ' | ' + GameData.BuildString + '  %c ','background:#353AFB', 'background:#000080;color:#fff', 'background:#353AFB');

var DataVersion         = 0.1;

let btnCanAnimate = true;
let isDragging = false;

let animSpeed = 200

let tweenAnimating = false
let prevendDefEditing = false

let canMove = true
let tableOpened = false


let areaX = 125
let areaY = 26
