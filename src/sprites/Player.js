import Gun from './groups/Gun';

export default class Player {
    constructor (scene, x, y, key) {
        this.scene = scene;

        this.standingOnPlatform = false;
        this.sprite = this.scene.physics.add.sprite(x, y, key).setBounce(0.2).setCollideWorldBounds(true);
        // TODO control player gravity here
        this.sprite.body.gravity.y = 0;

        this.gun = new Gun(scene, this);

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
        if (this.standingOnPlatform !== true) {
            this.sprite.body.setVelocityX(0);
        }

        this.sprite.anims.stop();
    }

    hitGround() {
        this.standingOnPlatform = false;
        if (this.sprite != null && this.sprite.body != null) {
            this.sprite.body.setVelocityX(0);
        }
    }

    standOnPlatform(platform) {
        this.sprite.body.setVelocityX(platform.body.velocity.x);
        this.standingOnPlatform = true;
    }

    jump() {
        this.sprite.body.setVelocityY(-330);
    }

    shoot() {
        this.gun.shoot();
    }

    update() {
       this.gun.update();
    }

    getPosition() {
        return { x: this.sprite.body.x, y: this.sprite.body.y };
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
