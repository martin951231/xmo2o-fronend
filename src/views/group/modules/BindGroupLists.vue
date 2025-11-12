<template>
    <a-table
        rowKey="group_id"
        :pagination="pagination"
        :columns="bindGroupColumns"
        :data-source="bindGroupLists"
        @change="handleTableChange"
      >
      <span slot="status_str" slot-scope="text, record">
        <a-badge :status="record.status==1 ? 'success' : 'default'" :text="text"/>
      </span>
      <span slot="is_running_str" slot-scope="text, record">
        <a-badge :status="record.is_running==1 ? 'success' : 'default'" :text="text"/>
      </span>

      <span slot="action" slot-scope="text">
        <a-popconfirm
          title="确定删除，无法恢复?"
          @confirm="() => removeBind(text)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
</template>

<script>
    import groupMerchantApi from '@/api/group/merchant'
    const bindGroupColumns = [
        {
                title: 'ID',
                dataIndex: 'group_id',
            },
            {
                title: '名称',
                dataIndex: 's_name',
            },
            {
                title: '价格',
                dataIndex: 'price',
            },
            {
                title: '运行状态',
                dataIndex: 'is_running_str',
                scopedSlots: {
                    customRender: 'is_running_str',
                },
            },
            {
                title: '团购状态',
                dataIndex: 'status_str',
                scopedSlots: {
                    customRender: 'status_str',
                },
            },
            {
                title: '操作',
                dataIndex: 'group_id',
                scopedSlots: {
                    customRender: 'action',
                },
            },
    ];
    export default {
        name: "BindGroupLists",
        props: {
            // 存放路径
            packageid: {
                type: [String, Number],
                default: '0',
            },
        },
        mounted() {
            console.log('mounted bind-group-lists')
            this.getBindGroup()
        },
        data() {
            return {
                bindGroupColumns,
                dialogVisible: true,
                bindGroupLists:[],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                },
            }
        },
        methods: {
            getBindGroup() {
                this.request(groupMerchantApi.getGoodsList, {
                    packageid: this.packageid, 
                    page: this.pagination.current,
                    page_size: this.pagination.pageSize
                }).then(data => {
                    this.bindGroupLists = data.list;
                    this.pagination.total = data.total;
                })
            },
            handleTableChange(pagination) {
                this.$set(this.pagination, 'current', pagination.current)
                this.getBindGroup()
            },
            removeBind(id){
                this.request(groupMerchantApi.delPackageBindGroup, {
                    packageid: this.packageid, 
                    group_id: id
                }).then(data => {
                    this.$message.success('删除成功！')
                    this.getBindGroup();
                })
            }
        }
    }
</script>