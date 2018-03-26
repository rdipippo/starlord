import Phaser from 'phaser';
import bombImg from './../../assets/images/bomb.png';
import groundImg from './../../assets/images/platform.png';
import starImg from './../../assets/images/star.png';
import skyImg from './../../assets/images/sky.png';
import playerSS from './../../assets/spritesheets/dude.png';
import Player from './../../sprites/Player';
import Stars from './../../sprites/groups/Stars';
import Bombs from './../../sprites/groups/Bombs';

class BootScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: 'Boot',
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y: 300},
                    debug: false
                }
            }
        });
    }

    preload() {
        this.load.image('sky', skyImg);
        this.load.image('ground', groundImg);
        this.load.image('star', starImg);
        this.load.image('bomb', bombImg);
        this.load.spritesheet('dude', playerSS, { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.score = 0;
        this.level = 1;
        this.time = 300;
        this.updateCount = 0;

        //  A simple background for our game
        this.add.image(400, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platform1 = this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // The player and its settings
        //this.player = this.physics.add.sprite(100, 450, 'dude').setActive().setBounce(0.2).setCollideWorldBounds(true);
        this.player = new Player(this, 100, 450, 'dude');

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.stars = new Stars(this);
        this.bombs = new Bombs(this, this.player.sprite);
        this.bullets = this.player.bullets;

        this.platformDirection = -1;

        //  The score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.levelText = this.add.text(16, 50, 'Level: 1', { fontSize: '32px', fill: '#000' });
        this.timerText = this.add.text(585, 16, 'Time: 300', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.collider(this.stars.group, this.platforms);
        this.physics.add.collider(this.bombs.group, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player.sprite, this.stars.group, this.collectStar, null, this);
        this.physics.add.overlap(this.player.gun.bullets, this.bombs.group, this.destroyBomb, null, this);

        this.physics.add.collider(this.player.sprite, this.bombs.group, this.hitBomb, null, this);

        this.bombs.createBomb();
    }


    update() {
        if (this.level > 1) {
            if (this.platform1.x <= 300) {
                this.platformDirection = 1;
            } else if (this.platform1.x > 500) {
                this.platformDirection = -1;
            }

            this.platform1.x += 1 * this.platformDirection;
            this.platform1.refreshBody();
        }

        if (this.gameOver) {
            this.physics.pause();

            let gameOverMessage;

            if (this.time == 0) {
                gameOverMessage = 'GAME OVER - OUT OF TIME';
            } else {
                gameOverMessage = 'GAME OVER';
            }

            this.add.text(16, 88, gameOverMessage, { fontSize: '32px', fill: '#000' });
            return;
        }

        this.decrementTimer();

        this.player.update();

        if (this.shoot.isDown) {
            this.player.shoot();
        }

        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        } else if (this.cursors.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.stopMoving();
        }

        if (this.cursors.up.isDown && this.player.sprite.body.touching.down) {
            this.player.jump();
        }
    }

    destroyBomb(bullet, bomb) {
        bullet.disableBody(true, true);
        bomb.disableBody(true, true);

        this.increaseScore(50);
    }

    collectStar (player, star) {
        star.disableBody(true, true);

        //  Add and update the score
        this.increaseScore(10);

        if (this.stars.haveAllStarsBeenCollected()) {
            //  A new batch of stars to collect
            this.stars.regenerateStars();
            this.bombs.createBomb();
            this.incrementLevel();
        }
    }

    increaseScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
    }

    decrementTimer() {
        this.updateCount++;

        if (this.updateCount % 20 == 0) {
            this.timerText.setText('Time: ' + --this.time);

            if (this.time == 0) {
                this.gameOver = true;
            }
        }
    }

    incrementLevel() {
        this.levelText.setText('Level: ' + ++this.level);
        this.resetTime();
    }

    resetTime() {
        this.time = 300;
    }

    hitBomb (player, bomb) {
        this.player.showDeathScene();
        this.gameOver = true;
    }
}

export default BootScene;
