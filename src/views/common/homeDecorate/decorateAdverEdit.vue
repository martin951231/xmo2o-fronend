<template>
  <a-modal :visible="visible" width="650px" height="600px" @cancel="handleCancle" @ok="handleSubmit" :closable="false" :confirmLoading="confirmLoading">
    <div style="overflow-y:scroll; height: 600px">
      <a-form
        id="components-form-demo-validate-other"
        :form="form"
        v-bind="formItemLayout"
      >
        <a-form-item label="名称">
          <a-input
            :disabled="this.edited"
            v-decorator="['name', {initialValue:detail.now_adver.name,rules: [{required: true, message: '请输入名称'}]}]"/>
        </a-form-item>
<!--        <a-form-item label="通用广告">-->
<!--          <a-switch-->
<!--            :disabled="this.edited" checked-children="通用" un-checked-children="不通用"-->
<!--            v-decorator="['currency', {initialValue:detail.now_adver.currency == 1?true:false,valuePropName: 'checked'}]"-->
<!--            @change="switchComplete"/>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="所在区域" v-if="detail.now_adver.currency == false">-->
<!--          <a-cascader-->
<!--            :disabled="this.edited"-->
<!--            v-decorator="['areaList',{rules: [{required: true, message: '请选择区域'}]}]"-->
<!--            :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"-->
<!--            :options="areaList"-->
<!--            placeholder="请选择省市区"-->
<!--            :defaultValue="[detail.now_adver.province_id, detail.now_adver.city_id]"-->
<!--          />-->
<!--        </a-form-item>-->

        <a-form-item label="图片" extra="">
           <a-upload
              name="reply_pic"
              :file-list="fileListCover"
              :action="uploadImg"
              :headers="headers"
              list-type="picture-card"
              @preview="handlePreviewCover"
              @change="upLoadChangeCover($event)"
          >
          <div v-if="fileListCover.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
          </div>
          </a-upload>
          <a-modal :visible="previewVisibleCover" :footer="null" @cancel="handleCancelCover">
              <img alt="example" style="width: 100%" :src="previewImageCover" />
          </a-modal>
            <font style="color: red;">建议750*270px</font>
        </a-form-item>
        <a-form-item label="链接地址">
          <a-input
            :disabled="this.edited"
            v-decorator="['url', {initialValue:detail.now_adver.url}]"
            style="width: 249px"/>
          <a v-if="this.edited==false" class="ant-form-text" @click="setLinkBases">
            从功能库选择
          </a>
        </a-form-item>
        <a-form-item label="小程序中想要打开" v-if="isPlat">
          <a-select :disabled="this.edited"
                    v-decorator="['wxapp_open_type', {initialValue:detail.now_adver.wxapp_open_type}]">
            <a-select-option :value="1">
              打开其他小程序
            </a-select-option>
            <!--          <a-select-option value="2">-->
            <!--            打开其他APP-->
            <!--          </a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="打开其他小程序" v-if="isPlat">
          <a-select :disabled="this.edited" placeholder="请选择小程序"
                    v-decorator="['wxapp_id', {initialValue:detail.now_adver.wxapp_id}]">
            <a-select-option :value="item.appid" v-for="(item,index) in detail.wxapp_list">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="小程序页面"  v-if="isPlat">
          <a-input
            :disabled="this.edited" placeholder="请输入小程序页面路径"
            v-decorator="['wxapp_page', {initialValue:detail.now_adver.wxapp_page}]"
            style="width: 317px"/>
          <a-tooltip trigger="“hover">
            <template slot="title">
              即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。
            </template>
            <a-icon class="ml-10" type="question-circle"/>
          </a-tooltip>
        </a-form-item>
        <a-divider v-if="isPlat">打开其他APP</a-divider>
        <a-form-item label="APP中想要打开" v-if="isPlat">
          <a-select :disabled="this.edited"
                    v-decorator="['app_open_type', {initialValue:detail.now_adver.app_open_type}]"
                    @change="changeAppType">
            <a-select-option :value="1">
              打开其他小程序
            </a-select-option>
            <a-select-option :value="2">
              打开其他APP
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择苹果APP" v-if="detail.now_adver.app_open_type == 2 && isPlat">
          <a-select :disabled="this.edited" placeholder="选择苹果APP"
                    v-decorator="['ios_app_name', {initialValue:detail.now_adver.ios_app_name}]">
            <a-select-option :value="item.url_scheme" v-for="(item,index) in detail.app_list" :key="index">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="苹果APP下载地址" v-if="detail.now_adver.app_open_type == 2 && isPlat">
          <a-input :disabled="this.edited" placeholder="请输入苹果APP下载地址"
                   v-decorator="['ios_app_url', {initialValue:detail.now_adver.ios_app_url}]"/>
        </a-form-item>
        <a-form-item label="安卓APP包名" v-if="detail.now_adver.app_open_type == 2 && isPlat">
          <a-input :disabled="this.edited" placeholder="请输入安卓APP包名"
                   v-decorator="['android_app_name', {initialValue:detail.now_adver.android_app_name}]"/>
        </a-form-item>
        <a-form-item label="安卓APP下载地址" v-if="detail.now_adver.app_open_type == 2 && isPlat">
          <a-input :disabled="this.edited" placeholder="请输入安卓APP下载地址"
                   v-decorator="['android_app_url', {initialValue:detail.now_adver.android_app_url}]"/>
        </a-form-item>
        <a-form-item label="打开其他小程序" v-if="detail.now_adver.app_open_type == 1 && isPlat">
          <a-select :disabled="this.edited" placeholder="选择小程序"
                    v-decorator="['app_wxapp_id', {initialValue:detail.now_adver.app_wxapp_id}]">
            <a-select-option :value="item.appid" v-for="(item,index) in detail.wxapp_list" :key="index">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="小程序页面" v-if="detail.now_adver.app_open_type == 1 && isPlat">
          <a-input
            :disabled="this.edited"
            placeholder="请输入小程序页面路径"
            v-decorator="['app_wxapp_page', {initialValue:detail.now_adver.app_wxapp_page}]"
            style="width: 317px"/>
          <a-tooltip trigger="“hover">
            <template slot="title">
              即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。
            </template>
            <a-icon class="ml-10" type="question-circle"/>
          </a-tooltip>
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number
            :disabled="this.edited"
            v-decorator="['sort', { initialValue: detail.now_adver.sort }]"
            :min="0"/>
          <span class="ant-form-text">
        值越大越靠前
      </span>
        </a-form-item>
        <a-form-item label="状态">
          <a-switch :disabled="this.edited" checked-children="开启" un-checked-children="关闭"  v-decorator="['status',{initialValue:detail.now_adver.status==1 ? true : false,valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        </a-form-item>
      </a-form>
    </div>

    <link-bases ref="linkModel"></link-bases>
  </a-modal>

</template>
<script>
  import homedecorateApi from "@/api/common/homedecorate";
  import LinkBases from "@/views/common/platform/linkBases/LinkBases";
  import uploadApi from '@/api/common/uploads'

  export default {
    name: "decorateAdverEdit",
    components: {LinkBases},
    data() {
      return {
        visible: false,
        form: this.$form.createForm(this),
        id: '',
        type: 1,
        url: '',
        edited: true,
        cat_key: '',
        title: '',
        areaList: '',
        detail: {
          now_adver:{

          }
        },
        previewVisible: false,
        previewImage: '',
        length: 0,
        pic: '',      
        headers: {
            authorization: 'authorization-text',
        },           
        uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/adver/images',

        fileList: [],
        fileListCover: [],
        previewVisibleCover: false,
        previewImageCover: null,
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
        isPlat:true,
        confirmLoading:false
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {
        console.log(this.cat_key,'cat_key111')
        this.form = this.$form.createForm(this, {name: 'validate_other'});
      this.getAllArea()
    },
    methods: {
      editOne(id, edited, type, cat_key, title) {
        this.visible = true
        this.edited = edited
        this.type = type
        this.id = id
        this.cat_key = cat_key
        this.title = title
        this.getAllArea()
        console.log(cat_key,'cat_key')
        if(cat_key == 'banking_index_adver' || cat_key =='banking_electronic_adver'){
          this.isPlat = false
        }else{
          this.isPlat = true
        }
        this.request(homedecorateApi.getEdit, {id: id}).then(res => {
          this.detail = res
          if (this.detail.now_adver.pic) {
             this.fileListCover[0] = {
                uid: 1,
                name: 'image.png',
                status: 'done',
                url: this.detail.now_adver.pic,
                data: this.detail.now_adver.pic
            };
            this.length = this.fileList.length
            this.pic = this.detail.now_adver.pic
          }
        })
      },
      handleCancle() {
        this.visible = false
      },
      //获取地区信息
      getAllArea() {
        this.request(homedecorateApi.getAllArea, {type: 1}).then(response => {
          console.log(response)
          this.areaList = response
        })
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            values.id = this.id
            values.cat_key = this.cat_key
            // values.currency = values.currency == true ? 1 : 0
            values.pic = this.pic
            if (!values.areaList) {
              values.areaList = []
            }
            console.log(values)
            this.confirmLoading = true
            this.request(homedecorateApi.addOrEditDecorate, values).then(res => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
                this.$emit('update', {cat_key: this.cat_key, title: this.title})
              } else {
                this.$message.success('添加成功')
              }
              setTimeout(() => {
                this.pic='';
                this.form = this.$form.createForm(this)
                this.visible = false
                this.$emit('ok', values)
                this.confirmLoading = false
              }, 1500)
            })
          }
        });
      },
      switchComplete(value) {
        // this.detail.now_adver.currency = value
      },
      changeAppType(value) {
        this.detail.now_adver.app_open_type = value
      },
      async handlePreviewCover(file) {
          if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj);
          }
          this.previewImageCover = file.url || file.preview;
          this.previewVisibleCover = true;
      },
      // 上传封面图
      upLoadChangeCover(info) {
            // 图片列表
          let fileList = [...info.fileList]

          fileList = fileList.slice(-1)
          fileList = fileList.map((file) => {
              if (file.response) {
              file.url = file.response.data.full_url
              this.pic = info.file.response.data.image
              }
              return file
          })
          this.fileListCover = fileList
          if (info.file.status === 'done') {
          } else if (info.file.status === 'error') {
              this.$message.error(`${info.file.name} 上传失败.`)
          }
      },
      handleCancelCover() {
          this.previewVisibleCover = false;
      },

      setLinkBases() {
        this.$LinkBases({
          // visible: true,
          source: 'platform', // 必填
          type: 'h5', // 必填
          // 确定按钮
          handleOkBtn: (res) => {
            // 点击按钮事件
            console.log('handleOk', res)
            this.url = res.url
            this.$nextTick(() => {//链接库动态赋值
              this.form.setFieldsValue({
                url: this.url,
              })
            });
          },
          // handleCancelBtn: () => {
          //   console.log('handleCancel')
          // }
        })
      },
    }
  }
</script>

<style>
  #components-form-demo-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
  }

  .delete-pointer {
    font-size: 13px;
    color: gray;
    position: absolute;
    left: 62px;
  }

  .ant-upload.ant-upload-select-picture-card {
    width: 75px;
    height: 75px;
    margin-right: 0;
    margin-bottom: 0;
  }
</style>