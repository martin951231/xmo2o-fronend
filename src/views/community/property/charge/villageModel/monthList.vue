<template>
    <div>
        <a-form layout="inline" :form="form">
            <a-form-item label="支付时间筛选：">
                <a-range-picker v-model="requestParams.payDate" @change="onPayTime" style=" width: 220px;" />
            </a-form-item>
            <a-form-item label="计费时间筛选：">
                <a-range-picker v-model="TwoDateRange" @change="onNumTime" style=" width: 220px;" />

            </a-form-item>
            <a-form-item label="收费项目：">
                <a-select style="width:260px;" mode="multiple" placeholder="请选择项目" v-model="requestParams.project_id">
                    <a-select-option :value="item1.id" v-for="(item1, index1) in project_list" :key="index1">
                        {{ item1.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click="searchFn()">
                    查询
                </a-button>

            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click="exportFn()">
                    导出表格
                </a-button>

            </a-form-item>

        </a-form>

        <div class="box-content">
            <a-icon type="exclamation-circle" theme="filled" style="font-size: 20px;" />
            {{ content }}
        </div>

        <a-modal title="请稍等,正在为您导出数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />

                <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数，然后分多次导出。</p>
            </div>
        </a-modal>


        <template>

            <div v-if="loading" >
                <div >
                    <a-spin size="large" class="loading_quan" />
                </div>
                
            </div>

            <a-table v-else :columns="columns" :data-source="data" bordered size="middle" rowKey="goods_id"
                :loading="loading" :pagination="false" :scroll="{ x: 'calc(700px + 50%)' }">

            </a-table>
        </template>

    </div>
</template>

<script>
const columns = [
    {
        title: '小区日期',
        dataIndex: 'name',
        key: 'key',
        width: 180,
        fixed: 'left',
        ellipsis: true, // 开启文本省略
        showOverflowTooltip: true, // 显示超出内容的tooltip
    },
    {
        title: '合计',
        dataIndex: 'gender',
        key: 'genderid',
        width: 100,
        fixed: 'right',
    },
];
const data = [];
// import { Loading } from 'ant-design-vue';

import newChargeApi from '@/api/community/property/packages';
import moment from "moment";
export default {
    name: "monthList",
    components: {
        // [Loading.name]: Loading,
    },
    data() {
        return {
            form: this.$form.createForm(this, { name: 'horizontal_login' }),
            yourColor: '#aaa',
            data,
            columns,
            loading: true,
            content: "小区月度已缴账单报表统计小区的每日(前一天，不含当天)缴费情况",
            setTimeoutS: null,
            excelExportOutFileUrl: '',
            export_out_id: 0,
            tips_visible: false,
            project_list: [],
            TwoDateRange: [],
            requestParams: {
                payDate: [],
                project_id: [],
                service_start_time: "",
                service_end_time: "",
                system_type: ""
            }

        };
    },
    created() {
        this.getList()



        // 获取收费项目
        this.getChargeProjectList()

    },
    methods: {

        // 收费项目
        getChargeProjectList() {
            this.request(newChargeApi.propertyChargeProjectList, { type: 'selectdata' })
                .then((res) => {
                    this.project_list = res.list
                })
        },

        // 获取列表
        getList() {
            this.loading = true;
            this.request(newChargeApi.propertyVillageMonthlyBill, this.requestParams, 'post')
                .then((res) => {
                    this.requestParams = {
                        payDate: [],
                        project_id: [],
                        service_start_time: "",
                        service_end_time: "",
                        system_type: ""
                    }
                    this.TwoDateRange = []
                    if (res.list.length > 0) {
                        if (res.payDate.length > 0) {
                            this.requestParams.payDate.push(res.payDate[0], res.payDate[1])
                        }

                        if (res.service_start_time.length > 0) {
                            this.TwoDateRange.push(res.service_start_time)
                        }

                        if (res.service_end_time.length > 0) {
                            this.TwoDateRange.push(res.service_end_time)
                        }
                        if (res.project_id.length > 0) {
                            res.project_id.forEach(item => {
                                this.requestParams.project_id.push(item)

                            })
                        }


                        this.data = []
                        let villageDates = res?.list?.[0]?.villageDateList;
                        let reversedVillageDates = []
                        if (villageDates) {
                            reversedVillageDates = villageDates.slice().reverse();
                        }
                        // 动态添加列
                        reversedVillageDates.forEach((item, index) => {
                            let obj =
                            {
                                title: item.order_date,
                                key: item.order_date + Date.now() + index,
                                children: [
                                    {
                                        title: '线上',
                                        dataIndex: 'online_pay_total' + item.order_date,
                                        key: 'on' + Date.now() + index,
                                        width: 150,
                                    },
                                    {
                                        title: '线下',
                                        dataIndex: 'offline_pay_total' + item.order_date,
                                        key: 'off' + Date.now() + index,
                                        width: 150,
                                    },
                                    {
                                        title: '合计',
                                        dataIndex: 'pay_total' + item.order_date,
                                        key: 'tum' + Date.now() + index,
                                        width: 150,
                                    },
                                ],
                            }
                            this.columns.splice(1, 0, obj);
                        })

                        console.log(this.columns, '000columns')


                        // 处理数据结构
                        let arr = []
                        let arr1 = []
                        let arr2 = []
                        res.list[0].villageDateList.forEach((s2, index) => {
                            arr.push(['online_pay_total' + s2.order_date, 0])
                            arr1.push(['offline_pay_total' + s2.order_date, 0])
                            arr2.push(['pay_total' + s2.order_date, 0])
                        })
                        res.list.forEach(v2 => {
                            this.data.push({
                                key: v2.village_id,
                                name: v2.village_name,
                                gender: v2.villageTotal,
                                genderid: v2.village_id + Date.now(),

                            })
                        })

                        this.data.forEach(t1 => {
                            arr.forEach(([key, value]) => {
                                t1[key] = value;
                            });
                            arr1.forEach(([key, value]) => {
                                t1[key] = value;
                            });
                            arr2.forEach(([key, value]) => {
                                t1[key] = value;
                            });
                        })

                        let newarr = []
                        res.list.forEach(item => {
                            item.villageDateList.forEach((v1, index) => {
                                newarr.push({
                                    name: item.village_name,
                                    ['online_pay_total' + v1.order_date]: v1.online_pay_total,
                                    ['offline_pay_total' + v1.order_date]: v1.offline_pay_total,
                                    ['pay_total' + v1.order_date]: v1.pay_total,
                                })
                            })
                        })

                        this.data = this.data.map(item => {
                            let foundArr = newarr.filter(item1 => item1.name === item.name);
                            if (foundArr.length) {
 
                                foundArr.forEach(prop => {
                                    item = {
                                        ...item,
                                        ...prop,
                                    };
                                });
                            }
                            return item
                        });


                        const newName = "合计";
                        const newItem = {
                            ...this.data[0],
                            name: newName,
                        };
                        this.data = [...this.data, newItem];

                        // 处理总合计
                        let sum = 0;
                        for (let i = 0; i < this.data.length - 1; i++) {
                            sum += Number(this.data[i].gender);
                        }
                        this.data[this.data.length - 1].gender = sum.toFixed(2);

                        let newobj = res.totalDataList


                        let newobj2 = {}
                        for (let key in newobj) {
                            newobj2["online_pay_total" + newobj[key].order_date] = newobj[key].online_pay_total
                            newobj2["offline_pay_total" + newobj[key].order_date] = newobj[key].offline_pay_total
                            newobj2["pay_total" + newobj[key].order_date] = newobj[key].pay_total
                        }

                        for (let prop in newobj2) {
                            if (newobj2.hasOwnProperty(prop)) {
                                this.data.forEach((item) => {
                                    if (item.name == "合计") {
                                        if (item.hasOwnProperty(prop)) {
                                            item[prop] = newobj2[prop];
                                        }
                                    }

                                });
                            }
                        }


                    }


                })


            this.loading = false;
        },

        // 导出
        exportFn() {
            this.tips_visible = true;
            this.loading = true;
            this.request(newChargeApi.propertyvillageMonthlyBillExport, this.requestParams, 'post')
                .then((res) => {
                    this.excelExportOutFileUrl = res.excelExportOutFileUrl;
                    this.excelExportOutFileUrl = this.excelExportOutFileUrl + '&id=' + res.export_id
                    this.CheckExportOutStatus();
                })

        },

        CheckExportOutStatus() {
            let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
            this.request(excelExportOutFileUrlCheck, {
                tokenName: 'village_access_token',
                ajax: 'village_ajax'
            })
                .then((res) => {
                    if (res.error_code == 0) {
                        clearTimeout(this.setTimeoutS)
                        this.setTimeoutS = null
                        window.location.href = this.excelExportOutFileUrl;
                        this.loading = false
                        this.tips_visible = false;
                        return false;
                    } else if (res.error_code == 404) {
                        this.tips_visible = false;
                        this.loading = false
                        clearTimeout(this.setTimeoutS)
                        this.setTimeoutS = null
                        this.$message.error(res.error_msg)
                        return false
                    } else {
                        this.setTimeoutS = setTimeout(this.CheckExportOutStatus, 2000);
                    }
                }).catch((error) => {
                    this.$message.error('出错了，请刷新页面重试！')
                    this.tips_visible = false;
                    this.loading = false
                })
        },

        // 支付时间
        onPayTime(date, dateString) {
            const diffDays = moment(dateString[1]).diff(moment(dateString[0]), 'days');
            if (diffDays > 31) {
                this.$message.error('您选择的日期范围超过了31天,请重新选择。')
                this.requestParams.payDate = []

            } else {
                this.requestParams.payDate = dateString

            }
        },

        // 计费时间
        onNumTime(date, dateString) {
            const diffDays = moment(dateString[1]).diff(moment(dateString[0]), 'days');
            if (diffDays > 31) {
                this.$message.error('您选择的日期范围超过了31天,请重新选择。')
                this.requestParams.service_end_time = ""
                this.requestParams.service_start_time = ""

            } else {

                this.requestParams.service_start_time = dateString[0]
                this.requestParams.service_end_time = dateString[1]
            }
        },

        // 查询
        searchFn() {



            // 清空列表
            this.data = []
            this.columns = [
                {
                    title: '小区日期',
                    dataIndex: 'name',
                    key: 'key',
                    width: 180,
                    fixed: 'left',
                    ellipsis: true, // 开启文本省略
                    showOverflowTooltip: true, // 显示超出内容的tooltip
                },
                {
                    title: '合计',
                    dataIndex: 'gender',
                    key: 'gender',
                    width: 80,
                    fixed: 'right',
                },
            ]
            this.getList()
        }
    },
};
</script>

<style lang="less" scoped>
.box-content {
    margin: 20px 0 20px 20px;
    font-size: 14px;
    color: #10aeff;
}

::v-deep .loading_quan {
    display: flex;
    justify-content: center !important; 
}
</style>