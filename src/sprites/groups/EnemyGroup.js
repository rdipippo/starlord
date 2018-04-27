import Phaser from 'phaser';

export default class EnemyGroup {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group();

        this.group.create(470, 450, 'enemy');

        this.scene.anims.create({
            key: 'lookMenacing',
            frameRate: 10,
            frames: this.scene.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
            repeat: -1
        });

        this.group.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
            //child.anims.play('lookMenacing', true);
        });

    }
}
