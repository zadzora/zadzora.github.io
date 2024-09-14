var Grass = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function Grass(parent, data)
    {
        Grass.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);
    },

    init: function (data) {
        this.type = data.type;
        this.frame = data.frame;
    },

    create: function(data) {
        this.scene.add.existing(this);

        this.imgTile = this.scene.add.sprite(data.x, data.y, 'pak_decoratives', this.type+this.frame);
        this.imgTile.setOrigin(0.5);
        this.imgTile.visible = true;
        this.imgTile.alpha = 1;


        this.add(this.imgTile);
    },
});