<template>
  <a-drawer :title="title" :width="1200" :visible="visible" :maskClosable="false" :confirmLoading="loading"  @close="handleCancel">
    <div style="background-color: white;">
        <span class="page_top" v-if="charge_type!='park_new'">
            1、列表展示当前收费标准名称已经绑定的所有{{$store.getters.config.room_name}}/车位信息；<br/>
            2、{{$store.getters.config.room_name}}{{$store.getters.config.single_name}}、{{$store.getters.config.floor_name}}、楼层、{{$store.getters.config.room_name}}信息进行查询绑定对象；<br/>
            3、通过在车场的所属车库、车位号筛选功能，查询车辆绑定对象；<br/>
            <span style="color: red">
              注意：全选框只能选中当前页的所有绑定对象，如需选中绑定对象，需要每页都选中全选框绑定
          </span>
        </span>
        <span class="page_top" v-else>
            1、列表展示当前收费标准名称已经绑定的所有车位信息；<br/>
            2、通过在车场的所属车库、车位号筛选功能，查询车辆绑定对象；<br/>
            <span style="color: red">
              注意：全选框只能选中当前页的所有绑定对象，如需选中绑定对象，需要每页都选中全选框绑定
          </span>
        </span>
      <a-tabs :active="active" @change="callback">
        <a-tab-pane key="1" tab="房产" v-if="charge_type!='park_new'">
          <div class="order-list-box">
            <div class="search-box" style="display: flex;">
                <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
                <a-cascader class="cascader_style margin_left_10" :options="options" :load-data="loadDataFunc"
                    :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" v-model="search.vacancy" />
                <a-button style="margin-left: 10px;" type="primary" icon="search" @click="searchList()">
                  查询
                </a-button>
                <a-button style="margin-left: 10px;" @click="clearList()">
                  清空
                </a-button>
            </div>
            <div class="table-operator" style="margin:10px 1px 10px">
              <a-button type="primary"  @click="$refs.AddBindModel.add(rule_id,'1')">绑定{{$store.getters.config.room_name}}</a-button>
              <a-button type="primary"  style="margin-left: 10px" @click="$refs.AddVacancyModel.add(rule_id, 'bind_room')">批量绑定</a-button>
              <a-button type="primary"  style="margin-left: 10px" @click="$refs.OrderLogModel.add(rule_id,'1')">查看账单生成结果</a-button>
              <a-popconfirm
                style="margin-left: 10px"
                class="ant-dropdown-link"
                title="确认解绑?"
                ok-text="是"
                cancel-text="否"
                @confirm="unbindAll(1)"
                @cancel="cancel">
                <a-button type="primary"  >批量解绑</a-button>
              </a-popconfirm>
              <a-button type="primary"  style="margin-left: 10px"  v-if="standard_bind_import_btn>0" @click="importVacancyBind(0)">导入房间绑定数据</a-button>
              
            </div>
            <a-table
              :columns="columns"
              :data-source="data"
              :row-selection="rowSelection"
              rowKey="id"
              class="components-table-demo-nested"
              :pagination="pagination"
              @change='table_change'>
               <span slot="action" slot-scope="text, record">
                     <a-popconfirm
                       class="ant-dropdown-link"
                       title="确认解绑?"
                       ok-text="是"
                       cancel-text="否"
                       @confirm="bind(record.id,1)"
                       @cancel="cancel">
              <a href="#">解绑</a>
            </a-popconfirm>
        </span>
            </a-table>
          </div>

        </a-tab-pane>
        <a-tab-pane key="2" tab="车场" force-render v-if="!no_paking_bind">

          <div class="order-list-box">
            <div class="search-box" style="display: flex;">
                <label style="margin-top: 5px;">所属车库：</label>
                <a-select default-value="0" style="width: 200px; margin-left: 10px;" placeholder="请选择车库" v-model="search1.garage_id">
                  <a-select-option :value="0">
                    全部
                  </a-select-option>
                  <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                    {{item.garage_num}}
                  </a-select-option>
                </a-select>
                <label style="margin-top: 5px; margin-left: 10px;">车位号：</label> 
                <a-input style="width: 200px; margin-left: 10px;" placeholder="请输入车位号" v-model="search1.position_num"/>
                <a-button style="margin-left: 10px;" type="primary" icon="search" @click="searchList()">
                  查询
                </a-button>
                <a-button style="margin-left: 10px;" @click="clearList()">
                  清空
                </a-button>
            </div>
            <div class="table-operator" style="margin:10px 1px 10px">
              <a-button type="primary"  @click="$refs.AddBindModel.add(rule_id,'2', charge_type)">绑定车位</a-button>
              <a-button type="primary" v-if="charge_type == 'park_new'" style="margin-left: 10px" @click="$refs.AddVacancyModel.add(rule_id, 'bind_car')">批量绑定</a-button>
                <a-button type="primary"  style="margin-left: 10px" @click="$refs.OrderLogModel.add(rule_id,'2')">查看账单生成结果</a-button>
              <a-popconfirm
                style="margin-left: 10px"
                class="ant-dropdown-link"
                title="确认解绑?"
                ok-text="是"
                cancel-text="否"
                @confirm="unbindAll(2)"
                @cancel="cancel">
                <a-button type="primary"  >批量解绑</a-button>
              </a-popconfirm>
              
             <a-button type="primary"  style="margin-left: 10px"  v-if="standard_bind_import_btn>0" @click="importVacancyBind(1)">导入车位绑定数据</a-button>
            </div>
            <a-table
              :columns="columns1"
              :data-source="data1"
              :row-selection="rowSelection1"
              rowKey="id"
              class="components-table-demo-nested"
              :pagination="pagination1"
              @change='table_change1'>
               <span slot="action" slot-scope="text, record">
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认解绑?"
            ok-text="是"
            cancel-text="否"
            @confirm="bind(record.id,2)"
            @cancel="cancel">
              <a href="#">解绑</a>
            </a-popconfirm>
        </span>
            </a-table>
          </div>

        </a-tab-pane>
      </a-tabs>
      <addBindList ref="AddBindModel" @ok="bindOk"/>
      <order-log-list ref="OrderLogModel" @ok="bindOk"/>
      <addVacancyBind ref="AddVacancyModel" @ok="bindOk"/>
      <uploadVacancyBind :visible="importVacancyBindVisibile" :rule_id="rule_id" :uploadType="uploadxType" @exit="closeImportVacancyBind" />
    </div>
  </a-drawer>
</template>
<script>
  import villageApi from '@/api/community/village'
  import addBindList from './addBindList';
  import addVacancyBind from './addVacancyBind';
  import OrderLogList from "@/views/community/village/charge/standard/orderLogList";
  import uploadVacancyBind from '../components/uploadVacancyBind';
  import store from '@/store';
  
  const columns = [
    { title: '楼号',  dataIndex: 'single_name', key: 'single_name'},
    { title: store.getters.config.floor_name+'名称',  dataIndex: 'floor_name', key: 'floor_name'},
    { title: '层号',  dataIndex: 'layer_name', key: 'layer_name'},
    { title: store.getters.config.room_name+'号',  dataIndex: 'room', key: 'room'},
    { title: '收费周期',  dataIndex: 'cycle', key: 'cycle'},
    { title: '账单生成时间',  dataIndex: 'order_add_time', key: 'order_add_time'},
    { title: '账单生成周期模式',  dataIndex: 'date_status', key: 'date_status'},
    {
      title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'}
     },
  ];

  const columns1 = [
    { title: '车位号',  dataIndex: 'position_num', key: 'position_num'},
    { title: '所属车库',  dataIndex: 'garage_num', key: 'garage_num'},
    { title: '收费周期',  dataIndex: 'cycle', key: 'cycle'},
    { title: '账单生成时间',  dataIndex: 'order_add_time', key: 'order_add_time'},
    { title: '账单生成周期模式',  dataIndex: 'date_status', key: 'date_status'},
    {
      title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'}
    },
  ];

  export default {
    name: 'bingList',
    data() {
      return {
        title:'绑定',
        key:1,
        active:1,
        data:[],
        data1:[],
        rule_id:0,
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
          pagination1: {
              current:1,
              pageSize: 10,
              total:10,
              showSizeChanger: true, // 显示可改变每页数量
              pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
              showTotal: total => `共 ${total} 条`, // 显示总数
              onShowSizeChange: (current, pageSize) => this.onTableChange1(current, pageSize), // 改变每页数量时更新显示
              onChange:(page,pageSize)=>this.onTableChange1(page,pageSize)//点击页码事件
          },
        search_data: [],
        search: { page: 1 },
        search_data1: [],
        search1: { page: 1 },
        form: this.$form.createForm(this),
        visible: false,
        loading:false,
        columns,
        columns1,
        page: 1,
        page1: 1,
        position_id:[],
        vacancy_id: [],
        village_list: [],
        single_list: [],
        floor_list: [],
        layer_list: [],
        vacancy_list: [],
        garage_list:[],
        options: [],
        selectedRowKeys:[],
        selectedRowKeys1:[],
        charge_type: '',
        recordObj:{},
        no_paking_bind:false,
        standard_bind_import_btn:0,
        importVacancyBindVisibile:false,
        uploadxType:'standardVacancyBind',
      };
    },
    components:{
      OrderLogList,
      addBindList,
      addVacancyBind,
      uploadVacancyBind,
    },
    computed: {
      // 表格选择操作
      rowSelection() {
        return {
          selectedRowKeys:this.selectedRowKeys,
          onChange: this.onSelectChange,
        }
      },
      rowSelection1() {
        return {
          selectedRowKeys:this.selectedRowKeys1,
          onChange: this.onSelectChange1,
        }
      },
    },
    methods: {
      // 获取列表信息
      list(rule_id=0, charge_type='', record={}) {
          console.log('record',record)
        this.title='绑定'+'【'+record.charge_number_name+'-'+record.project_name+'-'+record.charge_name+'】';
        this.recordObj = record
        this.charge_type = charge_type
        this.uploadxType='standardVacancyBind';
        if(this.charge_type == 'park_new'){
            this.key = 2
            
        }
        if(this.charge_type == 'public_water' || this.charge_type == 'public_electric'){
            this.no_paking_bind=true;
        }
        if(this.key*1 == 2){
           this.uploadxType='standardPositionBind'; 
        }
        this.loading = true;
        this.visible=true;
        this.rule_id=rule_id;
        this.page=1;
        this.page1=1;
        this.search['page'] = 1;
        this.search1['page'] = 1;
        this.active=1;
        this.selectedRowKeys=[];
        this.selectedRowKeys1=[];
        this.vacancy_id =[];
        this.position_id=[];
        this.getBindList();
        this.getGarageList();
        this.getSingleListByVillage();
      },
      // 获取列表信息
      getBindList() {
        let search={}
        if (this.key==1){
          this.search['page'] = this.page;
          this.search['limit'] =  this.pagination.pageSize;
          this.search.bind_type=this.key
          this.search.rule_id=this.rule_id
          search=this.search
        }else{
          this.search1['page'] = this.page1;
          this.search1['limit'] =  this.pagination1.pageSize;
          this.search1.bind_type=this.key
          this.search1.rule_id=this.rule_id
          search=this.search1
        }
        if(this.charge_type == 'park_new'){
            this.search.bind_type = 2
        }
        this.request(villageApi.standardBindList, search)
          .then((res) => {
            console.log('res',res)
              this.selectedRowKeys=[];
              this.selectedRowKeys1=[];
              this.vacancy_id =[];
              this.position_id=[];
            if (this.key==1){
              this.pagination.total = res.count ? res.count : 0
              this.pagination.pageSize = res.total_limit ? res.total_limit : 0
              this.data = res.list
            }else{
              this.pagination1.total = res.count ? res.count : 0
              this.pagination1.pageSize = res.total_limit ? res.total_limit : 0
              this.data1 = res.list
            }
            if(res.standard_bind_import_btn!=undefined){
                this.standard_bind_import_btn=res.standard_bind_import_btn;
             }
          })
      },
      getGarageList(){
        this.request(villageApi.garageList)
          .then((res) => {
            console.log('garage_list',res)
            this.garage_list = res
          })
          .catch((error) => {
            this.loading = false
          })

      },
      
      clearList(){
          this.search = {page: 1, vacancy: ''}
          this.search1 = {page: 1, position_num: '', garage_id: 0} 
          this.getBindList()
      },
      // 楼栋号
      getSingleListByVillage() {
        this.request(villageApi.getSingleListByVillage).then(res => {
          console.log('+++++++Single', res)
          if (res) {
            let array = []
            res.map(pro => {
              array.push({
                label: pro.name,
                value: pro.id,
                isLeaf: false
              });
            });
            this.options = array
          }
        });
      },
      // 单元楼
      getFloorList(id) {
        return new Promise(resolve => {
          this.request(villageApi.getFloorList, {
            pid: id
          }).then(res => {
            console.log('+++++++Single', res)
            console.log("resolve", resolve)
            resolve(res);
          });
        });
      },
      // 楼层
      getLayerList(id) {
        return new Promise(resolve => {
          this.request(villageApi.getLayerList, {
            pid: id
          }).then(res => {
            console.log('+++++++Single', res)
            if (res) {
              resolve(res);
            }
          });
        })
      },
      // 房间
      getVacancyList(id) {
        return new Promise(resolve => {
          this.request(villageApi.getVacancyList, {
            pid: id
          }).then(res => {
            console.log('+++++++Single', res)
            if (res) {
              resolve(res);
            }
          });
        })
      },
      async loadDataFunc(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        setTimeout(function() {
          targetOption.loading = false;
        }, 100)
      },
      // 处理加载漏洞单元（选择、编辑时可用）
      async setVisionsFunc(selectedOptions) {
        if (selectedOptions.length === 1) {
          const options_temp = [...this.options];
          const res = await this.getFloorList(selectedOptions[0]);
          console.log("res", res)
          const children = [];
          res.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: false
            });
            options_temp['children'] = children
            return true;
          });
          options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
          this.options = options_temp
        } else if (selectedOptions.length === 2) {
          const apps = await this.getLayerList(selectedOptions[1]);
          const options_temp = [...this.options];
          // const apps = await getDirectoryApp(selectedOptions[1]);
          const children = [];
          apps.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: false
            });
            return true;
          });
          const product = options_temp.find(_ => _.value === selectedOptions[0]);
          product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
          this.options = options_temp
        } else if (selectedOptions.length === 3) {
          const apps = await this.getVacancyList(selectedOptions[2]);
          const options_temp = [...this.options];
          // const apps = await getDirectoryApp(selectedOptions[1]);
          const children = [];
          apps.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: true
            });
            return true;
          });
          const product = options_temp.find(_ => _.value === selectedOptions[0]);
          const product_1 = product.children.find(_ => _.value === selectedOptions[1])
          product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
          this.options = options_temp
          console.log("_this.options", this.options)
        }
      },
      bindOk(val,key) {
        this.key=key
        this.active=key
        this.rule_id=val
        this.getBindList();
        this.selectedRowKeys=[];
        this.selectedRowKeys1=[];
        this.vacancy_id =[];
        this.position_id=[];
      },
      closeImportVacancyBind() {
          this.importVacancyBindVisibile = false;
          this.bindOk(this.rule_id,this.key);
      },
      importVacancyBind(xtype) {
          if(xtype==1){
              this.uploadxType='standardPositionBind'; 
          }else{
              this.uploadxType='standardVacancyBind'; 
          }
          this.importVacancyBindVisibile = true;
      },
      bind(id,type){
        console.log('type',type)
        console.log('id',id)
        this.request(villageApi.delStandardBind,{'bind_id':id})
          .then((res) => {
            console.log('res',res)
            this.key=type
            this.getBindList();
              this.selectedRowKeys=[];
              this.selectedRowKeys1=[];
              this.vacancy_id =[];
              this.position_id=[];
          })
      },
      unbindAll(type){
        if (type==1){
          if (this.selectedRowKeys.length==0){
            this.$message.error('请勾选需解绑的'+store.getters.config.room_name);
          }else{
            this.selectedRowKeys.filter((v,i)=>{
              this.request(villageApi.delStandardBind,{'bind_id':v})
                .then((res) => {
                  console.log('res',res)
                  this.key=type
                  this.getBindList();
                    delete this.selectedRowKeys[i]
                })
            })
          }
        }else{
          if (this.selectedRowKeys1.length==0){
            this.$message.error('请勾选需解绑的车位');
          }else{
            this.selectedRowKeys1.filter((v,i)=>{
              this.request(villageApi.delStandardBind,{'bind_id':v})
                .then((res) => {
                  console.log('res',res)
                  this.key=type
                  this.getBindList();
                    delete this.selectedRowKeys1[i]
                })
            })
          }
        }
      },
      handleCancel(){
        this.selectedRowKeys=[];
        this.selectedRowKeys1=[];
        this.vacancy_id =[];
        this.position_id=[];
        this.visible = false;
        this.no_paking_bind=false;
        setTimeout(() => {
          this.rule_id = '0';
          this.form = this.$form.createForm(this)
        }, 500)
      },
      cancel(){},
      callback(key) {
        this.key=key
        if(this.key*1 == 2){
           this.uploadxType='standardPositionBind'; 
        }else{
             this.uploadxType='standardVacancyBind'; 
        }
        this.getBindList()
      },

      onSelectChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.vacancy_id = selectedRows;
        this.selectedRowKeys=selectedRowKeys;

        console.log('villagess',this.vacancy_id)
      },
      onSelectChange1(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.position_id = selectedRows;
        this.selectedRowKeys1=selectedRowKeys;
        console.log('villagess',this.position_id)
      },
      // 进行搜索
      searchList() {
        console.log('search', this.search);
        this.page=1;
        this.page1=1;
        this.getBindList()
      },

        onTableChange(page,pageSize){
            this.page =page
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getBindList()
            console.log('onTableChange==>', page, pageSize)
        },
        onTableChange1(page,pageSize){
            this.page1 =page
            this.pagination1.current = page
            this.pagination1.pageSize = pageSize
            this.getBindList()
            console.log('onTableChange==>', page, pageSize)
        },
      // 表格中变动  这里只针对页面页数切换
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current>0) {
          this.page = e.current;
          this.data = []
          this.getBindList()
        }
      },
      // 表格中变动  这里只针对页面页数切换
      table_change1(e) {
        console.log('e', e)
        if (e.current && e.current>0) {
          this.page1 = e.current;
          this.data1 = []
          this.getBindList()
        }
      },

    }
  };
</script>
<style>
.page_top{
    background-color: #e6f7ff;
    display: inline-block;
    width: 100%;
    padding: 20px 20px;
    margin-bottom: 20px;
    color: #666666;
}
</style>
