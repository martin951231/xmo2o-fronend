<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout-content
                    :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                <a-table :columns="columns"
                         :data-source="data"
                         :pagination="pagination"
                         @change="handleTableChange">
                        <span slot="name" slot-scope="text">
                            {{text}}
                        </span>
                    <span slot="gift" slot-scope="text">
                                {{text}}
                        </span>
                    <span slot="action" slot-scope="text,record">
                                <a class="btn label-sm blue" @click="setManage(record.store_id)">设置</a>
                        </span>
                    <!--<template slot="title" slot-scope="currentPageData" style="padding: 0px;">
                        <a-row type="flex" justify="center" align="top">
                            <a-col :span="8">
                            </a-col>
                            <a-col :span="3">
                                <a-form-item>
                                    <a-input placeholder="限10个字" v-model="formData.gift1"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="1">
                            </a-col>
                            <a-col :span="3">
                                <a-form-item>
                                    <a-input placeholder="限10个字" v-model="formData.gift2"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="1">
                            </a-col>
                            <a-col :span="3">
                                <a-form-item>
                                    <a-input placeholder="限10个字" v-model="formData.gift3"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="2" class="text-right">
                                <a-form-item>
                                    <a-button type="default" @click="staffLogin()">
                                        查询
                                    </a-button>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </template>-->
                </a-table>
            </a-layout-content>
        </a-spin>
        <a-modal v-model="visible_staff" title="预约礼维护" ok-text="确认" cancel-text="取消" @ok="handleSubmit">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 14 }, }">
                <a-form-item label="店铺名称">
                   <span>
                       {{formData.name}}
                   </span>
                </a-form-item>

                <a-form-item label="预约礼">
                    <a-input placeholder="建议10个字" v-model="formData.gift1"></a-input>
                    <a-input placeholder="建议10个字" v-model="formData.gift2"></a-input>
                    <a-input placeholder="建议10个字" v-model="formData.gift3"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import groupMerchantApi from '@/api/group/merchant'

    const columns = [
        {
            title: '店铺名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '预约礼',
            dataIndex: 'gift',
            scopedSlots: {customRender: 'gift'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "AppointGiftList",
        components: {ACol, ARow},
        activated() {
            this.getStoreList()
        },
        created() {
            this.getStoreList()
        },
        data() {
            return {
                spinning: false,
                visible_staff: false,
                data: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    'show-total': (total) => `共 ${total} 条记录`,
                    'show-size-changer': true,
                    'show-quick-jumper': true,
                },
                formData: {
                    name: "",
                    gift1: "",
                    gift2: "",
                    gift3: ""
                },
                columns,
            }
        },
        methods: {
            getStoreList() {
                this.request(groupMerchantApi.getStoreList, {}).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.count
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.getStoreList()
                }
            },
            setManage(store_id) {
                this.visible_staff = true
                this.request(groupMerchantApi.getGiftMsg, {store_id: store_id}).then((res) => {
                    this.formData = res.list
                })
            },
            handleSubmit(e) {
                e.preventDefault()
                this.request(groupMerchantApi.updateAppointGift, this.formData).then((res) => {
                    if (res) {
                        this.visible_staff = false
                        this.$message.success('操作成功！')
                        this.getStoreList()
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
        },
    }
</script>

<style scoped>

</style>