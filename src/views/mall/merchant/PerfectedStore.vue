<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-form
      @submit="handleSubmit"
      :form="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      v-if="ajaxData"
    >
      <a-card title="基本信息" :bordered="false">
        <a-form-item label="店铺名称">
          <a-input disabled v-decorator="['store_name', { initialValue: ajaxData.store_name}]"/>
        </a-form-item>
        <a-form-item label="店铺图片" help="读取店铺列表 商家图片的第一张图片作为餐饮店铺logo图使用，如需修改可在店铺管理--店铺描述里修改">
          <img style="height: 70px;border: 1px solid #ddd" :src="ajaxData.pic_info"/>
        </a-form-item>
        <a-form-item label="店铺公告">
          <template slot="help">
            <div>1. 用于前台店铺页展示公告信息</div>
            <div>
              2. 介绍中不得含有虚假的、冒充、利用他人名义的、容易构成法律、法规和政策禁止的内容，公告字符数建议4-120个
            </div>
          </template>
          <a-textarea
            v-decorator="['store_notice', { initialValue: ajaxData.store_notice}]"
            :rows="4"
          />
        </a-form-item>
      </a-card>
      <a-card title="电子面单" :bordered="false" style="margin-top:20px">
        <a-form-item label="打印机设备编码">
          <a-input  v-decorator="['device_id', { initialValue: ajaxData.device_id}]" placeholder="请输入设备编码，打印物流发货面单"/>
        </a-form-item>
        <a-form-item label="选择快递公司">
          <div v-for="(single_face,index) in single_face_data" :key="index">
            <a-select v-model="single_face.name" @change="changeExpress(index,single_face.code,$event)" style="width: 20%">
              <a-select-option :value="express.code" v-for="express in express_data" :key="express.code">
                {{express.name}}
              </a-select-option>
            </a-select>
            <a-input style="width: 35%" v-model="single_face.tempid" placeholder="请输入物流面单模板编码" @change="changeTempid(index)"/>
            <a-input style="width: 35%" v-model="single_face.partner_id" placeholder="请输入快递公司网点账号"/>
            <div v-if="index == 0" style="float: right">
              <a-button type="primary" @click="addExpress">
                添加
              </a-button>
            </div>
            <div v-else style="float: right">
              <a-button type="primary" @click="delExpress(index)">
                删除
              </a-button>
            </div>
            <viewer :images="single_face.pic">
              <img style="height: 120px;border: 1px solid #ddd" v-if="single_face.pic && single_face.pic.length" :src="single_face.pic" title="点击放大查看"/>
            </viewer>
          </div>
        </a-form-item>
      </a-card>
      <a-card title="服务信息" :bordered="false" style="margin-top:20px">
        <a-form-item label="配送方式">
          <a-checkbox v-decorator="[ 'is_delivery',{  initialValue:ajaxData.is_delivery==1?true:false ,valuePropName: 'checked'}]" @change="changeDeliveryType1">快递配送</a-checkbox>
          <a-checkbox :disabled="ajaxData.mall_platform_delivery_open==0?true:false" v-decorator="[ 'is_houseman',{  initialValue:ajaxData.is_houseman==1?true:false ,valuePropName: 'checked'}]" @change="changeDeliveryType2">骑手配送</a-checkbox>
          <a-checkbox v-decorator="[ 'is_zt',{  initialValue:ajaxData.is_zt==1?true:false ,valuePropName: 'checked'}]" @change="changeDeliveryType3">自提</a-checkbox>
        </a-form-item>
        <a-form-item label="配送者" v-if="is_houseman == 1">
          <a-radio-group v-decorator="[ 'horseman_type',{  initialValue:ajaxData.horseman_type}]">
            <a-radio :disabled=is_platform_delivery_open :value="0">平台配送</a-radio>
            <a-radio :value="1">商家配送</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备货时长" v-if="is_houseman == 1" help="时间选择=用户下单时间+备货时长+骑手配送时间段">
          <a-input-number v-decorator="['stockup_day', { initialValue: ajaxData.stockup_day}]" :min="0"  :formatter="value => `${value} 天`"/>
          <a-input-number v-decorator="['stockup_hour', { initialValue: ajaxData.stockup_hour}]" :min="0" :max="23" :formatter="value => `${value} 时`"/>
          <a-input-number v-decorator="['stockup_minute', { initialValue: ajaxData.stockup_minute}]" :min="0" :max='59' :formatter="value => `${value} 分`"/>
        </a-form-item>
        <a-form-item label="新订单及时提醒" help="新订单和退款单将关闭语音和弹窗提醒">
          <a-switch
            v-decorator="['new_order_warn', { initialValue:ajaxData.new_order_warn == '1' ? true: false, valuePropName: 'checked'}]"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>
        <a-form-item label="快递运费计算方式">
          <a-radio-group v-decorator="[ 'delivery_fee_type',{  initialValue:ajaxData.delivery_fee_type }]">
            <a-radio :value="1">单独计算</a-radio>
            <a-radio :value="2">最大值计算</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="电子发票">
          <a-switch
            v-decorator="['e_invoice_status', { initialValue:ajaxData.e_invoice_status == '1' ? true: false, valuePropName: 'checked'}]"
            checked-children="开启"
            un-checked-children="关闭"
            @change="switchInvoice"
          />
        </a-form-item>
        <a-form-item label="发票满足金额" v-if="e_invoice_status">
          <a-input-number v-decorator="['invoice_money', { initialValue: ajaxData.invoice_money}]" :min="0" :formatter="value => `￥ ${value}`"/>
        </a-form-item>
        <!--        <a-form-item label="会员优惠">-->
        <!--          <div v-for="(item,index) in ajaxData.level_off" v-bind:key="item.lid">-->
        <!--            <input type="hidden" v-model="level_off[index].lid"/>-->
        <!--            <input type="hidden" v-model="level_off[index].lname"/>-->
        <!--            <label style="padding-right: 20px">{{item.txt}}</label>-->
        <!--            <label>优惠类型：</label>-->
        <!--            <a-select style="margin-right: 20px; height: 30px; width: 150px" default-value="item.type" v-model="level_off[index].type">-->
        <!--              <a-select-option :value="0">无优惠</a-select-option>-->
        <!--              <a-select-option :value="1">百分比（%）</a-select-option>-->
        <!--            </a-select>-->
        <!--            <a-input-number style="width: 160px" v-model="level_off[index].vv" :min="0" placeholder="请填写一个优惠值数字"/>-->
        <!--          </div>-->
        <!--        </a-form-item>-->
        <a-form-item :wrapperCol="{ span: 24 }" class="text-left" style="margin:20px 0">
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import FormItem from '@/components/FormItem/FormItem'
import mallMerchantApi from '@/api/mall/merchant'
import moment from 'moment'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)
export default {
  name: "PerfectedStore.vue",
  components: {
    FormItem,
  },
  data() {
    return {
      //查询字段
      queryParam: {},
      express_data:[],
      single_face_data:[{code: '',name:'请选择快递公司',tempid:'',partner_id:'',pic:[]}],
      // 表单数据
      ajaxData: null,

      //表单字段
      store_name: '',
      pic_info: '',
      store_notice: 1,
      is_delivery:1,
      is_houseman:0,
      is_zt:0,
      horseman_type: 0,
      stockup_day: 0,
      stockup_hour: 0,
      stockup_minute: 0,
      new_order_warn: true,
      delivery_fee_type: 1,
      e_invoice_status: false,
      //level_off: [],
      device_id:'',
      form: this.$form.createForm(this),
    }
  },
  watch: {
    '$route.query.store_id'() {
      if (this.$route.query.store_id != undefined) {
        this.ajaxData = null
        this.getData()
      }
    },
  },
  created() {
    this.getData()
  },
  methods: {
    moment,
    getData() {
      if (this.$route.query.store_id != undefined) {
        this.queryParam['store_id'] = this.$route.query.store_id
      } else {
        this.queryParam['store_id'] = 0
      }
      this.request(mallMerchantApi.getStoreConfigList, this.queryParam).then((res) => {
        this.ajaxData = res
        this.is_delivery = res.is_delivery == 1 ? true : false
        this.is_houseman = res.is_houseman == 1 ? true : false
        this.horseman_type = res.horseman_type
        this.is_zt = res.is_zt == 1 ? true : false
        this.is_platform_delivery_open = res.is_platform_delivery_open == 1 ? false:'disabled'
        //this.level_off = this.ajaxData.level_off
        this.e_invoice_status = res.e_invoice_status == 1 ? true : false
        this.new_order_warn = res.new_order_warn == 1 ? true : false
        this.express_data = res.express_list
        if (res.single_face_info.length) {
          res.single_face_info = res.single_face_info.map(item=>{
            this.express_data.map(itm=>{
              if (itm.code == item.code) {
                item.pic = new Array(itm.pic)
              }
            })
            return item
          })
          this.single_face_data = res.single_face_info
        } else{
          this.single_face_data = [{code: '',name:'请选择快递公司',tempid:'',partner_id:'',pic:[]}]
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.store_id = this.$route.query.store_id
          //values.level_off = this.level_off
          if (!values.store_id) {
            this.$message.error('缺少参数')
            return false
          }
          values.single_face_info = new Array()
          for(let i=0;i<this.single_face_data.length;i++)
          {
            if(this.single_face_data[i].code != '') {
              if(this.single_face_data[i]['tempid'] === '') {
                this.$message.error('请输入'+this.single_face_data[i].name+'物流面单模板编码')
                return false
              }

              if(this.single_face_data[i].partner_id == '') {
                this.$message.error('请输入'+this.single_face_data[i].name+'快递公司网点账号')
                return false
              }
              let express = {
                code:this.single_face_data[i].code,
                name:this.single_face_data[i].name,
                tempid:this.single_face_data[i].tempid,
                partner_id:this.single_face_data[i].partner_id,
              }
              values.single_face_info.push(express)
            }
          }
          this.request(mallMerchantApi.perfectedStore, values).then((res) => {
            this.$message.success('保存成功')
            this.$router.push('/merchant/merchant.mall/storeList')
          })
        }
      })
    },
    changeDeliveryType1(e) {
      this.is_delivery = e.target.checked
    },
    changeDeliveryType2(e) {
      this.is_houseman = e.target.checked
    },
    changeDeliveryType3(e) {
      this.is_zt = e.target.checked
    },
    switchInvoice(value) {
      this.e_invoice_status = value
    },
    //选择快递公司下拉列表
    changeExpress(idx,old_express_code,new_express_code){
      this.single_face_data.map((item,index)=>{
        if (idx == index) {
          item.code = new_express_code
          this.express_data.map(itm=>{
            if (itm.code == new_express_code) {
              item.name = itm.name
              item.tempid = itm.tempid
              item.pic = new Array(itm.pic)
            }
          })
        }
        return item
      })
    },
    //添加快递公司
    addExpress(){
      this.single_face_data.push({code: '',name:'请选择快递公司',tempid:'',partner_id:'',pic:[]})
    },
    //删除快递公司
    delExpress(index){
      this.single_face_data.splice(index,1)
    },
    //编辑快递公司模板
    changeTempid(idx){
      this.single_face_data.map((item,index)=>{
        if (idx == index) {
          var tempid = item.tempid
          var check = false
          var pic = ''
          for(let i=0;i<this.express_data.length;i++){
            if (tempid == this.express_data[i].tempid) {
              check = true
              pic = this.express_data[i].pic
            }
          }
          if (!check) {
            item.pic = new Array()
          } else {
            item.pic = new Array(pic)
          }
        }
        return item
      })
    }
  }

}
</script>

<style scoped>

</style>