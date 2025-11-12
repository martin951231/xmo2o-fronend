<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <h3><a>设置客服</a></h3>
        <a-divider style="margin-top: 10px;" />

        <a-row>
            <a-input-search @search="onSearch" placeholder="请搜索客服名称/电话" style="width: 280px;" />
            <a-button type="primary" @click="$refs.KefuEditModel.showEdit(0)" style="float: right;">新建客服</a-button>
        </a-row>
        <a-row style="margin-top: 10px;">
            <a-table style="background: #ffffff" :columns="columns" rowKey="pigcms_id" :data-source="dataList"
                @change="changePage" :pagination="pagination">



                <span slot="action" slot-scope="text">
                    <a class="inline-block" @click="$refs.KefuEditModel.showEdit(text)"
                        style="margin-right: 10px">{{ L('编辑') }}</a>
                    <a class="inline-block" @click="delKefu(text)">{{ L('删除') }}</a>
                </span>

            </a-table>
        </a-row>
        <kefu-edit @loadRefresh="getData" ref="KefuEditModel" />
    </div>
</template>

<script>
    import KefuEdit from './modules/KefuEdit.vue'
    import lifeToolsPlatformApi from '@/api/life_tools/platform'
    export default {
        components: {
            KefuEdit
        },
        data() {
            return {
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                queryParam: {
                    page: 1,
                    keywords: ''
                },
                columns: [{
                        title: this.L('客服名称'),
                        dataIndex: 'name'
                    },
                    {
                        title: this.L('权限'),
                        dataIndex: 'work_text'
                    },
                    {
                        title: this.L('接收消息时间'),
                        dataIndex: 'work_date_text'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'pigcms_id',
                        key: 'pigcms_id',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    }
                ]
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.request(lifeToolsPlatformApi.getKefuList, this.queryParam).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data
                })
            },
            onSearch(val) {
                this.queryParam.keywords = val;
                this.getData();
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            delKefu(pigcms_id) {
                this.$confirm({
                    title: '是否确定删除此客服?',
                    centered: true,
                    onOk: () => {

                        this.request(lifeToolsPlatformApi.delKefu, {
                            pigcms_id: pigcms_id
                        }).then((res) => {
                            this.$message.success('操作成功！')
                            this.getData()  
                        })
                    },
                    onCancel() {},
                })
            }
        }
    }
</script>

<style>
</style>
