<template>
  <a-modal :title="title" :width="1100" :height="600" :visible="visible" @cancel="handelCancle" @ok="handleOk" footer="">
    <div>
      <a-button type="primary" style="margin-bottom: 10px" @click="$refs.createModal.addSub(cat_id)">添加填写项</a-button>
      <a-table :columns="columns" :data-source="list" :scroll="{ y: 700 }" rowKey="id" :pagination="false">
        <span slot="sort" slot-scope="text,record">{{ record.sort }}</span>
        <span slot="name" slot-scope="text,record">{{ record.name }}</span>
        <span slot="type_id" slot-scope="text">
          <div v-if="text == 0">单选</div>
          <div v-if="text == 1">多选</div>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="deleteConfirm(record.id)">
              <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <atlas-special-create ref="createModal" @ok="handleOk" />
    </div>
  </a-modal>
</template>

<script>
  import atlascategoryPlatformApi from '@/api/atlas/merchant';
  import AtlasSpecialCreate from "@/views/atlas/merchant/AtlasSpecialCreate";

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      key: 'sort',
      scopedSlots: {customRender: 'sort'},
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '选择类型',
      dataIndex: 'type_id',
      key: 'type_id',
      scopedSlots: {customRender: 'type_id'},
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: {customRender: 'action'},
    },
  ];
  export default {
    name: "atlasCategorySpecialList",
    components: {AtlasSpecialCreate},
    data() {
      return {
        visible: false,
        add_visible: false,
        title: '',
        desc: '',
        cat_id: '',
        columns,
        list: [],
        tab_key: 1,
        form: this.$form.createForm(this),
        id: '',
        type: 3,
        currency: 1,
        fileList: [],
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {},
    methods: {
      init() {},
      getAtlastSpecial(cat_id, titles) {
        this.visible = true
        this.title = titles
        this.cat_id = cat_id
        this.request(atlascategoryPlatformApi.getAtlasSpecialList, {cat_id: cat_id}).then(res => {
          console.log(res)
          this.list = res
        })
      },
      handelCancle() {
        this.visible = false
      },
      deleteConfirm(id){
        this.request(atlascategoryPlatformApi.getAtlasSpecialDel,{'id':id})
          .then((res) => {
              this.getAtlastSpecial(this.cat_id, this.title)
              this.$message.success('删除成功')
          })
      },
      handleCancle() {
        this.add_visible = false
        this.pic=''
      },
      handleOk(e) {
        this.visible = false
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            values.cat_id = this.cat_id
            values.currency = values.currency === false ? 0 : 1
            values.pic = this.pic
            if (!values.areaList) {
              values.areaList = []
            }
            console.log(values)
            this.request(atlascategoryPlatformApi.getAtlasSpecialCreate, values).then(res => {
              this.$message.success('添加成功')
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.pic=''
                this.getAtlastSpecial(this.cat_id, this.title)
                this.add_visible = false
              }, 1500)
            })
          }
        });
      },
      switchCurrency(value) {
        this.currency = value
      },
      changeAppType(value) {
        this.app_open_type = value
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
            this.$nextTick(() => {  //链接库动态赋值
              this.form.setFieldsValue({
                url: this.url,
              })
            });
          },
        })
      },
    }
  }
</script>
<style scoped>
  .ant-modal-body {
    padding: 24px 0 24px 24px !important;
  }
</style>