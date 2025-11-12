/** * 套餐编辑 * @author 钱大双 * @date 2020-12-15 */
<template>
    <div class="mt-20 ml-10 mr-10 mb-20" style="background: #fff">
        <a-tabs :activeKey="key" @change="callback">
            <a-tab-pane key="1" :tab="L('基本信息')" style="padding: 0 20px; background: #fff">
                <a-form-model
                    v-bind="{
                        labelCol: { span: 4 },
                        wrapperCol: { span: 18 },
                    }"
                    :model="formData"
                    :rules="rules"
                    ref="form"
                >
                    <a-form-model-item :label="L('套餐名称')" prop="name">
                        <a-input v-model="formData.name" :placeholder="L('请输入套餐名称')" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('套餐价格')" prop="price">
                        <a-input-number v-model="formData.price" :min="0" /> {{ L('元') }}
                    </a-form-model-item>
                    <a-form-model-item :label="L('用户是否可下单')">
                        <a-radio-group v-model="formData.is_order">
                            <a-radio :value="1"> {{ L('是') }}</a-radio>
                            <a-radio :value="0"> {{ L('否') }}</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-item :label="L('套餐详情')" :help="L('最多200字')">
                        <a-input type="textarea" v-model="formData.note" :placeholder="L('请输入套餐详情')" />
                    </a-form-item>

                    <a-form-model-item :label="L('套餐图片')" :help="L('建议900*500px')">
                        <a-upload
                            name="reply_pic"
                            :file-list="fileList"
                            :action="uploadImg"
                            :headers="headers"
                            :data="upload_dir"
                            @change="upLoadChange($event)"
                        >
                            <a-button> <a-icon type="upload" />{{ L('上传图片') }}</a-button>
                        </a-upload>
                    </a-form-model-item>
                    <a-form-model-item :label="L('状态')">
                        <a-switch
                            :checked-children="L('开启')"
                            :un-checked-children="L('关闭')"
                            :checked="formData.status == 1 ? true : false"
                            @change="statusChange($event)"
                        />
                    </a-form-model-item>
                </a-form-model>
                <a-form-model-item :wrapper-col="{ span: 18, offset: 4 }">
                    <div class="mt-20 mb-20">
                        <a-button type="primary" @click="saveData()"> {{ L('提交') }}</a-button>
                    </div>
                </a-form-model-item>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="L('套餐明细')" force-render v-if="id > 0">
                <div id="components-layout-demo-basic">
                    <div class="pl-20 pb-10">
                        <a-icon type="info-circle" class="cr-primary" />
                        <span>
                            {{
                                L(
                                    '新建分组表示添加一个菜品系列，可以添加多个菜品可供选择；必选为下单时必须在该分组下选择该菜品，且默认选择1份。'
                                )
                            }}</span
                        >
                    </div>
                    <div class="pl-20 pb-10">
                        <a-icon type="info-circle" class="cr-primary" />
                        <span>
                            {{ L('建议不要添加有规格的菜品，否则对于有规格属性的菜品会默认按照无规格处理。') }}</span
                        >
                    </div>
                    <a-layout style="padding: 0 20px; background: #fff">
                        <a-layout-sider>
                            <template v-if="sortList.length">
                                <div class="sort-list-wrap" :style="'height:' + (this.clientHeight - 235) + 'px'">
                                    <div class="cat-list scroll_content br-f1">
                                        <drag-box
                                            ref="dragBox"
                                            v-if="sortList.length"
                                            :list="sortList"
                                            :draggable="false"
                                            :key="refresh"
                                            @handleChange="handleDragDataChange"
                                        />
                                    </div>
                                    <div class="add-new-cat" :style="'top:' + (this.clientHeight - 235) + 'px'">
                                        <span class="add-sort" @click="$refs.editGroupModal.add(id)">{{
                                            L('新建分组')
                                        }}</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="sortList.length == 0 && !sortLoading">
                                <div class="cat-list scroll_content br-f1">
                                    <div class="text-center cr-99 mt-10">{{ L('暂无分组') }}</div>
                                </div>
                                <div class="add-new-cat" :style="'top:100px'">
                                    <span class="add-sort" @click="$refs.editGroupModal.add(id)">{{
                                        L('新建分组')
                                    }}</span>
                                </div>
                            </template>
                        </a-layout-sider>

                        <a-layout-content>
                            <div class="edit-content">
                                <a-button type="primary" @click="addGoods()" class="add-goods">{{
                                    L('添加菜品')
                                }}</a-button>
                            </div>
                            <a-table
                                :columns="columns"
                                :data-source="goodsList"
                                :pagination="pagination"
                                rowKey="goods_id"
                                :hideDefaultSelections="selectGoods"
                                :row-selection="{
                                    selectedRowKeys: selectedRowKeys,
                                    onChange: onSelectChange,
                                    columnTitle: L('必选'),
                                }"
                                :scroll="{ y: this.clientHeight - 330 }"
                            >
                                <!-- 状态 -->
                                <span slot="status" slot-scope="text">
                                    <span v-if="text == 1">{{ L('已上架') }}</span>
                                    <span v-if="text == 0">{{ L('已下架') }}</span>
                                </span>
                                <!-- 规格 -->
                                <span slot="is_properties" slot-scope="text">
                                    <span v-if="text == 1">{{ L('有') }}</span>
                                    <span v-if="text == 0">{{ L('无') }}</span>
                                </span>
                                <!-- 操作栏 -->
                                <span slot="action" slot-scope="text, record">
                                    <a class="inline-block" @click="delPackage(record.goods_id)">{{ L('移除') }}</a>
                                </span>
                            </a-table>
                            <div class="save-content">
                                <a-button type="primary" @click="saveGoods()" class="add-goods">{{
                                    L('提交')
                                }}</a-button>
                            </div>
                        </a-layout-content>
                    </a-layout>
                    <edit-group ref="editGroupModal" @handleUpdate="handleUpdate" />
                </div>
                <select-goods
                    :visible.sync="selectGoodsVisible"
                    :storeId="store_id"
                    :menuList="goodsSortList"
                    :list="selectGoodsList"
                    :selectedList="selectedGoodsDetailList"
                    @submit="onGoodsSelect"
                    @onMenuSelect="onMenuSelect"
                    @onSearch="goodsOnSearch"
                />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
import DragBox from '@/components/DragBox/DragBox'
import EditGroup from '../modules/merchant/EditGroup.vue'
import SelectGoods from '@/components/SelectGoods/SelectGoods'

const selectedRowKeys = []
export default {
    components: {
        DragBox,
        EditGroup,
        SelectGoods,
    },
    data() {
        return {
            tabKey: 1,
            id: 0,
            store_id: 0,
            // 表单数据
            formData: {
                id: 0,
                store_id: 0,
                name: '',
                price: '',
                image: '',
                status: 1,
                note: '',
                is_order: 1,
            },
            // 查询字段
            queryParam: {},
            // 表头
            columns: [
                {
                    title: this.L('菜品名称'),
                    dataIndex: this.L('name'),
                },
                {
                    title: this.L('菜品价格'),
                    dataIndex: 'price',
                },
                {
                    title: this.L('规格'),
                    dataIndex: 'is_properties',
                    scopedSlots: {
                        customRender: 'is_properties',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'action',
                    width: '12%',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            // 套餐分组商品数据
            goodsList: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 100,
            },
            // 表单校验规则
            rules: {
                name: [{ required: true, message: this.L('请输入套餐名称'), trigger: 'blur' }],
                price: [{ required: true, message: this.L('请输入套餐价格'), trigger: 'blur' }],
            },
            // 套餐图片列表数据
            uploadImg: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            upload_dir: { upload_dir: '/package' },
            fileList: [],
            headers: {
                authorization: 'authorization-text',
            },
            clientHeight: 0,
            sortList: [],
            sortLoading: false,
            package_detail_id: 0,
            selectedRowKeys,
            selectGoods: false,
            // 商品分类列表
            goodsSortList: [],
            // 弹窗选择商品
            selectGoodsVisible: false,
            selectGoodsList: [],
            selectedGoodsDetailList: [],
            key: '1',
            refresh: 1
        }
    },
    watch: {
        $route(val) {
            if (val.path == '/merchant/merchant.foodshop/EditPackage') {
                this.store_id = val.query.store_id
                this.queryParam.store_id = this.store_id
                if (val.query.id) {
                    this.id = val.query.id
                    this.getFormData()
                    this.getSortList()
                } else {
                    this.resetForm()
                }
            }
        },
    },
    mounted() {
        this.store_id = this.$route.query.store_id
        this.queryParam.store_id = this.store_id
        this.resetForm()
        if (this.$route.query.id) {
            this.id = this.$route.query.id
            this.getFormData()
            this.getSortList()
        }
        this.clientHeight = window.document.body.clientHeight
        window.onresize = () => {
            this.clientHeight = window.document.body.clientHeight
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        callback(key) {
            this.tabKey = key
            this.key = key
            if (key == 2) {
                this.getSortList()
                this.getGoodsSortList()
            }
        },
        // 左侧分类拖拽
        handleDragDataChange(val) {
            if (val.type == 'edit') {
                // 编辑
                this.$refs.editGroupModal.edit(val.data.id)
            } else if (val.type == 'click') {
                // 点击
                this.package_detail_id = val.data.id
                this.getPackageDetailGoodsList()
            }
        },
        // 添加编辑删除回调
        handleUpdate() {
            this.getSortList()
            this.getGoodsSortList()
        },
        // 获取套餐分组数据列表
        getSortList() {
            this.sortLoading = true
            this.request(foodshopMerchantApi.getPackageDetailList, { pid: this.id })
                .then((res) => {
                    this.sortList = []
                    if (res && res.list && res.list.length) {
                        this.sortList = res.list.map((item) => {
                            return {
                                title: item.package_name,
                                id: item.id,
                                fid: 0,
                                goods_count: item.num,
                                children: [],
                            }
                        })
                    }
                    this.refresh++
                    let updatePackageDetailId =
                        (!this.package_detail_id && this.sortList.length) ||
                        (this.package_detail_id &&
                            this.sortList.length &&
                            this.sortList.findIndex((item) => item.id === this.package_detail_id) == -1)
                    if (updatePackageDetailId) {
                        this.package_detail_id = this.sortList[0].id
                    }
                    if (!this.sortList.length && this.package_detail_id) {
                        this.package_detail_id = ''
                        this.selectedRowKeys = []
                        this.goodsList = []
                    }
                    if(this.package_detail_id) {
                        this.getPackageDetailGoodsList()
                    }
                })
                .finally(() => {
                    this.sortLoading = false
                })
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        // 获取套餐分组商品数据列表
        getPackageDetailGoodsList() {
            this.request(foodshopMerchantApi.getPackageDetailGoodsList, { id: this.package_detail_id }).then((res) => {
                if (res.list.length) {
                    this.goodsList = res.list
                } else {
                    this.goodsList = []
                }
                if (res.choose.length) {
                    this.selectedRowKeys = res.choose
                } else {
                    this.selectedRowKeys = []
                }
            })
        },
        // 移除套餐商品
        delPackage(goods_id) {
            this.goodsList.forEach((goods, i2) => {
                if (goods.goods_id == goods_id) {
                    this.goodsList.splice(i2, 1)
                }
            })
        },
        // 套餐分组保存菜品
        saveGoods() {
            if (!this.sortList.length) {
                this.$message.error(this.L('请新建分组'))
                return
            }

            if (this.package_detail_id == 0) {
                this.$message.error(this.L('请选择分组'))
                return
            }

            if (!this.goodsList.length) {
                this.$message.error(this.L('请添加菜品'))
                return
            }
            let formData = {}
            formData.id = this.package_detail_id
            formData.pid = this.id
            formData.goods_detail = []
            formData.goods_detail_choose = []
            this.goodsList.forEach((item) => {
                formData.goods_detail.push(item.goods_id)
            })
            this.selectedRowKeys.forEach((item) => {
                formData.goods_detail_choose.push(item)
            })
            this.request(foodshopMerchantApi.editPackageDetail, formData).then((res) => {
                this.$message.success(this.L('提交成功！'))
                sessionStorage.setItem('editPackage', 1)
            })
        },
        // 添加菜品
        addGoods() {
            if (!this.sortList.length) {
                this.$message.error(this.L('请新建分组'))
                return
            }

            if (this.package_detail_id == 0) {
                this.$message.error(this.L('请选择分组'))
                return
            }
            this.selectGoodsVisible = true
        },
        // 获取商品分类列表
        getGoodsSortList() {
            this.request(foodshopMerchantApi.selectSortList, this.queryParam).then((res) => {
                this.goodsSortList = res
            })
        },
        // 选择商品回调
        onGoodsSelect(e) {
            this.selectedGoodsDetailList = e.goods
            this.selectedGoodsList = e.ids
            this.selectGoodsVisible = false
            this.selectedGoodsList
            let goodsid = []
            if (this.goodsList.length) {
                this.goodsList.map((item) => {
                    goodsid.push(item.goods_id)
                })
            }

            this.selectedGoodsDetailList.map((item) => {
                if (goodsid.indexOf(item.goods_id) == -1) {
                    let goods = {
                        goods_id: item.goods_id,
                        name: item.name,
                        price: item.price,
                        is_properties: item.is_properties,
                        status: 1,
                        is_choose: 2,
                    }
                    this.goodsList.push(goods)
                }
            })
            this.selectedGoodsDetailList = []
        },
        // 选择商品分类
        onMenuSelect(e) {
            this.queryParam.sort_id = e.id
            this.queryParam.keywords = ''
            this.getSelectGoodsList()
        },
        // 获取商品列表
        getSelectGoodsList() {
            this.queryParam.id = this.package_detail_id
            this.request(foodshopMerchantApi.getPackageGoodsList, this.queryParam).then((res) => {
                this.selectGoodsList = res.list
            })
        },
        // 搜索商品回调
        goodsOnSearch(e) {
            this.queryParam.sort_id = e.id
            this.queryParam.keywords = e.keywords
            this.getSelectGoodsList()
        },
        // 上传套餐图片
        upLoadChange(info) {
            // 图片列表
            let fileList = [...info.fileList]
            if (fileList.length) {
                fileList = fileList.slice(-1)
                fileList = fileList.map((file) => {
                    if (file.response) {
                        file.url = file.response.data
                    }
                    return file
                })

                this.fileList = fileList
            } else {
                this.fileList = []
            }

            let data = ''
            if (fileList.length) {
                fileList.forEach((item) => {
                    if (item.response && item.response.status && item.response.status == 1000) {
                        data = item.response.data
                    }
                })
            }

            this.formData.image = data

            if (info.file.status === 'done') {
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} ` + this.L('上传失败') + '.')
            }
        },
        // 表单信息
        getFormData() {
            this.fileList = []
            this.key = '1'
            this.request(foodshopMerchantApi.getPackageDetail, { id: this.id }).then((res) => {
                this.$set(this, 'formData', res.detail)
                if (res.detail.image) {
                    let imgName = res.detail.image.substring(res.detail.image.lastIndexOf('/') + 1)
                    let img = {
                        uid: '1',
                        name: imgName,
                        status: 'done',
                        url: res.detail.image,
                    }
                    this.fileList.push(img)
                }
            })
        },
        // 重置表单
        resetForm() {
            this.formData = this.$options.data.call(this).formData
            this.loading = false
            this.$forceUpdate()
            this.fileList = []
        },
        // 修改状态
        statusChange(value, id) {
            if (value == true) {
                this.$set(this.formData, 'status', 1)
            } else {
                this.$set(this.formData, 'status', 0)
            }
        },
        // 提交表单
        saveData() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let formData = {}
                    for (let k in this.formData) {
                        formData[k] = this.formData[k]
                    }
                    formData['store_id'] = this.store_id
                    this.request(foodshopMerchantApi.editPackage, formData).then((res) => {
                        this.$message.success(this.L('提交成功！'))
                        this.$nextTick(() => {
                            this.id = res.id
                            this.key = '2'
                        })
                        sessionStorage.setItem('editPackage', 1)
                    })
                } else {
                    return false
                }
            })
        },
    },
}
</script>
<style scoped>
.detail-content >>> .ant-drawer-body {
    padding: 0;
}
.add-sort {
    color: #1890ff;
    border: 1px solid #1890ff;
    border-radius: 12px;
    padding: 2px 18px;
    background-color: #1890ff21;
    cursor: pointer;
}

#components-layout-demo-basic {
    position: relative;
    text-align: left;
    background: #ffffff;
    height: 100%;
}

#components-layout-demo-basic .ant-layout {
    height: 100%;
}

#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
    background: #ffffff;
    color: #fff;
    height: 80px;
}

#components-layout-demo-basic .ant-layout-sider {
    background: #ffffff;
    color: #fff;
}

#components-layout-demo-basic .ant-layout-content {
    background: #ffffff;
    color: #fff;
    min-height: 120px;
    line-height: 120px;
    padding-left: 20px;
}

#components-layout-demo-basic > .ant-layout {
    margin-bottom: 48px;
}

#components-layout-demo-basic > .ant-layout:last-child {
    margin: 0;
}
#components-layout-demo-basic .add-goods {
    margin: 0 20px;
}
#components-layout-demo-basic >>> .ant-btn-group {
    line-height: 80px;
}
#components-layout-demo-basic .edit-content {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 18px;
    /* margin-right: 60px; */
}
#components-layout-demo-basic .save-content {
    float: left;
    /* margin-right: 60px; */
}
#components-layout-demo-basic >>> .ant-tabs {
    display: inline-block;
}
#components-layout-demo-basic >>> .ant-layout-content {
    line-height: 70px;
}
.ant-pro-page-header-wrap-children-content,
.ant-pro-page-header-wrap-children-content >>> .ant-tabs {
    width: 100%;
}
.message-suggestions-list-box {
    position: relative;
}
.search-input {
    position: absolute;
    right: 0;
    bottom: 36px;
}
.right-c {
    display: flex;
}
.goods-image {
    width: 48px;
    margin-right: 5px;
    height: 48px;
    border-radius: 4px;
}
.img-wrap {
    position: relative;
}
.yxj {
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    line-height: 48px;
    font-size: 12px;
    text-align: center;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
}
.cat-list {
    /* position: absolute; */
    width: 100%;
    /* left: 0;
  top: 20px;
  bottom: 90px; */
    overflow-y: scroll;
    flex: 1;
    height: 400px;
}
.add-new-cat {
    /* position: absolute; */
    text-align: center;
    width: 100%;
    /* left: 0; */
    height: 50px;
}

.sort-list-wrap {
    display: flex;
    flex-direction: column;
}

.cr-primary.anticon {
    color: #1890ff;
}
</style>
