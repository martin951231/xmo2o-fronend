<template>
  <a-modal :width="1000" :title="title" :visible="visible_director" :maskClosable = false :confirm-loading="confirmLoading"
           @cancel="handleCancel" @ok="handleOk">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">

        <a-form-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 30%"
                    placeholder="请选择"
                    v-model="name"
                    @change="select_director"
          >
            <a-select-option
              v-for="item in work_list"
              :key="item">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="负责人手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              :maxLength="10"
              style="width: 300px"
              v-model="phone"
              disabled="disabled"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="提醒时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>将在每月</span>&nbsp;&nbsp;
          <a-select default-value="1" style="width: 120px"  v-model="day">
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
          <span>日</span>
          <a-time-picker format="HH:mm"  @change="onChange" :value="moment(dateDay, 'HH:mm')" />
          <span>发送模板消息给工作人员</span>
        </a-form-item>

        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
          <a-col :span="18">
            <a-radio-group  v-model="status">
              <a-radio value="1">正常</a-radio>
              <a-radio value="2">禁止</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import { getSystemName } from '@/utils/util';
    export default {
        data(){
            return {
                visible_director:false,
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
                project_id:0,
                dateFormat : 'YYYY-MM-DD',
                dateDay: '09:00',
                day:1,
                title:'添加负责人',
                work_list :[],
                worker_id:'',
                phone:'',
                status:"1",
                time:'2021-7-30',
                name:'',
                id:0,
                tokenName:'',
                sysName: '',
            }
        },
        methods:{
            onChange(date, dateString) {
                if (date== null){
                    dateString='00:00'
                }
                this.dateDay = dateString;
                this.$forceUpdate()
            },
            select_director(value){
                this.phone = value.phone;
                this.worker_id = value.wid;
                this.name = value.name;
            },
            moment,
            add(project_id){
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.name = '';
                this.phone = '';
                this.worker_id = 0;
                this.dateDay= '09:00';
                this.day=1;
                this.status="1";

                this.title = '添加负责人';
                this.project_id = project_id;
                this.getWorkers();
                this.visible_director = true;
                this.id = 0;
            },
            edit(project_id,id){
                let sysName = getSystemName(location.hash);
                if (sysName) {
                  this.tokenName = sysName + '_access_token';
                  this.sysName = sysName;
                } else {
                  this.sysName = 'village';
                }
                this.title = '编辑负责人';
                this.project_id = project_id;
                this.id = id;
                this.getWorkers();
                this.getWorkerInfo();
                this.visible_director = true;
            },
            getWorkerInfo(){
                this.request(villageApi.getWorkerInfo,{
                    id:this.id,
                    tokenName: this.tokenName
                }).then((res)=>{
                    this.status = res.status;
                    this.name = res.name;
                    this.phone = res.phone;
                    this.worker_id = res.worker_id;
                    this.dateDay = res.dateDay;
                    this.day = res.day;
                })
            },
            getWorkers(){
                this.request(villageApi.getWorkers,{
                    tokenName: this.tokenName
                }).then((res)=>{
                    this.work_list = res;
                })
            },
            handleCancel(){
                this.visible_director = false;
            },
            handleOk(){
                if(this.id>0){
                    this.request(villageApi.saveMeterDirector,{
                        id:this.id,
                        worker_id:this.worker_id,
                        name:this.name,
                        phone:this.phone,
                        status:this.status,
                        dateDay:this.dateDay,
                        day:this.day,
                        tokenName: this.tokenName
                    }).then((res)=>{
                        this.$message.success('修改成功');
                        this.$emit('getMeterDirectorList');
                        this.visible_director = false;
                    })
                }else{
                    this.request(villageApi.addMeterDirector,{
                        project_id:this.project_id,
                        worker_id:this.worker_id,
                        name:this.name,
                        phone:this.phone,
                        status:this.status,
                        dateDay:this.dateDay,
                        day:this.day,
                        tokenName: this.tokenName
                    }).then((res)=>{
                        this.$message.success('添加成功');
                        this.$emit('getMeterDirectorList');
                        this.visible_director = false;
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>