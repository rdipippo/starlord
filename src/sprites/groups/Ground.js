import SpriteGroup from './SpriteGroup';

export default class Ground extends SpriteGroup {
     constructor(scene, config) {
        super(scene);

        let that = this;
        config.forEach(function(groundPiece) {
            var groundSprite = that.group.create(groundPiece, 590, 'ground');
            groundSprite.body.allowGravity = false;
            groundSprite.body.immovable = true;
        });
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
