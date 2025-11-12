<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
      <a-card :bordered="false">
        <a-form layout="inline" class="form-content">
          <a-row  type="flex" justify="space-between">
            <a-col>
              <a-form-item >
                <a-select style="width: 130px" default-value="queryParam.search_type" v-model="queryParam.search_type"  @change="changeSearchType">
                  <a-select-option :value="item.value" :key="item.value" v-for="item in catArr">{{
                    item.name
                  }}</a-select-option>
                </a-select> 
                <a-input
                  style="width: 235px"
                  allow-clear
                  v-model="queryParam.keywords"
                  :placeholder="placeholder"
                />
              </a-form-item>
              <a-form-item label="产品类型">
                  <a-select style="width: 110px" default-value="queryParam.type" v-model="queryParam.type">
                  <a-select-option :value="item.value" :key="item.value" v-for="item in typeArr">
                    {{item.name}}
                  </a-select-option>
                </a-select> 
              </a-form-item>
              <a-form-item v-if="$store.getters.config" :label="'搜索'+$store.getters.config.house_name">                 
                <a-select
                  show-search
                  :placeholder="'选择'+$store.getters.config.house_name"
                  option-filter-prop="children"
                  style="width: 200px"
                  :filter-option="filterOption"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @change="handleVillageChange"
                  @popupScroll="handleVillageScroll"
                >
                  <a-select-option :value="item.village_id" :key="item.village_id" v-for="item in villageList">
                    {{item.village_name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row  type="flex" justify="space-between">
            <a-col>
              <a-form-item label="申请时间">
                 <a-range-picker
                  @change="onDateChange"
                  :allowClear="true"
                  v-model="search_date"
                >
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">搜索</a-button>
              </a-form-item>
            </a-col>
            <a-col >
              <a-form-item>
                <a-button type="primary" @click="$refs.ExportAddModal.exports()">导出</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
          <div class="message-suggestions-list-box">
            <a-tabs default-active-key="" @change="callback">
              <a-tab-pane :key="item.value" :tab="item.name+'（'+item.count+'）'" v-for="item in tabArr" />
            </a-tabs>
           
            <a-table
              :columns="columns"
              :data-source="data"
              rowKey="apply_id"
              class="components-table-demo-nested"
              :pagination="pagination"
              @change="tableChange"
              style="min-height: 700px"
            >  
            
              <span slot="banking_title" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="user-address text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="addressTitle">
                地址
                <a-tooltip trigger="hover">
                  <template slot="title">鼠标移至地址栏可查看完整地址信息</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>
              <span slot="moneyTitle">
                金额
                <a-tooltip trigger="hover">
                  <template slot="title">包含存款金额、申请额度</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>
              <span slot="company_name" slot-scope="text">
                {{text ? text : '--'}}
              </span>
              <span slot="industry" slot-scope="text">
                {{text ? text : '--'}}
              </span>
              <span slot="status_txt" slot-scope="text, record">
                <label :class="record.status == 3 ? 'red' : ''">{{text}}</label>
              </span>
              <span slot="address" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="user-address text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="action" slot-scope="text, record">
                 <a-select style="width: 110px" :default-value="record.status" @change="changeStatus($event,record.apply_id)" v-if="record.status != 4">
                  <a-select-option :value="key" :key="key" v-for="(item,key) in record.status_arr">{{
                    item
                  }}</a-select-option>
                </a-select> 
                <span v-if="record.status == 4">--</span>
              </span>
            </a-table>
          </div>
        </a-card>
      <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="queryParam" />
  </div>
</template>

<script>
import bankingPlatformApi from "@/api/banking/platform/index";
import moment from 'moment'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import store from '@/store';
const data = []
const tabArr = [
        {
          value: '-1',
          name:'全部',
          count:0
        },
        {
          value: '0',
          name:'待受理',
          count:0
        },
        {
          value: '1',
          name:'已受理',
          count:0
        },
        {
          value: '2',
          name:'申请成功',
          count:0
        },
        {
          value: '3',
          name:'已拒绝',
          count:0
        },
        {
          value: '4',
          name:'已撤销',
          count:0
        },
      ];
const typeArr = [
        {
          value: '',
          name:'全部'
        },
        {
          value: 'personal_loans',
          name:'个人贷款'
        },
        {
          value: 'company_loans',
          name:'企业贷款'
        },
        {
          value: 'credit_card',
          name:'信用卡'
        },
        {
          value: 'ecard',
          name:'E支付'
        },
        {
          value: 'deposit',
          name:'存款'
        },
        {
          value: 'public_deposit',
          name:'对公账户预约'
        },
      ];
export default {
  name: 'BankingList',
  components: { ExportAdd },
  data() {
    return {
      typeArr,
      tabValue:'',
      tabArr,
      search_date:[],
      exportUrl: bankingPlatformApi.exportUrl,
      placeholder:'不限',
      catArr: [
        {
          value: '',
          name:'全部'
        },
        {
          value: 'name',
          name:'申请人姓名'
        },
        {
          value: 'phone',
          name:'申请人手机号'
        },
        {
          value: 'title',
          name:'产品名称'
        }
      ],
      // 查询参数
      queryParam: {
        search_type: '',
        type: '',
        start_time: '',
        end_time: '',
        status:-1
      },
      pagination: {
        pageSize: 10,
        total: 0,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      villageList:[],
      villagePage:1,
      villageLoad:true,
      page: 1,
      columns: [
        {
          title: '产品名称',
          dataIndex: 'title',
          scopedSlots: {
            customRender: 'banking_title',
          },
        },
        {
          title: '产品类型',
          dataIndex: 'type_txt',
        },
        {
          title: '申请人名称',
          dataIndex: 'name',
        },
        {
          title: '申请人手机号',
          dataIndex: 'phone',
        },
        {
          title: '企业名称',
          dataIndex: 'company_name',
          scopedSlots: {
            customRender: 'company_name',
          },
        },
        {
          dataIndex: 'address',
          slots: { title: 'addressTitle' },
          scopedSlots: {
            customRender: 'address',
          },
        },
        {
          title: '申请人'+store.getters.config.house_name,
          dataIndex: 'village_name',
        },
        {
          dataIndex: 'money',
          slots: { title: 'moneyTitle' },
        },
        {
          title: '行业',
          dataIndex: 'industry',
          scopedSlots: {
            customRender: 'industry',
          },
        },
        {
          title: '状态',
          dataIndex: 'status_txt',
          scopedSlots: {
            customRender: 'status_txt',
          },
        },
        {
          title: '申请时间',
          dataIndex: 'add_time_txt',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    moment,
    // 获取列表信息
    getList() {
      this.queryParam['page'] = this.page
      this.request(bankingPlatformApi.getApplyList, this.queryParam).then((res) => {
        this.data = res.data
        this.pagination.total = res.total

        if(res.tab_arr && res.tab_arr.length){
          this.tabArr = JSON.parse(JSON.stringify(res.tab_arr))

        }

        console.log(this.data,'this.data')
      })
    },
    // 查询
    searchBtn() {
      this.page = 1
      this.getList()
    },
    onDateChange(date, dateString){
      this.queryParam.start_time = dateString[0]
      this.queryParam.end_time = dateString[1]
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      // 分页
      this.queryParam['pageSize'] = e.pageSize
      this.queryParam['page'] = e.current

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getList()
    },
    // 切换贷款类型
    changeSearchType(value){
      console.log(value,'changeLoansType')
      if(value == ''){
        this.placeholder = '不限'
      }else{
        let name = this.catArr.find((item, index,array) => item.value == value).name
        this.placeholder = '请输入'+name
      }
    },
    // 获取小区列表
    getVillageList(){
      if(this.villageLoad){
        this.request(bankingPlatformApi.getVillageList, {page:this.villagePage}).then((res) => {
            if(this.villagePage == 1){
              this.villageList = [{village_id:0,village_name:'全部'}].concat(res)
            }else{
              this.villageList = this.villageList.concat(res)
            }
            if(res.length == 0){
              this.villageLoad = false
            }
        })
      }
    },
    handleFocus(e){
      console.log('handleFocus',e)
      this.villagePage = 1
      this.villageLoad = true
      this.getVillageList()
    },
    handleBlur(e){
      console.log('handleBlur',e)
      this.villagePage = 1
      this.villageLoad = true
      this.getVillageList()
    },
    handleVillageChange(e){
      this.queryParam.village_id = e
      this.getList()
      console.log('handleVillageChange',e)
    },
    handleVillageScroll(e){
      const {scrollHeight, scrollTop, clientHeight} = e.target
      if(scrollHeight - scrollTop === clientHeight){
        this.villagePage ++
        this.getVillageList()
      }

    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    callback(value) {
      this.tabValue = value
      this.queryParam.status = value
      this.page = 1
      this.getList()
    },
    // 修改状态
    changeStatus(status, id) {
        this.request(bankingPlatformApi.changeStatus, { id ,status}).then((data) => {
            this.$message.success('修改成功')
            this.getList()
        })
    },
  },
}
</script>
<style lang="less" scoped>
.red {
  color: red;
}
.user-address {
  max-width: 100px;
  display: inline-block;
  cursor: pointer;
}
.message-suggestions-list-box{
  padding-top: 30px;
}
</style>
