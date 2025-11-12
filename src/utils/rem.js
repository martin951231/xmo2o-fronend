var rem = {}
 rem.getrem = () => {
   var pixelRatio = 1 / window.devicePixelRatio // 还原设备的真实分辨率；
   // devicePixelRatio设备的像素比
   document.write('<meta name="viewport" content="width=device-width,initial-scale=' + pixelRatio + ',minimum-scale=' +
     pixelRatio + ',maximum-scale=' + pixelRatio + '" />')
   var html = document.getElementsByTagName('html')[0]
   var pageWidth = html.getBoundingClientRect().width
   html.style.fontSize = pageWidth / 10 + 'px'
 }
 module.exports = rem
