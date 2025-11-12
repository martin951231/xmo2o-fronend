<template>
    <a-drawer title="电动车缴费" :width="850" :visible="visible" :maskClosable="false" @close="handleCancel"
        placement="right">

        <a-card>
            <a-form :form="form">
                
                <a-form-item label="用户姓名搜索" :labelCol="labelCol" :required="true" extra="从搜到的下拉框中选择一条数据">
                    <a-select show-search placeholder="请输入要搜索的姓名" v-model.trim="search_keyword" style="width: 300px"
                        autocomplete="off" :default-active-first-option="false" :show-arrow="false"
                        :filter-option="false" :not-found-content="null" :auto-focus="false"
                        @search="handleSearch" @change="searchOptionChange" @blur="handleSearchBlur"
                        @focus="handleSearchFocus">
                        <a-select-option v-for="(d,index) in search_data" :key="index">
                            {{ d.name }}
                        </a-select-option>
                    </a-select>

                </a-form-item>

                <a-form-item label="非机动车卡" :labelCol="labelCol" :required="true" extra="先通过用户姓名搜索到数据,再来选择卡号">
                    <a-select style="width: 300px" placeholder="请选择卡号" v-model="post.card_no"
                        @change="calculationNmvCost">
                        <a-select-option v-for="item in card_list" :key="item.nmv_card" :label="item.nmv_card">
                            {{item.nmv_card}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="当前到期时间" :labelCol="labelCol">
                    <div> {{expiration_time}} </div>
                </a-form-item>

                <a-form-item label="电动车收费规则" :labelCol="labelCol" :required="true" extra="请选择一种收费规则">
                    <a-select style="width: 300px" placeholder="请选择收费规则" v-model="post.rule_id"
                        @change="calculationNmvCost">
                        <a-select-option v-for="item in charge_rule" :key="item.rule_id" :label="item.type_text">
                            {{item.type_text}}
                        </a-select-option>
                    </a-select>

                </a-form-item>
                <a-form-item label="收费周期" :labelCol="labelCol" extra="(不填默认1)">
                    <a-input-number :maxLength="20" style="width: 300px" placeholder="请输入收费周期" autocomplete="off"
                        :min="1" v-model="post.cycle_num" @change="calculationNmvCost" />
                </a-form-item>
                <a-form-item label="线下支付方式" :labelCol="labelCol" :required="true"  extra="请选择一种线下支付方式">
                    <a-select style="width: 300px" placeholder="请选择标支付方式" v-model="post.offline_pay_type"
                        @change="calculationNmvCost">
                        <a-select-option v-for="item in offline_pay" :key="item.id" :label="item.name">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="支付金额" :labelCol="labelCol">
                    <div> {{pay_momey}} &nbsp; 元</div>
                </a-form-item>
            </a-form>
        </a-card>

        <a-card :bordered="false" style="text-align: center;">
            <a-button type="primary" style="margin-top: 20px;" @click="handleSubmit()" :loading="loading">确认支付
            </a-button>
        </a-card>

    </a-drawer>

</template>
<script>
    import villageApi from '@/api/community/village'
    import {
        Collapse
    } from 'ant-design-vue';
    const data = [];
    export default {
        name: 'nonMotorVehiclePay',
        filters: {

        },

        data() {
            return {
                labelCol: {
                    xs: {
                        span: 10
                    },
                    sm: {
                        span: 4
                    }
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                post: {
                    rule_id: '',
                    card_no: '',
                    cycle_num: 1,
                    offline_pay_type: '',
                },
                offline_pay: [],
                charge_rule: [],
                card_list: [],
                search_data: [],
                search_keyword: '',
                searched_arr: {},
                expiration_time: '',
                pay_momey: '',
            };
        },
        activated() {

        },
        methods: {
            addpay() {
                this.search_keyword = ''
                this.search_data = [];
                this.expiration_time = '';
                this.card_list = [];
                this.searched_arr = {};
                this.post.card_no = '';
                this.post.cycle_num = 1;
                this.pay_momey = '';
                this.offline_pay_type = '';
                this.getNmvChargePayInfo();
                this.visible = true;
            },
            getNmvChargePayInfo() {
                this.request(villageApi.getNmvChargePayInfo).then((res) => {
                    console.log(res);
                    this.charge_rule = res.charge_rule;
                    this.offline_pay = res.offline_pay;
                }).catch((error) => {});
            },

            // 查询模糊搜索
            handleSearch(value) {
                if (value === '') {
                    this.search_data = []
                    this.search_keyword = ''
                    return false
                }
                console.log('handleSearch', value)
                 this.search_keyword = value
                // 两位以上触发搜索
                const param = {
                    keyword: value,
                    cfromtype: 'search',
                }
                this.request(villageApi.getNmvCardList, param).then((res) => {
                    console.log(res)
                    if (res.list.length > 0) {
                        this.search_data = res.list
                    }
                })
            },
            // 搜索失去焦点
            handleSearchBlur(value) {
                console.log('handleSearchBlur', value)
            },
            // 再次获取焦点时
            handleSearchFocus() {
                console.log('handleSearchFocus', '=====')
                this.search_keyword = ''
                this.search_data = [];
                this.expiration_time = '';
                this.card_list = [];
                this.searched_arr = {};
                this.post.card_no = '';
                this.pay_momey = '';
            },
            searchOptionChange(value, option) {
                console.log('change_value', value)
                this.expiration_time = this.search_data[value].expiration_time;
                this.searched_arr = this.search_data[value];
                this.card_list = this.search_data[value].card_list;
                this.post.card_no = '';
                this.pay_momey = '';

            },
            calculationNmvCost() {
                if (this.post.card_no.length > 0 && this.searched_arr.pigcms_id != undefined && this.searched_arr
                    .pigcms_id > 0 && this.post.rule_id * 1 > 0) {
                    let cycle_num = 1;
                    if (this.post.cycle_num && this.post.cycle_num * 1 > 0) {
                        cycle_num = this.post.cycle_num;
                    }
                    let price = 0;
                    let rule_id = this.post.rule_id * 1;
                    this.charge_rule.forEach((item, index) => {
                        if (item.rule_id == rule_id) {
                            price = item.price * 1;
                        }
                    })
                    let tmp_pay_money = cycle_num * price;
                    this.pay_momey = tmp_pay_money > 0 ? tmp_pay_money.toFixed(2) : '';
                    return true;
                } else {
                    this.pay_momey = '';
                    return false;
                }
            },
            handleSubmit() {
                let flage=this.calculationNmvCost();
                if(!flage){
                    this.$message.error('支付数据错误，请重新操作！');
                    return false;
                }
                let postArr = this.post;
                postArr.pigcms_id=this.searched_arr.pigcms_id
                postArr.searched_arr=this.searched_arr;
                postArr.pay_momey=this.pay_momey;
                postArr.search_keyword=this.search_keyword;
                if(this.post.offline_pay_type && this.post.offline_pay_type*1>0){
                    
                }else{
                    this.$message.error('请选一种线下支付方式！');
                    return false;
                }
                this.loading = true;
                this.request(villageApi.nmvPcOfflinePay, postArr)
                    .then((res) => {
                        this.$message.success('支付成功!');
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.handleCancel();
                            this.$emit('ok')
                        }, 1500)
                        this.loading = false
                    }).catch(error => {
                        this.loading = false
                    })

            },
            handleCancel() {
                this.search_keyword = ''
                this.search_data = [];
                this.expiration_time = '';
                this.card_list = [];
                this.searched_arr = {};
                this.post.card_no = '';
                this.post.cycle_num = 1;
                this.pay_momey = '';
                this.offline_pay_type = '';
                this.visible = false;
            },

        }
    };
</script>
<style lang="less" scoped>
    .padding-tp10 {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .modal_box_1 {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        .flex_text_box {
            width: 50%;
        }
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

    /deep/ .ant-form-extra {
        margin-left: 10px;
        display: inline-block;
    }
</style>
