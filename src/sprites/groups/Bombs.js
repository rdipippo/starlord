export default class Bombs {
    constructor(scene, playerSprite) {
        this.scene = scene;
        this.group = scene.physics.add.group();
        this.playerSprite = playerSprite;
    }

    createBomb() {
        var initialXPos = (this.playerSprite.x < 400) ? Phaser.Math.Between(400, 800) :
            Phaser.Math.Between(0, 400);
        var bomb = this.group.create(initialXPos, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);

        // (hopefully) prevent the bomb from getting stuck and bouncing straight up and down forever.
        var bombXVelocity = Phaser.Math.Between(-200, 200);
        if (bombXVelocity == 0) {
            bombXVelocity = 50;
        }

        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}
