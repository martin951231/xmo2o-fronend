<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- 筛选 -->
    <a-row style="margin: 5px 0; display: flex; align-items: center">
      <div class="flag" style="margin-left: 20px">
        <a-input style="width: 300px" v-model="keywords" placeholder="请输入分类名称" />
      </div>
      <a-button type="primary" style="margin: 10px 10px 10px 10px" @click="search">搜索</a-button>
    </a-row>
    <a-row type="flex" align="middle" class="center">
      <div class="btn_list">
        <a-button type="primary" style="margin: 10px 20px" @click="addClick">{{ L('新增') }}</a-button>
      </div>
    </a-row>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
    >
      <span slot="sort" slot-scope="text, record">
        <a-input-number :min="0" id="inputNumber" :value="record.sort" @blur="setListSort($event, record)" />
      </span>
      <!-- 操作栏 -->
      <span slot="operation" slot-scope="text, record">
        <a class="inline-block" @click="editList(record)">{{ L('编辑') }}</a>
        <a style="color: red;margin-left: 10px" class="inline-block" @click="delList(record)">{{ L('删除') }}</a>
      </span>
    </a-table>

    <!-- 新建弹框 -->
    <a-modal
      :centered="true"
      :maskClosable="false"
      destroyOnClose
      width="35%"
      v-model="visible"
      :title="titles"
      @ok="addOk"
    >
      <div class="newBox">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="分类名称" prop="name">
            <a-input v-model="form.name" placeholder="请输入分类名称" />
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-input-number :min="0" id="inputNumber" v-model="form.sort" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import cardMerchantApi from '@/api/card/merchant'
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      visible: false,
      titles: '新建',
      //table表格头部
      columns: [
        {
          title: this.L('分类名称'),
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
        },
        {
          title: this.L('排序'),
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: this.L('添加时间'),
          dataIndex: 'create_time',
          ellipsis: true,
          scopedSlots: { customRender: 'create_time' },
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      //列表数据
      dataList: [],
      dataAddList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
      },
      lsitType: 'add',
      form: {
        name: '',
        sort: 0,
      },
      keywords: '',
      listId: '',
    }
  },
  created() {
    this.getDataList()
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  methods: {
    //搜索
    search() {
      this.pagination.current = 1
      this.getDataList()
    },
    // 获取table数据
    getDataList() {
      let params = {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        key: this.keywords,
      }
      this.request(cardMerchantApi.goodsTypeList, params).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList()
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    //失去焦点
    setListSort(e, item) {
      if (e.target._value !=  item.sort) {
        let params = {
            id: item.id,
            name: item.name,
            sort: e.target._value
        }
        this.request(cardMerchantApi.goodsTypeEdit, params).then((res) => {
          this.$message.success('修改成功')
          this.getDataList()
        })
      }
    },
    //弹框确认事件
    addOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.lsitType == 'add') {
            console.log(valid)
            this.request(cardMerchantApi.goodsTypeAdd, this.form).then((res) => {
              this.$message.success('添加成功')
              this.visible = false
              this.getDataList()
            })
          } else {
            let params = {
              id: this.listId,
              ...this.form,
            }
            this.request(cardMerchantApi.goodsTypeEdit, params).then((res) => {
              this.$message.success('编辑成功')
              this.visible = false
              this.getDataList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //新建
    addClick() {
      this.titles = '新增'
      this.lsitType = 'add'
      this.visible = true
      this.listId = ''
      this.form.name = ''
      this.form.sort = 0
    },
    //编辑列表
    editList(e) {
      this.titles = '编辑'
      this.lsitType = 'edit'
      this.visible = true
      this.listId = e.id
      this.form.name = e.name
      this.form.sort = e.sort
    },
    // 单个删除
    delList(e) {
      this.$confirm({
        title: '是否删除该条数据?',
        centered: true,
        onOk: () => {
          this.request(cardMerchantApi.goodsTypeDel, {
            id: [e.id],
          }).then((res) => {
            this.toSetPage(1)
            this.$message.success('删除成功')
            this.getDataList()
          })
        },
      })
    },
  },
}
</script>
<style scoped lang="less">
.center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.textarea-wrapper {
  position: relative;
  display: block;
  .m-textarea {
    padding: 8px 12px;
    padding-bottom: 25px;
    height: 100%;
  }
  .m-count {
    color: #808080;
    position: absolute;
    font-size: 12px;
    bottom: 0px;
    right: 12px;
  }
}
.newBox {
  height: 30vh;
  .customFormWrap {
    padding: 20px 20px 0 20px;
    background: #fafafa;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(235, 238, 245);
  }
}
.flag {
  margin-left: 2%;
  display: inline-flex;
  align-items: center;
  p {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
</style>
