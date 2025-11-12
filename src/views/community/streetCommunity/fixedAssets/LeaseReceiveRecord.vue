<template>
  <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        data() {
            return {
                title: '领用租借记录',
                visible: false,
                confirmLoading: false,
                list:[],
                sortedInfo:null,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                id:0,
            }
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '出库方式',
                        dataIndex: 'type',
                        key: 'type',
                    },
                    {
                        title: '领用租借方',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'tel',
                        key: 'tel',
                    },
                    {
                        title: '领用租借时间',
                        dataIndex: 'time',
                        key: 'time',
                    },
                    {
                        title: '租借期限',
                        dataIndex: 'rent_end_time',
                        key: 'rent_end_time',
                    },
                    {
                        title: '收回时间',
                        dataIndex: 'take_back_time',
                        key: 'take_back_time',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        dataIndex: 'status',
                    },
                ];
                return columns;
            },
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        mounted() {
        },
        methods: {
            look(id) {
                this.title = '领用租借记录'
                this.visible = true
                this.id = id;
                this.getRecordList()
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getRecordList()
                }
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.d = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            cancel() {

            },
            getRecordList() {
                this.request(streetCommunityApi.getRecordList, {
                    id: this.id,
                    page:this.page,
                })
                    .then((res) => {
                        console.log(res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 20
                    })
            },
        },
    }
</script>
<style>
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>