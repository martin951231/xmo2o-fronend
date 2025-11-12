<template>
  <div class="account-community-config-info-view">
      <a-collapse accordion>
          <a-collapse-panel key="1" header="操作说明">
              <p>
                  在收费设置模块，支持设置“已缴账单退款期限、自动催缴日期、自动催缴发送人”信息。
              </p>
          </a-collapse-panel>
      </a-collapse>
    <a-row :gutter="20">
      <a-col :md="40" :lg="20">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 20 }" @submit="handleSubmit" style="margin-left: 50px;margin-top: 20px;">
          <a-form-item label="已缴账单退款期限" >
              收款后
            <a-col :span="3">
                <a-input-number
                    :max="9999"
                    style="width: 120px"
                    placeholder="请输入天数"
                    :precision="0"
                    :min="0"
                    v-model="set.refund_term"
                />
            </a-col>
            <a-col :span="3">
              (天)内可进行退款
            </a-col>
            不填默认不能进行退款，缴费时间超过该天数则不能进行退款。最高填写9999
          </a-form-item>
          <a-form-item label="自动催缴日期">
            <a-col :span="4">
              每月
              <a-select default-value="0" style="width: 120px"  v-model="set.call_date">
                <a-select-option :value="0">
                  默认不通知
                </a-select-option>
                <a-select-option :value="1">
                  01
                </a-select-option>
                <a-select-option :value="2">
                  02
                </a-select-option>
                <a-select-option :value="3">
                  03
                </a-select-option>
                <a-select-option :value="4">
                  04
                </a-select-option>
                <a-select-option :value="5">
                  05
                </a-select-option>
                <a-select-option :value="6">
                  06
                </a-select-option>
                <a-select-option :value="7">
                  07
                </a-select-option>
                <a-select-option :value="8">
                  08
                </a-select-option>
                <a-select-option :value="9">
                  09
                </a-select-option>
                <a-select-option :value="10">
                  10
                </a-select-option>
                <a-select-option :value="11">
                  11
                </a-select-option>
                <a-select-option :value="12">
                  12
                </a-select-option>

                <a-select-option :value="13">
                  13
                </a-select-option>
                <a-select-option :value="14">
                  14
                </a-select-option>
                <a-select-option :value="15">
                  15
                </a-select-option>
                <a-select-option :value="16">
                  16
                </a-select-option>
                <a-select-option :value="17">
                  17
                </a-select-option>
                <a-select-option :value="18">
                  18
                </a-select-option>
                <a-select-option :value="19">
                  19
                </a-select-option>
                <a-select-option :value="20">
                  20
                </a-select-option>
                <a-select-option :value="21">
                  21
                </a-select-option>
                <a-select-option :value="22">
                  22
                </a-select-option>
                <a-select-option :value="23">
                  23
                </a-select-option>
                <a-select-option :value="24">
                  24
                </a-select-option>

                <a-select-option :value="25">
                  25
                </a-select-option>
                <a-select-option :value="26">
                  26
                </a-select-option>
                <a-select-option :value="27">
                  27
                </a-select-option>
                <a-select-option :value="28">
                  28
                </a-select-option>
                <a-select-option :value="29">
                  29
                </a-select-option>
                <a-select-option :value="30">
                  30
                </a-select-option>
              </a-select>
              号
            </a-col>
               收费项目生成账单的当天8:30给住户推送缴费通知；若设置自动催缴日期后，则每月的日期当天9:30分默认给所有欠费{{$store.getters.config.room_name}}中住户推送缴费通知。

          </a-form-item>
          <a-form-item label="自动催缴发送人">

              <a-select default-value="1"  style="width: 150px" v-model="set.call_type">
                <a-select-option :value="1"  >
                  仅业主
                </a-select-option>
                <a-select-option :value="2" >
                  业主和家属
                </a-select-option>
                <a-select-option :value="3" >
                  业主、家属和租客
                </a-select-option>
              </a-select>


              自动催缴通知发送人，默认仅发给业主

          </a-form-item>
        <a-form-item label="强制合并收费" >
            <a-radio-group
                v-model="set.is_combine"
            >
                <a-radio :value="1" >
                    是
                </a-radio>
                <a-radio :value="2" >
                    否
                </a-radio>
            </a-radio-group>
            如果选择是则用户在移动端缴费的时候不可以选择性的缴费。
        </a-form-item>
        <a-form-item label="缴费通知人员">
            <a-select  style="width: 800px"  mode="multiple" option-label-prop="label" @change="selectWorke" v-model="set.wids" >
              <a-select-option  v-for="(item,index) in allWorkerList" :value="item.wid" :label="item.name">
                <span style="color:#000000;font-weight: bold;">{{item.name}}</span>  (【职务类型：{{item.type_name}}】【手机号：{{item.phone}}】【绑定微信：<span v-if="item.openid.length>0" style="color:green">{{item.openid_desc}}</span> <span v-else style="color:red;">{{item.openid_desc}}</span>】)
              </a-select-option>
            </a-select>
               &nbsp;可设置多个工作人员接收缴费通知
        </a-form-item>
        <a-form-item label="待缴账单金额可修改成0"  >
        
            <a-select   style="width: 150px" v-model="set.can_modify_zero">
              <a-select-option :value="0"  >
                 不允许
              </a-select-option>
              <a-select-option :value="1" >
                允许
              </a-select-option>
            </a-select>
            允许待缴账单设置为“0”时，允许在收银台对待缴账单金额修改为“0”，不允许时，不允许修改为0
        
        </a-form-item>
        
        <a-form-item label="设置预收账单时间" >
          <a-col :span="3">
              <a-input-number
                  :max="9999"
                  style="width: 120px"
                  placeholder="请输入天数"
                  :precision="0"
                  :min="0"
                  v-model="set.order_type_cutday"
              />
          </a-col>
            (天)默认为 0 天，用于未缴账单的筛选 预收费用 / 欠缴费用 区分
        </a-form-item>
        
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit" :loading="loginBtn">
              确定
            </a-button>
          </a-form-item>

        </a-form>

      </a-col>
    </a-row>
  </div>
</template>
<script>
  import villageApi from '@/api/community/village'
  import { Collapse } from 'ant-design-vue';

  export default {
    name: 'setCharge',
    data() {
      return {
        form: this.$form.createForm(this),
        set: {
          'refund_term': '',
          'call_type': 1,
          'call_date': 0,
          'is_combine':2,//是否强制合并账单支付
          'wids':[],
          'can_modify_zero':0,
        },
        'allWorkerList':[],
        show: true,
        loginBtn:false
      }
    },
      components: {
          'a-collapse':Collapse,
          'a-collapse-panel':Collapse.Panel,
      },
    activated () {
      this.chargeSetInfo()
    },
    mounted() {
        this.getAllWorkerList()
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        this.request(villageApi.editChargeSet, this.set)
          .then((res) => {
            console.log('res', res)
            if (res) {
              this.$message.success('更新成功！');
              this.chargeTimeInfo()
            }
            this.loginBtn = false;
          }).catch((error) => {
          this.loginBtn = false;
        })
      },

      // 获取设置信息
      chargeSetInfo() {
        this.request(villageApi.chargeSetInfo)
          .then((res) => {
            if (res && res.length != 0){
              this.set=res
            }
            console.log(res)
            
          })
      },
      selectWorke(value){
          console.log(value)
      },
      // 获取员工信息
      getAllWorkerList() {
        this.request(villageApi.getAllWorkerList)
          .then((res) => {
            if (res.list && res.list.length>0){
                this.allWorkerList=res.list;
            }else{
                this.allWorkerList=[];
            }
          })
      },
    }
  }
</script>

<style  scoped>
  /deep/ .ant-form-item-label {
    display: inline-block;
    overflow: hidden;
    line-height: 39.9999px;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    width: 16%;
  }
  .account-community-config-info-view {
    margin: 30px 20px;
    background-color: white;
    padding: 30px;
  }

  .imgname {
    width: 80px;
  }
  .ant-col-12 {
    width: 70%;
  }
</style>