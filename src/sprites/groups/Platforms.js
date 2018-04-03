export default class Platforms {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group();

        //  Now let's create some ledges
        this.platform1 = this.createPlatform(600, 400, 300, 500, -1);
        this.platform2 = this.createPlatform(50, 250, 50, 350, -1);
        this.platform3 = this.createPlatform(750, 220, 550, 750, -1);
    }

    createPlatform(x, y, minimumX, maximumX) {
        var platform = this.group.create(x, y, 'ground');
        //platform.platformDirection = -1;
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.initialX = x;
        platform.initialY = y;
        platform.minimumX = minimumX;
        platform.maximumX = maximumX;
        platform.body.setVelocityX(100);

        return platform;
    }

    update() {
        if (this.scene.level > 1) {
            this.movePlatform(this.platform1);
        }

        if (this.scene.level > 2) {
            this.movePlatform(this.platform2);
        }

        if (this.scene.level > 3) {
            this.movePlatform(this.platform3);
        }
    }

    movePlatform(platform) {
        if (platform.x <= platform.minimumX) {
            platform.body.setVelocityX(100);
        } else if (platform.x > platform.maximumX) {
            platform.body.setVelocityX(-100);
        }

        /*platform.x += 1 * platform.platformDirection;
        platform;*/
    }
}
