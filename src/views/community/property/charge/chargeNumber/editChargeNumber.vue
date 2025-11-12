<template>
  <a-modal  :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="所属收费类别" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-select  style="width: 348px"  placeholder="请选择收费类别"   v-model="number.charge_type"  @change="handleChange">
              <a-select-option :value="item111.key" v-for="(item111,index111) in charge_type_list" :key="index111">
                {{item111.value}}
              </a-select-option>
            </a-select>

          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="水表类型" :labelCol="labelCol" :wrapperCol="wrapperCol"  v-if="water_type_status">
          <a-col :span="18">
            <a-radio-group v-model="number.water_type" >
              <a-radio :value="item15.value"  v-for="(item15,index15) in water_type_arr" :key="index15" style="width: 78px">
                {{item15.title}}
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="收费科目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-input placeholder="请输入收费科目名称" v-model="number.charge_number_name"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="建行收款账号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="jz_wsxdsj_net_customized_open">
          <a-col :span="18">
              <a-input placeholder="请输入建行收款账号" v-model="number.rule_id"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-radio-group v-model="number.status" >
              <a-radio :value="1">
                正常
              </a-radio>
              <a-radio :value="2" >
                关闭
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import newChargeApi from '@/api/community/property/packages';
  export default {
    data() {
      this.dateFormat='YYYY-MM-DD';
      return {
        title: '领用租借',
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
        charge_type_list:[],
        defaultChecked:true,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        number: {
          id: 0,
          charge_type:'',
          charge_number_name: '',
          status:1,
          water_type:0
        },
        id:0,
        water_type_status:false,
        water_type_arr:[],
        jz_wsxdsj_net_customized_open:false
      }
    },
    methods: {

      handleChange(value) {
        if(value == 'water'){
          this.request(newChargeApi.chargeWaterType).then((res) => {
            this.water_type_status=res.status;
            this.water_type_arr=res.data;
          })
        }else{
          this.water_type_status=false;
          this.water_type_arr=[];
        }
      },
      add() {
        this.title = '添加科目'
        this.visible = true
        this. number= {
          id: 0,
          charge_number_name: '',
          status:1,
          water_type:0
        };
        this.checkedKeys=[];
        this.charge_type_list=[];
        this.id = 0;
        this.water_type_status=false;
        this.water_type_arr=[];
        this.getChargeType()
        this.getConstructionStatus()
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.charge_type_list=[]
        this.getChargeNumberInfo()
        this.getChargeType()
        this.getConstructionStatus()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑科目'
        } else {
          this.title = '添加科目'
        }
      },
      handleChangenumber(){},
      getChargeNumberInfo(){
        this.request(newChargeApi.chargeNumberInfo, {
          id: this.id
        })
          .then((res) => {
            this.number = res
            console.log('number', this.number)
            this.handleChange(res.charge_type)

          })
      },
      getChargeType(){
        this.request(newChargeApi.getChargeType)
          .then((res) => {
            this.charge_type_list = res
            console.log('charge_type_list', this.charge_type_list)

          })
      },
      getConstructionStatus(){
        this.request(newChargeApi.getConstructionStatus)
          .then((res) => {
            this.jz_wsxdsj_net_customized_open = res.jz_wsxdsj_net_customized_open
            console.log('jz_wsxdsj_net_customized_open', this.jz_wsxdsj_net_customized_open)
          })
      },
      handleSubmit() {
        this.confirmLoading = true
        if(this.id>0){
          this.number.id= this.id;
          this.request(newChargeApi.editChargeNumber, this.number)
            .then((res) => {
              if(res)
              {
                this.$message.success('编辑成功')
              }else{
                this.$message.success('编辑失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error)=>{
              this.confirmLoading = false
            })
        }else{
          this.request(newChargeApi.addChargeNumber, this.number)
            .then((res) => {
              if(res)
              {
                this.$message.success('添加成功')
              }else{
                this.$message.success('添加失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error)=>{
              this.confirmLoading = false
            })
        }

      },
      handleCancel() {
        this.visible = false
        setTimeout(() => {
          this.id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
      },
    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>