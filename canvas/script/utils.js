export function w(portion = 1) {
  return innerWidth * portion;
}

export function h(portion = 1) {
  return innerHeight * portion;
}

export function getRandom(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}


// Display game over screen
export function displayGameOver(ctx, score) {
  ctx.fillRect(w(0.1), h(0.2), w() - w(0.2), h() - h(0.4));
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.font = "bold 30px serif";
  const gameOverText = 'Game Over';
  const textMetrics = ctx.measureText(gameOverText);
  ctx.fillText(gameOverText, w(0.5) - textMetrics.width / 2, h(0.5));
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'springgreen';
  ctx.font = "15px monospace";
  const scoreMetrics = ctx.measureText(score);
  ctx.fillText(score, w(0.5) - scoreMetrics.width / 2, h(0.5) + 40);
  ctx.restore();

  // const imageData = ctx.getImageData(0, 0, w(), h());
  // const data = imageData.data;
  // console.log(data);
  
  // for (let i = 0; i < data.length; i++) {
  //   if (i) {
  //     data[i] = data[i + 5];
  //     data[i + 1] = data[i + 6];
  //     data[i + 2] = data[i + 4];
  //   }
  // }

  // ctx.putImageData(imageData, 0, 0);

  addEventListener('click', () => {
      window.location.reload();
  });
}