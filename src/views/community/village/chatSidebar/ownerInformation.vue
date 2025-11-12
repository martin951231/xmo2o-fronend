<template>
  <div>
    <a-form :form="form" class="project_info">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本信息">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户编号">
            <span>{{ bind_number }}</span>
          </a-form-item>
          <a-form-item label="业主名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input id="user_name" v-model="post.name" />
          </a-form-item>
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input id="phone" v-model="post.phone" />
          </a-form-item>
          <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input id="id_card" v-model="post.id_card" />
          </a-form-item>
          <a-form-item label="IC卡号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input id="ic_card" v-model="post.ic_card" />
          </a-form-item>
          <a-form-item label="住址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <span>{{ room_diy_name }}</span>
          </a-form-item>
          <a-form-item label="房子平方" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <span>{{ housesize }} ㎡</span>
          </a-form-item>
          <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input id="memo" v-model="post.memo" />
          </a-form-item>
          <a-form-item label="房屋类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <span>{{ house_type_name }}</span>
          </a-form-item>
          <a-form-item label="车位信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-table v-if="positionList.length !== 0" :columns="positionColumns" :data-source="positionList" class="components-table-demo-nested" rowKey="id" ></a-table>
            <span v-else >无</span>
          </a-form-item>
          <a-form-item label="车辆信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-table v-if="carList.length !== 0" :columns="carColumns" :data-source="carList" class="components-table-demo-nested" rowKey="id" ></a-table>
            <span v-else >无</span>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="2" tab="业主资料" force-render>
          <a-form-item :label="item.title" :value="key" v-for="(item,key) in dataList" :key="key" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="item.is_must*1==1 ? true:false">
            <a-input v-if="item.type === 1" :id="item.key" v-model="authentication_field[item.key]['value']" />

            <a-select show-search v-else-if="item.type === 2" v-model="authentication_field[item.key]['value']" style="width: 120px">
              <a-select-option :value="value" v-for="(value,index) in item.use_field" :key="index" >{{ value }}</a-select-option>
            </a-select>

            <div v-else-if="item.type === 3">
              <a-select :default-value="authentication_field[item.key]['province_name']" style="width: 120px" @change="handleChangeProvince" >
                <a-select-option :value="value['id']" v-for="(value,index) in province_list" :key="index" >{{ value['name'] }}</a-select-option>
              </a-select>
              <a-select v-if="city_list.length !== 0" v-model="secondCity" style="width: 120px;margin-left: 20px" @change="handleChange">
                <a-select-option :value="value['id']" v-for="(value,index) in city_list" :key="index" >{{ value['name'] }}</a-select-option>
              </a-select>
            </div>

            <a-date-picker v-else-if="item.type === 4" :name="item.key" :default-value="moment(getDate(item.key), dateFormat)" @change="(date, dateSting)=>onDateChange(date, dateSting,item.key)" />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="3" tab="信息标注" class="owner_msg">
            <div class="label_con" v-for="(item, index) in mark_list" :key="index">
                <div class="title">{{item.label}}：</div>
                <div class="choose_con" v-if="item.type == 1" style="display: flex;align-items: center;">
                    <a-radio-group v-model="mark_list[index].data.value">
                        <a-radio v-for="(item1, index1) in item.value" :value="item1.label">{{item1.value}}</a-radio>
                    </a-radio-group>
                    <a-select v-model="partyId" v-if="mark_list[index].data.value == 1" placeholder="请选择党支部" style="width: 200px; margin-left: 5px;" @change="selectOwnerChange">
                        <a-select-option v-for="(item1, index1) in item.data.street_party_branch" :value="item1.id">{{item1.name}}</a-select-option>
                    </a-select>
                </div>
                <div class="choose_con" v-if="item.type == 0">
                    <a-checkbox-group v-model="mark_list[index].data.value">
                        <a-checkbox :value="item1.label+''" v-for="(item1, index1) in item.value">{{item1.value}}</a-checkbox>
                    </a-checkbox-group>
                </div>
            </div>
            <!--
          <a-form-item label="政治面貌" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <label class="col-sm-1" v-for="(item,key) in user_label_data['political_outlook']" :key="key" style="padding-left:0;padding-right:20px;">
              <input class="label" type="radio" v-model="political_outlook" :value="item.id" name="political_outlook" >
              <span style="z-index: 1">{{ item.label_name }}</span>
            </label>
          </a-form-item>
          <a-form-item label="特殊人群" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <label class="col-sm-1" v-for="(item,key) in user_label_data['special_population']" :key="key" style="padding-left:0;padding-right:20px;">
              <input class="label" type="checkbox" v-model="special_population" :value="item.id" name="special_population" >
              <span style="z-index: 1">{{ item.label_name }}</span>
            </label>
          </a-form-item>
          <a-form-item label="重点人群" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <label class="col-sm-1" v-for="(item,key) in user_label_data['key_population']" :key="key" style="padding-left:0;padding-right:20px;">
              <input class="label" type="checkbox" v-model="key_population" :value="item.id" name="key_population" >
              <span style="z-index: 1">{{ item.label_name }}</span>
            </label>
          </a-form-item>
          <a-form-item label="关怀对象" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <label class="col-sm-1" v-for="(item,key) in user_label_data['care_object']" :key="key" style="padding-left:0;padding-right:20px;">
              <input class="label" type="checkbox" v-model="care_object" :value="item.id" name="care_object" >
              <span style="z-index: 1">{{ item.label_name }}</span>
            </label>
          </a-form-item>
          -->
        </a-tab-pane>
        <a-tab-pane key="4" tab="用户标签" class="user_label">
            <div class="label_con" v-for="(item, index) in label_list.list" :key="index">
                <div class="title">{{item.name}}：</div>
                <div class="radio_con">
                    <a-checkbox-group v-model="label_list.list[index].value" @change="radioUserLabelChange">
                        <a-checkbox :value="item1.id*1" v-for="(item1, index1) in item.children" :key="item1.id">{{item1.name}}</a-checkbox>
                    </a-checkbox-group>
                </div>
            </div>
        </a-tab-pane>  
      </a-tabs>
      <a-form-item :wrapper-col="{ span: 12, offset: 12 }" style="margin-top: 35px;">
        <a-button type="primary"  @click="handleSubmit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import villageApi from "@/api/community/village"
import moment from 'moment'

const carColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '车位', dataIndex: 'position_num', key: 'position_num' },
  { title: '车牌号', dataIndex: 'province', key: 'province' },
  { title: '停车卡号', dataIndex: 'car_stop_num', key: 'car_stop_num' },
  { title: '车主姓名', dataIndex: 'car_user_name', key: 'car_user_name' },
  { title: '车主手机号', dataIndex: 'car_user_phone', key: 'car_user_phone' }
]
const carList = []
const positionColumns = [
  { title: 'ID', dataIndex: 'bind_id', key: 'bind_id' },
  { title: '车库', dataIndex: 'garage_num', key: 'garage_num' },
  { title: '车位编号', dataIndex: 'position_num', key: 'position_num' },
  { title: '车位面积', dataIndex: 'position_area', key: 'position_area' },
  { title: '备注', dataIndex: 'position_note', key: 'position_note' }
]
const positionList = []
export default {
  name: 'ownerInformation',
  data () {
    return {
      title: '',
      dateFormat: 'YYYY-MM-DD',
      form: this.$form.createForm(this),
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
      bind_number: '',
      room_diy_name: '',
      housesize: '',
      disabled: true,
      dataList: '',
      authentication_field: { key: { value: '' } },
      house_type_name: '',
      secondCity: '',
      is_secondCity: false,
      user_label_data: { care_object: [{ id: 0, name: '' }] },
      province_list: [{ id: 0, name: '' }],
      city_list: [{ id: 0, name: '' }],
      political_outlook: 0,
      special_population: [],
      key_population: [],
      care_object: [],
      positionList,
      carList,
      positionColumns,
      carColumns,
      result: false,
      mark_list:[],
      label_list:[],
      partyId:'',
      post: {
        name: 0,
        phone: '',
        id_card: '',
        ic_card: '',
        memo: ''
      }
    }
  },
  props: {
    pigcmsId: {
      type: Number,
      default: 0
    },
    usernum: {
      type: String,
      default: ''
    }
  },
  created () {
    var param = {
      pigcms_id: this.pigcmsId,
      usernum: this.usernum
    }
    this.getUserInfo(param)
  },
  methods: {
    getDate(key){
        return this.authentication_field[key]['value']
    },
    moment,
    handleSubmit () {
      /*
      let lebelIds = [this.political_outlook]
      lebelIds = lebelIds.concat(this.special_population).concat(this.care_object).concat(this.key_population)
      */
     let lebelIds=[];
     this.label_list.list.map(v=>{
          lebelIds = [...lebelIds, ...v.value]
      })
      let mark_list_obj={};
      this.mark_list.map((item, index)=>{
          mark_list_obj[item.field] = item.data.value
      })
      if(mark_list_obj.user_political_affiliation == 1){
          mark_list_obj['user_party_id'] = this.partyId
      } else {
          mark_list_obj['user_party_id'] = 0
      }
      
      let param = {
        pigcms_id: this.pigcmsId,
        post: this.post,
        authentication_field: this.authentication_field,
        user_label_arr: lebelIds,
        mark_list_arr:mark_list_obj,
      }
      let is_must_flage=false;

      for (let ikey in this.authentication_field) {
          let item=this.authentication_field[ikey];
          console.log('item',item);
          if((item.is_must==1 || item.is_must=='1') && (!item.value || item.value=='' || item.value=='0' || item.value==0)){
              this.$message.error('【'+item.title+'】为必填项，请填写或选择！')
              is_must_flage=true;
              break;
          } 
      }
      if(is_must_flage){
          return false;
      }
      this.request(villageApi.editUserInfo, param)
        .then((res) => {
          console.log(res)
          this.$notification.open({
            message: '修改成功',
            description:
              '业主信息修改成功.'
          })
        })
    },
    onDateChange(date, dateSting,key){
        console.log('date',date);
        console.log('dateSting',dateSting);
        this.authentication_field[key]['value']=dateSting;
    },
    getUserInfo (param) {
      this.request(villageApi.getUserInfo, param)
        .then((res) => {
          this.title = '业主信息'
          this.bind_number = res.info.bind_number ? res.info.bind_number : this.usernum
          this.post = {
            name: res.info.name,
            phone: res.info.phone,
            id_card: res.info.id_card,
            ic_card: res.info.ic_card,
            memo: res.info.memo
          }
          this.room_diy_name = res.info.address
          this.housesize = res.info.housesize
          this.house_type_name = res.info.house_type_name
          this.dataList = res.dataList
          this.authentication_field = res.info.authentication_field
          this.user_label_data = res.user_label_data
          this.positionList = res.position_list
          this.carList = res.car_list
          this.visible = true
          if (this.authentication_field['native_place'] !== undefined) {
            this.getProvinceCity('province', 0)
            this.getProvinceCity('city', this.authentication_field['native_place']['province_idss'])
            this.secondCity = this.authentication_field['native_place']['city_name']
          }
          this.mark_list=this.user_label_data.mark_list;
          this.label_list=this.user_label_data.label_list;
          /*
          this.political_outlook = this.getCheckedVlaue(this.user_label_data.political_outlook)[0]
          this.special_population = this.getCheckedVlaue(this.user_label_data.special_population)
          this.key_population = this.getCheckedVlaue(this.user_label_data.key_population)
          this.care_object = this.getCheckedVlaue(this.user_label_data.care_object)
          */
        })
    },
    selectOwnerChange(value){
        console.log('value===>', value)
    },
    radioUserLabelChange(value){
        console.log('value===>', value)
    },
    handleChangeProvince (value) {
      this.is_secondCity = true
      this.authentication_field['native_place']['province_idss'] = value
      this.getProvinceCity('city', value)
    },
    getProvinceCity (type, id) {
      var param = {
        type: type,
        id: id
      }
      this.request(villageApi.getProvinceCity, param)
        .then((res) => {
          if (type === 'province') {
            this.province_list = res
          } else {
            this.city_list = res
            if (this.city_list.length !== 0 && this.is_secondCity) {
              this.secondCity = this.city_list[0]['name']
            }
          }
        })
    },
    getCheckedVlaue (arr) {
      let returnArr = []
      arr.map(value => {
        if (value.is_checked) {
          returnArr.push(value.id)
        }
      })
      return returnArr
    },
    handleChange (value, option) {
      this.authentication_field['native_place']['city_idss'] = value
    }
  }
}
</script>
<style>
.statistical_data{
  margin: 20px 20px;
  padding: 14px 0;
  text-align: center;
  background-color: #eee;
  font-size: 14px;
}
.statistical_fir_p{
  font-size: 16px;
}
.statistical_data p{
  margin: 0 0;
}
.tab_list{
  padding: 14px 0;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ccc;
}
.label{
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 4px;
}

</style>
<style lang="less" scoped>
    .owner_msg{
        .label_con{
            margin-top: 20px;
            display: flex;
            align-items: center;
            margin-left: 20px;
            &:nth-child(1){
                margin-top: 0;
            }
            .title{
                font-weight: bold;
            }
            .choose_con{
                display: flex;
                align-items: center;
                margin-left: 10px;
            }
        }
    }
    
    .user_label{
        .label_con{
            margin-top: 20px;
            display: flex;
            align-items: center;
            margin-left: 20px;
            &:nth-child(1){
                margin-top: 0;
            }
            .title{
                font-weight: bold;
            }
            .radio_con{
                display: flex;
                align-items: center;
                margin-left: 10px;
            }
        }
    }
</style>