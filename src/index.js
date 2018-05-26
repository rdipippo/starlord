import Phaser from 'phaser';
import MapScene from './scenes/MapScene';
import StarLordScene from './scenes/StarLordScene';
import level1Config from './assets/json/world1/level1.json';

const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    title: 'Game',
    url: 'http://yourgame.com',
    banner: {
        hidePhaser: true
    },
    scene: [MapScene, StarLordScene]
};

class AppGame extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}

let game = new AppGame(config);
game.scene.start('Map', { worldNum: 1 });
