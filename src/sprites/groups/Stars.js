import Phaser from 'phaser';
import SpriteGroup from './SpriteGroup';

export default class Stars extends SpriteGroup {
    constructor(scene, config) {
        super(scene);

        this.config = config;

        this.config.forEach((star) => {
            let renderedStar = this.group.create(star.x, star.y, 'star');
            renderedStar.body.allowGravity = false;
            renderedStar.setCollideWorldBounds(true);
        });
    }

    update() {
        //const result = this.group.children.entries.filter(star => star.body.velocity.y > 0);
        //result.forEach(function (child) {
            //  Give each star a slightly different bounce
            //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        /*    if (child.body.y >= 400) {
                child.body.allowGravity = false;
                child.body.immovable = true;
                child.body.velocity.y = 0;
            }
        });*/
    }

    haveAllStarsBeenCollected() {
        return this.group.countActive(true) === 0;
    }

    regenerateStars() {
        this.group.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        //  Add and update the score
        this.scene.increaseScore(10);

        /*if (this.haveAllStarsBeenCollected()) {
            this.regenerateStars();
            this.scene.bombs.createBomb();
            this.scene.incrementLevel();
        }*/
    }

    starHitsPlatform(star, platform) {
        star.body.velocity.x = platform.body.velocity.x;
    }

    handleGround() {
        this.scene.physics.add.collider(this.group, this.scene.ground);
    }

    handlePlayer() {
        this.scene.physics.add.overlap(this.scene.player.sprite, this.group, this.collectStar, null, this);
    }

    handleBullets() {
    }

    handlePlatforms() {
        this.scene.physics.add.collider(this.group, this.scene.platforms.group, this.starHitsPlatform, null, this);
    }
}
