<template>
    <a-drawer :title="title" :width="1300" :visible="visible" :maskClosable="false"
              @close="handleCancel" placement="right">
      <div>
          <div class="search-box">
              <a-row>
                  <a-col :span="18" style="padding-left: 5px; padding-right: 1px;width: 350px;">
                    <label style="margin-top: 5px;">请选择小区：</label>
                    <a-select default-value="全部小区" style="width: 250px" placeholder="请选择小区" v-model="search.village_id">
                      <a-select-option value="0">
                        全部小区
                      </a-select-option>
                      <a-select-option  v-for="(item,index) in villageList" :value="item.village_id" :key="item.village_id" >
                        {{item.village_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="18" style="padding-left: 5px; padding-right: 1px;width: 200px;">
                    <a-input
                      style="width: 250px"
                      placeholder='请输入收费标准名称'
                      autocomplete="off"
                      v-model="search.keyword"/>
                  </a-col>
                  <a-col :span="18" style="margin-left: 70px;padding-bottom: 15px;width: 100px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                      查询
                    </a-button>
                  </a-col>
                  </a-row>
            </div>
          <a-table :columns="columns" :data-source="datalist"
                   :pagination="pagination"
                   @change="tableChange" >
          </a-table>
     </div>
    </a-drawer>
    
</template>
<script>
   import newChargeApi from '@/api/community/property/packages';
    import moment from 'moment'
    const columns = [
            { title:'小区名称',  dataIndex: 'village_name', key: 'village_name'},
            { title: '标准ID',  dataIndex: 'id', key: 'id'},
            { title: '收费标准名称',  dataIndex: 'charge_name', key: 'charge_name'},
            { title: '收费标准生效时间',  dataIndex: 'charge_valid_time', key: 'charge_valid_time'},
            { title: '收费项目名称',  dataIndex: 'project_name', key: 'project_name'},
            { title: '收费模式',  dataIndex: 'project_type_str', key: 'project_type_str'},
            { title: '计费模式',  dataIndex: 'fees_type', key: 'fees_type'},
            { title: '账单生成周期',  dataIndex: 'bill_create_set', key: 'bill_create_set'},
            { title: '生成账单模式',  dataIndex: 'bill_type', key: 'bill_type'},
           
    ];
    export default {
        components:{

        },
        data() {
            return {
                datalist:[],
                pagination: { pageSize: 10, total:10 },
                search: { page: 1,village_id:'0',keyword:'' },
                page:1,
                title:'关联收费标准',
                xrecord:{},
                visible:false,
                columns,
                villageList:[],
            };
        },
        activated () {

        },
        computed: {

        },
        methods: {
            moment,
            xlist(record){
                this.visible=true,
                this.xrecord=record;
                this.title= '【'+this.xrecord.charge_number_name+'】关联收费标准'
                console.log('xrecord',this.xrecord);
                this.search= { page: 1,village_id:'0',keyword:'' };
                this.getChargeRuleList();
                this.getPropertyVillageList();
            },
            getChargeRuleList() {
                this.search.subject_id=this.xrecord.id;
                this.search.property_id=this.xrecord.property_id;
                this.search.charge_type=this.xrecord.charge_type;
                this.search.xtype='chargeRelateRule';
                this.request(newChargeApi.propertyChargeRuleList,this.search)
                  .then((res) => {
                    this.datalist = res.list;
                    this.pagination.total = res.count ? res.count : 0
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                  });
            },
            getPropertyVillageList(){
                this.request(newChargeApi.getPropertyVillageList)
                  .then((res) => {
                    this.villageList = res.list;
                  });
            },
            searchList(){
                this.search.page= 1;
                this.getChargeRuleList();
            },
            handleCancel(){
                this.visible=false,
                this.xrecord={};
                this.search= { page: 1,village_id:'0',keyword:'' };
            },
            tableChange(e) {
              if (e.current && e.current>0) {
                this.page = e.current;
                this.search.page=e.current;
              }
              this.getChargeRuleList();
            },
    },
};
</script>
<style lang="less" scoped>

</style>