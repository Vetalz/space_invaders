class Bullet {
  positionX = 0;
  positionY = 27;

  moveBullet() {
    this.positionY -= 1;
  }
}

export default Bullet;