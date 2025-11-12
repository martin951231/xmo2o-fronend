<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="page-title">商家员工卡列表</div>
        <a-form-model layout="inline" :model="searchForm"
                      style="margin-bottom:20px;margin-left:20px;max-height: 600px; overflow-y: scroll">
            <a-row>
                <a-col :span="4">
                    <a-form-model-item label="员工卡名称">
                        <a-input v-model="searchForm.name" placeholder="请输入员工卡名称" style="width:160px;"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="4">
                    <a-form-model-item>
                        <a-button type="primary" icon="search" @click="getSportList()" class="ml-20"> 查询</a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <div>
            <a-form-model-item>
                <a-button type="primary" @click="$refs.editEmployeeCard.add()" class="ml-20 maxbox"> 添加</a-button>
            </a-form-model-item>
        </div>
        <a-table :columns="columns"
                 :data-source="data"
                 rowKey="id"
                 @change="handleTableChange">
                <span slot="bg_image" slot-scope="text,record">
                     <img :src="record.bg_image" width="60px"/>
                </span>

                <span slot="status" slot-scope="text,record">
                     <a v-if="record.status==1" class="ml-10 inline-block">开启</a>
                     <a v-if="record.status==0" class="ml-10 inline-block">关闭</a>
                </span>

            <span slot="action" slot-scope="text,record">
                          <a class="ml-10 inline-block" @click="editAct(record.card_id)">编辑</a>
                          <a class="ml-10 inline-block" @click="delAct(record.card_id)">删除</a>
                  </span>
        </a-table>
        <edit-employee-card @getSportList="getSportList" ref="editEmployeeCard"></edit-employee-card>
    </div>
</template>

<script>
    import moment from 'moment'
    import lifeMerchantApi from '@/api/life_tools/merchant/index'
    import 'ant-design-vue/dist/antd.css'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import EditEmployeeCard from "./modules/editEmployeeCard";
    Vue.use(Viewer)
    const columns = [
        {
            title: '员工卡名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '背景图',
            dataIndex: 'bg_image',
            scopedSlots: {customRender: 'bg_image'},
        },
        {
            title: '背景颜色',
            dataIndex: 'bg_color',
            slots: {customRender: 'bg_color'}
        },
        {
            title: '状态',
            scopedSlots: {customRender: 'status'},
            align: "status"
        },
        {
            title: '操作',
            dataIndex: 'tools_id',
            key: 'tools_id',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "EmployeeCardList",
        components: {EditEmployeeCard},
        data() {
            return {
                total_num: 0,
                visible: false,
                columns,
                data: [],
                areaList: [],
                formData: {},
                searchForm: {
                    name: '', // 搜索内容
                },
                queryParam: {
                    page: 1,
                    pageSize: 10,
                    education: -1,
                    job_age: '',
                    status: -1,
                    keywords: '',
                    cates: '',
                    mer_id: 0,
                },
            }
        },
        activated() {
            this.getSportList()
        },
        methods: {
            reset() {
                this.data = []
                this.getSportList()
            },
            editAct(id) {
                this.$refs.editEmployeeCard.edit(id);
            },
            getSportList() {
                this.request(lifeMerchantApi.getCardList, this.searchForm).then((res) => {
                    this.data = res.list
                    this.total_num = res.total
                })
            },
            delAct(id) {
                this.$confirm({
                    title: "是否删除商家员工卡",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(lifeMerchantApi.delCard, {
                            card_id: id,
                        }).then((res) => {
                            this.getSportList()
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test',
                })
            },
            handleUpdate() {
                this.getSportList()
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.queryParam.page = page
                this.$set(this.pagination, 'current', page)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
            },
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        min-height: 100%;
    }

    .page-title {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
    }

    .content {
        margin: 20px 30px;
    }

    .ant-row-flex {
        margin-bottom: 12px;
    }

    .ant-form-item {
        display: flex;
        align-items: center;
    }

    .ant-form-item-control-wrapper {
        padding-right: 100px;
        flex: 1;
        box-sizing: border-box;
    }

    .ant-form-item-children {
        width: 100%;
        display: inline-block;
    }

    .total-performance {
        margin: 20px 0;
        padding: 0 30px;
        width: 100%;
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1;
    }

    .cr-f1 {
        color: #f1f1f1;
    }
</style>