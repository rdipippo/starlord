import Phaser from 'phaser';
import Ground from './../../sprites/groups/Ground';
import Stars from './../../sprites/groups/Stars';
import Bombs from './../../sprites/groups/Bombs';
import EnemyGroup from './../../sprites/groups/EnemyGroup';
import Platforms from './../../sprites/groups/Platforms';
import StarLordScene from './../StarLordScene';
import Player from './../../sprites/Player';

// stars don't fall when level increments.
// arcade physics can't handle beveled edge of platforms.
// player not tinted red on death
//
// new levels
class BootScene extends StarLordScene {
    constructor() {
        super();
    }

    preload() {
        super.preload();
    }

    create() {
        super.create(5, 300);

        // The player and its settings
        this.player = new Player(this, 400, 450, 'dude');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = new Platforms(this);

        this.ground = new Ground(this);

        this.enemyGroup = new EnemyGroup(this);
        this.stars = new Stars(this);
        this.bombs = new Bombs(this, this.player.sprite);
        this.bullets = this.player.bullets;

        this.bombs.createBomb();
    }

    update() {
        super.update();

        this.platforms.update();
        this.player.update();
        this.stars.update();
    }
}

export default BootScene;
