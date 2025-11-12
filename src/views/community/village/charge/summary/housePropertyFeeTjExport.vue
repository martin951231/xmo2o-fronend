<template>
    <div class="account-community-config-info-view">
        <a-row>
            <a-col :span="12" style="text-align: center;">
                <a-form>
                    <a-form-item label="统计表格选择" :required="true">
                        <a-select default-value="1" style="width: 200px" v-model="export_type">
                            <a-select-option :value="1">
                                物业月度收入结转统计
                            </a-select-option>
                            <a-select-option :value="2">
                                物业费收缴率统计
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="选择年月" :required="true" v-if="export_type==1">
                        <a-month-picker placeholder="请选择年月" @change="onMonthChange" />
                    </a-form-item>
                    <a-form-item label="选择计费年月" :required="true" v-if="export_type==2">
                        <a-month-picker placeholder="请选择开始计费年月" @change="onMonth2StartChange" /> ~ <a-month-picker placeholder="请选择结束计费年月" @change="onMonth2EndChange" />
                    </a-form-item>
                </a-form>
                <a-card :bordered="false" style="text-align: center;">
                    <a-button type="primary" style="margin-top: 20px;margin-right: 15px;" @click="handleSubmit()"
                        :loading="loginBtn"> EXCEL 导出 </a-button>

                </a-card>
            </a-col>
        </a-row>

    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import moment from 'moment'
    import {
        Collapse
    } from 'ant-design-vue';

    export default {
        name: 'housePropertyFeeTjExport',
        data() {
            return {
                export_type: 1,
                loginBtn: false,
                select1month: '',
                moment,
                select2startmonth:'',
                select2endmonth:'',
            }
        },
        components: {
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
        },
        activated() {

        },
        mounted() {

        },
        methods: {
            onMonthChange(date, dateString) {
                console.log('date', date);
                console.log('dateString', dateString);
                this.select1month = dateString;
            },
            onMonth2StartChange(date, dateString) {
                this.select2startmonth=dateString;
            },
            onMonth2EndChange(date, dateString) {
                this.select2endmonth=dateString;
            },
            handleSubmit(){
                console.log('export_type', this.export_type);
                this.export_type=this.export_type*1;
                if(this.export_type==1){
                    if(!this.select1month || this.select1month.length<5){
                        this.$message.error('请正确选择选择年月！')
                        return false
                    }
                }else if(this.export_type==2){
                    console.log('select2startmonth', this.select2startmonth);
                    console.log('select2endmonth', this.select2endmonth);
                    if(this.select2startmonth.length<5 && this.select2endmonth.length<5){
                        this.$message.error('请正确选择选择年月！')
                        return false
                    }
                    if(this.select2startmonth.length>0 && this.select2endmonth.length>0){
                        let tmp2start=this.select2startmonth.replace('-','');
                        tmp2start=parseInt(tmp2start);
                        let tmp2end=this.select2endmonth.replace('-','');
                        tmp2end=parseInt(tmp2end);
                        console.log('tmp2start', tmp2start);
                        console.log('tmp2end', tmp2end);
                        if(tmp2end<tmp2start){
                            this.$message.error('结束年月不能小于开始年月，请正确选择选择年月时间！')
                            return false
                        }
                    }
                }
                this.loginBtn = true;
                let postData={};
                postData.export_type=this.export_type;
                postData.type1month=this.select1month;
                postData.type2monthstart=this.select2startmonth;
                postData.type2monthend=this.select2endmonth;
                this.request(villageApi.exportHouseVillageFeeTj, postData)
                  .then((res) => {
                      if(res.url){
                          window.location.href=res.url;
                      }
                       this.loginBtn = false
                  }).catch((error) => {
                     this.loginBtn = false
                })
            }
        }
    }
</script>

<style scoped>
    /deep/ .ant-form-item-control-wrapper {
        display: inline-block;
    }

    .account-community-config-info-view {
        margin: 30px 20px;
        background-color: white;
        padding: 30px;
    }

    .imgname {
        width: 80px;
    }

    .ant-col-12 {
        width: 70%;
    }
</style>
