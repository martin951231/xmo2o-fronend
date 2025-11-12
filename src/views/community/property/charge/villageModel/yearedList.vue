<template>
    <div>
        <a-form layout="inline" :form="form" style="margin-bottom: 20px;">
            <a-form-item label="计费时间筛选：">
                <a-range-picker format="YYYY" :mode="mode1" v-model="requestParams.service_time" :open="isRangeOpen"
                    @openChange="openRangeChange" @panelChange="handlePanelChange2" style=" width: 220px;" />
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
            <a-table v-else :columns="columns" :data-source="data" bordered :pagination="false" :loading="loading">
            </a-table>
        </template>

    </div>
</template>

<script>
import newChargeApi from '@/api/community/property/packages';
import moment from "moment";

const columns = [
    {
        title: '小区/日期',
        dataIndex: 'village_name',
        key: 'village_name',
        width: '200px',
    },
];

const data = [];
export default {
    data() {
        return {
            data,
            columns,
            isRangeOpen: false,
            mode1: ['year', 'year'],
            nameobj: [],
            setTimeoutS: null,
            loading: false,
            excelExportOutFileUrl: '',
            export_out_id: 0,
            footerobj: [],
            tips_visible: false,
            form: this.$form.createForm(this, { name: 'horizontal_login' }),
            project_list: [],
            TwoDateRange: [],
            requestParams: {
                project_id: [],
                service_time: [],
                system_type: ""
            }

        };
    },
    created() {
        this.getList()
        this.getChargeProjectList()
    },
    mounted() {
    },
    methods: {
        moment,
        getChargeProjectList() {
            this.request(newChargeApi.propertyChargeProjectList, { type: 'selectdata' })
                .then((res) => {
                    this.project_list = res.list
                })
        },

        // 获取列表
        getList() {
            this.loading = true

            this.request(newChargeApi.propertyVillageYearlyReceivable, this.requestParams, 'post')
                .then((res) => {
                    if (res.list.length > 0) {
                        if (res.service_time.length > 0) {
                            this.requestParams.service_time = res.service_time
                        }
                        if (res.project_id.length > 0) {
                            res.project_id.forEach(item => {
                                this.requestParams.project_id.push(item)

                            })
                        }
                        if(res.list){
                            this.data=res.list;
                        }
                        if(res.year_columns && res.year_columns.length>0){
                                for(let ii=0;ii<res.year_columns.length;ii++){
                                    this.columns.push({
                                            title: res.year_columns[ii].xname,
                                            dataIndex: res.year_columns[ii].xvalue,
                                            key: res.year_columns[ii].xvalue,
                                        });
                                    }
                        }    
                    }
                })
            this.loading = false
        },

        // 导出
        exportFn() {
            this.tips_visible = true;
            this.loading = true;
            this.request('/community/property_api.Charge/villageYearlyReceivableExport', this.requestParams, 'post')
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

        openRangeChange(status) {
            if (status) {
                this.isRangeOpen = true;
            } else {
                this.isRangeOpen = false;
            }
        },

        isWithin12Years(dateArray) {
            const startDate = parseInt(dateArray[0], 10);
            const endDate = parseInt(dateArray[1], 10);

            // 计算相差年数
            const yearsDifference = Math.abs(endDate - startDate);

            // 判断是否超过12年
            return yearsDifference <= 12;
        },


        handlePanelChange2(value) {
            let newarr = []
            value.forEach(item => {
                const formattedDate = moment(item._d).format("YYYY");
                newarr.push(formattedDate)
            })

            this.requestParams.service_time = newarr;

            const isValidRange = this.isWithin12Years(this.requestParams.service_time);
            if (isValidRange == false) {
                this.$message.error('计费时间不可以超过12年');
            } else {
                this.isRangeOpen = false;
            }
        },

        // 查询
        searchFn() {
            // 清空列表
            this.data = []
            this.columns = [
                    {
                        title: '小区/日期',
                        dataIndex: 'village_name',
                        key: 'village_name',
                        width: '200px',
                    },
            ]
            this.getList()
        },

    },
};
</script>

<style scoped>
.footer-num {
    position: relative;
    display: inline-block;
    width: 180px !important;
    /* margin-right: 32px; */
}

.footer-line {
    position: absolute;
    height: 100px;
    width: 1px;
    top: -17px;
    left: 163px;
    height: 54px;
    background-color: #e8e8e8;
}

.footer-item {
    position: relative;
    display: inline-block;
    width: 268px;
    /* margin-right: 64px; */

}

.footer-line1 {
    position: absolute;
    height: 100px;
    width: 1px;
    top: -17px;
    left: 262px;
    height: 54px;
    background-color: #e8e8e8;
}

.footer-item:last-child {
    position: relative;
    display: inline-block;
    width: 120px;
    margin-right: 64px;
}

.last-footer-line {
    display: none;

}

::v-deep .loading_quan {
    display: flex;
    justify-content: center !important; 
}
</style>