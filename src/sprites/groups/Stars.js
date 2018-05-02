import Phaser from 'phaser';
import SpriteGroup from './SpriteGroup';

export default class Stars extends SpriteGroup {
    constructor(scene) {
        super(scene, {
                   key: 'star',
                   repeat: 25,
                   setXY: { x: 12, y: 0, stepX: 70 }
                 });

        this.group.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setCollideWorldBounds(true);
        });
    }

    update() {
        const result = this.group.children.entries.filter(star => star.body.velocity.y > 0);
        result.forEach(function (child) {
            //  Give each star a slightly different bounce
            //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            if (child.body.y >= 400) {
                child.body.allowGravity = false;
                child.body.immovable = true;
                child.body.velocity.y = 0;
            }
        });
    }

    haveAllStarsBeenCollected() {
        return this.group.countActive(true) === 0;
    }

    regenerateStars() {
        this.group.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }

    handleGround() {
        this.scene.physics.add.collider(this.group, this.scene.ground);
    }

    handlePlayer() {
        this.scene.physics.add.overlap(this.scene.player.sprite, this.group, this.scene.collectStar, null, this.scene);
    }

    handleBullets() {
    }

    handlePlatforms() {
        this.scene.physics.add.collider(this.group, this.scene.platforms.group, this.scene.starHitsPlatform, null, this);
    }
}
