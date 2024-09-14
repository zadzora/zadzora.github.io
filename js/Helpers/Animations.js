let isAnimating = false;

function infoBubblePopUp(obj, endScale,delay,duration, callback) {
    if(obj.tween){
        obj.tween.stop()
        obj.tween.remove();
        obj.scale = 0
    }

    if(!delay)
        delay = 0

    if(!duration)
        duration = 150

    isAnimating = true
    obj.tween = obj.scene.tweens.add({
        targets: obj,
        ease: 'Sine.easeIn',
        duration: duration,
        scale: endScale,
        delay: delay,
        onStart: function() {
            obj.alpha = 1
            obj.scale = 0
        },
        onComplete: function() {
            isAnimating = false
            obj.scale = endScale
            if (callback) {
                callback(); // Invoke the provided callback
            }
        },
    });
}

function animateButtonClickNew(button, moveY) {
    if(!btnCanAnimate) return;
    var tween = button.scene.tweens.add({
        targets: button,
        ease: 'Phaser.Easing.Bounce.Out',
        duration: 100,
        delay: 0,
        y: button.y + moveY,
        repeat: 0,
        yoyo: true,
        onStart: function(tween){
            btnCanAnimate = false;
        },
        onComplete: function (tween) {
            btnCanAnimate = true;
        },
    });
}