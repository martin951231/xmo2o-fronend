<template>
    <a-modal title="添加车辆进出纪录" :width="500" :visible="openGateVisible" :maskClosable="false" @ok="handleOpenGateOk" @cancel="handleOpenGateCancel" >
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
            <div class="add_black">
                <a-form-model-item label="车牌号" :required="true">
                    <a-input v-model="openGate.car_number" placeholder="请输入车牌号"></a-input>
                </a-form-model-item>
                <a-form-model-item label="通行时间"  :required="true">
                    <a-date-picker
                        :show-time="{ format: 'HH:mm:ss' }"
                        :format="dateFormat"
                        :value="dateValue"
                        placeholder="请选择时间"
                        @change="onChangeTime">
                    </a-date-picker>
                </a-form-model-item>
                <a-form-model-item label="停车时长" prop="park_time" v-if="pay_show">
                    <a-input v-model="openGate.park_time" placeholder="请输入停车时长（单位：分钟）"></a-input>
                </a-form-model-item>
                <a-form-model-item label="停车费用" prop="price" v-if="pay_show">
                    <a-input v-model="openGate.price" placeholder="请输入停车费用（单位：元）"></a-input>
                </a-form-model-item>
                <a-form-model-item label="用户姓名" prop="username" >
                    <a-input v-model="openGate.username" placeholder="请输入用户姓名"></a-input>
                </a-form-model-item>
                <a-form-model-item label="用户手机号" prop="phone" >
                    <a-input v-model="openGate.phone" placeholder="请输入用户手机号"></a-input>
                </a-form-model-item>
                <a-form-item label="图片上传">
                    <a-upload
                        name="img"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :action="upload_url"
                        :before-upload="beforeUpload"
                        @change="imgChange"
                        v-model="openGate.img"
                     >
                        <img v-if="imgUrl" :src="imgUrl" class="imgname" alt="img" />
                        <div v-else>
                            <a-icon :type="uploadLoading ? 'uploadLoading' : 'plus'" />
                            <div class="ant-upload-text">
                                上传
                            </div>
                        </div>
                    </a-upload>
                </a-form-item>
            </div>
        </a-form-model>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
    import moment from "moment";
    import streetCommunityApi from "@/api/community/streetCommunity";
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        name: "addParkInfo",
        data() {
            return {
                moment,
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                park_open_show:false,
                pay_show:true,
                openGateVisible:false,
                dateFormat: 'YYYY-MM-DD HH:mm:ss',
                dateValue:'',
                uploadLoading:false,
                upload_url:'/v20/public/index.php/'+streetCommunityApi.uploadMeeting,
                imgUrl:'',
                openGate:{
                    id:'',
                    passage_direction:'',
                    car_number:'',
                    username:'',
                    price:'',
                    park_time:'',
                    phone:'',
                    accessTime:'',

                },
            }
        },

        mounted(){
        },

        methods: {
            add(id,passage_direction){
                this.openGate.id=id
                this.openGate.passage_direction=passage_direction
                this.openGate.car_number=''
                this.openGate.username=''
                this.openGate.price=''
                this.openGate.park_time=''
                this.openGate.phone=''
                this.openGate.accessTime=''
                this.openGate.img=''
                this.imgUrl=''
                if (passage_direction==1){
                    this.pay_show=false
                }else{
                    this.pay_show=true
                }
                this.dateValue=''
               this. openGateVisible=true
            },
            imgChange(info) {
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imgUrl = imageUrl;
                        this.uploadLoading = false;
                    });
                    if(info.file.response.status === 1000)
                    {
                        this.openGate.img = info.file.response.data;
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('图片仅支持png/jpg');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片必须小于2MB');
                }
                return isJpgOrPng && isLt2M;
            },
            onChangeTime (date, dateString) {
                console.log(dateString)
                console.log(date)
                const d1 = dateString;
                const d2 =  new Date();
                if ((new Date(d1.replace(/-/g, '/'))) > d2) {
                    this.$message.error('车辆进出场时间不能大于当前时间')
                    return false;
                }
                this.dateValue = date
                this.openGate.accessTime=dateString

            },
            handleOpenGateOk(){
                let that = this
                console.log('addParkInfo',that.openGate)
                that.request('community/village_api.Parking/addParkInfo', that.openGate).then((res) => {
                    if(res != '0'){
                        that.$message.success('登记成功！')
                    } else{
                        that.$message.error('登记失败！')
                    }
                    that.openGateVisible = false;
                    that.openGate.passage_direction='';
                    that.openGate.accessTime='';
                    that.openGate.car_number='';
                    that.openGate.id='';
                })
            },
            handleSelectChange(value, type) {
                this.openGate[type] = value
                this.$forceUpdate()
            },

            handleOpenGateCancel(){
                this.openGate.id=''
                this.openGate.passage_direction=''
                this.openGate.car_number=''
                this.openGate.username=''
                this.openGate.price=''
                this.openGate.park_time=''
                this.openGate.phone=''
                this.openGate.accessTime=''
                this.openGateVisible = false
            },
        },
    }
</script>

<style scoped>
    .imgname{
        width: 100px;
    }
</style>