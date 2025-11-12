<template>
  <div class="page mt-20 ml-10 mr-10 mb-20" v-if="refresh">
        <!-- 主分类添加 -->
        <groupCategoryEditForm 
            v-if="$route.query.cat_id == 0"
            :cat_id="$route.query.cat_id || 0"
            :cat_fid="$route.query.cat_fid || 0"
            :group_content_switch="group_content_switch"></groupCategoryEditForm>
        
        <!-- 分类信息分类页装修 -->
        <a-tabs 
            :default-active-key="key"
            @change="tabsChange" 
            v-if="$route.query.cat_id != 0">
            <a-tab-pane key="1" tab="分类信息">
                <groupCategoryEditForm 
                    :cat_id="$route.query.cat_id || 0"
                    :cat_fid="$route.query.cat_fid || 0"
                    :group_content_switch="group_content_switch"></groupCategoryEditForm>
            </a-tab-pane>
            <a-tab-pane key="2" tab="分类页装修">
              <a-row style="background:white;padding:20px;">
                <a-col :span="10">
                  <a-list item-layout="horizontal" :data-source="data">
                    <a-list-item slot="renderItem" slot-scope="item">
                      <a-list-item-meta
                        :description="item.desc">
                        <a slot="title" id="title">{{ item.title }}</a>
                      </a-list-item-meta>
                      <a-form v-if="item.title == '头部背景色'">
                        <a-form-item>
                          <color-picker :color.sync="main_color"/>
                        </a-form-item>
                      </a-form>
                      <a-switch
                        v-if="item.show_switch"
                        v-model="is_display"
                        @change="changeRec"/>
                      <a-button type="primary" @click="getClick(item.click,item.title)" v-if="item.button">
                        {{item.button}}
                      </a-button>
                    </a-list-item>
                  </a-list>
                  <a-divider></a-divider>
                </a-col>
                <a-col :span="2"></a-col>
                <a-col :span="12" style="position: relative;display: flex;flex-direction: column;" >
                  <iframe id="myframe" frameborder="0" :src="url" style="width:400px;height: 800px;"></iframe>
                  <a-button style="width: 65px;margin-top: 10px" type="primary" @click="refreshFrame">刷新
                  </a-button>
                </a-col>
              </a-row>
            </a-tab-pane>
        </a-tabs>
        <!--轮播图 | 导航列表 | 单图广告-->
        <decorate-adver ref="bannerModel"></decorate-adver>
  </div>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
import groupCategoryEditForm from '../modules/GroupCategoryEditForm.vue'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import DecorateAdver from "@/views/group/modules/decorateAdver";

const data = [
  {
    title: '头部背景色',
    desc: '',
    button: '',
    show_switch: false,
    change: '',
    click: ''
  },
  {
    title: '热搜词',
    desc: '设置推荐热搜关键词后，对应热搜词即可展示在频道页头部',
    button: '装修',
    show_switch: false,
    change: '',
    click: 'getHotSearch'
  },
  {
    title: '导航栏导航列表',
    desc: '按照团购分类子分类读取数据，默认一行展示5个，可展示两行，更多可轮播展示',
    button: '',
    show_switch: false,
    change: '',
    click: ''
  },
  {
    title: '广告位',
    desc: '尺寸为 702*142，仅显示一张广告图',
    button: '装修',
    show_switch: false,
    change: '',
    click: 'getAdver'
  },
  {
    title: '优选好店',
    desc: '按照分类下店铺评分以及销量展示店铺，默认展示9个',
    button: '',
    show_switch: false,
    change: '',
    click: ''
  },
  {
    title: '特价拼团',
    desc: '在该分类下，按照销量，展示正在拼团的前3款商品',
    button: '',
    show_switch: false,
    change: '',
    click: ''
  },
  {
    title: '精选热卖',
    desc: '推荐分类下热门商品，提高曝光率',
    button: '装修',
    show_switch: false,
    change: '',
    click: 'getSelect'
  },
  {
    title: '超值联盟',
    desc: '推荐该分类类型的优惠组合，提高曝光率',
    button: '装修',
    show_switch: false,
    change: '',
    click: 'getCombination'
  },
  {
    title: '店铺列表',
    desc: '在该频道分类下，默认按评分高低展示店铺',
    button: '',
    show_switch: false,
    change: '',
    click: ''
  },
];
export default {
    components: { groupCategoryEditForm, ColorPicker, DecorateAdver },
    data() {
        return {
            cat_id: this.$route.query.cat_id || 0, // 0:添加 其它：编辑
            cat_fid: this.$route.query.cat_fid || 0,// 0：主分类 其它：子分类
            group_content_switch: 0, // 编辑器数量&&编辑器标题 显隐 1：显示这两栏信息，0不显示
            refresh: true,
            data,
            main_color: '',
            // 查询字段
            queryParam: {
              now_cat_id: 0,
              cat_id: 0,
              location: 0,
              size: '',
              cat_name: '',
              cat_key: ''
            },
            key: '1',
            url: '',
          }
    },
    watch:{
      main_color(val){
        this.updateGroupCategoryBgColor(val)
      },
      '$route.query.key'(val) {
        if (val) {
          this.key = val.toString();
        }
      },
    },
    mounted() {
    },
    activated() {
        this.refresh = true
        this.configGroupCategoryOpt()
        this.getGroupCategory()
        this.getUrl()
    },
    deactivated() {
        this.refresh = false
    },
    methods: {
        // 编辑器数量和 编辑器标题两栏根据网站基本信息接口 
        // group_content_switch字段 1：显示这两栏信息，0不显示
        configGroupCategoryOpt() {
            this.request(GroupPlatformApi.configGroupCategory, null).then((res) => {
                this.group_content_switch = res && res.group_content_switch?res.group_content_switch:0
            })
        },
        tabsChange(key) {
            console.log(key,'tabsChange')
        },
        // 获取团购分类背景色 主分类添加cat_id = '0'
        getGroupCategory() {
            if (!Number(this.$route.query.cat_id)) return
            this.request(GroupPlatformApi.getGroupCategoryInfo, {cat_id: this.$route.query.cat_id}).then((res) => {
                this.main_color = res.detail.bg_color
            })
        },
        // 更新团购分类背景色
        updateGroupCategoryBgColor(val) {
          this.request(GroupPlatformApi.updateGroupCategoryBgColor, {cat_id: this.$route.query.cat_id, bg_color: val}).then((res) => {

          })
        },
        // 根据按钮调用不同方法
        getClick(fun, title) {
          this[fun](title);
        },
        //
        getHotSearch() {
          this.$router.push({path: '/group/platform.groupRenovationSearchHot/index', query: {cat_id: this.$route.query.cat_id}})
        },
        // 频道页 轮番图
        getBanner(title) {
          this.queryParam['cat_id'] = this.$route.query.cat_id
          this.queryParam['location'] = 2
          this.queryParam['size'] = '640*240'
          this.queryParam['cat_name'] = title
          this.queryParam['cat_key'] = 'wap_group_channel_top'
          this.queryParam['title'] = title
          this.$refs.bannerModel.getList(this.queryParam)
        },
        // 频道页 广告位
        getAdver(title) {
          this.queryParam['cat_id'] = this.$route.query.cat_id
          this.queryParam['location'] = 2
          this.queryParam['size'] = '702*142'
          this.queryParam['cat_key'] = 'wap_group_channel_adver'
          this.queryParam['cat_name'] = title
          this.queryParam['title'] = title
          this.$refs.bannerModel.getList(this.queryParam)
        },
        // 精选热卖
        getSelect(title) {
          this.$router.push({path: '/group/platform.groupSelect/edit', query: {cat_id: this.$route.query.cat_id, type: 1}})
        },
        // 超值联盟
        getCombination(title) {
          this.$router.push({path: '/group/platform.groupRenovationCombine/edit', query: {cat_id: this.$route.query.cat_id, type: 2}})
        },
        getUrl() {
          this.request(GroupPlatformApi.getUrl,{type: 'channel', cat_id: this.$route.query.cat_id}).then(response => {
            this.url = response.url
          })
        },
        refreshFrame() {
          document.getElementById('myframe').contentWindow.location.reload(true);
        },
    },
}
</script>

<style scoped>
.page {
    padding: 40px;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    background: #ffffff;
}
</style>
