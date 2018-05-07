import Phaser from 'phaser';
import bombImg from './../assets/images/bomb.png';
import groundImg from './../assets/images/platform.png';
import verticalPlatformImg from './../assets/images/verticalPlatform.png';
import starImg from './../assets/images/star.png';
import skyImg from './../assets/images/sky.png';
import playerSS from './../assets/spritesheets/dude.png';
import enemySS from './../assets/spritesheets/enemy.png';

export default class StarLordScene extends Phaser.Scene {
    constructor(config = {
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
                                 }) {
        super(config);
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

    create(level, time) {
        this.level = level;
        this.time = time;
        this.score = 0;
        this.updateCount = 0;

        //  A simplhe background for our game
        for (var j=400; j<=3600; j+=800) {
            this.add.image(j, 300, 'sky');
        }

        this.physics.world.setBounds(0, 0, 3500, 650);
        this.cameras.main.setBounds(0, 0, 3200, 600);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.scoreText = this.addText(16, 16, 'Score: 0');
        this.levelText = this.addText(16, 50, 'Level: ' + level);
        this.timerText = this.addText(585, 16, 'Time: ' + time);
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
            this.player.showDeathScene();

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

    addText(x, y, text) {
        return this.add.text(x, y, text, {fontSize: '32px', fill: '#000'}).setScrollFactor(0);
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

    increaseScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
    }
}
