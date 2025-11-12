<template>
  <a-modal :title="title" :width="900" style="margin-top: 100px;" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
         <div class="clearfix">
              <a-upload
                name="img"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
              >
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancels" style="margin-top: 10px">
                <img alt="example" style="margin-top:20px;width: 100%;" :src="previewImage" />
              </a-modal>
            </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    export default {
        data() {
            return {
                title: '查看附件',
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                assets_num_id:0,
                fileList: [],
                previewVisible: false,
                previewImage: '',
            }
        },
        mounted() {
        },
        methods: {
            look(id,assets_num_id) {
                this.title = '查看附件'
                this.visible = true
                this.assets_num_id = assets_num_id;
                this.id = id;
                this.getEditInfo();
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            handleCancels() {
                this.previewVisible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getMaintainInfo, {
                    id: this.id,
                    assets_num_id: this.assets_num_id
                })
                    .then((res) => {
                        if (typeof(res.info)=='object') {
                            this.fileList = res.info.imgList;
                        }
                    })
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleChange({fileList}) {
                this.fileList = fileList;
                console.log('th',this.fileList);
            },
        },
    }
</script>
<style>
  .ant-upload-list-picture-card .ant-upload-list-item {
    float: left;
    width: 104px;
    height: 104px;
    margin: 8px 8px 0 0;
  }
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>