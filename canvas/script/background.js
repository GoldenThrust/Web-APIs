import { w, h } from "./utils.js";

export default class Background {
    constructor(ctx) {
        this.ctx = ctx;
    }

    storm() {
        this.ctx.beginPath();
        // this.ctx.arc(0, );
        this.ctx.fill();
    }

    drawSky() {
        const gradient = this.ctx.createLinearGradient(w(0.5), h(0), w(0.5), h());
        gradient.addColorStop(0, "rgb(213, 75, 11)");
        gradient.addColorStop(1, " rgb(255, 234, 0)");
    
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, h(0), w(), h(0.7));
        this.storm();
    }

    drawGround() {
        this.drawSky();
        const gradient = this.ctx.createLinearGradient(w(0), h(0.5), w(), h(0.5));
        gradient.addColorStop(0, "rgb(41, 32, 32)");
        gradient.addColorStop(0.5, "rgb(43, 27, 26)");
        gradient.addColorStop(1, "rgb(11, 9, 5)");
    
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, h(0.7), w(), h(0.3));
    }
}