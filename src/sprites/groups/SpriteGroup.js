import Phaser from 'phaser';

export default class SpriteGroup {
    constructor(scene, groupConfig = {}) {
        this.scene = scene;
        this.group = this.scene.physics.add.group(undefined, groupConfig);

        this.handleGround();
        this.handlePlayer();
        this.handleBullets();
        this.handlePlatforms();
    }

    destroyedByBullet(object, bullet) {
        bullet.disableBody(true, true);
        object.disableBody(true, true);

        this.scene.increaseScore(50);
    }

    killPlayer(player, killer) {
        this.scene.player.showDeathScene();
        this.scene.gameOver = true;
    }

    handleGround() {
        throw new Error("You must override handleGround");
    }

    handlePlayer() {
        throw new Error("You must override handlePlayer");
    }

    handleBullets() {
        throw new Error("You must override handleBullets");
    }

    handlePlatforms() {
        throw new Error("You must override handlePlatforms");
    }
}
