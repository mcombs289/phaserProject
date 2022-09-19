import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

    //change the text
    this.leftScore = 0;
    this.rightScore = 0;
  }

  create() {
    this.physics.world.setBounds(-100, 0, 1000, 500);

    //creating the ball
    this.ball = this.add.circle(400, 250, 10, 0xffffff, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1, 1);

    this.resetBall();

    this.redZone = this.add.rectangle(0, 0, 40, 1000, 0xff0000);
    this.redZone = this.add.rectangle(800, 0, 40, 1000, 0xff0000);

    //creating the paddles
    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, 0xffffff);
    this.physics.add.existing(this.paddleLeft, true);

    this.paddleRight = this.add.rectangle(750, 250, 30, 100, 0xffffff);
    this.physics.add.existing(this.paddleRight, true);

    //create a collider
    this.physics.add.collider(this.paddleLeft, this.ball);
    this.physics.add.collider(this.paddleRight, this.ball);

    const scoreStyle = {
      fontSize: 32,
    };

    //create score text
    this.leftScoreLable = this.add
      .text(380, 50, "0", scoreStyle)
      .setOrigin(0.5, 0.5);
    this.centerDivider = this.add
      .text(400, 50, ":", scoreStyle)
      .setOrigin(0.5, 0.5);
    this.rightScorLable = this.add
      .text(420, 50, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    //keyboard input
    this.cursor = this.input.keyboard.createCursorKeys(); //up left right and down keys
  }

  update() {
    const body = this.paddleLeft.body;

    //using keyboard to move paddle
    if (this.cursor.up.isDown) {
      this.paddleLeft.y -= 10;
      body.updateFromGameObject();
    } else if (this.cursor.down.isDown) {
      this.paddleLeft.y += 10;
      body.updateFromGameObject();
    }

    //determine how the AI paddle moves
    const diff = this.ball.y - this.paddleRight.y;

    let aiSpeed = 3;

    if (Math.abs(diff) < 20) {
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

    //scored on left side
    if (this.ball.x < -30) {
      this.resetBall();
      this.incrementLeftScore();
    }
    //scored on right side
    if (this.ball.x > 830) {
      this.resetBall();
      this.incrementRightScore();
    }
  }

  //update scores
  incrementRightScore() {
    this.leftScore += 1;
    this.leftScoreLable.text = this.leftScore;
  }

  //update scores
  incrementLeftScore() {
    this.rightScore += 1;
    this.rightScorLable.text = this.rightScore;
  }

  //reset ball
  resetBall() {
    this.ball.setPosition(400, 200);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 400);

    this.ball.body.setVelocity(vec.x, vec.y);
  }
}
