class Bullet {
  positionX = 0;
  positionY = 27;

  move() {
    this.positionY -= 1;
  }
}

export default Bullet;