<template>
  <div id="storestaffHome">
    <!-- 头部个人信息栏 -->
    <section class="header">
      <!-- 店员信息 -->
      <div class="staff-info">
        <img class="logo" key="avator" v-if="logo" :src="logo" />
        <img class="logo" key="default_avator" v-else src="../../../assets/storestaff/staff_avator.png" />
        <span class="staff-name">{{ staffName }}</span>
        <img class="logout" @click="logout" src="../../../assets/storestaff/logout.png" />
      </div>
      <!-- 商铺信息 -->
      <div class="store-info">
        <img src="../../../assets/storestaff/store.png" />
        <span class="store-name">{{ storeName }}</span>
        <div v-if="config.open_multilingual == 1 && config.lang_config">
          <a-dropdown :trigger="['click']">
            <a-menu slot="overlay" v-if="config.lang_config.lang_list && config.lang_config.lang_list.length">
              <a-menu-item
                @click="changeLang"
                v-for="item of config.lang_config.lang_list"
                :key="item.val"
                :style="now_lang == item.val ? 'color:#1890FF' : ''"
              >
                {{ item.display }}
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> {{ lang_txt }} <a-icon type="down" /> </a-button>
          </a-dropdown>
        </div>
      </div>
    </section>
    <!-- 内容区 -->
    <section class="content" ref="content">
      <a-carousel class="carousel" :after-change="onChange" v-if="showList && showList.length">
        <div class="page" v-for="(page, pageIndex) of showList" :key="'page_' + count + '_' + pageIndex">
          <!-- 第一行 -->
          <div
            class="item-container"
            v-if="page.list1"
            :style="
              (page.list1.length < count ? 'width:' + (page.list1.length / count) * 100 + '%;' : '') +
              'height:' +
              colHeight +
              'px'
            "
          >
            <div class="item" v-for="item of page.list1" :key="item.url" @click="goToUrl(item)">
              <!-- :style="{width:itemWidth}" :style="{width:imgSize, height:imgSize}"  -->
              <a-badge :count="item.count" :numberStyle="{ 'right': '10%','top': '4%',
            boxShadow: '0 0 0 1px #d9d9d9 inset'}">
                  <img :src="item.image"/>
              </a-badge>
              <div class="title">{{ item.name }}</div>
            </div> 
          </div>
          <!-- 第二行 -->
          <div
            class="item-container"
            style="align-items: flex-start; margin-top: 10px"
            v-if="page.list2"
            :style="
              (page.list2.length < count ? 'width:' + (page.list2.length / count) * 100 + '%;' : '') +
              'height:' +
              (colHeight - 20) +
              'px'
            "
          >
            <div class="item" v-for="item of page.list2" :key="item.url" @click="goToUrl(item)">
              <a-badge :count="item.count" :numberStyle="{ 'right': '10%','top': '4%',
            boxShadow: '0 0 0 1px #d9d9d9 inset'}">
              <img :src="item.image"/>
              </a-badge>
              <div class="title">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </a-carousel>
    </section>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import userStorestaffApi from '@/api/user/storestaff'
import { getTokenName, delCookie, getLangDisplay} from '@/utils/util'
import {orderNotice,clearNotice,stopNotice} from '@/utils/storestaff'
export default {
  name: 'StoreStaffIndex',
  data() {
    return {
      pageInfo: {},
      logo: '',
      staffName: '',
      storeName: '',
      list: [],
      dataList: [],
      showList: [], // 整理后的list数据 showList:[{list1:[], list2:[]}]
      contentWidth: 800,
      contentHeight: 500,
      // colHeight: 200,
      // itemWidth: 160,
      itemHeight: 140,
      count: 4,
      colWidth: '100%',
      timer: null,
      config: {},
      now_lang: '',
      lang_txt: '',
      print_mcode: '',
      print_paper: '',
      print_image: '',
      print_mkey: '',
      system_config: {},
      shanshu_custom: 0,//定制 www.esstc.cn浙江云尚商业管理发展有限公司
    }
  },
  computed: {
    // 每一行行高
    colHeight() {
      return this.contentHeight / 2
    },
    // 根据宽度算每个item的宽度
    itemWidth() {
      return this.contentWidth / this.count + 'px'
    },
    imgSize() {
      return (this.contentWidth / this.count) * 0.65 + 'px'
    },
  },
  watch: {
    '$store.getters.config'(val) {
      this.config = val
    },
    '$store.getters.nowLang'(val) {
      this.now_lang = val
      this.lang_txt = getLangDisplay(val)
    },
  },
  created() {
    this.config = this.$store.getters.config
    this.now_lang = this.$store.getters.nowLang
    this.lang_txt = getLangDisplay(this.now_lang)
    this.system_config = this.$getCache('system_config')
    this.shanshu_custom = this.system_config.shanshu_custom
  },
  mounted() {
    this.getPageInfo()
    this.$nextTick(() => {
      // 监听窗口缩放
      window.onresize = () => {
        this.timer = setTimeout(() => {
          this.init()
        }, 600)
      }
      window.get_printer = this.get_printer
    })
  },
  methods: {
    ...mapActions(['SetLang']),
    // 切换语言
    changeLang(e) {
      this.SetLang({ lang: e.key }).then((res) => {
        this.now_lang = e.key
        this.lang_txt = getLangDisplay(this.now_lang)
      })
    },
    getPageInfo() {
      this.request(userStorestaffApi.getIndexPageInfo).then((res) => {
        if (res) {
          Vue.ls.set('storestaff_page_info', res)
          this.logo = res.staff_logo
          this.staffName = res.staff_name
          this.storeName = res.store_name
          this.list = res.memu_list
          this.init()
          if (this.checkAndroidApp()) {
            window.pigcmspackapp.get_printer('get_printer')
          }

          //如果是定制并且在收银机下的app里面时，更新机器视图
          if(this.shanshu_custom && this.checkAndroidApp()){
            const params = {
              merchantName: res.merchant_name,
              merchantAddress: res.full_address,
              operator: this.staffName,
              smallScreenBanner: res.cashier_page_advs,
              bigScreenBanner: res.cashier_desk_advs,
            }
            window.pigcmspackapp.secondScreenBasicsInfo(JSON.stringify(params))
            window.pigcmspackapp.showProductUi(0)//1 结算界面 0广告页
          }
        }
      })
    },
    init() {
      // 深拷贝数组 对备份数组进行操作
      this.dataList = JSON.parse(JSON.stringify(this.list))
      // 展示菜单区域的屏幕宽度: document.body.clientWidth-40 (40为距离左右边的距离)
      this.contentWidth = document.body.clientWidth - 40
      // 每一行行高: (document.body.clientHeight -100 -40 -10)/2  (100为头部高度，40为主区域距离上下高度， 10为底部留空展示多页点的)
      this.contentHeight = document.body.clientHeight - 150
      // 200为item固定宽度
      this.count = Math.floor(this.contentWidth / 200)
      console.log(this.count)
      this.showList = []
      this.handleList(this.dataList)
    },
    onChange(index) {},
    // 处理后端返回的菜单数据 调用之前要初始化showList
    handleList(list) {
      const { count } = this
      if (list.length <= count * 2) {
        // 一页
        this.handleOnePage(list)
      } else {
        // 多页
        const pageList = list.splice(0, count * 2) // 第一页数据
        this.handleOnePage(pageList)
        // 剩下的数据再迭代处理
        this.handleList(list)
      }
    },
    // 一页数据
    handleOnePage(list) {
      const { count } = this
      if (list.length < count) {
        // 一行
        this.showList.push({ list1: list })
      } else {
        // 两行
        const list1 = list.splice(0, count)
        this.showList.push({ list1, list2: list })
      }
      console.log('---------------', this.showList)
      clearTimeout(this.timer)
      

      // 订单轮询
      orderNotice('index',(res) => {
        if(res && res.list && res.list.length>0){
          let orderList = res.list,showOrderList = []

          this.showList.forEach(item => {
            let list1 = [],list2 = []
            if(item.list1 && item.list1.length>0){
              item.list1.forEach(menuItem => {
                orderList.forEach(orderItem => {
                  if(menuItem.business_type == orderItem.business_type){
                    menuItem.count = orderItem.new_order_count
                  }
                })
                list1.push(menuItem)
              })
            }
            
            if(item.list2 && item.list2.length>0){
              item.list2.forEach(menuItem => {
                orderList.forEach(orderItem => {
                  if(menuItem.business_type == orderItem.business_type){
                    menuItem.count = orderItem.new_order_count
                  }
                })
                list2.push(menuItem)
              })
            }
            if (list1.length > 0 && list2.length > 0) {
              // 两行
              showOrderList.push({ list1, list2 })
            } else {
              // 一行
              showOrderList.push({ list1 })
            }
          })
          this.showList = showOrderList
        }
      })
    },
    // 跳转路由
    goToUrl(e) {
      console.log(e)
      if (e.url) {
        if (e.need_perfect_store) {
          this.$message.info('抱歉！请先到商家后台完善该店铺信息后才可进入')

        } else {
          if (e.url_type == 'click') {
            this.showPrint()
          } else if(e.url_type == 'new_blank'){
            window.open(e.url, '_blank')
          }else {
          // 清空该栏的消息提醒
          clearNotice(e.business_type)
          sessionStorage.setItem('dyz25', 0)
          window.open(e.url, '_self')
          }
        }
      } else {
        this.$message.info('当前按钮没有配置链接！')
      }
    },
    // 退出登录
    logout() {
      const _this = this
      this.$confirm({
        title: '真的要退出登录吗?',
        centered: true,
        onOk:()=> {
          const tokenName = getTokenName(_this.$route.path)
          Vue.ls.remove(tokenName)
          Vue.ls.remove('storestaff_page_info')
          delCookie(tokenName)
          stopNotice()
          if(this.checkAndroidApp()){
            this.$router.replace('/usernew/storestaff/login')
          }else{
            window.location.reload()
          }
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    checkApp() {
      if (/(pigcms_pack_app)/.test(navigator.userAgent.toLowerCase())) {
        return true
      } else {
        return false
      }
    },
    checkAndroid() {
      if (/(android)/.test(navigator.userAgent.toLowerCase())) {
        return true
      } else {
        return false
      }
    },
    checkAndroidApp() {
      if (this.checkApp() && this.checkAndroid()) {
        return true
      } else {
        return false
      }
    },
    getDeviceId() {
      if (this.checkApp()) {
        var reg = /device_id=(.*?),/
        var arr = reg.exec(navigator.userAgent.toLowerCase())
        if (arr == null) {
          return 'packapp'
        } else {
          return arr[1]
        }
      } else {
        return 'packapp'
      }
    },
    // 获得打印机信息
    get_printer(arg1, arg2, arg3) {
      if (arg1 != '') {
        // 将打印机加入列表
        this.list.push({
          name: this.L('打印机参数'),
          url: 'showPrint',
          url_type: 'click',
          image: '/v20/public/static/storestaff/images/index/printer.png',
          need_perfect_store: false, //是否需要完善店铺信息
        })
        this.init()
        // this.handleList(this.dataList)
        this.print_mcode = arg1
        this.print_paper = arg2
        this.print_image = arg3
        this.print_mkey = this.getDeviceId()
        this.request(userStorestaffApi.getPrintHas, { mkey: this.print_mkey }).then((result) => {
          if (result.status == 1) {
            setInterval(() => {
              this.request(userStorestaffApi.getOwnPrinter, { mkey: this.print_mkey }).then((opResult) => {
                if (opResult.info != '') {
                  window.pigcmspackapp.printer_work(opResult.info, '')
                }
              })
            }, 3000)
          }
        })
      }
    },
    // 打印参数
    showPrint() {
      const h = this.$createElement
      this.$info({
        title: this.L('打印机参数'),
        content: h('div', { style: 'font-size:16px' }, [
          h('p', this.L('终端号') + '：' + this.print_mcode),
          h('p', this.L('秘钥') + '：' + this.print_mkey),
          h('p', this.L('纸张类型') + '：' + this.print_paper + 'mm'),
          h('p', this.L('支持图片') + '：' + (this.print_image == '1' ? this.L('支持') : this.L('不支持'))),
          h('p', { style: 'font-size:12px' }, '添加打印机后，请重新启动本软件。'),
        ]),
        onOk() {},
      })
    },
  },
}
</script>
<style lang="less" scoped>
#storestaffHome {
  width: 100%;
  height: 100%;
  background-image: url(../../../assets/storestaff/background.png);
  background-size: cover;
  color: #666;
  font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px;
  color: #747b8b;
  font-size: 16px;
  overflow: hidden;
  .header {
    height: 100px;
    display: flex;
    justify-content: space-between;
    .staff-info {
      height: 100%;
      display: flex;
      align-items: center;
      .logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 20px;
        margin-right: 10px;
      }
      .staff-name {
        padding-right: 10px;
        border-right: 1px solid #747b8b40;
      }
      .logout {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .store-info {
      height: 100%;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      .store-name {
        margin-right: 20px;
      }
    }
  }
  .content {
    flex: 1;
    color: #ffffff;
    position: relative;
    .page {
      height: 100%;
      .item-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .item {
          display: flex;
          width: 140px;
          height: 160px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          img {
            width: 110px;
            height: 110px;
            border-radius: 20px;
            pointer-events: none;
          }
          .title {
            height: 50px;
            line-height: 50px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}

.ant-carousel /deep/ .slick-slide {
  color: #dcdcdc;
  font-size: 18px;
}
</style>
