<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 搜索栏 -->
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item :label="L('搜索')">
                <a-input v-model="searchForm.store_name" :placeholder="L('请输入店铺名称')" style="width: 240px" />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20">
                    {{ L('查询') }}</a-button
                >
            </a-form-model-item>
        </a-form-model>
        <!-- 数据列表 -->
        <a-table class="mt-20" rowKey="store_id" :columns="columns" :data-source="dataList" :pagination="pagination">
            <a-button slot="action" slot-scope="text, item" type="link" @click="setDelivery(item)">{{ L('设置店铺配送') }}</a-button>
        </a-table>
        <a-modal
            v-model="visible_map"
            width="50%"
            :title="L('设置配送范围')"
            :destroyOnClose="true"
            @ok="handleOk"
            @cancel="visible_map = false"
        >
            <template slot="footer">
                <a-button v-if="form.delivery_range_type == 2" type="primary" @click="toggle">
                    {{ L('开始绘制') }}
                </a-button>
                <a-button type="primary" @click="handleOk"> {{ L('提交') }} </a-button>
                <a-button @click="visible_map = false">
                    {{ L('取消') }}
                </a-button>
            </template>
            <div class="flex flex-wrap justify-between">
                <div class="flex-1">
                    <a-form-model ref="ruleForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                        <a-form-model-item :label="L('是否开启')">
                            <a-switch
                                :checked-children="L('开启')"
                                :un-checked-children="L('关闭')"
                                :checked="form.status == 1 ? true : false"
                                @change="onStatusChange"
                            />
                        </a-form-model-item>
                        <a-form-model-item :label="L('服务范围类型')">
                            <a-select
                                @change="range_typeOnChange"
                                v-model="form.delivery_range_type"
                                style="width: 120px"
                            >
                                <a-select-option :value="1"> {{ L('半径距离') }} </a-select-option>
                                <a-select-option :value="2"> {{ L('自定义范围') }} </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item v-if="form.delivery_range_type == 1" :label="L('服务距离')">
                            <a-input-number
                                v-model="form.delivery_radius"
                                style="width: 120px"
                                :placeholder="L('请输入')"
                                :min="0"
                            />
                            <span style="margin-left: 6px">{{ L('公里') }}</span>
                        </a-form-model-item>
                        <a-form-model-item :label="L('选择配送区域')" v-if="form.delivery_range_type == 2">
                            <a-select @change="regionOnChange" v-model="form.custom_id" style="width: 120px">
                                <a-select-option :value="item.id" v-for="item in choiceList" :key="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <TiandituMap ref="drawMap" v-if="$tiandituMapKey && form.delivery_range_type == 2" drawToolType="Polygon" @overlaycomplete="isPolygonPath" :center="mapConfig.center" :zoom="mapConfig.zom"/>
                        <draw-map
                            :span="24"
                            :mapConfig="mapConfig"
                            v-else-if="form.delivery_range_type == 2"
                            @polygonPath="isPolygonPath"
                            @mapOnReady="mapOnReady"
                            :editingPath="editingPath"
                            ref="drawMap"
                        ></draw-map>
                    </a-form-model>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import mallPlatformApi from '@/api/mall/platform/index'
import DrawMap from '@/components/DrawMap/DrawMap'
import TiandituMap from '@/components/TiandituMap/indexMap' 
export default {
    name: 'platformMallDeliverySetting',
    components: {
        DrawMap,
        TiandituMap,
    },
    data() {
        return {
            //   搜索框表单
            searchForm: {
                store_name: '', // 搜索内容
            },
            //   table表格头部
            columns: [
                {
                    title: this.L('店铺ID'),
                    dataIndex: 'store_id',
                    key: 'store_id',
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    key: 'merchant_name',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('店铺名称'),
                    dataIndex: 'name',
                    key: 'name',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('商家电话'),
                    dataIndex: 'merchant_phone',
                    key: 'merchant_phone',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('店铺电话'),
                    dataIndex: 'phone',
                    key: 'phone',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'rpl_id',
                    key: 'rpl_id',
                    scopedSlots: { customRender: 'action' },
                    align: 'center'
                },
            ],
            //   列表数据
            dataList: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 15,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 ${total} 条记录`),
            },
            visible_map: false,
            form: {
                delivery_radius: 0,
                custom_id: 0,
                delivery_range_type: 1,
                delivery_range_polygon: '',
                store_id: '',
                status: 0
            },
            choiceList: [],
            mapConfig: {
                zoom: 15,
                center: { lat: 31.838546, lng: 117.217433 }, //默认中心点经纬度(亚夏汽车大厦)
                position: { lat: 31.838546, lng: 117.217433 },
            },
            detail: null,
            editingPath: true,
        }
    },
    created() {
        this.getMallStoreList({ is_search: false })
        this.choiceGetList()
    },
    methods: {
        // 获取table数据
        getMallStoreList(param) {
            let params = { ...this.searchForm }
            if (param.is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
            }
            params.page_size = this.pagination.pageSize
            this.request(mallPlatformApi.merchantStoreList, params).then((res) => {
                this.dataList = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        //地图加载完成
        mapOnReady() {
            //地图回显图形
            if (this.form.delivery_range_polygon.length > 0) {
                if (this.form.custom_id != 0) {
                    let params = null
                    this.choiceList.forEach((v) => {
                        if (v.id == this.detail.mall_delivery.custom_id) {
                            params = v
                        }
                    })
                    this.mapConfig.center = { lat: params.lat, lng: params.lng }
                    this.mapConfig.position = { lat: params.lat, lng: params.lng }
                } else {
                    this.setMapCenter()
                }
                !this.$tiandituMapKey && this.$refs.drawMap.echoToggle(this.form.delivery_range_polygon, this.form.custom_id != 0 ? false : true)
            }
        },
        setDelivery(item) {
            this.detail = JSON.parse(JSON.stringify(item))
            this.form.delivery_range_polygon = []
            if (this.detail.mall_delivery) {
                this.form.delivery_radius = this.detail.mall_delivery.delivery_radius
                this.form.custom_id = this.detail.mall_delivery.custom_id
                this.form.delivery_range_type = this.detail.mall_delivery.delivery_range_type
                this.form.delivery_range_polygon = this.detail.mall_delivery.delivery_range_polygon
                this.form.store_id = this.detail.store_id
                this.form.status = this.detail.mall_delivery && this.detail.mall_delivery.status != undefined?this.detail.mall_delivery.status:0
            } else {
                this.form.delivery_radius = 0
                this.form.custom_id = 0
                this.form.delivery_range_type = 1
                this.form.delivery_range_polygon = ''
                this.form.store_id = this.detail.store_id
                this.form.status = 0
            }
            this.visible_map = true

            //天地图回显
            if(this.$tiandituMapKey && this.form.delivery_range_type == 2){
                this.mapOnReady();
            }
        },
        // 提交搜索表单
        submitForm(is_search = false) {
            let params = { ...this.searchForm }
            params.is_search = is_search
            this.getMallStoreList(params)
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.submitForm()
        },
        //弹框确定事件
        handleOk() {
            let path = null
            let arr = []
            if (this.form.delivery_range_type == 2 && this.form.delivery_range_polygon.length == 0) {
                this.$message.warning(this.L('请绘制图形'))
                return
            }
            if (this.form.delivery_range_type == 2) {
                path = JSON.parse(JSON.stringify(this.form.delivery_range_polygon))
                path.forEach((v) => {
                    arr.push(v.lng + '-' + v.lat)
                })
            }
            this.$nextTick(() => {
                this.request(mallPlatformApi.deliverySetting, {
                    store_id: this.form.store_id,
                    delivery_range_type: this.form.delivery_range_type,
                    custom_id: this.form.custom_id,
                    delivery_radius: this.form.delivery_radius,
                    delivery_range_polygon: this.form.delivery_range_type == 1 ? '' : arr.join('|'),
                    status: this.form.status
                }).then((res) => {
                    this.visible_map = false
                    this.$message.success(this.L('设置成功'))
                    this.getMallStoreList({ is_search: false })
                })
            })
        },
        isPolygonPath(e) {
            this.form.delivery_range_polygon = e.paths[0]
            // console.log(this.form.delivery_range_polygon, '绘制完成')
        },
        toggle() {
            this.form.custom_id = 0
            this.form.delivery_range_polygon = []
            if(this.$tiandituMapKey){
                this.$refs.drawMap.openDrawTool()
            }else{
                this.$refs.drawMap.toggle()
            }
            this.setMapCenter()
        },
        //选择配送区域选择框事件
        regionOnChange(e) {
            if (e == 0) {
                this.editingPath = true
                return
            } else {
                this.editingPath = false
            }
            this.form.delivery_range_type = 2
            let params = null
            this.choiceList.forEach((v) => {
                if (v.id == e) {
                    params = v
                }
            })
            this.mapConfig.center = { lat: params.lat, lng: params.lng }
            this.mapConfig.position = { lat: params.lat, lng: params.lng }
            this.form.delivery_range_polygon = params.delivery_range_polygon
            setTimeout(() => {
                this.$refs.drawMap.echoToggle(this.form.delivery_range_polygon, false)
            }, 600)
        },
        //服务范围类型选择框事件
        range_typeOnChange(e) {
            if (e == 1) {
                this.form.custom_id = 0
            }
            if (e == 2) {
                this.setMapCenter()
            }
        },
        choiceGetList() {
            this.request(mallPlatformApi.deliverCustom).then((res) => {
                this.choiceList = res
                this.choiceList.unshift({
                    name: this.L('自定义'),
                    id: 0,
                })
            })
        },
        setMapCenter() {
            this.mapConfig.center = { lat: this.detail.lat, lng: this.detail.long }
            this.mapConfig.position = { lat: this.detail.lat, lng: this.detail.long }

            //天地图回显
            if(this.$tiandituMapKey && this.form.delivery_range_type == 2){
                this.$nextTick(()=>{
                    this.$refs.drawMap.setCenterAndZoom(this.mapConfig.center,this.mapConfig.zoom); 
                    this.$refs.drawMap.createMarker(this.mapConfig.position)
                    if(this.form.delivery_range_polygon.length > 0){
                        this.$refs.drawMap.graphicArr = this.form.delivery_range_polygon
                        this.$refs.drawMap.createGraphic()
                    }
                })
            }
        },
        onStatusChange(e) {
            this.$set(this.form, 'status', e ? 1 : 0)
        }
    },
}
</script>
