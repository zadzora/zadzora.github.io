var QuestBall = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function QuestBall(parent, data)
    {
        QuestBall.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);
    },

    init: function (data) {
        this.type = data.type;
    },

    create: function(data) {
        this.scene.add.existing(this);
        this.imgBall = this.scene.add.sprite(3350, 300, 'pak_decoratives', 'ball0');
        this.imgBall.setOrigin(0.5);
        this.imgBall.setScale(1.5)

        //ANIMATIONS
        this.imgBall.anims.create({
            key: 'shootAnim',
            frames: this.scene.anims.generateFrameNames('pak_decoratives', { prefix: 'ball', start: 0, end: 2}),
            frameRate: 6,
            repeat: 0
        });

        this.imgGoal = this.scene.add.sprite(3670, 100, 'pak_decoratives', 'goal');
        this.imgGoal.setOrigin(0.5);
        this.imgGoal.setScale(1.5)

        this.scene.physics.add.existing(this.imgGoal);
        this.imgGoal.body.setImmovable(true); // Make sure the object doesn't move when collided with
        this.imgGoal.body.setCollideWorldBounds(true); // Ensure it respects world bounds if necessary
        this.imgGoal.body.setSize(70,10);
        this.imgGoal.body.setOffset(30, 20); // Adjust as needed

        this.imgConfetti = this.scene.add.sprite(this.imgGoal.x, this.imgGoal.y, 'pak_confetti', 'conf0');
        this.imgConfetti.setOrigin(0.5);
        this.imgConfetti.alpha = 0
        // this.imgConfetti.setScale(1.5)
        this.imgConfetti.anims.create({
            key: 'confetti',
            frames: this.scene.anims.generateFrameNames('pak_confetti', { prefix: 'conf', start: 0, end: 4}),
            frameRate: 8,
            repeat: 0
        });

        this.add(this.imgGoal);
        this.add(this.imgBall);
        this.add(this.imgConfetti);
    },

    tunfOffColision: function (){

    },
    // const rollDistance = Math.floor(Math.random() * 100) + 50;;
    rollBall: function(playerX, playerY) {
        if (this.isBallMoving) return; // Prevent spamming if the ball is already moving

        const rollDistance = Math.floor(Math.random() * 100) + 50;;

        // Adjust player coordinates to align with ball's coordinate system
        playerX += 250;
        playerY += 537;

        // Calculate distance differences on both axes
        const deltaX = Math.abs(this.imgBall.x - playerX);
        const deltaY = Math.abs(this.imgBall.y - playerY);

        let targetX = this.imgBall.x;
        let targetY = this.imgBall.y;

        // Determine which axis to move along
        if (deltaX > deltaY) {
            // Move horizontally
            if (playerX < this.imgBall.x) { // Player is to the left
                targetX += rollDistance;
            } else if (playerX > this.imgBall.x) { // Player is to the right
                targetX -= rollDistance;
            }
        } else {
            // Move vertically
            if (playerY < this.imgBall.y) { // Player is above
                targetY += rollDistance;
            } else if (playerY > this.imgBall.y) { // Player is below
                targetY -= rollDistance;
            }
        }

        // Set the boundaries
        const minX = 3200;
        const maxX = 3700;
        const minY = 150;
        const maxY = 600;

        // Calculate if it will hit the boundary
        let bounceBackX = targetX;
        let bounceBackY = targetY;

        if (targetX < minX) {
            bounceBackX = minX;
            targetX = minX - rollDistance; // Move to the boundary, then bounce back
        } else if (targetX > maxX) {
            bounceBackX = maxX;
            targetX = maxX + rollDistance; // Move to the boundary, then bounce back
        }

        if (targetY < minY) {
            bounceBackY = minY;
            targetY = minY - rollDistance; // Move to the boundary, then bounce back
        } else if (targetY > maxY) {
            bounceBackY = maxY;
            targetY = maxY + rollDistance; // Move to the boundary, then bounce back
        }

        // Prevent further movement while the ball is animating
        this.isBallMoving = true;

        // Play the shoot animation
        this.imgBall.play('shootAnim');

        //set max target Y
        if (targetY < 40) {
            targetY = 40
        }
        if (targetY > 690) {
            targetY = 690
        }

        if (targetX < 3100) {
            targetX = 3100
        }
        if (targetX > 3800) {
            targetX = 3800
        }


        // Tween to move the ball to the boundary or target position
        this.scene.tweens.add({
            targets: this.imgBall,
            x: targetX,
            y: targetY,
            duration: 200, // First part of the bounce animation
            ease: 'Power2',
            onComplete: () => {
                // Check if the ball is in the goal area
                if (targetX >= 3590 && targetX <= 3710 && targetY < 120) {
                    this.goalScored(); // Call goalScored function
                    this.imgBall.destroy(); // Remove the ball from the scene
                } else {
                    // Tween to bounce the ball back to the boundary position
                    this.scene.tweens.add({
                        targets: this.imgBall,
                        x: bounceBackX,
                        y: bounceBackY,
                        duration: 150, // Bounce back quickly
                        ease: 'Bounce.easeOut',
                        onComplete: () => {
                            // Reset the flag when the animation is complete
                            this.isBallMoving = false;
                        }
                    });
                }
            }
        });
    },

    goalScored: function() {
        // Play the confetti animation
        this.imgConfetti.play('confetti');
        this.imgConfetti.alpha = 1

        // Listen for the animation completion event
        this.imgConfetti.on('animationcomplete', (animation) => {
            // Check if the completed animation is 'confetti'
            if (animation.key === 'confetti') {
                this.imgConfetti.destroy();
                setTimeout(() => {
                    // Proceed with the tween and other logic after confetti animation completes
                    this.scene.tweens.add({
                        targets: [this.imgGoal, containerGameplay.imgPitch],
                        alpha: 0,
                        duration: 150, // Bounce back quickly
                        ease: 'Bounce.easeOut',
                        onComplete: () => {
                            if (!containerGameplay.infoTable) return;

                            if (containerGameplay.infoTable.questID === 0) {
                                // Show the fence
                                containerGameplay.fencesVisibility(true);
                            }

                            this.imgGoal.destroy();
                            containerGameplay.imgPitch.destroy();

                            // Adjust player position if necessary
                            if (containerGameplay.player.y < -280) {
                                containerGameplay.player.y = -280;
                                containerGameplay.player.x = 3420;
                            }

                            // Start a new quest if applicable
                            if (containerGameplay.infoTable.questID < 3) {
                                containerGameplay.infoTable.startNewQuest();
                            }
                        }
                    });
                }, 300);
            }
        }, this);
    }

});