<template>
    <a-card :bordered="false">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="7" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 120px;">楼栋：</p>
                        <a-select
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.single_id"
                            allowClear
                            @focus="getSingleListByVillage()"
                            @change="getFloorList(searchForm.single_id)"
                            placeholder="请选择楼栋">
                            <a-select-option v-for="item in single_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="8" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 120px;">单元：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.floor_id"
                            @change="getLayerList(searchForm.floor_id)"
                            placeholder="请选择单元">
                            <a-select-option v-for="item in floor_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="8" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 120px;">楼层：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.layer_id"
                            @change="getVacancyList(searchForm.layer_id)"
                            placeholder="请选择楼层">
                            <a-select-option v-for="item in layer_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :md="8" :sm="16" :style="`padding-left: 5px; padding-right: 5px;width: 320px`">
                    <div class="flex">
                        <p style="margin-top: 5px;width: 120px;">房间：</p>
                        <a-select
                            allowClear
                            :style="{width: 'calc(100% - 100px)'}"
                            v-model="searchForm.room_id"
                            placeholder="请选择房间">
                            <a-select-option v-for="item in room_list" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="48">
                <a-col :md="6" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">快递单号：</p>
                        <a-input style="width: 65%" allowClear placeholder="请输入快递单号"
                                 v-model="searchForm.track_num" />
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">取件码：</p>
                        <a-input style="width: 65%" allowClear placeholder="请输入取件码"
                                 v-model="searchForm.pickup_code" />
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">收件人：</p>
                        <a-input style="width: 65%" allowClear placeholder="请输入收件人"
                                 v-model="searchForm.recipient_name" />
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">收件电话 ：</p>
                        <a-input style="width: 65%" allowClear placeholder="请输入收件电话"
                                 v-model="searchForm.recipient_phone" />
                    </a-input-group>
                </a-col>
            </a-row>
            <a-row :gutter="48">
                <a-col :md="6" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">取件地址：</p>
                        <a-select allowClear v-model="searchForm.location_id" style="width: 200px">
                            <a-select-option v-for="item in locationList" :key="item.id">{{ item.location }}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">状态：</p>
                        <a-select allowClear v-model="searchForm.status" style="width: 200px">
                            <a-select-option v-for="item in statusList" :key="item.value">{{ item.lable }}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="12" :sm="48">
                    <a-button class="" type="primary" icon="search" @click="getList()">
                        查询
                    </a-button>
                    <a-button class="ml-10" icon="redo" @click="resetList()">
                        重置
                    </a-button>
                    <a-button :loading="exportLoading" class="ml-10" type="primary" icon="upload" @click="exportList()">
                        导出
                    </a-button>
                    <a-button :loading="importLoading" class="ml-10" type="primary" icon="import" @click="importList()">
                        导入
                    </a-button>
                </a-col>
            </a-row>
        </div>
        <div class="add-box">
            <!--            <a-row :gutter="48">-->
            <!--                <a-col :md="3" :sm="16">-->
            <!--                    <a-button type="primary" icon="plus" @click="$refs.DeliveryCollectionApplicationModel.add()">-->
            <!--                        添加-->
            <!--                    </a-button>-->
            <!--                </a-col>-->

            <!--            </a-row>-->
        </div>
        <uploadExcel v-if="unitVisible" :visible="unitVisible" @exit="closeUnitModal" uploadType="expressApplication" />
        <a-table :columns="columns" :data-source="list"
                 :pagination="pagination"
                 @change="tableChange"
                 :row-key="record=>record.id"
                 :row-selection="{
                    selectedRowKeys: selectedRowKeys,  // 绑定选中的行ID数组
                    onChange: onSelectChange,          // 选中状态变化时的回调
                    // 可选：设置是否可勾选（根据业务需求控制某些行是否允许选择）
                    getCheckboxProps: record => ({
                      disabled: !is_show,  // 示例：仅当is_show为true时允许勾选
                      // 也可根据record的其他字段控制，如：disabled: record.status === 99
                    })
                  }"
        >
            <span slot="action" slot-scope="text, record">
              <a v-if="is_show" @click="">编辑</a>
                <a-divider v-if="is_show" type="vertical" />
              <a @click="">详情</a>
                <a-divider v-if="is_show" type="vertical" />
              <a class="error-color" @click="">删除</a>
            </span>
        </a-table>
        <DeliveryCollectionApplicationInfo ref="DeliveryCollectionApplicationModel" @ok="addActive" />
    </a-card>
</template>

<script>
import villageApi from '@/api/community/village'
import DeliveryCollectionApplicationInfo from './deliveryCollectionApplicationInfo'
import Vue from 'vue'
import uploadExcel from '@/views/community/village/building/components/uploadExcel.vue'


export default {
    components: {
        uploadExcel,
        DeliveryCollectionApplicationInfo
    },
    data() {
        return {
            locationList: [],
            list: [],
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0
            },
            searchForm: {
                qvjian_status: 2,
                qvjian_address: '',
                project_id: '',
                express_code: '',
                pickup_code: '',
                recipient_name: '',
                recipient_phone: ''
            },
            DeliveryCollectionApplicationModel: null,
            statusList: [
                { lable: '已作废', value: 0 },
                { lable: '待取件', value: 1 },
                { lable: '已取件', value: 2 }
            ],
            project_id: '',
            villageProject: [],
            room_name: '',
            room_id: null,
            room_list: [],
            floor_id: null,
            floor_list: [],
            layer_id: null,
            layer_list: [],
            single_id: null,
            single_list: [],
            options: [],
            selectedOptionsList: [],
            columns: [
                {
                    title: '创建日期',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    ellipsis: true
                },
                {
                    title: '快递单号',
                    dataIndex: 'track_num',
                    key: 'track_num',
                    ellipsis: true
                },
                {
                    title: '取件码',
                    dataIndex: 'pickup_code',
                    key: 'pickup_code',
                    ellipsis: true
                },
                {
                    title: '收件人',
                    dataIndex: 'recipient_name',
                    key: 'recipient_name',
                    ellipsis: true
                },
                {
                    title: '收件电话',
                    dataIndex: 'recipient_phone',
                    key: 'recipient_phone',
                    ellipsis: true
                },
                {
                    title: '取件地址',
                    dataIndex: 'location',
                    key: 'location',
                    ellipsis: true
                },
                {
                    title: '取件状态',
                    dataIndex: 'status',
                    ellipsis: true,
                    customRender: (text, record) => {
                        if (record.status == 0) {
                            return '已作废'
                        } else if (record.status == 1) {
                            return '待取件'
                        } else if (record.status == 2) {
                            return '已取件'
                        } else if (record.status == 99) {
                          return '已删除'
                        }
                    }
                },
                {
                    title: '房间号',
                    dataIndex: 'room_name',
                    key: 'room_name',
                    ellipsis: true
                },
                // {
                //     title: '取件图片',
                //     dataIndex: 'img_path',
                //     key: 'img_path',
                //     ellipsis: true,
                //     customRender: (text, record) => {
                //         // 多图横向排列（每张图间距8rpx）
                //         return (
                //             <div style={{ display: 'flex', gap: '8rpx', alignItems: 'center' }}>
                //                 <img
                //                     src={record.img_path}
                //                 />
                //             </div>
                //         );
                //     }
                // },
                {
                    title: '业主备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    ellipsis: true
                },
                {
                    title: '代取结果描述',
                    dataIndex: 'reason',
                    key: 'reason',
                    ellipsis: true
                }
                // {
                //     title: '操作',
                //     key: 'action',
                //     ellipsis: true,
                //     slots: { customRender: 'action' },
                // },
            ],
            is_show: false,
            exportLoading: false,
            selectedRowKeys: [],
            exportLoading1: false,
            importLoading: false,
            unitVisible: false,
        }
    },
    mounted() {
        this.getLocationList()
        this.getList()
    },
    methods: {
        async getLocationList() {
            this.request(villageApi.getExpressPickupLocationList, {}).then((res) => {
                this.locationList = res.list
            })
        },
        tableChange(pagination) {
            this.pagination = pagination
            this.getList()
        },
        async getList() {
            var that = this
            const { current, pageSize } = this.pagination
            that.searchForm = {
                ...this.searchForm
                // single_id: this.single_id,
                // floor_id: this.floor_id,
                // layer_id: this.layer_id,
                // room_id: this.room_id,
            }
            await this.request(villageApi.getExpressApplicationList, {
                page: current,
                limit: pageSize,
                tokenName: that.tokenName,
                ...that.searchForm
            }).then((res) => {
                that.pagination.total = res.count
                if (res.count <= 0) {
                    that.pagination.current = 1
                }
                that.list = res.list
            })
        },
        resetList() {
            this.searchForm = {
                qvjian_status: 2,
                qvjian_address: '',
                project_id: '',
                express_code: '',
                pickup_code: '',
                recipient_name: '',
                recipient_phone: ''
            },
                this.pagination = {
                    pageSize: 10,
                    current: 1
                }
            this.getList()
        },
        //导出
        async exportList() {
            if (this.exportLoading) {
                return false
            }
            this.exportLoading = true
            await this.request(villageApi.exportApplicationList, {
                ...this.searchForm,
                selectedRowKeys: this.selectedRowKeys
            }).then(
                res => {
                    var downloadPath = res.url
                    var downloadLink = document.createElement('a')
                    downloadLink.style.display = 'none' // 使其隐藏
                    downloadLink.href = downloadPath
                    downloadLink.download = ''
                    downloadLink.click()
                    downloadLink.remove()
                    this.exportLoading = false
                }).catch((error) => {
                this.exportLoading = false
            })
        },
        // 添加
        addActive(val) {
            this.getList(1)
        },
        //编辑
        editActive(val) {
            this.getList()
        },
        // 楼栋号
        getSingleListByVillage() {
            var param = {
                tokenName: this.tokenName
            }
            if (this.charge_type) {
                param['charge_type'] = this.charge_type
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id
            }
            if (this.project_id) {
                param['project_id'] = this.project_id
            }
            this.request(villageApi.getSingleListByVillage, param).then(res => {
                console.log('+++++++Single', res)
                if (res) {
                    this.single_list = res
                    let array = []
                    res.map(pro => {
                        array.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                    })
                    this.options = array

                }
            })
        },
        // 单元楼
        getFloorList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            }
            if (this.charge_type) {
                param['charge_type'] = this.charge_type
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id
            }
            if (this.project_id) {
                param['project_id'] = this.project_id
            }
            return new Promise(resolve => {
                this.request(villageApi.getFloorList, param).then(res => {
                    console.log('+++++++Single', res)
                    console.log('resolve', resolve)
                    resolve(res)
                    this.floor_list = res
                })
            })
        },
        // 楼层
        getLayerList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            }
            if (this.charge_type) {
                param['charge_type'] = this.charge_type
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id
            }
            if (this.project_id) {
                param['project_id'] = this.project_id
            }
            return new Promise(resolve => {
                this.request(villageApi.getLayerList, param).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        resolve(res)
                        this.layer_list = res
                    }
                })
            })
        },
        // 房间
        getVacancyList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            }
            if (this.charge_type) {
                param['charge_type'] = this.charge_type
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id
            }
            if (this.project_id) {
                param['project_id'] = this.project_id
            }
            return new Promise(resolve => {
                this.request(villageApi.getVacancyList, param).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        resolve(res)
                        this.room_list = res
                    }
                })
            })
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
            // 可在此处处理选中逻辑，如：记录选中的行数据
            console.log('选中的行ID：', selectedRowKeys)
        },
        //下载导入模板
        async downloadExportTemplate() {
            if (this.exportLoading1) {
                return false
            }
            this.exportLoading1 = true
            await this.request(villageApi.downloadExportTemplate, {}).then(
                res => {
                    var downloadPath = res.url
                    var downloadLink = document.createElement('a')
                    downloadLink.style.display = 'none' // 使其隐藏
                    downloadLink.href = downloadPath
                    downloadLink.download = ''
                    downloadLink.click()
                    downloadLink.remove()
                    this.exportLoading1 = false
                }).catch((error) => {
                this.exportLoading1 = false
            })
        },
        //导入
        async importList() {

            this.unitVisible = true
            // await this.request(villageApi.importApplicationList, {
            //
            // }).then(
            //     res => {
            //         var downloadPath = res.url
            //         var downloadLink = document.createElement('a')
            //         downloadLink.style.display = 'none' // 使其隐藏
            //         downloadLink.href = downloadPath
            //         downloadLink.download = ''
            //         downloadLink.click()
            //         downloadLink.remove()
            //         this.exportLoading1 = false
            //     }).catch((error) => {
            //     this.exportLoading1 = false
            // })
        },
        closeUnitModal() {
            this.unitVisible = false
        },
    }
}
</script>

<style scoped lang="less">
.search-box {
    padding-left: 20px;
}

.add-box {
    padding-bottom: 20px;
}
</style>