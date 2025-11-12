<template>
  <div class="card-list" ref="content">
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <!-- 标题 -->
      <div style="font-size: 26px; line-height: 30px; margin-bottom: 30px">图文列表</div>
      <!-- 分类 -->
      <a-form-model :form="form" layout="inline">
        <div style="line-height: 40px; float:left;width:70px">一级分类：</div>
        <standard-form-row block style="padding-bottom: 11px;">
          <a-form-item class="select-list" :style="isShowNameType ? activeNameStyle : showNameStyle" style="width:88%;">
            <a
              class="categoryone"
              v-for="item in catList"
              :key="item.cat_id"
              :cat_id="item.cat_id"
              @click="categoryList(item.cat_id)"
            >
              <span v-if="category_id == item.cat_id" style="color: #299dff">{{ item.cat_name }}</span>
              <span v-if="category_id != item.cat_id">{{ item.cat_name }}</span>
            </a>
          </a-form-item>
        </standard-form-row>
        <span v-if="isShowNameType" @click="handleIsShowNameType" style="color:rgb(41, 157, 255);cursor:pointer;">展开∨</span>
        <span v-if="!isShowNameType" @click="handleIsShowNameType" style="color:rgb(41, 157, 255);cursor:pointer;">收起∧</span>
      </a-form-model>
      <a-form-model :form="form" layout="inline" v-if="secondList != ''">
        <span style="line-height: 40px">二级分类：</span>
        <standard-form-row block style="padding-bottom: 11px">
          <a-form-item>
            <a
              class="categoryone"
              v-for="item in secondList"
              :key="item.cat_id"
              :cat_id="item.cat_id"
              @click="category(item.cat_id)"
            >
              <span v-if="searchForm.cat_id == item.cat_id" style="color: #299dff">{{ item.cat_name }}</span>
              <span v-if="searchForm.cat_id != item.cat_id">{{ item.cat_name }}</span>
            </a>
          </a-form-item>
        </standard-form-row>
      </a-form-model>
      <!-- 搜索 -->
      <a-form-model layout="inline" :model="searchForm">
        <a-form-model-item label="发布时间">
          <a-date-picker v-model="searchForm.edit_time" @change="onChange" style="width: 120px" />
        </a-form-model-item>
        <a-form-model-item label="图文标题">
          <a-input v-model="searchForm.name" placeholder="请输入图文标题" style="width: 160px" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            icon="search"
            @click="submitForm(true)"
            class="ml-20"
            style="margin-top: 3px; line-height: 20px; color: #fff"
          >
            查询</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <div style="height: 30px"></div>
    <a-list
      rowKey="id"
      :grid="{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }"
      :dataSource="dataSource"
      :pagination="pagination"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="!item || item.id === undefined">
          <a-button
            class="new-btn"
            type="dashed"
            @click="add()"
            style="height: 256px; font-weight: bold; font-size: 16px"
          >
            <a-icon type="plus" style="font-size: 60px; font-weight: normal" /><br /><br />
            新增图文
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <template #cover>
              <img :src="item.pic" style="width: 100%; height: 160px" />
            </template>
            <a-card-meta>
              <a slot="title" style="font-size: 14px" @click="view(item.id)">{{ item.title }}</a>
              <div class="meta-content" slot="description" style="font-size: 12px">
                <span style="float: left">更新于 　 {{ item.edit_time }}</span>
                <span style="float: right">{{ item.views_num }}</span>
              </div>
            </a-card-meta>
            <a class="actions" @click="edit(item.id)"><img :src="item.create" class="img_create" /></a>
            <a class="actions dek" @click="delOne(item.id)"><img :src="item.del" class="img_create img_del" /></a>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
    <atlas-article-create ref="createModal" @loaddata="getList" />
    <atlas-article-view @loadRefresh="getList" ref="viewModel" />
  </div>
</template>

<script>
import atlasArticleCreate from '@/views/atlas/merchant/AtlasArticleCreate'
import atlasArticleView from '@/views/atlas/merchant/AtlasArticleView'
import atlascategoryPlatformApi from '@/api/atlas/merchant'
import StandardFormRow from '@/components/StandardFormRow'

export default {
  name: 'GroupSearchHotList',
  components: {
    atlasArticleView,
    atlasArticleCreate,
    StandardFormRow,
  },
  data() {
    return {
      cat_id: 0,
      cat_fid: 0,
      category_id: 0,
      catList: [],
      secondList: [],
      // 搜索框表单
      searchForm: {
        name: '', // 搜索内容
        edit_time: '',
        cat_id: 0,
        cat_fid: 0,
      },
      dataSource: [{}],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      activeNameStyle: 'height: 40px; overflow: hidden;',
      showNameStyle: 'min-height: 40px;',
      isShowNameType: true,
      activeNameIndex: null,
    }
  },
  mounted() {
    this.getList({ is_search: false })
  },
  methods: {
    handleIsShowNameType() {
      this.isShowNameType = !this.isShowNameType;
    },
    selectNameType(index, item) {
      this.activeNameIndex = index;
    },
    // 获取二级分类
    categoryList(cat_id) {
      this.cat_fid = cat_id
      this.request(atlascategoryPlatformApi.getAtlasArticleSecond, { cat_id: cat_id }).then((res) => {
        this.secondList = res
        this.category_id = cat_id
      })
      this.searchForm.cat_id = 0
      this.searchForm.cat_fid = this.cat_fid
      this.getList({ is_search: false })
    },
    // 二级分类ID
    category(cat_id) {
      console.log('----------------------', this.cat_fid)
      this.searchForm.cat_id = cat_id
      this.searchForm.cat_fid = this.cat_fid
      this.getList({ is_search: false })
    },
    // 新建
    add() {
      this.$refs.createModal.add()
    },
    // 修改
    edit(id) {
      this.$refs.createModal.edit(id)
    },
    // 查看
    view(id) {
      this.$refs.viewModel.view(id)
    },
    // 删除
    delOne(id) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
          this.request(atlascategoryPlatformApi.getAtlasArticleDel, { id: id }).then((res) => {
            this.getList({ is_search: false })
          })
        },
        onCancel() {},
      })
    },
    // 获取列表信息
    getList(param) {
      let params = { ...this.searchForm }
      // console.log(cat_id)
      delete params.time
      if (param.is_search == true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(atlascategoryPlatformApi.getAtlasArticleList, params).then((res) => {
        this.dataSource = res.list
        this.catList = res.catList
        this.$set(this.pagination, 'total', res.count)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      let params = { ...this.searchForm }
      delete params.time
      params.is_search = is_search
      params.tablekey = 1
      this.getList(params)
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

    // 日期选择
    onChange(date, dateString) {
      // console.log(date, dateString);
    },
    testFun() {
      this.$message.info('快速开始被点击！')
    },
  },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';

.card-list {
  /deep/ .ant-card-body:hover {
    .ant-card-meta-title > a {
      color: @primary-color;
    }
  }

  /deep/ .ant-card-meta-title {
    margin-bottom: 12px;

    & > a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  /deep/ .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 188px;
}

.ant-card-body {
  padding: 10px;
  zoom: 1;
}
.ant-list-item:hover .actions {
  display: inline;
}
.actions {
  display: none;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 50px;
  background: #fff;
  border-radius: 50%;
}
.dek {
  right: 10px;
}
.categoryone {
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.7);
}
.categoryone:hover {
  color: #1890ff;
}
.img_create {
  width: 16px;
  height: 16px;
  position: absolute;
  left: 7px;
  top: 8px;
}
.img_del {
  left: 7px;
}
.select-list {
  line-height:40px;
}
</style>
