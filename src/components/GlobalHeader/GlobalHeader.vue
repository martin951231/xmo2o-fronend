<template>
  <transition name="showHeader">
    <div v-if="visible && !isFromIframe()" class="header-animat c111">
      <a-layout-header
        v-if="visible"
        :class="[
          fixedHeader && 'ant-header-fixedHeader',
          sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed',
        ]"
        :style="{ padding: '0' }"
      >
        <div v-if="mode === 'sidemenu'" class="header">
          <a-tooltip placement="bottomLeft" :get-popup-container="getPopupContainer" :auto-adjust-overflow="false">
            <template slot="title">
              <span>侧边伸缩</span>
            </template>
            <a-icon
              v-if="device === 'mobile'"
              class="trigger"
              :type="collapsed ? 'menu-fold' : 'menu-unfold'"
              @click="toggle"
            />
            <a-icon v-else class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggle" />
          </a-tooltip>
          <user-menu :showIcon="showIcon" :showLanguage="showLanguage"></user-menu>
          <template v-if="showIcon">
            <a-tooltip placement="bottomLeft">
              <template slot="title">
                <span>访问网站</span>
              </template>
              <a-icon
                type="desktop"
                @click="openIndex"
                :style="{ fontSize: '20px', marginRight: '20px', marginLeft: '12px' }"
              />
            </a-tooltip>
            <a-tooltip placement="bottomLeft">
              <template slot="title">
                <span>清除缓存</span>
              </template>
              <a-icon
                type="delete"
                @click="clean"
                :style="{ fontSize: '20px', marginRight: '20px', marginLeft: '12px' }"
              />
            </a-tooltip>
            <a-tooltip placement="bottomLeft">
              <template slot="title">
                <span>开全屏</span>
              </template>
              <a-icon
                type="fullscreen"
                @click="fullscreen"
                :style="{ fontSize: '20px', marginRight: '20px', marginLeft: '12px' }"
              />
            </a-tooltip>
          </template>
          <template v-if="showData">
            <a-button
              type="primary"
              style="float: right; margin-top: 15px"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/property/property/communityData','_blank')"
            >
              可视化大数据
            </a-button>
          </template>
          <template>
            <a-modal
                    title="查看二维码"
                    :width="1200"
                    :visible="isCode"
                    :footer="null"
                    :maskClosable="false"
                    @cancel="handleCancel"
            >
              <iframe
                      name="iframeMap"
                      id="iframeMapViewComponent"
                      width="90%"
                      height="300px"
                      v-bind:src="smgHtmlPath"
                      frameborder="0"
                      scrolling="no"
                      ref="iframeDom"
              ></iframe>
            </a-modal>
          </template>
          
          <template v-if="jz_open">
            <a-button
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/village/workOrder/orderTongji/platformOrderData','_blank')"
            >
              {{jz_open_title}}
            </a-button>
          </template>
          <template v-if="showHouseCityRegionManageEntrance">
            <a-button v-if="admin_area_type!=9"
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/system/community/cityRegionManage/visualizationScreen','_blank')"
            >
              可视化大数据
            </a-button>

            <div class="city_region_manage_div" style="float: right; margin-top: -2px;margin-right: 15px;" v-if="admin_area_type==9">
                <a-popconfirm placement="bottomRight" ok-text=" 确 认 " cancel-text=" 取 消 " @confirm="goToTishCityRegion">
                    <template slot="title">
                        <p class="swap_region_title">选择城市</p>
                        <div class="swap_region_content" style="margin: 20px 20px 30px 1px;">
                            <div class="itemdiv" style="margin-right: 100px;margin-right: 90px;">
                                <span style="width: 80px;display: inline-block;">城市索搜：</span>
                                    <a-select
                                      
                                      show-search
                                      placeholder="请输入城市名称"
                                      v-model="city_name_search"
                                      style="width: 200px;margin-right: 10px;"
                                      :default-active-first-option="false"
                                      :show-arrow="false"
                                      :filter-option="false"
                                      :not-found-content="null"
                                      class="input_style margin_left_8 margin_top_10"
                                      @search="handleSearch"
                                      @change="searchOptionChange"
                                    >
                                      <a-select-option v-for="cc in city_search_data" :key="cc.area_id">
                                        {{ cc.area_name }}
                                      </a-select-option>
                                    </a-select>
                                    <a-icon v-if="city_area_id*1>0" type="check-circle" theme="twoTone" two-tone-color="#52c41a" style="font-size: 25px;vertical-align: middle;" />
                            </div>
                        </div>
                    </template>
                    <a-button
                      type="primary"
                    >
                      可视化大数据
                    </a-button>
                </a-popconfirm>
            </div>
          </template>
          
          <template v-if="showSkyCockpitEntrance">
            <a-button
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/platform.cockpit/dataScreen','_blank')"
            >
              启天驾驶舱
            </a-button>
          </template>
          
          <template v-if="showMeter">
            <a-button
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/meter/meterStatistics','_blank')"
            >
              可视化大数据
            </a-button>
          </template>
          <template v-if="showPlatform">
            <a-button
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/platform.hardware/hardware','_blank')"
            >
              硬件大数据
            </a-button>
          </template>

                    <template v-if="showSentryWatch">
                        <a-button type="primary" style="float: right; margin: 15px 15px 0 15px" @click="go_gang">
                            岗亭登录
                        </a-button>
                    </template>
          <template v-if="showVillage">
            <a-button
              type="primary"
              style="float: right; margin-top: 15px"
              @click="open_qrcode_box"
            >
              移动管理端
            </a-button>
<!--            <a-button-->
<!--              v-if="!cockpit"-->
<!--              type="primary"-->
<!--              style="float: right; margin-top: 15px;margin-right: 15px;"-->
<!--              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/user/village/datastatistics','_blank')"-->
<!--            >-->
<!--              可视化大数据-->
<!--            </a-button>-->
            <a-button
              v-if="!cockpit"
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/village/statistical','_blank')"
            >
              可视化大数据
            </a-button>
            
            <a-button
              v-if="cockpit"
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/village/cockpit/datastatistics','_blank')"
            >
              驾驶舱
            </a-button>
            <a-button
              type="primary"
              style="float: right; margin-top: 15px;margin-right: 15px;"
              onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/village/workOrder/orderTongji/orderTongji','_blank')"
            >
              工单处理中心
			      </a-button>
          </template>
          <template v-if="showEventCenter">
              <a-button type="primary" style="float: right;margin-top: 15px;margin-right: 15px;" onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/streetCommunity/gridCustom/GridEventCenter','_blank')">
                {{grid_event_center_name}}
              </a-button>
          </template>
          <template v-if="showCommunityCommittee">
<!--            <a-button type="primary" style="float: right;margin-top: 15px;margin-right: 15px;" onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/community/streetCommunity/dataScreen/index','_blank')">-->
<!--              可视化大数据-->
<!--            </a-button>-->
              <a-button type="primary" style="float: right;margin-top: 15px;margin-right: 15px;" onclick="window.open('http://jimu.mrsqfw.com/drag/share/view/1113360730782863360?shareToken=Fntil1vG9cCzB8Z2dibZCg0HzFSpYPsx&sid=2','_blank')">
                  可视化大数据
              </a-button>
          </template>
          <template v-if="showMeterCenter">
            <a-button type="primary" style="float: right;margin-top: 15px" onclick="window.open(location.protocol + '//' + location.host + '/v20/public/platform/#/meter/meterStatistics','_blank')">
              可视化大数据
            </a-button>
          </template>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'" />
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme" />
              <a-icon v-else class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle" />
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin'
import { getSystemName } from '@/utils/util'
import store from '@/store';
export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu',
    },
    menus: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    device: {
      type: String,
      required: false,
      default: 'desktop',
    },
  },
  data() {
    return {
      visible: true,
      oldScrollTop: 0,
      showIcon: false,
      cockpit:0,
      showData:false,
      showEventCenter:false,
      showLanguage: false,
      showMeterCenter:false,
      dialogVisible: false,
      isCode:false,
      showMoveCode:false,
      smgHtmlPath:'',
      showVillage: false,
      showMeter:false,
      qrcode_box: false,
      qrcode_url: '',
      showPlatform: false,
      showSkyCockpitEntrance: false,
      showCommunityCommittee:false,
      grid_event_center_name:'网格事件中心',
      jz_open: false,
      jz_open_title: '工单中心',
      showHouseCityRegionManageEntrance:false,
      admin_area_type:0,
      city_area_id:0,
      city_search_data:[],
      city_name_search:'',
      showSentryWatch:false,
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        this.customShow(newVal.path)
      },
    },
  },
  mounted() {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
    this.customShow(this.$route.path)
  },
  methods: {
    open_qrcode_box() {
      this.qrcode_box = true
      var baseUrl = window.location.origin
      this.qrcode_url = baseUrl + '/shequ.php?g=House&c=Index&a=see_qrcode'
      var params = {};
      params['url'] = this.qrcode_url;
      params['title'] = '查看二维码';
      params['height'] = 300;
      params['width'] = 1000;
      window['layer'].open(params)
    },

    qrcodeBoxCancel() {
      this.qrcode_box = false
    },
    customShow(val) {
      const sysName = getSystemName(val)
      this.showIcon = false
      this.showData = false
      this.showLanguage = false
      if (sysName == 'platform') {
        this.showIcon = true
        //硬件大数据
        if(store.getters.config.hardware_switch){
          this.showPlatform = store.getters.config.hardware_switch;
        }
        if(store.getters.config.show_sky_cockpit_entrance){
          this.showSkyCockpitEntrance = store.getters.config.show_sky_cockpit_entrance;
        }
        if(store.getters.userInfo.show_house_city_region_entrance){
          this.showHouseCityRegionManageEntrance = store.getters.userInfo.show_house_city_region_entrance;
          this.admin_area_type= store.getters.userInfo.admin_area_type;
        }
        if(store.getters.config.city_list){
            this.city_search_data=store.getters.config.city_list;
        }
        if(this.$store.getters.config.jz_open){
          this.jz_open = this.$store.getters.config.jz_open;
          this.jz_open_title = this.$store.getters.config.jz_open_title;
          if (!this.jz_open_title) {
              this.jz_open_title = '工单中心';
          }
        }
      } else if (sysName == 'merchant' || sysName == 'storestaff') {
        this.showLanguage = true
      } else if (sysName == 'property') {
        this.showData = true
                if (store.getters.config.showSentryWatch) {
                    this.showSentryWatch = store.getters.config.showSentryWatch;
                }
      } else if (sysName == 'community') {
        this.showMoveCode = true
      } else if (sysName == 'village') {
        this.showVillage = true;
        if(store.getters.config.cockpit){
          this.cockpit = store.getters.config.cockpit;
        }
                if (store.getters.config.showSentryWatch) {
                    this.showSentryWatch = store.getters.config.showSentryWatch;
                }
      } else if (sysName == 'meter') {
        this.showMeter = true;
      }
      if (getSystemName(val) == 'property') {
          this.showData = true
      } else {
          this.showData = false
      }
      if (getSystemName(val) == 'community') {
          this.showEventCenter = true
          this.showCommunityCommittee=true;
          if(store.getters.config.grid_event_center_name){
            this.grid_event_center_name = store.getters.config.grid_event_center_name;
          }
      } else {
          this.showEventCenter = false
          this.showCommunityCommittee=false;
      }
        if (getSystemName(val) == 'meter') {
            this.showMeterCenter = true
        } else {
            this.showMeterCenter = false
        }
    },
    handleScroll() {
      if (!this.autoHideHeader) {
        return
      }
      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    getPopupContainer(trigger) {
      return trigger.parentElement
    },
    clean() {
      var baseUrl = window.location.origin
      this.request(baseUrl + '/v20/public/index.php/common/common.index/cleanCache').then((res) => {
        this.$message.success('清除缓存成功！')
      })
    },
    fullscreen(){
      var elem = document.body;
      // 调用requestFullscreen方法进入全屏模式
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { // 对于Safari和其他webkit浏览器
          elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // 对于IE/Edge
          elem.msRequestFullscreen();
      }
    },
    openIndex() {
      window.open(window.location.origin)
    },
    toggle() {
      this.$emit('toggle')
    },
    moveCode(){
      this.isCode = true;
      var baseUrl = window.location.origin;
      this.smgHtmlPath = baseUrl + '/shequ.php?g=House&c=Index&a=see_qrcode';
    },
    // 右侧弹出抽屉关闭
    handleCancel() {
      this.isCode = false;
    },
    
    // 查询模糊搜索
    handleSearch (value) {
        if (!value) {
            return false
        }
        let param = {
            city_name: value,
            xtype:"cityRegionManage",
        }
        var baseUrl = window.location.origin
        this.request(baseUrl + '/v20/public/index.php/common/platform.index/getCityInfoList', param).then((res) => {
            if (res.city_list!=undefined) {
                this.city_search_data = res.city_list
                if(this.city_search_data.length<1){
                    this.city_area_id=0;
                    this.city_name_search='';
                }
            }
        })
    },
    searchOptionChange(value, option){
        console.log('city_area_id',value)
        this.city_area_id=value;
       
    },
    goToTishCityRegion(){
        if(this.city_area_id*1>0){
                    window.open(window.location.protocol + '//' + window.location.host + '/v20/public/platform/#/system/community/cityRegionManage/visualizationScreen?city_area_id='+this.city_area_id,'_blank');
        }else{
            this.$message.error('请重新选择城市！')
        }
    },
        go_gang() {
            window.open('http://'+window.location.host+'/v20/public/platform/#/user/community/Watchlogin')
        },
  },
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  },
  
}
</script>

<style lang="less">
@import '../index.less';

.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
</style>
