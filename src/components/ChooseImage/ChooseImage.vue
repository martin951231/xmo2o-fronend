/**
*******************
*   @author Liz
*   @date 2020-10-28
*   @description 从图片库选择图片或者上传新图片
*******************
*/

<template>
    <a-modal
        title="请选择素材"
        width="800px"
        centered
        :visible="visible"
        @ok="handleOk"
        @cancel="handleCancel"
        class="dialog"
        :bodyStyle="{position: 'relative'}"
        :destroyOnClose="true"
    >
        <a-button type="danger" class="delelt-item" @click="deleteItem" v-if="this.checkedList.length>0">删除</a-button>
        <a-tabs type="card" defaultActiveKey="1" @change="onTabChange">
            <a-tab-pane key="1" tab="从素材库选择">
                <div class="content scroll_content1">
                    <template v-if="imageList.length">
                        <div
                            class="img-list"
                            @click="chooseImage(item, index)"
                            v-for="(item, index) of imageList"
                            :key="'img_' + index"
                            :style="item.selected ? 'border: 1px solid rgb(24,144,255)' : ''"
                        >
                            <img v-if="type == 'image'" class="goods-img" :src="item.img" />
                            <video
                                v-if="type == 'video'"
                                class="goods-img"
                                :src="item.img.url"
                                :poster="item.img.image"
                            />
                            <img
                                v-show="item.selected"
                                class="selected"
                                src="../../assets/merchant/mall_imgbox_selected.png"
                            />
                        </div>
                    </template>
                    <template v-else>
                        <div class="no-data">暂无素材</div>
                    </template>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="上传新素材">
                <div class="content scroll_content">
                    <template v-if="checkedList.length < this.max">
                        <a-upload
                            :action="action"
                            :name="uploadName"
                            :data="{ upload_dir: upload_dir, store_id: store_id }"
                            list-type="picture-card"
                            :file-list="uploadList"
                            :multiple="multiple"
                            :showUploadList="showUploadList"
                            @change="handleUploadChange"
                            :accept="accept"
                            :before-upload="beforeUpload"
                        >
                            <div v-if="showUpload">
                                <a-icon style="font-size: 32px; color: #999" :type="loading ? 'loading' : 'plus'" />
                            </div>
                        </a-upload>
                    </template>
                    <template v-else>
                        <div class="no-data">您最多可选择{{ max }}个{{ typeTxt }}</div>
                    </template>
                </div>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>
<script>
import mallMerchantApi from '@/api/mall/merchant/index'
export default {
    name: 'ChooseImage',
    props: {
        //   回传的唯一标识
        name: {
            type: String,
            default: '',
        },
        //   最多上传
        max: {
            type: Number,
            default: 0, // 0表示不限量
        },
        // 存放路径
        upload_dir: {
            type: String,
            default: '',
        },
        // 店铺id
        store_id: {
            type: [String, Number],
            default: '',
        },
        // 上传的类型：image图片 video视频
        type: {
            type: String,
            default: 'image',
        },
    },
    data() {
        return {
            visible: false,
            uploadList: [],
            imageList: [],
            checkedList: [],
            typeTxt: '图片',
            action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            deleteItemUrl: '/common/common.UploadFile/deleteMallImage',
            uploadName: 'reply_pic',
            showUploadList: true,
            loading: false,
        }
    },
    computed: {
        showUpload() {
            if (this.max == 0 || this.uploadList.length + this.checkedList.length < this.max || !this.showUploadList) {
                return true
            } else {
                return false
            }
        },
        multiple() {
            if (this.max == 1 || this.checkedList.length == this.max - 1) {
                return false
            } else {
                return true
            }
        },
        // 接受上传的文件类型字符串，字符串，video/*意思是“任何视频文件”。image/*意思是“任何图像文件”
        accept() {
            return this.type == 'image' ? 'image/*' : 'video/*'
        },
    },
    watch: {
        type() {
            this.initData()
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.initData()
        })
    },
    methods: {
        initData() {
            this.typeTxt = this.type == 'image' ? '图片' : '视频'
            this.action =
                this.type == 'image'
                    ? '/v20/public/index.php/common/common.UploadFile/uploadPictures'
                    : '/v20/public/index.php/common/common.UploadFile/uploadVideo'
            this.uploadName = this.type == 'image' ? 'reply_pic' : 'reply_mv'
            this.showUploadList = this.type == 'image' ? true : false
        },
        openDialog() {
            this.visible = true
            this.init()
        },
        getImageList() {
            let params = {
                type: this.type,
                dir: this.upload_dir,
            }
            if (this.store_id != '') {
                params.store_id = this.store_id
            }
            this.request(mallMerchantApi.getUploadImages, params).then((data) => {
                if (data.length) {
                    this.imageList = data.map((item) => {
                        if (this.type == 'image') {
                            return { img: item, selected: false }
                        } else {
                            // 视频
                            return { img: { url: item.url, image: item.image, vtime: item.vtime,id:item.id }, selected: false }
                        }
                    })
                }
            })
        },
        //   初始化
        init() {
            this.$set(this, 'uploadList', [])
            this.$set(this, 'checkedList', [])
            this.$set(this, 'imageList', [])
            this.$nextTick(() => {
                this.getImageList()
            })
        },
        //   确定
        handleOk() {
            console.log(this.checkedList)
            let list = []
            const domain = location.origin
            if (this.checkedList.length) {
                if (this.type == 'image') {
                    list = [...this.checkedList]
                } else {
                    list.push(this.checkedList[0].url)
                    list.push(this.checkedList[0].image)
                    list.push(this.checkedList[0].vtime)
                }
            }
            if (this.uploadList.length && this.showUploadList) {
                this.uploadList.forEach((item) => {
                    if (item.response && item.response.data) {
                        if (this.type == 'image') {
                            list.push(domain + item.response.data)
                        } else if (this.type == 'video') {
                            list.push(domain + item.response.data.url)
                            // image 返回的是完整链接，不需要再拼上域名
                            list.push(item.response.data.image)
                            list.push(item.response.data.vtime)
                        }
                    }
                })
            }
            console.log(111111111, list)
            if (list.length == 0) {
                this.$message.error('至少得选择一个素材')
                return
            }
            this.$emit('callback', { list, name: this.name })
            this.handleCancel()
        },
        //   取消
        handleCancel() {
            this.visible = false
        },
        // 切换tab
        onTabChange(val) {},
        // 上传图片
        handleUploadChange({ file, fileList }) {
            console.log('----------file', file)
            console.log('----------fileList', fileList)
            const { status, response } = file
            if (status == 'uploading') {
                this.loading = true
            }
            if (status === 'done') {
                if (response.status == 1000) {
                    const length = this.max - this.checkedList.length
                    fileList = fileList.slice(-length)
                    if (this.type == 'video') {
                        this.showUploadList = { showPreviewIcon: false, showRemoveIcon: true }
                    }
                } else {
                    if (response.msg) {
                        this.$message.error(response.msg)
                    }
                    if (this.type == 'video') {
                        this.showUploadList = false
                    }
                }
                this.loading = false
            }
            if (status == 'error') {
                this.loading = false
                this.$message.error('上传失败')
            }

            // 多文件上传这个必须有无论file上传状态如何，filelist一定要同步，要不然就没有回调了
            this.uploadList = [...fileList]
        },
        // 选择图片
        chooseImage(item, index) {
            if (!item.selected) {
                // 选中
                if (this.checkedList.length == this.max - this.uploadList.length) {
                    this.$message.warning('您最多可选择（包含上传）' + this.max + '个' + this.typeTxt)
                } else {
                    item.selected = true
                    this.checkedList.push(item.img)
                    this.$set(this.imageList, index, item)
                }
            } else {
                // 不选中
                item.selected = false
                this.$set(this.imageList, index, item)
                for (let i in this.checkedList) {
                    if (this.checkedList[i] == item.img) {
                        this.checkedList.splice(i, 1)
                        return
                    }
                }
            }
        },
        // 上传文件之前的钩子
        beforeUpload(file) {
            return false, Promise.all([this.checkType(file)])
        },
        checkType(file) {
            return new Promise((resolve, reject) => {
                if (file.type.indexOf(this.type) == -1) {
                    this.$message.error(
                        this.L(
                            this.type == 'image'
                                ? '您上传的图片文件格式不正确！请重新选择'
                                : '您上传的视频文件格式不正确！请重新选择'
                        )
                    )
                    reject()
                } else {
                    console.log('类型正确')
                    resolve()
                }
            })
        },
        //删除列表数据
        deleteItem(){
            let url = []
            if(this.type == 'image'){
                url = this.checkedList
            }else{
                this.checkedList.forEach(v=>{
                url.push(v.id)
            })
            }
            this.$confirm({
            title: '确定删除吗?',
            okText: '确定',
            okType: 'danger',
            centered:true,
            cancelText: '取消',
            onOk:()=> {
                console.log('OK');
                this.request(this.deleteItemUrl, this.type == 'image'?{url_lists:url}:{ids: url}).then((data) => {
                    this.$message.success("删除成功！")
                    this.init();
                })
            },
        });
        },
    },
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
</script>
<style  scoped>
.content {
    height: 600px;
}
.img-list {
    width: 94px;
    height: 94px;
    padding: 8px;
    margin-right: 8px;
    margin-bottom: 8px;
    border: 1px solid #d9d9d9;
    float: left;
    position: relative;
}
.img-list .goods-img {
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.img-list .selected {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -6px;
    top: -6px;
}
.no-data {
    text-align: center;
    padding-top: 40px;
    font-size: 14px;
    color: #999999;
}
.scroll_content1 {
    padding-top: 10px;
    height: 700px;
    border-right: 1px solid #eeeeee;
    overflow-y: scroll;
}
.scroll_content /deep/ .ant-upload-list-picture-card {
    margin-bottom: 0 !important;
}
.delelt-item{
    position: absolute !important;
    right: 20px;
    top: 26px;
    z-index: 999;
}
</style>