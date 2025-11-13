<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="flex" style="height: calc(100vh - 80px); width: 100%;">
            <div class="building-box mr-6">
                <div class="flex align-center">
                    <h3 class="flex-1 fw-bold" style="margin-bottom: 0;">{{L('楼栋列表')}}</h3>
                    <space>
                        <a-button icon="reload" @click="getBuildingList">{{L('刷新')}}</a-button>
                        <a-button icon="plus" @click="addBuilding">{{L('添加')}}</a-button>
                    </space>
                </div>
                <div v-if="buildingList.length" style="overflow-y: auto; height: calc(100% - 20px);">
                    <a-spin :spinning="spinning1">
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>{{L('楼栋名称')}}</th>
                                    <th width="50">{{L('操作')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="pointer" v-for="(item, index) in buildingList" :key="item.id" @click="buildingClick(item,index)" :class="{ 'active': buildingIndex === index }">
                                    <td>{{item.name}}</td>
                                    <td style="text-align: center;">
                                        <a-dropdown>
                                            <a-icon type="more" />
                                            <a-menu slot="overlay">
                                                <a-menu-item @click="editBuilding(item)">
                                                    <a href="javascript:;">{{L('编辑')}}</a>
                                                </a-menu-item>
                                                <a-menu-item @click="deleteBuilding(item)">
                                                    <a href="javascript:;">{{L('删除')}}</a>
                                                </a-menu-item>
                                            </a-menu>
                                        </a-dropdown>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- <a-pagination
                            style="text-align: right; margin-top: 10px;"
                            size="small"
                            v-model="buildingPagination.current"
                            :pageSize="buildingPagination.pageSize"
                            :total="buildingPagination.total"
                            @change="buildingPaginationChange"
                            @showSizeChange="buildingShowSizeChange"
                            show-size-changer
                            :showTotal="(total) => this.L(`共 X1 条`, { X1: total })"
                        />-->
                    </a-spin>
                </div>
                <div v-else class="mt-10 mb-10">
                    <a-empty />
                </div>
            </div>
            <div class="floor-box flex-1">
                <div class="flex align-center pl-10 pr-10">
                    <h3 class="flex-1 fw-bold" style="margin-bottom: 0;">{{L('楼层列表')}}</h3>
                    <space>
                        <a-button icon="reload" @click="getFloorList">{{L('刷新')}}</a-button>
                        <a-button icon="plus" @click="addFloor">{{L('添加')}}</a-button>
                    </space>
                </div>
                <div style="overflow-y: auto; height: calc(100% - 20px);">
                    <a-spin :spinning="spinning2">
                        <div class="floor-list mt-10">
                            <a-tree v-if="floorList.length" blockNode :tree-data="floorList" show-icon :default-selected-keys="['0-0-0']">
                                <a-icon slot="switcherIcon" type="down" />
                                <a-icon slot="smile" type="block" />
                                <a-icon slot="meh" type="home" />
                                <template slot="title" slot-scope="item">
                                    <span style="width: 88%;display: inline-block;" class="flex-1">{{ item.name }}</span>
                                    <!-- 楼层编辑和删除，添加房间按钮 -->
                                    <template v-if="item.showBtn == 1">
                                        <a-icon type="edit" style="color:#1890ff" class="mr-20" @click="editFloor(item)" />
                                        <a-icon type="delete" style="color:red" class="mr-20" @click="deleteFloor(item)" />
                                        <a-icon type="plus" class="mr-20" @click="addRoom(item)"/>
                                    </template>
                                    <template v-if="item.showBtn == 2">
                                      <a-icon type="edit" style="color:#1890ff;margin-left: -2px" class="mr-20" @click="editRoom(item)" />
                                      <a-icon type="delete" style="color:red" class="mr-20" @click="deleteRoom(item)" />
                                    </template>
                                </template>
                            </a-tree>
                            <div v-else class="mt-10">
                                <a-empty />
                            </div>
                        </div>
                    </a-spin>
                </div>
            </div>
        </div>
        <!-- 新建楼栋 -->
        <a-modal destroyOnClose :title="L(buildingForm.id?'编辑楼栋':'添加楼栋')" width="30%" v-model="modalVisible" @ok="buildingSubmitModal" :confirmLoading="confirmLoading">
            <a-form-model layout="vertical" ref="ruleForm" :rules="rules" :model="buildingForm">
                <a-form-model-item :label="L('楼栋名称')" prop="name">
                    <a-input v-model="buildingForm.name" :placeholder="L('请填写楼栋名称')" />
                </a-form-model-item>
                <a-form-model-item :label="L('楼栋编号')" prop="building_number">
                    <a-input v-model="buildingForm.building_number" :placeholder="L('请填写楼栋编号')" />
                </a-form-model-item>
                <a-form-model-item :label="L('排序')" prop="sort">
                    <a-input-number style="width: 100%;" v-model="buildingForm.sort" />
                </a-form-model-item>
                <a-form-model-item :label="L('面积')">
                    <a-input-number style="width: 100%;" v-model="buildingForm.area" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <!-- 添加楼层 -->
        <a-drawer destroyOnClose width="600px" :title="L(floorForm.id?'编辑楼层':'添加楼层')" placement="right" :closable="true" :visible="floorVisible" @close="()=>{floorVisible = false}">
            <a-form-model layout="vertical" ref="ruleForm" :rules="floorRules" :model="floorForm">
                <a-form-model-item :label="L('楼层编号')" prop="floor_number">
                    <a-input v-model="floorForm.floor_number" :placeholder="L('请填写楼层编号')" />
                </a-form-model-item>
                <a-form-model-item :label="L('楼层名称')" prop="name">
                    <a-input v-model="floorForm.name" :placeholder="L('请填写楼层名称')" />
                </a-form-model-item>
                <a-form-model-item :label="L('楼层2D平面图模型')">
                    <a-button @click="show2DMap" :loading="storeLoading">{{L('去编辑')}}</a-button>
                </a-form-model-item>
                <a-form-model-item>
                    <div class="mt-20"></div>
                    <a-button type="primary" @click="onFloorSubmit" :loading="confirmLoading">{{L('保存')}}</a-button>
                </a-form-model-item>
            </a-form-model>
        </a-drawer>
        <Layer2DMap ref="layer2DMap" @handleOK="handleLayer2DMapOK" />

      <!-- 添加房间 -->
      <a-drawer destroyOnClose width="600px" :title="L(roomForm.id?'编辑房间':'添加房间')" placement="right" :closable="true" :visible="roomVisible" @close="()=>{roomVisible = false}">
        <a-form-model layout="vertical" ref="ruleForm" :rules="roomRules" :model="roomForm">
          <a-form-model-item :label="L('房间编号')" prop="room_number">
            <a-input v-model="roomForm.room_number" :placeholder="L('请填写房间编号')" />
          </a-form-model-item>
          <a-form-model-item :label="L('品牌名称')" prop="brand_name">
            <a-input v-model="roomForm.brand_name" :placeholder="L('请填写品牌名称')" />
          </a-form-model-item>
          <a-form-model-item :label="L('绑定店铺')" prop="store_id">
            <a-select
              show-search
              placeholder="请选择店铺"
              style="width: 100%"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
              v-model="roomForm.store_id"
            >
              <a-select-option v-for="item in roomStoreList" :key="item.store_id" :value="item.store_id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item>
            <div class="mt-20"></div>
            <a-button type="primary" @click="onRoomSubmit" :loading="confirmLoading">{{L('保存')}}</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-drawer>
    </div>
</template>

<script>
import buildingPlatformApi from '@/api/building/index'
import Layer2DMap from '@/components/Layer2DMap/Layer2DMap'
import { Space } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
export default {
    components: { Layer2DMap, Space },
    data() {
        return {
            buildingPagination: {
                pageSize: 10,
                total: 0,
                current: 1,
            },
            buildingList: [],
            buildingIndex: 0,
            floorList: [],
            //楼栋表单
            buildingForm: {},
            //楼层表单
            floorForm: {},
            modalVisible: false,
            floorVisible: false,
            rules: {
                name: [{ required: true, message: '请填写楼栋名称', trigger: 'blur' }],
                building_number: [{ required: true, message: '请填写楼栋编号', trigger: 'blur' }],
            },
            floorRules: {
                name: [{ required: true, message: '请填写楼层名称', trigger: 'blur' }],
                floor_number: [{ required: true, message: '请填写楼层编号', trigger: 'blur' }],
            },
            spinning1: false,
            spinning2: false,
            mall_id: 0,
            confirmLoading: false,
            storeLoading: false,
            storeList: [],
            //房间表单
            roomForm: {},
            roomVisible: false,
            roomRules: {
                room_number: [{required: true, message: '请填写房间编号', trigger: 'blur'}],
            },
            roomStoreList: [], //添加/编辑房间表单时用到
        }
    },
    created() {
        let loginMallId = sessionStorage.getItem('login_mall_id')
        if (typeof loginMallId != 'undefined' && loginMallId > 0) {
            this.mall_id = loginMallId
            this.getBuildingList()
        } else {
            this.$message.error(this.L('商场获取失败'))
            return
        }
    },
    methods: {
        //获取楼栋
        getBuildingList() {
            let queryParams = {
                page_size: this.buildingPagination.pageSize,
                page: this.buildingPagination.current,
                mall_id: this.mall_id,
            }
            this.spinning1 = true
            this.request(buildingPlatformApi.buildingGetList, queryParams)
                .then((res) => {
                    this.buildingList = res.data
                    this.buildingPagination.total = res.data.length
                    this.spinning1 = false
                    this.buildingList.length && this.getFloorList()
                })
                .catch(() => {
                    this.spinning1 = false
                })
        },
        //获取楼层列表
        getFloorList() {
            let queryParams = {
                mall_id: this.mall_id,
                building_id: this.buildingList[this.buildingIndex].id,
            }
            this.spinning2 = true
            this.request(buildingPlatformApi.getFloorList, queryParams)
                .then((res) => {
                    this.floorList = res.data.map((v) => {
                        v.title = v.name
                        v.key = v.id
                        v.showBtn = 1
                        v.slots = {
                            icon: 'smile',
                        }
                        v.children.map((s) => {
                            s.slots = {
                                icon: 'meh',
                            }
                            s.showBtn = 2
                            s.store_list = v.store_list
                            return s
                        })
                        return v
                    })
                    this.spinning2 = false
                })
                .catch(() => {
                    this.spinning2 = false
                })
        },
        //楼栋分页事件
        buildingPaginationChange(page, pageSize) {
            this.buildingPagination.current = page
            this.getBuildingList()
        },
        //楼栋切换页码事件
        buildingShowSizeChange(current, size) {
            this.buildingPagination.pageSize = size
            this.getBuildingList()
        },
        //添加楼栋
        addBuilding() {
            this.buildingForm = {
                id: 0,
                name: '',
                building_number: '',
                area: 0,
                sort: 0,
                mall_id: this.mall_id,
            }
            this.modalVisible = true
        },
        editBuilding(item) {
            this.buildingForm = cloneDeep(item)
            this.modalVisible = true
        },
        deleteBuilding(item) {
            this.$confirm({
                title: this.L('确定删除吗？'),
                okType: 'danger',
                onOk: () => {
                    this.request(buildingPlatformApi.buildingDelInfo, {
                        id: item.id,
                        mall_id: item.mall_id,
                    }).then((res) => {
                        this.$message.success(this.L('删除成功'))
                        this.getBuildingList()
                    })
                },
                onCancel() {},
            })
        },
        //点击楼栋
        buildingClick(item, index) {
            this.buildingIndex = index
            this.getFloorList()
        },
        buildingSubmitModal() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    //请求接口,再把弹框关闭
                    this.request(buildingPlatformApi.buildingSaveInfo, this.buildingForm)
                        .then((res) => {
                            this.confirmLoading = false
                            this.modalVisible = false
                            this.$message.success(this.L(this.buildingForm.id ? '编辑成功' : '添加成功'))
                            this.getBuildingList()
                        })
                        .catch(() => {
                            this.confirmLoading = false
                        })
                }
            })
        },
        //添加楼层
        addFloor() {
            this.floorForm = {
                floor_number: '',
                name: '',
                building_id: this.buildingList[this.buildingIndex].id,
                mall_id: this.mall_id,
                bg_img: '',
                coor_list: [],
            }
            this.floorVisible = true
        },
        editFloor(item) {
            this.floorForm.floor_number = item.floor_number
            this.floorForm.name = item.name
            this.floorForm.id = item.id
            this.floorForm.building_id = item.building_id
            this.floorForm.mall_id = this.mall_id
            this.floorForm.bg_img = item.bg_img
            this.floorForm.coor_list = item.coor_list
            this.floorVisible = true
        },
        deleteFloor(item) {
            this.$confirm({
                title: this.L('确定删除吗？'),
                okType: 'danger',
                onOk: () => {
                    this.request(buildingPlatformApi.delFloorInfo, {
                        id: item.id,
                        building_id: item.building_id,
                        mall_id: this.mall_id,
                    }).then((res) => {
                        this.$message.success(this.L('删除成功'))
                        this.getFloorList()
                    })
                },
                onCancel() {},
            })
        },
        //楼层保存事件
        onFloorSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    //请求接口,再把弹框关闭
                    this.request(buildingPlatformApi.saveFloorInfo, this.floorForm)
                        .then((res) => {
                            this.confirmLoading = false
                            this.floorVisible = false
                            this.$message.success(this.L(this.floorForm.id ? '编辑成功' : '添加成功'))
                            this.getFloorList()
                        })
                        .catch(() => {
                            this.confirmLoading = false
                        })
                }
            })
        },
        show2DMap() {
            this.storeList = []
            const open = () => {
                this.$refs.layer2DMap.open(this.storeList, {
                    coorList: this.floorForm.coor_list,
                    bg_img: this.floorForm.bg_img,
                })
            }
            if (this.floorForm.id) {
                this.storeLoading = true
                this.request(buildingPlatformApi.getRoomList, {
                    mall_id: this.mall_id,
                    floor_id: this.floorForm.id,
                })
                    .then((res) => {
                        this.storeList = res
                        this.storeLoading = false
                        open()
                    })
                    .catch(() => {
                        this.storeLoading = false
                    })
            } else {
                open()
            }
        },
        //2D图确定回调事件
        handleLayer2DMapOK(data) {
            this.floorForm.bg_img = data.bg_img
            this.floorForm.coor_list = data.coorList
            this.$refs.layer2DMap.handleClose()
        },
        //添加房间
        addRoom(item) {
          this.roomStoreList = [
            {
              id: 0,
              name: '请选择店铺',
            },
          ];
          this.roomForm = {
            floor_id: item.id,
            room_number: '',
            building_id: item.building_id,
            mall_id: this.mall_id,
            brand_name: '',
            store_id: '',
          }
          item.store_list.forEach((val) => {
            if(val.room_id == 0 || val.room_id == item.id){
              this.roomStoreList.push(val);
            }
          });
          console.log(this.roomStoreList,1111111)
          this.roomVisible = true
        },
        onRoomSubmit(){
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.confirmLoading = true
              //请求接口,再把弹框关闭
              this.request(buildingPlatformApi.saveRoomInfo, this.roomForm)
                .then((res) => {
                  this.confirmLoading = false
                  this.$message.success(this.L(this.floorForm.id ? '编辑成功' : '添加成功'))
                  this.roomVisible = false
                  this.getFloorList()
                })
                .catch(() => {
                  this.confirmLoading = false
                })
            }
          })
        },
        editRoom(item) {
          this.roomStoreList = [
            {
              id: 0,
              name: '请选择店铺',
            },
          ];
          this.roomForm = {
            id: item.id,
            floor_id: item.floor_id,
            room_number: item.room_number,
            building_id: item.building_id,
            mall_id: this.mall_id,
            brand_name: item.brand_name,
            store_id: item.store_id >0 ? item.store_id : '',
          }
          item.store_list.forEach((val) => {
            if(val.room_id == 0 || val.room_id == item.id){
              this.roomStoreList.push(val);
            }
          });
          console.log(this.roomStoreList,1111111)
          this.roomVisible = true
        },
        deleteRoom(item) {
          this.$confirm({
            title: this.L('确定删除吗？'),
            okType: 'danger',
            onOk: () => {
              this.request(buildingPlatformApi.delRoomInfo, {
                id: item.id,
                mall_id: this.mall_id,
              }).then((res) => {
                this.$message.success(this.L('删除成功'))
                this.roomVisible = false
                this.getFloorList()
              })
            }
          })
        },
        handleChange(value) {
          console.log(`selected ${value}`);
          this.roomForm.store_id = value;
        },
        handleBlur() {
          console.log('blur');
        },
        handleFocus() {
          console.log('focus');
        },
        filterOption(input, option) {
          return (
            option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        },
    },
}
</script>
<style lang="less" scoped>
::v-deep .ant-tree {
}

.floor-box {
    padding: 10px 0;
    border: 1px solid #d8d8d8;
    height: 100%;
    .floor-list {
        border-top: 1px solid #d8d8d8;
    }
}
.building-box {
    border: 1px solid #d8d8d8;
    padding: 10px;
    width: 30%;
    height: 100%;
    overflow: hidden;
    table {
        margin: 10px 0;
        width: 100%;
        background-color: #f6f6f6;
        border: 1px solid #eeeeee;
        border-collapse: collapse;
        tr {
            &.active {
                background-color: #a3d4fb;
            }
        }
        td,
        th {
            padding: 8px;
        }
    }
}
</style>