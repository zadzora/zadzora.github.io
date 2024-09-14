var Road = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function Road(parent, data)
    {
        Road.instance = this;
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

        if(this.type === 'road' && this.frame === 0){
            this.getRandomRotation()
        }

        this.add(this.imgTile);
    },

    getRandomRotation: function (){
        //set rotation of this.imgTile random (0, 90, 180, 270) degrees
        const rotations = [0, 90, 180, 270];
        const randomIndex = Math.floor(Math.random() * rotations.length);
        const randomRotation = rotations[randomIndex];

        // Set the rotation of the image tile
        this.imgTile.setRotation(Phaser.Math.DegToRad(randomRotation));

    },

});