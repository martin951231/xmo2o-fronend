<template>
    <a-drawer :title="xtitle" :width="1450" :visible="qvisible"
              @close="handleCancel" placement="right">
    <div class="message-suggestions-list-box">
        <a-table class="table_1" :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" :row-key="record => record.order_id"
          @change="table_change">
        </a-table>
    </div>
    </a-drawer>
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';

  const columns = [{
      title: '序号',
      dataIndex: 'order_id',
    },
    {
      title: '工单详情',
      dataIndex: 'order_content',
      scopedSlots: {
        customRender: 'order_content'
      },
    },
    {
      title: '工单类目',
      dataIndex: 'subject_name',
    },
    {
      title: '上报分类',
      dataIndex: 'cate_name',
    },
    {
      title: '评价星数',
      dataIndex: 'evaluate_star',
    },
    {
      title: '上报位置',
      dataIndex: 'address_txt',
    },
    {
      title: '上报人员',
      dataIndex: 'name',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '上报时间',
      dataIndex: 'add_time_txt',
    },
    {
      title: '状态  ',
      dataIndex: 'status_txt',
      scopedSlots: {
        customRender: 'status_txt'
      },
    },
  ];
    const data = [];
    export default {
        name: 'worksOrderEvaluateList',
        filters: {

        },
        components:{
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
              pagination: { pageSize: 10, total:10 ,current:1},
              search: {page: 1 },
                qvisible: false,
                loading: false,
                data,
                columns,
                page: 1,
                star:0,
                record:{},
                xtitle:'查看',
              confirmLoading:false,
            };
        },
        activated () {
          
        },
        methods: {
            // 获取列表信息
            qlist(record,star) {
                this.record=record;
                this.star=star;
                if(this.star*1==1){
                    this.xtitle='评价 一星 的工单查看';
                }else if(this.star*1==2){
                    this.xtitle='评价 二星 的工单查看';
                }else if(this.star*1==3){
                    this.xtitle='评价 三星 的工单查看';
                }else if(this.star*1==4){
                    this.xtitle='评价 四星 的工单查看';
                }else if(this.star*1==5){
                    this.xtitle='评价 五星 的工单查看';
                }
                this.qvisible=true;
                this.getList()
            },
            getList() {
                this.loading = true;
                let params=this.search;
                params.page = this.page;
                params.operator_id = this.record.operator_id;
                params.evaluate_star=this.star;
                this.request(villageApi.getRepairOrderEvaluateList, params)
                    .then((data) => {
                              this.pagination.total = data.total;
                              this.pagination.pageSize = data.limit;
                              this.loading = false;
                              this.data = data.list;
                            });
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },

         handleCancel() {
           this.qvisible=false;
           this.star=0;
           this.record={};
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