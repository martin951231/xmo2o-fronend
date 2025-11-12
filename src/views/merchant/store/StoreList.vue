<template>
    <div class="mt-20 ml-10 mr-10 mb-20">
        <a-table
            style="background: #ffffff"
            :columns="columns"
            :row-key="(record) => record.store_id"
            :data-source="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
        >
            <span slot="name" slot-scope="text, record">
                <a @click="showModal(record.store_id)">{{ record.name }}</a>
                <!--  <a>查看店铺信息</a>-->
            </span>

            <span slot="status" slot-scope="text, record">
                <a class="label-sm-1 green" v-if="record.status == 1">正常</a>
                <a v-else-if="record.status == 0" class="label-sm-1 red">关闭</a>
                <a v-else-if="record.status == 2" class="label-sm-1 red">审核中</a>
                <a v-else-if="record.status == 4" class="label-sm-1 red">禁用</a>
                <a v-else class="label-sm-1 red">店铺待认领</a>
            </span>

            <span slot="auth" slot-scope="text, record">
                <span v-if="record.auth == 0">
                    <a class="label-sm-1 red"> 未提交</a>
                    <a class="btn label-sm-1 blue" style="margin-left: 10px" @click="goNextPage(record.store_id)"
                        >提交</a
                    >
                </span>

                <span v-else-if="record.auth == 1">
                    <a class="label-sm-1 red"> 审核中</a>
                    <a class="btn label-sm-1 blue" style="margin-left: 10px" @click="goNextPage(record.store_id)"
                        >修改</a
                    >
                </span>

                <span v-else-if="record.auth == 2">
                    <a class="label-sm-1 red"> 已拒绝</a>
                    <a class="btn label-sm-1 blue" style="margin-left: 10px" @click="goNextPage(record.store_id)"
                        >修改</a
                    >
                </span>

                <span v-else-if="record.auth == 3">
                    <a class="label-sm-1 green"> 已通过</a>
                    <a class="btn label-sm-1 blue" style="margin-left: 10px" @click="goNextPage(record.store_id)"
                        >修改</a
                    >
                </span>

                <span v-else-if="record.auth == 4">
                    <a class="label-sm-1-1 red"> 再次提交审核</a>
                    <a class="btn label-sm-1-1 blue" style="margin-left: 10px" @click="goNextPage(record.store_id)"
                        >修改</a
                    >
                </span>

                <span v-else>
                    <a class="label-sm-1 red"> 已驳回</a>
                    <a class="btn label-sm-1 blue" style="margin-left: 10px" @click="goNextPage(record.store_id)"
                        >修改</a
                    >
                </span>
            </span>
            <span slot="show_qrcode" slot-scope="text, record" v-if="record.store_id > 0">
                <a @click="$refs.seeStoreQrcodeModal.showModal(record.store_id)">查看二维码</a>
            </span>

           <!--
            <span slot="design_web" slot-scope="text, record">
                 <a @click="openDiyPage(record.store_id)" class="label-sm-1 blue">点击设置</a>
            </span>-->


            <span slot="design_web" slot-scope="text, record">
                <label style="cursor: pointer;color: red;" v-if="!diypage_auth">{{ L('无权限') }}</label>
                <div v-else>
                    <!-- 老版自定义页面 -->
                    <router-link  v-if="!new_diypage"
                            :to="{ path: '/merchant/merchant.iframe/diyPageFitment', query: { store_id: record.store_id } }"
                    >
                        <label style="cursor: pointer">{{ L('点击设置') }}</label>
                    </router-link> 

                    <!-- 新版自定义页面 -->
                    <router-link v-else
                            :to="{ path: '/common/merchant.custom/index', query: { source_id: record.store_id,source: 'store'} }"
                    >
                        <label style="cursor: pointer">{{ L('点击设置') }}</label>
                    </router-link>
                </div>
            </span>

           

            <span slot="goods_list" slot-scope="text, record">
                <a class="label-sm-1 label-sm-1-blue" @click="goMyGoods(record.store_id)">商品管理</a>
            </span>

            <span slot="miaomaiyun_goods" slot-scope="text, record">
                <a class="label-sm-1 label-sm-1-blue" @click="asyncMiaoMaiYunGoods(record)">商品同步</a>
            </span>

            <router-link
                :to="{ path: '/merchant/store.merchant/StaffList', query: { store_id: record.store_id } }"
                slot="staff_list"
                slot-scope="text, record"
            >
                <a class="label-sm-1 blue">店员管理</a>
            </router-link>

            <router-link
                :to="{ path: '/merchant/store.merchant/StoreSlider', query: { store_id: record.store_id, mer_id: record.mer_id } }"
                slot="slider_list"
                slot-scope="text, record"
            >
                <a class="label-sm-1 label-sm-1-blue">导航管理</a>
            </router-link>

            <router-link
                :to="{ path: '/merchant/store.merchant/StoreDiscount', query: { store_id: record.store_id } }"
                slot="store_discount"
                slot-scope="text, record"
            >
                <a class="label-sm-1 label-sm-1-blue">店铺优惠</a>
            </router-link>

            <span slot="action" slot-scope="text, record">
                <div>
                    <a class="label-sm-1 blue" @click="storeEdit(record.store_id)"> 修改</a>
                    <a class="btn label-sm-1 blue" style="margin-left: 10px" @click="storeDel(record.store_id)">删除</a>
                </div>
                <!-- ID1015232 -->
                <div v-if="showThirdRobot">
                    <a class="label-sm-1 blue" @click="$refs.StoreBindingThirdRobot && $refs.StoreBindingThirdRobot.showModal(record)"> 机器人送货</a>
                </div>
            </span>
            <template slot="title" slot-scope="currentPageData">
                <a-form layout="inline">
                    <div class="flex search-content">
                        <div class="right flex" style="padding-left: 1rem;">
                            <div>
                                <a-form-item label="关键字">
                                    <a-input
                                            v-model="queryParam.name"
                                            placeholder="请输入店铺名称"
                                            style="width: 300px"
                                    />
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="店铺状态">
                                    <a-select v-model="queryParam.status" style="width: 120px" placeholder="运行状态">
                                        <a-select-option value="-1">全部</a-select-option>
                                        <a-select-option value="1">正常</a-select-option>
                                        <a-select-option value="0">关闭</a-select-option>
                                        <a-select-option value="2">审核中</a-select-option>
                                        <!-- <a-select-option value="4">禁用</a-select-option>
                                        <a-select-option value="6">店铺待认领</a-select-option> -->
                                    </a-select>
                                </a-form-item>
                            </div>
                            
                            <div style="line-height: 39px;">
                                <a-button icon="search" @click="searchBtn()" style="margin-right: 15px">
                                    查询
                                </a-button>
                                <a-button type="primary" @click="addMerchantStore()"> 
                                    添加店铺 
                                </a-button>
                            </div>
                        </div>
                    </div>
                </a-form>
            </template>
        </a-table>
        <see-store-qrcode ref="seeStoreQrcodeModal" />

        <a-modal v-model="visible" title="店铺信息" :footer="null">
            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">店铺名称:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30">
                        {{ store_name }}
                    </p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">联系电话:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30">
                        {{ phone }}
                    </p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">店铺地址:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30">
                        {{ address }}
                    </p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">餐饮:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30" v-if="have_meal == 1">已启用</p>
                    <p class="height-30" v-if="have_meal == 0">未启用</p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">团购:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30" v-if="have_group == 1">已启用</p>
                    <p class="height-30" v-if="have_group == 0">未启用</p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">外卖:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30" v-if="have_shop == 1">已启用</p>
                    <p class="height-30" v-if="have_shop == 0">未启用</p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="3"> </a-col>
                <a-col :span="4" class="text-right">
                    <p class="height-30">商城:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30" v-if="have_mall == 1">已启用</p>
                    <p class="height-30" v-if="have_mall == 0">未启用</p>
                </a-col>
            </a-row>

            <a-row type="flex" justify="center" align="top">
                <a-col :span="7" class="text-right">
                    <p class="height-30">线下支付方式:</p>
                </a-col>
                <a-col :span="1"> </a-col>
                <a-col :span="16">
                    <p class="height-30">
                        {{ off_pay_name }}
                    </p>
                </a-col>
            </a-row>
        </a-modal>

        <a-modal v-model="visible_staff" title="店铺资质资料管理" :footer="null" style="width: 800px">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 14 } }" @submit="handleSubmit">
                <a-form-item label="资质资料图片">
                    <a-input hidden v-model="pic"></a-input>
                    <template>
                        <div class="clearfix">
                            <a-upload
                                :action="action"
                                :name="uploadName"
                                :data="{ upload_dir: upload_dir, store_id: this.store_id }"
                                list-type="picture-card"
                                :file-list="fileList"
                                @preview="handlePreview"
                                @change="handleChange1"
                            >
                                <!-- <div v-if="fileList.length < 10">-->
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传</div>
                                <!--</div>-->
                            </a-upload>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage" />
                            </a-modal>
                        </div>
                    </template>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                    <a-row type="flex" justify="center" align="top">
                        <a-col :span="4" class="text-left">
                            <a-button type="default" @click="hidelModel()"> 取消 </a-button>
                        </a-col>
                        <a-col :span="6" class="text-center">
                            <a-button type="primary" html-type="submit"> 提交 </a-button>
                        </a-col>
                        <a-col :span="6"> </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-modal>

        <StoreBindingThirdRobot ref="StoreBindingThirdRobot"></StoreBindingThirdRobot>

        <!-- 同步淼迈云商品弹窗组件 -->
        <AsyncMiaoMaiYunGoodsModal ref="asyncMiaoMaiYunGoodsRef" />
    </div>
</template>
<script>
import mallMerchantApi from '@/api/merchant/store'
import SeeStoreQrcode from '@/views/common/qrcode/SeeStoreQrcode.vue'
import StoreBindingThirdRobot from './modules/StoreBindingThirdRobot.vue'
import AsyncMiaoMaiYunGoodsModal from './modules/AsyncMiaoMaiYunGoodsModal.vue'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export default {
    components: {
        SeeStoreQrcode,
        StoreBindingThirdRobot,
        AsyncMiaoMaiYunGoodsModal,
    },
    props: {
        // 存放路径
        upload_dir: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            pic: '',
            action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            uploadName: 'reply_pic',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            data: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '40', '50', '100'], // 设置每页显示条数的选项
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            store_id: '',
            loading: false,
            visible: false, //店铺名称弹框
            visible_staff: false, //店铺资质弹框
            queryParam: {
                page: 1,
                status: '-1',
                name: '',
            },
            columns: [
                {
                    title: '店铺ID',
                    dataIndex: 'store_id',
                },
                {
                    title: '店铺名称',
                    dataIndex: 'name',
                    scopedSlots: {
                        customRender: 'name',
                    },
                },
                {
                    title: '店铺状态',
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: '店铺资质',
                    dataIndex: 'auth',
                    scopedSlots: {
                        customRender: 'auth',
                    },
                },
                {
                    title: '综合二维码',
                    dataIndex: 'show_qrcode',
                    scopedSlots: {
                        customRender: 'show_qrcode',
                    },
                },
                {
                    title: '微页面',
                    dataIndex: ' design_web',
                    scopedSlots: {
                        customRender: 'design_web',
                    },
                },
                {
                    title: '商品管理',
                    dataIndex: 'goods_list',
                    scopedSlots: {
                        customRender: 'goods_list',
                    },
                },
                {
                    title: '店员管理',
                    dataIndex: 'staff_list',
                    scopedSlots: {
                        customRender: 'staff_list',
                    },
                },
                {
                    title: '导航管理',
                    dataIndex: 'slider_list',
                    scopedSlots: {
                        customRender: 'slider_list',
                    },
                },
                {
                    title: '店铺优惠',
                    dataIndex: 'store_discount',
                    scopedSlots: {
                        customRender: 'store_discount',
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            store_name: '',
            phone: '',
            address: '',
            have_meal: 0, //餐饮
            have_group: 0,//团购
            have_shop: 0,//外卖
            have_mall: 0,//商城
            off_pay_name: '',
            autn_image: '',
            new_diypage:0,
            // ID1015232 定制
            showThirdRobot: false,
            system_config: null,
            diypage_auth:0, //是否有微页面权限  1：有  0：没有
        }
    },
    created(){
        this.system_config = this.$getCache('system_config')
        if(this.system_config && this.system_config.internal_membership_card == 1){
            this.columns.forEach((item,index)=>{
                if(item.dataIndex == 'goods_list' && item.dataIndex != 'miaomaiyun_goods'){
                    this.columns.splice(index + 1,0,{
                            title: this.L('淼迈云商品同步'),
                            dataIndex: 'miaomaiyun_goods',
                            scopedSlots: {
                                customRender: 'miaomaiyun_goods',
                            },
                        },
                    )
                }
            })
        }
    },
    mounted() {
        this.getLists()
    },
    activated() {
        this.getLists()
    },
    methods: {
        // 点击查询按钮
        searchBtn() {
            this.page = 1
            this.pagination.current = this.page
            this.getLists()
        },
        getLists() {
            this.queryParam['page'] = 1
            this.request(mallMerchantApi.getLists, this.queryParam).then((res) => {
                this.data = res.list
                this.pagination.total = res.count
                this.queryParam['page'] += 1
                this.new_diypage = res.new_diypage || undefined
                this.showThirdRobot = res.show_robot == 1?true:false
                this.diypage_auth = res.diypage_auth || undefined
            })
        },
        handleTableChange(e) {
            return false
            if (e.current && e.current > 0) {
                this.queryParam['page'] = e.current
                this.getLists()
            }
        },
        showQrcode(store_id) {
            alert(store_id)
        },
        showModal(store_id) {
            this.visible = true
            let param = {
                store_id: store_id,
            }
            this.request(mallMerchantApi.getStoreMsg, param).then((res) => {
                if (res.list.store_id != undefined) {
                    this.store_name = res.list.name
                    this.phone = res.list.phone
                    this.address = res.list.adress
                    this.have_meal = res.list.have_meal
                    this.have_group = res.list.have_group
                    this.have_shop = res.list.have_shop
                    this.have_mall = res.list.have_mall
                    this.off_pay_name = res.list.pay_name
                }
            })
        },
        addMerchantStore() {
            this.$router.push({ path: '/merchant/store.merchant/StoreEdit' })
        },
        goNextPage(store_id) {
            this.visible_staff = true
            this.store_id = store_id
            let param = {
                store_id: this.store_id,
            }
            this.fileList = []
            this.$set(this, 'store_id', store_id)
            this.request(mallMerchantApi.storeAuthMsg, param).then((res) => {
                //获取店铺资质,有就加载信息，没有的就新增
                if (res.auth_files.length > 0) {
                    for (let j = 0; j < res.auth_files.length; j++) {
                        //商家图片
                        let param1 = {
                            uid: j,
                            name: 'image_' + j,
                            status: 'done',
                            url: res.auth_files[j],
                        }
                        this.fileList.push(param1)
                    }
                }
            })
        },
        hidelModel() {
            this.visible_staff = false
        },
        handleSubmit(e) {
            e.preventDefault()
            let param = {
                store_id: this.store_id,
                pic: this.pic,
            }
            this.request(mallMerchantApi.storeAuthEdit, param).then((res) => {
                if (res.status == 1000) {
                    this.$message.success('保存成功')
                }
                this.visible_staff = false
                //编辑提交资质
                this.getLists()
            })
        },
        handleCancel() {
            this.previewVisible = false
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        handleChange({ fileList }) {
            this.fileList = fileList
        },
        handleChange1({ fileList }) {
            this.fileList = fileList
            let attr_image = []
            for (let i = 0; i < this.fileList.length; i++) {
                if (this.fileList[i].status == 'done') {
                    if (this.fileList[i].url !== undefined) {
                        //编辑组装的数据
                        attr_image.push(this.fileList[i].url)
                    } else {
                        //上传的图片
                        attr_image.push(this.fileList[i].response.data)
                    }
                }
            }
            if (attr_image.length > 0) {
                this.pic = attr_image.join(';')
            }
        },
        storeEdit(store_id) {
            this.$router.push({ path: '/merchant/store.merchant/StoreEdit', query: { store_id: store_id } })
        },
        goMyGoods(store_id) {
            window.open('/merchant.php?g=Merchant&c=GoodsLibrary&a=goods_list&store_id=' + store_id)
        },
        //同步淼迈云商品
        asyncMiaoMaiYunGoods(item){
            this.$refs.asyncMiaoMaiYunGoodsRef.open('',true,item.store_id)
        },
        openDiyPage(store_id){
            window.open('/merchant.php?g=Merchant&c=Diypage&a=index&store_id=' + store_id)
        },
        storeDel(store_id) {
            this.$confirm({
                title: '是否确定删除该店铺?',
                centered: true,
                onOk: () => {
                    let param = {
                        store_id: store_id,
                    }
                    this.request(mallMerchantApi.storeDel, param).then((res) => {
                        if (res.status) {
                            this.$message.success('删除成功')
                            this.getLists()
                        }
                    })
                },
                onCancel() {},
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.page = page;
            this.$set(this.pagination, 'current', page)
            this.getLists()
        },
        onPageSizeChange(page, pageSize) {
            this.page = 1;
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', pageSize)
            this.$set(this.queryParam, 'pageSize', pageSize)
            this.queryParam['pageSize'] = pageSize
            this.getLists()
        },
    },
}
</script>
<style scoped>
.label-sm-1 {
    color: green;
}

.label-sm-1.red {
    color: red;
}

.label-sm-1.yellow {
    color: #f89406 !important;
    border: 1px solid #f89406 !important;
}

.label-sm-1.purple {
    color: #9585bf !important;
    border: 1px solid #9585bf !important;
}

.label-sm-1.blue {
    color: #1890ff !important;
}

.label-sm-1.purplish-red {
    color: #d6487e !important;
    border: 1px solid #d6487e !important;
}

.label-sm-1-blue {
    color: #1890ff;
    /* border: 1px solid #1890ff !important; */
}

/*资质图片样式*/
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
