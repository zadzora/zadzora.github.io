var PCTable = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function PCTable(parent, data)
    {
        PCTable.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);
    },

    init: function (data) {
        this.type = data.type
        this.player = data.player

        this.proximityThreshold = 100; // Distance threshold to trigger frame change
        this.inRange = false
        this.progress = 0

        this.scene.input.keyboard.on('keydown-E', this.handleEKeyPress, this);
    },

    create: function(data) {
        this.scene.add.existing(this);

        this.imgTable = this.scene.add.sprite(data.x, data.y, 'pak_decoratives', 'table');
        this.imgTable.setOrigin(0.5);

        this.scene.physics.add.existing(this.imgTable);
        this.imgTable.body.setImmovable(true); // Make sure the object doesn't move when collided with
        this.imgTable.body.setCollideWorldBounds(true); // Ensure it respects world bounds if necessary

        this.imgTable.body.setSize(140,60);
        this.imgTable.body.setOffset(30,10); // Adjust as needed

        this.imgButton = this.scene.add.sprite(data.x + 90, data.y - 50, 'pak_decoratives', 'button');
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

        this.imgPC = this.scene.add.sprite(this.imgTable.x,this.imgTable.y - 45, 'pak_decoratives', 'pc');
        this.imgPC.setOrigin(0.5);

        this.imgScrewdrivers = this.scene.add.sprite(this.imgPC.x,this.imgPC.y, 'pak_decoratives', 'screwdrivers');
        this.imgScrewdrivers.setOrigin(0.5);


        //PARTS
        this.contParts = this.scene.add.container(0, 0);
        this.contParts.alpha = 0

        this.txtPart0 = this.scene.add.text(data.x - 190, data.y - 140, '0/1', {
            font: '26px "gamefont","Arial"',
            fontSize: '26px',
            fill: '#fff',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 4,
        });
        this.txtPart0.setOrigin(0.5)
        this.txtPart0.alpha = 1

        this.imgPart0 = this.scene.add.sprite(this.txtPart0.x + 65, this.txtPart0.y, 'pak_decoratives', 'part0');
        this.imgPart0.setOrigin(0.5);
        this.imgPart0.setScale(1.1);
        this.imgPart0.alpha = 1

        this.txtPart1 = this.scene.add.text(data.x - 20, data.y - 140, '0/1', {
            font: '26px "gamefont","Arial"',
            fontSize: '26px',
            fill: '#fff',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 4,
        });
        this.txtPart1.setOrigin(0.5)
        this.txtPart1.alpha = 1

        this.imgPart1 = this.scene.add.sprite(this.txtPart1.x + 90, this.txtPart1.y, 'pak_decoratives', 'part1');
        this.imgPart1.setOrigin(0.5);
        this.imgPart1.setScale(1.1);
        this.imgPart1.alpha = 1

        this.txtPart2 = this.scene.add.text(data.x + 185, data.y - 140, '0/1', {
            font: '26px "gamefont","Arial"',
            fontSize: '26px',
            fill: '#fff',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 4,
        });
        this.txtPart2.setOrigin(0.5)
        this.txtPart2.alpha = 1

        this.imgPart2 = this.scene.add.sprite(this.txtPart2.x + 80, this.txtPart2.y, 'pak_decoratives', 'part2');
        this.imgPart2.setOrigin(0.5);
        this.imgPart2.setScale(1.1);
        this.imgPart2.alpha = 1

        this.imgConfetti = this.scene.add.sprite(this.imgPC.x, this.imgPC.y, 'pak_confetti', 'conf0');
        this.imgConfetti.setOrigin(0.5);
        this.imgConfetti.alpha = 0
        // this.imgConfetti.setScale(1.5)
        this.imgConfetti.anims.create({
            key: 'confetti',
            frames: this.scene.anims.generateFrameNames('pak_confetti', { prefix: 'conf', start: 0, end: 4}),
            frameRate: 8,
            repeat: 0
        });


        this.add(this.imgTable);
        this.add(this.imgPC);
        this.add(this.imgScrewdrivers);
        this.add(this.imgButton);
        this.add(this.txtButton);

        this.contParts.add(this.imgPart0);
        this.contParts.add(this.txtPart0);
        this.contParts.add(this.imgPart1);
        this.contParts.add(this.txtPart1);
        this.contParts.add(this.imgPart2);
        this.contParts.add(this.txtPart2);

        this.add(this.contParts)
        this.add(this.imgConfetti);
    },

    showButtonAnimation: function() {
        if( this.imgButton.alpha>0)return
        // Reset the alpha to make dust visible
        this.imgButton.alpha = 0;
        this.txtButton.alpha = 0;

        this.contParts.alpha = 0;
        // this.imgButton.visible = false;
        // this.txtButton.visible = false;
        // Create tweens to fade out the dust particles
        this.scene.tweens.add({
            targets: [this.imgButton,this.txtButton, this.contParts],
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
        if (this.inRange) {
            this.onEKeyPressed();
        }
    },

    // Define the function that will be called when "E" is pressed
    onEKeyPressed: function() {
        console.log("E key pressed near the table");
        if(this.player.carriedItem == null)return

        this.forwardPart(this.player.carriedItem)
        this.player.forwardItem()

        this.player.carriedItem = null
        this.progress += 1

        if(this.progress >= 3){
            this.questDone()
        }
    },

    forwardPart: function (part){
        switch (part){
            case 'part0':
                this.txtPart0.text = '1/1'
                break
            case 'part1':
                this.txtPart1.text = '1/1'
                break
            case 'part2':
                this.txtPart2.text = '1/1'
                break
            default:
                return
        }
    },

    questDone: function (){
        this.imgConfetti.play('confetti');
        this.imgConfetti.alpha = 1

        this.imgConfetti.on('animationcomplete', (animation) => {
            // Check if the completed animation is 'confetti'
            if (animation.key === 'confetti') {
                this.imgConfetti.destroy();
                setTimeout(() => {
                    if(containerGameplay){
                        containerGameplay.quest2Done()
                    }
                }, 300);
            }
        }, this);


    },

    update: function(time,delta) {
        if(!this.visible) return
        if(!this.imgTable)return;
        // Calculate the distance between the player and the InfoTable
        let distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.imgTable.x - 210, this.imgTable.y - 514
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

            this.contParts.alpha = 0;

            this.inRange = false
        }
    }
});