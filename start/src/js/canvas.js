import gsap from 'gsap'
import {
  createImage,
  createImageAsync,
  isOnTopOfPlatform,
  hitBottomOfPlatform,
  hitSideOfPlatform,
  objectsTouch,
  objectsSideTouch
} from './utils.js'

import platform from '../img/level1/platform.png'
import hillsClouds from '../img/level1/hillsClouds.png'
import background from '../img/level1/background.jpg'
import platformSmallTall from '../img/level1/platformSmallTall.png'
import block from '../img/level1/block.png'
import blockTri from '../img/level1/blockTri.png'
import block2 from '../img/level1/block2.png'
import block3 from '../img/level1/block3.png'
import block4 from '../img/level1/block4.png'
import block5 from '../img/level1/block5.png'
import block6 from '../img/level1/block6.png'
import mdPlatform from '../img/level1/mdPlatform.png'
import lgPlatform from '../img/level1/lgPlatform.png'
import flyingPlatform from '../img/level1/flyingPlatform.png'
import tPlatform from '../img/level1/tPlatform.png'
import xtPlatform from '../img/level1/xtPlatform.png'
import flagPoleSprite from '../img/level1/flagPole.png'

import spriteRunLeft from '../img/level1/spriteRunLeft.png'
import spriteRunRight from '../img/level1/spriteRunRight.png'
import spriteStandLeft from '../img/level1/spriteStandLeft.png'
import spriteStandRight from '../img/level1/spriteStandRight.png'
import spriteJumpRight from '../img/level1/spriteJumpRight.png'
import spriteJumpLeft from '../img/level1/spriteJumpLeft.png'
// 分数图片
import checLogo from '../img/CHEC_logo.png'
import { audio } from './audio.js'
import { images } from './images.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

let gravity = 0.78

class Player {
  constructor() {
    this.speed = 4.2
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 0
    }

    this.scale = 0.08
    this.width = 500 * this.scale
    this.height = 500 * this.scale

    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
      },
      jump: {
        right: createImage(spriteJumpRight),
        left: createImage(spriteJumpLeft),
      }
    }

    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 500
    this.invincible = false
    this.opacity = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    //c.fillStyle = 'rgba(255, 0, 0, .2)'
    //c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      500,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
    c.restore()
  }

  update() {
    this.frames++
    const { currentSprite, sprites } = this

    if (
      this.frames > 25 &&
      (currentSprite === sprites.stand.right ||
        currentSprite === sprites.stand.left)
    )
      this.frames = 0
    else if (
      this.frames > 11 &&
      (currentSprite === sprites.run.right ||
        currentSprite === sprites.run.left)
    )
      this.frames = 0
    else if (currentSprite === sprites.jump.right ||
      currentSprite === sprites.jump.left)
      this.frames = 0

    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

    if (this.invincible) {
      if (this.opacity === 1) this.opacity = 0
      else this.opacity = 1
    } else this.opacity = 1
  }
}

class Platform {
  constructor({ x, y, image, block, text }) {
    this.position = {
      x,
      y
    }

    this.velocity = {
      x: 0
    }
    this.image = image
    this.width = image.width
    this.height = image.height
    this.block = block
    this.text = text
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)

    if (this.text) {
      c.font = '20px Arial'
      c.fillStyle = 'red'
      c.fillText(this.text, this.position.x, this.position.y)
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    }

    this.velocity = {
      x: 0
    }

    this.image = image
    this.scale = 0.5
    this.width = image.width * this.scale
    this.height = image.height * this.scale
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
  }
}


let platformImage
let platformSmallTallImage
let blockTriImage
let lgPlatformImage
let tPlatformImage
let xtPlatformImage
let flyingPlatformImage
let blockImage
let block2Image
let block3Image
let block4Image
let block5Image
let block6Image

let player = new Player()
let platforms = []
let genericObjects = []
let cockroachs = []
let particles = []
let fireFlowers = []
let jumpCount = 0

let lastKey
let keys
let isJumping = 0

let scrollOffset
let flagPole
let flagPoleImage
let game
// let currentLevel = 1
// 添加一个变量来记录总游戏时间
let totalGameTime = 0;

function selectLevel(currentLevel) {
  // 如果游戏已经开始，累加上一个关卡的时间到总游戏时间
  if (isGameStarted) {
    totalGameTime += (Date.now() - levelStartTime) / 1000;
  }

  if (!audio.musicLevel1.playing()) audio.musicLevel1.play(); //检查音乐是否正在播放
  switch (currentLevel) {
    case 1:
      init();
      break;
    case 2:
      initLevel2();
      break;
    case 3:
      initLevel3();
      break;
  }
  // 重置当前关卡的时间
  gameTime = 0;

  // 在这里开始计时
  levelStartTime = Date.now();
  isGameStarted = true;

}


async function init() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  platformImage = await createImageAsync(platform)
  platformSmallTallImage = await createImageAsync(platformSmallTall)
  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  block2Image = await createImageAsync(block2)
  block3Image = await createImageAsync(block3)
  block4Image = await createImageAsync(block4)
  block5Image = await createImageAsync(block5)
  block6Image = await createImageAsync(block6)
  lgPlatformImage = await createImageAsync(lgPlatform)
  flyingPlatformImage = await createImageAsync(flyingPlatform)
  tPlatformImage = await createImageAsync(tPlatform)
  xtPlatformImage = await createImageAsync(xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  flagPole = new GenericObject({
    x: 15.5 * canvas.width,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })


  player = new Player()
  const cockcroachWidth = 43.33
  cockroachs = []
  particles = []
  platforms = [
    //1-1
    new Platform({
      x: 0.5*canvas.width + 274/2,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 0.5*canvas.width + 274/2 + tPlatformImage.width + 150,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 0.5*canvas.width + 274/2 + 2*tPlatformImage.width + 2*150,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    // 1-2
    // 第一列
    new Platform({
      x: 1.5*canvas.width + 98/2,
      y: canvas.height-lgPlatformImage.height-blockImage.height,
      image: blockImage,
      block: true
    }),
    // 第二列
    new Platform({
      x: 1.5*canvas.width + 98/2 + blockImage.width,
      y: canvas.height-lgPlatformImage.height-block2Image.height,
      image: block2Image,
      block: true
    }),
    // 第三列
    new Platform({
      x: 1.5*canvas.width + 98/2 + 2*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block3Image.height,
      image: block3Image,
      block: true
    }),
    // 第四列
    new Platform({
      x: 1.5*canvas.width + 98/2 + 3*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block4Image.height,
      image: block4Image,
      block: true
    }),
    // 第五列
    new Platform({
      x: 1.5*canvas.width + 98/2 + 4*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block5Image.height,
      image: block5Image,
      block: true
    }),
    // 第六列
    new Platform({
      x: 1.5*canvas.width + 98/2 + 5*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),
    //flyingplatform1
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 50,
      y: canvas.height-lgPlatformImage.height-3*blockImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 150,
      y: canvas.height-lgPlatformImage.height-6*blockImage.height,
      image: flyingPlatformImage,
      block: true,
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + flyingPlatformImage.width + 2*150,
      y: canvas.height-lgPlatformImage.height-6*blockImage.height,
      image: flyingPlatformImage,
      block: true
    }),
    //block6
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 2*flyingPlatformImage.width + 3*150,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),
    //flyingplatform2
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 2*flyingPlatformImage.width + 3*150 + 100,
      y: canvas.height-lgPlatformImage.height-4*blockImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 2*flyingPlatformImage.width + 4*150 + 100,
      y: canvas.height-lgPlatformImage.height-2*blockImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 2*flyingPlatformImage.width + block6Image.width + 4*150,
      y: canvas.height-lgPlatformImage.height-6*blockImage.height,
      image: flyingPlatformImage,
      block: true
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 3*flyingPlatformImage.width + block6Image.width + 5*150,
      y: canvas.height-lgPlatformImage.height-6*blockImage.height,
      image: flyingPlatformImage,
      block: true
    }),
    //block 654321
    new Platform({
      x: 1.5*canvas.width + 98/2 + 6*blockImage.width + 4*flyingPlatformImage.width + block6Image.width + 6*150,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 7*blockImage.width + 4*flyingPlatformImage.width + block6Image.width + 6*150,
      y: canvas.height-lgPlatformImage.height-block5Image.height,
      image: block5Image,
      block: true
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 8*blockImage.width + 4*flyingPlatformImage.width + block6Image.width + 6*150,
      y: canvas.height-lgPlatformImage.height-block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 9*blockImage.width + 4*flyingPlatformImage.width + block6Image.width + 6*150,
      y: canvas.height-lgPlatformImage.height-block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 10*blockImage.width + 4*flyingPlatformImage.width + block6Image.width + 6*150,
      y: canvas.height-lgPlatformImage.height-block2Image.height,
      image: block2Image,
      block: true
    }),
    new Platform({
      x: 1.5*canvas.width + 98/2 + 11*blockImage.width + 4*flyingPlatformImage.width + block6Image.width + 6*150,
      y: canvas.height-lgPlatformImage.height-blockImage.height,
      image: blockImage,
      block: true
    }),
    //1-3
    new Platform({
      x: 3.5*canvas.width + 148/2 + 200,
      y: canvas.height-lgPlatformImage.height-tPlatformImage.height,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 3.5*canvas.width + 148/2 + 200 + blockTriImage.width + 100,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 3.5*canvas.width + 148/2 + 2*200 + blockTriImage.width + tPlatformImage.width + 100,
      y: canvas.height-lgPlatformImage.height-tPlatformImage.height,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 3.5*canvas.width + 148/2 + 2*200 + 2*blockTriImage.width + tPlatformImage.width + 2*100,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    new Platform({
      x: 3.5*canvas.width + 148/2 + 3*200 + 2*blockTriImage.width + 2*tPlatformImage.width + 2*100 + 2/3*blockTriImage.width,
      y: canvas.height-lgPlatformImage.height-tPlatformImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3.5*canvas.width + 148/2 + 3*200 + 3*blockTriImage.width + 2*tPlatformImage.width + 3*100,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    //1-4
    new Platform({
      x: 5.5*canvas.width + 398/2,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 5.5*canvas.width + 398/2 + tPlatformImage.width + 150,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 5.5*canvas.width + 398/2 + tPlatformImage.width + blockImage.width +2*150,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 5.5*canvas.width + 398/2 + 2*tPlatformImage.width + blockImage.width +3*150,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 5.5*canvas.width + 398/2 + 2*tPlatformImage.width + 2*blockImage.width +4*150,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    new Platform({
      x: 5.5*canvas.width + 398/2 + 3*tPlatformImage.width + 2*blockImage.width +5*150,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 5.5*canvas.width + 398/2 + 3*tPlatformImage.width + 3*blockImage.width +6*150,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    //1-5
    new Platform({
      x: 7.5*canvas.width + 248/2,
      y: canvas.height - lgPlatformImage.height - blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 100 + blockImage.width,
      y: canvas.height - lgPlatformImage.height - block2Image.height,
      image: block2Image,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 2*100 + 2*blockImage.width,
      y: canvas.height - lgPlatformImage.height - block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 2*100 + 3*blockImage.width + 150,
      y: canvas.height - lgPlatformImage.height - block3Image.height,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 2*100 + 3*blockImage.width + 2*150 + blockTriImage.width,
      y: canvas.height - lgPlatformImage.height - block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 3*100 + 4*blockImage.width + 2*150 + blockTriImage.width,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 3*100 + 5*blockImage.width + 3*150 + blockTriImage.width,
      y: canvas.height - lgPlatformImage.height - block3Image.height,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 3*100 + 5*blockImage.width + 4*150 + 2*blockTriImage.width,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 4*100 + 6*blockImage.width + 4*150 + 2*blockTriImage.width,
      y: canvas.height - lgPlatformImage.height - block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 7.5*canvas.width + 248/2 + 5*100 + 7*blockImage.width + 4*150 + 2*blockTriImage.width,
      y: canvas.height - lgPlatformImage.height - block2Image.height,
      image: block2Image,
      block: true
    }),
    // 1-6
    new Platform({
      x: 9.5*canvas.width + 268/2,
      y: canvas.height - lgPlatformImage.height - blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + blockImage.width,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 2*blockImage.width,
      y: canvas.height - lgPlatformImage.height - blockImage.height,
      image: blockImage,
      block: true
    }),
    // flyingPlatform 123 
    new Platform({
      x: 9.5*canvas.width + 268/2 + 2*blockImage.width + 120,
      y: canvas.height - lgPlatformImage.height - block6Image.height,
      image: flyingPlatformImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 2*blockImage.width + flyingPlatformImage.width + 2*120,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: flyingPlatformImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 2*blockImage.width + 2*flyingPlatformImage.width + 3*120,
      y: canvas.height - lgPlatformImage.height - block6Image.height,
      image: flyingPlatformImage,
      block: true
    }),
    // blockTri block 1234
    new Platform({
      x: 9.5*canvas.width + 268/2 + 2*blockImage.width + 3*flyingPlatformImage.width + 4*120,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 3*blockImage.width + 3*flyingPlatformImage.width + 4*120,
      y: canvas.height - lgPlatformImage.height - blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 3*blockImage.width + 3*flyingPlatformImage.width + 5*120,
      y: canvas.height - lgPlatformImage.height - block5Image.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 4*blockImage.width + 3*flyingPlatformImage.width + 6*120,
      y: canvas.height - lgPlatformImage.height - 7*blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 5*blockImage.width + 3*flyingPlatformImage.width + 7*120,
      y: canvas.height - lgPlatformImage.height - block5Image.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 6*blockImage.width + 3*flyingPlatformImage.width + 8*120,
      y: canvas.height - lgPlatformImage.height - 7*blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 9.5*canvas.width + 268/2 + 7*blockImage.width + 3*flyingPlatformImage.width + 9*120,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: block4Image,
      block: true
    }),
    // 1-7
    new Platform({
      x: 11.5*canvas.width + 248/2,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + tPlatformImage.width + 50,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height - 150,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + tPlatformImage.width + blockImage.width + 200,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height - 150,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + tPlatformImage.width + 2*blockImage.width + 275,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height - 150,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + tPlatformImage.width + 3*blockImage.width + 400,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height - 150,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + tPlatformImage.width + 4*blockImage.width + 500,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + 2*tPlatformImage.width + 4*blockImage.width + 600,
      y: canvas.height - lgPlatformImage.height - block3Image.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + 2*tPlatformImage.width + 5*blockImage.width + 725,
      y: canvas.height - lgPlatformImage.height - block5Image.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + 2*tPlatformImage.width + 6*blockImage.width + 875,
      y: canvas.height - lgPlatformImage.height - block4Image.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + 2*tPlatformImage.width + 7*blockImage.width + 950,
      y: canvas.height - lgPlatformImage.height - 7*blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 11.5*canvas.width + 248/2 + 2*tPlatformImage.width + 8*blockImage.width + 1000,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
      block: true
    }),
    // 1-8
    // block 123456
    new Platform({
      x: 13.5*canvas.width + 448/2,
      y: canvas.height-lgPlatformImage.height-blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + blockImage.width,
      y: canvas.height-lgPlatformImage.height-block2Image.height,
      image: block2Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 2*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 3*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 4*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block5Image.height,
      image: block5Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 5*blockImage.width,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),
    // 100 block 200 block
    new Platform({
      x: 13.5*canvas.width + 448/2 + 6*blockImage.width + 130,
      y: canvas.height-lgPlatformImage.height-2*blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 7*blockImage.width + 120 + 150,
      y: canvas.height-lgPlatformImage.height-4*blockImage.height,
      image: blockImage,
      block: true
    }),
    //block 654321
    new Platform({
      x: 13.5*canvas.width + 448/2 + 8*blockImage.width + 100 + 2*150,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 9*blockImage.width + 100 + 2*150,
      y: canvas.height-lgPlatformImage.height-block5Image.height,
      image: block5Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 10*blockImage.width + 100 + 2*150,
      y: canvas.height-lgPlatformImage.height-block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 11*blockImage.width + 100 + 2*150,
      y: canvas.height-lgPlatformImage.height-block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 12*blockImage.width + 100 + 2*150,
      y: canvas.height-lgPlatformImage.height-block2Image.height,
      image: block2Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 13*blockImage.width + 100 + 2*150,
      y: canvas.height-lgPlatformImage.height-blockImage.height,
      image: blockImage,
      block: true
    }),
    // block 123456
    new Platform({
      x: 13.5*canvas.width + 448/2 + 13*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 14*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-block2Image.height,
      image: block2Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 15*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-block3Image.height,
      image: block3Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 16*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-block4Image.height,
      image: block4Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 17*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-block5Image.height,
      image: block5Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 18*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),
    new Platform({
      x: 13.5*canvas.width + 448/2 + 19*blockImage.width + 100 + 2*150 +200,
      y: canvas.height-lgPlatformImage.height-block6Image.height,
      image: block6Image,
      block: true
    }),

  ]
  genericObjects = [
    new GenericObject({
      x: -5,
      y: 0,
      image: createImage(background)
    }),
    new GenericObject({
      x: 0,
      y: 30,
      image: createImage(hillsClouds)
    })
  ]

  scrollOffset = 0

  const platformsMap = [
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {
    switch (symbol) {
      case 'lg':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - lgPlatformImage.height,
            image: lgPlatformImage,
            block: true,
            //text: platformDistance
          })
        )

        platformDistance += lgPlatformImage.width - 2

        break

      case 'gap':
        platformDistance += 175

        break

      case 't':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - tPlatformImage.height,
            image: tPlatformImage,
            block: true
          })
        )

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - xtPlatformImage.height,
            image: xtPlatformImage,
            block: true,
            text: platformDistance
          })
        )

        platformDistance += xtPlatformImage.width - 2

        break
    }
  })
}

async function initLevel2() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  platformImage = await createImageAsync(platform)
  platformSmallTallImage = await createImageAsync(platformSmallTall)
  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  block2Image = await createImageAsync(block2)
  block3Image = await createImageAsync(block3)
  block4Image = await createImageAsync(block4)
  block5Image = await createImageAsync(block5)
  block6Image = await createImageAsync(block6)
  lgPlatformImage = await createImageAsync(lgPlatform)
  flyingPlatformImage = await createImageAsync(flyingPlatform)
  tPlatformImage = await createImageAsync(tPlatform)
  xtPlatformImage = await createImageAsync(xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  flagPole = new GenericObject({
    x: 15.5 * canvas.width,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })


  /* fireFlowers = [
    new FireFlower({
      position: {
        x: 400,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ] */

  player = new Player()
  const cockcroachWidth = 43.33
  cockroachs = []
  particles = []
  platforms = [


  ]
  genericObjects = [
    new GenericObject({
      x: 0,
      y: 0,
      image: createImage(background)
    }),
    new GenericObject({
      x: 0,
      y: 30,
      image: createImage(hillsClouds)
    })
  ]

  scrollOffset = 0

  const platformsMap = [
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {
    switch (symbol) {
      case 'lg':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - lgPlatformImage.height,
            image: lgPlatformImage,
            block: true,
            text: platformDistance
          })
        )

        platformDistance += lgPlatformImage.width - 2

        break

      case 'gap':
        platformDistance += 175

        break

      case 't':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - tPlatformImage.height,
            image: tPlatformImage,
            block: true
          })
        )

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - xtPlatformImage.height,
            image: xtPlatformImage,
            block: true,
            text: platformDistance
          })
        )

        platformDistance += xtPlatformImage.width - 2

        break
    }
  })
}

async function initLevel3() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  platformImage = await createImageAsync(platform)
  platformSmallTallImage = await createImageAsync(platformSmallTall)
  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  block2Image = await createImageAsync(block2)
  block3Image = await createImageAsync(block3)
  block4Image = await createImageAsync(block4)
  block5Image = await createImageAsync(block5)
  block6Image = await createImageAsync(block6)
  lgPlatformImage = await createImageAsync(lgPlatform)
  flyingPlatformImage = await createImageAsync(flyingPlatform)
  tPlatformImage = await createImageAsync(tPlatform)
  xtPlatformImage = await createImageAsync(xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  flagPole = new GenericObject({
    x: 15.5 * canvas.width,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })


  /* fireFlowers = [
    new FireFlower({
      position: {
        x: 400,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ] */

  player = new Player()
  const cockcroachWidth = 43.33
  cockroachs = []
  particles = []
  platforms = [


  ]
  genericObjects = [
    new GenericObject({
      x: 0,
      y: 0,
      image: createImage(background)
    }),
    new GenericObject({
      x: 0,
      y: 30,
      image: createImage(hillsClouds)
    })
  ]

  scrollOffset = 0

  const platformsMap = [
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {
    switch (symbol) {
      case 'lg':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - lgPlatformImage.height,
            image: lgPlatformImage,
            block: true,
            text: platformDistance
          })
        )

        platformDistance += lgPlatformImage.width - 2

        break

      case 'gap':
        platformDistance += 175

        break

      case 't':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - tPlatformImage.height,
            image: tPlatformImage,
            block: true
          })
        )

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(
          new Platform({
            x: platformDistance,
            y: canvas.height - xtPlatformImage.height,
            image: xtPlatformImage,
            block: true,
            text: platformDistance
          })
        )

        platformDistance += xtPlatformImage.width - 2

        break
    }
  })
}



// 在顶部添加变量和常数
let gameTime = 0;
let levelStartTime = 0;
const numLevels = 1;
let currentLevel = 1;
// let totalGameTime = 0;
let isGameStarted = false;

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  genericObjects.forEach((genericObject) => {
    genericObject.update();
    genericObject.velocity.x = 0;
  });

  platforms.forEach((platform) => {
    platform.update();
    platform.velocity.x = 0;
  });
  if (currentLevel > numLevels) {
    //  所有关卡完成后，调用显示游戏结果的功能
    displayGameResult(totalGameTime);
    return;
  }
  // 更新游戏时间
  if (isGameStarted) {
    gameTime = (Date.now() - levelStartTime) / 1000;
  }
// 仅在游戏未结束时渲染 flagPoleImage
if (flagPole) {
  flagPole.update();
  flagPole.velocity.x = 0;
}
  // 绘制计时器
  c.fillStyle = 'black';
  c.font = '40px Arial';
  c.fillText(`TIME: ${Math.floor(gameTime / 60)}m ${Math.floor(gameTime % 60)}s`, canvas.width - 260, 60);


  //displayGameResult(totalGameTime, c, canvas);


  if (flagPole) {
    flagPole.update();
    flagPole.velocity.x = 0;

    // panda touches flagpole
    // win condition
    // complete level
    if (
      !game.disableUserInput &&
      objectsSideTouch({
        object1: player,
        object2: flagPole
      })
    ) {
      audio.completeLevel.play();
      audio.musicLevel1.stop();
      game.disableUserInput = true;
      player.velocity.x = 0;
      player.velocity.y = 0;
      gravity = 0;

      player.currentSprite = player.sprites.stand.right;

      gsap.to(player.position, {
        y: canvas.height - lgPlatformImage.height - player.height,
        duration: 1,
        onComplete() {
          player.currentSprite = player.sprites.run.right;
        }
      });

      // 停止计时
      isGameStarted = false;

      // 记录本关卡时间
      const levelTime = gameTime;
      totalGameTime += levelTime;
      // flagpole slide
      setTimeout(() => {
        audio.descend.play()
      }, 200)
      gsap.to(player.position, {
        delay: 1,
        x: canvas.width,
        duration: 2,
        ease: 'power1.in'
      })

      // 切换到下一关卡或结束游戏
      setTimeout(() => {
        currentLevel++;
        gravity = 0.78;

        if (currentLevel <= numLevels) {
          // 重置时间并开始计时
          gameTime = 0;
          levelStartTime = Date.now();
          selectLevel(currentLevel);
        } else {
          // 游戏结束，显示成绩

          displayGameResult(totalGameTime, c, canvas);
        }
      }, 8000);
    }
  }

  player.update()

  if (game.disableUserInput) return

  // scrolling code starts
  let hitSide = false

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0

    // scrolling code
    if (keys.right.pressed) {
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        platform.velocity.x = -player.speed

        if (
          platform.block &&
          hitSideOfPlatform({
            object: player,
            platform
          })
        ) {
          platforms.forEach((platform) => {
            platform.velocity.x = 0
          })
          hitSide = true
          break
        }
      }

      if (!hitSide) {
        scrollOffset += player.speed

        flagPole.velocity.x = -player.speed

        genericObjects.forEach((genericObject) => {
          genericObject.velocity.x = -player.speed * 0.66
        })

        cockroachs.forEach((cockroach) => {
          cockroach.position.x -= player.speed
        })

        fireFlowers.forEach((fireFlower) => {
          fireFlower.position.x -= player.speed
        })

        particles.forEach((particle) => {
          particle.position.x -= player.speed
        })
      }
    } else if (keys.left.pressed && scrollOffset > 0) {
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        platform.velocity.x = player.speed

        if (
          platform.block &&
          hitSideOfPlatform({
            object: player,
            platform
          })
        ) {
          platforms.forEach((platform) => {
            platform.velocity.x = 0
          })
          hitSide = true
          break
        }
      }

      if (!hitSide) {
        scrollOffset -= player.speed

        flagPole.velocity.x = player.speed

        genericObjects.forEach((genericObject) => {
          genericObject.velocity.x = player.speed * 0.66
        })

        cockroachs.forEach((cockroach) => {
          cockroach.position.x += player.speed
        })

        fireFlowers.forEach((fireFlower) => {
          fireFlower.position.x += player.speed
        })

        particles.forEach((particle) => {
          particle.position.x += player.speed
        })
      }
    }
  }

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      isOnTopOfPlatform({
        object: player,
        platform
      })
    ) {
      player.velocity.y = 0
      jumpCount = 0
    }

    if (
      platform.block &&
      hitBottomOfPlatform({
        object: player,
        platform
      })
    ) {
      player.velocity.y = -player.velocity.y
    }

    if (
      platform.block &&
      hitSideOfPlatform({
        object: player,
        platform
      })
    ) {
      player.velocity.x = 0
    }
  })


  // lose condition
  if (player.position.y > canvas.height) {
    audio.die.play()
    init()
  }

  // sprite switching
  if (player.velocity.y !== 0) return

  if (
    keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.currentSprite = player.sprites.run.right
  } else if (
    keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left
  } else if (
    !keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left
  } else if (
    !keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right
  }


}

// 清除画布函数
function clearCanvas(canvas) {
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
}

// 添加一个函数来显示游戏成绩
function displayGameResult(totalGameTime) {
  const minutes = Math.floor(totalGameTime / 60);
  const seconds = Math.floor(totalGameTime % 60);

  const canvas = document.querySelector('canvas');

  // 清除画布上的所有内容
  clearCanvas(canvas);

  const c = canvas.getContext('2d');

  // 添加画布背景
  c.fillStyle = 'rgba(0, 0, 0, 0.7)'; // 背景颜色为黑色，透明度为0.7
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = 'white'; // 文本颜色为白色
  c.font = '50px Impact';

  // 游戏结束标题
  //c.fillText('Game Over !', canvas.width / 2 - 120, canvas.height / 2 - 140);

  // 成绩信息
  c.font = '40px Impact';
  c.fillText(`Your time is :`, canvas.width / 2 - 110, canvas.height / 2 - 90);

  c.font = '40px Impact';
  c.fillStyle = 'red'; // 设置成绩的颜色为红色
  c.fillText(`${minutes} min ${seconds} sec`, canvas.width / 2 - 100, canvas.height / 2 - 30);

  // 附加描述
  c.font = '40px Impact';
  c.fillStyle = 'yellow'; // 恢复文本颜色为白色
  c.fillText('You are better than 70% of players !', canvas.width / 2 - 280, canvas.height / 2 + 50);
  c.fillText('あなたはプレイヤーの70%よりも優れています', canvas.width / 2 - 400, canvas.height / 2 + 100);
  //c.fillText('看看你是否能刷新纪录！', canvas.width / 2 - 100, canvas.height / 2 + 130);
}


selectLevel(1)
animate()

addEventListener('keydown', ({ keyCode }) => {
  console.log(keyCode)
  if (game.disableUserInput) return
  switch (keyCode) {
    case 37:
      keys.left.pressed = true
      lastKey = 'left'
      break

    case 39:
      keys.right.pressed = true
      lastKey = 'right'

      break

    case 32:
      if (isJumping === 0) {
        if (jumpCount === 0) {
          player.velocity.y -= 15
          audio.jump.play()
          if (lastKey === 'right') player.currentSprite = player.sprites.jump.right
          else if (lastKey === 'left') player.currentSprite = player.sprites.jump.left
          jumpCount++
        }
        isJumping = 1
      }

      break
  }
})

addEventListener('keyup', ({ keyCode }) => {
  if (game.disableUserInput) return
  switch (keyCode) {
    case 37:
      keys.left.pressed = false
      break

    case 39:
      keys.right.pressed = false

      break

    case 32:
      isJumping = 0
      break
  }
})