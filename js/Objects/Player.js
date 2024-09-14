var Player = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function Player(parent, data)
    {
        Player.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);

        // Add keyboard controls
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            e: Phaser.Input.Keyboard.KeyCodes.E  // Adding the 'E' key
        });

        this.isHockeyAnimationPlaying = false; // Flag to track animation state

        // Set camera to follow the player
        // this.scene.cameras.main.startFollow(this, true, 0.1, 0.1);

        // Initially, don't follow the player
        this.cameraFollowStarted = false;
    },

    init: function (data) {
        this.type = data.type;
        this.tableRange = data.tableRange;
        this.direction = data.direction;

        this.carriedItem = null
    },

    create: function(data) {
        this.scene.add.existing(this);

        this.imgPlayer = this.scene.add.sprite(0, 0, 'pak_player', 'player');
        this.imgPlayer.setOrigin(0.5);
        this.imgPlayer.visible = true;
        this.imgPlayer.setScale(1)
        this.imgPlayer.alpha = 1;

        //ANIMATIONS
        this.imgPlayer.anims.create({
            key: 'playerIdleLeft',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_idle_', start: 0, end: 5}),
            frameRate: 6,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerIdleRight',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_idle_r_', start: 0, end: 5}),
            frameRate: 6,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerIdleTop',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_idle_t_', start: 0, end: 5}),
            frameRate: 6,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerIdleBottom',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_idle_b_', start: 0, end: 5}),
            frameRate: 6,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerMoveLeft',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_move_l_', start: 0, end: 5}),
            frameRate: 12,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerMoveRight',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_move_r_', start: 0, end: 5}),
            frameRate: 12,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerMoveTop',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_move_t_', start: 0, end: 5}),
            frameRate: 12,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerMoveBottom',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_move_b_', start: 0, end: 5}),
            frameRate: 12,
            repeat: -1
        });

        this.imgPlayer.anims.create({
            key: 'playerHockeyRight',
            frames: this.scene.anims.generateFrameNames('pak_player', { prefix: 'player_hockey', start: 0, end: 2}),
            frameRate: 9,
            repeat: 0
        });

        this.imgPlayer.play('playerIdleLeft');

        this.dustPart0 = this.scene.add.sprite(-30, 30, 'pak_player', 'dust0');
        this.dustPart0.setOrigin(0.5);
        this.dustPart1 = this.scene.add.sprite(-55, 28, 'pak_player', 'dust1');
        this.dustPart1.setOrigin(0.5);
        this.dustPart2 = this.scene.add.sprite(-75, 32, 'pak_player', 'dust2');
        this.dustPart2.setOrigin(0.5);

        this.dustPart0.alpha = 0
        this.dustPart1.alpha = 0
        this.dustPart2.alpha = 0

        this.item = this.scene.add.sprite(0, -75, 'pak_decoratives', 'part0');
        this.item.setOrigin(0.5);
        this.item.setScale(1.1);
        this.item.alpha = 0

        this.add(this.dustPart0);
        this.add(this.dustPart1);
        this.add(this.dustPart2);

        this.add(this.item);

        this.add(this.imgPlayer);
    },

    playDustAnimation: function() {
        if( this.dustPart0.alpha>0)return

        // Adjust dust positions based on movement direction
        if (this.cursors.left.isDown || this.keys.left.isDown) {
            this.dustPart0.setPosition(30, 30);
            this.dustPart1.setPosition(55, 28);
            this.dustPart2.setPosition(75, 32);
        } else if (this.cursors.right.isDown || this.keys.right.isDown) {
            this.dustPart0.setPosition(-30, 30);
            this.dustPart1.setPosition(-55, 28);
            this.dustPart2.setPosition(-75, 32);
        } else if (this.cursors.up.isDown || this.keys.up.isDown) {
            this.dustPart0.setPosition(0, 40);
            this.dustPart1.setPosition(0, 60);
            this.dustPart2.setPosition(0, 80);
        } else if (this.cursors.down.isDown || this.keys.down.isDown) {
            this.dustPart0.setPosition(0, -40);
            this.dustPart1.setPosition(0, -60);
            this.dustPart2.setPosition(0, -80);
        }

        // Reset the alpha to make dust visible
        this.dustPart0.alpha = 0;
        this.dustPart0.scale = 0;
        // Create tweens to fade out the dust particles
        this.dustPart0.anim = this.scene.tweens.add({
            targets: this.dustPart0,
            alpha: 1,
            scale: 1,
            duration: 100,
            yoyo: true,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.dustPart0.alpha = 0;
            }
        });
        if( this.dustPart1.alpha>0)return
        this.dustPart1.alpha = 0;
        this.dustPart1.scale = 0;
        this.dustPart1.anim = this.scene.tweens.add({
            targets: this.dustPart1,
            delay: 50,
            alpha: 1,
            scale: 1,
            duration: 100,
            // yoyo: true,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.dustPart1.alpha = 0;
            }
        });
        if( this.dustPart2.alpha>0)return
        this.dustPart2.alpha = 0;
        this.dustPart2.scale = 0;
        this.dustPart2.anim = this.scene.tweens.add({
            targets: this.dustPart2,
            delay: 100,
            alpha: 1,
            scale: 1,
            duration: 100,
            // yoyo: true,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.dustPart2.alpha = 0;
            }
        });
    },

    pickedUpItem: function (item){
        this.item.setFrame(item)
        this.carriedItem = item

        this.item.anim = this.scene.tweens.add({
            targets: this.item,
            delay: 100,
            alpha: 1,
            duration: 200,
            // yoyo: true,
            ease: 'Cubic.easeOut',
            onComplete: () => {
            }
        });
    },

    forwardItem: function (){
        if(this.carriedItem == null)return
        this.item.alpha = 0
    },

    fullHandsText: function (){
        if(this.fullHandsAnimating) return
        this.fullHands = this.scene.add.text(0,0, 'My hands are full', {
            font: '18px "gamefont","Arial"',
            fontSize: '18px',
            fill: '#fff',
            align: 'center',
            stroke: '#78b7d1',
            strokeThickness: 3,
        });
        this.fullHands.setOrigin(0.5)
        this.fullHands.alpha = 0
        this.fullHandsAnimating = true

        this.fullHands.anim = this.scene.tweens.add({
            targets: this.fullHands,
            delay: 0,
            alpha: 1,
            duration: 400,
            hold: 200,
            // yoyo: true,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.fullHandsAnimating = false
                this.fullHands.destroy()
            }
        });

        this.add(this.fullHands);
    },

    update: function(time, delta) {
        if (!canMove || this.isHockeyAnimationPlaying) return;

        let speed = 400;
        // if(this.x < 2870)
        //     speed = 1400;
        let moving = false;

        // Reset the player's velocity before applying movement
        this.body.setVelocity(0);

        // Move left
        if (this.cursors.left.isDown || this.keys.left.isDown) {
            if (this.x <= 0) return;

            if (this.x < 2870)
                this.x -= speed * delta / 1000;
            else
                this.body.setVelocityX(-speed);
            // this.x -= speed * delta / 1000;
            if (this.imgPlayer.anims.currentAnim.key !== 'playerMoveRight') {
                this.imgPlayer.play('playerMoveRight');
            }
            this.direction = 1; // Left
            moving = true;
        }
        // Move right
        else if (this.cursors.right.isDown || this.keys.right.isDown) {
            if (this.x >= 3525) return;

            if (containerGameplay.contTutorial && containerGameplay.contTutorial.visible) {
                setTimeout(() => {
                    containerGameplay.contTutorial.visible = false;
                }, 1000);
            }

            // this.x += speed * delta / 1000;
            if (this.x < 2870)
                this.x += speed * delta / 1000;
            else
                this.body.setVelocityX(speed);
            // this.body.setVelocityX(speed);

            if (this.imgPlayer.anims.currentAnim.key !== 'playerMoveLeft') {
                this.imgPlayer.play('playerMoveLeft');
            }
            this.direction = 0; // Right
            moving = true;
        }
        // Move up
        else if (this.cursors.up.isDown || this.keys.up.isDown) {
            if (this.x < 2870) return;
            if (this.y <= -445) return;

            if (this.x < 2870)
                this.y -= speed * delta / 1000;
            else
                this.body.setVelocityY(-speed);
            // this.body.setVelocityY(-speed);

            if (this.imgPlayer.anims.currentAnim.key !== 'playerMoveTop') {
                this.imgPlayer.play('playerMoveTop');
            }
            this.direction = 2; // Up
            moving = true;
        }
        // Move down
        else if (this.cursors.down.isDown || this.keys.down.isDown) {
            if (this.x < 2870) return;
            if (this.y >= 185) return;

            if(containerGameplay.infoTable.questStarted && containerGameplay.infoTable.questID === 0)
                if (this.y >= 145) return;


            if (this.x < 2870)
                this.y += speed * delta / 1000;
            else
                this.body.setVelocityY(speed);
            // this.body.setVelocityY(speed);

            if (this.imgPlayer.anims.currentAnim.key !== 'playerMoveBottom') {
                this.imgPlayer.play('playerMoveBottom');
            }
            this.direction = 3; // Down
            moving = true;
        }

        // Set idle animation if not moving
        if (!moving) {
            if (this.direction === 0 && this.imgPlayer.anims.currentAnim.key !== 'playerIdleLeft') {
                this.imgPlayer.play('playerIdleLeft');
            } else if (this.direction === 1 && this.imgPlayer.anims.currentAnim.key !== 'playerIdleRight') {
                this.imgPlayer.play('playerIdleRight');
            } else if (this.direction === 2 && this.imgPlayer.anims.currentAnim.key !== 'playerIdleTop') {
                this.imgPlayer.play('playerIdleTop');
            } else if (this.direction === 3 && this.imgPlayer.anims.currentAnim.key !== 'playerIdleBottom') {
                this.imgPlayer.play('playerIdleBottom');
            }
        }

        // Trigger dust animation if moving
        if (moving && (!this.lastDustTime || time - this.lastDustTime > 200)) {
            this.playDustAnimation();
            this.lastDustTime = time;
        }

        // Camera follow logic
        if (this.x >= 700) {
            if (!this.cameraFollowStarted) {
                this.scene.cameras.main.startFollow(this, true, 0.1, 0.1);
                this.cameraFollowStarted = true;
                resize();
            }
        } else {
            if (this.cameraFollowStarted) {
                this.scene.cameras.main.stopFollow();
                this.cameraFollowStarted = false;
                resize();
            }
        }

        // Check proximity to QuestBall
        const questBall = containerGameplay.questBall;
        if (questBall) {
            this.inRangeOfBall = Phaser.Math.Distance.Between(this.x, this.y, questBall.imgBall.x - 250, questBall.imgBall.y - 537) < 100;
        }

        // Handle 'E' key press for hockey animation
        if (this.keys.e.isDown && !this.isHockeyAnimationPlaying) {
            if (this.x < 2870) return;

            if (!containerGameplay.infoTable || !containerGameplay.infoTable.questStarted) return;
            if (containerGameplay.infoTable.questID === 0) {
                this.isHockeyAnimationPlaying = true;
                this.imgPlayer.play('playerHockeyRight');
                this.body.setVelocity(0);
                if (questBall && this.inRangeOfBall) {
                    questBall.rollBall(this.x, this.y);
                }

                this.imgPlayer.on('animationcomplete', (animation) => {
                    if (animation.key === 'playerHockeyRight') {
                        this.isHockeyAnimationPlaying = false;
                    }
                }, this);
            }
        }
    }

});