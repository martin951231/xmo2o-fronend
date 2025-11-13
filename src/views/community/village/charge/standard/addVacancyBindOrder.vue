<template>
  <a-modal :title="title" :width="820" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit()" @cancel="handleCancel">
      <span class="page_top">
          <span class="notice" v-if="ruleItem.charge_type!='park_new'">
              注意：<br/>
              1、需要先在收费标准绑定页面，绑定房间数据。绑定成功后在进行操作生成账单<br/>
              2、手动生成账单是给已绑定该收费标准的房间，批量生成待缴账单<br/>
              <p v-if="xtype==1">3、每点一次确定批量生成一次</p>
          </span>
          <span class="notice" v-if="ruleItem.charge_type=='park_new'">
              注意：<br/>
              1、需要先在收费标准绑定页面，绑车位数据。绑定成功后在进行操作生成账单<br/>
              2、手动生成账单是给已绑定该收费标准且绑定了住户的车位，批量生成待缴账单<br/>
              <p>3、当车位已经有待缴账单时，不进行生成新的订单。没绑定住户的车位，不进行生成订单</p>
              <p>4、当前车位到期时间大于当前时间的，新生成的订单计费开始时间将顺延当前车位到期时间</p>
              <p>5、当前车位到期时间小于当前时间 或者 当前车位没有到期时间的，新生成的订单计费开始时间将是当前日期</p>
          </span>
      </span>
       <a-button type="primary" style="margin-bottom: 10px;" @click="$refs.BindModel.list(ruleItem.id, ruleItem.charge_type, ruleItem)">绑定费用对象</a-button>
        <div v-if="xtype==1">给一次性项目【{{project_name}}】的标准【{{charge_name}}】批量生成账单</div>
        <div v-if="xtype==0">请点击确定按钮给已绑定房间的【{{charge_name}}】标准生成账单</div>
        <div style="height: 150px;margin-top: 20px;" v-if="ruleItem.charge_type!='park_new'">
              <a-form :form="form" v-if="xtype==1">
                <a-col  :sm="24" class="suggestions_col" >
                  <label style="margin-top: 5px;">计费开始时间：</label>
                            <a-date-picker
                              @change="serviceStartTimeChange"
                              format="YYYY-MM-DD"
                              placeholder="计费开始时间"
                               v-model="service_start_time"
                            /> 

                </a-col>
                <a-col :sm="24" class="suggestions_col" style="margin-top: 20px;">
                  <label style="margin-top: 5px;">计费结束时间：</label>
                             <a-date-picker
                              @change="serviceEndTimeChange"
                              format="YYYY-MM-DD"
                              placeholder="计费结束时间"
                              v-model="service_end_time" 
                            />
                
                </a-col>
                  <!--
                <div class="form_box" style="margin-bottom: 20px;" v-for="(item,index) in index_row" >
                  <a-row :gutter="48" style="margin-left: 1px;">
                    <a-col :md="10" :sm="24" style="padding-left: 1px; padding-right: 1px;">
                      <label style="margin-top: 5px;">选择楼栋：</label>
                      <a-select style="width: 220px" placeholder="请选择楼栋" v-model="item.single_id" @change="singleChange(item.single_id,index)">
                        <a-select-option :value='0'>
                          请选择楼栋
                        </a-select-option>
                        <a-select-option :value="item11.id" v-for="(item11,index11) in single" :key="index11">
                          {{item11.name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :md="10" :sm="24" style="padding-right: 1px" v-if="floor[item.single_id]">
                      <label style="margin-top: 5px;">对应单元：</label>
                      <a-select style="width: 220px" placeholder="请选择单元" v-model="item.floor_id" mode="multiple">
                          <a-select-option :value='0'>
                            请选择单元
                          </a-select-option>
                        <a-select-option :value="item1.floor_id" v-for="(item1,index1) in floor[item.single_id]" :key="index1">
                          {{item1.name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    <a-col class="icon_1" style="padding-right: 1px;padding-left: 1px;" @click="del_row(index)"
                           v-if="index>0">
                      <a-icon type="minus"/>
                    </a-col>
                  </a-row>
                </div>
                
                <div class="icon_1 margin_top_10" @click="add_row" v-if="index_row.length<5">
                  <a-icon type="plus"/>
                </div>
                -->
              </a-form>
    </div>
    <bindList ref="BindModel" />
  </a-modal>
</template>
<style>
  .imgname {
    width: 100px;
  }
</style>
<script>
  import bindList from './bindList'
  import moment from 'moment';
  import villageApi from '@/api/community/village';
  export default {
    data() {
      return {
        title: '新建',
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },

        index_row: [
          {
            id: 0,
          },
        ],
        single_id: 0,
        floor_id: 0,
        floor: [],
        single: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        visible: false,
        loadingLayer: false,
        rule_id: 0,
        rule_info: [],
        bind_type: '',
        charge_name:'',
        charge_project_id:0,
        xtype:0,
        project_name:'',
        service_start_time:moment().format('YYYY-MM-DD'),
        service_end_time:moment().format('YYYY-MM-DD'),
        ruleItem:{},
      }
    },
    components: {
        bindList
    },
    mounted() {
       
    },

    methods: {
       moment,
      add(rule_id,charge_name,xtype,ruleItem) {
        this.xtype= xtype!=undefined ? xtype:0; //1一次性费用 批量生成
        this.title = '给已绑定该标准的房间手动批量生成账单';
        if(charge_name){
            this.title = '给已绑定【'+charge_name+'】手动批量生成账单';
        }
        if(this.xtype==1){
            this.title = '给已绑定该标准的房间批量生成账单';
            if(charge_name){
                this.title = '给已绑定【'+charge_name+'】批量生成账单';
            }
        }
        this.charge_project_id=ruleItem!=undefined ? ruleItem.charge_project_id:0;
        this.project_name=ruleItem!=undefined ? ruleItem.project_name:'';
        this.ruleItem=ruleItem;
        this.charge_name=charge_name;
        this.visible = true;
        this.loadingLayer = true;
        this.single = [];
        this.floor_id=0;
        this.floor=[];
        this.single_id=0;
        this.index_row = [
            {
                id: 0,
                single_id:0,
                floor_id:[],
            }
        ];
        this.confirmLoading=false;
        this.rule_id = rule_id;
        this.getSingle();
        this.getRuleInfo();
      },
      add_row() {
          if(this.index_row.length>=5){
              this.$message.error('最多每次添加5条数据操作')
              return false
          }
        let post = {
           id: 0,
           single_id:0,
           floor_id:[],
        }
        this.index_row.push(post)
      },
      getSingle() {
        this.request(villageApi.getSingleListByVillage)
          .then((res) => {
            console.log('resSingle', res)
            this.single = res
          })
      },
      getRuleInfo() {
        this.request(villageApi.getRuleInfo, {'rule_id': this.rule_id})
          .then((res) => {
            this.rule_info = res
            console.log('rule_info', res)
          })
      },
      
      del_row(index) {
        if(index>0){
            this.index_row.splice(index, 1)
        }
      },
      singleChange(value, index) {
        console.log(`value: ${value}`);
        console.log(`index: ${index}`);
        this.index_row[index].floor_id=[];
        if (value < 1) {
            return false
        }
        console.log('floor0',this.floor);
        this.loadingLayer = false;
        this.request(villageApi.getFloorList, {'pid': value})
          .then((res) => {
            this.floor[value] = res;
             console.log('floor1',this.floor);
            this.loadingLayer = true;
            this.$forceUpdate()
          })
      },
      
      addBind(){
        const bindData1 = {}
        bindData1.rule_id=this.rule_id
        bindData1.charge_project_id=this.charge_project_id
        let start_time_int=this.service_start_time ? this.service_start_time.replace('-',''):0;
        start_time_int=parseInt(start_time_int);
        let start_end_time=this.service_end_time ? this.service_end_time.replace('-',''):0;
        start_end_time=parseInt(start_end_time);
        if((this.xtype==1 && start_time_int > start_end_time) && this.ruleItem.charge_type!='park_new'){
             this.$message.error('计费结束时间不能小于计费开始时间！');
              return false
        }
        bindData1.xtype=this.xtype;
        bindData1.charge_type=this.ruleItem.charge_type;
        bindData1.service_start_time=this.service_start_time;
        bindData1.service_end_time=this.service_end_time;
        
        bindData1.create_order=1;
        bindData1.single_data=this.index_row;
        this.confirmLoading=true;
        this.request(villageApi.standardCreateManyOrderByRuleId,bindData1)
          .then((res) => {
            if(res.status==1001 && res.msg){
                 this.$message.error(res.msg)
                 this.confirmLoading=false;
            }else{
              let retmsg='操作成功！';
              if(res.standard_bind_count<1){
                  retmsg='此标准还没有绑定任何数据！';
                  this.$message.warn(retmsg)
              }else if(res.ordercount<1){
                retmsg='没有生成账单，没有符合生成账单的数据！';
                this.$message.warn(retmsg)
              }else {
                  retmsg='已成功生成'+res.ordercount+'个待缴账单';
                  this.$message.success(retmsg)
              }
              setTimeout(() => {
                this.confirmLoading=false;
                this.form = this.$form.createForm(this)
                this.visible = false
                this.loading = false
                this.$emit('ok',this.rule_id)
              }, 1500)
            }
          }).catch((error) => {
            this.confirmLoading=false;
        })
      },

      serviceStartTimeChange(date,dateString){
          console.log('serviceStartTime',dateString);
          this.service_start_time=dateString;
      },
      serviceEndTimeChange(date,dateString){
          console.log('serviceEndTime',dateString);
          this.service_end_time=dateString;
      },
      handleSubmit(type) {
          const _this = this
          this.$confirm({
            title: '是否确定手动批量生成账单?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk () {
                 _this.addBind()
            },
            onCancel() {},
          })
      },
      handleCancel() {
        this.visible = false
        this.index_row = [
            {
                id: 0,
                single_id:0,
                floor_id:[],
            }
        ];
        this.floor=[];
        this.confirmLoading=false;
        setTimeout(() => {
          this.form = this.$form.createForm(this)
        }, 500)
      },
    },
  }
</script>
<style lang="less" scoped>
  .form_box {
    margin-top: 10px;
  }

  .form_box:first-of-type {
    margin-top: 0px;
  }

  .icon_1 {
    margin-left: 72px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #999999;
  }

  // 公共样式
  .margin_top_10 {
    margin-top: 10px;
  }

</style>