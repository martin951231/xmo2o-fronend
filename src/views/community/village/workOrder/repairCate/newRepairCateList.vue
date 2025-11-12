<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="table-operator">
                <a-alert message="工单类目，即物业日常管理事务中涉及到业主提交工单的场景，例如报修、投诉建议等，物业可根据实际需要创建工单类目用以工单流转管理" type="info"  banner  style="margin-top: -10px;margin-bottom: 10px;"/>
               <a-alert message="请注意：为了同步类目菜单数据,工单类目添加和编辑会强刷页面!" type="info" banner  style="margin-top: -10px;margin-bottom: 10px;"/>
                <div style="display: flex;" v-if="auth && auth['addCategory'] == 1">
                    <a-button type="primary" icon="plus" @click="$refs.createModalsss.add()">添加工单类目</a-button>
                    <!-- <a-button type="primary" icon="transaction" style="margin-left: 20px;" @click="chargeSet">收费设置</a-button>-->
                </div>
            </div>
            <a-table :columns="columns" :data-source="list"
                     :pagination="pagination"
                     rowKey="id"
                     @change="tableChange">
                    <a-tag  slot="charge_type_text" slot-scope="text, record"  :color="record.charge_type_text ? 'red' : ''" >
                        {{  record.charge_type_text }}
                    </a-tag> 
                    <a-tag  slot="color" slot-scope="text, record" :color="text" >
                        {{  text }}
                    </a-tag>
                    <span slot="cate_name" slot-scope="text, record">
                        <router-link :to="{ name:'house_repaircategorylist_'+record.id}" style="color: #1890ff;" v-if="record.status1==1">{{record.cate_name}}</router-link>
                        <span v-else>{{record.cate_name}}</span>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a @click="$refs.createModalsss.edit(record.id)"  v-if="auth && auth['editCategory'] == 1">编辑</a>
                        <a-divider type="vertical" v-if="record.status1==1 && auth && auth['categoryManagement'] == 1"/>
                        <router-link :to="{ name:'house_repaircategorylist_'+record.id}" style="color: #1890ff;" v-if="record.status1==1 && auth && auth['categoryManagement'] == 1">管理</router-link>
                        <a-divider type="vertical" v-if="auth && auth['deleteCategory'] == 1"/>
                        <a-popconfirm title="删除后子分类会同步删除，确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                            @cancel="delCancel" v-if="auth && auth['deleteCategory'] == 1">
                            <a style="color: red;">删除</a>
                        </a-popconfirm>
                    </span>
                    <span slot="status" slot-scope="text,record">
                        <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
                            {{ text }}
                        </div>
                    </span>
                    <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
            </a-table>
        </a-card>
        <group-info :height='800' :width="1200" ref="createModalsss" @ok="handleOks"/>
        <charge-model v-if="showCharge" @closeCharge="closeCharge" :visible="showCharge" />
    </div>
</template>
<script>
    import configVillageApi from "@/api/community/village"
    import groupInfo from './newRepairCateInfo.vue'
    import chargeModel from "./chargeModel.vue"
    const columns = [
        {
            title: '类目名称',
            dataIndex: 'cate_name',
            key: 'cate_name',
            scopedSlots: {
                customRender: 'cate_name'
            }
        } ,{
            title: '当前类目是否收费',
            dataIndex: 'charge_type_text',
            key: 'charge_type_text',
            scopedSlots: {
                customRender: 'charge_type_text'
            }
        },{
            title: '背景色（仅移动端展示用)',
            dataIndex: 'color',
            key: 'color',
            scopedSlots: {
                customRender: 'color'
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {
                customRender: 'status'
            }
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    export default {
        name: 'newRepairCateList',
        components: {
            groupInfo,
            chargeModel
        },
        data() {
            return {
                list: [],
                sortedInfo: null,
                pagination: {current:1,pageSize: 10, total: 10},
                search: {page: 1},
                page: 1,
                search_data: [],
                id: 0,
                columns,
                showCharge: false,
                auth: {},
            };
        },
        mounted() {
            this.getSubjectList()
        },
        created() {
        },
        methods: {
            delConfirm(record) {
                let that = this
                that.request(configVillageApi.deleteHouseNewRepairCate, {cate_id: record.id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getSubjectList()
                })
            },
            chargeSet(){
                this.showCharge = true
                console.log("this.showCharge===>", this.showCharge)
            },
            getSubjectList() {
                this.page = this.pagination.current;
                this.request(configVillageApi.getCateList, {'page': this.page,'parent_id':0})
                    .then((res) => {
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.auth = res.auth  ? res.auth : {}
                    })
            },
            tableChange(e) {
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current;
                    this.getSubjectList()
                }
            },
            cancel() {

            },
            handleOks() {
                //this.getSubjectList();
                window.location.reload();
            },
            closeCharge(){
                this.showCharge = false
            }
        },
    };
</script>
<style scoped>
    .txt-green {
        color: #0fb70f;
    }

    .txt-red {
        color: red;
    }

    .table-operator {
        margin-bottom: 10px;
    }

</style>