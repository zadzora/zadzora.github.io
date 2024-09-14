var InfoTable = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function InfoTable(parent, data)
    {
        InfoTable.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);
    },

    init: function (data) {
        this.type = data.type;
        this.player = data.player
        this.index = data.index

        this.questStarted = false
        this.questID = 0

        this.proximityThreshold = 100; // Distance threshold to trigger frame change
        this.inRange = false

        // Create an input handler for the "E" key
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        // Add an event listener for the "E" key
        this.scene.input.keyboard.on('keydown-E', this.handleEKeyPress, this);
    },

    create: function(data) {
        this.scene.add.existing(this);

        this.imgInfoTable = this.scene.add.sprite(data.x, data.y - 30, 'pak_decoratives', 'infoTable0');
        this.imgInfoTable.setOrigin(0.5);
        this.imgInfoTable.setScale(1);
        this.imgInfoTable.visible = true;
        this.imgInfoTable.alpha = 1;
        this.imgInfoTable.setInteractive()

        this.imgInfoTable.on('pointerdown', function (pointer) {
            this.handleEKeyPress()
        },this)
        // this.handleEKeyPress

        this.imgInfoTableGlow = this.scene.add.sprite(data.x, data.y - 30, 'pak_decoratives', 'infoTable2');
        this.imgInfoTableGlow.setOrigin(0.5);
        this.imgInfoTableGlow.setScale(1);
        this.imgInfoTableGlow.alpha = 0

        this.imgButton = this.scene.add.sprite(data.x, data.y - 120, 'pak_decoratives', 'button');
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
        // this.txtButton.setShadow(0, 4, "#49301f", 0, 4);

        //QUEST
        this.imgQuest = this.scene.add.sprite(data.x, data.y - 120, 'pak_decoratives', 'quest');
        this.imgQuest.setOrigin(0.5);
        this.imgQuest.setScale(1);
        this.imgQuest.visible = false

        this.imgQuest.anim = this.scene.tweens.add({
            targets: this.imgQuest,
            duration: 400,
            ease: 'Cubic.easeOut',
            scale: 1.1,
            yoyo: true,
            repeat: -1,
            onComplete: () => {
            }
        });
        this.imgQuest.anim.play()

        if(this.index === 4){
            this.imgQuest.visible = true
        }

        this.add(this.imgInfoTable);
        this.add(this.imgInfoTableGlow);
        this.add(this.imgButton);
        this.add(this.txtButton);
        this.add(this.imgQuest);
    },

    playGlowAnimation: function() {
        if( this.imgInfoTableGlow.alpha>0)return

        // Reset the alpha to make dust visible
        this.imgInfoTableGlow.alpha = 0;
        // Create tweens to fade out the dust particles
        this.imgInfoTableGlow.anim = this.scene.tweens.add({
            targets: this.imgInfoTableGlow,
            alpha: 1,
            delay: 200,
            duration: 400,
            yoyo: true,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.imgInfoTableGlow.alpha = 0;
            }
        });
    },

    showButtonAnimation: function() {
        if( this.imgButton.alpha>0)return

        // Reset the alpha to make dust visible
        this.imgButton.alpha = 0;
        this.txtButton.alpha = 0;
        // Create tweens to fade out the dust particles
        this.imgInfoTableGlow.anim = this.scene.tweens.add({
            targets: [this.imgButton,this.txtButton],
            alpha: 1,
            delay: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => {
            }
        });

        if(this.imgQuest.visible){
            this.imgQuest.anim = this.scene.tweens.add({
                targets: this.imgQuest,
                duration: 200,
                ease: 'Cubic.easeOut',
                y:this.imgQuest.y - 80,
                onComplete: () => {
                }
            });
        }

    },

    handleEKeyPress: function() {
        // Check if the player is in range
        if (this.inRange) {
            this.onEKeyPressed();
        }
    },

    startNewQuest: function (){
        this.imgQuest.y = this.imgButton.y + 80
        this.imgQuest.visible = true

        this.imgQuest.anim = this.scene.tweens.add({
            targets: this.imgQuest,
            duration: 400,
            ease: 'Cubic.easeOut',
            y:this.imgQuest.y - 80,
            onComplete: () => {
                //TEMP
                if(this.questID === 1){
                    this.questID = 3
                }else {
                    this.questID += 1
                }
                this.questStarted = false

                if (!tweenAnimating) {
                    tweenHideObjectAlpha(containerTop.scene, containerTop, animSpeed, 0, null, 'Power2');
                }
            }
        });


    },

    // Define the function that will be called when "E" is pressed
    onEKeyPressed: function() {
        if(tweenAnimating)return
        console.log("E key pressed near the InfoTable num." , this.index);

        tableOpened = true
        tweenHideObjectAlpha(containerTop.scene, containerTop, 100, 0, null, 'Power2');

        if(containerContent.visible){
            canMove = true
            tableOpened = false
            tweenHideObjectAlpha(containerContent.scene, containerContent, animSpeed, 0, null, 'Power2');
        }else{
            if(this.imgQuest.visible && !this.questStarted){
                this.imgQuest.visible = false
                this.questStarted = true
                if(this.questID === 0)
                    containerGameplay.spawnQuestOneItems()
                else if(this.questID === 1)
                    containerGameplay.spawnQuestTwoItems()
            }

            resize()
            canMove = false
            containerContent.updateTableContent(this.index)
            tweenShowObjectAlpha(containerContent.scene, containerContent, animSpeed, 0, null, 'Power2');
        }
    },

    update: function(time,delta) {
        // Calculate the distance between the player and the InfoTable
        let distance = Phaser.Math.Distance.Between(
            this.player.x, 0,
            this.imgInfoTable.x - 250, 0
        );

        // If the player is within the proximity threshold, change the frame
        if (distance < this.proximityThreshold) {
            this.imgInfoTable.setFrame('infoTable1'); // Assuming 'infoTable1' is the nearby frame
            this.showButtonAnimation()
            this.inRange = true
            if(this.player.tableRange != this.index)
                this.player.tableRange = this.index
            if(!tweenAnimating && (this.player.tableRange === this.index) && this.inRange && !containerTop.visible && !tableOpened) {
                containerTop.updateInfoText(this.index)
                tweenShowObjectAlpha(containerTop.scene, containerTop, animSpeed, 0, null, 'Power2');
            }

            if (!this.lastDustTime || time - this.lastDustTime > 1200) {
                this.playGlowAnimation();
                this.lastDustTime = time;
            }
        } else {
            if(this.imgQuest.visible){
                if(!this.questStarted)
                    this.imgQuest.y = this.imgButton.y
            }
            this.imgInfoTable.setFrame('infoTable0'); // Revert to original frame when not nearby
            this.imgButton.alpha = 0;
            this.txtButton.alpha = 0;
            this.inRange = false

            if(this.player.x > 2870){
                if(!tweenAnimating && !containerTop.visible && !tableOpened) {
                    if(this.questStarted) {
                        containerTop.updateInfoText(4)
                        tweenShowObjectAlpha(containerTop.scene, containerTop, animSpeed, 0, null, 'Power2');
                    }else{
                        if (!tweenAnimating && (this.player.tableRange === this.index)) {
                            tweenHideObjectAlpha(containerTop.scene, containerTop, animSpeed, 0, null, 'Power2');
                        }
                    }
                }
            }else {
                if (!tweenAnimating && (this.player.tableRange === this.index)) {
                    tweenHideObjectAlpha(containerTop.scene, containerTop, animSpeed, 0, null, 'Power2');
                }
            }
        }
    }
});