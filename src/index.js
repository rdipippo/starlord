import Phaser from 'phaser';
import BootScene from './scenes/Boot/BootScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    title: 'Game',
    url: 'http://yourgame.com',
    banner: {
        hidePhaser: true
    },
    scene: [BootScene]
};

class AppGame extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}

let game = new AppGame(config);
