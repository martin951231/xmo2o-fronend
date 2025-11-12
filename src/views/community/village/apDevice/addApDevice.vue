<template>
    <a-modal :title="title" :width="600"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form">
                    <a-form-item label="设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                        <a-col :span="24" >
                            <a-input placeholder="请输入设备类型" v-model="post.ac_type" :disabled="true"/>
                        </a-col>
                    </a-form-item>
                    <a-form-item label="设备编号" :labelCol="labelCol" :wrapperCol="wrapperCol"  :required="true">
                        <a-col :span="24" >
                            <a-select default-value="0" style="width: 300px" placeholder="请选择设备编号" v-model="post.ac_num">
                                <a-select-option :value="item.id" v-for="(item,index) in device_list" :key="index">
                                    {{ item.ac_series }}
                                </a-select-option>
                            </a-select>
                        </a-col>
                    </a-form-item>
                <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-col :span="24" >
                        <a-input placeholder="请输入设备名称" v-model="post.ac_name" />
                    </a-col>
                </a-form-item>
                <a-form-item label="设备位置" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-col :span="10" >
                        <a-select default-value="1" style="width: 120px" :placeholder="'请选择'+$store.getters.config.single_name+'或公共区域'" v-model="post.area_type" @change="getAreaList()">
                            <a-select-option value="1">
                               公共区域
                            </a-select-option>
                            <a-select-option value="2">
								{{$store.getters.config.single_name}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="10" >
                        <a-select default-value="0" style="width: 175px" placeholder="请输入位置" v-model="post.ac_area">
                            <a-select-option :value="item.id" v-for="(item,index) in area_list" :key="index">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-form-item>
                <a-form-item label="启用时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true" >
                    <a-col :span="24" >
                        <a-date-picker  style="width: 300px" format="YYYY-MM-DD"   @change="dayOnChange"  placeholder="请选择日期" v-if="visible" />
                    </a-col>
                </a-form-item>
                <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="24" >
                        <a-textarea  :maxLength="200" placeholder="请输入备注,文字不超过200个字" v-model="post.remark" />
                    </a-col>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
</style>
<script>
    import villageApi from '@/api/community/village';
    import moment from 'moment';
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
                area_list:[],
                device_list:[],
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                post:{
                    id:0,
                    ac_type:'无线AP',
                    ac_name:'',
                    ac_num:'',
                    ac_area:'',
                    area_type:'1',
                    use_time:'',
                    last_time:'',
                    remark:'',
                },
            }
        },
        methods: {
            moment,
            // 开始日期切换，重新赋值
            dayOnChange(date, dateString) {
                console.log('date', date)
                console.log('dateString', dateString)
                if (date==null){
                    this.post.use_time=''
                }
                this.post.use_time = dateString;
                this.$forceUpdate()
            },
            add() {
                this.title = '添加';
                this.visible = true;
                this.post = {
                        id:0,
                        ac_type:'无线AP',
                        ac_name:'',
                        ac_num:'',
                        ac_area:'',
                        area_type:'1',
                        use_time:'',
                        last_time:'',
                        remark:'',
                };
                this.getAreaList();
                this.getAddDeviceList();
            },
            getAddDeviceList(){
                this.request(villageApi.getAddDeviceList).then((res) => {
                    if (res){
                        console.log('Addres11111',res);
                        this.device_list=res
                    }
                });
            },
            getAreaList(){
                console.log('area_type',this.post.area_type)
                this.request(villageApi.getAddressList,{type:this.post.area_type}).then((res) => {
                    if (res){
                        console.log('res11111',res);
                        this.area_list=res.list
                        this.post.ac_area='';
                    }
                });
            },
            handleSubmit() {
                let that = this
                this.request(villageApi.addDevice,this.post).then((data) => {
                    if (data){
                        that.$message.success('添加成功');
                        this.visible = false
                        this.form = this.$form.createForm(this)
                        this.$emit('ok')
                    }
                });
            },
            handleCancel() {
                this.visible = false,
                setTimeout(() => {
                    this.post.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },

        },
    }
</script>
