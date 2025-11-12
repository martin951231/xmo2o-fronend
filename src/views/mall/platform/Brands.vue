<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form-model layout="inline">
          <a-form-model-item label="服务名称">
            <a-input v-model="queryParams.keyword" placeholder="请输入服务名称" style="width: 300px;"/>
          </a-form-model-item>
          
          <a-form-model-item>
            <a-button type="primary" class="mr-10" @click="onSearch">{{ L('搜索') }}</a-button>
            <a-button class="mr-10" @click="resetSearch()">{{ L('重置') }}</a-button>
            <a-button type="primary" @click="add">{{ L('添加品牌') }}</a-button>
          </a-form-model-item>
        </a-form-model>
        
  
      <a-table
        style="background: #ffffff;margin-top: 20px"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        @change="changePage"
        :pagination="pagination"
      >
        <span slot="status" slot-scope="text, item">
            <a-switch v-model="item.status == 1" @change="changeStatus(item.id)" checked-children="开启" un-checked-children="关闭"/>
        </span>
        <span slot="logo" slot-scope="text, item">
            <img :src="item.logo" style="padding: 2px;max-height: 65px;"/>
        </span>

        <!-- 操作栏 -->
        <span slot="operate" slot-scope="text,item">
          <a @click="edit(item)">{{ L('编辑') }}</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="删除后无法恢复，是否确定?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="del(item.id)"
          >
            <a>{{ L('删除') }}</a>
          </a-popconfirm>
        </span>

        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
            {{ record.introduction }}
        </p>
      </a-table>


    <!-- 新增和编辑品牌 -->
    <a-modal
        :title="modalTitle"
        width="30%"
        :visible="modalVisible"
        @cancel="cancalModal"
        @ok="submitModal"
    >
    <a-form-model :model="modalForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
        
        <a-form-model-item label="品牌名称" required="true">
            <a-input v-model="modalForm.name" />
        </a-form-model-item>

        <a-form-model-item label="品牌介绍" required>
            <a-input v-model="modalForm.introduction" type="textarea" />
        </a-form-model-item>

        <a-form-model-item label="品牌LOGO" required help="仅支持jpg、png、jpeg、gif图片类型,建议大小不要超过2M">
            <a-upload
                name="reply_pic"
                action="/v20/public/index.php/common/common.UploadFile/uploadPictures?upload_dir=brand"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
            >
            <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                上传
                </div>
            </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="closePreview">
                <img style="width: 100%" :src="modalForm.logo" />
            </a-modal>
        </a-form-model-item>

        <a-form-model-item label="状态">
            <a-switch checked-children="开启" un-checked-children="关闭" v-model="modalForm.status"/>
        </a-form-model-item>
        <a-form-model-item label="排序">
            <a-input-number  v-model="modalForm.sort" :min="0"/>
        </a-form-model-item>
    </a-form-model>
    </a-modal>
    </div>
  </template>
  
  <script>
  import mallPlatformApi from '@/api/mall/platform/index'
  function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    }
  export default {
    components: {},
    data() {
      return {
        previewVisible: false,
        previewImage: '',
        fileList: [],

        modalTitle:'',
        modalVisible:false,
        modalForm:{
            id:0,
            name:'',
            introduction:'',
            logo:'',
            status:true,
            sort:0,
        },
        dataList: [], // 列表
        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1,
        },
        queryParams: {
          keyword: '',
        },
        columns: [
          {
            title: this.L('序号'),
            dataIndex: 'id',
          },
          {
            title: this.L('品牌名称'),
            dataIndex: 'name',
          },
          {
            title: this.L('图标'),
            dataIndex: 'logo',
            scopedSlots: {
              customRender: 'logo',
              },
          },
          {
            title: this.L('状态'),
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status',
              },
            },
          {
            title: this.L('排序'),
            dataIndex: 'sort',
          },
          {
            title: this.L('更新时间'),
            dataIndex: 'update_time',
          },
          {
            title: this.L('操作'),
            dataIndex: 'operate',
            scopedSlots: {
              customRender: 'operate',
            },
          },
        ],
      }
    },
    watch: {
      $route() {
        this.getLists()
      },
    },
    mounted() {
      this.getLists()
    },
    methods: {
        closePreview() {
            this.previewVisible = false;
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewVisible = true;
        },
        handleChange({ fileList }) {
            this.fileList = fileList;
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this.fileList[len].status == 'done') {
                    this.modalForm.logo = this.fileList[len].response.data
                }
            }else{
                this.modalForm.logo = ''
            }
        },
      onChangeStatus(channel_id) {
        this.request(channelCodeApi.platformChangeStatus, {chanel_id:channel_id}).then((res) => {
          this.getLists()
        })
      },
      // 数据列表
      getLists() {
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.request(mallPlatformApi.getBrandsList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
  
      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },
  
      // 搜索
      onSearch() {
        this.pagination.total = 0
        this.pagination.current = 1
        this.pagination.page = 1
        this.getLists()
      },
      //重置搜索
      resetSearch() {
        this.queryParams.keyword = '';
        this.getLists();
      },
      // 新建列表
      add() {
        this.modalTitle = '添加品牌';
        this.modalVisible = true;
        this.modalForm = {
            id:0,
            name:'',
            introduction:'',
            logo:'',
            status:true,
            sort:0,
        };
        this.fileList = [];
      },
      edit(item){
        this.modalTitle = '编辑品牌';
        this.modalVisible = true;
        this.modalForm = {
          id:item.id,
          name:item.name,
          introduction:item.introduction,
          logo:item.logo,
          status:Boolean(item.status),
          sort:item.sort,
        }
        if(item.logo){
            this.fileList = [
                {
                    uid: '-1',
                    name: 'logo.png',
                    status: 'done',
                    url: item.logo,
                },
            ];
        }else{
            this.fileList = [];
        }
      },
      del(id){
        let _this = this;
        _this.request(mallPlatformApi.delBrand, {id:id}).then((res) => {
           _this.$message.success('删除成功！')
           _this.getLists()
        })
      },
      changeStatus(id){
        let _this = this;
        _this.request(mallPlatformApi.changeBrandStatus, {id:id}).then((res) => {
            _this.$message.success('修改成功！')
            _this.getLists()
        })
      },
      cancalModal(){
        this.modalVisible = false;
      },
      submitModal(){
        let _this = this
        _this.request(mallPlatformApi.saveBrand, this.modalForm).then((res) => {
            _this.$message.success('保存成功！')
            _this.getLists()
            _this.cancalModal();
        })
      },
    },
  }
  </script>
  