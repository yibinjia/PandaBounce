function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

export function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

export function createImageAsync(imageSrc) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.src = imageSrc
  })
}

//检查object是否位于platform的顶部,并返回布尔值。
export function isOnTopOfPlatform({ object, platform }) {
  return (
    object.position.y + object.height <= platform.position.y &&
    object.position.y + object.height + object.velocity.y >=
      platform.position.y &&
    object.position.x + object.width - 5 >= platform.position.x &&
    object.position.x + 5 <= platform.position.x + platform.width    //是为了防止出现漂浮情况
  )
}

//object1下降并接触到object2时，发生了顶部碰撞
export function collisionTop({ object1, object2 }) {
  return (
    object1.position.y + object1.height <= object2.position.y &&
    object1.position.y + object1.height + object1.velocity.y >=
      object2.position.y &&
    object1.position.x + object1.width >= object2.position.x &&
    object1.position.x <= object2.position.x + object2.width
  )
}


//对象是否击中了平台的底部，并返回布尔值
export function hitBottomOfPlatform({ object, platform }) {
  return (
    object.position.y <= platform.position.y + platform.height &&
    object.position.y - object.velocity.y >=
      platform.position.y + platform.height &&
    object.position.x + object.width >= platform.position.x &&
    object.position.x <= platform.position.x + platform.width
  )
}

//对象是否击中了平台的侧边，并返回布尔值
export function hitSideOfPlatform({ object, platform }) {
  return (
    object.position.x +
      object.width +
      object.velocity.x -
      platform.velocity.x - 5 >=
      platform.position.x &&
    object.position.x + object.velocity.x + 5 <=        //试图解决掉下去了动不了的bug: ok
      platform.position.x + platform.width &&
    object.position.y <= platform.position.y + platform.height &&
    object.position.y + object.height >= platform.position.y
  )
}

// 两个矩形对象是否发生了碰撞，并返回布尔值
export function objectsTouch({ object1, object2 }) {
  return (
    object1.position.x + object1.width >= object2.position.x &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height
  )
}

// object1的右边是否与object2的左边发生了接触，并返回布尔值
export function objectsSideTouch({ object1, object2 }) {
  return (
    object1.position.x + object1.width >= object2.position.x
  )
}