import Phaser from 'phaser';

export default class Stars {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.group.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
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
}
