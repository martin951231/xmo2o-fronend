<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <div class="mt-20">
      <a-button type="primary" @click="visibleAddRobot = true"> 添加机器人 </a-button>
    </div>
    <!-- 数据列表 -->
    <a-table 
        class="mt-20" 
        rowKey="id" 
        :columns="columns" 
        :data-source="dataList" 
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
        <!-- 头像 -->
        <span slot="avatar" slot-scope="text">
            <a-avatar shape="square" size="large" :src="text" />
        </span>
        <!-- 添加时间 -->
        <span slot="add_time" slot-scope="text">
            {{moment(text).format('YYYY-MM-DD hh:mm:ss')}}
        </span>
        <!-- 操作栏 -->
        <span slot="action" slot-scope="text">
            <a class="inline-block" @click="removeOpt(text)">删除</a>
        </span>
    </a-table>
    <!--  v-show="total" -->
    <a-row class="mt-20" type="flex" justify="space-between" align="middle">
        <a-col :span="4" class="ml-20">
            <a-checkbox 
                @change="allCheck" 
                :checked="selectedRowKeys.length == dataList.length && dataList.length?true:false"
                :disabled="!dataList.length?true:false">当页全选</a-checkbox>
            <span>已选机器人 {{selectedRowKeys.length}}</span>
            <a-button 
                size="small" 
                class="ml-10" 
                @click="removeOpt()"> 删除 </a-button>
        </a-col>
        <a-col :span="18" style="text-align: right;">
            <a-pagination 
                :total="total" 
                show-size-changer 
                show-quick-jumper
                :show-total="total => `共 ${total} 条记录`"
                @change="onPageChange"
                @showSizeChange="onPageSizeChange" />
        </a-col>
    </a-row> 


    <!-- 添加机器人弹框 -->
    <a-modal 
        v-model="visibleAddRobot" 
        title="添加机器人" 
        centered
        :maskClosable="false"
        @ok="visibleAddRobot = false"
        @cancel="addRobotCancel">
        <a-form-model  
            v-bind="{
                labelCol: { span: 4 },
                wrapperCol: { span: 10 },
            }" 
            :model="formData">
            <a-form-model-item label="机器人名称">
                <a-row :gutter="10">
                    <a-col :span="20">
                        <a-input v-model="formData.name" placeholder="请输入机器人名称" />
                    </a-col>
                    <a-col :span="4">
                        <a-button @click="getRobotName"> 随机名称 </a-button>
                    </a-col>
                </a-row> 
            </a-form-model-item>
            <a-form-model-item label="上传图片">
                <a-upload
                    name="reply_pic"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :data="{upload_dir: 'robot'}"
                    :show-upload-list="false"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    @change="handleUploadChange"
                >
                    <img v-if="avatar" style="width: 340px; height: 340px;" :src="avatar" alt="avatar" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">上传</div>
                    </div>
                </a-upload>
                <p>建议上传 40 *40 </p>
            </a-form-model-item>
        </a-form-model>
        <template slot="footer">
            <div style="text-align:center;"> 
                <a-button type="primary" @click="addRobot"> 保存 </a-button>
            </div>
        </template>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import mallMerchantApi from '@/api/mall/merchant/index'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default {
    name: 'RobotList',
    data() {
        return {
            visibleAddRobot: false,
            loading: false,
            formData: {
                name: '',
                avatar: ''
            },
            avatar: '',
            selectedRowKeys: [],
            total: 0,
            page: 1,
            pageSize: 10,
            // table表格头部
            columns: [
                {
                    title: '机器人信息',
                    dataIndex: 'robot_name',
                    key: 'robot_name',
                },
                {
                    title: '机器人头像',
                    dataIndex: 'avatar',
                    key: 'avatar',
                    scopedSlots: { customRender: 'avatar' },
                },
                {
                    title: '添加时间',
                    dataIndex: 'add_time',
                    key: 'add_time',
                    scopedSlots: { customRender: 'add_time' },
                },
                {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            //   列表数据
            dataList: []
        }
    },
    created() {
        this.getDataList()
    },
    methods: {
        moment,
        // 机器人列表
        // 获取table数据
        getDataList() {
            let params = {
                page: this.page,
                pageSize: this.pageSize
            }
            this.request(mallMerchantApi.getRobotList, params).then((res) => {
                this.dataList = res.list
                this.total = res.total
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.page = page
            this.getDataList()
        },
        // pageSize变化
        onPageSizeChange(page, pageSize) {
            this.pageSize = pageSize
            this.getDataList()
        },
        // 复选框
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        // 全选
        allCheck(e) {
            console.log(e,'e')
            if (e.target.checked) {
                this.selectedRowKeys = this.dataList.map(item => item.id)
            } else {
                this.selectedRowKeys = []
            }
        },
        // 删除机器人
        removeOpt(ids = '') {
            let title = '是否确定删除该机器人?'
            if (!ids) {
                ids = this.selectedRowKeys.length?this.selectedRowKeys.join(','):'';
                title = '是否确定删除所选机器人';
            }
            if (!ids && this.dataList.length) {
                this.$message.error('请选择需要删除的机器人');
                return
            }
            if (!this.dataList.length) return
            let params = {
                ids
            }
            this.$confirm({
                title: title,
                centered: true,
                onOk: () => {
                    this.request(mallMerchantApi.delRobot, params).then((res) => {
                        this.$message.success('操作成功！');
                        this.getDataList();
                        this.selectedRowKeys = []
                    })
                },
                onCancel() {},
            })
        },
        // 机器人添加
        // 随机名称
        getRobotName() {
            this.request(mallMerchantApi.getRobotName).then((res) => {
                this.$set(this.formData, 'name', res.name)
            })
        },
        // 上传图片
        handleUploadChange(info) {
            console.log('上传图片-info',info)
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                if (info.file.response.status == '1000') {
                    let imageUrl = info.file.response.data
                    this.$set(this.formData, 'avatar',imageUrl);
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.avatar = imageUrl
                        this.loading = false;
                    });
                }
            }
        },
        // 添加机器人保存
        addRobot() {
            this.request(mallMerchantApi.addRobot,this.formData).then((res) => {
                this.visibleAddRobot = false
                this.formData = this.$options.data().formData
                this.avatar = ''
                this.getDataList()
            })
        },
        // 添加机器人弹窗关闭
        addRobotCancel() {
            this.formData = this.$options.data().formData
            this.avatar = ''
        }
    },
}
</script>
<style scoped>

</style>