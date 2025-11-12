<template>
  <a-modal :visible="visible" width="750px" :height="height" @cancel="handleCancle" @ok="handleSubmit" :closable="false">
    <div :style="[{ height: height }, { 'overflow-y':'scroll' }]">
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
        <a-form-item label="通用广告" v-if="this.cat_key !== 'wap_life_tools_ticket_slider'">
          <a-switch
            :disabled="this.edited" checked-children="通用" un-checked-children="不通用"
            v-decorator="['currency', {initialValue:detail.now_adver.currency == 1?true:false,valuePropName: 'checked'}]"
            @change="switchComplete"/>
        </a-form-item>
        <a-form-item label="所在区域" v-if="detail.now_adver.currency == false">
          <a-cascader
            :disabled="this.edited"
            v-decorator="['areaList',{rules: [{required: true, message: '请选择区域'}]}]"
            :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
            :options="areaList"
            placeholder="请选择省市区"
            :defaultValue="[detail.now_adver.province_id, detail.now_adver.city_id]"
          />
        </a-form-item>
        <a-form-item label="图片" extra="">
          <div class="clearfix">
            <img width="75px" height="75px" v-if="pic_show" :src="this.pic"/>
            <a-icon
              v-if="pic_show"
              class="delete-pointer"
              type="close-circle"
              theme="filled"
              @click="removeImage"
            />
            <a-upload
              list-type="picture-card"
              name="reply_pic"
              :data="{ upload_dir: 'employee/pictures'}"
              :multiple="true"
              action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
              @change="handleUploadChange"
              @preview="handleUploadPreview"
            >
              <div v-if="(this.length <1) && !this.pic_show">
                <a-icon type="plus"/>
                <div class="ant-upload-text">
                  选择图片
                </div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleUploadCancel">
              <img alt="example" style="width: 100%" :src="previewImage"/>
            </a-modal>
          </div>

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
        <a-form-item label="设置仅为员工可见">
            <a-button type="primary" @click="onAddInput">
            添加
            </a-button>
          
            <div class="goods-container" v-for="(item, index) in selectedLable" :key="index">
              <div class="goods-content">
                  <div class="goods-content-box">
                      <div class="goods-content-left">
                          <a-form  :label-col="{span:3}" :wrapper-col="{span:20}" >
                              <a-form-item label="商家" >
                                  <a-select 
                                      style="width:80%"
                                      placeholder="请选择商家"
                                      @change="selecteMerChangge($event, index)"
                                      :value="item.mer_id"
                                  >
                                      <a-select-option v-for="(mer) in lableList" :key="mer.mer_id" :value="mer.mer_id">{{mer.name}}</a-select-option>
                                  </a-select>
                              </a-form-item>
                                <div  v-for="(mer) in lableList" :key="mer.mer_id">
                                  <a-form-item label="标签" v-if="mer.mer_id == item.mer_id">
                                      <a-select 
                                          style="width:80%"
                                          placeholder="请选择标签"
                                          mode="multiple"
                                          @change="selecteLableChangge($event, index)"
                                          :value="item.lables"
                                      >
                                          <a-select-option v-for="(labelVal) in mer.lables" :key="labelVal.lable_id" :value="labelVal.lable_id">{{labelVal.name}}</a-select-option>
                                      </a-select> 
                                  </a-form-item>
                                </div>
                          </a-form>
                      </div>
                      <div class="goods-content-right">
                          <a-button type="danger" @click="delPrivateSpec(index)">删除</a-button>
                      </div>
                  </div>
              </div>
          </div>
          
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
  import employeePlatformApi from "@/api/employee/platform";
  import LinkBases from "@/views/common/platform/linkBases/LinkBases";

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
          height: '600px',
        edited: true,
        cat_key: '',
        title: '',
        areaList: '',
          activity_id: 0,
        detail: {
          now_adver:{
            name:'',
            pic:'',
            status:0,
          }
        },
        previewVisible: false,
        previewImage: '',
        fileList: [],
        length: 0,
        pic: '',
        pic_show: false,
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
        selectedLable:[],
        lableList:[]
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {
      this.getAllArea()
    },
    methods: {
      editOne(id, edited, type, activity_id, title) {
        this.visible = true
        this.edited = edited
        this.type = type
        this.id = id
        this.activity_id = activity_id
        this.title = title
        this.getAllArea()
        this.getlableAll()
        if(id > 0){
          this.request(employeePlatformApi.getActivityAdver, {id: id}).then(res => {
            this.removeImage()
            this.detail = res
            this.selectedLable = res.lable_arr || []
            if (this.detail.now_adver.pic) {
              this.fileList = [
                {
                  uid: '-1',
                  name: '当前图片',
                  status: 'done',
                  url: this.detail.now_adver.pic,
                }
              ]
              this.length = this.fileList.length
              this.pic = this.detail.now_adver.pic
              this.pic_show = true
            }
          })
        }else{
          this.detail.now_adver = {
            name:'',
            pic:'',
            status:0,
          }
          this.selectedLable = []
          this.removeImage()
        }
      },
      handleCancle() {
        this.visible = false
      },
      //获取地区信息
      getAllArea() {
        this.request(employeePlatformApi.getAllArea, {type: 1}).then(response => {
          console.log(response)
          this.areaList = response
        })
      },
      getlableAll(){
          this.request(employeePlatformApi.getlableAll, {}).then((res) => {
              this.lableList = res
          })
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
            console.log(44444,this.activity_id)
          if (!err) {
            values.id = this.id
            values.activity_id = this.activity_id
            values.currency = values.currency == true ? 1 : 0
            values.pic = this.pic
            if (!values.areaList) {
              values.areaList = []
            }

            values.lable_arr = this.selectedLable
            if(values.lable_arr.length > 0){
                let error = values.lable_arr.find((item)=>{
                    return item.mer_id <= 0 || item.lables.length <= 0
                })
                if (error) {
                    this.$message.error("未选择商家或者标签");
                    return false;
                }
            }
            console.log(values)
            this.request(employeePlatformApi.addOrEditActivityAdver, values).then(res => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('添加成功')
              }
               this.$emit('update', this.activity_id)
              setTimeout(() => {
                this.pic='';
                this.form = this.$form.createForm(this)
                this.visible = false
                this.$emit('ok', values)
              }, 1500)
            })
          }
        });
      },
      switchComplete(value) {
        this.detail.now_adver.currency = value
      },
      handleUploadChange({fileList}) {
        this.fileList = fileList
        if (!this.fileList.length) {
          this.length = 0
          this.pic = ''
        }
        if (this.fileList[0].status == 'done') {
          this.length = this.fileList.length
          this.pic = this.fileList[0].response.data
        }
      },
      handleUploadCancel() {
        this.previewVisible = false;
      },
      async handleUploadPreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      removeImage() {
          console.log(1111,this.fileList)
          if (this.fileList != undefined) {
              this.fileList.splice(0, this.fileList.length)
          } else {
              this.fileList = []
          }
        this.length = this.fileList.length
        this.pic = ''
        this.pic_show = false
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
      //   添加标签信息
      onAddInput () {          
          this.selectedLable.push({
              lables: [], 
          })
      },
      // 标签删除
      delPrivateSpec (index) {
          this.selectedLable.splice(index, 1)
      },
      // 切换商家
      selecteMerChangge(val, index){
          // 查看此商家是否已经选择过了
          let error = this.selectedLable.find((item)=>{
              return item.mer_id == val
          })
      
          if (error) {
              this.$message.error("该商家已添加过");
              return false;
          }else{
              let current = this.selectedLable[index]
              current['mer_id'] = val
              current['lables'] = []
              this.$set(this.selectedLable, index, current)
          }
      },
      // 切换标签
      selecteLableChangge(val, index){
          console.log(val,'val2')
          let current = this.selectedLable[index]
          current['lables'] = val
            this.$set(this.selectedLable, index, current)
      }
    }
  }
</script>

<style scoped>
  #components-form-demo-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
  }

  .ant-form-item {
    margin-bottom: 5px;
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

  .specification{
      font-size: 18px;
  }

  .goods-spec {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
  }
  .goods-spec .goods-spec-add {
      margin-right: 15px;
  }

  .goods-container .button-new-tag {
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
  }
  .goods-container .input-new-tag {
      width: 90px;
      margin-right: 10px;
  }
  .goods-container .el-tag {
      margin-right: 10px;
  }
  .goods-container .goods-content {
      margin-bottom: 10px;
      padding: 14px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      background-color: #fcfcfc;
  }
  .goods-content .goods-content-box {
      display: flex;
      align-items: center;
  }
  .goods-content-box .goods-content-left {
      flex: 1;
  }

  .goods-img {
      width: 80px;
      height: 80px;
      margin: 10px;
      border-radius: 5px;
      position: relative;
      display: inline-block;
      border: 1px solid #d9d9d9;
  }
  .goods-img .delete {
      position: absolute;
      right: 0px;
      top: 0px;
  }
  .goods-img img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
  }
</style>