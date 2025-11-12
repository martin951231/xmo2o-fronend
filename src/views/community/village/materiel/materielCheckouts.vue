<template>
    <div class="app-materiel-checkouts-box">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-form :form="form" style="margin-bottom: 45px">
                <a-form-item label="领用人" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <a-select show-search :filter-option="filterOption" style="width: 300px" placeholder="请选择领用人" v-model="dataForm.receive_id" @change="handleChange">
                            <a-select-option :value="item.wid" v-for="(item,index) in work_list" :key="index">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-form-item>
                <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <a-input style="width: 300px" v-model="dataForm.receive_phone" placeholder="请填写联系方式" />
                    </a-col>
                </a-form-item>
                <a-form-item label="领取数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <div v-for="(item2,index2) in receiveTypeArr" :key="index2">
                            <div>
                                <a-select show-search :filter-option="filterOption" style="width: 150px" placeholder="请选择领用物料类型" v-model="receiveTypeArr[index2]['type_id']" @change="handleChangeType(index2)">
                                    <a-select-option :value="item3.type_id" v-for="(item3,index3) in type_msg_list" :key="index3">
                                        {{ item3.type_name }}
                                    </a-select-option>
                                </a-select>
                                <a-input style="width: 200px" v-model="receiveTypeArr[index2]['receive_num']" placeholder="请填写大于0的领取数量" />
                                <a-button type="primary" style="margin-left: 10px" v-if="index2 == 0" @click="addReceiveType()">添加</a-button>
                                <a-button type="danger" style="margin-left: 10px" v-else @click="deleteReceiveType(index2)">删除</a-button>
                            </div>
                            <div>
                                <a-textarea
                                    v-model="receiveTypeArr[index2]['remark']"
                                    placeholder="请输入备注"
                                    :auto-size="{ minRows: 3, maxRows: 5 }"
                                />
                            </div>
                        </div>
                        
                    </a-col>
                </a-form-item>
                <a-form-item label="领取时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <a-date-picker show-time placeholder="请选择领取时间" v-model="dataForm.receive_time_date" @change="onChange"/>
                    </a-col>
                </a-form-item>
            </a-form>
            <div style="width: 100%;position: fixed;bottom: 20px;left: 0;text-align: center;">
                <a-button type="primary" style="margin-left: 10px" @click="materielCheckoutsAdd()">保存</a-button>
            </div>
        </a-spin>
    </div>
</template>
<style>
    .app-materiel-checkouts-box {
        padding: 24px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
  
     export default {
        data () {
            return {
                confirmLoading: false,
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 7}
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 13}
                },
                dataForm: {
                    receive_id: null,
                    receive_name: '',
                    receive_phone: '',
                    receive_time: '',
                    type: [],
                    receive_time_date: null
                },
                receiveTypeArr: [
                    {'type_id': null, 'receive_num': '', 'remark': ''}
                ],
                work_list: [],
                work_column: [],
                village_id: 0,
                type_msg_list: [],
                typeChooseBox: [],
            }
        },
        mounted() {
            this.village_id = this.$route.query.village_id
            this.getWorks(this.village_id);
            this.commonGetTypeMsgList(this.village_id);
        },
        methods: {
            materielCheckoutsAdd() {
                let that = this
                that.confirmLoading = true;
                console.log('receiveTypeArr', this.receiveTypeArr)
                that.dataForm.type = this.receiveTypeArr;
                that.dataForm.village_id = this.village_id;
                that.dataForm.tokenName = 'village__access_token';
                console.log('dataForm', this.dataForm)
                if (! that.dataForm.receive_id) {
                    this.$message.warning('请选择领用人！')
                    that.confirmLoading = false;
                    return false;
                }
                if (! that.dataForm.receive_time) {
                    this.$message.warning('请选择领取时间！')
                    that.confirmLoading = false;
                    return false;
                }
                if (! that.dataForm.type) {
                    this.$message.warning('最少填写一个物料类别领取数量！')
                    that.confirmLoading = false;
                    return false;
                }

                this.request(villageApi.commonMaterielCheckoutsAdd, this.dataForm)
                .then((res) => {
                    console.log('res', res)
                    that.confirmLoading = false;
                    setTimeout(() => {
                        that.confirmLoading = false;
                        let index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    }, 1500)
                    }).catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleChangeType(index){
                let type_id = this.receiveTypeArr[index]['type_id'];
                console.log('index', index);
                console.log('type_id', type_id);
                /*
                if (type_id && this.typeChooseBox && this.typeChooseBox[type_id]) {
                    this.$message.warning('不能选择相同的物料[类别]！')
                    this.receiveTypeArr[index]['type_id'] = null
                } else {
                    this.typeChooseBox[type_id] = 1
                }
                */
            },
            // 日期选择
            onChange(date, dateString) {
                console.log('日期选择', date, dateString);
                this.dataForm.receive_time = dateString;
            },
            addReceiveType() {
                this.receiveTypeArr.push({'type_id': null, 'receive_num': '', 'remark': ''});
            },
            deleteReceiveType(index) {
                this.receiveTypeArr.splice(index, 1);
            },
            handleChange(value) {
                console.log(`selected ${value}`);
                this.dataForm.receive_name = this.work_column && this.work_column[value] && this.work_column[value]['name'] ? this.work_column[value]['name'] : '';
                this.dataForm.receive_phone = this.work_column && this.work_column[value] && this.work_column[value]['phone'] ? this.work_column[value]['phone'] : '';
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            getWorks(village_id) {
                let that = this;
                this.request(villageApi.commonGetWorks, {village_id : village_id, 'tokenName': 'village__access_token'})
                .then((res) => {
                    that.work_list = res.work_list
                    that.work_column = res.work_column
                })
            },
            commonGetTypeMsgList(village_id) {
                let that = this;
                this.request(villageApi.commonGetTypeMsgList, {village_id : village_id, 'tokenName': 'village__access_token'})
                .then((res) => {
                    that.type_msg_list = res.type_msg_list
                })
            },
        }
     }

</script>