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
  import configVillageApi from "@/api/community/village"

  const treeData1 = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {title: 'leaf', key: '0-0-0-0'},
            {title: 'leaf', key: '0-0-0-1'},
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{key: '0-0-1-0', slots: {title: 'title0010'}}],
        },
      ],
    },
  ];
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
        console.log('checkedKeysArr',checkedKeysArr);
        this.index = index
        this.type = type
        if (type == 2) {
          this.is_show = true
        } else {
          this.is_show = false
        }
        console.log('type',type,'is_show',this.is_show);
        this.title = '添加'
        this.getDirectortree()

      },
      onSelect(selectedKeys, info) {
        this.selectedKey = selectedKeys
        console.log('selected', selectedKeys, info);
      },
      onCheck(checkedKeys, info) {
        this.checkedKey = checkedKeys
        console.log('onCheck', checkedKeys, info);
      },
      getDirectortree() {
        this.request(configVillageApi.getDirectortree)
          .then((res) => {
            this.treeData = res.res
            console.log('resTree', res.res)
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
        console.log('type', this.type);
        if (this.type == 1) {
            console.log('selectedKey', this.selectedKey,this.index);
          this.$emit('ok', this.selectedKey, this.index)
        } else {
            console.log('checkedKey', this.checkedKey,this.index);
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