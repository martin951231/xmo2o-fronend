<template>
    <div style="background-color: #fff;padding: 20px">
        <a-tabs default-active-key="loans">
            <a-tab-pane key="loans" :tab="L('楼栋管理')"></a-tab-pane>
        </a-tabs>
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item>
                <a-button type="primary" @click="addBuild">{{L('新建') + stepList[current].stepName}}</a-button>
                <span v-if="stepList[this.current].type == 'building'">
                    <a-button type="primary" class="ml-10" @click="importExcel">{{L('导入')}}</a-button>
                    <a class="ml-20" href="/static/life_tools_house/house_import_sample.xlsx" target="_bank">{{L('导入模板下载')}}</a>
                </span>
            </a-form-model-item>
        </a-form-model>
        <br />
        <div class="mb-20" style="display:flex;user-select: none;">
            <span>{{L('当前位置：')}}</span>
            <a-breadcrumb>
                <template v-for="(item,index) in stepList">
                    <a-breadcrumb-item v-if="current >= index" :key="index">
                        <a :title="index == current?'': L('点击回到此处')" @click="breadcrumbClick(item,index)">{{item.navTitle? item.navTitle +'-' + item.title :item.title}}</a>
                    </a-breadcrumb-item>
                </template>
            </a-breadcrumb>
        </div>
        <a-table :columns="columns" :data-source="datalist" row-key="id" :pagination="pagination" :loading="tableLoading">
            <template slot="status" slot-scope="text, record">
                <a-switch checked-children="开" un-checked-children="关" :checked="record.status?true:false" @change="onStatusChange($event,record)" />
            </template>
            <template slot="management" slot-scope="text, record">
                <a-button type="link" @click="management(record)">{{L('管理')}}</a-button>
            </template>

            <template slot="action" slot-scope="text, record">
                <a @click="editBuild(record)" class="mr-10">{{L('编辑')}}</a>
                <a @click="delBuild(record)" style="color:red">{{L('删除')}}</a>
            </template>
        </a-table>
        <a-modal :title="modalTitle" v-model="visible" destroyOnClose :maskClosable="false" @cancel="handleCancel">
            <template slot="footer" v-if="modalType == 'excel'">
                <a-button key="back" @click="handleCancel">{{L('取消')}}</a-button>
                <a-button key="submit" type="primary" :loading="submitLoading" @click="handleOk" :disabled="excelPath?false:true">{{L('确定导入')}}</a-button>
            </template>
            <template slot="footer" v-else-if="modalType == 'add' || modalType == 'edit'">
                <a-button key="back" @click="handleCancel">{{L('取消')}}</a-button>
                <a-button key="submit" type="primary" @click="handleOk">{{L('确定')}}</a-button>
            </template>
            <div v-if="modalType == 'excel'">
                <div class="box">
                    <a-upload-dragger
                        name="file"
                        :action="uploadAction"
                        @change="handleUploadChange"
                        :data="{ upload_dir: '/life_tools/file'}"
                        :fileList="fileList"
                        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    >
                        <p class="ant-upload-drag-icon">
                            <a-icon type="inbox" />
                        </p>
                        <p class="ant-upload-text">{{L('单击或拖动Excel文件到此区域进行上传')}}</p>
                    </a-upload-dragger>
                </div>
            </div>
            <div v-else-if="modalType == 'add' || modalType == 'edit'">
                <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item :label="stepList[current].stepName + L('名称') ">
                        <a-input v-model="form.name" :placeholder="L('请输入')" />
                    </a-form-model-item>
                    <a-form-model-item :label="'编号'">
                        <a-input-number v-model="form.serial_number" :min="1" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('排序')">
                        <a-input-number v-model="form.sort" :min="0" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('状态')">
                        <a-switch :checked-children="L('开')" :un-checked-children="L('关')" v-model="form.status" />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
    </div>
</template>

<script>
import lifePlatformApi from '@/api/life_tools/platform/index'
export default {
    name: 'SaleBuildingList',
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns: [
                {
                    title: '编号',
                    dataIndex: 'serial_number',
                },
                {
                    title: '楼栋名称',
                    dataIndex: 'name',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: '单元列表',
                    dataIndex: 'management',
                    scopedSlots: { customRender: 'management' },
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    scopedSlots: { customRender: 'sort' },
                    sorter: (a, b) => a.sort - b.sort,
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            goodsList: [],
            //搜索框表单
            searchForm: {},
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            modalTitle: '',
            visible: false,
            uploadAction: '/v20/public/index.php/common/common.UploadFile/uploadFile',
            fileList: [],
            excelPath: '', //文件路径
            submitLoading: false,
            modalType: 'excel',
            current: 0,
            stepList: [
                {
                    title: this.L('楼栋列表'),
                    value: 1,
                    stepName: this.L('楼栋'),
                    type: 'building',
                },
                {
                    title: this.L('单元列表'),
                    value: 2,
                    stepName: this.L('单元'),
                    type: 'unit',
                },
                {
                    title: this.L('楼层列表'),
                    value: 3,
                    stepName: this.L('楼层'),
                    type: 'floor',
                },
                {
                    title: this.L('房间列表'),
                    value: 4,
                    stepName: this.L('房间'),
                    type: 'room',
                },
            ],
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                name: '',
                sort: 0,
                status: true,
                serial_number: 1,
            },
            house_id: '',
            itemData: '',
            tableLoading: false,
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    created() {
        this.house_id = this.$route.query.house_id
        this.getDataList(false)
    },
    methods: {
        //导入
        importExcel() {
            this.modalType = 'excel'
            this.fileList = []
            this.visible = true
            this.modalTitle = this.L('导入文件')
            this.excelPath = ''
            this.submitLoading = false
        },
        addBuild() {
            this.modalType = 'add'
            this.modalTitle = this.L('新建') + this.stepList[this.current].stepName
            this.itemData = ''
            this.form = {
                name: '',
                sort: 0,
                status: true,
                serial_number: 1,
            }
            this.request(lifePlatformApi.houseGetLastNumber, {
                pid: this.stepList[this.current].type == 'building' ? this.house_id : this.stepList[this.current].pid,
                type: this.stepList[this.current].type,
            }).then((res) => {
                this.form.serial_number = res.next_number
                this.visible = true
            })
        },
        editBuild(item) {
            this.modalType = 'edit'
            this.visible = true
            this.itemData = item
            this.form = JSON.parse(JSON.stringify(item))
            this.form.status = item.status == 1 ? true : false
            this.modalTitle = this.L('编辑') + this.stepList[this.current].stepName
        },
        delBuild(item) {
            this.$confirm({
                title: this.L('是否确定删除?'),
                content: this.L(this.current == this.stepList.length - 1 ? '' : '确定后下一级也会清除'),
                centered: true,
                onOk: () => {
                    this.request(this.getApiUrl('delete'), {
                        id: item.id,
                    }).then((res) => {
                        this.$message.success(this.L('删除成功'))
                        this.getDataList(false)
                    })
                },
            })
        },
        //修改状态
        onStatusChange(event, item) {
            let params = {
                id: item.id,
                status: event ? 1 : 0,
            }
            this.request(this.getApiUrl('status'), params).then((res) => {
                this.$message.success(this.L('修改成功'))
                this.submitForm()
            })
        },
        //点击导航栏
        breadcrumbClick(item, index) {
            if (this.current == index) {
                return
            }
            this.current = index
            this.onStepsChange()
            this.submitForm(true)
        },
        //楼栋管理
        management(item) {
            if (this.current >= this.stepList.length - 1) {
                return
            }
            this.current++
            this.stepList[this.current].pid = item.id
            this.stepList[this.current].navTitle = item.name
            this.onStepsChange()
            this.getDataList()
        },
        //弹框确定事件
        handleOk() {
            //导入
            if (this.modalType == 'excel') {
                this.submitLoading = true
                let params = {
                    id: this.house_id,
                    file_url: this.excelPath,
                }
                this.request(lifePlatformApi.importHouse, params)
                    .then((res) => {
                        this.visible = false
                        this.fileList = []
                        this.excelPath = ''
                        this.submitLoading = false
                        this.$message.success(this.L('导入成功'))
                        this.getDataList(false)
                    })
                    .catch((err) => {
                        setTimeout(() => {
                            this.submitLoading = false
                        }, 300)
                    })
            } else if (this.modalType == 'add' || this.modalType == 'edit') {
                let params = JSON.parse(JSON.stringify(this.form))
                if (this.form.name == '') {
                    this.$message.warning(this.L('请填写名称'))
                    return
                }
                //添加
                if (this.modalType == 'add') {
                    params.house_id = this.house_id
                }
                //编辑
                if (this.modalType == 'edit') {
                    params.id = this.itemData.id
                }
                if (this.stepList[this.current].value > 1) {
                    //二级分类需要携带p_number 参数
                    params.pid = this.stepList[this.current].pid
                }
                params.status = params.status ? 1 : 0
                this.request(this.getApiUrl(this.modalType), params).then((res) => {
                    this.visible = false
                    this.$message.success(this.L(this.modalType == 'add' ? '添加成功' : '编辑成功'))
                    this.getDataList(false)
                })
            }
        },
        //上传文件
        handleUploadChange(info) {
            if (info.file.status == 'removed') {
                this.fileList = []
                this.excelPath = ''
            } else {
                this.fileList = [info.file]
            }
            if (info.file.response && info.file.status == 'done') {
                this.excelPath = info.file.response.data
                this.$message.success(this.L('上传成功'))
            } else if (info.file.status == 'error') {
                this.$message.error(this.L('上传失败'))
            }
        },
        //取消弹窗
        handleCancel() {
            this.visible = false
        },
        //当前导航改变事件
        onStepsChange() {
            if (this.stepList.length - 1 == this.current) {
                this.columns = this.columns.filter((v) => v.dataIndex != 'management')
            } else {
                let item = this.columns.find((v) => v.dataIndex == 'management')
                if (!item) {
                    let params = {
                        title: this.stepList[this.current].title,
                        dataIndex: 'management',
                        scopedSlots: { customRender: 'management' },
                        width: 200,
                        align: 'center',
                    }
                    this.columns.splice(1, 0, params)
                }
            }

            let index1 = this.columns.findIndex((v) => v.dataIndex == 'management')
            let index2 = this.columns.findIndex((v) => v.dataIndex == 'name')

            if (index1 >= 0) {
                this.columns[index1].title = this.stepList[this.current + 1]
                    ? this.stepList[this.current + 1].title
                    : ''
            }
            if (index2 >= 0) {
                this.columns[index2].title = this.stepList[this.current].stepName + this.L('名称')
            }
        },
        // 获取table数据
        getDataList(is_search) {
            let params = {}
            this.tableLoading = true
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            }
            params.house_id = this.house_id
            if (this.stepList[this.current].value > 1) {
                params.pid = this.stepList[this.current].pid
            }
            params.pageSize = this.pagination.pageSize
            params.page = this.pagination.current
            this.request(this.getApiUrl('list'), params).then((res) => {
                this.tableLoading = false
                this.datalist = res.data
                this.$set(this.pagination, 'total', res.total)
                if (this.pagination.current > 1 && this.datalist.length == 0) {
                    this.pagination.current--
                    this.getDataList(false)
                }
            })
        },
        // 提交搜索表单
        submitForm(is_search = false) {
            this.getDataList(is_search)
        },
        //获取请求链接
        getApiUrl(type) {
            let url = ''
            let navValue = this.stepList[this.current].value
            switch (type) {
                case 'list':
                    if (navValue == 1) {
                        url = lifePlatformApi.houseBuildGetList
                    }
                    if (navValue == 2) {
                        url = lifePlatformApi.houseUnitGetList
                    }
                    if (navValue == 3) {
                        url = lifePlatformApi.houseFloorGetList
                    }
                    if (navValue == 4) {
                        url = lifePlatformApi.houseRoomGetList
                    }
                    break
                case 'add':
                    if (navValue == 1) {
                        url = lifePlatformApi.houseBuildAdd
                    }
                    if (navValue == 2) {
                        url = lifePlatformApi.houseUnitAdd
                    }
                    if (navValue == 3) {
                        url = lifePlatformApi.houseFloorAdd
                    }
                    if (navValue == 4) {
                        url = lifePlatformApi.houseRoomAdd
                    }
                    break
                case 'edit':
                    if (navValue == 1) {
                        url = lifePlatformApi.houseBuildEdit
                    }
                    if (navValue == 2) {
                        url = lifePlatformApi.houseUnitEdit
                    }
                    if (navValue == 3) {
                        url = lifePlatformApi.houseFloorEdit
                    }
                    if (navValue == 4) {
                        url = lifePlatformApi.houseRoomEdit
                    }
                    break
                case 'status':
                    if (navValue == 1) {
                        url = lifePlatformApi.houseBuildChangeStatus
                    }
                    if (navValue == 2) {
                        url = lifePlatformApi.houseUnitChangeStatus
                    }
                    if (navValue == 3) {
                        url = lifePlatformApi.houseFloorChangeStatus
                    }
                    if (navValue == 4) {
                        url = lifePlatformApi.houseRoomChangeStatus
                    }
                    break

                case 'delete':
                    if (navValue == 1) {
                        url = lifePlatformApi.houseBuildDel
                    }
                    if (navValue == 2) {
                        url = lifePlatformApi.houseUnitDel
                    }
                    if (navValue == 3) {
                        url = lifePlatformApi.houseFloorDel
                    }
                    if (navValue == 4) {
                        url = lifePlatformApi.houseRoomDel
                    }
                    break

                default:
                    break
            }
            return url
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.submitForm()
        },
    },
}
</script>

<style scoped>
</style>