<template>
    <a-modal v-model="visible" @ok="handleOk" :title="title">
        <p>
            文件:
            <a-upload name="file" :data="{ upload_dir: 'mall/order'}" action="/v20/public/index.php/common/common.UploadFile/uploadFile" :file-list="fileList" @change="uploadFile">
                <a-button>
                    <a-icon type="upload" />点击上传文件
                </a-button>
            </a-upload>
        </p>
        <p>
            <a type="link" @click="downLodExcel">下载表格模板</a>
        </p>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            fileList: [],
            file_url: '',
            title: '',
        }
    },
    methods: {
        open(title) {
            this.fileList = [];
            this.file_url = '';
            this.visible = true
            this.title = title
        },
        handleOk() {
            if(this.fileList.length == 0){
                this.$message.info(this.L('请上传文件'));
                return
            }
            this.$emit('handleOk', this.fileList[0])
        },
        downLodExcel() {
            window.open(location.origin+ '/static/file/mall_order_delivery.xlsx')
        },
        uploadFile(fileList) {
            let fileList1 = [...fileList.fileList]
            // 1. Limit the number of uploaded files
            //    Only to show two recent uploaded files, and old ones will be replaced by the new
            fileList1 = fileList1.slice(-1)
            // 2. read from response and show file link
            fileList1 = fileList1.map((file) => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.url
                }
                return file
            })

            this.fileList = fileList1

            if (fileList1[0] && fileList1[0].status == 'done') {
                this.file_url = fileList1[0].response.data
            }
        },
    },
}
</script>

<style lang="scss" scoped>
</style>