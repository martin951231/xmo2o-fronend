<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col>
                <a-button type="primary" class="mr-20" @click="editItem()">{{ L('新建子账号') }}</a-button>
                <a-button class="mr-20" @click="importExcel()">{{ L('批量新建') }}</a-button>
                <a-button @click="delItem()">{{
                    L('删除子账号')
                }}</a-button>
            </a-col>
        </a-row>

        <a-table
            class="mt-20"
            rowKey="id"
            :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: onSelect,
                onSelectAll: onSelectAll,
            }"
            :columns="columns"
            :data-source="list"
            :pagination="pagination"
        >
            <span slot="mobile" slot-scope="text">
                {{ text || '-' }}
            </span>
            <span slot="station_name" slot-scope="text">
                {{ text || '-' }}
            </span>
            <span slot="status" slot-scope="text">
                <font v-if="text == 1" class="font-blue">{{L('正常')}}</font>
                <font v-else class="font-red">{{L('禁止')}}</font>
            </span>
            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-20" @click="editItem(record)">{{ L('编辑') }}</span>
                <span class="cr-primary pointer font-gray" @click="delItem(record)">{{ L('删除') }}</span>
            </span>
        </a-table>

        <a-modal
            :visible="modalVisible"
            :title="modalTitle"
            :destroyOnClose="true"
            width="40%"
            :bodyStyle="{
                maxHeight: '650px',
                overflowY: 'auto',
            }"
            @cancel="handleCancel"
            @ok="handleOk"
        >
            <a-form-model :model="modalForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 8 }">
                <a-form-model-item :label="L('账号名')" required>
                    <a-input allow-clear v-model="modalForm.account" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item :help="L('密码由字母、数字组成，长度8-15位')" :label="L('密码')" required>
                    <a-input-password
                        allow-clear
                        v-model="modalForm.password"
                        :placeholder="modalForm.id ? L('不修改则不填写') : L('请输入')"
                    />
                </a-form-model-item>
                <a-form-model-item :label="L('手机号')" required>
                    <a-input allow-clear v-model="modalForm.mobile" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item :label="L('岗位')">
                    <a-select v-model="modalForm.station_id" allowClear :placeholder="L('请选择')" @popupScroll="popupScroll">
                        <a-select-option :value="item.id" v-for="item in stationsList" :key="item.id">{{
                            item.station_name
                        }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="L('状态')">
                    <a-switch
                        :checked-children="L('正常')"
                        :un-checked-children="L('禁止')"
                        :checked="modalForm.status == 1 ? true : false"
                        @change="switchChange"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <a-modal
            :visible="importExcelModalVisible"
            :title="L('批量导入子账号')"
            :okText="L('点击上传')"
            :destroyOnClose="true"
            :footer="null"
            width="40%"
            :bodyStyle="{
                maxHeight: '650px',
                overflowY: 'auto',
            }"
            @cancel="handleCancelImport"
        >
            <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 8 }">
               <p style="padding: 8px;background: #FFF8F0;border-radius: 3px;">
                <a-icon type="warning" theme="twoTone" twoToneColor="#FF8000" />
                {{ L('为防止导入失败，请仔细阅读模板内的注意事项。导入仅支持xls、xlsx文件，单次上传不允许超过100条，超出部分无法导入，大小不超过10M') }}
               </p>
               <a-upload-dragger
                    name="file"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                >
                    <p class="ant-upload-drag-icon">
                        <a-icon type="file-excel" theme="filled" />
                    </p>
                    <p class="ant-upload-text">{{ L('点击选择或拖动文件至此处') }}</p>
                    <p class="ant-upload-hint">
                        {{ L('导入仅支持xls、xlsx文件，大小不超过10M') }}
                    </p>
                </a-upload-dragger>
                <p style="padding: 8px;background: #FAFAFA;border-radius: 3px;" v-if="import_result != ''" v-html="import_result"/>
                <a-button
                    style="margin-top: 16px;"
                    @click="downloadTemmplate()"
                    >
                    <a-icon type="download" />
                    {{ L('下载导入模板') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-top: 16px;float: right;"
                    @click="handleUpload()"
                    >
                    {{ L('开始导入') }}
                </a-button>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import MerchantApi from '@/api/merchant/merchant/index'
export default {
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('登录账号'),
                    dataIndex: 'login_username',
                },
                {
                    title: this.L('账号'),
                    dataIndex: 'account',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'mobile',
                    scopedSlots: {
                        customRender: 'mobile',
                    },
                },
                {
                    title: this.L('岗位'),
                    dataIndex: 'station_name',
                    scopedSlots: {
                        customRender: 'station_name',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('更新时间'),
                    dataIndex: 'update_time',
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            selectedRowKeys: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            modalVisible: false,
            modalTitle: '',
            modalForm: '',
            // 岗位列表
            stationsList: [],
            stationsHasMore: true,
            stationsPage: 1,
            //批量导入
            importExcelModalVisible:false,
            fileList:[],
            import_result:''
        }
    },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        // 账号列表
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(MerchantApi.merAccountList, params).then((res) => {
                this.list = res.data || []
                if (!this.list.length && this.pagination.current > 1) {
                    this.pageSize.current = this.pageSize.current - 1
                    this.getList()
                }
                this.pagination.total = res.total || 0
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // table选择
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectedRowKeys.push(record.id)
            } else {
                if (this.selectedRowKeys.length) {
                    let index = this.selectedRowKeys.findIndex((item) => item == record.id)
                    index != -1 && this.$delete(this.selectedRowKeys, index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.id)
            if (selected) {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids)
            } else {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids).filter((item) => !ids.includes(item))
            }
        },
        // 添加 || 编辑
        editItem(record = '') {
            this.getStations()
            if (record) {
                this.modalTitle = this.L('账号编辑')
                this.modalForm = {
                    id: record.id,
                    account: record.account,
                    password: record.password || '',
                    mobile: record.mobile,
                    station_id: record.station_id || undefined,
                    status: record.status,
                }
            } else {
                this.modalTitle = this.L('新建账号')
                this.modalForm = {
                    account: '',
                    password: '',
                    mobile: '',
                    station_id: undefined,
                    status: 1,
                }
            }

            this.modalVisible = true
        },
        // 岗位列表
        getStations() {
            let params = {
                page: this.stationsPage,
                page_size: 10,
            }
            this.request(MerchantApi.merStationsList, params).then((res) => {
                let data = res.data || []
                this.stationsList = this.stationsPage == 1?data:this.stationsList.concat(data)
                if (this.stationsList.length < res.total) {
                    this.stationsHasMore = true
                } else {
                    this.stationsHasMore = false
                }
            })
        },
        popupScroll(e) {
            if(this.stationsHasMore) {
                this.stationsPage++
                this.getStations()
            }
        },
        // 删除
        delItem(record = '') {
            this.$confirm({
                title: this.L('确定要删除吗？删除后无法恢复'),
                centered: true,
                onOk: () => {
                    let id = record ? [record.id] : this.selectedRowKeys
                    this.request(MerchantApi.merAccountDel, {
                        id: id,
                    }).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        if (this.selectedRowKeys.length && record) {
                            let index = this.selectedRowKeys.findIndex((item) => item == record.id)
                            if (index != -1) {
                                this.$delete(this.selectedRowKeys, index)
                            }
                        } else {
                            this.selectedRowKeys = []
                        }
                        this.getList()
                    })
                },
                onCancel() {},
            })
        },
        // 状态
        switchChange(status) {
            status = status ? 1 : 0
            this.modalForm.status = status
        },
        // 编辑 || 新增账户 弹框取消
        handleCancel() {
            this.modalVisible = false
            this.modalTitle = ''
            this.modalForm = {}
            this.stationsList = []
            this.stationsPage = 1
        },
        // 编辑 || 新增账户 弹框确认
        handleOk() {
            if (!this.modalForm.account.trim()) {
                this.$message.error(this.L('请填写账号名'))
                return
            }
            if (!this.modalForm.id && !this.modalForm.password.trim()) {
                this.$message.error(this.L('请填写密码'))
                return
            }

            if (!this.modalForm.mobile.trim()) {
                this.$message.error(this.L('请填写手机号码'))
                return
            }

            let params = {
                ...this.modalForm,
                station_id: this.modalForm.station_id || ''
            }

            this.request(MerchantApi.merAccountEdit, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getList()
                this.handleCancel()
            })
        },
        //批量导入子账号
        importExcel() {
            this.importExcelModalVisible = true;
            this.fileList=[];
            this.import_result='';
        },
        handleCancelImport() {
            this.importExcelModalVisible = false;
            this.getList();
        },
        handleUpload() {
            console.log('上传开始')
            const { fileList } = this;
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file', file);
            });

            this.request(MerchantApi.importMerAccount, formData).then((res) => {
                this.import_result = "<span style='color:red;font-size:1.1rem'>"+res.result + "</span><br/>" + res.fail_message;
            })
        },
        beforeUpload(file) {
            let fileType = file.type;
            console.log("file_type   " + fileType)
            if (fileType.indexOf('officedocument') == -1 && fileType.indexOf('excel') == -1) {
                this.$message.error(this.L('仅支持xls、xlsx文件上传!'))
                return false
            }

            let isGt10M = file.size / 1024 / 1024 > 10;
            if (isGt10M) {
                this.$message.error(this.L('文件大小不能超过10M'))
                return false;
            }
            //只要最后一个文件
            this.fileList = [...this.fileList, file].slice(-1);
            this.import_result = '';
            return false;
        },
        downloadTemmplate() {
            window.open(location.protocol + '//' + location.host + "/static/file/m_sub_account_template.xlsx?t=" + (Math.random()), "_blank");
        }
    },
}
</script>

<style scoped>
.title {
    padding: 12px 10px;
    background-color: #f8f8f8;
    font-weight: bold;
    text-align: left;
    box-sizing: border-box;
    color: #000000;
    font-size: 16px;
}
.font-14 {
    font-size: 14px;
}
.item-2 {
    padding: 12px 20px;
}
.item-3 {
    padding: 12px 40px;
    box-sizing: border-box;
    font-size: 12px;
}
.border-bottom {
    border-bottom: 1px solid #ffffff;
}
.item-3 >>> .ant-checkbox-wrapper {
    display: flex;
}
.item-3 >>> .ant-checkbox-wrapper .ant-checkbox + span {
    line-height: 16px;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 12px;
}
.item-3 >>> .ant-checkbox-wrapper .ant-checkbox {
    top: 0;
}

.font-blue{
    color: #1890FF;
}

.font-red{
    color: red;
}

.font-gray{
    color: gray;
}
</style>
