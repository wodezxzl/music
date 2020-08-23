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
  loop: 2,
  random: 3,
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
