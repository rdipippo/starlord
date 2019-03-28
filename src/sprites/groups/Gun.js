import Phaser from 'phaser';

export default class Gun {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.bullets = this.scene.physics.add.group();
    }

    shoot() {
        let velocity, xPos;

        if (this.bullets.countActive(true) < 1) {
            if (this.player.isFacingLeft()) {
                velocity = -200;
                xPos = this.player.sprite.x - 25;
            } else {
                velocity = 200;
                xPos = this.player.sprite.x + 25;
            }

            var bullet = this.bullets.create(xPos, this.player.sprite.y, 'star');
            bullet.initialX = xPos;
            bullet.setVelocity(velocity, 0);
            bullet.setCollideWorldBounds(false);
            bullet.body.allowGravity = false;
        }
    }

    update() {
        var that = this;

        this.bullets.children.iterate(function(bullet) {
            if (bullet.visible) {
                if ( bullet.x >= bullet.initialX + 160 || bullet.x <= bullet.initialX - 160) {
                    bullet.visible = false;
                    bullet.active = false;
                } else if (bullet.x <=0 || bullet.y >=800) {
                    bullet.visible = false;
                    bullet.active = false;
                }
            }
        });
    }
}
