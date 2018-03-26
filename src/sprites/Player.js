import Gun from './groups/Gun';

export default class Player {
    constructor (scene, x, y, key) {
        this.scene = scene;

        this.sprite = this.scene.physics.add.sprite(x, y, key).setBounce(0.2).setCollideWorldBounds(true);
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
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.stop();
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
