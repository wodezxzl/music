// 1.防抖函数
export function debounce(fn, delay = 200, callback) {
  let timer = null
  return function(...args) {
    if (timer) clearInterval(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      if (callback) callback()
    }, delay)
  }
}

// 2.获取或者设置dom中的自定义属性
export function getDOMData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 3.播放模式
export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2,
}

// 4.格式化时间戳
export function formatTime(time) {
  // 向下取整
  time = time | 0
  let minute = '0' + ((time / 60) | 0)
  let second = time % 60 | 0
  if (second < 10) {
    second = '0' + second
  }
  return `${minute}:${second}`
}

// 获取随机数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 5.洗牌函数
export function shuffle(arr) {
  // 创建一个副本,不影响原数组
  let _arr = arr.slice()
  // 从0到当前序号获取一个随机下标,交换该下标和当前i对应值
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
