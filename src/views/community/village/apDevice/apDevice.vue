<template>
  <div class="message-suggestions-list-box">
    <div class="search-box">
      <a-row :gutter="48" style="margin-bottom: 20px;margin-left: 20px">
          <a-col :md="6" :sm="18" >
              <a-input-group compact>
                  <label style="margin-top: 5px;">设备编号：</label> <a-input style="width: 150px" placeholder="请输入设备编号" v-model="search.ac_num"/>
              </a-input-group>
          </a-col>
          <a-col :md="6" :sm="18" >
              <a-input-group compact>
                  <label style="margin-top: 5px;">设备名称：</label> <a-input style="width: 150px" placeholder="请输入设备名称" v-model="search.ac_name"/>
              </a-input-group>
          </a-col>
          <a-col :md="6" :sm="24" >
              <label style="margin-top: 5px;">设备状态：</label>
              <a-select  style="width: 170px" placeholder="请选择设备状态" v-model="search.status">
                  <a-select-option value="0">
                      全部
                  </a-select-option>
                  <a-select-option value="1">
                      在线
                  </a-select-option>
                  <a-select-option value="2">
                      离线
                  </a-select-option>
              </a-select>
          </a-col>
          <a-col :md="2" :sm="24" class="suggestions_col_btn">
              <a-button type="primary" icon="search" @click="searchList()">
                  查询
              </a-button>

          </a-col>
          <a-col :md="2" :sm="24" class="suggestions_col_btn">
              <a-button type="primary"  @click="reset()">
                  重置
              </a-button>
          </a-col>
      </a-row>
    </div>
    <br>
      <a-button type="primary" style="margin-left: 20px;" @click="$refs.AddModel.add()">添加设备</a-button>
  <a-table
           :columns="columns"
           :data-source="data"
           class="components-table-demo-nested"
           :pagination="pagination"
            @change='table_change'
           :loading="loading"  >
     <span slot="action" slot-scope="text, record">
          <a @click="$refs.OrderModel.edit(record.id)">修改</a>
          <a-divider type="vertical"/>
         <a-popconfirm title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="clear(record.id)">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
   </span>
    
   </a-table>
      <edit-ap-device ref="OrderModel" @ok="editOk"/>
      <add-ap-device ref="AddModel" @ok="editOk"/>
  </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import EditApDevice from "@/views/community/village/apDevice/editApDevice"
    import AddApDevice from "@/views/community/village/apDevice/addApDevice";
    const columns = [
        {title: '设备编号', dataIndex: 'ac_series', key: 'ac_series' },
        { title: '设备名称',  dataIndex: 'ac_name', key: 'ac_name'},
	    { title: '设备类型',  dataIndex: 'ac_type', key: 'ac_type'},
        { title: '设备位置',  dataIndex: 'address', key: 'address'},
        { title: '设备状态',  dataIndex: 'status', key: 'status'},
        { title: '启用时间',  dataIndex: 'use_time', key: 'use_time'},
        { title: '最后修改时间',  dataIndex: 'last_time', key: 'last_time'},
        { title: '操作', key: 'action', width: '170px', dataIndex: '', scopedSlots: { customRender: 'action' } }
    ];
    const data = [];
    export default {
        name: 'apDevice',
        filters: {

        },
        components:{
            EditApDevice,
            AddApDevice
        },
        data() {
            return {
              pagination: { pageSize: 10, total:10 ,current:1},
                search: {ac_num:'',ac_name:'',status:'0',page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
            };
        },
        mounted () {
            this.getList();
        },
        computed:{

        },
        methods: {
            clear(id){
                let that = this
                this.request(villageApi.delDevice, {id:id})
                    .then((res) => {
                        if (res){
                            that.getList();
                            that.$message.success('刪除成功');
                        }
                    })
            },
            editOk () {
                this.getList()
            },
            reset(){
                this.search={ac_num:'',ac_name:'',status:'0',page: 1 }
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getApDeviceList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data = res.list;
                        this.loading = false;
                    })
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