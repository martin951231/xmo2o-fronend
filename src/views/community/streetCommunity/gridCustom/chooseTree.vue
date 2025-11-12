<template>
  <a-modal :title="title" :width="600" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
           <!-- :default-expand-all="show" -->
    <a-tree
       v-if="visible && firstKey"
      :checkable="is_show"
      :defaultExpandedKeys="[firstKey]"
      :tree-data="treeData"
      :default-selected-keys="[]"
      :default-checked-keys="checkedKeysArr"
      :auto-expand-parent="show"
      :default-expand-parent="show"
      @select="onSelect"
      @check="onCheck"
    >
    </a-tree>
  </a-modal>
</template>

<script>
  import streetCommunityApi from '@/api/community/streetCommunity'
  export default {
    data() {
      return {
        show:true,
        is_show: false,
        title: '添加',
        treeData: [],
        visible: false,
        confirmLoading: false,
        id: 0,
        type: 0,
        selectedKey: [],
        checkedKey:[],
        checkedKeysArr:[],
        checkedKeysArrTemp:[],
        index: 0,
        firstKey: ''
      }
    },
    methods: {
      add(type, index,checkedKeysArr) {
       this.selectedKey = []
        this.checkedKey= [];
        this.checkedKeysArrTemp=[];
        if(checkedKeysArr!=undefined && checkedKeysArr && checkedKeysArr.length>0){
            this.checkedKeysArrTemp=checkedKeysArr;
        }else{
            this.checkedKeysArrTemp=[];
        }
        this.checkedKey=this.checkedKeysArrTemp;
        this.index = index
        this.type = type
        if (type == 2) {
          this.is_show = true
        } else {
          this.is_show = false
        }
        this.title = '请选择处理人员'
        this.getDirectortree()

      },
      onSelect(selectedKeys, info) {
        console.log('selectedKeys',selectedKeys,info)
        this.selectedKey = selectedKeys
      },
      onCheck(checkedKeys, info) {
        console.log('checkedKeys',checkedKeys,info)
        this.checkedKey = checkedKeys
      },
      getDirectortree() {
        this.request(streetCommunityApi.getGridEventOrg).then((res) => {
            this.treeData = res.res
            if(res.res[0].key){
                this.firstKey = res.res[0].key
            }
            this.checkedKeysArr= this.checkedKeysArrTemp;
            this.visible = true
            this.show=true
            setTimeout(() => {
              this.show=true
            }, 5000)
          })
      },
      handleSubmit() {
        this.visible = false
        this.is_show = false
        this.confirmLoading = false
        if (this.type == 1) {
          this.$emit('ok', this.selectedKey, this.index)
        } else {
          this.$emit('ok', this.checkedKey, this.index)
        }

      },
      handleCancel() {
        this.selectedKey = [];
        this.checkedKey= [];
        this.visible = false
        this.is_show = false
        this.checkedKeysArr=[];
        this.checkedKeysArrTemp=[];
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
</style>