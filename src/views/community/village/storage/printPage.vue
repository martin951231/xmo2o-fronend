<template>
    <a-modal :title="title" :width="1200" :visible="prtvisible" :footer="null" :maskClosable="false"
        :confirmLoading="confirmLoading" @cancel="handleCancel">
        <div :id="table_id">
            <div class="module_two" style="display: flex; flex-direction: column; position: relative;">
                <div  class="table_top" style="border: 0.5px solid #999999; display: inline-block;
          align-items: center;justify-content: space-between;width: 100%;height: 46px;
    line-height: 46px;">
                    <div>
                        <span style="display: inline-block;width: 100%;text-align: center;font-weight: bold;font-size: 20px;">{{printInfo.village_name}}预存缴费单</span>
                    </div>
                </div>

                <div class="table_container"
                    style="display: flex; align-items: center; width: 100%; border-left: 0.5px solid #999999;">
                    <div class="table_item" style="border: 0.5px solid #999999;width:25%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start; word-break: break-all;padding-left: 7px;">
                        <span style="font-weight: bold;font-size: 12px;">业主姓名：</span><span >{{printInfo.user_name}}</span>
                    </div>
                    <div class="table_item" style="border: 0.5px solid #999999;width:35%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start; word-break: break-all;padding-left: 7px;">
                        <span style="font-weight: bold;font-size: 12px;">房间号：</span><span >{{printInfo.room_address}}</span>
                    </div>
                    <div class="table_item" style="border: 0.5px solid #999999;width:40%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start; word-break: break-all;padding-left: 7px;">
                        <span style="font-weight: bold;font-size: 12px;">票据号：</span><span >{{printInfo.print_num}}</span>
                    </div>
                </div>

         
         <div class="table_container"
             style="display: flex; align-items: center; width: 100%; border-left: 0.5px solid #999999;">
             <div class="table_item" style="border: 0.5px solid #999999;width:25%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start; word-break: break-all;padding-left: 7px;">
                 <span style="font-weight: bold;font-size: 12px;">期初余额：</span><span >{{printInfo.current_money}}</span>
             </div>
             <div class="table_item" style="border: 0.5px solid #999999;width:35%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start;word-break: break-all;padding-left: 7px;">
                 <span style="font-weight: bold;font-size: 12px;">缴费金额：</span><span >{{printInfo.money}}</span>
             </div>
             <div class="table_item" style="border: 0.5px solid #999999;width:40%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start; word-break: break-all;padding-left: 7px;">
                 <span style="font-weight: bold;font-size: 12px;">缴费后余额：</span><span >{{printInfo.after_price}}</span>
             </div>
         </div>
         
         <div class="table_container"
             style="display: flex; align-items: center; width: 100%; border-left: 0.5px solid #999999;">

             <div class="table_item" style="border: 0.5px solid #999999;width:25%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start;word-break: break-all;padding-left: 7px;">
                 <span style="font-weight: bold;font-size: 12px;">支付方式：</span><span >{{printInfo.pay_type_str}}</span>
             </div>
             <div class="table_item" style="border: 0.5px solid #999999;width:35%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start;word-break: break-all;padding-left: 7px;">
                 <span style="font-weight: bold;font-size: 12px;">收款人：</span><span >{{printInfo.opt_name}}</span>
             </div>
             <div class="table_item" style="border: 0.5px solid #999999;width:40%; border-left: 0; height: 36px; display: flex; align-items: center;justify-content: flex-start; word-break: break-all;padding-left: 7px;">
                 <span style="font-weight: bold;font-size: 12px;">支付时间：</span><span >{{printInfo.add_time_str}}</span>
             </div>
                <div v-if="printInfo.seal_img && printInfo.seal_img.length>10" style="position: absolute;bottom: -70px;left: 40%;">
                    <img  :src="printInfo.seal_img" style="width: 220px;">
                </div>
         </div>
         
         
            </div>
        </div>
        <span class="table-operator" style="text-align: center;display: inline-block;width: 100%;margin-top: 50px;" v-if="is_show">
            <a-button type="primary" @click="print">打印</a-button>
        </span>
    </a-modal>
</template>

<style lang="less" scoped>
    .imgname {
        width: 100px;
    }

    .ant-modal-body {
        padding: 20px 10px;
        zoom: 1;
    }

    .ant-table table {
        width: 100%;
        text-align: left;
        border-radius: 2px 2px 0 0;
        border-collapse: separate;
        border-spacing: 0;
    }

    .template3type {
        text-align: center;

        /deep/ .ant-descriptions-item {
            &:nth-last-child(1) {
                text-align: right;
            }
            &:nth-child(1) {
                text-align: left;
            }
        }
    }

    /deep/ .ant-descriptions-item-colon::after {
        content: ''
    }

    .module_two {
        display: flex;
        flex-direction: column;

        .table_top {
            border: 0.5px solid #999999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 27px;

            .header_item {
                display: flex;
                align-items: center;
                justify-content: space-between;

                &:nth-child(1) {
                    margin-left: 10px;
                }

                &:nth-last-child(1) {
                    margin-right: 20px;
                }
            }
        }

        .table_container {
            display: flex;
            align-items: center;
            width: 100%;
            border-left: 0.5px solid #999999;

            .table_item {
                border: 0.5px solid #999999;
                border-left: 0;
                height: 27px;
                display: flex;
                align-items: center;
                justify-content: center;

                // font-weight: bold;
                &:nth-child(1) {
                    // border-left: 0.5px solid #999999;
                }
            }
        }

        .table_footer_one {
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 0.5px solid #999999;
            width: 100%;

            .table_item {
                border: 0.5px solid #999999;
                border-left: 0;
                height: 27px;
                display: flex;
                align-items: center;
                padding-left: 10px;
                // &:nth-child(1){
                //     border-right: 0.5px solid #999999;
                // }
            }
        }

        .table_footer_two {
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 0.5px solid #999999;
            width: 100%;

            .left_title {
                height: 27px;
                width: 25%;
                border: 0.5px solid #999999;
                border-left: 0;
                display: flex;
                align-items: center;
                padding-left: 10px;
            }

            .right_content {
                height: 27px;
                width: 75%;
                border: 0.5px solid #999999;
                border-left: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-left: 10px;
            }
        }
    }
</style>

<script>
    import villageApi from '@/api/community/village'
    import print from 'print-js'
    export default {
        components: {},
        data() {
            return {
                title: '打印预览',
                print_title: '',
                is_show: true,
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
                prtvisible: false,
                order_id: 0,
                id: 0,
                col_num: 3,
                printType: 1,
                printRecordStatus: true,
                table_id: '',
                record:{},
                printInfo:{},
            }
        },
        mounted() {},
        methods: {
            printShow(record) {
                this.table_id = 'print_' + parseInt(Math.random() * (999 - 100 + 1) + 999) + '_' + (new Date())
                    .getTime();
                this.title = '打印预览'
                this.prtvisible = true
                this.is_show = true
                this.record=record,
                this.printRecordStatus = true
                this.print_title = ''
                this.getPrintInfo()
            },
            getPrintInfo() {
                this.confirmLoading = true
                this.seal_img='';
                this.request('/community/village_api.Storage/getPrintInfo', {
                        idd: this.record.id,
                        uid: this.record.uid,
                    })
                    .then((res) => {
                        this.confirmLoading = false
                        this.printInfo=res;
                        /*
                        setTimeout(() => {
                            this.print()
                        }, 800)
                        */
                    }).catch((error) => {
                        this.prtvisible = false
                    })
            },

            print() {
                let styleC = '';
                styleC = '@page {  } ' +
                        '@media print { .ant-table-tbody > tr > td {border-bottom: 1px solid #000000;-webkit-transition: all 0.3s, border 0s;transition: all 0.3s, border 0s;}   .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {border-right: 1px solid #000000;}  .ant-table-bordered .ant-table-header > table, .ant-table-bordered .ant-table-body > table, .ant-table-bordered .ant-table-fixed-left table, .ant-table-bordered .ant-table-fixed-right table {border: 1px solid #000000;border-right: 0;border-bottom: 0;} .ant-table-thead > tr > th {color: rgba(0, 0, 0, 1);font-weight: 500;text-align: left;background: #fafafa;border-bottom: 1px solid #000000;-webkit-transition: background 0.3s ease;transition: background 0.3s ease;} .ant-descriptions-item-colon::after {content:"";} .ant-table table {width: 100%;} .ant-descriptions-row td { width:3% } '
                
                printJS({
                    printable: this.table_id, // 标签元素id
                    type: 'html',
                    targetStyles: ['*'],
                    maxWidth: '100%',
                    style: styleC,
                    scanStyles: false,
                    onPrintDialogClose: () => {
     
                    }
                })
            },
            handleCancel() {
                this.prtvisible = false
                this.printRecordStatus = true
                this.print_desc='';

            },

        }
    }
</script>
