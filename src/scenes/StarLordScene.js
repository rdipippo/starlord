import Phaser from 'phaser';
import Ground from './../sprites/groups/Ground';
import Stars from './../sprites/groups/Stars';
import Bombs from './../sprites/groups/Bombs';
import EnemyGroup from './../sprites/groups/EnemyGroup';
import Platforms from './../sprites/groups/Platforms';
import Player from './../sprites/Player';
import bombImg from './../assets/images/bomb.png';
import groundImg from './../assets/images/platform.png';
import verticalPlatformImg from './../assets/images/verticalPlatform.png';
import starImg from './../assets/images/star.png';
import skyImg from './../assets/images/sky.png';
import playerSS from './../assets/spritesheets/dude.png';
import enemySS from './../assets/spritesheets/enemy.png';

// arcade physics can't handle beveled edge of platforms.
// player not tinted red on death
// if you collect a star while holding down jump, you jump again after collecting the star.
// bombs seem to be destroyed when bullets are nowhere near them.
//
// new levels
// map
export default class StarLordScene extends Phaser.Scene {
    constructor(config = {
                     key: 'StarLordScene',
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

    init(data) {
        this.world = data.world;
        this.level = data.level;
        this.jsonFile = "src/assets/json/world" + this.world + "/level" + this.level + ".json";
    }

    preload() {
        this.load.image('sky', skyImg);
        this.load.image('ground', groundImg);
        this.load.image('star', starImg);
        this.load.image('bomb', bombImg);
        this.load.image('verticalPlatform', verticalPlatformImg);
        this.load.spritesheet('dude', playerSS, {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('enemy', enemySS, {frameWidth: 34, frameHeight: 40});
        this.load.json("levelConfig", this.jsonFile);
    }

    create() {
        this.levelConfig = this.cache.json.get('levelConfig');

        this.level = this.levelConfig.level;
        this.time = this.levelConfig.time;
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
        this.levelText = this.addText(16, 50, 'Level: ' + this.level);
        this.timerText = this.addText(585, 16, 'Time: ' + this.time);

        //this.levelConfig = this.cache.json.get('levelConfig');
        // The player and its settings
        this.player = new Player(this, this.levelConfig.playerStart.x, this.levelConfig.playerStart.y, 'dude');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = new Platforms(this, this.levelConfig.platforms);

        this.ground = new Ground(this);

        this.enemyGroup = new EnemyGroup(this, this.levelConfig.enemies);
        this.stars = new Stars(this);
        this.bombs = new Bombs(this, this.player.sprite);
        this.bullets = this.player.bullets;

        this.bombs.createBomb(this.levelConfig.bombs);
    }

    update() {
        if (this.gameOverComplete) {
            return;
        }

        if (this.player.getPosition().x > 3200) {
            this.addText(550, 50, 'LEVEL COMPLETE');
            var that = this;
            var id = window.setInterval(function() {
                if (that.time <= 0) {
                    window.clearInterval(id);
                    that.physics.pause();
                    var nextId = window.setTimeout(function() {
                        that.scene.stop('StarLordScene')
                        that.scene.start('Map', { worldNum: this.world });
                    }, 1000);
                } else {
                    that.increaseScore(10);
                    that.timerText.setText('Time: ' + --that.time);
                }
            }, 100);

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

        this.platforms.update();
        this.player.update();
        this.stars.update();
    }

    addText(x, y, text) {
        return this.add.text(x, y, text, {fontSize: '24px', fill: '#000'}).setScrollFactor(0);
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
