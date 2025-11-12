<template>
  <div class="message-suggestions-list-box">
      <a-row >
        <a-col style="margin: 20px 0px 20px 30px;">
          <a-button type="primary" @click="addNoticeWork()">添加/修改通知人员</a-button>
        </a-col>
    </a-row>
  <a-table
           :columns="columns"
           :data-source="data"
           class="components-table-demo-nested"
           :pagination="pagination"
            @change='table_change'
           :loading="loading"  >
   </a-table>
   <off-line-worker ref="offLineWorkerModel" @ok="bindOk"/>
  </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import offLineWorker from '@/views/community/village/hardware/offLineWorker'
    
    const columns = [
        {title: '设备品牌', dataIndex: 'device_brand_str', key: 'device_brand_str' },
        { title: '设备类型',  dataIndex: 'device_type_str', key: 'device_type_str'},
        { title: '设备号',  dataIndex: 'device_sn', key: 'device_sn'},
        { title: '设备位置',  dataIndex: 'address', key: 'address'},
        { title: '状态',  dataIndex: 'device_status_str', key: 'device_status_str'},
        { title: '发生时间',  dataIndex: 'add_time_str', key: 'add_time_str'},
        { title: '备注',  dataIndex: 'reason', key: 'reason'},
        { title: '通知人员',dataIndex:'worker_str',key: 'worker_str'},
    ];
    const data = [];
    export default {
        name: 'offLineDevList',
        filters: {

        },
        components:{
            offLineWorker
        },
        data() {
            return {
              pagination: { pageSize: 10, total:10 ,current:1},
                search: {begin_time:'',end_time:'',page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                options: [],
                search_data:'',
                page: 1,
            };
        },
        mounted () {
            this.getList();
        },
        computed:{

        },
        methods: {
            clear(){
            },

            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getOffLineDevList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 20;
                        this.data = res.list;
                        this.loading = false;
                        this.total_money = res.total_money;
                    })
            },
            // 日期切换，重新赋值
            onChange(date, dateString) {
                console.log(dateString);
                this.search.begin_time='';
                this.search.end_time='';
                if(dateString){
                    this.search.begin_time=dateString[0];
                    this.search.end_time=dateString[1];
                }
                this.getList()
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page = 1;
              let val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              this.table_change(val)
               // this.getList()
            },
            addNoticeWork(){
                this.$refs.offLineWorkerModel.add();
            },
            bindOk(){
                this.getList()
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