class Player {
  pattern = [[28, 1], [29, 0], [29, 1], [29, 2]];
  positionX = 0;

  move(direction) {
    if (direction === 'ArrowLeft') {
      this.positionX -= 1
    }
    if (direction === 'ArrowRight') {
      this.positionX += 1
    }
  }

}

export default Player;