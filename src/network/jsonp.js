import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  // 拼接前要注意是否已经有问号
  url += (url.indexOf('?') === -1 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  for (const k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 由于forin循环所以第一个&是多余的,去掉
  return url ? url.substring(1) : ''
}
