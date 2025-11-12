<template>
  <div class="message-suggestions-list-box">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="党支部名称">
              <a-input v-model="search.key_val" placeholder="请输入党支部名称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="searchList()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetList()">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="add-box">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-button type="primary" icon="plus" @click="addActive()">
            新建
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
      @change='table_change'>
      <span slot="status" slot-scope="text, record">
        <a-badge :status="record.status | statusFilter" :text="text" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="lookEdit(record)">编辑</a>
      </span>
    </a-table>
    <a-modal title="新建" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form layout="">
        <a-form-item label="党支部名称" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-input placeholder="请输入党支部名称" />
        </a-form-item>
        <a-form-item label="党支部介绍" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-input type="textarea" placeholder="请输入党支部介绍" />
        </a-form-item>
        <a-form-item label="绑定社区" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-tree v-model="checkedKeys" checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys" :tree-data="treeData" @expand="onExpand" @select="onSelect" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import configStreetCommunityApi from '@/api/community/streetCommunity'

  const columns = [{
      title: '标题',
      dataIndex: 'active_name',
      key: 'active_name'
    },
    {
      title: '添加时间',
      dataIndex: 'add_time_txt',
      key: 'add_time_txt'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      scopedSlots: {
        customRender: 'action'
      },
    },
  ];
  const treeData = [{
      title: '测试社区',
      key: '0-0',
      children: [{
          title: '测试社区',
          key: '0-0-0',
        },
        {
          title: '测试社区',
          key: '0-0-1',
        },
        {
          title: '测试社区',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '测试社区',
      key: '0-1',
      children: [{
          title: '测试社区',
          key: '0-1-0-0'
        },
        {
          title: '测试社区',
          key: '0-1-0-1'
        },
        {
          title: '测试社区',
          key: '0-1-0-2'
        },
      ],
    },
    {
      title: '测试社区',
      key: '0-2',
    },
  ];
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      activity_id: i,
      active_name: `active_name ${i}`,
      num_txt: `30/${i}`,
      start_end_time_txt: `2020/1/1 10:00 ~ 2020/5/20 10:00`,
      status: 0,
      status_txt: `禁止 ${i}`,
      sort: 100 - i,
      add_time_txt: `2020/5/28 10:${i}`,
    });
  }


  export default {
    name: 'volunteerActivitiesList',
    filters: {
      statusFilter(type) {
        var statusMap = [
          'error',
          'success',
        ]
        return statusMap[type]
      }
    },
    data() {
      return {
        reply_content: '',
        pagination: {
          pageSize: 10,
          total: 10
        },
        search_data: [],
        search: {
          key_val: '',
          value: '',
          page: 1,
          desc: ''
        },
        form: this.$form.createForm(this),
        visible: false,
        data,
        columns,
        page: 1,
        visible: false,
        confirmLoading: false,
        ModalText: '',
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
        treeData,
      };
    },
    mounted() {
      // this.getVolunteerActivityList()
    },
    watch: {
      checkedKeys(val) {
        console.log('onCheck', val);
      },
    },
    methods: {
      //树形控件方法
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onCheck(checkedKeys) {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys;
      },
      onSelect(selectedKeys, info) {
        console.log('onSelect', info);
        this.selectedKeys = selectedKeys;
      },
      //树形控件方法end
      addActive() {
        this.visible = true;
      },
      handleOk(e) {
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false;
      },
      // 获取列表信息
      getVolunteerActivityList() {
        this.search['page'] = this.page;
        this.request(configStreetCommunityApi.volunteerActivityList, this.search)
          .then((res) => {
            console.log('res', res)
            this.pagination.total = res.count ? res.count : 0
            this.data = res.list
          })
      },
      // // 添加活动
      // addActive() {
      //   console.log('添加活动', 1)
      //   var pathInfo = this.getRouterPath('addVolunteerActivitiesInfo')
      //   console.log('addActive', pathInfo)
      //   this.$router.push({
      //     path: pathInfo
      //   })
      // },
      // 删除
      delInfo(record) {
        let _this = this
        this.$confirm({
          title: '你确定要删除该活动信息?',
          content: '该活动一旦删除不可恢复，且相关报名信息将失效',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.request(configStreetCommunityApi.delVolunteerActivity, {
                activity_id: record.activity_id
              })
              .then((res) => {
                _this.$message.success('删除成功！');
                _this.getVolunteerActivityList()
              })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      },
      // 跳转报名列表
      sign_list(record) {
        var pathInfo = this.getRouterPath('signVolunteerActivitiesList')
        console.log('pathInfo', pathInfo)
        this.$router.push({
          path: pathInfo,
          query: {
            activity_id: record.activity_id
          }
        })
      },
      // 查看编辑详情  触发跳转
      lookEdit(record) {
        console.log('record', record)
        var pathInfo = this.getRouterPath('addVolunteerActivitiesInfo')
        console.log('lookEdit', pathInfo)
        this.$router.push({
          path: pathInfo,
          query: {
            activity_id: record.activity_id
          }
        })
      },
      // 表格中变动  这里只针对页面页数切换
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getVolunteerActivityList()
        }
      },
      // 日期切换，重新赋值
      dateOnChange(date, dateString) {
        this.search.date = dateString;
        console.log('search', this.search);
      },
      // 进行搜索
      searchList() {
        console.log('search', this.search);
        this.getVolunteerActivityList()
      },
      // 进行重置
      resetList() {
        console.log('search', this.search);
        console.log('search_data', this.search_data);
        this.search = {
          key_val: 'active_name',
          value: '',
          page: 1
        }
        this.search_data = [];
        this.getVolunteerActivityList()
      }
    }
  };
</script>

<style lang="less" scoped>
  .message-suggestions-list-box {
    margin: 30px 20px;
    background-color: white;
  }

  .message-suggestions-list-box .table-page-search-wrapper {
    padding: 20px 20px 0;
  }

  .message-suggestions-list-box .add-box {
    padding: 20px 20px 0;
  }

  .message-suggestions-list-box .components-table-demo-nested {
    padding: 20px;
  }

  .message-suggestions-list-box .message_box {
    padding: 20px;
  }
</style>
