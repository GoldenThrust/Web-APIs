# Canvas Game Project

This project demonstrates the creation of a simple game using HTML5 Canvas and JavaScript. The game involves a ball and blocks, with a background and foreground layer for enhanced visuals.

## Table of Contents

- [Canvas Game Project](#canvas-game-project)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage](#usage)
  - [Game Mechanics](#game-mechanics)

## Features

- Responsive canvas that adjusts to the window size
- Interactive game mechanics with mouse click events
- Multiple canvas layers for background, game objects, and foreground
- Dynamic score and lives display
- Game over screen with score display
- Gradual increase in block speed over time

## Usage
1. Clone the repository:
    ```bash
    git clone https://github.com/GoldenThrust/Web-APIs.git
    cd Web-APIs/canvas-game
    ```

2. Open `index.html` in your browser to start the game.

3. Click on the canvas to make the ball bounce higher.

4. Try to avoid the blocks to keep the ball from losing lives.

## Game Mechanics

- **Ball**: The ball bounces within the canvas, and its height can be controlled by clicking the canvas.
- **Blocks**: Blocks move from right to left. If the ball hits a block, it loses a life.
- **Background**: The background layer is drawn on a separate canvas and includes the sky and ground.
- **Score and Lives**: The score increases as the ball avoids blocks. The game ends when all lives are lost.