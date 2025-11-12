<template>
    <a-modal :title="title" :width="640" :visible="visible" @cancel="handleCancel">
        <div class="detail-content" id="print_table">
            <!--<a-row style="padding-left: 20px;">
                <a-col :span="24">更新时间：{{data.update_time}}</a-col>
            </a-row>-->
            <div style="width: 100%;text-align: left;color: lightgrey;">
                更新时间：{{data.update_time}}
            </div>
            <div style="width: 100%;text-align: left;font-size: 15px;font-weight: bold;">
                基本信息
            </div>
            <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;padding-top: 15px;">
                <div style="position: absolute;z-index: 100;right:50px;top:100px;">
                    <img :src="data.base_msg.avatar"
                         style="border-radius: 50%">
                </div>
                <div style="width: 150px;display: inline;text-align: center;">
                    姓名
                </div>
                <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                    {{data.base_msg.name}}
                </div>
            </div>
            <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                <div style="width: 150px;display: inline;text-align: center;">
                    性别
                </div>
                <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                    {{data.base_msg.sex}}
                </div>

                <div style="width: 150px;display: inline;text-align: center;">
                    年龄
                </div>
                <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                    {{data.base_msg.age}}
                </div>
            </div>
            <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                <div style="width: 150px;display: inline;text-align: center;">
                    工作经验
                </div>
                <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                    {{data.base_msg.work_time}}
                </div>
            </div>
            <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                <div style="width: 150px;display: inline;text-align: center;">
                    电话
                </div>
                <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                    {{data.base_msg.phone}}
                </div>
            </div>
            <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                <div style="width: 150px;display: inline;text-align: center;">
                    邮箱
                </div>
                <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                    {{data.base_msg.email}}
                </div>
            </div>

            <div style="width: 100%;text-align: left;font-size: 15px;font-weight: bold;"
                 v-if="data.education_history.length">
                教育经历
            </div>
            <div v-for="item in data.education_history" :key="item.id">
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        {{item.education_time}}
                    </div>
                    <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        {{item.school_name}}
                    </div>

                    <div style="width: 150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        {{item.education}}
                    </div>
                    <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        {{item.education_cate}}
                    </div>
                </div>
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        {{item.profession_name}}
                    </div>
                </div>
            </div>

            <div style="width: 100%;text-align: left;font-size: 15px;font-weight: bold;"
                 v-if="data.work_history.length">
                工作经历
            </div>
            <div v-for="item in data.work_history" :key="item.id">
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        {{item.job_time}}
                    </div>
                    <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        {{item.job_name}}
                    </div>
                </div>
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        {{item.company_name}}
                    </div>
                    <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        {{item.ind_id}}
                    </div>
                    <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        下属{{item.branch_number}}
                    </div>
                </div>
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        工作描述
                    </div>
                </div>
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    {{item.job_desc}}
                </div>
            </div>
            <div style="width: 100%;text-align: left;font-size: 15px;font-weight: bold;"
                 v-if="data.project_history.length">
                项目经历
            </div>
            <div v-for="item in data.project_history" :key="item.id">
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        {{item.pro_time}}
                    </div>
                    <div style="width:150px;display: inline;text-align: center;padding-left: 30px;padding-right: 30px;">
                        {{item.project_name}}
                    </div>
                </div>
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    <div style="width: 150px;display: inline;text-align: center;">
                        项目描述
                    </div>
                </div>
                <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;">
                    {{item.pro_desc}}
                </div>
            </div>

            <div style="width: 100%;text-align: left;font-size: 15px;font-weight: bold;"
                 v-if="data.evaluate">
                自我评价
            </div>
            <div style="width: 100%;padding-left: 20px;padding-bottom: 15px;" v-if="data.evaluate">
                {{data.evaluate}}
            </div>
            <!--<a-card title="基本信息" :bordered="false">
                <div style="position: absolute;z-index: 100;right:0px;top:80px;">
                    <img src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJfqib1ZGWyxTSZORaSvnOPuPXs3DtOSIAibEia4D3JquDiasIL09OksJscKk8mmN7Yx29zOQxcaxXpxA/132"
                         style="border-radius: 50%">
                </div>
                <a-row class="mb-20">
                    <a-col :span="3">姓名</a-col>
                    <a-col :span="6">
                        {{data.base_msg.name}}
                    </a-col>
                </a-row>
                <a-row class="mb-20">
                    <a-col :span="3">性别</a-col>
                    <a-col :span="6">
                        {{data.base_msg.sex}}
                    </a-col>
                    <a-col :span="3">年龄</a-col>
                    <a-col :span="6">
                        {{data.base_msg.age}}
                    </a-col>
                </a-row>
                <a-row class="mb-20">
                    <a-col :span="3">工作经验</a-col>
                    <a-col :span="6">
                        {{data.base_msg.work_time}}
                    </a-col>
                </a-row>
                <a-row class="mb-20">
                    <a-col :span="3">电话</a-col>
                    <a-col :span="6">
                        {{data.base_msg.phone}}
                    </a-col>
                </a-row>
                <a-row class="mb-20">
                    <a-col :span="3">邮箱</a-col>
                    <a-col :span="6">
                        {{data.base_msg.email}}
                    </a-col>
                </a-row>
            </a-card>-->
            <!-- <a-card title="教育经历" :bordered="false" v-if="data.education_history.length">
                 <a-row class="mb-20" v-for="item in data.education_history" :key="item.id">
                     <a-row>
                         <a-col :span="6">{{item.education_time}}</a-col>
                         <a-col :span="4">
                             {{item.school_name}}
                         </a-col>
                         <a-col :span="4">
                             {{item.education}}
                         </a-col>
                         <a-col :span="3">
                             {{item.education_cate}}
                         </a-col>
                         <a-col :span="24" style="padding-top: 20px;" v-if="item.profession_name">
                             {{item.profession_name}}
                         </a-col>
                     </a-row>
                 </a-row>
             </a-card>-->

           <!-- <a-card title="工作经历" :bordered="false" v-if="data.work_history.length">
                <a-row class="mb-20" v-for="item in data.work_history" :key="item.id">
                    <a-col :span="24">
                        <a-col :span="10">{{item.job_time}}</a-col>
                        <a-col :span="4">{{item.job_name}}</a-col>
                    </a-col>
                    <a-col :span="24">
                        <a-col :span="10">{{item.company_name}}</a-col>
                        <a-col :span="4">{{item.ind_id}}</a-col>
                        <a-col :span="4">下属{{item.branch_number}}</a-col>
                    </a-col>
                    <a-col :span="24">
                        <a-col :span="10">工作描述</a-col>
                    </a-col>
                    <a-col :span="24">
                        {{item.job_desc}}
                    </a-col>
                </a-row>
            </a-card>-->

            <!--<a-card title="项目经历" :bordered="false" v-if="data.project_history.length">
                <a-row class="mb-20" v-for="item in data.project_history" :key="item.id">
                    <a-col :span="24">
                        <a-col :span="10">{{item.pro_time}}</a-col>
                        <a-col :span="10">{{item.project_name}}</a-col>
                    </a-col>
                    <a-col :span="24">
                        <a-col :span="10">项目描述</a-col>
                    </a-col>
                    <a-col :span="24">
                        {{item.pro_desc}}
                    </a-col>
                </a-row>
            </a-card>

            <a-card title="自我评价" :bordered="false" v-if="data.evaluate">
                <a-col :span="24">
                    {{data.evaluate}}
                </a-col>
            </a-card>-->
        </div>
        <template slot="footer">
            <a-button key="back" @click="print">{{ L('打印') }}</a-button>
            <a-button key="submit" type="primary" @click="handleSubmit">{{ L('关闭') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
    import recruitMerchantApi from '@/api/recruit/platform/index'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    import print from 'print-js';

    export default {
        name: "jobResume",
        components: {ACol, ARow},
        data() {
            return {
                title: "人员简历",
                visible: false,
                data: {
                    update_time: "",
                    base_msg: {
                        name: "",
                        sex: "",
                        age: "",
                        work_time: "",
                        phone: "",
                        email: "",
                        avatar: "",
                        address: "",
                    },
                    education_history: [],
                    work_history: [],
                    project_history: [],
                    evaluate: ""
                },
            }
        },
        methods: {
            getList(id) {
                this.visible = true
                this.data = []
                let param = {
                    id: id
                }
                this.request(recruitMerchantApi.getResumeMsg, param).then((res) => {
                    this.data = res
                    this.detail.desc = decodeURIComponent(res.desc)
                })
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.visible = false
            },
            print() {
                const style = '@page {  } ' + '@media print { }';
                printJS({
                    printable: 'print_table',// 标签元素id
                    type: 'html',
                    targetStyles: ['*'],
                    maxWidth: '100%',
                    style: style,
                    scanStyles: false
                })
            },
        }
    }
</script>

<style scoped>

</style>