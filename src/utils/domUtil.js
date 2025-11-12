import Vue from 'vue'

// 配置的系统名称

function getConfig() {
  if (Vue && Vue.ls.get('system_config')) {
    return Vue.ls.get('system_config')
  } else {
    return null
  }
}

// 设置标题title
export const setDocumentTitle = function (metaTitle, sysTitle) {
  // `${to.meta.title} - ${getSystemTitle(to.path)} - ${title}`
  // let title = ''
  // const config = getConfig()
  // if (config) {
  //   title = '-' + config.site_name
  // }else {
  //   setTimeout(() => {
  //     setDocumentTitle(metaTitle, sysTitle)
  //   }, 600)
  // }
  document.title = `${metaTitle} - ${sysTitle}`

  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}


// 设置不同平台的style
export const setSystemStyle = function (css) {
  let style = document.createElement('style')
  style.type = 'text/css'
  style.innerText = css
  document.head.appendChild(style)
}

