var ScenePreload = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ScenePreload()
    {
        Phaser.Scene.call(this, {key: 'ScenePreload', active: true});
    },

    preload: function ()
    {
        this.loadLanguages();

        this.scale.refresh();
        this.time.delayedCall(100, this.preloadSplashAssets, [], this);
    },

    preloadSplashAssets: function () {
        function loadImage(scene) {
            if (loadedImages === 1) {
                scene.loadSplash()
            }
        }

        let loadedImages = 0
        this.load
            .image('loadingBarBg', 'assets/gfx/loading_bar.png').once('filecomplete-image-loadingBarBg', function () {
            loadedImages += 1
            loadImage(this)
        }, this).start()
    },

    loadSplash: function (){
        this.load
            .image('loadingBar', 'assets/gfx/loading_bar_fill.png').once('filecomplete-image-loadingBar', function () {

            this.loadSliderBg = this.add.image(0, 0, 'loadingBarBg');
            this.loadSliderBg.setOrigin(0.5)
            this.loadSliderBg.setScale(1)

            this.loadSlider = this.add.image(0, 0, 'loadingBar');
            this.loadSlider.setOrigin(0.5)
            this.loadSlider.setScale(1)

            const originalWidth = this.loadSlider.width;
            const croppedWidth = originalWidth * (0 / 100);
            const cropRect = new Phaser.Geom.Rectangle(0, 0, croppedWidth, this.loadSlider.height);
            this.loadSlider.setCrop(cropRect);

            this.txtLoadingPercent = this.make.text({
                x: 0,
                y: 0,
                text: '0%',
                style: {
                    font: '32px "gamefont","Arial"',
                    fontSize: '32px',
                    fill: '#ffffff',
                    shadow: { offsetX: 2, offsetY: 2, color: 'rgba(107,107,107,0.73)', fill: true }
                }

            });
            this.txtLoadingPercent.setOrigin(0.5);

            this.scale.refresh();
            this.loadAllAssets();

        },this)
            .start()
        this.txtLoadingPercent = null;
    },

    loadAllAssets: function()
    {
        this.loadMenuGfx();
        this.loadAudio();

        this.load.on('progress', function (value) {
            this.txtLoadingPercent.text = Math.floor(value * 100) + '%';

            const originalWidth = this.loadSlider.width;
            const croppedWidth = originalWidth * (Math.floor(value * 100) / 100);
            const cropRect = new Phaser.Geom.Rectangle(0, 0, croppedWidth, this.loadSlider.height);
            this.loadSlider.setCrop(cropRect);
        }.bind(this), this);

        this.load.on('fileprogress', function (file) {
            // console.log(file.key);
        });

        this.load.on('complete', function () {
            this.loadComplete();
        }, this);

        this.load.start();
    },

    loadComplete: function () {
        this.txtLoadingPercent.destroy();
        this.scene.start('SceneMenu');
    },

    loadLanguages: function()
    {
        // this.load.xml('lang_strings',  'assets/dat/lang.isr')
    },

    loadMenuGfx: function()
    {
        this.load.image('grass_bg',         'assets/gfx/game/grass_bg.png');

        this.load.atlas('pak_decoratives',             'assets/gfx/game/decoratives/pak_decoratives.png',          'assets/gfx/game/decoratives/pak_decoratives.json');
        this.load.atlas('pak_player',             'assets/gfx/game/player/pak_player.png',          'assets/gfx/game/player/pak_player.json');
        this.load.atlas('pak_infoScreens',             'assets/gfx/game/infoScreens/pak_infoScreens.png',          'assets/gfx/game/infoScreens/pak_infoScreens.json');
        this.load.atlas('pak_confetti',             'assets/gfx/game/decoratives/pak_confetti.png',          'assets/gfx/game/decoratives/pak_confetti.json');

        this.load.tilemapTiledJSON('tilemapCV',         'assets/gfx/game/tilemap/tilemap.json');

        this.load.image('blank',         'assets/gfx/blank.png');
    },

    loadAudio: function()
    {
        //Music
        // this.load.audio('Music_menu_intro',                 'assets/audio/Music_Intro.mp3');
    },

    create: function()
    {
        this.scale.on('resize', this.resize, this);
        this.scale.refresh();
    },

    resize: function(gameSize, baseSize, displaySize, resolution)
    {
        var width = gameSize.width;
        var height = gameSize.height;

        this.cameras.resize(width, height);
        if(this.txtLoadingPercent == null)
            return;

        this.loadSliderBg.setPosition(width / 2 , height / 2 + 400);
        this.loadSlider.setPosition(this.loadSliderBg.x, this.loadSliderBg.y);
        this.txtLoadingPercent.setPosition(this.loadSlider.x, this.loadSlider.y);
    },
});