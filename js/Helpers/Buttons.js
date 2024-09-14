function AddButtonEvents(btn, onInputDown, onInputOver, onInputOut, onInputUp)
{
    if(onInputUp === undefined)
        onInputUp = null;

    btn.setInteractive();//imgMenuInstructionsBackground
    btn.buttonPressed = false;
    btn.onInputOver = onInputOver;
    btn.onInputOut = onInputOut;
    btn.onInputUp = onInputUp;
    btn.on('pointerdown', ButtonOnInputDown, {button: btn, callback: onInputDown});

    if(onInputOver != null)
        btn.on('pointerover', onInputOver, {button: btn});
    else
        btn.on('pointerover',   ButtonOnInputOver, {button: btn});

    if(onInputOut != null)
        btn.on('pointerout', onInputOut, {button: btn});
    else
        btn.on('pointerout',    ButtonOnInputOut, {button: btn});

    if(onInputUp != null)
        btn.on('pointerup', onInputUp, {button: btn});
    else
        btn.on('pointerup',     ButtonOnInputOut, {button: btn});
};

function ButtonOnInputDown()
{
    if(this.button.alpha == 0)
        return;
    if(!this.button.visible)
        return;

    if(this.button instanceof Phaser.GameObjects.Container){
        this.button.each(function(child){
            child.setTint(0xFFFFFF);
        });
    }else
        this.button.setTint(0xFFFFFF);

    var event = null;
    if(arguments.length = 3)
        event = arguments[2];
    if(arguments.length = 4)
        event = arguments[3];

    if(event != null)
        event.stopPropagation();

    this.callback(this.button);

    if(this.button.onInputOut != null)
        this.button.onInputOut.call({ button: this.button });
    this.button.buttonPressed = true;
    //this.button.buttonPressedTime = game.time.totalElapsedSeconds();
};

function ButtonOnInputOver()
{
    if (!game.device.os.desktop)
        return;

    if(this.button.alpha == 0)
        return;
    if(!this.button.visible)
        return;

    if(this.button instanceof Phaser.GameObjects.Container){
        this.button.each(function(child){
            child.setTint(0x999999);
        });
    }else
        this.button.setTint(0x999999);
};

function ButtonOnInputOut()
{
    if (!game.device.os.desktop)
        return;

    if(this.button.alpha == 0)
        return;
    if(!this.button.visible)
        return;

    if(this.button instanceof Phaser.GameObjects.Container){
        this.button.each(function(child){
            child.setTint(0xFFFFFF);
        });
    }else
        this.button.setTint(0xFFFFFF);

    if(this.button.buttonPressed){
        this.button.buttonPressed = false;

        if(this.button.onInputUp != null)
            this.button.onInputUp(btn);
    }
}
