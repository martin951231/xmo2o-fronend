<template>
  <a-modal :title="title" :width="700" :visible="visible" :maskClosable="false" :footer="null"
           :confirmLoading="loading" @cancel="handleCancel">
    <div class="message-suggestions-list-box">
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"  >
        </a-table>
    </div>
  </a-modal>
</template>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '退款金额',  dataIndex: 'refund_money', key: 'refund_money'},
        { title: '线上退款金额',  dataIndex: 'refund_online_money', key: 'refund_online_money'},
        { title: '余额退款金额',  dataIndex: 'refund_balance_money', key: 'refund_balance_money'},
        { title: '积分抵扣退款金额',  dataIndex: 'refund_score_money', key: 'refund_score_money'},
        { title: '积分抵扣退款积分数量',  dataIndex: 'refund_score_count', key: 'refund_score_count'},
        { title: '退款时间',  dataIndex: 'add_time', key: 'add_time'},
        { title: '退款原因',  dataIndex: 'refund_reason', key: 'refund_reason'},
        { title: '操作人',  dataIndex: 'role_name', key: 'role_name'},
    ];
    const data = [];
    export default {
        name: 'refundList',
        filters: {
        },

        data() {
            return {
                title:'退款纪录',
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1
            };
        },
        methods: {
          add(id) {
            this.title = '退款纪录';
            this.visible = true;
            this.id=id;
            console.log('id',id)
            this.getList();
          },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.request(villageApi.refundList,{order_id:this.id,page:this.page,limit:this.pagination.pageSize})
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                    })
            },

          handleCancel() {
            this.visible = false
            setTimeout(() => {
              this.post = {};
              this.form = this.$form.createForm(this)
            }, 500)
          },
            onTableChange(page,pageSize){
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getList()
                }
            },
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
        border: 1px solid #e4dfdf;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
</style>