<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col>
                <a-input placeholder="店铺名称" style="width: 300px" v-model="queryParams.store_name" @search="onSearch" />
                <a-button type="primary" style="margin: 10px 10px" @click="onSearch">
                    {{ L('搜索') }}
                </a-button>
                <a-button v-if="mall_is_self" type="primary" style="margin: 10px 10px" @click="bindStore">
                  {{ L('绑定店铺') }}
                </a-button>
<!--                <a-button v-if="mall_is_self" type="primary" style="margin: 10px 10px" @click="batchSetBuilding">-->
<!--                  {{ L('批量设置楼栋') }}-->
<!--                </a-button>-->
                <a-upload
                  action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                  :show-upload-list="false"
                  @change="handleUploadChange"
                  :data="{upload_dir:'/shopping_mall/floor_import'}"
                  name="file"
                >
                  <a-button v-if="mall_is_self" style="margin: 10px 10px" :loading="loading">
                    <a-icon type="upload" />{{ L('表格批量导入') }}
                  </a-button>
                  <a v-if="mall_is_self" style="margin-left:10px" @click.stop="downloadTemplate">点击下载模板</a>
                </a-upload>
            </a-col>
        </a-row>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="store_id" :data-source="dataList"
            @change="changePage" :pagination="pagination" :loading="tableloading">

            <span slot="status" slot-scope="text, ">
                <a-tag v-if="text == 1" color="#108ee9">正常</a-tag>
                <a-tag v-else color="#f50">关闭</a-tag>
            </span>

            <span slot="bindAction" slot-scope="text, record,index">
                <a-cascader
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  :options="buildingList"
                  placeholder="请绑定楼栋、楼层"
                  @change="batchSetBuildingChange($event, record,index)"
                  v-model="record.ids"
                />
            </span>
            <span slot="operate" slot-scope="text,item">
              <a @click="unbindStore(item.store_id)">{{ L('解绑店铺') }}</a>
            </span>
        </a-table>
      <a-modal v-model="bindStoreVisible" title="绑定店铺" on-ok="bindStoreHandleOk" width="50%">
        <template slot="footer">
          <a-button key="back" @click="bindStoreHandCancel">
            {{ L('取消') }}
          </a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="bindStoreHandleOk">
            {{ L('保存') }}
          </a-button>
        </template>
        <a-row>
          <a-col>
            <a-select
              label-in-value
              :default-value="{ key: 'store_name' }"
              style="width: 120px;margin: 10px 10px;"
              @change="bindStoreHandleChange"
            >
              <a-select-option value="store_name">
                {{ L('店铺名称') }}
              </a-select-option>
              <a-select-option value="mer_name">
                {{ L('商家名称') }}
              </a-select-option>
            </a-select>
            <a-input placeholder="关键字" style="width: 300px" v-model="bindStoreQueryParams.keywords"/>
            <a-button type="primary" style="margin: 10px 10px" @click="bindStoreGetList">
              {{ L('搜索') }}
            </a-button>
          </a-col>
        </a-row>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="bindStoreColumns"
                 :row-selection="bindStoreRowSelection" rowKey="store_id" :data-source="storeList"
                 @change="bindStoreChangePage" :pagination="bindStorePagination">
        </a-table>
      </a-modal>
<!--      <a-modal :closable="false" :maskClosable="false" :keyboard="false" v-model="batchSetBuildingVisible"-->
<!--               title="批量设置楼栋" on-ok="batchSetBuildingHandleOk">-->
<!--        <template slot="footer">-->
<!--          <a-button key="back" @click="batchSetBuildingHandleCancel">-->
<!--            {{ L('取消') }}-->
<!--          </a-button>-->
<!--          <a-button key="submit" type="primary" :loading="loading" @click="batchSetBuildingHandleOk">-->
<!--            {{ L('保存') }}-->
<!--          </a-button>-->
<!--        </template>-->
<!--        <a-cascader-->
<!--          style="width: 100%"-->
<!--          :field-names="{ label: 'name', value: 'id', children: 'children' }"-->
<!--          :options="buildingList"-->
<!--          :placeholder="L('请选择楼栋')"-->
<!--          @change="batchSetBuildingChange($event)"-->
<!--        />-->
<!--      </a-modal>-->
    </div>

</template>

<script>
import buildingPlatformApi from '@/api/building/index'
import mallMerchantApi from "@/api/mall/merchant";

export default {
    name: "bindStores",
    components: {

    },
    data() {
        return {
            mall_id: 0,
            dataList: [],
            queryParams: {
                page_size: 0,
                page: 1,
                store_name: '',
            },
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            columns: [
                {
                    title: this.L('店铺ID'),
                    dataIndex: 'store_id',
                },
                {
                    title: this.L('店铺名称'),
                    dataIndex: 'store_name',
                },
                {
                    title: this.L('店铺状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
            ],
            mall_is_self: 0, //1-自有商场
            loading: false,
            batchSetBuildingVisible: false, //批量设置楼栋
            buildingList: [], //楼栋列表
            roomId: '',
            storeIds: [], //选中的店铺
            bindStoreVisible: false, //绑定店铺弹窗
            storeList: [], //店铺列表
            bindStoreIds: [], //选中绑定的店铺id
            bindStoreQueryParams: {
              pageSize: 0,
              page: 1,
              search_type: 'store_name',
              keywords: '',
            },
            bindStorePagination: {
              pageSize: 10,
              total: 0,
              current: 1,
              page: 1,
            },
            bindStoreColumns: [
              {
                title: this.L('店铺ID'),
                dataIndex: 'store_id',
              },
              {
                title: this.L('店铺名称'),
                dataIndex: 'name',
              },
              {
                title: this.L('商家名称'),
                dataIndex: 'mer_name',
              },
            ],
            isbathBindFloor: 0, //1-批量绑定楼层
            tableloading: false, //表格加载状态
            hasBindAction: 0, //1-自有商场列表展示选择楼栋、楼层选择框
            hasBuilding: 0, //1-导入商场列表展示楼栋、楼层、房间信息
            fileList: [], //上传文件列表
        }
    },

    mounted() {
        let loginMallId = sessionStorage.getItem("login_mall_id");
        this.mall_id = loginMallId;
        this.getLists();
    },
    computed: {
      rowSelection() {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            this.storeIds = selectedRowKeys;
            this.selectedRows = selectedRows;
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.building != '',
            },
          }),
        };
      },
      bindStoreRowSelection(){
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            this.bindStoreIds = selectedRowKeys;
            this.selectedRows = selectedRows;
          },
          getCheckboxProps: record => ({
            props: {
              
            },
          }),
        };
      },
    },
    methods: {
      //获取商场列表
      getLists() {
        this.storeIds = []
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.queryParams.mall_id = this.mall_id
        this.tableloading = true;
        this.request(buildingPlatformApi.getBindStoreLists, this.queryParams).then((res) => {
          this.hasBindAction = 0;
          this.hasBuilding = 0;
          this.columns.forEach((item, index) => {
            if (item.dataIndex == 'bindAction') {
              this.hasBindAction = 1;
            }
            if (item.dataIndex == 'building') {
              this.hasBuilding = 1
            }
          })
          if (res.mall_is_self == 1 && this.hasBindAction == 0) {
            this.columns.push(
              {
                title: this.L('楼栋/楼层'),
                dataIndex: 'bindAction',
                scopedSlots: {customRender: 'bindAction'},
              },
              {
                title: this.L('操作'),
                dataIndex: 'operate',
                scopedSlots: {
                  customRender: 'operate',
                },
              },
            );
          } else if (res.mall_is_self == 0 && this.hasBuilding == 0) {
            this.columns.push(
              {
                title: this.L('楼栋'),
                dataIndex: 'building',
              },
              {
                title: this.L('楼层'),
                dataIndex: 'floor',
              },
              {
                title: this.L('房间号'),
                dataIndex: 'room',
              },
            );
          }
          this.dataList = res.data.map(v => {
            v.ids = [v.building_id, v.floor_id, v.room_id]
            return v
          })
          this.pagination.total = res.total
          this.mall_is_self = res.mall_is_self
          this.buildingList = res.building
          this.tableloading = false;
        })
      },

      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },
      // 搜索
      onSearch() {
        this.pagination.current = this.pagination.page = 1;
        this.getLists()
      },
      //批量绑定楼栋
      batchSetBuilding() {
        if (this.storeIds.length == 0) {
          this.$message.warning(this.L('请选择要绑定的店铺'));
          return
        }
        this.batchSetBuildingVisible = true;
        this.roomId = '';
        this.isbathBindFloor = 1;
      },
      batchSetBuildingChange(value, item = null, index) {
        this.roomId = value[value.length - 1]
        if (item && item.store_id) {
          if (item.room_id == value[2]) {
            return
          }
          this.storeIds = [item.store_id];
          this.batchSetBuildingHandleOk();
          this.dataList[index].building_id = value[0]
          this.dataList[index].floor_id = value[1]
          this.dataList[index].room_id = value[2]
        }
      },
      batchSetBuildingHandleOk(e) {
        this.loading = true;
        let params = {
          store_ids: this.storeIds,
          room_id: this.roomId,
          mall_id: this.mall_id
        }
        this.request(buildingPlatformApi.storeBindFloor, params).then((res) => {
          this.$message.success(this.L('保存成功'))
          this.isbathBindFloor = 0;
          this.batchSetBuildingVisible = false;
          this.getLists();
        })
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      batchSetBuildingHandleCancel(e) {
        this.batchSetBuildingVisible = false;
        this.isbathBindFloor = 0;
      },
      //批量添加店铺
      // 切换表格分页
      bindStoreChangePage(page, pageSize) {
        this.bindStorePagination.current = page.current
        this.getLists()
      },
      // 搜索
      bindStoreOnSearch() {
        this.bindStorePagination.current = this.bindStorePagination.page = 1;
        this.getLists()
      },
      bindStore() {
        this.bindStoreQueryParams.keywords = '';
        this.bindStoreIds = [];
        this.bindStoreGetList();
        this.bindStoreVisible = true;
      },
      bindStoreHandleOk(e) {
        this.loading = true;
        let params = {
          store_ids: this.bindStoreIds,
          mall_id: this.mall_id
        }
        this.request(buildingPlatformApi.mallBindStore, params).then((res) => {
          this.$message.success(this.L('保存成功'))
          this.bindStoreVisible = false;
          this.getLists();
        })
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      bindStoreHandCancel(e) {
        this.bindStoreVisible = false;
        this.getLists();
      },
      //获取未绑定店铺列表
      bindStoreGetList() {
        this.bindStoreQueryParams.pageSize = this.pagination.pageSize
        this.bindStoreQueryParams.page = this.pagination.current
        this.bindStoreQueryParams.mall_id = this.mall_id
        this.request(buildingPlatformApi.getStoreList, this.bindStoreQueryParams).then((res) => {
          this.storeList = res.data
          this.bindStorePagination.total = res.total
        })
      },
      bindStoreHandleChange(value) {
        this.bindStoreQueryParams.search_type = value.key;
      },
      //下载模板
      downloadTemplate() {
        window.open('/static/file/shopping_mall_floor_temp.xlsx')
      },
      handleUploadChange(info) {
        this.fileList = info.fileList;
        if (info.file.status === 'uploading') {
          this.tableloading = true;
          return;
        }
        if (info.file.status === 'done') {
          let file = info.file.response ? info.file.response : null
          if (file && file.status == 1003) {
            this.$message.error(info.file.response.msg);
            this.tableloading = false;
          }
          if (file && file.status == 1000) {
            //导入
            let params = {
              mall_id: this.mall_id,
              file_url: this.fileList[0].response.data,
            }
            this.tableloading = true;
            this.request(buildingPlatformApi.importStore, params).then((data) => {
              this.tableloading = false;
              this.fileList = [];
              this.$message.success('导入成功！');

              setTimeout(() => {
                this.getLists()
              }, 300)
            }).catch(err => {
              if (err.status == 1003) {
                this.fileList = [];
                this.tableloading = false;
              }
            })
          }
        }
      },
      unbindStore(store_id) {
        this.$confirm({
          title: this.L('确定解绑吗？'),
          okType: 'danger',
          onOk: () => {
            this.request(buildingPlatformApi.unbindStore, {
              store_id: store_id,
              mall_id: this.mall_id,
            }).then((res) => {
              this.$message.success(this.L('解绑成功'))
              this.getLists()
            })
          }
        })
      },
    }
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}

.bm-view {
    width: 650px;
    height: 450px;
    margin-top: 10px;
}

.ms {
    color: #888;
    display: flex;
    justify-content: center;
}
</style>
