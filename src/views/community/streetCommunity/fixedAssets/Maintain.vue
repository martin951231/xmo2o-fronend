<template>
  <a-modal :title="title" :width="1100" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="1000">
      <div class="table-operator" style="margin-bottom: 10px;">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add(assets_num_id)">新增记录</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="img_path" slot-scope="text, record">
          <a @click="$refs.createModals.look(record.id,assets_num_id)">查看</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id,assets_num_id)">编辑</a>
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <maintain :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
      <accessory :height='800' :width="1200" ref="createModals" @ok="handleOks"/>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import maintain from './MaintainInfo';
    import accessory from './MaintainAccessory.vue';
    export default {
        components: {
            maintain,
            accessory
        },
        data() {
            return {
                title: '维修记录',
                visible: false,
                confirmLoading: false,
                list:[],
                sortedInfo:null,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                id:0,
                assets_num_id:0,
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
                        title: '维修人',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'phone',
                        key: 'phone',
                    },
                    {
                        title: '维修费用',
                        dataIndex: 'price',
                        key: 'price',
                    },
                    {
                        title: '维修时间',
                        dataIndex: 'time',
                        key: 'time',
                    },
                    {
                        title: '附件',
                        dataIndex: '',
                        key: 'img_path',
                        scopedSlots: {
                            customRender: 'img_path'
                        }
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        key: 'remark',
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
            look(assets_num_id) {
                this.title = '维修记录'
                this.visible = true
                this.assets_num_id = assets_num_id;
                this.id = 0;
                this.getMaintainList()
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getMaintainList()
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
            handleOks() {
                this.getMaintainList();
            },
            getMaintainList() {
                this.request(streetCommunityApi.getMaintainList, {
                    assets_num_id: this.assets_num_id,
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