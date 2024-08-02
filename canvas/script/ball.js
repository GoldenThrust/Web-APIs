import { h, w } from "./utils.js";
export default class Ball {
  constructor(ctx, x, y, radius) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dy = 1;
    this.floor = h(0.7);
  }

  draw() {
    const gradient = this.ctx.createRadialGradient(
      this.x - 8,
      this.y - 17,
      this.radius * 0.1,
      this.x - 10,
      this.y - 15,
      this.radius
    );
    gradient.addColorStop(0, "rgb(130, 69, 36)");
    gradient.addColorStop(1, "rgba(35, 35, 35, 0.9)");

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y - this.radius, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  update(floor = h(0.7)) {
    this.floor = floor;
    if (this.y + this.dy >= floor) {
      this.dy = -this.dy * 0.5;
    } else {
      this.dy += 0.3;
      this.dy = this.dy > 5 ? Math.floor(this.dy) : this.dy;
    }

    this.y += this.dy;
    this.draw();
  }
}
