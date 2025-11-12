/**
*******************
*   @author 郑亚莉
*   @date 2020-06-28
*   @description 可拖拽列表
*******************
*/
<template>
  <div class="drag-box">
    <draggable :list="dataList" class="list-group" handle=".handle" @end="getNewData('drag')">
      <div class="box" v-for="item1 of dataList" :key="item1.id">
        <drag-item
          :content="item1"
          :draggable="draggable"
          :editable="editable"
          :show="true"
          type="1"
          @handleItemClick="handleItemClick"
        />
        <template v-if="item1.children && item1.children.length">
          <draggable :list="item1.children" class="list-group" handle=".handle" @end="getNewData('drag')">
            <div class="box" v-for="item2 of item1.children" :key="item2.id">
              <drag-item
                :content="item2"
                :draggable="draggable"
                :editable="editable"
                :show="item1.open"
                type="2"
                @handleItemClick="handleItemClick"
              />
              <template v-if="item2.children && item2.children.length">
                <draggable :list="item2.children" class="list-group" handle=".handle" @end="getNewData('drag')">
                  <div class="box" v-for="item3 of item2.children" :key="item3.id">
                    <drag-item
                      :content="item3"
                      :draggable="draggable"
                      :editable="editable"
                      :show="item2.open && item1.open"
                      type="3"
                      @handleItemClick="handleItemClick"
                    />
                  </div>
                </draggable>
              </template>
            </div>
          </draggable>
        </template>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import DragItem from './DragItem'

let firstIn = true

export default {
  name: 'DragBox',
  components: {
    draggable,
    DragItem,
  },
  props: {
    // 可拖动的列表数据
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 是否可拖拽（是否显示拖拽按钮）
    draggable: {
      type: Boolean,
      default: true,
    },
    // 是否可编辑（是否显示编辑按钮）
    editable: {
      type: Boolean,
      default: true,
    },
    // 是否默认选中第一个
    defaultSelect: {
      type: Boolean,
      default: true,
    },
    // 当前选中项id
    select: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      dataList: [],
      selectedId: 0, // 当前选中项id
      selectedItem: {}, // 当前选中项（包含被选中的父）
    }
  },
  watch: {
    defaultSelect(val) {
      if (this.select) {
        if (val) {
          this.defaultSelectFirst()
        } else {
          this.initList(this.dataList)
        }
      }
    },
    select(val) {
      if (val) {
        this.selectedId = val
        this.setListSelected(this.dataList, this.selectedId)
        this.setFather(this.dataList)
      }
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化
    initData() {
      this.dataList = JSON.parse(JSON.stringify(this.list))
      console.log(this.dataList)
      if (this.dataList.length) {
        // 初始化list
        this.initList(this.dataList)
        console.log(this.dataList)
        if (this.select) {
          this.selectedId = this.select
          this.setListSelected(this.dataList, this.selectedId)
          this.setFather(this.dataList)
        } else if (this.defaultSelect) {
          // 默认选择第一个数据
          this.defaultSelectFirst()
        }
      }
    },
    // 默认选中第一个
    defaultSelectFirst() {
      let item = this.dataList[0]
      this.getSelectedId(item)
      this.selectedItem = item
      if (item.children && item.children.length) {
        item.open = true
        item.children[0].open = true
      }
      this.$set(this.dataList, 0, item)
      // 设置selected属性
      this.setListSelected(this.dataList, this.selectedId)
      this.setFather(this.dataList)
    },
    // 1级2级菜单需要添加open属性(false) 所有菜单需要添加selected属性(0)
    initList(list) {
      list.forEach((item) => {
        item.selected = 0
        if (item.children && item.children.length) {
          item.open = false
          this.initList(item.children)
        }
      })
      this.dataList = JSON.parse(JSON.stringify(list))
    },
    // 获取选中的id item为点击的项
    getSelectedId(item) {
      if (item.children && item.children.length) {
        // 有子默认选中子项第一个
        this.getSelectedId(item.children[0])
      } else {
        // 1级菜单时
        this.selectedId = item.id
      }
    },

    // 为list添加是否被选择属性 selected
    // 2020.7.6 只有最后一级目录是可选的 selected 0自己和子元素都未被选中效果 1子被选中时效果(当3级菜单选中1级菜单有此效果，2级没有) 2 被选中时效果
    //  id为被选中的id
    setListSelected(list, id) {
      list.forEach((item, index) => {
        if (item.id == id) {
          item.selected = 2
          this.selectedItem = item
        } else {
          item.selected = 0
        }
        if (item.children && item.children.length) {
          this.setListSelected(item.children, id)
        }
      })
      this.dataList = JSON.parse(JSON.stringify(list))
    },

    // 子被选中 最高父级被选中时效果
    setFather(list) {
      const fid = this.selectedItem.fid
      if (fid == 0) {
        // 1级菜单
        return
      } else {
        for (let item of list) {
          if (item.id == fid) {
            // 找到祖先节点
            this.selectedItem = item
            item.selected = 1
            // this.$set(this.dataList, index, item)
            return
          } else {
            if (item.children && item.children.length) {
              const sItem = this.getParentId(item.children, fid)
              if (sItem) {
                this.selectedItem = sItem
                this.setFather(this.dataList)
              }
            }
          }
        }
      }
    },
    // 3级菜单获取父2级菜单
    getParentId(list, fid) {
      for (let item of list) {
        if (item.id == fid) {
          item.selected = 1
          return item
        }
      }
    },

    // 展开父级菜单
    setMenuOpen(item) {
      let idx = 0
      let el = {}
      if (item.fid == 0) {
        // 一级菜单
        this.dataList.forEach((i, index) => {
          if (item.id == i.id) {
            item.open = !item.open
            idx = index
            el = i
          }
        })
      } else {
        // 二级菜单
        this.dataList.forEach((i, index) => {
          if (item.fid == i.id) {
            for (let j of i.children) {
              if (j.id == item.id) {
                j.open = !j.open
              }
            }
            idx = index
            el = i
          }
        })
      }
      this.$set(this.dataList, idx, el)
    },

    // 点击项和每项上的按钮点击操作
    handleItemClick(val) {
      const { type, data } = val
      if (type == 'click') {
        if (data.children && data.children.length) {
          this.setMenuOpen(data)
        } else {
          this.setListSelected(this.dataList, data.id)
          this.setFather(this.dataList)
        }
      }
      this.getNewData(type, JSON.parse(JSON.stringify(data)))
    },
    // 拖拽后新的排序反馈给父组件 或 点击新的项/编辑/删除按钮点击反馈给父组件
    // type: drag edit click
    getNewData(type, value) {
      let data = JSON.parse(JSON.stringify(this.dataList))
      if (data.length) {
        for (let item of data) {
          delete item.selected
          delete item.open
        }
        if (type == 'drag') {
          // 如果是拖拽 返回排列好的数组
          this.$emit('handleChange', { type, data })
          // this.$message.success('排序成功！')
        } else {
          // 其他操作返回操作的当前项
          delete value.selected
          delete value.open
          // this.$emit('handleChange', { type, data: value })
          // 编辑按钮返回当前点击项
          if (type == 'edit') {
            // this.$message.info('点击了编辑！')
            this.$emit('handleChange', { type, data: value })
          }
          // // 点击操作返回当前选中项
          if (type == 'click' && (!value.children || value.children.length == 0)) {
            this.$emit('handleChange', { type, data: value })
          }
        }
      } else {
        console.log('数据出错了')
        return
      }
    },
  },
}
</script>
<style scoped lang='less'>
.drag-box {
  width: 100%;
  cursor: default;
  color: #333333;
}
</style>
