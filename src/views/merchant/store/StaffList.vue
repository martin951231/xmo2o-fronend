<template>

    <div class="mt-20 ml-10 mr-10 mb-20 bg-ff" style="padding: 24px; box-sizing: border-box">
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="店员管理">
                <a-spin :spinning="spinning" size="large">
                    <a-table
                        :columns="columns"
                        :data-source="data"
                        :pagination="pagination"
                        @change="handleTableChange"
                    >

                        <span slot="username" slot-scope="text">
                            {{ text }}
                        </span>

                        <span slot="name" slot-scope="text">
                            {{ text }}
                        </span>

                        <span slot="type" slot-scope="text">
                            <span class="height-30" v-if="text == 0"> 店小二 </span>
                            <span class="height-30" v-else-if="text == 1"> 核销 </span>
                            <span v-else class="height-30"> 店长 </span>
                        </span>

                        <span slot="tel" slot-scope="text">
                            {{ text }}
                        </span>

                        <span slot="last_time" slot-scope="text">
                            {{ text }}
                        </span>

                        <span slot="openid" slot-scope="text,record">
                            <a-icon v-if="text != '' && text != '0'" type="wechat" theme="filled"  v-clipboard:copy="record.openid" v-clipboard:success="copySuccess" v-clipboard:error="copyError"/>
                            <span v-else>--</span>
                        </span>

                        <span slot="toLogin" slot-scope="text,record">
                            <a-popconfirm
                                ok-text="去登录"
                                cancel-text="取消"
                                @confirm="staffAutoLogin(record)"
                            >
                            <template slot="title">
                                <p>为避免账号串号影响操作安全，同一浏览器暂不支持同时登录商家中心与店员中心账号。</p>
                                <p>店员登录成功，商家中心将自动退出登录，确定登录吗?</p>
                            </template>
                                <a-icon type="login" />
                            </a-popconfirm>
                        </span>

                        <span slot="is_change" slot-scope="text">
                            <span v-if="text == 0" style="color: red;">不能</span>
                            <span v-else>能</span>
                        </span>

                        <span slot="action" slot-scope="text, record">
                            <a @click="staffEdit(record.id)"> 修改</a>
                            <a style="margin-left: 10px; color: red" @click="staffDel(record.id)">删除</a>
                        </span>
                        <template slot="title" slot-scope="currentPageData">
                            <a-row type="flex" justify="center" align="top">
                                <a-col :span="8">  </a-col>
                                <a-col :span="12"> </a-col>
                                <a-col :span="2" class="text-right">
                                    <a-button type="primary" @click="goNextPage()"> 添加店员 </a-button>
                                </a-col>
                                <a-col :span="2" class="text-right">
                                    <a-button type="default" @click="staffLogin()"> 店员登录 </a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </a-table>

                    <!--                        </a-layout-content>-->
                    <!--                    </a-layout>-->

                </a-spin>

                <a-modal v-model="visible_staff" title="店员信息维护" :footer="null" width="700px">
                    <a-form v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" @submit="handleSubmit">
                        <a-form-item label="姓名">
                            <a-input
                                v-decorator="['name', { rules: [{ required: true, message: '请输入姓名' }] }]"
                                placeholder="请输入姓名"
                                v-model="formData.name"
                            >
                            </a-input>
                        </a-form-item>

                        <a-form-item label="店员类型">
                            <a-select v-model="formData.type">
                                <a-select-option :value="0"> 店小二 </a-select-option>
                                <a-select-option :value="1"> 核销 </a-select-option>
                                <a-select-option :value="2"> 店长 </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="账号">
                            <a-input
                                v-decorator="['username', { rules: [{ required: true, message: '请输入账号' }] }]"
                                placeholder="请输入账号"
                                v-model="formData.username"
                            >
                            </a-input>
                        </a-form-item>

                        <a-form-item label="密码">
                            <a-input
                                v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
                                type="password"
                                :placeholder="password_str"
                                v-model="formData.password"
                            >
                            </a-input>
                        </a-form-item>

                        <a-form-item label="电话">
                            <a-input
                                v-decorator="['tel', { rules: [{ required: true, message: '请输入电话' }] }]"
                                placeholder="请输入电话"
                                v-model="formData.tel"
                            >
                            </a-input>
                        </a-form-item>

                        <a-form-item label="能否修改订单价格">
                            <a-radio-group v-decorator="['is_change']" v-model="formData.is_change">
                                <a-radio :value="0"> 不能 </a-radio>
                                <a-radio :value="1"> 能 </a-radio>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item label="是否可以操作餐饮整单退款">
                            <a-radio-group
                                v-decorator="['can_refund_dinging_order']"
                                v-model="formData.can_refund_dinging_order"
                            >
                                <a-radio :value="0"> 不能 </a-radio>
                                <a-radio :value="1"> 能 </a-radio>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item label="是否可以查看景区订单列表">
                            <a-radio-group v-decorator="['show_scenic_order']" v-model="formData.show_scenic_order">
                                <a-radio :value="0"> 不能 </a-radio>
                                <a-radio :value="1"> 能 </a-radio>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item label="是否可以核销商家活动订单">
                            <a-radio-group
                                v-decorator="['can_verify_activity_appoint']"
                                v-model="formData.can_verify_activity_appoint"
                            >
                                <a-radio :value="0"> 不能 </a-radio>
                                <a-radio :value="1"> 能 </a-radio>
                            </a-radio-group>
                        </a-form-item>

                        <!-- 绑定自提点 -->
                        <a-form-item label="绑定自提点" help="不选择则为全部">
                            <a-select
                                mode="multiple"
                                v-decorator="['address']"
                                placeholder="点击绑定自提点"
                                @change="handleChange"
                                v-model="formData.pick_addr_ids"
                            >
                                <a-select-option :value="item.id" v-for="item in addressList" :key="item.id">
                                    {{ item.pick_addr }}
                                </a-select-option>
                            </a-select>
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
            </a-tab-pane>
            <!--<a-tab-pane key="2" tab="技师管理" force-render>
                <job-person-list :store_id="store_id"></job-person-list>
            </a-tab-pane>-->
        </a-tabs>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import { getTokenName, getSystemName, setCookie } from '@/utils/util'
import mallMerchantApi from '@/api/merchant/store'
import JobPersonList from './JobPersonList'
import path from '@/router/router-path.js'

const columns = [
    {
        title: '账号',
        dataIndex: 'username',
        scopedSlots: { customRender: 'username' },
        width:120
    },
    {
        title: '姓名',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' },
        width:120
    },
    {
        title: '店员类型',
        dataIndex: 'type',
        scopedSlots: { customRender: 'type' },
        width:120
    },
    {
        title: '电话',
        dataIndex: 'tel',
        scopedSlots: { customRender: 'tel' },
        width:120
    },
    {
        title: '最后登录时间',
        dataIndex: 'last_time',
        scopedSlots: { customRender: 'last_time' },
        width:120
    },
    {
        title: '微信（点击可复制）',
        dataIndex: 'openid',
        scopedSlots: { customRender: 'openid' },
        width:120
    },
    {
        title: '伪登录',
        dataIndex: 'toLogin',
        scopedSlots: { customRender: 'toLogin' },
        width:120
    },
    {
        title: '能否修改订单价格',
        dataIndex: 'is_change',
        scopedSlots: { customRender: 'is_change' },
        width:120
    },
    {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        width:120
    },
]
export default {
    components: { JobPersonList },
    data() {
        return {
            spinning: false,
            data: [],
            visible_staff: false,
            store_id: '',
            site_url: '',
            pagination: {
                current: 1,
                total: 0,
                pageSize: 20,
                showSizeChanger: false,
                showQuickJumper: false,
                onChange: this.onPageChange,
            },
            queryParam: {
                page: 1,
                store_id: '',
            },
            formData: {
                id: '',
                name: '',
                type: 0,
                username: '',
                password: '',
                tel: '',
                is_change: 0,
                store_id: '',
                can_refund_dinging_order: 0,
		show_scenic_order: 1,
                can_verify_activity_appoint: 0,
                pick_addr_ids: [],
            },
            addressList: [],
            columns,
            password_str: '请输入密码',
            baseUrl: '/v20/public/platform/#',
        }
    },
    mounted() {
        this.store_id = this.$route.query.store_id
        this.formData.store_id = this.$route.query.store_id
        this.getLists()
    },
    activated() {
        this.store_id = this.$route.query.store_id
        this.formData.store_id = this.$route.query.store_id
        this.getLists()
    },
    created() {
        this.store_id = this.$route.query.store_id
        this.formData.store_id = this.$route.query.store_id
    },
    methods: {
        ...mapActions(['Logout', 'SetLang']),
        handleChange(value) {
            console.log(`selected ${value}`)
            this.formData.pick_addr_ids = value
        },
        // 获取自提点列表
        getPickAddress() {
            this.request(mallMerchantApi.getPickAddress).then((res) => {
                this.addressList = res
            })
        },
        getLists() {
            this.queryParam['page'] = this.pagination.current
            this.queryParam['store_id'] = this.store_id
            this.request(mallMerchantApi.getStaffList, this.queryParam).then((res) => {
                this.site_url = res.site_url
                this.data = res.list
                this.pagination.total = res.count
                this.queryParam['page'] += 1
            })
        },
        handleTableChange(e) {
            if (e.current && e.current > 0) {
                this.queryParam['page'] = e.current
                this.getLists()
            }
        },
        goNextPage() {
            this.visible_staff = true
            this.formData.id = ''
            this.formData.name = ''
            this.formData.type = ''
            this.formData.username = ''
            this.formData.password = ''
            this.password_str = '请输入密码'
            this.formData.tel = ''
            this.formData.is_change = 0
            this.formData.can_refund_dinging_order = 0
            this.formData.show_scenic_order = 1
            this.formData.store_id = this.store_id
            this.formData.can_verify_activity_appoint = 0
            this.formData.pick_addr_ids = []
            this.getPickAddress()
        },
        handleSubmit(e) {
            e.preventDefault()
            this.request(mallMerchantApi.staffEdit, this.formData).then((res) => {
                this.getLists()
                this.visible_staff = false
                this.formData.id = ''
            })
        },

        hidelModel() {
            //隐藏店员编辑框
            this.visible_staff = false
        },
        staffEdit(id) {
            //修改店员信息
            let param = {
                id: id,
            }
            this.request(mallMerchantApi.staffSet, param).then((res) => {
                this.formData.id = res.staff_item.id
                this.formData.name = res.staff_item.name
                this.formData.type = res.staff_item.type
                this.formData.username = res.staff_item.username
                this.formData.password = res.staff_item.password
                this.password_str = '******'
                this.formData.tel = res.staff_item.tel
                this.formData.is_change = res.staff_item.is_change
                this.formData.can_refund_dinging_order = res.staff_item.can_refund_dinging_order

                this.formData.store_id = res.staff_item.store_id

                this.formData.show_scenic_order = res.staff_item.show_scenic_order

                this.formData.store_id = res.staff_item.store_id
                this.formData.pick_addr_ids = res.staff_item.pick_addr_ids
                this.getPickAddress()
                this.formData.can_verify_activity_appoint = res.staff_item.can_verify_activity_appoint


                this.visible_staff = true
            })
        },
        staffDel(id) {
            //店员删除
            this.$confirm({
                title: '是否确定删除该店员?',
                centered: true,
                onOk: () => {
                    let param = {
                        id: id,
                        store_id: this.store_id,
                    }
                    this.request(mallMerchantApi.staffDel, param).then((res) => {
                        this.getLists()
                        this.$message.success('操作成功！')
                    })
                },
                onCancel() {},
            })
        },
        staffLogin() {
            let href = this.site_url + '/v20/public/platform/#/usernew/storestaff/login'
            window.open(href)
        },
        staffAutoLogin(staff) {
            this.request(mallMerchantApi.staffLogin, { staff_id: staff.id }).then((response) => {
                const tokenName = getTokenName(path.storestaffIndex)
                Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
                setCookie(tokenName, response.ticket, null) // 存入到cookie中
                window.open(this.baseUrl + path.storestaffIndex, '_blank')

                this.handleLogout();
            })
        },
        handleLogout() {
            let sysName = getSystemName(location.hash)
            if (!sysName) {
                sysName = getSystemName(this.$route.path)
            }
            console.log('sysName', sysName)
            let tokenName = getTokenName(this.$route.path) // 路由变更后 this.$route.path
            console.log('tokenName', tokenName)
            if (!tokenName) {
                tokenName = sysName + '_access_token'
            }
            return this.Logout(tokenName)
                .then(() => {
                    setTimeout(() => {
                        window.location.reload()
                    }, 16)
                })
                .catch((err) => {
                    this.$message.error({
                        title: '错误',
                        description: err.message,
                    })
                })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getLists()
        },
        copyError() {
            this.$message.error('复制openid失败！')
        },
        copySuccess() {
            this.$message.success('复制openid成功！')
        },
    },
}
</script>

<style scoped>
th.column-money,
td.column-money {
    text-align: right !important;
}

.label-sm {
    color: green;
}

.label-sm.blue {
    color: #1890ff !important;
}
</style>