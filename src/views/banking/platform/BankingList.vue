<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
      <a-tabs default-active-key="loans" @change="callback" v-model="type">
        <a-tab-pane key="loans" tab="贷款">
        </a-tab-pane>
        <a-tab-pane key="credit_card" tab="信用卡" force-render>
        </a-tab-pane>
        <a-tab-pane key="ecard" tab="E支付" force-render>
        </a-tab-pane>
        <a-tab-pane key="deposit" tab="存款" force-render>
        </a-tab-pane>
      </a-tabs>
        <a-card :bordered="false">
          <a-form layout="inline" class="form-content">
            <a-row  type="flex" justify="space-between">
              <a-col>
                <a-form-item >
                  <a-select style="width: 110px" default-value="queryParam.search_type" v-model="queryParam.search_type"  @change="changeSearchType" v-if="type == 'loans'">
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
                <a-form-item label="贷款类型" v-if="type == 'loans'">
                   <a-select style="width: 110px" default-value="queryParam.loans_type" v-model="queryParam.loans_type">
                    <a-select-option :value="item.value" :key="item.value" v-for="item in loansTypeArr">
                      {{item.name}}
                    </a-select-option>
                  </a-select> 
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">搜索</a-button>
                </a-form-item>
              </a-col>
              <a-col >
                <a-form-item>
                  <a-button type="danger" @click="delBanking()" style="margin-right: 15px">删除</a-button>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="edit()">新建{{typeArr[type]}}</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div class="message-suggestions-list-box">
           
            <a-table
              :columns="columns"
              :data-source="data"
              rowKey="banking_id"
              class="components-table-demo-nested"
              :pagination="pagination"
              @change="tableChange"
              style="min-height: 700px"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
              <span slot="banking_title" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="banking_title text-els">{{text}}</label>
                </a-tooltip>
              </span>       
              <span slot="loans_method" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="banking_title text-els">{{text}}</label>
                </a-tooltip>
              </span>   
              <span slot="loans_repayment_method" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="banking_title text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="label" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="banking_title text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="introduce" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="banking_title text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="edit_log" slot-scope="text, record">
                  <a-button  @click="$refs.BankingEditLogModal.show(record.banking_id)" type="link">查看详情</a-button>
              </span>
              <span slot="loans_type_txt" slot-scope="text, record">
                 <a-badge :status="record.loans_type == 1 ? 'success' : 'processing'" />{{text}}
              </span>
              <span slot="deposit_term" slot-scope="text, record">
                {{text}}{{record.deposit_term_type_txt}}
              </span>
              <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="delBanking(record.banking_id )">删除</a-button>|
                  <a-button type="link" @click="edit(record.banking_id)">编辑</a-button>
              </span>
            </a-table>
          </div>
        </a-card>
        <banking-edit-log ref="BankingEditLogModal" />
  </div>
</template>

<script>
// import moment from 'moment'
import bankingPlatformApi from "@/api/banking/platform/index";
import BankingEditLog from "./modules/BankingEditLog";
import moment from 'moment'
const data = []
const type = 'loans'
const typeArr = {
            'loans' : '贷款',
            'credit_card' : '信用卡',
            'ecard' : 'E支付',
            'deposit' : '存款',
        };
export default {
  name: 'BankingList',
  components: { BankingEditLog },
  data() {
    return {
      typeArr,
      type,
      selectedRowKeys:[],
      editUrl:'/banking/platform.banking/BankingLoansEdit',
      catArr: [
        {
          value: 'title',
          name:'贷款名称'
        },
        {
          value: 'release_people',
          name:'发布人'
        }
      ],
      loansTypeArr: [
        {
          value: '0',
          name:'全部'
        },
        {
          value: '1',
          name:'个人贷'
        },
        {
          value: '2',
          name:'企业贷'
        }
      ],
      placeholder: '请输入贷款名称',
      // 查询参数
      queryParam: {
        search_type: 'title',
        type: 'loans',
        loans_type: '0',
        start_time: '',
        end_time: '',
      },
      pagination: {
        pageSize: 10,
        total: 0,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      page: 1,
      columns:[],
      // 表头
      loansColumns: [
        {
          title: '贷款名称',
          dataIndex: 'title',
          scopedSlots: {
            customRender: 'banking_title',
          },
        },
        {
          title: '最高额度',
          dataIndex: 'loans_highest_amount',
          sorter: (a, b) => a.loans_highest_amount - b.loans_highest_amount,
        },
        {
          title: '贷款类型',
          dataIndex: 'loans_type_txt',
          scopedSlots: {
            customRender: 'loans_type_txt',
          },
        },
        {
          title: '标签',
          dataIndex: 'label',
          scopedSlots: {
            customRender: 'label',
          },
        },
        {
          title: '贷款方式',
          dataIndex: 'loans_method',
          scopedSlots: {
            customRender: 'loans_method',
          },
        },
        {
          title: '还款方式',
          dataIndex: 'loans_repayment_method',
          scopedSlots: {
            customRender: 'loans_repayment_method',
          },
        },
        {
          title: '阅读人数',
          dataIndex: 'view_count',
        },
        {
          title: '发布人',
          dataIndex: 'release_people',
        },
        {
          title: '发布时间',
          dataIndex: 'add_time_txt',
        },
        {
          title: '修改记录',
          dataIndex: 'edit_log',
          scopedSlots: {
            customRender: 'edit_log',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      // 信用卡表头
      credit_cardColumns: [
        {
          title: '信用卡名称',
          dataIndex: 'title',
          scopedSlots: {
            customRender: 'banking_title',
          },
        },
        {
          title: '信用卡简介',
          dataIndex: 'introduce',
          scopedSlots: {
            customRender: 'introduce',
          },
        },
        {
          title: '阅读人数',
          dataIndex: 'view_count',
        },
        {
          title: '发布人',
          dataIndex: 'release_people',
        },
        {
          title: '发布时间',
          dataIndex: 'add_time_txt',
        },
        {
          title: '修改记录',
          dataIndex: 'edit_log',
          scopedSlots: {
            customRender: 'edit_log',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      // 存款表头
      depositColumns: [
        {
          title: '存款名称',
          dataIndex: 'title',
        },
        {
          title: '起始金额',
          dataIndex: 'deposit_start_money',
          sorter: (a, b) => a.deposit_start_money - b.deposit_start_money,
        },
        {
          title: '年利率',
          dataIndex: 'deposit_interest_rate',
        },
        {
          title: '存期',
          dataIndex: 'deposit_term',
          scopedSlots: {
            customRender: 'deposit_term',
          },
        },
        {
          title: '阅读人数',
          dataIndex: 'view_count',
        },
        {
          title: '发布人',
          dataIndex: 'release_people',
        },
        {
          title: '发布时间',
          dataIndex: 'add_time_txt',
        },
        {
          title: '修改记录',
          dataIndex: 'edit_log',
          scopedSlots: {
            customRender: 'edit_log',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      // e支付表头
      ecardColumns: [
        {
          title: 'E支付名称',
          dataIndex: 'title',
          scopedSlots: {
            customRender: 'banking_title',
          },
        },
        {
          title: '阅读人数',
          dataIndex: 'view_count',
        },
        {
          title: '发布人',
          dataIndex: 'release_people',
        },
        {
          title: '发布时间',
          dataIndex: 'add_time_txt',
        },
        {
          title: '修改记录',
          dataIndex: 'edit_log',
          scopedSlots: {
            customRender: 'edit_log',
          },
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
  created() {
  },
  activated() {
      let typeTab = localStorage.getItem('bankingTypeTab')
      if(typeTab){
        this.type = typeTab
        this.callback(this.type)
        localStorage.removeItem('bankingTypeTab')
      }
  },
  mounted() {
      let typeTab = localStorage.getItem('bankingTypeTab')
      if(typeTab){
        this.type = typeTab
        this.callback(this.type)
        localStorage.removeItem('bankingTypeTab')
      }else{
        this.columns = this.loansColumns
        this.getList()
      }
  },
  methods: {
    moment,
    setTabValue() {
      localStorage.setItem('bankingTypeTab',  this.type)
    },
    // 获取列表信息
    getList() {
      this.queryParam['page'] = this.page
      this.request(bankingPlatformApi.getBankingList, this.queryParam).then((res) => {
        this.data = res.data
        this.pagination.total = res.total
      })
    },
    // 查询
    searchBtn() {
      this.page = 1
      this.getList()
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      if(sorter.order){// 排序
        this.queryParam['sort_name'] = sorter.field
        this.queryParam['sort_type'] = sorter.order == 'descend' ? 'desc' : 'asc'
      }else{ 
        this.queryParam['sort_name'] = ''
        this.queryParam['sort_type'] = ''
      }
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
      if(value == 'title'){
        this.placeholder = '请输入'+typeArr['loans']+'名称'
      }else{
        this.placeholder = '请输入发布人名称'
      }
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    callback(value) {
      this.type = value
      this.setTabValue()
      console.log(value, 'callback')
      this.placeholder = '请输入'+typeArr[value]+'名称'
      this.queryParam.loans_type = '0'
      switch(value){
          case 'loans' : // 贷款
            this.editUrl = '/banking/platform.banking/BankingLoansEdit'
            break;
          case 'credit_card' : // 信用卡
            this.editUrl = '/banking/platform.banking/BankingCreditCardEdit'
            break;
          case 'ecard' : // E支付
            this.editUrl = '/banking/platform.banking/BankingEcardEdit'
            break;
          case 'deposit' : // 付款
            this.editUrl = '/banking/platform.banking/BankingDepositEdit'
            break;
      }
      this.columns = this[value+'Columns']
      this.queryParam.type = value
      this.page = 1
      this.getList()
     
    },
    edit(id){
      this.setTabValue()
      if(id){
        this.$router.push({path: this.editUrl, query: { banking_id:id } })
      }else{
        this.$router.push({path: this.editUrl})
      }
    },
    // 删除产品
    delBanking(id) {
        let ids = []
        if (id) {
            ids.push(id)
        } else {
            if (this.selectedRowKeys.length) {
                ids = this.selectedRowKeys
            } else {
                this.$message.warning('请选择产品')
                return
            }
        }

        this.$confirm({
            title: '确认要删除产品吗?',
            centered: true,
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.request(bankingPlatformApi.delBanking, { id : ids }).then((data) => {
                    this.$message.success('删除成功')
                    this.getList()
                })
            },
            onCancel() {},
        })
    },
  },
}
</script>
<style lang="less" scoped>
.form-content {
  margin-bottom: 16px;
}
.button-content {
  padding: 30px 10px;
}
.banking_title {
  max-width: 100px;
  display: inline-block;
  cursor: pointer;
}
</style>
