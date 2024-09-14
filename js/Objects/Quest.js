var Quest = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,
    initialize: function Quest(parent, data)
    {
        Quest.instance = this;
        Phaser.GameObjects.Container.call(this, parent.scene, 0, 0);

        this.init(data);
        this.create(data);
        this.setDepth(300);
    },

    init: function (data) {
        this.type = data.type;
        this.player = data.player,

        this.proximityThreshold = 100; // Distance threshold to trigger frame change
        this.inRange = false
        this.questStarted = false
        this.questID = 0
    },

    create: function(data) {
        this.scene.add.existing(this);

        this.imgQuest = this.scene.add.sprite(data.x, data.y, 'pak_decoratives', 'quest');
        this.imgQuest.setOrigin(0.5);
        this.imgQuest.setScale(1);

        this.add(this.imgQuest);
    },


    showButtonAnimation: function() {
        if( this.imgButton.alpha>0)return

        // Reset the alpha to make dust visible
        this.imgButton.alpha = 0;
        this.txtButton.alpha = 0;
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
        if (this.inRange && !this.questStarted) {
            this.onEKeyPressed();
        }
    },

    // Define the function that will be called when "E" is pressed
    onEKeyPressed: function() {
        console.log("E key pressed near the quest");
        this.imgButton.alpha = 0;
        this.txtButton.alpha = 0;

        this.visible = false
        if(this.questID == 0) {
            containerGameplay.spawnQuestOneItems()
        }

        this.questStarted = true
    },

    update: function(time,delta) {
        if(this.questStarted)return
        // Calculate the distance between the player and the InfoTable
        let distance = Phaser.Math.Distance.Between(
            this.player.x,  0,
            this.imgQuest.x - 250, 0
        );

        // console.log(distance, ' dist')
        // If the player is within the proximity threshold, change the frame
        if (distance < this.proximityThreshold) {
            this.inRange = true
        } else {
            this.inRange = false
        }
    }
});