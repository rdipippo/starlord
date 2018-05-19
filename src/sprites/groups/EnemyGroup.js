import Phaser from 'phaser';
import SpriteGroup from './SpriteGroup';

export default class EnemyGroup extends SpriteGroup {
    constructor(scene, config) {
        super(scene);

        this.config = config;

        this.config.forEach((enemy) => {
            this.group.create(470, 450, 'enemy');
        });

        this.scene.anims.create({
            key: 'lookMenacing',
            frameRate: 10,
            frames: this.scene.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
            repeat: -1
        });

        this.group.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
            child.anims.play('lookMenacing', true);
        });
    }

    handleGround() {
        this.scene.physics.add.collider(this.group, this.scene.ground.group, null, null, this.scene);
    }

    handlePlatforms() {
        this.scene.physics.add.collider(this.group, this.scene.platforms.group, null, null, this.scene);
    }

    handlePlayer() {
        this.scene.physics.add.collider(this.group, this.scene.player.sprite, super.killPlayer, null, this);
    }

    handleBullets() {
        this.scene.physics.add.overlap(this.scene.player.gun.bullets, this.group, super.destroyedByBullet, null, this);
    }
}
