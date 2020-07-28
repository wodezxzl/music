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
