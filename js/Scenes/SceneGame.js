var SceneGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function SceneMenu()
    {
        SceneMenu.instance = this;
        Phaser.Scene.call(this, {key: 'SceneMenu', active: false});

        containerGameplay = null
        containerContent = null
        containerTop    = null
    },

    create: function()
    {
        this.cameras.main.roundPixels = false;

        containerGameplay           = new ContainerGameplay(this);
        containerContent            = new ContainerContent(this)
        containerTop                = new ContainerTop(this)

        this.scene.sleep('SceneGame');

        this.scale.on('resize', this.resize, this);
        this.scale.refresh();

        this.PAUSED = false;

        this.game.events.addListener(Phaser.Core.Events.FOCUS,   this.onGameResume, this);
        this.game.events.addListener(Phaser.Core.Events.VISIBLE, this.onGameResume, this);
        this.game.events.addListener(Phaser.Core.Events.HIDDEN,  this.onGamePause,  this);
        this.game.events.addListener(Phaser.Core.Events.BLUR,    this.onGamePause,  this);

        this.input.addPointer(3);
    },

    update: function(time, delta)
    {
        containerGameplay.update(time, delta);
        containerTop.update(time, delta);
    },


    resize: function(gameSize, baseSize, displaySize, resolution)
    {
        if(this.scene.manager.isSleeping('SceneGame'))
            return;

        containerGameplay.resize(gameSize, baseSize, displaySize, resolution);
        containerContent.resize(gameSize, baseSize, displaySize, resolution);
        containerTop.resize(gameSize, baseSize, displaySize, resolution);
    },

    onGameResume: function()
    {
        LOG('SceneGame.onGameResume');
        resumeSounds(this.scene)
        game.sound.unlock();
    },

    onGamePause: function()
    {
        LOG('SceneGame.onGamePause');
        pauseSounds(this.scene)
    },
});