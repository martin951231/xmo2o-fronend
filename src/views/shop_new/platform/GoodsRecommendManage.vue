<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-row type="flex" class="mb-20">
      <a-button type="primary" @click="addGoods">{{ L('添加推荐商品组') }}</a-button>
      <a-popconfirm title="是否确定批量删除?" ok-text="是" cancel-text="否" @confirm="deleltItem('batch')">
        <a-button type="danger" class="ml-20">{{ L('批量删除') }}</a-button>
      </a-popconfirm>
    </a-row>
    <a-table
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onParkingChange,
      }"
    >
      <span slot="status" slot-scope="text, record">
        <a-switch
          checked-children="开"
          un-checked-children="关"
          :checked="record.status == 0 ? false : true"
          @change="onStatusChange($event, record)"
        />
      </span>
      <span slot="goodsManage" slot-scope="text, record">
        <a-button @click="showRecommendGoods(record)">{{ L('管理') }}</a-button>
      </span>
      <span slot="scale" slot-scope="text, record">
        <a-input-number
          v-model="record.scale"
          :min="0"
          :max="100"
          :formatter="(value) => `${value}%`"
          :parser="(value) => value.replace('%', '')"
          @blur="scaleChange($event, record)"
        />
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <a class="inline-block" @click="editItem(record)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a-popconfirm title="是否确定删除吗?" ok-text="是" cancel-text="否" @confirm="deleltItem('single', record)">
          <a class="inline-block" style="color: red; margin-right: 10px">{{ L('删除') }}</a>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal :title="titles" v-model="visible" @ok="handleOk" destroyOnClose width="50%" :centered="true">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="推荐组标题" prop="name">
          <a-row>
            <a-input placeholder="请输入推荐组标题" v-model="form.name" style="width: 80%; margin-right: 10px" />
            <a-popover placement="rightTop">
              <template slot="content">
                <img src="@/assets/images/shop_new_tuijian.png" alt="" />
              </template>
              <a-icon type="question-circle" />
            </a-popover>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="管理分类" prop="cat_id_ary">
          <a-tree
            v-model="checkedKeys"
            checkable
            :tree-data="categoryList"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            @expand="onExpand"
            @select="onSelect"
            @check="onCheck"
            :replaceFields="{
              children: 'children',
              title: 'cat_name',
              key: 'key',
            }"
          />
        </a-form-model-item>
        <a-form-model-item label="推荐占比">
          <a-input-number
            v-model="form.scale"
            :min="0"
            :max="100"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch checked-children="开" un-checked-children="关" defaultChecked @change="onModelStatusChange" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      :title="'管理推荐商品'"
      v-model="recommendGoodsVisible"
      destroyOnClose
      width="70%"
      :centered="true"
      :footer="null"
    >
      <recommendGoods ref="recommendGoodsRef" />
    </a-modal>
  </div>
</template>
  <script>
import shopNewPlatFormApi from '@/api/shop_new/platform'
import recommendGoods from '../modules/recommendGoods'
export default {
  data() {
    return {
      titles: '新建推荐组',
      visible: false,
      recommendGoodsVisible: false,
      //table表格头部
      columns: [
        {
          title: this.L('编号'),
          dataIndex: 'id',
        },
        {
          title: this.L('活动名称'),
          dataIndex: 'name',
        },
        {
          title: this.L('更新时间'),
          dataIndex: 'update_time',
        },
        {
          title: this.L('推荐商品管理'),
          dataIndex: 'goodsManage',
          scopedSlots: { customRender: 'goodsManage' },
        },
        {
          title: this.L('推荐比例'),
          dataIndex: 'scale',
          scopedSlots: { customRender: 'scale' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('操作'),
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataList: [],
      itemDetail: null,
      selectedRowKeys: [],
      queryParams: {
        page: 0,
        pageSize: 0,
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        name: [{ required: true, message: '请输入推荐组标题', trigger: 'blur' }],
        cat_id_ary: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      },
      form: {
        name: '',
        scale: '0%',
        status: 1,
        cat_id_ary: [],
      },
      expandedKeys: [], //展开父节点
      autoExpandParent: true,
      checkedKeys: [], //选中的所有节点
      selectedKeys: [],
      categoryList: [],
      modelType: 'add',
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  components: { recommendGoods },
  created() {
    this.getDataList()
    this.getCategory()
  },
  methods: {
    //获取推荐组列表
    getDataList() {
      this.queryParams.page = this.pagination.current
      this.queryParams.pageSize = this.pagination.pageSize
      this.request(shopNewPlatFormApi.getRecommendList, this.queryParams).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    //获取商品分类
    getCategory() {
      this.request(shopNewPlatFormApi.getCategory, this.queryParams).then((res) => {
        this.categoryList = res
      })
    },
    //改变列表状态
    onStatusChange(e, item) {
      this.itemDetail = item
      this.editRecommend(e, 1)
    },
    //改变推荐占比
    scaleChange(e, item) {
      this.itemDetail = item
      this.editRecommend(e.target._value, 2)
    },
    onModelStatusChange(e) {
      this.form.status = e ? 1 : 0
    },
    //修改列表的信息------update_type修改类型（0：修改全部，1：修改状态，2：修改推荐占比）
    editRecommend(data, update_type = 0) {
      let params = {}
      if (update_type == 0) {
        params = {
          id: this.itemDetail.id,
          update_type,
          ...data,
        }
      } else if (update_type == 1) {
        params = {
          id: this.itemDetail.id,
          status: data ? 1 : 0,
          update_type,
        }
      } else if (update_type == 2) {
        let scale = parseInt(data.replace('%', ''))
        // if (scale == this.itemDetail.scale) {
        //   return
        // }
        params = {
          id: this.itemDetail.id,
          update_type,
          scale: scale,
        }
      }
      this.request(shopNewPlatFormApi.editRecommend, params).then((res) => {
        this.$message.success('操作成功')
        if (update_type == 0) {
          this.visible = false
        }
        this.getDataList()
      })
    },
    //新增推荐组
    addGoods() {
      this.visible = true
      this.modelType = 'add'
      this.titles = '新建推荐组'
      this.form = {
        name: '',
        scale: '0%',
        status: 1,
        cat_id_ary: [],
      }
      this.expandedKeys = []
      this.checkedKeys = []
    },
    //编辑推荐组
    editItem(item) {
      this.modelType = 'edit'
      this.titles = '编辑推荐组'
      this.itemDetail = item
      this.request(shopNewPlatFormApi.getRecommendDetail, { id: item.id }).then((res) => {
        this.form = res
        this.checkedKeys = res.cat_id_ary
        this.visible = true
        if (res.cat_fid_ary) {
          this.expandedKeys = res.cat_fid_ary
        }
        //回显商品分类逻辑
        else if (res.cat_id_ary) {
          let str1 = '' //父级分类
          let str2 = '' //二级子分类
          this.expandedKeys = []
          res.cat_id_ary.forEach((v) => {
            //存在_执行
            if (v.indexOf('_') != -1) {
              str1 = v.split('_')[0]
              //去重，push父级分类
              if (this.expandedKeys.indexOf(str1) == -1) {
                this.expandedKeys.push(parseInt(str1))
                //此时存在二级子分类
                if (v.split('_').length >= 2) {
                  str2 = v.split('_')[0] + '_' + v.split('_')[1] //拼接二级子分类
                  this.expandedKeys.push(parseInt(str2))
                }
              }
            }
          })
        }
      })
    },
    //删除推荐组(单项删除或者批量删除)
    deleltItem(type, item) {
      let params = {}
      //单个删除
      if (type == 'single') {
        params = {
          ids: item.id,
        }
      }
      if (this.selectedRowKeys.length == 0 && type == 'batch') {
        this.$message.warning('请至少选中一项再进行删除操作')
        return
      }
      if (type == 'batch') {
        params = {
          ids: this.selectedRowKeys.join(','),
        }
      }
      this.request(shopNewPlatFormApi.delRecommend, params).then((res) => {
        setTimeout(() => {
          this.$message.success('删除成功')
          this.getDataList()
        }, 300)
      })
    },
    //弹框确定事件
    handleOk() {
      this.checkedKeys = this.checkedKeys.filter((v) => typeof v === 'string')
      this.form.cat_id_ary = this.checkedKeys
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.modelType == 'add') {
            this.request(shopNewPlatFormApi.addRecommend, this.form).then((res) => {
              this.$message.success('添加成功')
              this.visible = false
              this.getDataList()
            })
          } else {
            this.editRecommend(this.form, 0)
          }
        } else {
          return false
        }
      })
    },
    showRecommendGoods(item) {
      this.itemDetail = item
      this.recommendGoodsVisible = true
      this.$nextTick(() => {
        this.$refs.recommendGoodsRef.getDataList(this.itemDetail.id)
      })
    },
    //列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },

    onExpand(expandedKeys) {
      //   console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      //   console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    //选中某一项
    onSelect(selectedKeys, info) {
      //   console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    //选中了几项复选框
    onCheck(checkedKeys, info) {
      //   console.log(checkedKeys)
      //   console.log(info)
    },
  },
}
</script>
  <style lang="less" scoped>
.color-1 {
  color: #979797;
}
</style>