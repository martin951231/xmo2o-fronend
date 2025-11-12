<template>
    <a-modal v-model="visible" :title="L('指定城市')" centered :bodyStyle="{maxHeight:'60vh',overflowY:'auto'}"  @ok="handleOk"  @cancel="handleCancel">
    <a-tree
      v-model="checkedKeys"
      checkable
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :selected-keys="selectedKeys"
      :tree-data="treeData"
      @expand="onExpand"
    />
    </a-modal>
  </template>
  <script>
  
  
  import activityPlatformApi from '@/api/activity/platform'
  
  export default {
    data() {
      return {
        id:0,
        visible: false,
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        treeData:[],
      };
    },
    watch: {
      checkedKeys(val) {
        console.log('onCheck', val);
      },
    },
    methods: {
      handleCancel() {
            this.visible = false
      },
      handleOk(){
        let params = {
            id: this.id,
            city_ids:this.checkedKeys
        }
        this.request(activityPlatformApi.adverAreaSet, params).then((res) => {
          this.$message.success(this.L('设置成功！'))
          this.visible = false;
        })
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onCheck(checkedKeys) {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys;
      },
      show(id){
        this.id = id;
        this.visible = true;
        let params = {
            id: id
        }
        this.request(activityPlatformApi.getAdverArea, params).then((res) => {
            this.treeData = res.tree_data;
            this.checkedKeys = res.check_data;
            this.expandedKeys = [];
        })
      }
    },
  };
  </script>
  