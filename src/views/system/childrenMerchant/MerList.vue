<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <div class="table-operator">
            <a-button type="primary" icon="plus" @click="$refs.createModal.add()">添加子商户</a-button>
        </div>
        <a-card :bordered="false">
            <a-table :columns="columns" :data-source="packageList"
                     :pagination="pagination"
                     @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.package_id)">查看</a>
        </span>
                <span slot="action1" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.package_id)">编辑</a>
        </span>
                <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
            </a-table>
            <create-mer :height='800' ref="createModal" @ok="handleOk" :packageId="packageId" />
        </a-card>
    </div>
</template>
<script>
    import packageApi from '@/api/system/community/package';
    import CreateMer from './CreateMer';
    export default {
        name: "MerList",
        components: {
            CreateMer
        },
        data() {
            return {
                sortedInfo:null,
                packageList: [],
                pagination: { pageSize: 10, total:10 },
                packageId:'0',
                search: { page: 1 },
                page: 1,
            };
        },
        created() {},
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '子商户名称',
                        dataIndex: 'package_title',
                        key: 'package_title',
                    },
                    {
                        title: '子商户号',
                        dataIndex: 'count',
                        key: 'count',
                    },
                    {
                        title: '分成信息',
                        key: 'package_price',
                        dataIndex: 'package_price',
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                    {
                        title: '承担信息',
                        key: 'package_try_days',
                        dataIndex: 'package_try_days',
                        scopedSlots: {
                            customRender: 'action'
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'action1'
                        }
                    },
                ];
                return columns;
            },
        },
        mounted() {
            this.packageTree();
        },
        methods: {
            packageTree() {
                this.search['page'] = this.page;
                let _this = this
                this.request(packageApi.packageList, this.search)
                    .then((res) => {
                        console.log('res', res)
                        this.packageList = res.list
                        this.pagination.total = res.count ? res.count : 0
                    })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.packageTree()
                }
            },
            handleOk() {
                this.packageTree()
            },
            deleteConfirm(packageId){
                this.request(packageApi.delPackage,{'package_id':packageId})
                    .then((res) => {
                        this.packageTree()
                        this.$message.success('删除成功')

                    })
            },
            add(){

            },
            cancel() {

            },
        }
    };
</script>
<style lang="less" scoped>
    .package-list .table-operator {
        margin-bottom: 24px;
    }
</style>
<style>
    .ant-popover-content button{
        margin: 0 10px;
    }
</style>