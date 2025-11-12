<template>
  <a-modal v-model="modelVisible" @ok="handleSubmit" width="1000px" :maskClosable="false">
    <a-tabs>
      <a-tab-pane key="1" tab="基本设置">
        <a-spin :spinning="confirmLoading" :height="800">
          <a-form :form="form">
            <a-form-item label="登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
              <a-col :span="18">
                <a-input :disabled="is_show" v-model="detail.username" />
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
              <a-col :span="18">
                <a-input  type="password" v-model="detail.password"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
              <a-col :span="18">
                <a-input  type="password" v-model="detail.confirm_password"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input v-model="detail.name"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input v-model="detail.phone"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="管理员设置" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-radio-group v-model="detail.qx">
                  <a-radio :value="1">总管理员</a-radio>
                  <a-radio :value="0">{{}}管理员</a-radio>
                </a-radio-group>
              </a-col>
            </a-form-item>
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input v-model="detail.remark"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" tab="权限设置">
        <div v-if="detail.qx<1" class="package-list ant-pro-page-header-wrap-children-content" style="margin:0 0 0;">
          <a-card :bordered="false">
            <div class="search-box" style="margin-bottom: 10px;">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 130px;">
                  <a-select default-value="0" style="width: 105px" placeholder="请选择省" @change="handleChange"
                            v-model="search.province">
                    <a-select-option value="0">
                      全部省
                    </a-select-option>
                    <a-select-option :value="item1.area_id" v-for="(item1,index1) in province_list" :key="index1">
                      {{item1.area_name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 117px">
                  <a-select default-value="0" style="width: 115px" placeholder="请选择市" @change="handleChange1"
                            v-model="search.city">
                    <a-select-option value="0">
                      全部市
                    </a-select-option>
                    <a-select-option :value="item2.id" v-for="(item2,index2) in city_list" :key="index2">
                      {{item2.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 117px">
                  <a-select default-value="0" style="width: 115px" placeholder="请选择区" @change="handleChange2"
                            v-model="search.area">
                    <a-select-option value="0">
                      全部区
                    </a-select-option>
                    <a-select-option :value="item3.id" v-for="(item3,index3) in area_list" :key="index3">
                      {{item3.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 119px">
                  <a-select default-value="0" style="width: 117px" placeholder="请选择街道" @change="handleChange3"
                            v-model="search.street">
                    <a-select-option value="0">
                      全部街道
                    </a-select-option>
                    <a-select-option :value="item4.id" v-for="(item4,index4) in street_list" :key="index4">
                      {{item4.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 118px">
                  <a-select default-value="0" style="width: 117px" placeholder="请选择社区" v-model="search.community">
                    <a-select-option value="0">
                      全部社区
                    </a-select-option>
                    <a-select-option :value="item5.id" v-for="(item5,index5) in community_list" :key="index5">
                      {{item5.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 10px;padding-right: 1px;width: 20%">
                  <a-input-group compact>
                    <label style="margin-top: 5px;" v-if="$store.getters.config">{{$store.getters.config.house_name}}名称：</label>
                    <a-input style="width: 54%" v-model="search.village_name"/>
                  </a-input-group>
                </a-col>
                <a-col :md="2" :sm="2" style="padding-left: 1px;padding-right: 24px;">
                  <a-button type="primary" icon="search" @click="searchList()">
                    查询
                  </a-button>
                </a-col>
              </a-row>
            </div>
            <div class="table-operator">
              <a-button v-if="$store.getters.config" type="primary" icon="plus" @click="$refs.createModal.add(detail.id,areas,list)">绑定{{$store.getters.config.house_name}}</a-button>
            </div>
            <a-table :columns="columns" :data-source="list">
              <span slot="action" slot-scope="record, index, indent, expanded">
          <a-divider type="vertical"/>
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认移除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteVillageConfirm(record, index, indent, expanded)"
              @cancel="cancel1"

            >
              <a href="#">移除</a>
            </a-popconfirm>
        </span>
            </a-table>

          </a-card>
          <village-list :height='800' :width="1500" ref="createModal" @ok="handleOks"/>
        </div>
        <div v-else class="package-list ant-pro-page-header-wrap-children-content" style="margin:0 0 0;">
          <p>该管理员为总管理员，拥有所有{{$store.getters.config.house_name}}的硬件查看权限，如需更改，请切换到基本设置中将管理员设置为{{$store.getters.config.house_name}}管理员</p>
        </div>
      </a-tab-pane>

    </a-tabs>

  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  import villageList from './villageList.vue'
	import store from '@/store';
  const columns = [
    {
      title: store.getters.config.house_name+'名称',
      dataIndex: 'village_name',
      key: 'village_name',
    },
    {
      title: store.getters.config.house_name+'地址',
      dataIndex: 'village_address',
      key: 'village_address',
    },

    {
      title: '操作',
      key: 'action',
      dataIndex: '',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];
  export default {
    name: 'adminUserInfo',
    components: {
      villageList
    },
    data() {
      return {
        is_show:false,
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 8
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        modelVisible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        detail: {
          id: 0,
          username: '',
          password: '',
          confirm_password: '',
          name: '',
          phone: '',
          remark: '',
          qx: 1,
        },
        id: 0,
        isClear: false,
        loading: false,
        columns,
        search: {page: 1},
        list: [],
        province_list: [],
        city_list: [],
        area_list: [],
        street_list: [],
        community_list: [],
        areas: [],
        pagination: [],
        streetarr:[]

      }
    },
    methods: {
      tableChange() {

      },
      onChange() {

      },

      handleOks(item, type) {
        if (item) {
          if (type == 1) {
            this.list.push(item);
          } else {
            for (let i in item) {
              if (item[i]) {
                this.list.push(item[i]);
              }
            }
          }

        } else {
          this.getVillageList()
        }
      },
      add() {
        this.is_show = false;
        this.modelVisible = true
        this.visible = true
        this.getAreaList()
        this.detail = {
          id: 0,
          username: '',
          name: '',
          password: '',
          confirm_password: '',
          phone: '',
          remark: '',
          qx: 1,
        }
        this.checkedKeys = [];
        this.list = [];
      },

      edit(id) {
        this.is_show = true;
        this.modelVisible = true
        this.id = id
        this.getEditInfo()
        this.getVillageList()
        this.getAreaList()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '新建'
        }
      },
      cancel1() {

      },

      handleSubmit() {
        const {
          form: {
            validateFields
          }

        } = this
        this.confirmLoading = true
        if (this.detail.id > 0) {
          this.request(configHouseMeterApi.adminUserEdit, this.detail)
            .then((res) => {
              this.$message.success('编辑成功')
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.modelVisible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          console.log('list', this.list)

          this.request(configHouseMeterApi.adminUserAdd, {detail: this.detail, list: this.list})
            .then((res) => {
              this.$message.success('添加成功')
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.modelVisible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        }
      },
      /*   handleCancel() {
             // this.visible = false
             // setTimeout(() => {
             //     this.activity_id = '0'
             //     this.join_id = '0'
             //     this.form = this.$form.createForm(this)
             // }, 500)
         },*/

      getVillageList() {
        console.log('search', this.search);
        this.request(configHouseMeterApi.villageBindList, {uid: this.id, type: 0, search: this.search})
          .then((res) => {
            console.log('res111', res);
            this.list = res.list;
          })
      },
      getEditInfo() {
        this.request(configHouseMeterApi.adminUserInfo, {
          id: this.id
        })
          .then((res) => {
            this.detail = res
          })
      },
      getAreaList() {
        this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
          .then((res) => {
            this.province_list = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })

      /*
        this.request(configHouseMeterApi.areaList)
          .then((res) => {
            this.areas = res
            console.log('arealist', res)
            this.province_list = res.province_list

          })
          .catch((error) => {
            this.confirmLoading = false
          })*/
      },
      handleChange(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
          .then((res) => {
            this.city_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })



      },
      handleChange1(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
          .then((res) => {
            this.area_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange2(value) {

        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
          .then((res) => {
            this.street_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange3(value) {
        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
          .then((res) => {
            this.community_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      // 进行搜索
      searchList() {
        console.log('search', this.search);
        this.getVillageList()
      },
      deleteVillageConfirm(item, indent) {
        let id = item.id
        let uid = this.detail.id;
        if (uid > 0) {
          this.request(configHouseMeterApi.meterVillageDelete, {'village_id': id, 'uid': uid})
            .then((res) => {
              this.getVillageList()
              this.$message.success('删除成功')
            })
        } else {
          this.list.splice(indent, 1);
        }

      },
    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }

  .tip-txt {
    margin-left: 4px;
    font-size: 12px;
  }

  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }

  .imgname {
    width: 100px;
  }

  .ant-radio-wrapper {
    margin-right: 45px;
  }

 .ant-card-body {
    padding: 1px;
    zoom: 1;
  }

  .ant-col-md-8 {
    width: 11.333333%;
  }

  .ant-col-md-2 {
    width: 12%;
  }
</style>