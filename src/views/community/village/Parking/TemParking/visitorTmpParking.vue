<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
      <a-row :gutter="48" style="margin-bottom: 20px;margin-left: 20px">
       选择时间 ：<a-range-picker style="margin-left: 20px" @change="onChange" />
      </a-row>
    </div>
    <br>
  <a-table
           :columns="columns"
           :data-source="data"
           class="components-table-demo-nested"
           :pagination="pagination"
            @change='table_change'
           :loading="loading"  >
     <span slot="action" slot-scope="text, record">
     <a>详情</a>
   </span>
    
   </a-table>
  </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    
    const columns = [
        {title: '车牌号', dataIndex: 'car_id', key: 'car_id' },
        { title: '姓名',  dataIndex: 'visitor_name', key: 'visitor_name'},
        { title: '联系方式',  dataIndex: 'visitor_phone', key: 'visitor_phone'},
	{ title: '添加时间',  dataIndex: 'add_time_str', key: 'add_time_str'},
    ];
    const data = [];
    export default {
        name: 'visitorTmpParking',
        filters: {

        },
        components:{
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
                this.request(villageApi.visitorTmpParking, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
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