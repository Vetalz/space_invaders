import Player from "./Player";
import Bullet from "./Bullet";
import Invader from "./Invader";
import invader from "./Invader";

class Game {
  SIZE_FIELD_X = 59;
  SIZE_FIELD_Y = 30;
  PATTERN_WIN = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 1], [0, 2], [1, 2],
    [2, 2], [3, 2], [4, 2], [5, 2], [6, 3], [0, 4], [1, 4], [2, 4], [3, 4],
    [4, 4], [5, 4], [0, 6], [6, 6], [0, 7], [6, 7], [0, 8], [1, 8], [2, 8],
    [3, 8], [4, 8], [5, 8], [6, 8], [0, 9], [6, 9], [0, 10], [6, 10],
    [0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [5, 12], [6, 12], [2, 13],
    [3, 14], [4, 15], [0, 16], [1, 16], [2, 16], [3, 16], [4, 16], [5, 16],
    [6, 16], [0, 18], [1, 18], [2, 18], [3, 18], [4, 18], [6, 18], [0, 20],
    [1, 20], [2, 20], [3, 20], [4, 20], [6, 20], [0, 22], [1, 22], [2, 22],
    [3, 22], [4, 22], [6, 22]
  ]
  PATTERN_LOSE = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [6, 1], [6, 2],
    [6, 3], [6, 4], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [0, 7], [6, 7],
    [0, 8], [6, 8], [0, 9], [6, 9], [1, 10], [2, 10], [3, 10], [4, 10],
    [5, 10], [1, 12], [2, 12], [3, 12], [6, 12], [0, 13], [3, 13], [6, 13],
    [0, 14], [3, 14], [6, 14], [0, 15], [3, 15], [6, 15], [0, 16], [3, 16],
    [4, 16], [5, 16], [6, 16], [0,18], [1, 18], [2, 18], [3, 18], [4, 18],
    [5, 18], [6, 18], [0, 19], [3, 19], [6, 19], [0,20], [3, 20], [6, 20],
    [0, 21], [3, 21], [6, 21], [0, 22], [3, 22], [6, 22]
  ]

  isEnd = false;
  rows = [];
  player = null;
  invaders = [];
  bullets = [];
  startPositionInvaders = [2, 8, 14, 20, 26, 32, 38, 44, 50, 56];
  deleteInvaderIndex = null;

  constructor() {
    this.createField();
    this.player = new Player();
    this.player.positionX = Math.floor(this.SIZE_FIELD_X / 2) - 1;

    this.renderPlayer();
    this.createInvaders();
    this.addEvents();
    this.gameLoop();
  }

  gameLoop () {
    const invaderSpeed = setInterval(() => {
      this.updateInvader();
    }, 600);

    const bulletSpeed = setInterval(() => {
      this.updateBullet();
      this.checkResult();
      if (this.isEnd) {
        clearInterval(invaderSpeed);
        clearInterval(bulletSpeed);
      }
    }, 100);
  }

  createField() {
    const body = document.querySelector('body');
    const field = document.createElement('div');
    field.classList.add('field');

    for (let x = 0; x < this.SIZE_FIELD_Y; x++) {
      const row = document.createElement('div');
      row.classList.add('row');
      for (let i = 0; i<this.SIZE_FIELD_X; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        row.appendChild(cell);
      }
      this.rows.push(row);
    }

    for (let row of this.rows) {
      field.appendChild(row);
    }

    body.appendChild(field);
  }

  createInvaders() {
    for (let i = 0; i < this.startPositionInvaders.length; i++) {
      const invader = new Invader();
      invader.positionX = this.startPositionInvaders[i];
      this.invaders.push(invader);
    }

    for (const invader of this.invaders) {
      this.renderInvader(invader);
    }
  }

  renderPlayer() {
    for (const i of this.player.pattern) {
      let cell = this.rows[i[0]].querySelector(`div:nth-child(${this.player.positionX + i[1]})`);
      cell.classList.toggle('player');
    }
  }

  renderBullet(bullet, index= 0) {
    if (this.rows[bullet.positionY] === this.rows[0]) {
      this.outOfScreen(this.bullets, index);
      return null;
    }
    let cell = this.rows[bullet.positionY].querySelector(`div:nth-child(${bullet.positionX})`);
    cell.classList.toggle('bullet');

    if (cell.classList.contains('invader')) {
      cell.classList.remove('bullet');
      cell.classList.add('hit');
      this.outOfScreen(this.bullets, index);
      return null;
    }
    return true;
  }

  updateBullet() {
    if (this.isEnd) {
      return null;
    }

    for (let i = 0; i < this.bullets.length; i++) {
      if (this.renderBullet(this.bullets[i], i)) {
        this.bullets[i].move();
        this.renderBullet(this.bullets[i], i)
      }
    }
  }

  renderInvader(invader, index) {
    if (this.rows[invader.positionY] === this.rows[this.rows.length - 4]) {
      this.isEnd = true;
    }

    for (const i of invader.pattern) {
      let cell = this.rows[invader.positionY + i[0]].querySelector(`div:nth-child(${invader.positionX + i[1]})`);
      cell.classList.toggle('invader');
      if (cell.classList.contains('hit')) {
        this.invaderOut(invader, index);
        return null;
      }
    }
    return true;
  }

  updateInvader() {
    if (this.isEnd) {
      return null;
    }

    if (this.deleteInvaderIndex !== null) {
      this.invaders.splice(this.deleteInvaderIndex, 1);
      this.deleteInvaderIndex = null;
    }

    for (let i = 0; i < this.invaders.length; i++) {
      if (this.renderInvader(this.invaders[i], i)) {
        this.invaders[i].move();
        this.renderInvader(this.invaders[i], i);
      }
    }
  }


  addEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') {
        if (this.isEnd) {
          return null;
        }

        if (this.player.positionX > 1) {
          this.renderPlayer();
          this.player.move(e.code);
          this.renderPlayer();
        }
      }

      if (e.code === 'ArrowRight') {
        if (this.isEnd) {
          return null;
        }

        if (this.player.positionX < this.SIZE_FIELD_X - 2) {
          this.renderPlayer();
          this.player.move(e.code);
          this.renderPlayer();
        }
      }

      if (e.code === 'Space') {
        if (this.isEnd) {
          return null;
        }

        let bullet = new Bullet();
        bullet.positionX = this.player.positionX + 1;
        this.renderBullet(bullet);
        this.bullets.push(bullet);
      }
    })
  }

  outOfScreen(bullet, index) {
    bullet.splice(index, 1);
  }

  invaderOut(invader, index) {
    for (const i of invader.pattern) {
      let cell = this.rows[invader.positionY + i[0]].querySelector(`div:nth-child(${invader.positionX + i[1]})`);
      cell.classList.remove('invader');
    }
    this.deleteInvaderIndex = index;
  }

  checkResult() {
    if (this.invaders.length === 0) {
      this.renderResult(this.PATTERN_WIN);
      this.isEnd = true;
      return null;
    }

    if (this.isEnd) {
      this.renderResult(this.PATTERN_LOSE);
      return null;
    }
  }

  renderResult(pattern) {
    for (const i of pattern) {
      let cell = this.rows[11 + i[0]].querySelector(`div:nth-child(${19 + i[1]})`);
      cell.classList.toggle('result');
    }
  }
}

export default Game;