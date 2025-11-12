<template>
  <a-modal  :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item :label="item111.value" :labelCol="labelCol" :wrapperCol="wrapperCol" v-for="(item111,index111) in charge_type_list" >
          <a-col :span="18">
            <a-input placeholder="请输入缴费项目编号" v-model="item111.code" />
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
        water_type_arr:[]
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
        this.title = '收费类别配置'
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
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.charge_type_list=[]
        this.getChargeNumberInfo()
        this.getChargeType()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑科目'
        } else {
          this.title = '收费类别配置'
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
        this.request(newChargeApi.getChargeTypeCode)
          .then((res) => {
            this.charge_type_list = res
            console.log('charge_type_list', this.charge_type_list)

          })
      },
      handleSubmit() {
          //保存
        this.confirmLoading = true

        this.request(newChargeApi.editChargeTypeCode, {charge_list:this.charge_type_list})
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