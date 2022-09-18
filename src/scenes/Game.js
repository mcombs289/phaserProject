import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
  }

  preload() {}
  create() {
    this.ball = this.add.circle(400, 250, 10, 0xffffff, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1, 1);

    this.ball.body.setVelocity(
      Phaser.Math.Between(-300, 300),
      Phaser.Math.Between(-200, 200)
    );

    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, 0xffffff);
    this.physics.add.existing(this.paddleLeft, true);

    this.paddleRight = this.add.rectangle(750, 250, 30, 100, 0xffffff);
    this.physics.add.existing(this.paddleRight, true);

    //create a collider
    this.physics.add.collider(this.paddleLeft, this.ball);
    this.physics.add.collider(this.paddleRight, this.ball);

    //keyboard input
    this.cursor = this.input.keyboard.createCursorKeys(); //up left right and down keys
  }

  //Us moving
  update() {
    const body = this.paddleLeft.body;

    if (this.cursor.up.isDown) {
      this.paddleLeft.y -= 10;
      body.updateFromGameObject();
    } else if (this.cursor.down.isDown) {
      this.paddleLeft.y += 10;
      body.updateFromGameObject();
    }

    const diff = this.ball.y - this.paddleRight.y;

    let aiSpeed = 3;

    if (Math.abs(diff) < 30) {
      return;
    }
    if (diff < 0) {
      this.paddleRightVelocity.y = -aiSpeed;
      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10;
      }
    } else if (diff > 0) {
      this.paddleRightVelocity.y = aiSpeed;
      if (this.paddleRightVelocity.y < 10) {
        this.paddleRightVelocity.y = 10;
      }
    }

    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }
}
