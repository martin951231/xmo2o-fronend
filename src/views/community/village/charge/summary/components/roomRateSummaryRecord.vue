<template>
    <a-drawer :title="title" placement="right" :width="widthDrawer" :closable="true" :visible="drawer_visible"
        @close="onClose">
        <div>
            <div style="margin-bottom: 50px; padding: 0px 20px;" v-if="dataTableList.length>0" v-for="(item, index) in dataTableList">
            <div style="font-size: 18px;font-weight: bold;"><span>数据生成时间： {{item.add_time_str}} </span> <span style="margin-left: 40px;" v-if="item.rate_type*1==1">截止{{item.date_day}}年1月1日凌晨之前的【自然年陈欠收费率】历史快照数据</span> <span style="margin-left: 40px;" v-if="item.rate_type*1==0">年份为{{item.date_day}} 的【收费率分析】历史快照数据</span><span style="margin-left: 40px;" v-if="item.rate_type*1==2">年份为{{item.date_day}} 的【陈欠追缴率】历史快照数据</span></div>
             <a-divider style="background-color: cornflowerblue;top: -15px;"/>
                <div class="message-suggestions-box-1">
                    <a-table :columns="item.data_info.tcolumns" :data-source="item.data_info.tdata" :pagination="false"
                        class="components-table-demo-nested">
                    </a-table>
                </div>
          </div>
         
          <div v-if="dataTableList.length<1" style="text-align: center;font-size: 18px;margin-top: 30px;"> <span>暂无数据</span></div>
     </div>
    </a-drawer>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village'
    import {
        Collapse
    } from 'ant-design-vue'

    const columns = [
    ]
    const data = []
    export default {
        name: 'roomRateSummarRecord',
        filters: {

        },
        components: {
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                reply_content: '',
                title: '历史快照数据（新年开始的凌晨生成前年的数据）',
                pagination: {
                    current: 1,
                    pageSize: 15,
                    total: 15,
                },
                search: {year_v:moment().format('YYYY')*1},
                drawer_visible: false,
                loading: false,
                data,
                columns,
                page: 1,
                widthDrawer: 1500,
                dataTableList:[],
                param:{},
            }
        },

        created() {
            if (window.screen.width < 1400) {
                this.widthDrawer = 1000
            } else if (window.screen.width < 1600) {
                this.widthDrawer = 1300
            }
        },
        activated() {

        },
        methods: {

            onClose() {
                this.drawer_visible = false
            },
            showRateSummaryRecord(param){
                this.param=param
                this.drawer_visible = true
                this.getRecordDataList();
            },
            // 获取列表信息
            getRecordDataList() {
                this.loading = true
                this.request(villageApi.getRoomRateSummaryRecordList, this.param)
                    .then((res) => {
                        this.dataTableList=res.list;
                        this.loading = false
                    })
            },

        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        background-color: white;
        margin-top: 15px;
    }

    .message-suggestions-box-1 .search-box {
        padding: 0px 20px;
        border: 1px solid #e4dfdf;
        padding-bottom: 15px;
    }

    .message-suggestions-box-1 .add-box {
        padding: 20px 20px 0;
    }

    .message-suggestions-box-1 .components-table-demo-nested {
        // padding: 20px;
    }

    .message-suggestions-box-1 .message_box {
        padding: 20px;
    }

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
    }

    .mg5_box {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0.5%;
    }

    .top_box {
        width: 100%;
        border: 1px solid #F1F1F1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

        .flex_text_box {
            display: flex;
            flex-direction: row;
            align-items: center;

            .text_1 {
                flex-shrink: 0;
            }
        }
    }
</style>