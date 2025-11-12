<template>
  <div class="add-menu">
    <a-modal
      class="modal"
      width="60%"
      v-model="visible"
      title="自定义功能"
      centered
      @ok="handleOk"
      @cancel="handleClose"
    >
      <!-- 已选功能 -->
      <div class="header">
        <div class="title">已选功能：<span class="desc">（点击拖动调整排序）</span></div>
        <a-input-search
          placeholder="输入功能名称"
          allowClear
          style="width: 200px"
          v-model="keywords"
          @change="inputChange"
          @search="onSearch"
        />
      </div>
      <div class="selected">
        <div class="list" v-if="sList.length">
          <draggable v-model="sList" v-bind="dragOptions">
            <transition-group type="transition" name="flip-list">
              <div v-for="(item, index) of sList" :key="index" class="item move">
                <div class="icon">
                  <img :src="item.image" />
                </div>
                <div class="name no-wrap">{{ item.plugin_name }}</div>
                <a-icon @click.stop="deleteMenu(index)" class="delete color-red" type="close-circle" />
              </div>
            </transition-group>
          </draggable>
        </div>
        <div v-else class="no-data">暂未设置常用功能~</div>
      </div>
      <!-- 全部功能 -->
      <div class="all">
        <block v-if="allList.length">
          <div v-for="(item1, i1) of allList" :key="i1">
            <div class="title">{{ item1.cat_name }}</div>
            <div class="list" v-if="item1.plugin_list && item1.plugin_list.length">
              <div v-for="(item, i2) of item1.plugin_list" :key="i2" class="item">
                <div class="icon">
                  <img :src="item.image" />
                </div>
                <div class="name no-wrap">{{ item.plugin_name }}</div>
                <a-icon @click.stop="addMenu(i1, i2, item)" v-if="!item.add" class="add" type="plus-circle" />
              </div>
            </div>
            <div v-else class="no-data">此分类下暂无常用功能~</div>
          </div>
        </block>
        <div v-else class="no-data">暂无记录~</div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import indexPlatformApi from '@/api/common/platform/index'
import draggable from 'vuedraggable'
export default {
  name: 'PlatformAddMenu',
  components: {
    draggable,
  },
  props: {
    selectedList: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  data() {
    return {
      visible: false,
      keywords: '',
      sList: [],
      allList: [],
    }
  },
  methods: {
    handleOk() {
      let list = this.sList.map((item, index) => {
        return {
          plugin_id: item.plugin_id,
          sort: index + 1,
        }
      })
      //   console.log(11111, list)
      this.request(indexPlatformApi.editHotMenu, { menu_list: list }).then((data) => {
        this.$message.success('编辑成功~')
        this.$emit('ok')
        this.handleClose()
      })
    },
    onSearch(val) {
      this.getAllMenu()
    },
    inputChange(e) {
      console.log(this.keywords)
      if (!this.keywords) {
        this.getAllMenu()
      }
    },
    getAllMenu() {
      let params = {}
      if (this.keywords) {
        params.keyword = this.keywords
      }
      this.request(indexPlatformApi.getAllMenuTree, params).then((data) => {
        if (data) {
          this.allList = data.map((item) => {
            if (item.plugin_list && item.plugin_list.length) {
              item.plugin_list = this.handleList(item.plugin_list, this.sList)
            }
            return item
          })
        }
      })
    },
    handleList(list1, list2) {
      // list1为大数组
      if (list1.length) {
        list1.forEach((i1) => {
          i1.add = false
          list2.forEach((i2) => {
            if (i1.plugin_id == i2.plugin_id) {
              i1.add = true
            }
          })
        })
      }
      return list1
    },
    addMenu(i1, i2, item) {
      item.add = true
      this.sList.push(item)
      this.$set(this.allList[i1].plugin_list, i2, item)
      this.$set(this.allList, i1, this.allList[i1])
    },
    deleteMenu(i) {
      this.sList.splice(i, 1)
      console.log(this.sList)
      this.allList.forEach((item) => {
        if (item.plugin_list && item.plugin_list.length) {
          item.plugin_list = this.handleList(item.plugin_list, this.sList)
        }
      })
      this.$set(this, 'allList', this.allList)
    },
    openDialog() {
      this.sList = JSON.parse(JSON.stringify(this.selectedList))
      this.getAllMenu()
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
  },
}
</script>
<style scoped>
.selected {
  margin-top: 10px;
  min-height: 100px;
  max-height: 280px;
  overflow-y: scroll;
  background-color: #f4f4f4;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
.desc {
  color: #888888;
  font-size: 14px;
  font-weight: 400;
}
.list {
  width: 100%;
  overflow: hidden;
}
.list .item {
  float: left;
  width: 120px;
  margin-top: 20px;
  padding: 10px;
  box-sizing: border-box;
  line-height: 30px;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}
.list .item .icon {
  width: 40px;
  height: 40px;
  background-color: #f4f4f4;
  border-radius: 2px;
}
.list .item .icon img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.list .item .delete,
.list .item .add {
  position: absolute;
  right: 14px;
  top: 0px;
  font-size: 20px;
  cursor: pointer;
}
.all {
  margin-top: 20px;
  height: 400px;
  overflow-y: scroll;
}
.color-red {
  color: red;
}
.move {
  cursor: move;
}
.no-data {
  color: #999999;
  margin-top: 40px;
  text-align: center;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  /* opacity: 0.1; */
  background: #1890ff10;
}
</style>