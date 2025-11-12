<template>
    <div>
        <!-- 选择店铺弹窗 -->
        <a-modal
            :visible="dialogVisible"
            title="选择店铺"
            centered
            :maskClosable="false"
            :width="600"
            @ok="chooseStoreOk"
            @cancel="chooseStoreCancel"
            destroyOnClose
        >
            <template>
                <a-form-model
                    layout="inline"
                    :model="modalSearchForm"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 22 }"
                >
                    <!-- 省市区选择 -->
                    <a-row>
                        <a-col :span="10" class="mr-10">
                            <a-cascader
                                v-model="searchForm.areaList"
                                :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
                                :options="areaList"
                                placeholder="请选择省市区"
                                @change="onAreaChange"
                            />
                        </a-col>
                        <a-col :span="10" class="mr-20">
                            <a-input
                                v-model="modalSearchForm.keyword"
                                @keyup.enter.native="selectStoreList()"
                                placeholder="输入店铺名称"
                            />
                        </a-col>
                        <a-col :span="2">
                            <a-button type="primary" @click="selectStoreList()"> 查询 </a-button>
                        </a-col>
                    </a-row>
                </a-form-model>
                <template v-if="modalTableData.length">
                    <!-- 全选 -->
                    <a-checkbox
                        style="padding-left: 7px; margin: 10px 0 5px"
                        :indeterminate="indeterminate"
                        :checked="checkAll"
                        @change="onCheckAllChange($event)"
                        >全选</a-checkbox
                    >
                    <a-row>
                        <a-col :span="24" style="font-size: 20px; padding-left: 7px">
                            <a-col
                                :span="24"
                                v-for="(item, key) in modalTableData"
                                :key="item.store_id"
                                style="line-height: 40px"
                            >
                                <div v-if="item.showRow">
                                    <a-checkbox
                                        :value="item.store_id"
                                        :checked="grouplList1.indexOf(item.store_id) != -1"
                                        :key="key"
                                        @change="getStoreId($event, item)"
                                    >
                                        {{ item.name }}
                                    </a-checkbox>
                                    <template v-if="item.package_list && item.package_list.length">
                                        <a-col :span="24">
                                            <a-radio-group
                                                name="radioGroup"
                                                @change="(e) => onExpandedRowChange(e, item)"
                                                :defaultValue="radio_check[item.store_id]"
                                            >
                                                <a-radio
                                                    v-for="item1 in item.package_list"
                                                    :value="item1.id"
                                                    :key="item1.id"
                                                >
                                                    {{ item1.name }}
                                                </a-radio>
                                            </a-radio-group>
                                        </a-col>
                                    </template>
                                </div>
                            </a-col>
                        </a-col>
                    </a-row>
                    <a-row class="text-right">
                        <template>
                            <a-pagination
                                :total="total"
                                show-less-items
                                @change="pageChange"
                                v-model="modalSearchForm.page"
                                hideOnSinglePage
                            />
                        </template>
                    </a-row>
                    <!--</div>-->
                </template>
            </template>
        </a-modal>
        <!-- 选择店铺弹窗 end -->
    </div>
</template>

<script>
import groupMerchantApi from '@/api/group/merchant/index'
import ACol from 'ant-design-vue/es/grid/Col'
import ARow from 'ant-design-vue/es/grid/Row'
const pageSize = 10

export default {
    components: { ARow, ACol },
    props: {
        // 打开弹框
        visible: {
            type: Boolean,
            default: false,
        },
        storeIdArr: {
            type: [Array, Object],
            default: () => {},
        },
    },
    watch: {
        visible(newVal, oldVal) {
            this.checkAll = false
            this.indeterminate = false
            this.grouplList1 = []
            this.storeIds = []
            this.dialogVisible = newVal
            this.getAllArea()
            this.selectStoreList()
        },
    },
    mounted() {
        this.dialogVisible = this.visible
        this.getAllArea()
        this.selectStoreList()
    },
    data() {
        return {
            checkAll: true,
            indeterminate: true,
            radio_check: {},
            total: 0,
            grouplList1: [],
            showHeader: false,
            dialogVisible: false, // 设置店铺弹窗
            areaList: [], // 省市区列表
            searchForm: {
                storeIdArray: [], // 店铺id列表
                areaList: [],
            },
            storeIds: [], // 店铺id

            // 筛选店铺列表参数
            modalSearchForm: {
                province_id: '', // 省份id
                city_id: '', // 城市id
                area_id: '', // 区域id
                keyword: '', // 关键词搜索
                page: 1, // 当前页码
            },
            columns: [
                {
                    dataIndex: 'name',
                    slots: { title: 'name' },
                    align: 'center',
                },
            ],
            modalTableData: [], // 当前页商家店铺信息
            curStoreList: [], // 选中的店铺列表
            modalSelectedRowKeys: [],
            expandedRowKeys: [],
        }
    },
    methods: {
        // 全选改变
        onCheckAllChange(e) {
            // 全选
            if (e.target.checked) {
                this.checkAll = true
                this.indeterminate = true
                this.modalTableData.forEach((e) => {
                    e.show = true
                    if (this.grouplList1.indexOf(e.store_id) == -1) {
                        this.grouplList1.push(e.store_id)
                        this.storeIds.push({
                            store_id: e.store_id,
                            package_id: '',
                            name: e.name,
                        })
                    }
                })
            } else {
                this.modalTableData.forEach((e) => {
                    e.show = false
                    let index = this.grouplList1.indexOf(e.store_id)
                    if (index > -1) {
                        this.grouplList1.splice(index, 1)
                        this.storeIds.splice(index, 1)
                    }
                })
                this.checkAll = false
                this.indeterminate = false
            }
        },
        pageChange(page, pageSize) {
            this.modalSearchForm.page = page // 当前页码
            this.modalTableData = this.modalTableDataGet(this.modalTableData, this.modalSearchForm.page)
        },
        // 选中单个店铺
        getStoreId(e, item) {
            if (e.target.checked) {
                this.grouplList1.push(e.target.value)
                this.storeIds.push({
                    store_id: item.store_id,
                    package_id: '',
                    name: item.name,
                })
                item.show = true
            } else {
                let index = this.grouplList1.indexOf(e.target.value)
                if (index > -1) {
                    this.grouplList1.splice(index, 1)
                    this.storeIds.splice(index, 1)
                }
                item.show = false
            }
            if (this.grouplList1.length == this.modalTableData.length) {
                this.indeterminate = true
                this.checkAll = true
            } else {
                this.indeterminate = false
                this.checkAll = false
            }
        },
        // 数据分页处理
        modalTableDataGet(list = [], page = 1, pageSize = 10) {
            let currentPageList = []
            if (list && list.length) {
                let startIndex = (Number(page) - 1) * pageSize
                let endIndex = Number(page) * pageSize - 1 > this.total ? this.total : Number(page) * pageSize - 1
                currentPageList = list.filter((item, index) => {
                    item.showRow = false
                    if (index >= startIndex && index <= endIndex) {
                        item.showRow = true
                    }
                    return item
                })
            }
            return currentPageList
        },
        // 获取店铺列表
        selectStoreList() {
            let params = {
                province_id: this.modalSearchForm.province_id, // 省份id
                city_id: this.modalSearchForm.city_id, // 城市id
                area_id: this.modalSearchForm.area_id, // 区域id
                keyword: this.modalSearchForm.keyword, // 关键词搜索
                page: 0,
            }
            this.radio_check = {};
            this.storeIdArr.forEach(v=>{
                if(v.package_id >= 0){
                    this.radio_check[v.store_id] = v.package_id
                }
            })
            this.request(groupMerchantApi.getMerchantStoreList, params).then((data) => {
                if (data.list && data.list.length) {
                    this.modalTableData = this.modalTableDataGet(data.list, this.modalSearchForm.page)
                } else {
                    this.modalTableData = []
                }

                this.total = data.total
                // 默认全选
                if (this.storeIdArr.length == 0) {
                    this.modalTableData.forEach((e) => {
                        let index = this.grouplList1.indexOf(e.store_id)
                        if (index == -1) {
                            this.grouplList1.push(e.store_id)
                            this.storeIds.push({
                                store_id: e.store_id,
                                package_id: '',
                                name: e.name,
                            })
                        }
                    })
                    this.checkAll = true
                    this.indeterminate = true
                } else {
                    // 编辑，传入参数storeIdArr不为[],不做全选
                    let length = 0
                    this.storeIdArr.forEach((e) => {
                        let index = this.grouplList1.indexOf(e.store_id)
                        if (index == -1) {
                            this.grouplList1.push(e.store_id)
                            this.storeIds.push({
                                store_id: e.store_id,
                                package_id: e.package_id,
                                name: e.name,
                            })
                        }
                        this.modalTableData = this.modalTableData.map((data) => {
                            if (e.store_id == data.store_id) {
                                data.show = true
                                length = length + 1
                            }
                            return data
                        })
                    })
                    if (length != this.modalTableData.length) {
                        this.checkAll = false
                        this.indeterminate = false
                    } else {
                        this.checkAll = true
                        this.indeterminate = true
                    }
                }
            })
        },
        //获取地区信息
        getAllArea() {
            this.request(groupMerchantApi.getAllArea).then((response) => {
                this.areaList = response
            })
        },
        // 选择地区完成后的回调
        onAreaChange(value) {
            this.modalSearchForm.province_id = value[0]
            this.modalSearchForm.city_id = value[1]
            this.modalSearchForm.area_id = value[2]
            this.selectStoreList()
        },
        // 选择套餐
        onExpandedRowChange(e, record) {
            let curStoreId = record.store_id // 当前店铺id
            let curPackageId = e.target.value // 套餐id
            const result = this.storeIds.findIndex((item) => item.store_id == curStoreId)
            if (result > -1) {
                this.storeIds[result].package_id = curPackageId
            } else {
                this.storeIds.push({
                    store_id: curStoreId,
                    package_id: curPackageId || '', // 对应店铺的套餐id
                    name: record.name,
                })
            }
        },
        // 店铺选择--弹窗确定
        chooseStoreOk() {
            this.$set(this.searchForm, 'storeIdArray', this.grouplList1)
            let storeNameList = []
            let storeStrName = ''
            if (this.modalTableData && this.modalTableData.length) {
                this.storeIds.forEach((item) => {
                    storeNameList.push(item.name)
                    storeStrName = storeNameList.filter((item) => item).join(',') // 选择的店铺名
                })
            } else {
                this.storeIds = []
            }

            this.$emit('submit', { storeName: storeStrName, storeIds: this.storeIds })
            this.chooseStoreCancel()
        },
        // 店铺选择--弹窗取消
        chooseStoreCancel() {
            this.modalTableData = []
            this.dialogVisible = false
            this.$emit('update:visible', this.dialogVisible)
            this.$set(this.modalSearchForm, 'keyword', '')
            this.$set(this.modalSearchForm, 'page', 1)
            this.$set(this.modalSearchForm, 'province_id', '')
            this.$set(this.modalSearchForm, 'city_id', '')
            this.$set(this.modalSearchForm, 'area_id', '')
            this.$set(this.searchForm, 'areaList', [])
        },
        // 店铺选择--表格选择
        onModalSelectChange(modalSelectedRowKeys) {
            this.expandedRowKeys = modalSelectedRowKeys
            this.storeIds = []
            this.modalSelectedRowKeys = modalSelectedRowKeys
            this.modalSelectedRowKeys.forEach((item) => {
                this.storeIds.push({
                    store_id: item,
                    package_id: '',
                })
            })
        },
    },
}
</script>

<style scoped>
.font-red {
    color: #ff3d0d;
}

.page-bar {
    margin: 40px;
}

ul,
li {
    margin: 0px;
    padding: 0px;
}

li {
    list-style: none;
}

.page-bar li:first-child > a {
    margin-left: 0px;
}

.page-bar a {
    border: 1px solid #ddd;
    text-decoration: none;
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    cursor: pointer;
}

.page-bar a:hover {
    background-color: #eee;
}

.page-bar a.banclick {
    cursor: not-allowed;
}

.page-bar .active a {
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
}

.page-bar i {
    font-style: normal;
    color: #d44950;
    margin: 0px 4px;
    font-size: 12px;
}
</style>
