<template>
    <a-drawer title="编辑" :width="1080" :visible="visible" :maskClosable="false"
              @close="handleCancel" placement="right">

        <a-card>
           <a-spin :spinning="confirmLoading" :height="800">
               <a-form-model ref="ruleForm" :model="post" class="div_box" :labelCol="labelCol"  :rules="rules">
                       <div style="display: flex; flex-wrap: wrap;">
                           <a-form-model-item class="form_item" label="物业编号" :labelCol="labelCol" :required="true">
                                   <a-input
                                       style="width: 250px"
                                       placeholder="请输入物业编号"
                                       autocomplete="off"
                                       name="property_number"
                                       v-model="post.property_number" disabled="disabled"/>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" :label="$store.getters.config.single_name+'名称'" :labelCol="labelCol" :required="true" >
                                   <a-input
                                       style="width: 250px"
                                       :placeholder="'请输入'+$store.getters.config.floor_name+'楼号'"
                                       autocomplete="off"
                                       name="single_name"
                                       v-model="post.single_name" disabled="disabled"  />
                           </a-form-model-item>
                           <a-form-model-item class="form_item" :label="$store.getters.config.floor_name+'名称'" :labelCol="labelCol" :required="true">
                                   <a-input
                                       style="width: 250px"
                                       :placeholder="'请输入'+$store.getters.config.single_name+'名称'"
                                       name="floor_name"
                                       v-model="post.floor_name" disabled="disabled"  />
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="楼层名称" :labelCol="labelCol" :required="true">
                                   <a-input
                                       style="width: 250px"
                                       placeholder="请输入楼层名称"
                                       name="layer_name"
                                       v-model="post.layer_name" disabled="disabled"  />
                           </a-form-model-item>

                           <a-form-model-item class="form_item" label="合同时间" :labelCol="labelCol" :required="true" >
                                <a-date-picker v-if="post.contract_time_start_str" :default-value="moment(post.contract_time_start_str, dateFormat)" v-model="post.contract_time_start_str" style="width: 150px;" /> 
                                <a-date-picker v-model="post.contract_time_start_str" style="width: 150px;" v-else />                   
                                --到-- 
                                <a-date-picker v-if="post.contract_time_end_str" :default-value="moment(post.contract_time_end_str, dateFormat)" disabled="disabled" v-model="post.contract_time_end_str" style="width: 150px;" />
                               <a-date-picker  v-model="post.contract_time_end_str" style="width: 150px;" v-else />
                           </a-form-model-item>
                           
                           <a-form-model-item class="form_item" :label="$store.getters.config.room_name+'号'" :labelCol="labelCol" prop="room" :required="true">
                                   <a-input
                                       style="width: 250px;"
                                       :placeholder="'请输入'+$store.getters.config.room_name+'号'"
                                       name="room"
                                       v-model="post.room" />
                           </a-form-model-item>
                           
                           <a-form-model-item class="form_item" :label="$store.getters.config.room_name+'编号'" :labelCol="labelCol" extra="必填项（仅限1-9999不重复的数字）" prop="room_number" :required="true">
                                   <a-input
                                       style="width: 250px;"
                                       :placeholder="'请输入'+$store.getters.config.room_name+'编号'"
                                       name="room_number"
                                       v-model="post.room_number"/>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="房屋面积" :labelCol="labelCol" prop="housesize" :required="true">
                                   <a-input-number
                                       style="width: 250px;"
                                       placeholder="请输入房屋面积"
                                       :min="0"
                                       :step="0.01"
                                       :precision="2"
                                       name="housesize"
                                       v-model="post.housesize"
                                      />
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="房屋类型" :labelCol="labelCol" >
                                <a-select placeholder="请选择房屋类型" style="width: 250px" v-model="post.house_type" :default-value="post.house_type">
                                    <a-select-option value="0">无</a-select-option>
                                    <a-select-option value="1">住宅</a-select-option>
                                    <a-select-option value="2">商铺</a-select-option>
                                    <a-select-option value="3">办公</a-select-option>
                                </a-select>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" :label="$store.getters.config.room_name+'户型'" :labelCol="labelCol">
                               <a-select :placeholder="'请选择'+$store.getters.config.room_name+'户型'" style="width: 250px" v-model="post.room_type" :default-value="post.room_type">
                                    <a-select-option value="0">无</a-select-option>
                                    <a-select-option :value="item1.type_id" v-for="(item1,index1) in room_types">
                                      {{ item1.type_name }}
                                    </a-select-option>
                                </a-select>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="使用状态" :labelCol="labelCol" extra="仅供标记使用，不会自动变化的，需要自行编辑维护" >
                                <a-select placeholder="请选择使用状态" style="width: 250px" v-model="post.user_status" :default-value="post.user_status">
                                    <a-select-option value="0">无</a-select-option>
                                    <a-select-option value="1">业主入住</a-select-option>
                                    <a-select-option value="2">未入住</a-select-option>
                                    <a-select-option value="3">租客入住</a-select-option>
                                </a-select>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="出售状态" :labelCol="labelCol" extra="仅供标记使用，不会自动变化的，需要自行编辑维护">
                             <a-select placeholder="请选择出售状态" style="width: 250px" v-model="post.sell_status" :default-value="post.sell_status">
                                 <a-select-option value="1">正常居住</a-select-option>
                                 <a-select-option value="2">出售中</a-select-option>
                                 <a-select-option value="3">出租中</a-select-option>
                             </a-select>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="排序" :labelCol="labelCol" extra="数字越大越靠前">
                                   <a-input-number
                                       style="width: 250px;"
                                       placeholder="请输入排序值"
                                       name="sort"
                                       :min="0"
                                       v-model="post.sort"/>
                           </a-form-model-item>
                           <a-form-model-item class="form_item" label="状态" :labelCol="labelCol">
                                <a-radio-group :default-value="post.status*1>0 ? '1':'0'"  @change="statusChange">
                                    <a-radio value="1">开启</a-radio>
                                    <a-radio value="0">关闭</a-radio>
                                </a-radio-group>
                           </a-form-model-item>
                       </div>
                </a-form-model>
           </a-spin>
        </a-card>
        
          <a-card :bordered="false" style="text-align: center;" >
              <a-button  type="primary" style="margin-top: 20px;margin-right: 15px;" @click="handleSubmit()" :loading="loading">保存数据</a-button>
              <a-button @click="handleCancel()"> 关闭当前页 </a-button>
          </a-card>

    </a-drawer>
</template>
<script>
    let timer_2 = null;
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import moment from 'moment'
	import store from '@/store';
    const columns = [

    ];
    const data = [];
    export default {
        name: 'houseWorkerEdit',
        filters: {

        },
        components:{
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                  xs: {
                    span: 10
                  },
                  sm: {
                    span:4
                  }
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
               dateFormat: 'YYYY-MM-DD',
               rules: {
                   room: [{
                       required: true,
                       message: '请输入'+store.getters.config.room_name+'号',
                       trigger: 'blur'
                   }],
                   room_number: [{
                       required: true,
                       message: '请输入'+store.getters.config.room_name+'编号',
                       trigger: 'blur'
                   }],
                   housesize: [{
                       required: true,
                       message: '请输入房屋面积',
                       trigger: 'blur'
                   }],
               },
               post:{
                    property_number:'',
                    single_name:'',
                    floor_name:'',
                    layer_name:'',
                    contract_time_start_str:'',
                    contract_time_end_str:'',
                    room:'',
                    room_number:'',
                    housesize:'',
                    house_type:'0',
                    room_type:'0',
                    user_status:'0',
                    sell_status:'1',
                    sort:0,
                    status:'1',
               },
                room_types:[],
                record:{},
                pigcms_id:0,
                visible_img: false,
                confirmLoading:false,
   
            };
        },
        activated () {

        },
        methods: {
            moment,
            edit(record){
                this.record=record;
                this.pigcms_id=this.record.pigcms_id;
                this.visible = true;
                this.getRoomVacancyDetail();
            },
            getRoomVacancyDetail(){
                let postData={};
                postData.pigcms_id=this.pigcms_id;
                this.request(villageApi.getUnitRentalRoomDetail, postData)
                    .then((res) => {
                        this.post=res.roominfo
                        this.room_types=res.room_types
                    })
            },
            statusChange(e){
                console.log(e);
                this.post.status=e.target.value;
            },
            handleSubmit() {
                    if(!this.post.room || this.post.room.length<1){
                        this.$message.error('请输入'+store.getters.config.room_name+'号!');
                        return false;
                    }
                    if(!this.post.room_number || this.post.room_number.length<1){
                        this.$message.error('请输入'+store.getters.config.room_name+'编号!');
                        return false;
                    }
                    /*
                    let phoneReg =/^1[23456789]\d{9}$/
                    if(!phoneReg.test(this.post.phone)){
                        this.$message.error('手机号格式不正确！');
                         return false;
                    }
                    */
                    if(!this.post.housesize || this.post.housesize.length<1){
                        this.$message.error('请输入房屋面积!');
                        return false;
                    }
                    this.post.pigcms_id=this.pigcms_id;
                    this.loading = true;
                    this.request(villageApi.saveUnitRentalRoomEdit,this.post)
                        .then((res) => {
                            this.loading = false
                            this.$message.success('保存成功!');
                            setTimeout(() => {
                                   this.handleCancel();
                                   this.$emit('ok')
                           }, 1500)
                        }).catch(error => {
                            this.loading = false
                        })
                   
            },
            handleCancel() {
              this.visible = false;
              this.record={};
              this.pigcms_id=0;
              this.post={
                    property_number:'',
                    single_name:'',
                    floor_name:'',
                    layer_name:'',
                    contract_time_start_str:'',
                    contract_time_end_str:'',
                    room:'',
                    room_number:'',
                    housesize:'',
                    house_type:'0',
                    room_type:'0',
                    user_status:'0',
                    sell_status:'1',
                    sort:0,
                    status:'1',
               },
              setTimeout(() => {
                this.form = this.$form.createForm(this)
              }, 500)
            },
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return '';
                }
                return moment(time, dateFormat)
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                }
            },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            this.search.begin_time=dateString['0'];
            this.search.end_time=dateString['1'];
          },

            //关闭二维码弹出层
            handleImgCancel(){
                this.visible_img = false;
                this.srcUrl = '';
                clearInterval(timer_2)
                this.$emit('ok')
            },

        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
    // 公共样式
    .margin_top_10 {
      margin-top: 10px;
    }
    .flex_text_box {
        display: flex;
        flex-direction: row;
        align-items: center;
    
        .text_1 {
            flex-shrink: 0;
        }
    }
  .form_item{
      width: 50%;
  }
  /deep/ .ant-form-extra{
      margin-left:30px;
  }

</style>