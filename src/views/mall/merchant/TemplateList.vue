<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout>
                <a-layout-content  :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                    <a-button type="primary" @click="addTemplates()">
                        新建运费模板
                    </a-button>
                    <a-table :columns="columns" :data-source="data" :showHeader="false"  rowKey="id"
                             :pagination="pagination">
         <span slot="action" slot-scope="text, record">
            <span>最后编辑时间 {{record.dateline}}</span>
            <a @click="updateTemplate(record.id)" class="ml-10">修改</a>
            <a @click="delTemplate(record.id)" class="ml-10">删除</a>
         </span>

                        <a-table
                                slot="expandedRowRender"
                                slot-scope="text"
                                :columns="text.innerColumnsInfo"
                                :data-source="text.value_list"
                                :pagination="false"
                        >
                             <span slot="addr_to" slot-scope="text">
                                 {{text}}
                             </span>
                            <span slot="first_weight" slot-scope="text">
                                 {{text}}
                             </span>
                            <span slot="first_freight" slot-scope="text">
                             {{text}}
                             </span>
                            <span slot="add_weight" slot-scope="text">
                               {{text}}
                             </span>
                            <span slot="add_freight" slot-scope="text">
                              {{text}}
                             </span>
                        </a-table>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-spin>
    </div>
</template>

<script>
    import moment from 'moment'
    import mallMerchantApi from '@/api/mall/merchant/index'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        /*{title: '模板ID', dataIndex: 'id', key: 'id', colSpan: 0},*/
        {title: '模板名称', dataIndex: 'name', key: 'name'},
        {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, align: 'right'}
    ];
    let data = [];
    const innerColumns = [
        {title: '可配送至', dataIndex: 'addr_to', key: 'addr_to', scopedSlots: {customRender: 'addr_to'}},
        {title: '首件', dataIndex: 'first_weight', key: 'first_weight'},
        {title: '运费(人民币)', key: 'first_freight', dataIndex: 'first_freight'},
        {title: '续件', dataIndex: 'add_weight', key: 'add_weight'},
        {title: '续费(人民币)', dataIndex: 'add_freight', key: 'add_freight'}
    ];
    const innerColumns2 = [
        {title: '可配送至', dataIndex: 'addr_to', key: 'addr_to', scopedSlots: {customRender: 'addr_to'}},
        {title: '首重(KG)', dataIndex: 'first_weight', key: 'first_weight'},
        {title: '运费(人民币)', key: 'first_freight', dataIndex: 'first_freight'},
        {title: '续重(KG)', dataIndex: 'add_weight', key: 'add_weight'},
        {title: '续费(人民币)', dataIndex: 'add_freight', key: 'add_freight'}
    ];

    const innerData = [];
    export default {
        name: "TemplateList",
        components: {ACol, ARow},
        data() {
            return {
                mer_id: '',
                is_show: false,
                data,
                columns,
                innerData,
                spinning: false,
                strs: "",
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 条记录`,
                },
            };
        },
        watch: {
            '$route.query.mer_id': {
                deep: true,
                handler() {
                    this.pagination.current = 1
                    this.pagination.pageSize = 10
                    this.getDataList()
                }
            }
        },
        created() {
            this.mer_id = this.$route.query.mer_id
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.getDataList()
        },
        methods: {
            moment,
            getDataList() {
                let params = {
                    page: this.pagination.current,
                    pageSize: this.pagination.pageSize
                };
                this.request(mallMerchantApi.getTemplateList, params).then((res) => {
                    this.data = res.list
                    this.$set(this.pagination, 'total', res.count)
                    var innerColumn1 = innerColumns;
                    var innerColumn2 = innerColumns2;
                    this.data.forEach(function(e,t){
                         e.innerColumnsInfo = e.freight_type == 1 ? innerColumn1 : innerColumn2;
                    })
                    console.log(this.data,123123);
                })
            },
            innerString(str) {
                this.strs = ""
                for (let i = 0; i < str.length; ++i) {
                    this.strs = this.strs + str[i].area_name + ","
                }
                return this.strs;
            },
            // 编辑活动
            updateTemplate(id) {
                //alert(id);
                localStorage.setItem("tid", id)
                this.$router.push({path: '/merchant/merchant.mall/templateEdit', query: {tid: id}})
            },
            // 编辑活动
            addTemplates() {
                localStorage.setItem("tid", 0)
                this.$router.push({path: '/merchant/merchant.mall/templateEdit', query: {tid: 0}})
            },
            delTemplate(id) {
                this.$confirm({
                    title: '是否确定删除该运费模板?',
                    centered: true,
                    onOk: () => {
                        this.request(mallMerchantApi.delTemplate, {tpl_id: id}).then((res) => {
                            this.getDataList()
                            this.$message.success('操作成功！')

                        })
                    },
                    onCancel() {
                    },
                })
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getDataList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getDataList()
            },
            removeTemplate(id) {
            },
            down() {
                this.is_show = true
            },
            // 提交搜索表单
            submitForm() {
                this.getDataList()
            },
            expandedRowsChange(expandedRows) {
                console.log(expandedRows, "expandedRows===expandedRows")
            }
        }
    };
</script>

<style>
    th.column-money,
    td.column-money {
        text-align: right !important;
    }
</style>