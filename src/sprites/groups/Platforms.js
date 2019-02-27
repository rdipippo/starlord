import SpriteGroup from './SpriteGroup';

export default class Platforms extends SpriteGroup {
    constructor(scene, config) {
        super(scene);

        this.config = config;

        this.platforms = [];

        this.config.forEach((platform) => {
            let ref;

            if (platform.hasOwnProperty("movement")) {
                ref = this.createPlatform(platform.x, platform.y, platform.movement.minX, platform.movement.maxX);
            } else {
                ref = this.createPlatform(platform.x, platform.y);
            }

            this.platforms.push(ref);
        });
    }

    createPlatform(x, y, minimumX, maximumX, isVertical) {
        let platform;

        //if (isVertical) {
        //    platform = this.group.create(x, y, 'verticalPlatform');
        //} else {
            platform = this.group.create(x, y, 'ground');
        //}

        //platform.platformDirection = -1;
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.initialX = x;
        platform.initialY = y;

        if (minimumX !== undefined && maximumX !== undefined) {
            platform.minimumX = minimumX;
            platform.maximumX = maximumX;
            platform.body.setVelocityX(100);
        }

        return platform;
    }

    update() {
        this.platforms.forEach((platform) => {
            this.movePlatform(platform);
        });
    }

    movePlatform(platform) {
        if (platform.x <= platform.minimumX) {
            platform.body.setVelocityX(100);
        } else if (platform.x > platform.maximumX) {
            platform.body.setVelocityX(-100);
        }
    }

    standOnPlatform(player, platform) {
        this.scene.player.standOnPlatform(platform);
    }

    handleGround() {

    }

     handlePlayer() {
         this.scene.physics.add.collider(this.scene.player.sprite, this.group, this.standOnPlatform, null, this);
     }

     handleBullets() {

     }

     handlePlatforms() {

     }
}
