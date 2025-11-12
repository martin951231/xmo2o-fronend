<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="团购首页配置">
                <a-row style="background: white; padding: 20px">
                    <a-col :span="10">
                        <a-list item-layout="horizontal" :data-source="data">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta :description="item.desc">
                                    <a slot="title" id="title">{{ item.title }}</a>
                                </a-list-item-meta>
                                <a-switch v-if="item.show_switch" v-model="is_display" @change="changeShow" />
                                <div class="mr-10" v-if="item.show_select_group_activity">
                                    <a-select v-model="group_activity_recommendations" :options="activityoptions" @change="onGroupActivityChange"></a-select>
                                </div>
                                <a-button type="primary" @click="getClick(item.click, item.title)" v-if="item.button">
                                    {{ item.button }}
                                </a-button>
                            </a-list-item>
                        </a-list>
                        <a-divider></a-divider>
                    </a-col>
                    <a-col :span="2"></a-col>
                    <a-col :span="12" style="position: relative; display: flex; flex-direction: column">
                        <iframe id="myframe" frameborder="0" :src="url"></iframe>
                        <a-button style="width: 65px; margin-top: 10px" type="primary" @click="refreshFrame"
                            >刷新
                        </a-button>
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="发现页配置">
                <a-row style="background: white; padding: 20px">
                    <a-col :span="10">
                        <a-list item-layout="horizontal" :data-source="list">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta :description="item.desc">
                                    <a slot="title" id="title">{{ item.title }}</a>
                                </a-list-item-meta>
                                <a-switch v-if="item.show_switch" v-model="is_display" @change="changeRec" />
                                <a-button type="primary" @click="getClick(item.click, item.title)" v-if="item.button">
                                    {{ item.button }}
                                </a-button>
                            </a-list-item>
                        </a-list>
                        <a-divider></a-divider>
                    </a-col>
                    <a-col :span="2"></a-col>
                    <a-col :span="12" style="position: relative; display: flex; flex-direction: column">
                        <iframe id="myframe" frameborder="0" :src="findUrl"></iframe>
                        <a-button style="width: 65px; margin-top: 10px" type="primary" @click="refreshFrame"
                            >刷新
                        </a-button>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
        <!--轮播图 | 导航列表 | 单图广告-->
        <decorate-adver ref="bannerModel"></decorate-adver>
        <rec-custom ref="recModel"></rec-custom>

        <a-modal
            :title="L('顶部背景')"
            width="50%"
            :visible="modalVisible"
            @cancel="modalVisible = false"
            @ok="modalHandelOK"
        >
            <a-form-model
                :model="formData"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 18 }"
                labelAlign="left"
            >
                <a-form-model-item :label="L('背景配置')">
                    <a-radio-group v-model="formData.group_home_top_bg_style">
                        <a-radio  :value="0" >{{ L('背景色') }}</a-radio>
                        <a-radio  :value="1" >{{ L('背景图') }}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="" v-if="formData.group_home_top_bg_style == 0" :wrapper-col="{span:18,offset:4}">
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formData.group_home_top_bg_color }}</span>
                        <label for="bg_color" class="color-picker-label" :style="[{ background: formData.group_home_top_bg_color }]">
                            <input type="color" v-model="formData.group_home_top_bg_color" id="bg_color" />
                        </label>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="" v-if="formData.group_home_top_bg_style == 1" :wrapper-col="{span:18,offset:4}" :help="L('图片尺寸375*230')">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="topBgImageFileList"
                        name="reply_pic"
                        :data="{
                             upload_dir: '/group/images'
                        }"
                        @change="handleUploadImg($event, 'topBgImageFileList', 'group_home_top_bg_image', false)"
                        class="upload-bg-image"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import DecorateAdver from '@/views/group/modules/decorateAdver'
import RecCustom from '@/views/group/modules/RecCustom'
import groupPlatformApi from '@/api/group/platform'

const data = [
    {
        title: '顶部背景',
        desc: '自定背景色或背景图',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getTopBg',
    },
    {
        title: '轮播图',
        desc: '尺寸为 702*272',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getBanner',
    },
    {
        title: '导航栏导航列表',
        desc: '每行展示五个，不设置不展示',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getNav',
    },
    {
        title: '广告位',
        desc: '尺寸为 702*142，仅显示一张广告图',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getAdver',
    },
    {
        title: '附近好店',
        desc: '按当前位置距离、评分展示9家店铺',
        button: '',
        show_switch: true,
        change: 'changeShow',
        click: 'getRec',
    },
    {
        title: '优选商品',
        desc: '推荐热门商品到团购首页，提高热门商品曝光率',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSelect',
    },
    {
        title: '超值组合',
        desc: '推荐优惠组合套餐到团购首页，增加曝光率',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getCombination',
    },
    {
        title: '特价拼团',
        desc: '在所有分类下，按照销量，展示正在拼团的前3款商品',
        button: '',
        show_switch: false,
        change: '',
        click: '',
    },
    {
        title: '活动推荐',
        desc: '首页自定义推荐分类店铺，提高店铺曝光率',
        button: '装修',
        show_switch: false,
        show_select_group_activity: true,
        change: '',
        click: 'getRec',
    },
]

const list = [
    {
        title: '特色推荐',
        desc: '尺寸为 702*348',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSearchBanner',
    },
    {
        title: 'top打卡店',
        desc: '所有团购商品店铺分类中 默认展示评分最高 且销量最高的9家店',
        button: '',
        show_switch: false,
        change: '',
        click: '',
    },
    {
        title: '广告位',
        desc: '尺寸为 702*142，仅显示一张广告图',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSearchAdver',
    },
    {
        title: '买单人气榜',
        desc: '在所有商品分类中，按销量高低展示商品',
        button: '',
        show_switch: false,
        change: '',
        click: '',
    },
    {
        title: '团购分类展示',
        desc: '展示发现页各分类商品瀑布流',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSearchRec',
    },
]

export default {
    name: 'PlatformHomeDecorate',
    components: { DecorateAdver, RecCustom },
    data() {
        return {
            is_display: '',
            data,
            list,
            url: '',
            findUrl: '',
            // 查询字段
            queryParam: {
                now_cat_id: 0,
                cat_id: 0,
                location: 0,
                size: '702*272',
                cat_name: '团购首页轮播图',
                cat_key: 'wap_group_index_top',
            },
            modalVisible: false,
            formData: {
                group_home_top_bg_style: 0,
                group_home_top_bg_color: '',
                group_home_top_bg_image: ''
            },
            topBgImageFileList: [],
            activityoptions: [],
            group_activity_recommendations: '',
        }
    },
    created() {
        this.getUrlAndRecSwitch()
        this.getUrl()
    },
    methods: {
        // 根据按钮调用不同方法
        getClick(fun, title) {
            this[fun](title)
        },
        // 首页 轮番图
        getBanner(title) {
            let param = {}
            param['now_cat_id'] = 0
            param['cat_id'] = 0
            param['location'] = 0
            param['size'] = '702*272'
            param['cat_name'] = title
            param['cat_key'] = 'wap_group_index_top'
            param['title'] = title
            this.$refs.bannerModel.getList(param)
        },
        // 首页 导航栏导航列表
        getNav(title) {
            let param = {}
            param['now_cat_id'] = 0
            param['cat_id'] = 0
            param['location'] = 0
            param['size'] = '80*80'
            param['cat_name'] = title
            param['cat_key'] = 'wap_group_index_nav'
            param['title'] = title
            this.$refs.bannerModel.getList(param)
        },
        // 首页 广告位
        getAdver(title) {
            let param = {}
            param['now_cat_id'] = 0
            param['cat_id'] = 0
            param['location'] = 0
            param['size'] = '702*142'
            param['cat_name'] = title
            param['cat_key'] = 'wap_group_index_adver'
            param['title'] = title
            this.$refs.bannerModel.getList(param)
        },
        // 发现页 特色轮番图
        getSearchBanner(title) {
            let param = {}
            param['now_cat_id'] = 0
            param['cat_id'] = 0
            param['location'] = 1
            param['size'] = '702*348'
            param['cat_name'] = title
            param['cat_key'] = 'wap_group_search_top'
            param['title'] = title
            this.$refs.bannerModel.getList(param)
        },
        // 发现页 广告位
        getSearchAdver(title) {
            let param = {}
            param['now_cat_id'] = 0
            param['cat_id'] = 0
            param['location'] = 1
            param['size'] = '702*142'
            param['cat_name'] = title
            param['cat_key'] = 'wap_group_search_adver'
            param['title'] = title
            this.$refs.bannerModel.getList(param)
        },
        // 发现页 团购分类展示
        getSearchRec(title) {
            this.$refs.recModel.getList({ cat_id: 1, title: title })
        },
        // 优选商品
        getSelect(title) {
            this.$router.push({ path: '/group/platform.groupSelect/edit', query: { cat_id: 0, type: 1 } })
        },
        // 超值组合
        getCombination(title) {
            this.$router.push({ path: '/group/platform.groupRenovationCombine/edit', query: { cat_id: 0, type: 2 } })
        },
        // 首页 店铺活动推荐
        getRec(title) {
            this.$refs.recModel.tabIndex = this.group_activity_recommendations
            this.$refs.recModel.tabCallback(this.group_activity_recommendations,true)
            this.$refs.recModel.getList({ cat_id: 0, title: title,})
        },
        getChange(fun) {
            this[fun](this.status)
        },
        changeRec(val) {
            this.is_display = val == 1 ? true : false
            this.request(groupPlatformApi.recDisplay, { is_display: val }).then((response) => {
                if (response) {
                    this.$message.success('修改成功')
                }
            })
        },
        changeShow(val) {
            this.is_display = val == 1 ? true : false
            this.request(groupPlatformApi.changeShow, { is_show: val }).then((response) => {
                if (response) {
                    this.$message.success('修改成功')
                }
            })
        },
        getUrlAndRecSwitch() {
            this.request(groupPlatformApi.getShow, { type: 'index' }).then((response) => {
                this.is_display = response.is_show == 1 ? true : false
                this.url = response.url
                this.activityoptions = response.group_activity.data
                this.group_activity_recommendations = response.group_activity.group_activity_recommendations
            })
        },
        getUrl() {
            this.request(groupPlatformApi.getUrl, { type: 'find' }).then((response) => {
                this.findUrl = response.url
            })
        },
        refreshFrame() {
            document.getElementById('myframe').contentWindow.location.reload(true)
        },
        // 团购首页顶部背景装修
        getTopBg() {
            this.topBgImageFileList = []
            this.modalVisible = true
            this.request(groupPlatformApi.getHomeTopConfig, {}).then((res) => {
                const {group_home_top_bg_style = 1,group_home_top_bg_value = ''} = res.top_config
                this.formData = {
                    group_home_top_bg_style:group_home_top_bg_style == 0?0:1,
                    group_home_top_bg_color:group_home_top_bg_style ==0?group_home_top_bg_value:'',
                    group_home_top_bg_image:group_home_top_bg_style ==1?group_home_top_bg_value:''
                }
                if(this.formData.group_home_top_bg_image) {
                    this.topBgImageFileList = [{
                        uid: 'group_home_top_bg_image',
                        url: this.formData.group_home_top_bg_image,
                        status: 'done',
                        name: 'group_home_top_bg_image',
                    }]
                }
            })
        },
        modalHandelOK() {
            let params = {
                group_home_top_bg_style: this.formData.group_home_top_bg_style,
                group_home_top_bg_value: this.formData.group_home_top_bg_style== 0?this.formData.group_home_top_bg_color:this.formData.group_home_top_bg_image
            }
            if(params.group_home_top_bg_style == 1 && !params.group_home_top_bg_value) {
                this.$message.error('请上传背景图') 
                return
            }
            this.request(groupPlatformApi.editHomeTopConfig, params).then((response) => {
                this.$message.success('修改成功')
                this.modalVisible = false
            }) 
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '', multiple = false) {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (multiple) {
                this[filedList] = fileList
                let imgs = []
                fileList.forEach((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    } else {
                        if(file.status == 'done') {
                            imgs.push(file.url)
                        }
                    }
                })
                this.$set(this.formData, fieldForm, imgs)
            } else {
                if (fileList.length) {
                    fileList = fileList.splice(-1)
                    let imgs = []
                    fileList = fileList.map((file) => {
                        if (file.response && file.status == 'done' && file.response.status == 1000) {
                            let url = file.response.data
                            imgs.push(url)
                        }
                        return file
                    })
                    this.$set(this.formData, fieldForm, imgs[0])
                    this[filedList] = fileList
                } else {
                    this.$set(this.formData, fieldForm, '')
                    this[filedList] = []
                }
            }
        },
        onGroupActivityChange(e){
            this.request(groupPlatformApi.changeActivityType,{group_activity_recommendations: e}).then((res) => {
                this.$message.success(this.L('操作成功'))
                this.refreshFrame();
            })
        },
    },
}
</script>

<style scoped>
section#contentView {
    background-color: #fff !important;
}

#title {
    font-size: 15px;
    font-weight: bold;
}

iframe {
    height: 667px;
    width: 375px;
}

button.ant-switch {
    position: relative;
    bottom: 0px;
    right: 0px;
}
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
}
.color-picker-label input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    text-align: left;
    margin-right: 20px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
}

.upload-bg-image >>> .ant-upload.ant-upload-select-picture-card {
    width: 104px;
    height: 104px;
}
</style>
