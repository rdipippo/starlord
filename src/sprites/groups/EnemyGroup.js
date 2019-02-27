import Phaser from 'phaser';
import SpriteGroup from './SpriteGroup';

export default class EnemyGroup extends SpriteGroup {
    constructor(scene, config) {
        super(scene);

        this.enemies = [];

        this.config = config;

        this.scene.anims.create({
                    key: 'lookMenacing',
                    frameRate: 10,
                    frames: this.scene.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
                    repeat: -1
                });

        this.config.forEach((enemy) => {
            let renderedEnemy = this.group.create(enemy.x, enemy.y, 'enemy');
            renderedEnemy.setCollideWorldBounds(true);
            renderedEnemy.anims.play('lookMenacing', true);
            renderedEnemy.body.setVelocityX(enemy.velocityX);

            if (enemy.minimumX !== undefined) {
                renderedEnemy.minimumX = enemy.minimumX;
                renderedEnemy.maximumX = enemy.maximumX;
            }

            this.enemies.push(renderedEnemy);
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

    update() {
        this.enemies.forEach((enemy) => {
            if (enemy.x <= enemy.minimumX) {
                enemy.body.setVelocityX(100);
            } else if (enemy.x > enemy.maximumX) {
                enemy.body.setVelocityX(-100);
            }
        });
    }
}
