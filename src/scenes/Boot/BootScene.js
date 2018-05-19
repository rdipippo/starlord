import Phaser from 'phaser';
import Ground from './../../sprites/groups/Ground';
import Stars from './../../sprites/groups/Stars';
import Bombs from './../../sprites/groups/Bombs';
import EnemyGroup from './../../sprites/groups/EnemyGroup';
import Platforms from './../../sprites/groups/Platforms';
import StarLordScene from './../StarLordScene';
import Player from './../../sprites/Player';
import levelConfig from './../../assets/json/world1/level1.json';


// arcade physics can't handle beveled edge of platforms.
// player not tinted red on death
// if you collect a star while holding down jump, you jump again after collecting the star.
// bombs seem to be destroyed when bullets are nowhere near them.
//
// new levels
// map
class BootScene extends StarLordScene {
    constructor() {
        super();
    }

    init(data) {
        this.load.json("levelConfig", "src/assets/json/world" + data.world + "/level" + data.level + ".json");
        var dsh = true;
    }

    preload() {
        super.preload();
    }

    create() {
        super.create(1, 300);

        //this.levelConfig = this.cache.json.get('levelConfig');
        // The player and its settings
        this.player = new Player(this, levelConfig.playerStart.x, levelConfig.playerStart.y, 'dude');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = new Platforms(this, levelConfig.platforms);

        this.ground = new Ground(this);

        this.enemyGroup = new EnemyGroup(this, levelConfig.enemies);
        this.stars = new Stars(this);
        this.bombs = new Bombs(this, this.player.sprite);
        this.bullets = this.player.bullets;

        this.bombs.createBomb(levelConfig.bombs);
    }

    update() {
        super.update();

        this.platforms.update();
        this.player.update();
        this.stars.update();
    }
}

export default BootScene;
