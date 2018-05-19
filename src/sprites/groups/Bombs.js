import Phaser from 'phaser';
import SpriteGroup from './SpriteGroup';

export default class Bombs extends SpriteGroup {
    constructor(scene, playerSprite) {
        super(scene);
        this.playerSprite = playerSprite;
    }

    createBomb(config) {
        this.config = config;

        for(let i=1; i<= this.config.count; i++) {
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

    handleGround() {
        this.scene.physics.add.collider(this.group, this.scene.ground.group);
    }

    handlePlayer() {
        this.scene.physics.add.overlap(this.scene.player.sprite, this.group, super.killPlayer, null, this);
    }

    handleBullets() {
        this.scene.physics.add.overlap(this.scene.player.gun.bullets, this.group, super.destroyedByBullet, null, this);
    }

    handlePlatforms() {
        this.scene.physics.add.collider(this.group, this.scene.platforms.group);
    }
}
