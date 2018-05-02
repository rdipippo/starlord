import Phaser from 'phaser';
import bombImg from './../assets/images/bomb.png';
import groundImg from './../assets/images/platform.png';
import verticalPlatformImg from './../assets/images/verticalPlatform.png';
import starImg from './../assets/images/star.png';
import skyImg from './../assets/images/sky.png';
import playerSS from './../assets/spritesheets/dude.png';
import enemySS from './../assets/spritesheets/enemy.png';

export default class StarLordScene extends Phaser.Scene {
    constructor(config) {
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
}
