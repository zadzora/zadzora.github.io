var partnerName = 'zWebStorm';
window["partnerName"] = partnerName;

function LOG(msg)
{
    console.log(msg);
};

String.prototype.replaceAll = function(search, replacement)
{
    var target = this;
    return target.split(search).join(replacement);
};

function myIsNaN(o)
{
    return typeof(o) === 'number' && isNaN(o);
}

function cloneObject(obj)
{
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

function pad(num, size, _char)
{
    if(_char === undefined)
        _char = '0';

    num = num.toString();
    while (num.length < size)
        num = _char + num;

    return num;
};

function updateTextToWidth(textObj, width, fontSize)
{
    // console.log(textObj, textObj.text, width, textObj.style.metrics.fontSize, fontSize, ' obj')
    if(fontSize === undefined)
        fontSize = textObj.style.metrics.fontSize;

    if(textObj.width < width)
        textObj.setFontSize(fontSize);

    while(textObj.width > width){
        fontSize -= 0.1;
        textObj.setFontSize(fontSize);
    }
};

function updateTextToHeight(textObj, height, fontSize)
{
    if(fontSize === undefined)
        fontSize = textObj.fontSize;

    textObj.tweenHideObjectAlpha(fontSize);

    while(textObj.height > height){
        fontSize -= 0.1;
        textObj.setFontSize(fontSize);
    }
};

function tweenShowObjectAlpha(scene, obj, duration, delay, callback, ease )
{
    tweenAnimating = true
    if(delay === undefined)
        delay = 0;

    if(callback === undefined)
        callback = null;

    if(ease === undefined)
        ease = 'Sine.easeIn';

    obj.alpha = 0;
    obj.visible = true;
    var tween = scene.tweens.add({
        targets: obj,
        ease: ease,
        duration: duration,
        delay: delay,
        alpha: {
            getStart: function (obj) {
                return obj.alpha;
            },
            getEnd: function () {
                return 1;
            },
        },
        onComplete: function(tween, target, callback)
        {
            tweenAnimating = false
            if(callback != null)
                callback(target[0]);
        },
        onCompleteParams: [ callback ]

    });
};

function tweenHideObjectAlpha(scene, obj, duration, delay, callback, ease)
{
    tweenAnimating = true
    if(delay === undefined)
        delay = 0;

    if(callback === undefined)
        callback = null;

    if(ease === undefined)
        ease = 'Sine.easeIn';

    var tween = scene.tweens.add({
        targets: obj,
        ease: ease,
        duration: duration,
        delay: delay,
        alpha: {
            getStart: function (obj) {
                return obj.alpha;
            },
            getEnd: function () {
                return 0;
            },
        },
        onComplete: function(tween, target, callback)
        {
            tweenAnimating = false
            target[0].alpha = 0;
            target[0].visible = false;
            if(callback != null)
                callback(target[0]);
        },
        onCompleteParams: [ callback ]
    });

};

function setPoingScaleTween(scene, obj, scale, duration, ease, callback)
{
    if(callback === undefined)
        callback = null;

    var tweens = scene.tweens.getTweensOf(obj);
    for(var i = 0; i < tweens.length; i++)
        if(tweens[i].isPlaying())
            return;

    scene.tweens.add({
        targets: obj,
        scaleX: scale,
        scaleY: scale,
        duration: duration,
        ease: ease,
        yoyo: -1,
        onComplete : function (tween, target, callback)
        {
            if(callback != null)
                callback(target);
        },
        onCompleteParams: [ callback ],
    });

};

function getCorrectOriginX(obj, orgX)
{
    return Math.round(obj.width * orgX) / obj.width;
}

function getCorrectOriginY(obj, orgY)
{
    return Math.round(obj.height * orgY) / obj.height;
}

function setCorrectOrigin(obj, org)
{
    obj.setOrigin(getCorrectOriginX(obj, org), getCorrectOriginY(obj, org));
}

function getUrlParameterByName(name, url)
{
    url = url || window.location.href;

    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function NormalizeAngle0360(angle)
{
    angle = angle % 360;
    if(angle < 0)
        angle += 360;

    return angle;
}

function stringToObject(str)
{
    var arr = str.split(".");

    var fn = (window || this);
    for (var i = 0, len = arr.length; i < len; i++) {
        fn = fn[arr[i]];
    }

    return  fn;
};

function leadingZero(num, len)
{
    var retVal = '' + num;
    while(retVal.length < len)
        retVal = '0' + retVal;

    return retVal;
}

function millisecondsToTimeStr(millis)
{
    var secs = Math.floor(millis / 1000);
    var mins = Math.floor(secs / 60);

    secs -= mins * 60;

    return leadingZero(mins, 2) + ':' + leadingZero(secs, 2);
};

function millisecondsToDayTimeStr(millis)
{
    var secs  = Math.floor(millis / 1000);
    var mins  = Math.floor(secs / 60);
    var hours = Math.floor(mins / 60);

    mins -= hours * 60;
    secs -= mins  * 60;

    return leadingZero(hours, 2) + 'H ' + leadingZero(mins, 2) + 'M';
};

function millisecondsToMinutes(millis)
{
    var secs  = Math.floor(millis / 1000);
    var mins  = Math.floor(secs / 60);

    return mins;
};

function getProperty(object, property, defaultValue)
{
    if(defaultValue === undefined)
        defaultValue = null;

    if(!object.hasOwnProperty(property))
        return defaultValue;

    return object[property];
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function getRandomElementFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function handleButtonEvent(obj, othersToTint){
    obj.setInteractive()

    obj.on('pointerover', function (pointer) {
        // obj.setTint(0x999999); // to uz robi addbuttonevents funkcia
        if(othersToTint) {
            othersToTint.forEach(function (otherObj) {
                otherObj.setTint(0x999999);
            })
        }
    })
    obj.on('pointerout', function (pointer) {
        // obj.clearTint();
        if(othersToTint) {
            othersToTint.forEach(function (otherObj) {
                otherObj.clearTint();
            })
        }
    })
    obj.on('pointerdown', function (pointer) {
        // obj.clearTint();
        if(othersToTint) {
            othersToTint.forEach(function (otherObj) {
                otherObj.clearTint();
            })
        }
    })
}

function showDiv(div, always){
    if (always == null){
        always = false;
    }
    if (!game.device.desktop || always) {
        document.getElementById(div).style.display = 'block';
    }
}

function hideDiv(div, always){
    if (always == null){
        always = false;
    }
    if (!game.device.desktop || always) {
        document.getElementById(div).style.display = 'none';
    }
}