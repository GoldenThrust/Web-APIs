// If you want to Create Game for web browsers use Canvas API
const floor = 200;
let animationSpeed = 5;
const ball = document.getElementById("ball");
const block = document.getElementById("block");
const bodyWidth = document.body.getClientRects()[0].width;

const ballStyle = ball.attributeStyleMap;
const blockStyle = block.attributeStyleMap;
const ComputedBallStyle = ball.computedStyleMap();
const ComputedBlockStyle = block.computedStyleMap();

window.addEventListener("click", () => {
  // if (CSSNumericValue.parse(getComputedStyle(ball).bottom).value <= 201)
  if (ComputedBallStyle.get("bottom").value <= floor)
    ballStyle.set("bottom", CSS.px(floor + 200));
});

ball.addEventListener("transitionend", () => {
  ballStyle.set("bottom", CSS.px(floor));
});

block.addEventListener("animationiteration", () => {
  if (animationSpeed > 2) {
    animationSpeed -= 0.1;
    blockStyle.set("animation-duration", CSS.s(animationSpeed));
  }
  blockStyle.set("height", CSS.px(Math.random() * 80));
});

function check() {
  const ballX = (bodyWidth * ComputedBallStyle.get("right").value) / 100;
  const blockX = (bodyWidth * ComputedBlockStyle.get("right").value) / 100;
  const blockHeight = ComputedBlockStyle.get("height").value;

  if (
    ComputedBallStyle.get("bottom").value <=
      floor + ComputedBlockStyle.get("height").value &&
    blockX - 20 <= ballX &&
    blockX + 20 >= ballX
  ) {
    console.log("game Over: Demonstrate CSS Typed Object Model");
  }

  requestAnimationFrame(check);
}

check();
