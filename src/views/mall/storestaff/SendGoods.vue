<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
        <a-layout>
            <!--头部-->
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                <a-row>
                    <a-row>
                        <a-col :span="2" style="text-align: center;font-size: 20px;font-weight: bold;padding-left: 5px;">发货流程</a-col>
                        <a-col :span="22" style="text-align: left;font-size: 15px;opacity: 0.5;padding-top: 3px;">(批量发货目前仅支持快递待发货订单,暂不支持自提订单和同城配送方式的订单)</a-col>
                    </a-row>
                    <a-row style="padding-top: 15px;">
                        <a-col :span="1"></a-col>
                        <a-col :span="17">
                            <a-steps>
                                <a-step status="wait" title="下载发货单模板"/>
                                <a-step title="按模板填写发货单"/>
                                <a-step title="上传发货单"/>
                                <a-step title="确认发货"/>
                            </a-steps>
                        </a-col>
                        <a-col :span="3" style="padding-left: 160px;">
                            <a-button type="primary" @click="showModal">
                                批量发货
                            </a-button>
                            <a-modal v-model="visible" title="批量发货" @ok="handleOk">
                                <p>文件:<a-upload
                                        name="file"
                                        :multiple="true"
                                        :data="{ upload_dir: 'mall/order'}"
                                        action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                                        :file-list="fileList"
                                        @change="uploadFile"
                                >
                                    <a-button>
                                        <a-icon type="upload"/>
                                        点击上传文件
                                    </a-button>
                                </a-upload>
                                </p>
                                <p>最大支持10000条记录 (支持xls、xlsx,文件大小请控制在1MB以内)</p>
                                <p><a type="link" @click="downLodExcel">下载批量发货模板</a></p>
                                <!--<a-button type="link" @click="downLodExcel">
                                    下载模板
                                </a-button>-->
                            </a-modal>
                        </a-col>
                        <a-col :span="3"  style="padding-left: 100px;">
                            <a-button type="link" @click="showModal1" style="font-size: 20px;">
                                修改物流
                            </a-button>
                            <a-modal v-model="visible1" title="修改物流" @ok="handleOk1">
                                <p>文件:<a-upload
                                        name="file"
                                        :multiple="true"
                                        :data="{ upload_dir: 'mall/order'}"
                                        action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                                        :file-list="fileList4"
                                        @change="uploadFile1"
                                >
                                    <a-button>
                                        <a-icon type="upload"/>
                                        点击上传文件
                                    </a-button>
                                </a-upload>
                                </p>
                                <p>1、最大支持10000条记录 (支持xls、xlsx,文件大小请控制在1MB以内)</p>
                                <p>2、仅支持对24小时内自己联系的物流或者表格倒入发货的已发货快递修改一次运单信息</p>
                            </a-modal>
                        </a-col>
                    </a-row>
                </a-row>
            </a-layout-content>
            <!--表格-->
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                <a-row>
                    <a-table bordered rowKey="id" :columns="columns" :data-source="dataList" :pagination="false" style="text-align: center;">
                        <span slot="pigcms_id" slot-scope="text"> {{ text }} </span>

                        <span slot="log_date" slot-scope="text"> {{ text }} </span>

                        <span slot="name" slot-scope="text"> {{ text }} </span>

                        <span slot="order_num" slot-scope="text"> {{ text }} </span>

                        <span slot="success_num" slot-scope="text"> {{ text }} </span>

                        <span slot="status" slot-scope="text" class="text-center">
                        <a-badge v-if="text == 0" status="default" text="处理中"/>
                        <a-badge v-if="text == 2" status="default" text="已完成"/>
                    </span>

                        <span slot="work_status" slot-scope="text,record" class="text-center">
                        <a-badge v-if="text == 0" status="default" text="报表生成中"/>
                        <a v-if="text == 2 && record.error_num>0" @click="downLoadFailLog(record.pigcms_id)">下载失败列表</a>
                        <a-badge v-if="text == 2 && record.error_num==0" status="success" text="已完成"/>
                    </span>
                    </a-table>
                </a-row>
            </a-layout-content>
        </a-layout>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl"/>
        </a-spin>
    </div>
</template>

<script>
    import mallStorestaffApi from '@/api/mall/storestaff/index'
    import ExportAdd from '@/views/common/export/ExportAdd.vue'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        {
            title: '记录编号',
            dataIndex: 'pigcms_id',
            key: 'pigcms_id',
            scopedSlots: {customRender: 'pigcms_id'},
        },
        {
            title: '操作时间',
            dataIndex: 'log_date',
            key: 'log_date',
            scopedSlots: {customRender: 'log_date'},
        },
        {
            title: '操作人',
            key: 'name',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '发货单数',
            dataIndex: 'order_num',
            key: 'order_num',
            scopedSlots: {customRender: 'order_num'},
        },
        {
            title: '成功发货单数',
            dataIndex: 'success_num',
            key: 'success_num',
            scopedSlots: {customRender: 'success_num'},
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '操作',
            dataIndex: 'work_status',
            key: 'work_status',
            scopedSlots: {customRender: 'work_status'},
        },
    ];

    const data = [];

    export default {
        name: "SendGoods",
        components: {
            ACol,
            ARow,
            ExportAdd,
        },
        data() {
            return {
                data,
                columns,
                visible: false,
                visible1: false,
                exportUrl: mallStorestaffApi.downExcel,
                file_url: "",
                file_url1: "",
                //   列表数据
                dataList: [],
                spinning:false,
                fileList: [],
                fileList4:[]
            };
        },
        created() {
            this.getDataList()
        },
        methods: {
            // 提交搜索表单
            submitForm() {
                this.getDataList()
            },
            getDataList() {
                this.request(mallStorestaffApi.getList).then((res) => {
                    this.dataList = res.list
                })
            },
            showModal() {
                this.visible = true;
            },
            handleOk(e) {
                if(this.file_url!=""){
                    this.spinning=true;
                    this.request(mallStorestaffApi.uploadExcel, {
                        file_url: this.file_url
                    }).then((res) => {
                        this.spinning=false;
                        this.fileList =[];
                        if (res == 1) {
                            this.$message.success('恭喜你  导入数据成功!')
                        }else if(res == 2){
                            this.$message.error('导入完成！其中部分商品导入失败，您可在操作记录列表中下载导入失败记录，做相应修改后继续导入!')
                        }else if(res == 3){
                            this.$message.error('全部导入失败！您可在操作记录列表中下载导入失败记录，做相应修改后继续导入')
                        }else{
                            this.$message.error('表格没有数据,请编辑数据再导入')
                        }
                        this.submitForm()
                    })
                }
                this.visible = false;
            },
            showModal1() {
                this.visible1 = true;
            },
            handleOk1(e) {
                if(this.file_url1!=""){
                    this.spinning=true;
                    let params = {
                        type: 'update',
                        file_url:this.file_url1
                    }
                    this.request(mallStorestaffApi.uploadExcel,params).then((res) => {
                        this.spinning=false;
                        this.fileList4 =[];
                        if (res == 1) {
                            this.$message.success('恭喜你  导入数据成功!')
                        }else if(res == 2){
                            this.$message.error('导入完成！其中部分商品导入失败，您可在操作记录列表中下载导入失败记录，做相应修改后继续导入!')
                        }else if(res == 3){
                            this.$message.error('全部导入失败！您可在操作记录列表中下载导入失败记录，做相应修改后继续导入')
                        }else{
                            this.$message.error('表格没有数据,请编辑数据再导入')
                        }
                        this.submitForm()
                    })
                }
                this.visible1 = false;
            },
            downLodExcel() {
                this.request(mallStorestaffApi.downExcel, {}).then((res) => {
                    if (res.error == 0) {
                        //下载成功
                        this.$message.success('下载成功!')
                        location.href = res.url
                    } else {
                        this.$message.error('下载失败!')
                    }
                })
            },
            uploadFile(fileList) {
                let fileList1 = [...fileList.fileList];

                // 1. Limit the number of uploaded files
                //    Only to show two recent uploaded files, and old ones will be replaced by the new
                fileList1 = fileList1.slice(-1);
                // 2. read from response and show file link
                fileList1 = fileList1.map(file => {
                    if (file.response) {
                        // Component will show file.url as link
                        file.url = file.response.url;
                    }
                    return file;
                });

                this.fileList = fileList1;

                if (fileList1[0].status == 'done') {
                    this.file_url = fileList1[0].response.data;
                }

            },
            uploadFile1(fileList2) {
                let fileList3 = [...fileList2.fileList];

                // 1. Limit the number of uploaded files
                //    Only to show two recent uploaded files, and old ones will be replaced by the new
                fileList3 = fileList3.slice(-1);
                // 2. read from response and show file link
                fileList3 = fileList3.map(file => {
                    if (file.response) {
                        // Component will show file.url as link
                        file.url = file.response.url;
                    }
                    return file;
                });
                this.fileList4 = fileList3;
                if (fileList3[0].status == 'done') {
                    this.file_url1 = fileList3[0].response.data;
                }
            },
            downLoadFailLog(id) {
                let params = {
                    log_id: id
                }
                this.request(mallStorestaffApi.downFailExcel, params).then((res) => {
                    if (res.error == 0) {
                        //下载成功
                        this.$message.success('下载成功!')
                        location.href = res.url
                    } else {
                        this.$message.error('下载失败!')
                    }
                })
            },
        },
    }

</script>

<style scoped>
</style>