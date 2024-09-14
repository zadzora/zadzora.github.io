var ContainerGameplay= new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize: function ContainerGameplay(scene) {
        ContainerGameplay.instance = this;
        Phaser.GameObjects.Container.call(this, scene, 0, 0);
        this.create();
        this.setDepth(1100);
        this.visible = true;
    },

    create: function () {
        this.createGUI();
        this.scene.add.existing(this);
    },

    createGUI: function () {
        this.contMap = this.scene.add.container(0, 0);
        // this.contChests = this.scene.add.container(0, 0);

        //CAMERA
        this.scene.cameras.main.setBounds(0, 0, 3920, 1080); // Adjust the bounds as needed
        this.scene.physics.world.setBounds(0, 0, 3920, 1080);

        this.areaTiles = new Array(areaX);
        this.allObjects = []

        for (var i = 0; i < this.areaTiles.length; i++)
            this.areaTiles[i] = new Array(areaY);

        this.contPlayer = this.scene.add.container(0, 0);
        this.createPlayer()
        this.createMap()
        this.add(this.contMap)

        this.createStartTutorial()

        // this.add(this.contChests)
        this.add(this.contPlayer)
        // In your player class or scene, after creating the player
        // this.scene.physics.world.enable(this.player); // Enable physics for the player
        // this.player.body.collideWorldBounds = true; // Ensure the player cannot move out of the world bounds

        // Add a collider between the player and all other objects in contMap
        this.scene.physics.add.collider(this.player, this.contMap.getAll(), this.handleCollision, null, this);
        this.scene.physics.world.createDebugGraphic();

        // this.imgBigTable = this.scene.add.sprite(0,0, 'bigTable');
        // this.imgBigTable.setOrigin(0.5);
        // this.imgBigTable.setScale(1);
        //
        // this.add(this.imgBigTable)
    },

    // Define the collision handling function
    handleCollision: function(player, object) {
        console.log('Player collided with object:', object.texture.key);
        // Here you can add additional logic if you want to handle special behavior on collision

        // Stop player movement or other logic here
        player.body.setVelocity(0);
    },

    createMap: function (){
        this.tileMap = this.scene.add.tilemap('tilemapCV');

        const layerRoad = this.tileMap.createLayer('road');
        const layerGrass = this.tileMap.createLayer('grass');
        const layerInfoTables = this.tileMap.createLayer('infoTables');
        const layerOthers = this.tileMap.createLayer('others');

        this.createGrass(layerGrass)
        this.createRoad(layerRoad)
        this.createOthers(layerOthers)

        this.createInfoTables(layerInfoTables)
    },

    createRoad: function (layer){
        layer.forEachTile(function (tile) {
            if (tile.properties.type) {
                let objectType = tile.properties.type;

                let isoX = tile.pixelX - (tile.x+2)
                let isoY = tile.pixelY


                //CREATE TILE based on this
                this.road = new Road(this, {
                    type: objectType,
                    frame: tile.properties.frame,
                    x: isoX,
                    y: isoY,
                });

                this.road.setDepth(300)

                this.areaTiles[tile.y][tile.x] = this.road;
                this.contMap.add(this.areaTiles[tile.y][tile.x])
            }
        }, this);
        layer.destroy()
    },

    createGrass: function (layer){
        layer.forEachTile(function (tile) {
            if (tile.properties.type) {
                let objectType = tile.properties.type;


                let isoX = tile.pixelX - (tile.x+2)
                let isoY = tile.pixelY


                //CREATE TILE based on this
                this.grass = new Grass(this, {
                    type: objectType,
                    frame: tile.properties.frame,
                    x: isoX,
                    y: isoY,
                });

                this.grass.setDepth(300)

                this.areaTiles[tile.y][tile.x] = this.grass;
                this.contMap.add(this.areaTiles[tile.y][tile.x])
            }
        }, this);
        layer.destroy()
    },

    createInfoTables: function (layer){
        this.infoTables = []

        let index = 0
        layer.forEachTile(function (tile) {
            if (tile.properties.type) {
                let objectType = tile.properties.type;

                let isoX = tile.pixelX - tile.x
                let isoY = tile.pixelY


                //CREATE TILE based on this
                this.infoTable = new InfoTable(this, {
                    type: objectType,
                    player: this.player,
                    index: index,
                    x: isoX,
                    y: isoY,
                });
                index += 1

                this.infoTable.setDepth(300)

                this.infoTables.push(this.infoTable)
                this.contMap.add(this.infoTable)
            }
        }, this);
        layer.destroy()
    },

    createOthers: function (layer){
        this.fences = []
        this.trees = []
        // layer.setCollisionFromCollisionGroup();
        layer.forEachTile(function (tile) {
            if (tile.properties.type) {
                let isoX = tile.pixelX - tile.x
                let isoY = tile.pixelY

                // const collisionGroup = tile.getCollisionGroup()
                // if (collisionGroup) {
                //     console.log(collisionGroup)
                // }

                // Create the sprites based on the type
                if (tile.properties.frame != null) {
                    this.imgOther = this.scene.add.sprite(isoX, isoY, 'pak_decoratives', tile.properties.type + tile.properties.frame);
                } else {
                    this.imgOther = this.scene.add.sprite(isoX, isoY, 'pak_decoratives', tile.properties.type);
                }

                this.imgOther.setOrigin(0.5);

                // Add physics to the object (collidable)
                if(tile.pixelX > 3150) {
                    this.scene.physics.add.existing(this.imgOther);
                    this.imgOther.body.setImmovable(true); // Make sure the object doesn't move when collided with
                    this.imgOther.body.setCollideWorldBounds(true); // Ensure it respects world bounds if necessary
                    this.imgOther.body.allowGravity = false; // Ensure it is not affected by gravity
                    //Custom width
                    if (tile.properties.customWidth) {
                        this.imgOther.body.setSize(tile.properties.customWidth, tile.properties.height);
                    }
                    if (tile.properties.customOffsetX) {
                        this.imgOther.body.setOffset(tile.properties.customOffsetX*2, 0); // Adjust as needed
                    }

                    // Store fences for additional logic (if needed)
                    if(tile.properties.type === 'tree')
                        this.trees.push(this.imgOther);
                    else
                        this.fences.push(this.imgOther);

                }

                this.contMap.add(this.imgOther)
            }
        }, this);
        layer.destroy()


        // Education house
        this.imgHouse = this.scene.add.sprite(1380, 330, 'pak_decoratives', 'house');
        this.imgHouse.setOrigin(0.5);

        this.imgHouseFlag = this.scene.add.sprite(this.imgHouse.x + 23, this.imgHouse.y - 90, 'pak_decoratives', 'flag0');
        this.imgHouseFlag.setOrigin(0.5);

        //ANIMATIONS
        this.imgHouseFlag.anims.create({
            key: 'flagWave',
            frames: this.scene.anims.generateFrameNames('pak_decoratives', { prefix: 'flag', start: 0, end: 7}),
            frameRate: 4,
            repeat: -1
        });
        this.imgHouseFlag.play('flagWave');

        this.contMap.add(this.imgHouse)
        this.contMap.add(this.imgHouseFlag)

        // Office
        this.imgOffice = this.scene.add.sprite(2050, 330, 'pak_decoratives', 'office');
        this.imgOffice.setOrigin(0.5);

        this.contMap.add(this.imgOffice)

        // home
        this.imgHome = this.scene.add.sprite(2680, 300, 'pak_decoratives', 'home');
        this.imgHome.setOrigin(0.5);

        this.contMap.add(this.imgHome)
    },

    createPlayer: function (){
        this.player = new Player(this, {
            type: 'player',
            tableRange: 0,
            direction: 0,
        });
        //    0
        // 3     1
        //    2
        this.contPlayer.add(this.player)

        // Enable physics for the player
        this.scene.physics.world.enable(this.player);
        this.player.body.setCollideWorldBounds(true); // Ensure it respects world bounds if necessary
        this.player.body.setBounce(0); // Optional: Set bounce if needed
        this.player.body.setDrag(0); // Optional: Set drag to stop sliding
        this.player.body.setOffset(-30, -25); // Adjust as needed
    },

    createStartTutorial: function (){
        // Add keyboard controls
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.contTutorial = this.scene.add.container(0, 0);
        infoBubblePopUp(this.contTutorial,1)

        this.imgButtonLeft = this.scene.add.sprite(-40,-100, 'pak_decoratives', 'button');
        this.imgButtonLeft.setOrigin(0.5);
        this.imgButtonLeft.setScale(1);
        // this.imgButtonLeft.alpha = 0

        this.txtButtonLeft = this.scene.add.text(this.imgButtonLeft.x + 1, this.imgButtonLeft.y - 4, '<', {
            font: '48px "gamefont","Arial"',
            fontSize: '48px',
            fill: '#1a0a02',
            align: 'center',
            // stroke: '#49301f',
            // strokeThickness: 4,
        });
        this.txtButtonLeft.setOrigin(0.5)
        // this.txtButtonLeft.alpha = 0

        this.imgButtonRight = this.scene.add.sprite(40,-100, 'pak_decoratives', 'button');
        this.imgButtonRight.setOrigin(0.5);
        this.imgButtonRight.setScale(1);
        // this.imgButtonLeft.alpha = 0

        this.txtButtonRight = this.scene.add.text(this.imgButtonRight.x + 1, this.imgButtonRight.y - 4, '>', {
            font: '48px "gamefont","Arial"',
            fontSize: '48px',
            fill: '#1a0a02',
            align: 'center',
            // stroke: '#49301f',
            // strokeThickness: 4,
        });
        this.txtButtonRight.setOrigin(0.5)

        this.contTutorial.add(this.imgButtonLeft)
        this.contTutorial.add(this.txtButtonLeft)
        this.contTutorial.add(this.imgButtonRight)
        this.contTutorial.add(this.txtButtonRight)
        this.add(this.contTutorial)
    },

    fencesVisibility: function (visibility){

        for(let i = 0; i < this.fences.length; i++) {
            this.fences[i].visible = visibility
        }
        for(let i = 0; i < this.trees.length; i++){
            this.trees[i].visible = visibility

            // Toggle collisions based on visibility
            if (visibility) {
                // Enable collision if visible
                this.trees[i].body.setImmovable(true);
                this.trees[i].body.checkCollision.up = true;
                this.trees[i].body.checkCollision.down = true;
                this.trees[i].body.checkCollision.left = true;
                this.trees[i].body.checkCollision.right = true;
            } else {
                // Disable collision if not visible
                this.trees[i].body.setImmovable(false);
                this.trees[i].body.checkCollision.up = false;
                this.trees[i].body.checkCollision.down = false;
                this.trees[i].body.checkCollision.left = false;
                this.trees[i].body.checkCollision.right = false;
            }
        }

    },

    spawnQuestOneItems: function (){
        this.questBall = new QuestBall(this, {
            type: null,
            player: this.player,
        });

        // Add a collider between the player and all other objects in contMap
        this.scene.physics.add.collider(this.player, this.questBall.imgGoal, this.handleCollision, null, this);

        this.fencesVisibility(false)

        this.imgPitch = this.scene.add.sprite(3450, 390, 'pak_decoratives', 'pitch');
        this.imgPitch.setOrigin(0.5);
        this.imgPitch.setScale(1)

        this.contMap.add(this.imgPitch)
        this.contMap.add(this.questBall)
    },

    spawnQuestTwoItems: function (){
        //Create Quest table
        this.pcTable = new PCTable(this, {
            type: 'PCTable',
            player: this.player,
            x: 3500,
            y: 100,
        });
        this.scene.physics.add.collider(this.player, this.pcTable.imgTable, this.handleCollision, null, this);
        this.contMap.add(this.pcTable)

        //Create Chests
        this.chests = []
        const types = ['chest','chest','chest','barrel','barrel']
        const content = ['empty','part0','empty','part1','part2']
        const coordX = [3175, 3680,3330,3330,3710]
        const coordY = [120,240,680,230,520]

        for(let i = 0; i < 5; i++){
            this.chest = new Chest(this, {
                id: i,
                type: types[i],
                content: content[i],
                player: this.player,
                x: coordX[i],
                y: coordY[i],
            });

            this.scene.physics.add.collider(this.player, this.chest.imgChest, this.handleCollision, null, this);
            this.chests.push(this.chest)
            this.contMap.add(this.chest)
        }
    },


    quest2Done: function (){
        for (let i = this.chests.length - 1; i >= 0; i--) {
            this.scene.tweens.add({
                targets: [this.chests[i]],
                alpha: 0,
                duration: 150, // Bounce back quickly
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.chests[i].destroy();
                }
            });
        }

        this.scene.tweens.add({
            targets: [this.pcTable],
            alpha: 0,
            duration: 150, // Bounce back quickly
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.pcTable.destroy()
                if(containerGameplay.infoTable.questID < 3) {
                    containerGameplay.infoTable.startNewQuest()
                }
            }
        });
    },

    update: function(time, delta)
    {
        if(!this.visible) return
        if (this.player) {
            this.player.update(time, delta);
        }
        // if (this.quest) {
        //     this.quest.update(time, delta);
        // }
        if (this.infoTables) {
            for(let i = 0; i < this.infoTables.length; i++){
                this.infoTables[i].update(time,delta);
            }
        }

        if (this.chests) {
            for(let i = 0; i < this.chests.length; i++){
                this.chests[i].update(time,delta);
            }
        }
        if (this.pcTable) {
            this.pcTable.update(time, delta);
        }
        //
        if(this.imgButtonLeft){
            if(this.imgButtonLeft.visible && this.imgButtonLeft.alpha > 0){
                const speed = 400;

                // Move left
                if (this.cursors.left.isDown || this.keys.left.isDown) {
                    if(this.imgButtonLeft.x <= 0) return
                    this.imgButtonLeft.x -= speed * delta / 1000;
                    this.txtButtonLeft.x -= speed * delta / 1000;
                    this.imgButtonRight.x -= speed * delta / 1000;
                    this.txtButtonRight.x -= speed * delta / 1000;
                }
                // Move right
                else if (this.cursors.right.isDown || this.keys.right.isDown) {
                    this.imgButtonLeft.x += speed * delta / 1000;
                    this.txtButtonLeft.x += speed * delta / 1000;
                    this.imgButtonRight.x += speed * delta / 1000;
                    this.txtButtonRight.x += speed * delta / 1000;
                }


            }
        }

    },

    resize: function(gameSize, baseSize, displaySize, resolution)
    {
        if(this.scene === undefined)
            return;

        var width = gameSize.width;
        var height = gameSize.height;

        if(this.scene.cameras.main.scrollX > 100)return;
        // Adjust the main container position relative to the camera
        this.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);

        // Adjust map and player containers relative to the camera
        this.contMap.setPosition(11, height / 2 - 400);
        // this.contChests.setPosition(11, height / 2 - 400);
        this.contPlayer.setPosition(250, height / 2 + 110);
        this.contTutorial.setPosition(250, height / 2 + 110);
    },
});