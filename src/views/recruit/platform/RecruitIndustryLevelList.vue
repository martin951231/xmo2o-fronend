<template>
  <a-modal :title="title" :width="800" :height="600" :visible="visible" @cancel="handelCancle" @ok="handleOk" footer="">
    <div>
      <a-button type="primary" style="margin-bottom: 10px" @click="$refs.createModal.add(fid)">新增</a-button>
      <a-table :columns="columns" :data-source="list" :scroll="{ y: 700 }" rowKey="id" :pagination="pagination">
        <span slot="sort" slot-scope="text, record">
            <a-input-number :min="0" step="1" style="width: 100px" v-model="record.sort"
            @blur="handleSortChange(text,record.id)"/>
        </span>
        <span slot="action" slot-scope="text, record">
            <a @click="$refs.createModal.edit(record.id, record.fid)">编辑</a>
            <a-divider type="vertical"/>
            <a @click="del(record.id)">删除</a>
        </span>
      </a-table>
      <recruit-industry-level-create ref="createModal" @ok="handleOk" />
    </div>
  </a-modal>
</template>

<script>
  import RecruitIndustryLevelCreate from "./RecruitIndustryLevelCreate";
  import recruitPlatformApi from '@/api/recruit/platform';

  const columns = [
    {
        title: '行业分类',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        scopedSlots: { customRender: 'sort' },
    },
    {
        title: '操作',
        dataIndex: '',
        key: 'x',
        scopedSlots: {customRender: 'action'}
    },
  ];
  export default {
    name: "RecruitIndustryLevelList",
    components: {
      RecruitIndustryLevelCreate,
    },
    data() {
      return {
        visible: false,
        add_visible: false,
        title: '',
        desc: '',
        fid: '',
        columns,
        list: [],
        tab_key: 1,
        form: this.$form.createForm(this),
        id: '',
        type: 3,
        is_search: false,
        page:1,
        pageSize:10,
        currency: 1,
        fileList: [],
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
        pagination: {
          current: 1,
          total: 0,
          pageSize: 10,
          showSizeChanger: true,
          onChange: this.onPageChange,
          onShowSizeChange: this.onPageSizeChange,
          showTotal: (total) => `共 ${total} 条记录`,
        },
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {},
    methods: {
      init() {},
      // 提交搜索表单
      submitForm(is_search = false) {
          let params = {...this.searchForm}
          delete params.time
          this.is_search = is_search
          this.getAtlastSpecial(this.fid, this.title, false)
      },
      getAtlastSpecial(fid, titles, is_search) {
        this.visible = true
        this.title = titles
        this.fid = fid
        if (is_search == true) {
          this.page = 1
          this.$set(this.pagination, 'current', 1)
        } else {
          this.page = this.pagination.current
          this.$set(this.pagination, 'current', this.pagination.current)
        }
        this.pageSize = this.pagination.pageSize
        this.request(recruitPlatformApi.getRecruitIndustryLevelList, {fid:fid, page:this.page, pageSize:this.pageSize}).then(res => {
          this.list = res.list
          this.$set(this.pagination, 'total', res.count)
        })
      },
      handelCancle() {
        this.visible = false
      },
      // 设置排序
      handleSortChange(val, id) {
          this.request(recruitPlatformApi.getRecruitIndustrySort, {
              id: id,
              sort: val,
          }).then((res) => {
              this.getAtlastSpecial(this.fid, this.title, false)
          })
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
      // 删除
      del(id) {
          this.$confirm({
              title: '提示',
              content: '是否确认删除？',
              onOk: () => {
                  this.request(recruitPlatformApi.getRecruitIndustryDel, {id: id}).then((res) => {
                      this.getAtlastSpecial(this.fid, this.title, false)
                      this.$message.success('删除成功')
                  })
              },
              onCancel() {},
          });
      },
      handleCancle() {
        this.add_visible = false
        this.pic=''
      },
      handleOk(e) {
        this.getAtlastSpecial(this.fid, this.title, false)
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