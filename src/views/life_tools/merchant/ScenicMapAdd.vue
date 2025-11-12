<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="地图标注">
                <a-row>
                    <a-button type="primary" class="mr-20" @click="mapPlaceHandleEdit()">添加</a-button>
                    <a-button
                        type="danger"
                        class="mr-20"
                        v-if="mapPlaceList.length && selectedRowKeys.length"
                        @click="mapPlaceHandleDel(-1)"
                        >删除</a-button
                    >
                </a-row>
                <a-table
                    class="mt-20"
                    rowKey="id"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :columns="mapPlaceColumns"
                    :data-source="mapPlaceList"
                >
                    <span slot="lng_lat" slot-scope="text, record">
                        <span class="mr-10">{{ record.longitude }}</span
                        ><span>{{ record.latitude }}</span>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a href="javascript:;" @click="mapPlaceHandleDel(record.id)">删除</a>
                        <a href="javascript:;" class="ml-20" @click="mapPlaceHandleEdit(record)">编辑</a>
                    </span>
                </a-table>
            </a-form-model-item>
            <a-form-model-item label="推荐路线">
                <a-row>
                    <a-button type="primary" class="mr-20" @click="recomRouteHandleAdd()">添加</a-button>
                </a-row>
            </a-form-model-item>
            <a-form-model-item label="  " :colon="false" v-if="mapLineList.length">
                <div
                    v-for="(item, index) in mapLineList"
                    :key="index"
                    class="pt-20 pb-20 inner-form"
                    :class="index != 0 ? 'mt-20' : null"
                >
                    <a-form-model-item label="路线名称" class="flex-input" :required="true">
                        <a-row type="flex">
                            <a-col span="20"><a-input v-model="item.name" placeholder="请输入路线名称" /></a-col>
                            <a-col span="2" offset="1"
                                ><a href="javascript:;" class="btn cr-red" @click="delMapLine(index)">删除</a></a-col
                            >
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item label="路线排序">
                        <a-row>
                            <a-button type="primary" @click="routeSortHandleAdd(index)">添加</a-button>
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item
                        :label="`游览顺序${routeSortIndex + 1}`"
                        v-for="(routeSortItem, routeSortIndex) in item.location_ids"
                        :key="`${index}_${routeSortIndex}`"
                        :label-col="{ ...labelCol, offset: 2 }"
                    >
                        <a-row type="flex">
                            <a-col span="17">
                                <a-select
                                    v-model="routeSortItem.id"
                                    placeholder="请选择"
                                    :options="getRouteSortOptions(index, routeSortItem.id)"
                                >
                                </a-select>
                            </a-col>
                            <a-col span="2" offset="1">
                                <a
                                    href="javascript:;"
                                    class="btn cr-red"
                                    @click="delRouteSortItem(index, routeSortIndex)"
                                    >删除</a
                                >
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item label="上传路线周边图片">
                        <a-row type="flex">
                            <a-col span="24">
                                <a-upload
                                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                    accept="image/*"
                                    list-type="picture-card"
                                    :file-list="item.fileList"
                                    name="reply_pic"
                                    :data="{ upload_dir: 'merchant/life_tools/tools' }"
                                    @preview="handlePreviewImg"
                                    @change="handleRecomRouteUpload($event, index, 'scenic_location_img')"
                                >
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">上传</div>
                                </a-upload>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item label="路线绘制" :required="true">
                        <a-button type="primary" @click="setPolyline(index)">绘制路线</a-button>
                    </a-form-model-item>
                </div>
            </a-form-model-item>
            <a-form-model-item label=" " :colon="false" v-if="mapLineList.length">
                <a-button type="primary" class="mt-20" @click="handleSave()">保存</a-button>
            </a-form-model-item>
        </a-form-model>

        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            :maskClosable="false"
            @ok="modalHandleOk"
            @cancel="modalHandleCancel"
            width="60%"
            :destroyOnClose="true"
            :bodyStyle="{
                maxHeight: '70vh',
                overflowY: 'auto',
            }"
        >
            <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" :model="mapPlaceFormData">
                <a-form-model-item label="名称" :required="true">
                    <a-input v-model="mapPlaceFormData.name" placeholder="请输入名称" />
                </a-form-model-item>
                <a-form-model-item label="店铺链接">
                    <a-input-search
                        placeholder="请输入"
                        enter-button="功能库"
                        v-model="mapPlaceFormData.merchant_url"
                        @search="addLinkUrl()"
                    />
                </a-form-model-item>
                <a-form-model-item label="店铺前往按钮名称">
                    <a-input v-model="mapPlaceFormData.btn_text" placeholder="请输入店铺前往按钮名称" />
                </a-form-model-item>
                <a-form-model-item label="选择分类" :required="true">
                    <a-select
                        v-model="mapPlaceFormData.category_id"
                        placeholder="请选择分类"
                        :options="catOptions"
                        :showSearch="true"
                    >
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="经纬度" :required="true">
                    <a-input style="width: 200px" readOnly :value="mapPlaceFormData.lnglat" placeholder="请选择位置" />
                    <a @click="$refs.mapPointModel.selectPoint(mapPlaceFormData.lnglat)" class="ml-10">地图选点</a>
                </a-form-model-item>
                <a-form-model-item label="上传标记点图标" help="">
                    <a-row type="flex">
                        <a-col span="20"
                            ><a-upload
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                accept="image/*"
                                list-type="picture"
                                name="reply_pic"
                                :data="{ upload_dir: 'merchant/life_tools/tools' }"
                                :showUploadList="false"
                                @change="handleMapPlaceUpload($event, 'mark_icon')"
                            >
                                <a-button class="mb-20"> <a-icon type="upload" /> 上传文件 </a-button>
                                <div class="ant-form-explain">推荐尺寸70 * 70</div>
                            </a-upload></a-col
                        >
                    </a-row>
                    <a-row v-if="mapPlaceFormData.mark_icon" type="flex">
                        <a-col span="16">
                            <div class="upload-img-list">
                                <img :src="mapPlaceFormData.mark_icon" alt="" class="img" />
                                <a-icon type="delete" class="pointer" @click="handleMapMarkersUploadDel('mark_icon')" />
                            </div>
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item label="周边监控">
                    <a-button type="primary" @click="addMonitor">添加</a-button>
                </a-form-model-item>
                <a-form-model-item
                    label="  "
                    :colon="false"
                    v-if="mapPlaceFormData.monitor && mapPlaceFormData.monitor.length"
                >
                    <div
                        v-for="(item, index) in mapPlaceFormData.monitor"
                        :key="index"
                        class="pt-20 pb-20 inner-form"
                        :class="index != 0 ? 'mt-20' : null"
                    >
                        <a-form-model-item label="监控名称" class="flex-input">
                            <a-row type="flex">
                                <a-col span="20"><a-input v-model="item.name" placeholder="请输入监控名称" /></a-col>
                                <a-col span="2" offset="1"
                                    ><a href="javascript:;" class="btn cr-red" @click="delMonitorItem(index)"
                                        >删除</a
                                    ></a-col
                                >
                            </a-row>
                        </a-form-model-item>
                        <a-form-model-item label="监控链接">
                            <a-row type="flex">
                                <a-col span="20"><a-input v-model="item.url" placeholder="请输入监控链接" /></a-col>
                            </a-row>
                        </a-form-model-item>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="上传语音介绍" help="上传MP3格式文件，推荐小于10M">
                    <a-row type="flex">
                        <a-col span="20" class="mb-20"
                            ><a-upload
                                action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                                accept=".mp3,.MP3"
                                list-type="picture"
                                name="file"
                                :data="{ upload_dir: 'merchant/life_tools/tools' }"
                                :showUploadList="false"
                                @change="handleMapPlaceUpload($event, 'order_introduce')"
                            >
                                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                            </a-upload></a-col
                        >
                    </a-row>
                    <a-row v-if="mapPlaceFormData.order_introduce" type="flex">
                        <div class="upload-img-list mb-20">
                            <a :href="mapPlaceFormData.order_introduce" class="pointer" target="blank"
                                ><a-icon type="link" class="mr-10" />语音文件</a
                            >
                            <a-icon
                                type="delete"
                                class="pointer"
                                @click="handleMapMarkersUploadDel('order_introduce')"
                            />
                        </div>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item label="上传周边图片" help="推荐上传3张-10张，图片格式建议上传png/jpg，尺寸1:1">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="mapPlaceFileList"
                        name="reply_pic"
                        :data="{ upload_dir: 'merchant/life_tools/tools' }"
                        @preview="handlePreviewImg"
                        @change="handleMapPlaceUpload($event, 'location_img', true)"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="单位名称">
                    <a-input v-model="mapPlaceFormData.place_name" placeholder="请输入单位名称"></a-input>
                </a-form-model-item>
                <a-form-model-item label="标注点简介" :required="true">
                    <a-input type="textarea" :maxLength="-1" v-model="mapPlaceFormData.introduction" placeholder="请输入标注点简介"></a-input>
                </a-form-model-item>
                <a-form-model-item label="详细描述">
                    <rich-text :info.sync="mapPlaceFormData.desc" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <map-point @loadRefresh="setLongLat" ref="mapPointModel" />
        <mapPolyline ref="mapPolyline" @conform="getPolyLine"></mapPolyline>

        <a-modal :visible="previewVisible" :footer="null" @cancel=";(previewVisible = false), (previewImage = '')">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
import mapPoint from './modules/mapPoint.vue'
import RichText from '@/components/RichText/RichText2'
import mapPolyline from './modules/mapPolyline.vue'
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
export default {
    name: 'ScenicMapAdd',
    components: {
        mapPoint,
        RichText,
        mapPolyline,
    },
    data() {
        return {
            // 图片预览
            previewVisible: false,
            previewImage: '',
            // 表单
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
            // 弹框显隐
            modalVisible: false,
            // 弹框标题
            modalTitle: '',
            // 选择分类options
            catOptions: [],
            // 地图标注table
            mapPlaceColumns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                },
                {
                    title: '经纬度',
                    dataIndex: 'lng_lat',
                    scopedSlots: { customRender: 'lng_lat' },
                },
                {
                    title: '分类',
                    dataIndex: 'category_name',
                },
                {
                    title: '地址',
                    dataIndex: 'address',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            selectedRowKeys: [],
            // 标注列表
            mapPlaceList: [],
            // 地图标注form
            mapPlaceFormData: '',
            // 地图标注周边图片
            mapPlaceFileList: [],
            // 路线推荐绘制下标
            setPolylineIndex: -1,
            // 推荐路线
            mapLineList: [],
            // 景区地图id
            map_id: '',
        }
    },
    mounted() {
        this.map_id = this.$route.query.id || ''
        if (this.map_id) {
            this.getMapPlaceList()
            this.getMapLineList()
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        // 获取分类
        getOptions() {
            this.request(lifeToolsMerchantApi.scenicMapPlaceCatList, {}).then((res) => {
                this.catOptions =
                    res && res.length
                        ? res.map((item) => {
                              return {
                                  value: item.id,
                                  label: item.name,
                              }
                          })
                        : []
            })
        },
        // 获取标注列表
        getMapPlaceList() {
            let params = {
                map_id: this.map_id,
            }
            this.request(lifeToolsMerchantApi.scenicMapPlaceList, params).then((res) => {
                this.mapPlaceList = res || []
            })
        },
        // 获取推荐路线列表
        getMapLineList() {
            let params = {
                map_id: this.map_id,
            }
            this.request(lifeToolsMerchantApi.scenicMapLineList, params).then((res) => {
                this.mapLineList = res && res.length ? this.initMapLineList(res) : []
                console.log('this.mapLineList', this.mapLineList)
            })
        },
        // 表格复选框选择
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        // 初始化推荐路线周边图片、游览排序
        initMapLineList(list = []) {
            if (list.length) {
                list.forEach((item) => {
                    if (item.scenic_location_img && item.scenic_location_img.length) {
                        item.fileList = item.scenic_location_img.map((subItem, subIndex) => {
                            return {
                                uid: subIndex,
                                name: 'image',
                                status: 'done',
                                url: subItem,
                            }
                        })
                    }
                    if (item.location_ids && item.location_ids.length) {
                        item.location_ids = item.location_ids.map((idItem) => {
                            return {
                                id: idItem - 0,
                            }
                        })
                    }
                })
            }
            return list
        },
        // 弹框ok添加 || 编辑标注
        modalHandleOk() {
            if (!this.mapPlaceFormData.name) {
                this.$message.error('请输入地图标注名称')
                return
            }
            if (!this.mapPlaceFormData.category_id) {
                this.$message.error('请选择分类')
                return
            }
            if (!this.mapPlaceFormData.lnglat) {
                this.$message.error('请添加经纬度')
                return
            }

            if(!this.mapPlaceFormData.introduction) {
                this.$message.error('请输入标记点简介')
                return
            }

            let params = {
                ...this.mapPlaceFormData,
                category_id: this.mapPlaceFormData.category_id || '',
            }
            this.$delete(params, 'lnglat')
            this.$delete(params, 'category_name')

            this.request(lifeToolsMerchantApi.scenicMapPlaceSave, params).then((res) => {
                this.$message.success('操作成功', 1, () => {
                    this.modalHandleCancel()
                    this.getMapPlaceList()
                })
            })
        },
        // 弹框cancel
        modalHandleCancel() {
            this.modalVisible = false
            this.modalTitle = ''
            this.mapPlaceFileList = []
        },
        // 地图标注删除
        mapPlaceHandleDel(id = -1) {
            this.$confirm({
                title: '是否确定删除地图标注?',
                centered: true,
                onOk: () => {
                    let params = {
                        map_id: this.map_id,
                        place_ids: id != -1 ? [id] : this.selectedRowKeys,
                    }
                    this.request(lifeToolsMerchantApi.scenicMapPlaceDel, params).then((res) => {
                        this.$message.success('操作成功', 1, () => {
                            this.updateRecomRoute(params.place_id)
                            this.getMapPlaceList()
                            this.selectedRowKeys = []
                        })
                    })
                },
                onCancel() {},
            })
        },
        // 推荐路线中已选择的被删除后重置
        updateRecomRoute(delIdArr = []) {
            let mapLineList = this.mapLineList || []
            if (mapLineList.length && delIdArr.length) {
                mapLineList.forEach((item) => {
                    if (item.location_ids && item.location_ids.length) {
                        item.location_ids.forEach((subItem) => {
                            if (delIdArr.findIndex((delId) => delId == subItem.id) != -1) {
                                subItem.id = undefined
                            }
                        })
                    }
                })
                this.mapLineList = mapLineList
            }
        },
        // 地图标注添加 || 编辑
        mapPlaceHandleEdit(record = '') {
            if (!record) {
                this.mapPlaceFormData = {
                    id: '',
                    map_id: this.map_id,
                    // 名称
                    name: '',
                    // 店铺链接
                    merchant_url: '',
                    // 店铺前往按钮名称
                    btn_text: '',
                    // 分类id
                    category_id: undefined,
                    // 经度
                    longitude: '',
                    // 纬度
                    latitude: '',
                    // 地址
                    address: '',
                    // 标记点图标
                    mark_icon: '',
                    // 周边监控
                    monitor: [],
                    // 语音介绍
                    order_introduce: '',
                    // 周边图片
                    location_img: [],
                    // 单位名称
                    place_name: '',
                    // 详细描述
                    desc: '',
                    // 经纬度
                    lnglat: '',
                    // 标注点简介
                    introduction: ''
                }
                this.modalTitle = '添加地图标注'
            } else {
                this.mapPlaceFormData = {
                    lnglat: `${record.longitude},${record.latitude}`,
                    ...record,
                    map_id: this.map_id,
                }
                this.modalTitle = '编辑地图标注'
                let location_img = record.location_img || []
                this.mapPlaceFileList = location_img.map((file, index) => {
                    return {
                        uid: index,
                        name: 'image',
                        status: 'done',
                        url: file,
                    }
                })
            }
            this.getOptions()
            this.modalVisible = true
        },
        // 功能库
        addLinkUrl() {
            this.$LinkBases({
                source: 'merchant', // 必填
                type: 'h5', // 必填
                // 确定按钮
                handleOkBtn: (res) => {
                    this.$set(this.mapPlaceFormData, 'merchant_url', res.url)
                },
            })
        },
        // 地图选点
        setLongLat(lnglat, position) {
            this.mapPlaceFormData.lnglat = lnglat
            this.mapPlaceFormData.longitude = position.lng
            this.mapPlaceFormData.latitude = position.lat
            this.mapPlaceFormData.address = position.address
        },
        // 添加监控
        addMonitor() {
            let monitor = this.mapPlaceFormData.monitor || []
            monitor.push({
                name: '',
                url: '',
            })
            this.$set(this.mapPlaceFormData, 'monitor', monitor)
        },
        // 标记点图标上传 语音文件上传
        handleMapPlaceUpload(info, field, isMulti = false) {
            let fileList = [...info.fileList]
            if (fileList.length) {
                if (isMulti) {
                    let imgs = []
                    this.mapPlaceFileList = fileList.map((file) => {
                        if (file.response) {
                            let url = file.response.data
                            imgs.push(url)
                        } else {
                            if (file.status == 'done' && file.url) {
                                imgs.push(file.url)
                            }
                        }
                        return file
                    })

                    this.$set(this.mapPlaceFormData, field, imgs)
                } else {
                    fileList = fileList.slice(-1)
                    fileList = fileList.map((file) => {
                        if (file.response) {
                            let url = file.response.data
                            this.$set(this.mapPlaceFormData, field, url)
                        } else {
                            if (file.status == 'done' && file.url) {
                                this.$set(this.mapPlaceFormData, field, file.url)
                            }
                        }
                        return file
                    })
                }
            } else {
                this.mapPlaceFileList = []
                if (isMulti) {
                    this.$set(this.mapPlaceFormData, field, [])
                } else {
                    this.$set(this.mapPlaceFormData, field, '')
                }
            }
        },
        // 标记点图标删除
        handleMapMarkersUploadDel(field) {
            this.$set(this.mapPlaceFormData, field, '')
        },
        // 监控删除
        delMonitorItem(index) {
            this.$delete(this.mapPlaceFormData['monitor'], index)
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 推荐路线添加
        recomRouteHandleAdd() {
            this.mapLineList.push({
                id: '',
                map_id: this.map_id,
                // 路线名称
                name: '',
                // 路线排序
                location_ids: [],
                // 周边图片
                scenic_location_img: [],
                // 路线绘制
                scenic_location_line: [],
            })
        },
        // 推荐路线删除
        delMapLine(index) {
            let record = this.mapLineList[index]
            this.$confirm({
                title: '是否确定删除推荐路线?',
                centered: true,
                onOk: () => {
                    if (!record.id) {
                        this.$delete(this.mapLineList, index)
                    } else {
                        let params = {
                            map_id: this.map_id,
                            line_id: record.id,
                        }

                        this.request(lifeToolsMerchantApi.scenicMapLineDel, params).then((res) => {
                            this.$message.success('操作成功', 1, () => {
                                this.$delete(this.mapLineList, index)
                            })
                        })
                    }
                },
                onCancel() {},
            })
        },
        // 路线排序添加
        routeSortHandleAdd(index) {
            let location_ids = this.mapLineList[index]['location_ids'] || []
            location_ids.push({
                id: undefined,
            })
            this.$set(this.mapLineList[index], 'location_ids', location_ids)
        },
        // 游览顺序删除
        delRouteSortItem(index, routeSortIndex) {
            let location_ids = this.mapLineList[index]['location_ids']
            this.$delete(location_ids, routeSortIndex)
            this.$set(this.mapLineList[index], 'location_ids', location_ids)
        },
        // 获取游览顺序options
        getRouteSortOptions(index, curId = '') {
            let mapPlaceList = this.mapPlaceList || []
            if (!mapPlaceList.length) {
                return mapPlaceList
            } else {
                let options = mapPlaceList.map((item) => {
                    return {
                        value: item.id - 0,
                        label: item.name,
                    }
                })
                let location_ids = this.mapLineList[index]['location_ids'] || []
                if (curId && location_ids.length) {
                    location_ids = location_ids.filter((item) => item.id != curId)
                }
                if (location_ids.length) {
                    location_ids.forEach((item) => {
                        let index = options.findIndex((optItem) => optItem.value == item.id)
                        if (index != -1) {
                            this.$set(options[index], 'disabled', true)
                        }
                    })
                }
                return options
            }
        },
        // 推荐路线上传周边图片
        handleRecomRouteUpload(info, index, field) {
            let fileList = [...info.fileList]
            if (fileList.length) {
                let imgs = [];
                fileList = fileList.map((file) => {
                    if (file.name == 'image' && file.url) {
                        let url = file.url
                        imgs.push(url)
                    }
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.mapLineList[index], field, imgs)
                this.$set(this.mapLineList[index], 'fileList', fileList)
            } else {
                this.$set(this.mapLineList[index], field, [])
                this.$set(this.mapLineList[index], 'fileList', [])
            }
        },
        // 绘制路线
        setPolyline(index) {
            this.setPolylineIndex = index
            let cur = this.mapLineList[index]
            let polylinePath = cur['scenic_location_line'] || []
            if (polylinePath.length) {
                polylinePath = polylinePath.map((item) => {
                    return {
                        lng: item.longitude,
                        lat: item.latitude,
                    }
                })
            }
            let mapPlaceList = this.mapPlaceList || []
            let routeSort = []
            let defaultPolylinePath = []
            if (cur.location_ids && cur.location_ids.length && mapPlaceList.length) {
                cur.location_ids.forEach((item) => {
                    mapPlaceList.forEach((mapItem) => {
                        if (item.id == mapItem.id) {
                            if (!polylinePath.length) {
                                defaultPolylinePath.push({
                                    lng: mapItem.longitude,
                                    lat: mapItem.latitude,
                                })
                            }

                            routeSort.push({ ...mapItem, lng: mapItem.longitude, lat: mapItem.latitude })
                        }
                    })
                })
            }
            if (!polylinePath.length) {
                polylinePath = defaultPolylinePath
            }
            this.$refs.mapPolyline.setPolyline(polylinePath, routeSort)
        },
        // 获取绘制坐标
        getPolyLine(polylinePath) {
            console.log('polylinePath',polylinePath)
            if (polylinePath.length) {
                polylinePath = polylinePath.map(item => {
                    return {
                        longitude: item.lng,
                        latitude: item.lat,
                    }
                })
            }
            this.$set(this.mapLineList[this.setPolylineIndex], 'scenic_location_line', polylinePath)
            this.setPolylineIndex = -1
        },
        // 保存
        handleSave() {
            let chechResult = true
            let mapLineList = JSON.parse(JSON.stringify(this.mapLineList)) || []
            if (mapLineList.length) {
                mapLineList = mapLineList.map((item) => {
                    if (item.fileList) {
                        this.$delete(item, 'fileList')
                    }
                    if (item.location_ids && item.location_ids.length) {
                        item.location_ids = item.location_ids
                            .filter((subItem) => subItem && subItem.id && subItem.id != undefined)
                            .map((subItem) => subItem.id)
                    }
                    return item
                })
                try {
                    mapLineList.forEach((item) => {
                        if (!item.name) {
                            this.$message.error('请输入推荐路线名称')
                            chechResult = false
                            throw Error()
                        }

                        if (
                            !item.scenic_location_line ||
                            (item.scenic_location_line && !item.scenic_location_line.length)
                        ) {
                            this.$message.error('请绘制推荐路线')
                            chechResult = false
                            throw Error()
                        }
                    })
                } catch (err) {}
            }
            if (!chechResult) return
            this.request(lifeToolsMerchantApi.scenicMapLineSave, { map_lines: mapLineList }).then((res) => {
                this.$message.success('操作成功', 1, () => {
                    this.$router.push({ path: '/merchant/merchant.life_tools/ScenicMapList' })
                })
            })
        },
    },
}
</script>

<style scoped>
.inner-form {
    background: #f4f4f4;
}
.upload-img-list {
    width: 50%;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    line-height: 28px;
}
.upload-img-list .img {
    width: 35px;
    height: 35px;
}
</style>