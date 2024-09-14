var ContainerContent= new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize: function ContainerContent(scene) {
        ContainerContent.instance = this;
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
        this.contContent = this.scene.add.container(0, 0);

        this.imgBackground = this.scene.add.image(0, 0, 'blank');
        this.imgBackground.tint = 0x000000;
        this.imgBackground.alpha = 0;
        this.imgBackground.visible = true
        this.imgBackground.setInteractive();
        this.add(this.imgBackground);

        this.imgBigTable = this.scene.add.sprite(0,0, 'pak_decoratives', 'bigTable');
        this.imgBigTable.setOrigin(0.5);
        this.imgBigTable.setScale(1);

        this.tableContent = this.scene.add.sprite(0,0, 'pak_infoScreens', 'education');
        this.tableContent.setOrigin(0.5);
        this.tableContent.setScale(1);

        this.buttonClose = this.scene.add.sprite(487,-334, 'pak_decoratives', 'CloseButtonTop');
        this.buttonClose.setOrigin(0.5);
        this.buttonClose.setScale(1.05);
        AddButtonEvents(this.buttonClose,
            function(){
                if(isAnimating) return

                tableOpened = false
                canMove = true
                animateButtonClickNew(this.buttonClose, 10);

                tweenHideObjectAlpha(this.scene, this, animSpeed, 0, null, 'Power2');
            }.bind(this)
        );

        this.buttonBottom = this.scene.add.sprite( this.buttonClose.x, this.buttonClose.y, 'pak_decoratives', 'CloseButtonBottom');
        this.buttonBottom.setOrigin(0.5);
        this.buttonBottom.setScale(1.05);
        handleButtonEvent(this.buttonClose, [this.buttonBottom])

        // this.txtHeadline = this.scene.add.text(0,0, 'PERSONAL DETAILS', {
        //     font: '48px "gamefont","Arial"',
        //     fontSize: '48px',
        //     fill: '#deb887',
        //     align: 'center',
        //     stroke: '#1e130e',
        //     strokeThickness: 4,
        // });
        // this.txtHeadline.setOrigin(0.5)
        // this.txtHeadline.alpha = 1
        // this.txtHeadline.setShadow(0, 4, "#1e130e", 0, 4);

        this.contContent.add(this.imgBigTable)
        this.contContent.add(this.tableContent)


        this.contContent.add(this.buttonBottom)
        this.contContent.add(this.buttonClose)

        // this.contContent.add(this.txtHeadline)

        this.add(this.contContent)
    },

    updateTableContent: function (id){
          switch (id){
              case 0:
                  this.tableContent.setFrame('personal')
                  break
              case 1:
                  this.tableContent.setFrame('education')
                  break
              case 2:
                  this.tableContent.setFrame('experience')
                  break
              case 3:
                  this.tableContent.setFrame('skills')
                  break
              case 4:
                  this.tableContent.setFrame('hobby' + containerGameplay.infoTable.questID)
                  break
              default:
                  this.tableContent.setFrame('personal')
          }
    },

    resize: function(gameSize, baseSize, displaySize, resolution)
    {
        if(this.scene === undefined)
            return;

        var width = gameSize.width;
        var height = gameSize.height;

        this.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);

        this.imgBackground.setDisplaySize(width * 2, height* 2);
        this.imgBackground.setPosition(width / 2, height / 2);

        this.contContent.setPosition(width/2, height/2);
    },
});