<template>
  <a-modal :width="1000" :title="title" :visible="visible_car" :destroyOnClose="true" :maskClosable = "false" :confirm-loading="confirmLoading" @ok="handleOk"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">

        <a-form-item label="车辆类型" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
          <a-col :span="18">
            <a-radio-group  v-decorator="['post.car_type',{ initialValue: post.car_type}]" >
              <a-radio :value="0">汽车</a-radio>
              <a-radio :value="1">电瓶车</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>

        <a-form-item label="车辆号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 30%"
                    v-decorator="['post.province',{ initialValue:post.province,rules: [{ required: true, message: L('请选择省份！') }] }]"
                    placeholder="请选择省份">
            <a-select-option
              v-for="item in city_arr"
              :key="item">
              {{item}}
            </a-select-option>
          </a-select>
            <a-input
              :maxLength="10"
              style="width: 130px"
              placeholder="请输入车牌号"
              v-decorator="['post.car_number',{ initialValue:post.car_number,rules: [{ required: true, message: L('请输入车牌号！') }] }]"
            />
        </a-form-item>

        <a-form-item label="绑定对象" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group  v-decorator="['post.type',{ initialValue:post.type }]" @change="select_type">
              <a-radio :value="0" > {{$store.getters.config.room_name}} </a-radio>
              <a-radio :value="1" >业主</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>

        <a-form-item :label="'绑定'+$store.getters.config.room_name" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type == 0">
          <a-cascader class="cascader_style margin_left_10" :options="options" :load-data="loadDataFunc"
                      :placeholder="room_address" change-on-select @change="setVisionsFunc" />
        </a-form-item>

        <a-form-item label="业主姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type == 1">
          <a-col :span="18">
            <a-input
              :maxLength="10"
              style="width: 300px"
              placeholder="请输入业主姓名"
              v-decorator="['post.name',{ initialValue: post.name,rules: [{ required: false, message: L('请输入业主姓名！') }] }]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="业主手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type == 1">
          <a-col :span="18">
            <a-input-number
              :maxLength="10"
              style="width: 300px"
              placeholder="请输入业主手机号"
              v-decorator="['post.phone',{ initialValue: post.phone,rules: [{ required: false, message: L('请输入业主手机号！') }] }]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="停车卡号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              :maxLength="10"
              style="width: 300px"
              placeholder="请输入停车卡号"
              v-decorator="['post.car_stop_num',{ initialValue: post.car_stop_num,rules: [{ required: false, message: L('请输入停车卡号！') }] }]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="停车到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.end_time != ''">
          <a-date-picker :default-value="moment(post.end_time, dateFormat)" disabled />
        </a-form-item>

        <a-form-item label="停车卡类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 30%"
                    placeholder="请选择停车卡类"
                    v-decorator="['post.temporary_car_type',{ initialValue:post.temporary_car_type,rules: [{ required: true, message: L('请选择停车卡类！') }] }]" >
            <a-select-option
              v-for="item in parking_car_type_arr"
              :key="item">
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="车辆颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 30%"
                    placeholder="请选择车辆颜色"
                    v-decorator="['post.car_color',{ initialValue:post.car_color,rules: [{ required: false, message: L('请输入车辆颜色！') }] }]" >
            <a-select-option
              v-for="item in color_list"
              :key="item.id">
              {{item.lable}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="车辆设备号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              :maxLength="10"
              style="width: 300px"
              placeholder="请输入"
              v-decorator="['post.equipment_no',{ initialValue: post.equipment_no,rules: [{ required: false, message: L('请输入车辆设备号！') }] }]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village'
    import moment from 'moment';
	import store from '@/store';
    export default {
        name: "addCarInfo",
        data(){
            return{
                title: '添加车辆',
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
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible_car:false,//添加车辆
                dateFormat : 'YYYY-MM-DD',
                color_list:[],//车辆颜色列表
                city_arr:[],
                parking_car_type_arr:[],
                position_id:0,
                room_address:'请选择'+store.getters.config.room_name,
                car_number:'',
                type:0,     //0房间 1业主
                options: [],
                post:{
                    equipment_no:'',
                    end_time:'',
                    name:'',
                    phone:'',
                    car_number:'',
                    car_stop_num:'',
                    province:'',
                    car_color:'',
                    temporary_car_type:'',
                    id:0,
                    car_type:0,
                    type:0,
                    room_id:0
                },
            }
        },
        methods:{
            moment,
            add(permission_id){
              if(permission_id){
                this.title = '编辑车辆';
                this.position_id=permission_id;
                this.get_car_detail(permission_id);
              }else{
                this.title = '添加车辆';
                this.post = {
                  equipment_no:'',
                  end_time:'',
                  name:'',
                  phone:'',
                  car_number:'',
                  car_stop_num:'',
                  province:'',
                  car_color:'',
                  temporary_car_type:'',
                  id:0,
                  car_type:0,
                  type:0,
                  room_id:0
                };
                this.position_id=0;
                this.room_address='请选择'+store.getters.config.room_name;
                this.car_number='';
                this.type=0;   //0房间 1业主
              }
              this.get_car_config();
              this.getSingleListByVillage();
              this.visible_car =true;
            },
            //车辆相关参数
            get_car_config(){
                this.request(villageApi.getCarConfig).then((res)=>{
                    this.parking_car_type_arr = res.parking_car_type_arr;
                    this.city_arr = res.city_arr;
                    this.color_list = res.car_color;
                })
            },
            get_car_detail(position_id){
              this.request(villageApi.getCarDetail,{
                position_id:position_id
              }).then((res)=>{
                this.post = res;
                this.type = res.type;
                if(res.room_id>0){
                  this.post.type=0;
                  this.type = 0;
                  this.room_address = res.room_address
                }else{
                  this.post.type=1;
                  this.type = 1;
                }
              })
            },
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;
                setTimeout(function() {
                    targetOption.loading = false;
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc(selectedOptions) {
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.options];
                    const res = await this.getFloorList(selectedOptions[0]);
                    console.log("res", res);
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        options_temp['children'] = children
                        return true;
                    });
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1]);
                    const options_temp = [...this.options];
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2]);
                    const options_temp = [...this.options];
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                    this.options = options_temp
                    console.log("_this.options", this.options)
                }else if(selectedOptions.length == 4){
                  this.post.room_id = selectedOptions[3];
                }
            },
            // 楼栋号
            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        let array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            });
                        });
                        this.options = array
                    }
                });
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        console.log("resolve", resolve)
                        resolve(res);
                    });
                });
            },
            // 楼层
            getLayerList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            // 房间
            getVacancyList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            select_type(e){
                console.log('radio checked', e.target.value);
                this.type = e.target.value;
            },
            handleOk(){
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;
                console.log(this.form);
                validateFields((errors, values) => {
                    if (!errors) {
                        let url=villageApi.addCar;
                        values.post.position_id=this.position_id;
                        values.post.room_id = this.post.room_id;
                        if(values.post.type == 0 && this.post.room_id == 0){
                            this.$message.error('请选择'+store.getters.config.room_name);
                            this.confirmLoading = false;
                            return false;
                        }
                        this.request(url, values)
                            .then((res) => {
                                if (this.post.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                this.$emit('ok')
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this);
                                    this.visible_car = false;
                                    this.confirmLoading = false;
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                });
            },
            handleCancel(){
                this.visible_car = false;
            },
        }
    }
</script>

<style scoped>

</style>