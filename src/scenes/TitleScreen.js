import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
  preload() {}
  create() {
    text.setOrigin(0.5, 0.5);
    console.log(this);
  }
}
