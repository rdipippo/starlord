export default class Player {
    constructor (scene, x, y, key) {
        this.scene = scene;

        this.sprite = this.scene.physics.add.sprite(x, y, key).setBounce(0.2).setCollideWorldBounds(true);
        this.bullets = this.scene.physics.add.group();

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    moveLeft() {
        this.sprite.body.setVelocityX(-160);
        this.sprite.anims.play('left', true);
    }

    moveRight() {
        this.sprite.body.setVelocityX(160);
        this.sprite.anims.play('right', true);
    }

    stopMoving() {
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.stop();
    }

    jump() {
        this.sprite.body.setVelocityY(-330);
    }

    shoot() {
        let velocity, xPos;

        if (this.bullets.countActive(true) <= 5) {
            if (this.isFacingLeft()) {
                velocity = -200;
                xPos = this.sprite.x - 25;
            } else {
                velocity = 200;
                xPos = this.sprite.x + 25;
            }

            var bullet = this.bullets.create(xPos, this.sprite.y, 'star');
            bullet.setVelocity(velocity, 0);
            bullet.setCollideWorldBounds(false);
            bullet.body.allowGravity = false;
        }
    }

    update() {
        var that = this;

        this.bullets.children.iterate(function(bullet) {

            if (bullet.visible) {
                if (that.isFacingRight() && bullet.x >= that.sprite.x + 160) {
                    bullet.visible = false;
                    bullet.active = false;
                } else if (that.isFacingLeft() && bullet.x <= that.sprite.x - 160) {
                    bullet.visible = false;
                    bullet.active = false;
                } else if (bullet.x <=0 || bullet.y >=800) {
                    bullet.visible = false;
                    bullet.active = false;
                }
            }
        });
    }

    isFacingLeft() {
        return this.sprite.anims.currentAnim != null && this.sprite.anims.currentAnim.key == 'left';
    }

    isFacingRight() {
        return this.sprite.anims.currentAnim != null && this.sprite.anims.currentAnim.key == 'right';
    }

    showDeathScene() {
        this.sprite.setTint(0xff0000);
        this.stopMoving();
    }
}
