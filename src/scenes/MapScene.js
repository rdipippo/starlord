import Phaser from 'phaser';
import starImg from './../assets/images/star.png';
import playerSS from './../assets/spritesheets/dude.png';
import starLordScene from './StarLordScene';
import mapConfig from './../assets/json/world1/world1Map.json';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super({key: 'Map',
               type: Phaser.CANVAS,
               width: 800,
               height: 600});
    }

    preload() {
        this.load.image('star', starImg);
        this.load.spritesheet('dude', playerSS, {frameWidth: 32, frameHeight: 48});
        this.cache.json.add('World1Map', mapConfig);
    }

    create() {
        this.config = this.cache.json.get('World1Map');

        let graphics = this.add.graphics(0, 0);
        graphics.lineStyle(2, 0x0000FF, 1);

        this.config.levels.forEach((level) => {
            let pathRect = level.pathLocation;
            graphics.fillRect(pathRect.x, pathRect.y, pathRect.width, pathRect.height);
            this.add.image(level.mapPosition.x, level.mapPosition.y, 'star');

            if (level.index == 1) {
                this.player = this.add.sprite(level.mapPosition.x, level.mapPosition.y, 'dude');
            }
        });

        this.startLevelKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.startLevelKey.isDown) {
            this.config.levels.forEach((level) => {
                if (level.mapPosition.x == this.player.x && level.mapPosition.y == this.player.y) {
                    this.scene.start(level.sceneKey, {world: 1, level: level.index});
                    this.scene.stop('Map');
                }
            });
        }
    }
}
