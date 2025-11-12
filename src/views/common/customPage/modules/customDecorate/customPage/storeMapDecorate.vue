<template>
    <div>
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <div class="map-set flex align-center justify-between">
                <span>{{ L('地图设置：') }}</span>
                <span class="flex-1 address-name no-wrap" v-if="formData && formData.list">{{
                    formData.list.site
                }}</span>
                <!-- <span class="flex-1 address-name no-wrap" v-else>{{ L('亚夏汽车大厦') }}</span> -->
                <a-button type="primary" @click="showMapModal">
                    <span>{{ L('切换位置') }}</span>
                </a-button>
            </div>
        </div>
        <a-modal
            v-model="visible"
            width="1000px"
            :title="L('地图')"
            :destroyOnClose="true"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <div v-if="$tiandituMapKey" >
                <!-- 天地图 start -->
                <TiandituMap ref="tiandituMap"
                :center="postionMap" 
                :zoom="zoom" 
                :positionMarker="postionMap" 
                isChooseLocation 
                @selectLocationPoint="selectLocationPoint" />
                <!-- 天地图 end -->
            </div>
            <div class="flex flex-wrap justify-between" v-else>
                <div style="width: 260px" class="flex">
                    <a-input
                        v-model="cityKeyword"
                        :placeholder="L('城市名称')"
                        @change="showPanelInput"
                        style="margin-right: 6px"
                    >
                    </a-input>
                    <a-input
                        v-model="addressKeyword"
                        :placeholder="L('请输入关键字')"
                        @change="showPanelInput"
                        style="width: 200px"
                    >
                    </a-input>
                </div>
                <div class="flex-1 ml-40">
                    <!-- 百度地图 -->
                    <baidu-map
                        class="bm-view"
                        :zoom="zoom"
                        :center="postionMap"
                        :scroll-wheel-zoom="true"
                        @click="getLocationPoint"
                    >
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                        <bm-map-type
                            :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
                            anchor="BMAP_ANCHOR_TOP_RIGHT"
                        >
                        </bm-map-type>
                        <bm-local-search
                            :keyword="addressKeyword"
                            :location="cityKeyword"
                            :zoom="zoom"
                            :auto-viewport="true"
                            @infohtmlset="infohtmlset"
                            :panel="showPanel"
                            class="searchRes"
                        ></bm-local-search>
                        <bm-marker :position="postionMap" :dragging="true"> </bm-marker>
                    </baidu-map>
                    <!-- 百度地图 end -->
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import customPageApi from '@/api/common/platform/customPage'
import TiandituMap from '@/components/TiandituMap/indexMap' 
export default {
    components: {
        componentDesc,
        TiandituMap,
    },
    props: {
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            desc: {
                title: this.L('地图'),
            },
            formData: '',
            source: this.$route.query.source || '', // 来源 platform => 平台 merchant => 商家 store => 店铺
            storeInfo: [], // 店铺信息
            visible: false,
            showPanel: false,
            zoom: 12.8, // 地图缩放比例
            postionMap: {
                lng: 116.405994,
                lat: 39.91737,
            }, //中心点坐标
            addressKeyword: '', // 搜索框地址关键词
            cityKeyword: '', // 搜索框城市关键字
            add: {},
        }
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
    },
    mounted() {
        if (this.formContent) {
            this.formData = {}
            for (let k in this.formContent) {
                this.$set(this.formData, k, this.formContent[k])
            }
        }
        // 如果来源是店铺时，默认定位到当前店铺地址
        if (this.source && this.source == 'store') {
            // 如果非自定义店铺位置 根据配置店铺时的坐标默认展示
            if (
                (this.formData && this.formData.list && !this.formData.list.customAddress) ||
                !this.formData ||
                (this.formData && !this.formData.list)
            ) {
                this.getStoreInfo()
            }
        }
    },
    methods: {
        // 获取店铺信息
        getStoreInfo() {
            let params = {
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.getMerchantStoreMsg, params).then((res) => {
                this.storeInfo = res || []
                this.postionMap.lng = Number(this.storeInfo.store.long)
                this.postionMap.lat = Number(this.storeInfo.store.lat)
                this.add.lng = Number(this.storeInfo.store.long)
                this.add.lat = Number(this.storeInfo.store.lat)
                this.add.siteName = this.storeInfo.store.name
                this.add.site = this.storeInfo.store.adress
                this.$set(this.formData, 'list', this.add)
                this.$emit('updatePageInfo', this.formData)
            })
        },
        // 打开地图弹窗
        showMapModal() {
            this.visible = true
        },
        // 弹窗确定
        handleOk() {
            this.visible = false
            this.$emit('updatePageInfo', this.formData)
        },
        // 弹窗取消
        handleCancel() {
            this.visible = false
        },
        // 搜索框完成地址检索后的回调
        infohtmlset(res) {
            if (res) {
                this.postionMap.lng = res.point.lng
                this.postionMap.lat = res.point.lat
                this.add.siteName = res.title
                this.add.site = res.address
                this.add.lng = res.point.lng
                this.add.lat = res.point.lat
                this.addressKeyword = res.title
                this.$set(this.add, 'customAddress', true)
            }
            this.$set(this.formData, 'list', this.add)
        },
        showPanelInput() {
            this.showPanel = !this.showPanel
        },
        // 点击地图获取信息
        getLocationPoint(info) {
            this.postionMap.lng = info.point.lng
            this.postionMap.lat = info.point.lat
            this.add.lng = info.point.lng
            this.add.lat = info.point.lat
            this.zoom = info.target.getZoom()
            this.$set(this.add, 'customAddress', true)
            //创建地址解析器的实例
            let geocoder = new BMap.Geocoder()
            geocoder.getLocation(info.point, (res) => {
                // 获取到的详细地址
                this.add.site = res.address
                if (res.surroundingPois) {
                    res.surroundingPois.map((item) => {
                        if (item) {
                            this.add.siteName = item.title
                            this.addressKeyword = item.title
                        }
                    })
                }
            })
            this.$set(this.formData, 'list', this.add)
        },
        selectLocationPoint(res){
            if (res) {
                this.postionMap.lng = res.point.lng
                this.postionMap.lat = res.point.lat
                this.add.lng = res.point.lng
                this.add.lat = res.point.lat
                if(res.data){
                    this.add.siteName = res.data.name
                    this.add.site = res.data.address
                }
                this.$set(this.add, 'customAddress', true)
            }
            this.$set(this.formData, 'list', this.add)
            this.$forceUpdate()
        },
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
}

.map-set {
    font-size: 14px;
    font-weight: 400;
    color: #323233;
}

.address-name {
    color: #155bd4;
    padding: 0 10px 0 4px;
}

.bm-view {
    width: 650px;
    height: 500px;
}

.bm-view >>> .searchRes {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 120px;
    width: 260px;
    margin-left: 24px;
}
</style>
