<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="党支部名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input  :maxLength="30" v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入党支部名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select
                    show-search
                    option-filter-prop="children"
                    placeholder="请选择类型"
                    v-decorator="['type', {initialValue:detail.type,rules: [{required: true, message: '请选择类型！'}]}]"
            >
              <a-select-option :value="item.key" v-for="(item,index) in party_type" :key="index">
                {{item.value}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>

        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="30">
            <a-input
                    :maxLength="100"
                    style="width: 300px"
                    v-model="detail.adress"
            />
            <span class="adress_box" @click="$refs.maPModel.init_(detail.id,detail.long,detail.lat)">点击选取地址</span>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>


        <a-form-item label="党支部介绍" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-textarea
                    :maxLength="200"
                    :rows="4"
              placeholder="党支部介绍"
              v-decorator="['details', {initialValue:detail.details}]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="绑定社区" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree
            :checkable="true"
            :tree-data="treeData"
            :checked-keys="checkedKeys"
            :replace-fields="replaceFields"
            @check="onCheck"
          ></a-tree>
        </a-form-item>
        <MapInfo ref="maPModel" @change="choiceMap" />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import MapInfo from './map';
    var treeData = [];
    export default {
      components: {
        MapInfo,
      },
        data() {
            return {
                title: '新建',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
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
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                detail: {
                    id: 0,
                    name: '',
                    details:'',
                    community: [],
                },
                treeData,
                checkedKeys:[],
                replaceFields: {
                    children: 'child',
                    title: 'name',
                },
                id:0,
                area_type: 0,
              party_type:[]
            }
        },
        mounted() {
            // this.getCommunitys();
            // this.getEditInfo();
        },
        methods: {
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
                this.detail.community = checkedKeys;
                this.checkedKeys = checkedKeys
                console.log('community',this.detail.community);
            },
            add() {
                this.title = '新建'
                this.visible = true
                this.id = '0'
                this.detail = {
                    id: 0,
                    name: '',
                    details:'',
                    community: [],
                  type:undefined,
                  long:'',
                  lat:'',
                  adress:'',
                }
                this.checkedKeys=[];
                this.getCommunitys();
                this.getPartyType();
            },
            edit(id) {
                this.visible = true
                this.id = id
                this.getCommunitys();
              this.getPartyType();
                this.getEditInfo()
                console.log(this.id)
                if (this.id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '新建'
                }
                console.log(this.title)
            },
            look(id) {
                this.visible = true
                this.area_type = 1;
                this.id = id
                this.getCommunitys();
                this.getPartyType();
                this.getEditInfo()
                console.log(this.id)
                if (this.id > 0) {
                    this.title = '查看'
                }
                console.log(this.title)
            },
            handleSubmit() {
                if (this.area_type==1) {
                    // 如果是社区无法编辑直接退出
                    this.visible = false
                    setTimeout(() => {
                        this.id = '0'
                        this.form = this.$form.createForm(this)
                    }, 500)
                    return false;
                }
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.id= this.id;
                        values.community = this.checkedKeys;
                      values.long=this.detail.long;
                      values.lat=this.detail.lat;
                      values.adress=this.detail.adress
                        this.request(streetCommunityApi.addPartyBranch, values)
                            .then((res) => {
                                if (this.detail.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                        console.log('values', values)

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getPartyInfo, {
                    id: this.id
                })
                    .then((res) => {
                        console.log('rererererererer',this.id);
                        console.log(res);
                        this.detail = {
                            id: 0,
                            name: '',
                            details:'',
                            community: [],
                        };
                        if(res.info.type == 0){
                          res.info.type=undefined
                        }
                        this.checkedKeys=[];
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.checkedKeys = res.info.community;
                        }
                        console.log('detail',this.detail)
                        console.log('checkedKeys',this.checkedKeys)
                    })
            },
            getCommunitys(){
                this.request(streetCommunityApi.getCommunity,{party_id:this.id}).then((res) => {
                    if (typeof(res)=='object') {
                        this.treeData = res;
                        treeData = res;
                    }
                })
            },

          //获取类型
          getPartyType(){
            this.request(streetCommunityApi.getPartyBranchType).then((res) => {
              this.party_type=res;
            })
          },

          //选取地图
          choiceMap(val){
            this.detail.long=val.lng.toString();
            this.detail.lat=val.lat.toString();
            if(val.address.length > 0){
              this.detail.adress=val.address;
            }
          },
        },
    }
</script>
<style lang="less" scoped>
  .ant-form-item label {
    width: 150px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }

  /deep/ .adress_box{
    padding: 5px;color: white;background: #87B87F;margin-left: 5px;border-radius:5px;cursor: pointer
  }
</style>