var ContainerTop= new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize: function ContainerTop(scene) {
        ContainerTop.instance = this;
        Phaser.GameObjects.Container.call(this, scene, 0, 0);
        this.create();
        this.setDepth(1100);
        this.visible = false;
    },

    create: function () {
        this.createGUI();
        this.scene.add.existing(this);
    },

    createGUI: function () {
        this.contTop = this.scene.add.container(0, 0);
        this.contBottom = this.scene.add.container(0, 0);

        this.texts = ['PERSONAL DETAILS','EDUCATION','EXPERIENCE', 'SKILLS', 'HOBBY']

        this.infoTxt = this.scene.add.text(0, 0, this.texts[0], {
            font: '60px "gamefont","Arial"',
            fontSize: '60px',
            fill: '#e1f0f7',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 10,
        });
        this.infoTxt.setOrigin(0.5)

        this.interactText = this.scene.add.text(0, 0, 'PRESS [E] TO INTERACT', {
            font: '40px "gamefont","Arial"',
            fontSize: '40px',
            fill: '#e1f0f7',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 6,
        });
        this.interactText.setOrigin(0.5)

        this.contTop.add(this.infoTxt)
        this.add(this.contTop)

        this.contBottom.add(this.interactText)
        this.add(this.contBottom)
    },

    updateInfoText: function (id){
        this.infoTxt.text = this.texts[id]
    },

    update: function () {
        this.x = this.scene.cameras.main.scrollX + this.scene.cameras.main.width / 2;
    },

    resize: function(gameSize, baseSize, displaySize, resolution)
    {
        if(this.scene === undefined)
            return;

        var width = gameSize.width;
        var height = gameSize.height;

        this.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);

        this.contTop.setPosition(0, 60);
        this.contBottom.setPosition(0, height - 65);
    },
});