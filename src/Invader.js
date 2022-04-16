class Invader {
  pattern = [[0, 0], [0, 1], [0, 2], [1, 1], [2, 0], [2, 2]];
  positionX = 11;
  positionY = 0;

  moveInvader() {
    this.positionY += 1;
  }
}

export default Invader;
