/**
 *******************
 *   @author 衡婷妹
 *   @date 2021-04-02
 *   @description 店员端公共方法
 *******************
 */
import userStorestaffApi from '@/api/user/storestaff'
import { request } from './request'
import notification from 'ant-design-vue/es/notification'

// 新订单提醒定时器
let timer = null
// 新订单提醒消息
let orderNoticeData = null
// 新订单提醒时间戳
let now_time = 0
let orderNoticeAudio = new Audio()
let staff_id = 0

// 订单轮询消息
export function orderNotice(type = 'index', callBack = '') {
  if (timer) {// 清除定时器
    clearInterval(timer)
    if (timer && window.clearInterval) {
      window.clearInterval(timer)
    }
    timer = null
  }

  timer = setInterval(() => {// 每3秒轮询一次
    request(userStorestaffApi.orderNotice,{app_type:'packapp',now_time:now_time}).then((res) => {
      if (res) {
        now_time = res.now_time
        staff_id = res.staff_id
        // 当前业务的新订单数量
        let count = res.count

        // 如果缓存存在 更新缓存新订单数量
        orderNoticeData = sessionStorage.getItem('orderNoticeData'+staff_id)
        if(orderNoticeData &&  orderNoticeData != null && orderNoticeData != 'null'){
          orderNoticeData = JSON.parse(orderNoticeData)
          if(orderNoticeData.list.length>0 && res.list.length>0 ){
            let list = []
            res.list.forEach(item_new => {
              orderNoticeData.list.forEach(item => {
                if(item_new.business_type == item.business_type){
                  item_new.new_order_count = parseInt(item_new.new_order_count)
                  item_new.new_order_count = parseInt(item_new.new_order_count)+parseInt(item.new_order_count)
                }
              })
              if(res.business_type == item_new.business_type){
                count = item_new.new_order_count
              }
              list.push(item_new)
            });
            
            res.list = list
          }else if(orderNoticeData.list.length>0){
            res.list = orderNoticeData.list
          }
        }

        // 存入缓存
        sessionStorage.setItem('orderNoticeData'+staff_id, JSON.stringify(res) )

        if(res.voice_url){// 播放音频
          if (orderNoticeAudio) {
            orderNoticeAudio.pause()
            orderNoticeAudio = null
            console.log('播放前先把之前语音暂停')
          }

          orderNoticeAudio = new Audio()
          //播放次数
          let audioPlayCount = 0
          //播放链接
          orderNoticeAudio.src = res.voice_url
          let playPromise = orderNoticeAudio.play()
          console.log(playPromise,'playPromise')
          if (playPromise) {
            playPromise
              .then(() => {
                // 音频加载成功
                orderNoticeAudio.play()
                console.log('音频加载成功')
              })
              .catch(e => {
                // 音频加载失败 重新加载
                console.log('音频加载失败 重新加载')
                audioPlayCount=0
              })
          }
          
          orderNoticeAudio.addEventListener('ended', e => {
            audioPlayCount++
            console.log(audioPlayCount,'音频播放次数')
            if (audioPlayCount > Number(res.voice_time) || audioPlayCount == Number(res.voice_time)) {
              if(orderNoticeAudio){
                orderNoticeAudio.pause()//关闭语音
                orderNoticeAudio = null
              }
              // notification.destroy()//销毁弹窗
              console.log('全部播放完毕关闭语音')
              audioPlayCount = 0
            } else {
              orderNoticeAudio.play()
              console.log('音频多次播放成功')
            }
          })
        }

        if (type == 'index' && callBack) {//店员首页使用角标提醒
          callBack(res)
        } else {//其他页面
          if(!res.business_type){// 没有新订单
            return true;
          }

          notification.destroy()//销毁弹窗
          
          // 弹窗提醒
          notification.open({ 
            message: res.title,
            description: res.s_title,
            icon:h => {
              return h(
                'a-icon',
                {
                  props: {
                    type: 'bell',
                    theme:'twoTone'
                  }
                },
              )
            },
            onClick:()=>{
              if(res.business_type != 'many'){// 单个业务查看之后重置新订单消息数量
                clearNotice(res.business_type)
              }

              // 停止播放
              if(orderNoticeAudio){
                orderNoticeAudio.pause()
                orderNoticeAudio = null
              }
              console.log('onClick停止播放')

              notification.destroy()//销毁弹窗

              // 跳转查看
              if(res.url == location.href) {
                window.location.reload()
              }else {
                window.open(res.url, '_self')

              }
            },
            onClose:()=>{
              // 停止播放
              if(orderNoticeAudio){
                orderNoticeAudio.pause()
                orderNoticeAudio = null
              }
              console.log('onClose停止播放')
            },
            duration:null ,
            style:{'cursor':'pointer'}
          })
        }
        
      }
    })
  }, 3000)
 
}

// 重置订单轮询消息数量
export function clearNotice(business_type){
  if(orderNoticeAudio){
    orderNoticeAudio.pause()
    orderNoticeAudio = null
  }
  console.log('clearNotice停止播放')
  orderNoticeData = sessionStorage.getItem('orderNoticeData'+staff_id)
   if(orderNoticeData &&  orderNoticeData != null && orderNoticeData != 'null'){
      orderNoticeData = JSON.parse(orderNoticeData)
      if(orderNoticeData.list.length>0){
        let list = []
        orderNoticeData.list.forEach(item => {
          if(item.business_type == business_type){
            item.new_order_count = 0
          }
          list.push(item)
        })
        orderNoticeData.list = list
        sessionStorage.setItem('orderNoticeData'+staff_id, JSON.stringify(orderNoticeData) )
      }
   }
}

// 停止订单轮询
export function stopNotice(){
  clearInterval(timer)
  if (timer && window.clearInterval) {
    window.clearInterval(timer)
  }
}


