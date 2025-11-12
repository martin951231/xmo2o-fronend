<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="table-operator">
          <div class="search-box" style="margin-bottom: 20px;">
            <a-row >
                <a-col :md="7" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
                  <a-input-group compact style="display: flex;">
                    <p style="margin-top: 5px; width: 120px;">科目名称：</p>
                    <a-input style="width: 65%" placeholder="请输入科目名称" v-model="search.charge_number_name"/>
                  </a-input-group>
                </a-col>
              <a-col :md="5" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 280px;">
                <label style="margin-top: 5px;">收费类别：</label>
                <a-select v-model="search.charge_type" style="width: 200px">
                 <a-select-option  key="" value="">全部</a-select-option>
                  <a-select-option v-for="item in chargeTypeArr" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="5" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 280px;">
                <label style="margin-top: 5px;">状态：</label>
                <a-select v-model="search.charge_status" style="width: 200px">
                  <a-select-option  key="0" value="0">全部</a-select-option>
                  <a-select-option  key="1" value="1">开启</a-select-option>
                  <a-select-option  key="2" value="2">关闭</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="2" :sm="16">
                <a-button type="primary" icon="search" @click="searchList()">
                  查询
                </a-button>
              </a-col>
              <a-col :md="2" :sm="24">
                <a-button @click="resetList()">重置</a-button>
              </a-col>
            </a-row>
          
          </div>
        <a-button type="primary" icon="plus" @click="$refs.createModalsss.add()">添加</a-button>
<!--        <a-button v-if="abchina" type="primary" @click="$refs.createModal.add()" style="margin-left:10px;">收费类别配置</a-button>-->
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
         <span slot="status" slot-scope="text,record">
          <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
          {{ text }}
          </div>
      </span>
        <span slot="action" slot-scope="text, record">
         <a @click="$refs.createModalsss.edit(record.id)">编辑</a>
         <a v-if="jz_wsxdsj_net_customized_open" @click="showLog(record.id)" style="margin-left: 15px;">变更记录</a>
         <a  @click="$refs.chargeRelateRule.xlist(record)" style="margin-left: 15px;">关联收费标准</a>
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>

    </a-card>
    <edit-number :height='800' :width="1500" ref="createModalsss" @ok="handleOks"/>
    
    <charge-relate-rule  ref="chargeRelateRule" @ok="handleOks"/>

      <a-drawer
          title="变更记录"
          width="950"
          :closable="false"
          :visible="logVisible"
          @close="LogClose"
      >
          <a-table :columns="log_columns" :data-source="log_list"
                   :pagination="log_pagination"
                   @change="logTableChange" >
              <span slot="str" slot-scope="text, record">
                  <span v-if="text">{{ text }}</span>
                  <span v-else>--</span>
              </span>
          </a-table>
      </a-drawer>
<!--    <edit-code :height='800' :width="1500" ref="createModal" @ok="handleOks"/>-->
  </div>
</template>
<script>
  import newChargeApi from '@/api/community/property/packages';
  import editNumber from './editChargeNumber.vue'
  import chargeRelateRule from './chargeRelateRule.vue'
  // import editCode from './editEpayCode.vue'
  const statusMap = {
    1: {
      status: 'success',
      text: '开启'
    },
    2: {
      status: 'default',
      text: '禁止'
    }
  }

  const columns = [
    {
      title: '科目名称',
      dataIndex: 'charge_number_name',
      key: 'charge_number_name',
    },
    {
      title: '收费类别',

      dataIndex: 'charge_type_name',
      key: 'charge_type_name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      scopedSlots: {
        customRender: 'status'
      }

    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      width:400,
      dataIndex: '',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];

  const log_columns = [
      {
          title: '科目名称',
          dataIndex: 'old_charge_number_name',
          key: 'old_charge_number_name',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '收费类别',
          dataIndex: 'old_charge_type',
          key: 'old_charge_type',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '收费账号',
          dataIndex: 'old_rule_id',
          key: 'old_rule_id',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '时间',
          dataIndex: 'add_time',
          key: 'add_time',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '变更人员',
          dataIndex: 'operator_name',
          key: 'operator_name',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '变更后科目名称',
          dataIndex: 'charge_number_name',
          key: 'charge_number_name',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '变更后收费类别',
          dataIndex: 'charge_type',
          key: 'charge_type_name',
          scopedSlots: {
              customRender: 'str'
          }
      },
      {
          title: '变更后收费账号',
          dataIndex: 'rule_id',
          key: 'rule_id',
          scopedSlots: {
              customRender: 'str'
          }
      }
  ];
  export default {
    name: 'chargeNumberList11',
    components: {
      editNumber, 
      chargeRelateRule,
    },
    data() {
      return {
        list:[],
        pagination: { pageSize: 10, total:10 },
        log_pagination: { pageSize: 10, total:10 },
        search: {charge_number_name:'',charge_type:'',charge_status:'0', page: 1 },
        page: 1,
        log_page: 1,
        search_data:[],
        id:0,
        columns,
        log_columns,
        jz_wsxdsj_net_customized_open :0,
        logVisible :false,
        log_list:[],
        abchina:0,
        chargeTypeArr:[],
      };
    },
    mounted(){
      this.getConstructionStatus()
      this.getChargeNumberType();
      this.getChargeNumberList()
    },
    methods: {
      getChargeNumberList() {
          this.search.page=this.page;
          this.request(newChargeApi.chargeNumberList,this.search)
            .then((res) => {
              console.log('res', res);
              this.list = res.list;
              this.pagination.total = res.count ? res.count : 0
              this.pagination.pageSize = res.total_limit ? res.total_limit : 10
              this.abchina = res.abchina
            })
      },
      getChargeNumberType(){
        this.request(newChargeApi.getChargeType)
          .then((res) => {
            this.chargeTypeArr = res
           
          })
      },
      searchList(){
          this.getChargeNumberList()
      },
      resetList(){
          this.search={charge_number_name:'',charge_type:'',charge_status:'0', page: 1 };
          this.getChargeNumberList()
      },
      tableChange(e) {
        if (e.current && e.current>0) {
          this.page = e.current;
          this.getChargeNumberList()
        }
      },
      logTableChange(e) {
        if (e.current && e.current>0) {
          this.log_page = e.current;
          this.showLog(this.id)
        }
      },
      cancel() {

      },
      handleOks() {
        this.getChargeNumberList();
      },

        getConstructionStatus(){
            this.request(newChargeApi.getConstructionStatus)
                .then((res) => {
                    this.jz_wsxdsj_net_customized_open = res.jz_wsxdsj_net_customized_open
                })
        },
        showLog(id)
        {
            this.id = id;
            this.request(newChargeApi.getChargeNumberLogInfo,{'id':this.id,'page':this.log_page})
                .then((res) => {
                    this.log_list = res.data;
                    this.log_pagination.total = res.total ? res.total : 0
                    this.log_pagination.pageSize = res.per_page ? res.per_page : 10
                })
            this.logVisible = true;
        },
        LogClose()
        {
            this.id = 0;
            this.log_list = [];
            this.logVisible = false;
        }
    },
  };
</script>
<style scoped>
  .txt-green {
    color: #0fb70f;
  }

  .txt-red {
    color: red;
  }

  .table-operator{
    margin-bottom: 10px;
  }

</style>