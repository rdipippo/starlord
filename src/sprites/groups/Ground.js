import SpriteGroup from './SpriteGroup';

export default class Ground extends SpriteGroup {
    constructor(scene) {
        super(scene);

        for (var i = 200; i <= 3600; i += 300) {
            var groundSprite = this.group.create(i, 568, 'ground');
            groundSprite.body.allowGravity = false;
            groundSprite.body.immovable = true;
        }
    }

     handleGround() {

     }

     handlePlayer() {
         this.scene.physics.add.collider(this.scene.player.sprite, this.group, this.scene.player.hitGround, null, this.scene.player);
     }

     handleBullets() {

     }

     handlePlatforms() {

     }
}
