import { h, w, getRandom } from "./utils.js";

export default class Block {
  constructor(ctx, x, width, height) {
    this.ctx = ctx;
    this.x = x;
    this.width = width;
    this.height = height;
    this.speed = 2;
    this.pass = false;
  }

  getTopY() {
    return h(0.7) - this.height;
  }

  draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.getTopY(), this.width, this.height);
  }

  update() {
    this.x -= this.speed;
    this.draw();

    if (this.x < -this.width) {
      this.x = w() + this.width;
      this.height = getRandom(20, 50);
      this.width = getRandom(10, 40);
      this.pass = false;
    }
  }

  collidesWith(ball) {
    return (
      this.x <= ball.x + ball.radius &&
      this.x + this.width > ball.x - ball.radius &&
      this.getTopY() >= ball.y - ball.dy - 1
    );
  }

  hitsBall(ball) {
    return (
      this.x <= ball.x + ball.radius &&
      this.x + this.width > ball.x - ball.radius &&
      this.getTopY() <= ball.y + ball.radius &&
      !this.pass
    );
  }
}
