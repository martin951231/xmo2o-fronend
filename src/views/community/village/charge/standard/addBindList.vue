<template>
  <a-drawer
    :title="title"
    :width="1000"
    :visible="visible"
    v-if="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    @close="handleCancel">
    <div style="background-color: white; padding-bottom: 50px;">
      <span class="page_top" v-if="charge_type == 'park_new'">
        1、通过在房产的{{$store.getters.config.room_name}}筛选{{$store.getters.config.single_name}}、{{$store.getters.config.floor_name}}、楼层、{{$store.getters.config.room_name}}信息进行绑定收费标准；<br/>
        2、通过在车场的所属车库、车位号筛选功能，筛选车辆绑定收费标准；<br/>
        <span style="color: red">
          注意：全选框只能选中当前页的所有{{$store.getters.config.room_name}}号/车位号，如需选中全部{{$store.getters.config.room_name}}号/车位号，需要每页都选中全选框绑定
        </span>
      </span>
      
      <span class="page_top" v-else>
        1、通过在房产的{{$store.getters.config.room_name}}筛选{{$store.getters.config.single_name}}、{{$store.getters.config.floor_name}}、楼层、{{$store.getters.config.room_name}}信息进行绑定收费标准；<br/>
        2、通过在车场的所属车库、车位号筛选功能，筛选车辆绑定收费标准；<br/>
        <span style="color: red">
          注意：全选框只能选中当前页的所有{{$store.getters.config.room_name}}号/车位号，如需选中全部{{$store.getters.config.room_name}}号/车位号，需要每页都选中全选框绑定
        </span>
      </span>
      <a-tabs :activeKey="active" @change="callback">
        <a-tab-pane key="1" tab="房产" v-if="charge_type != 'park_new'">
          <div class="order-list-box">
            <div class="search-box">
              <a-row :gutter="48" style="margin-left: 1px;margin-bottom: 10px;">
                <a-col :md="12" :sm="24" style="padding-right:0px;width: 30% ">
                  <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
                  <a-cascader
                    class="cascader_style margin_left_10"
                    :options="options"
                    :load-data="loadDataFunc"
                    :placeholder="'请选择'+$store.getters.config.room_name"
                    change-on-select
                    @change="setVisionsFunc"
                    v-model="search.vacancy" />
                </a-col>
                <a-col :md="6" :sm="24" style="padding-right:0px;">
                    <label style="margin-top: 5px;">有无住户：</label>
                    <a-select default-value="0" style="width: 117px" placeholder="请选择" v-model="search.is_user_bind">
                    <a-select-option value="0">
                      全部
                    </a-select-option>
                    <a-select-option value="1">
                      有
                    </a-select-option>
                    <a-select-option value="2">
                      无
                    </a-select-option>
                    </a-select>
                  </a-col>
                <a-col :md="2" :sm="24" style="padding-left:0px;">
                  <a-button type="primary" icon="search" @click="searchList()">
                    查询
                  </a-button>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="columns"
              :data-source="data"
              :row-selection="rowSelection"
              rowKey="pigcms_id"
              class="components-table-demo-nested"
              :pagination="pagination"
              @change="table_change">
              <span slot="action" slot-scope="text, record">
                <a @click="bind(record)" style="color: red" v-if="record.show">选择</a>
                <a @click="closeBind(record)" style="color: green" v-else>取消选择</a>
              </span>
            </a-table>
          </div>
          <span class="table-operator">
            <a-button type="primary" @click="bindAll()" >批量绑定</a-button>
          </span>
        </a-tab-pane>
        <a-tab-pane key="2" tab="车场" force-render v-if="have_paking_bind">
          <div class="order-list-box">
            <div class="search-box" style="margin-bottom: 10px">
              <a-row :gutter="48" style="margin-left: 1px;">
                <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 200px;">
                  <label style="margin-top: 5px;">所属车库：</label>
                  <a-select default-value="0" style="width: 117px" placeholder="请选择车库" v-model="search1.garage_id">
                    <a-select-option value="0">
                      全部
                    </a-select-option>
                    <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                      {{ item.garage_num }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24" style="width: 250px;padding-right: 1px">
                  <a-input-group compact>
                    <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 150px" placeholder="请输入车位号" v-model="search1.position_num"/>
                  </a-input-group>
                </a-col>
                <a-col :md="2" :sm="24">
                  <a-button type="primary" icon="search" @click="searchList()">
                    查询
                  </a-button>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="columns1"
              :data-source="data1"
              :row-selection="rowSelection1"
              rowKey="position_id"
              class="components-table-demo-nested"
              :pagination="pagination1"
              @change="table_change1">
              <span slot="action" slot-scope="text, record">
                <a @click="bind1(record)" style="color: red" v-if="record.show">选择</a>
                <a @click="closeBind1(record)" style="color: green" v-else>取消选择</a>
              </span>
            </a-table>
          </div>
          <span class="table-operator">
            <a-button type="primary" @click="bindAll1()" >批量绑定</a-button>
          </span>
        </a-tab-pane>
      </a-tabs>
      <addBindInfo ref="AddBindModel" @ok="bindOk"/>
    </div>
    
    <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="marginRight: 8px" @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" @click="handleSubmit">
          提交
        </a-button>
      </div>
  </a-drawer>
</template>
<script>
  import villageApi from '@/api/community/village'
  import addBindInfo from './addBindInfo'
	import store from '@/store';
  const columns = [
    { title: '楼号', dataIndex: 'single_name', key: 'single_name' },
    { title: '单元名称', dataIndex: 'floor_name', key: 'floor_name' ,width:150},
    { title: '层号', dataIndex: 'layer_name', key: 'layer_name' ,width:120},
    { title: store.getters.config.room_name+'号', dataIndex: 'room', key: 'room' ,width:120},
    { title: '有无住户', dataIndex: 'user_bind_status', key: 'user_bind_status',width:120},
    {
      title: '操作', key: 'action', dataIndex: '',width:150, scopedSlots: { customRender: 'action' }
     }
  ]

  const columns1 = [
    { title: '车位号', dataIndex: 'position_num', key: 'position_num' },
    { title: '所属车库', dataIndex: 'garage_num', key: 'garage_num' },
    {
      title: '操作', key: 'action', dataIndex: '', scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'AddBingList',
    data () {
      return {
        title: '绑定',
        ruleInfo: '',
        key: 1,
        active: '1',
        is_show: 1,
        is_show1: 1,
        show: true,
        dataId: 1,
        data: [],
        data1: [],
        rule_id: 0,
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
        search: { page: 1 ,is_user_bind:'0'},
        search_data1: [],
        search1: { page: 1 },
        form: this.$form.createForm(this),
        visible: false,
        loading: false,
        columns,
        columns1,
        page: 1,
        page1: 1,
        position_id: [],
        positionId: [],
        pigcms_id: [],
        vacancy_id: [],
        village_list: [],
        single_list: [],
        floor_list: [],
        layer_list: [],
        vacancy_list: [],
        garage_list: [],
        options: [],
        selectedRowKeys: [],
        selectedRowKeys1: [],
        have_paking_bind:false,
      }
    },
    components: {
      addBindInfo
    },
    mounted () {
        this.key = 1
    },
    computed: {
      // 表格选择操作
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      rowSelection1 () {
        return {
          selectedRowKeys: this.selectedRowKeys1,
          onChange: this.onSelectChange1
        }
      }
    },
    methods: {
      // 获取列表信息
      add (rule_id, key, charge_type='') {
        console.log("key==============>", key)
        this.title = '绑定'
        this.loading = false
        this.visible = true
        this.rule_id = rule_id
        this.search.is_user_bind="0";
        this.page=1;
        this.page1=1;
        this.search['page'] = 1;
        this.search1['page'] = 1;
        this.have_paking_bind=false;
        this.key = key
        this.active = key
        console.log('key', this.key)
        this.data = []
        this.data1 = []
        this.charge_type = charge_type
        console.log("this.charge_type======>", this.charge_type)
        this.getAddBindList()
        this.getGarageList()
        this.getSingleListByVillage()
        this.position_id = []
        this.positionId = []
        this.pigcms_id = []
        this.vacancy_id = []
        this.selectedRowKeys = []
        this.selectedRowKeys1 = []
      },
      // 获取列表信息
      getAddBindList () {
        console.log('key111', this.key)
        if (this.key == 1) {
          this.search['page'] = this.page
          this.search['limit'] = this.pagination.pageSize
          this.search.bind_type = this.key
          this.search.rule_id = this.rule_id
          this.request(villageApi.abbBindList, this.search)
            .then((res) => {
              console.log('res1=============>', res)
                this.pagination.total = res.count ? res.count : 0
                this.pagination.pageSize = res.total_limit ? res.total_limit : 0
                this.data = res.list
              this.ruleInfo = res.ruleInfo
              if(this.ruleInfo.order_type == 'public_water' || this.ruleInfo.order_type == 'public_electric'){
                  this.have_paking_bind=false;
              }else{
                  this.have_paking_bind=true;
              }
              console.log('ruleInfo', res.ruleInfo)
              if (res.is_show == 2) {
                this.is_show = 2
              } else {
                this.is_show = 1
              }
            })
        } else {
          this.search1['page'] = this.page1
          this.search1['limit'] = this.pagination1.pageSize
          this.search1.bind_type = this.key
          this.search1.rule_id = this.rule_id
          this.have_paking_bind=true;
          this.request(villageApi.abbBindList, this.search1)
            .then((res) => {
              console.log('res2================>', res)
                this.pagination1.total = res.count ? res.count : 0
                this.pagination1.pageSize = res.total_limit ? res.total_limit : 0
                this.data1 = res.list
              this.ruleInfo = res.ruleInfo
              console.log('ruleInfo', res.ruleInfo)
              if (res.is_show == 2) {
                this.is_show1 = 2
              } else {
                this.is_show1 = 1
              }
            })
        }
      },
      getGarageList () {
        this.request(villageApi.garageList)
          .then((res) => {
            console.log('garage_list', res)
            this.garage_list = res
          })
          .catch((error) => {
            this.loading = false
          })
      },
      // 楼栋号
      getSingleListByVillage () {
        this.request(villageApi.getSingleListByVillage).then(res => {
          console.log('+++++++Single', res)
          if (res) {
            const array = []
            res.map(pro => {
              array.push({
                label: pro.name,
                value: pro.id,
                isLeaf: false
              })
            })
            this.options = array
          }
        })
      },
      // 单元楼
      getFloorList (id) {
        return new Promise(resolve => {
          this.request(villageApi.getFloorList, {
            pid: id
          }).then(res => {
            console.log('+++++++Single', res)
            console.log('resolve', resolve)
            resolve(res)
          })
        })
      },
      // 楼层
      getLayerList (id) {
        return new Promise(resolve => {
          this.request(villageApi.getLayerList, {
            pid: id
          }).then(res => {
            console.log('+++++++Single', res)
            if (res) {
              resolve(res)
            }
          })
        })
      },
      // 房间
      getVacancyList (id) {
        return new Promise(resolve => {
          this.request(villageApi.getVacancyList, {
            pid: id
          }).then(res => {
            console.log('+++++++Single', res)
            if (res) {
              resolve(res)
            }
          })
        })
      },
      async loadDataFunc (selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        setTimeout(function () {
          targetOption.loading = false
        }, 100)
      },
      // 处理加载漏洞单元（选择、编辑时可用）
      async setVisionsFunc (selectedOptions) {
        if (selectedOptions.length === 1) {
          const options_temp = [...this.options]
          const res = await this.getFloorList(selectedOptions[0])
          console.log('res', res)
          const children = []
          res.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: false
            })
            options_temp['children'] = children
            return true
          })
          options_temp.find(_ => _.value === selectedOptions[0])['children'] = children
          this.options = options_temp
        } else if (selectedOptions.length === 2) {
          const apps = await this.getLayerList(selectedOptions[1])
          const options_temp = [...this.options]
          // const apps = await getDirectoryApp(selectedOptions[1]);
          const children = []
          apps.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: false
            })
            return true
          })
          const product = options_temp.find(_ => _.value === selectedOptions[0])
          product.children.find(_ => _.value === selectedOptions[1])['children'] = children
          this.options = options_temp
        } else if (selectedOptions.length === 3) {
          const apps = await this.getVacancyList(selectedOptions[2])
          const options_temp = [...this.options]
          // const apps = await getDirectoryApp(selectedOptions[1]);
          const children = []
          apps.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: true
            })
            return true
          })
          const product = options_temp.find(_ => _.value === selectedOptions[0])
          const product_1 = product.children.find(_ => _.value === selectedOptions[1])
          product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children
          this.options = options_temp
          console.log('_this.options', this.options)
        }
      },
      bindOk () {
        this.form = this.$form.createForm(this)
        this.visible = false
        this.loading = false
        this.$emit('ok', this.rule_id, this.key)
      },
      handleSubmit () {
        const _this = this
        if(this.key == 1){
            if (this.is_show == 2) {
              this.$confirm({
                title: '是否确认绑定?',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                  _this.addBind()
                }
              })
            } else {
              this.$refs.AddBindModel.add(1, this.ruleInfo, this.pigcms_id, this.positionId)
            }
        } else {
            if (this.is_show1 == 2) {
              this.$confirm({
                title: '是否确认绑定?',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                  _this.addBind()
                }
              })
            } else {
              this.$refs.AddBindModel.add(1, this.ruleInfo, this.pigcms_id, this.positionId)
            }
        }
      },
      bind (item) {
        console.log('item1111', item)
        this.data.forEach((v, i) => {
          if (v.pigcms_id == item.pigcms_id) {
            console.log('list', this.data)
            console.log('i', i)
            v.show = false
            console.log('v', v)
            this.data[i] = v
            this.pigcms_id.push(item.pigcms_id)
            this.selectedRowKeys.push(item.pigcms_id)
            console.log('list11', this.data)
            console.log('vacancy_id', this.pigcms_id)
          }
        })
      },
      closeBind (item) {
        console.log('item1111', item)
        this.data.forEach((v, i) => {
          if (v.pigcms_id == item.pigcms_id) {
            console.log('list', this.data)
            console.log('i', i)
            v.show = true
            console.log('v', v)
            this.data[i] = v
            console.log('list11', this.data)
            console.log('vacancy_id', this.pigcms_id)
          }
        })
        this.pigcms_id.forEach((v1, i1) => {
          if (v1 == item.pigcms_id) {
            this.pigcms_id.splice(i1, 1)
          }
        })
        this.selectedRowKeys.forEach((v2, i2) => {
          if (v2 == item.pigcms_id) {
            this.selectedRowKeys.splice(i2, 1)
          }
        })
      },
      bindAll () {
        const pigcms = []
        this.selectedRowKeys.forEach((vv, ii) => {
          this.data.forEach((v, i) => {
            if (v.pigcms_id == vv) {
              console.log('list', this.data)
              console.log('i', i)
              v.show = false
              console.log('v', v)
              this.data[i] = v
              console.log('list11', this.data)
            }
          })
          pigcms.push(vv)
        })
        if (pigcms != '') {
          this.pigcms_id = pigcms
        }
        console.log('pigcms_id', this.pigcms_id)
      },
      bind1 (item) {
        console.log('item1111', item)
        this.data1.forEach((v, i) => {
          if (v.position_id == item.position_id) {
            console.log('list', this.data1)
            console.log('i', i)
            v.show = false
            console.log('v', v)
            this.data1[i] = v
            this.positionId.push(item.position_id)
            this.selectedRowKeys1.push(item.position_id)
            console.log('list11', this.data1)
            console.log('vacancy_id', this.positionId)
          }
        })
      },
      closeBind1 (item) {
        console.log('item1111', item)
        this.data1.forEach((v, i) => {
          if (v.position_id == item.position_id) {
            console.log('list', this.data1)
            console.log('i', i)
            v.show = true
            console.log('v', v)
            this.data1[i] = v
            console.log('list11', this.data1)
            console.log('vacancy_id', this.positionId)
          }
        })
        this.positionId.forEach((v1, i1) => {
          if (v1 == item.position_id) {
            this.positionId.splice(i1, 1)
          }
        })
        this.selectedRowKeys1.forEach((v2, i2) => {
          if (v2 == item.position_id) {
            this.selectedRowKeys1.splice(i2, 1)
          }
        })
      },
      bindAll1 () {
        const pigcms = []
        this.selectedRowKeys1.forEach((vv, ii) => {
          this.data1.forEach((v, i) => {
            if (v.position_id == vv) {
              console.log('list', this.data1)
              console.log('i', i)
              v.show = false
              console.log('v', v)
              this.data1[i] = v
              console.log('list11', this.data1)
            }
          })
          pigcms.push(vv)
        })
        if (pigcms != '') {
          this.positionId = pigcms
        }
        console.log('pigcms_id', this.positionId)
      },
      addBind () {
        if (this.pigcms_id == '' && this.positionId == '') {
          this.$message.error('请先选择需要绑定的'+store.getters.config.room_name+'或车场')
        } else {
          const bindData = {}
          bindData.rule_id = this.rule_id
          bindData.pigcms_id = this.pigcms_id
          bindData.position_id = this.positionId
          bindData.bind_type = 1
          this.request(villageApi.addStandardBind, bindData)
            .then((res) => {
              if(res.status==1000 && res.msg){
                  this.$message.error(res.msg)
                  this.confirmLoading=false;
              }else{
                console.log('res', res)
                if (res.err_count) {
                    let message = '绑定失败' + res.err_count +'个';
                    if (res.errMsgStr) {
                        message = message + "【错误："+res.errMsgStr+"】"
                    } else if (res.errMsgArr && res.errMsgArr[0] && res.errMsgArr[0]['msg']) {
                        message = message + "【错误："+res.errMsgArr[0]['msg']+"】"
                    } 
                    this.$message.warning(message)
                    if (res.success_count) {
                        this.$message.warning('绑定成功' + res.success_count +'个')
                        setTimeout(() => {
                          this.form = this.$form.createForm(this)
                          this.visible = false
                          this.loading = false
                          this.$emit('ok', this.rule_id, this.key)
                        }, 1500)
                    }else {
                        this.confirmLoading=false;
                    }
                } else {
                  this.$message.success('绑定成功')
                  setTimeout(() => {
                    this.form = this.$form.createForm(this)
                    this.visible = false
                    this.loading = false
                    this.$emit('ok', this.rule_id, this.key)
                  }, 1500)
                }
              }
            })
        }
      },
      handleCancel () {
        this.visible = false
        setTimeout(() => {
          this.rule_id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
      },
      callback (key) {
        this.search.is_user_bind="0";
        this.key = key
        this.active = key
        this.getAddBindList()
        console.log(key)
      },

      onSelectChange (selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.vacancy_id = selectedRows
        this.selectedRowKeys = selectedRowKeys
        console.log('villagess', this.vacancy_id)
      },
      onSelectChange1 (selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.position_id = selectedRows
        this.selectedRowKeys1 = selectedRowKeys
        console.log('villagess', this.position_id)
      },
      // 进行搜索
      searchList () {
        console.log('search', this.search)
        this.page = 1
        this.page1 = 1
        this.getAddBindList()
      },

      cancel () {},
        onTableChange(page,pageSize){
            this.page =page
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getAddBindList()
            console.log('onTableChange==>', page, pageSize)
        },
        onTableChange1(page,pageSize){
            this.page1 =page
            this.pagination1.current = page
            this.pagination1.pageSize = pageSize
            this.getAddBindList()
            console.log('onTableChange==>', page, pageSize)
        },
      // 表格中变动  这里只针对页面页数切换
      table_change (e) {
        console.log('e', e)
        if (e.current && e.current > 0) {
          this.page = e.current
          this.getAddBindList()
        }
      },
      // 表格中变动  这里只针对页面页数切换
      table_change1 (e) {
        console.log('e', e)
        if (e.current && e.current > 0) {
            console.log('current', e.current)
          this.page1 = e.current
          this.getAddBindList()
        }
      }

    }
  }
</script>
<style scoped>
.page_top{
    background-color: #e6f7ff;
    display: inline-block;
    width: 100%;
    padding: 20px 20px;
    margin-bottom: 20px;
    color: #666666;
}
</style>
