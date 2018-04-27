import Phaser from 'phaser';
import bombImg from './../../assets/images/bomb.png';
import groundImg from './../../assets/images/platform.png';
import verticalPlatformImg from './../../assets/images/verticalPlatform.png';
import starImg from './../../assets/images/star.png';
import skyImg from './../../assets/images/sky.png';
import playerSS from './../../assets/spritesheets/dude.png';
import Player from './../../sprites/Player';
import enemySS from './../../assets/spritesheets/enemy.png';
import Stars from './../../sprites/groups/Stars';
import Bombs from './../../sprites/groups/Bombs';
import EnemyGroup from './../../sprites/groups/EnemyGroup';
import Platforms from './../../sprites/groups/Platforms';

class BootScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: 'Boot',
            type: Phaser.CANVAS,
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
        this.load.image('verticalPlatform', verticalPlatformImg);
        this.load.spritesheet('dude', playerSS, {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('enemy', enemySS, {frameWidth: 34, frameHeight: 40});
    }

    create() {
        this.score = 0;
        this.level = 5;
        this.time = 300;
        this.updateCount = 0;

        //  A simple background for our game
        for (var j=400; j<=3600; j+=800) {
            this.add.image(j, 300, 'sky');
        }

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = new Platforms(this);

        this.ground = this.physics.add.group();

        for (var i = 200; i <= 3600; i += 300) {
            var groundSprite = this.ground.create(i, 568, 'ground');
            groundSprite.body.allowGravity = false;
            groundSprite.body.immovable = true;
        }

        // The player and its settings
        this.player = new Player(this, 400, 450, 'dude');

        this.enemyGroup = new EnemyGroup(this);

        this.physics.add.collider(this.enemyGroup.group, this.ground, null, null, this);
        this.physics.add.collider(this.enemyGroup.group, this.player.sprite, this.hitBomb, null, this);
        this.physics.add.overlap(this.player.gun.bullets, this.enemyGroup.group, this.destroyBomb, null, this);

        this.physics.world.setBounds(0, 0, 3500, 650);
        this.cameras.main.setBounds(0, 0, 3200, 600);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.stars = new Stars(this);
        this.bombs = new Bombs(this, this.player.sprite);
        this.bullets = this.player.bullets;

        //  The score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'}).setScrollFactor(0)
        this.levelText = this.add.text(16, 50, 'Level: 1', {fontSize: '32px', fill: '#000'}).setScrollFactor(0)
        this.timerText = this.add.text(585, 16, 'Time: 300', {fontSize: '32px', fill: '#000'}).setScrollFactor(0)

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player.sprite, this.platforms.group, this.standOnPlatform, null, this);
        this.physics.add.collider(this.player.sprite, this.ground, this.player.hitGround, null, this);
        this.physics.add.collider(this.stars.group, this.platforms.group, this.starHitsPlatform, null, this);
        this.physics.add.collider(this.bombs.group, this.platforms.group);
        this.physics.add.collider(this.stars.group, this.ground);
        this.physics.add.collider(this.bombs.group, this.ground);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player.sprite, this.stars.group, this.collectStar, null, this);
        this.physics.add.overlap(this.player.gun.bullets, this.bombs.group, this.destroyBomb, null, this);

        this.physics.add.collider(this.player.sprite, this.bombs.group, this.hitBomb, null, this);

        this.bombs.createBomb();
    }

    standOnPlatform(player, platform) {
        this.player.standOnPlatform(platform);
    }

    starHitsPlatform(star, platform) {
        star.body.velocity.x = platform.body.velocity.x;
    }

    update() {
        if (this.gameOverComplete) {
            return;
        }

        this.cameras.main.scrollX = this.player.sprite.x - 400;

        if (this.player != null && this.player.sprite != null && this.player.sprite.body != null && this.player.sprite.body.y > 595) {
            this.gameOver = true;
        }

        if (this.gameOver) {
            this.physics.pause();

            let gameOverMessage;

            if (this.time == 0) {
                gameOverMessage = 'GAME OVER - OUT OF TIME';
            } else {
                gameOverMessage = 'GAME OVER';
            }

            var gameOverText = this.add.text(16, 88, gameOverMessage, {fontSize: '32px', fill: '#000'}).setScrollFactor(0);
            this.gameOverComplete = true;
            return;
        }

        this.decrementTimer();

        this.platforms.update();
        this.player.update();
        this.stars.update();

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

    collectStar(player, star) {
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

    hitBomb(player, bomb) {
        this.player.showDeathScene();
        this.gameOver = true;
    }
}

export default BootScene;
