var Chest = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function Chest(parent, data)
    {
        Chest.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);
    },

    init: function (data) {
        this.id = data.id
        this.type = data.type
        this.content = data.content
        this.player = data.player

        this.proximityThreshold = 100; // Distance threshold to trigger frame change
        this.inRange = false
        this.opened = false

        this.scene.input.keyboard.on('keydown-E', this.handleEKeyPress, this);
    },

    create: function(data) {
        this.scene.add.existing(this);

        this.imgChest = this.scene.add.sprite(data.x, data.y, 'pak_decoratives', this.type + 0);
        this.imgChest.setOrigin(0.5);

        this.scene.physics.add.existing(this.imgChest);
        this.imgChest.body.setImmovable(true); // Make sure the object doesn't move when collided with
        this.imgChest.body.setCollideWorldBounds(true); // Ensure it respects world bounds if necessary

        if(this.type === 'chest'){
            this.imgChest.body.setSize(62,65);
            // this.imgChest.body.setOffset(7,35); // Adjust as needed
        }else{
            this.imgChest.body.setSize(60,70);
            // this.imgChest.body.setOffset(31,0); // Adjust as needed
        }

        this.imgButton = this.scene.add.sprite(data.x, data.y - 80, 'pak_decoratives', 'button');
        this.imgButton.setOrigin(0.5);
        this.imgButton.setScale(1);
        this.imgButton.alpha = 0

        this.txtButton = this.scene.add.text(this.imgButton.x + 1, this.imgButton.y - 4, 'E', {
            font: '32px "gamefont","Arial"',
            fontSize: '32px',
            fill: '#1a0a02',
            align: 'center',
            // stroke: '#49301f',
            // strokeThickness: 4,
        });
        this.txtButton.setOrigin(0.5)
        this.txtButton.alpha = 0

        this.txtEmptyChest = this.scene.add.text(this.imgChest.x, this.imgChest.y, 'Empty', {
            font: '22px "gamefont","Arial"',
            fontSize: '22px',
            fill: '#fff',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 4,
        });
        this.txtEmptyChest.setOrigin(0.5)
        this.txtEmptyChest.alpha = 0

        this.imgChestContent = this.scene.add.sprite(this.imgChest.x, this.imgChest.y, 'pak_decoratives', 'part0');
        this.imgChestContent.setOrigin(0.5);
        this.imgChestContent.setScale(1);
        this.imgChestContent.alpha = 0

        this.add(this.imgChest);
        this.add(this.imgButton);
        this.add(this.txtButton);

        this.add(this.txtEmptyChest);
        this.add(this.imgChestContent);
    },

    showButtonAnimation: function() {
        if( this.imgButton.alpha>0)return
        if(this.opened)return;
        // Reset the alpha to make dust visible
        this.imgButton.alpha = 0;
        this.txtButton.alpha = 0;
        // this.imgButton.visible = false;
        // this.txtButton.visible = false;
        // Create tweens to fade out the dust particles
        this.scene.tweens.add({
            targets: [this.imgButton,this.txtButton],
            alpha: 1,
            delay: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => {
            }
        });
    },

    handleEKeyPress: function() {
        // Check if the player is in range
        if (this.inRange && !this.opened) {
            this.onEKeyPressed();
        }
    },

    // Define the function that will be called when "E" is pressed
    onEKeyPressed: function() {
        if(this.player.carriedItem != null){
            this.player.fullHandsText()
            return
        }
        console.log("E key pressed near the quest");
        this.imgButton.alpha = 0;
        this.txtButton.alpha = 0;
        this.imgButton.visible = false;
        this.txtButton.visible = false;

        this.opened = true
        this.imgChest.setFrame(this.type + 1)

        this.openChestAction()
    },

    openChestAction: function (){
        if(this.content === 'empty'){
            this.txtEmptyChest.y = this.imgChest.y

            this.scene.tweens.add({
                targets: this.txtEmptyChest,
                alpha: 1,
                delay: 0,
                duration: 400,
                y:this.imgChest.y - 80,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.txtEmptyChest.destroy()
                }
            });
        }else{
            this.imgChestContent.y = this.imgChest.y
            this.imgChestContent.setFrame(this.content)

            this.scene.tweens.add({
                targets: this.imgChestContent,
                alpha: 1,
                delay: 0,
                duration: 400,
                y:this.imgChest.y - 80,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.imgChestContent.destroy()
                    this.player.pickedUpItem(this.content)
                }
            });

        }
    },

    update: function(time,delta) {
        if(!this.visible) return
        if(this.opened) return
        // Calculate the distance between the player and the InfoTable
        let distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.imgChest.x - 210, this.imgChest.y - 514
        );

        // If the player is within the proximity threshold, change the frame
        if (distance < this.proximityThreshold) {
            // this.imgInfoTable.setFrame('infoTable1'); // Assuming 'infoTable1' is the nearby frame
            this.showButtonAnimation()
            this.inRange = true
        } else {
            // if(this.imgQuest.visible){
            //     if(!this.questStarted)
            //         this.imgQuest.y = this.imgButton.y
            // }
            // this.imgInfoTable.setFrame('infoTable0'); // Revert to original frame when not nearby
            this.imgButton.alpha = 0;
            this.txtButton.alpha = 0;
            this.inRange = false
        }
    }
});