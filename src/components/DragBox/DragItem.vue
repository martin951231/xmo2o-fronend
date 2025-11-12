/**
*******************
*   @author 郑亚莉
*   @date 2020-06-29
*   @description 可拖拽列表项
*******************
*/
<template>
  <div
    class="handle"
    :class="[currentSelected, currentClass]"
    @click.stop="handleClick('click')"
    @mouseenter="onMouseOver"
    @mouseleave="onMouseOut"
    v-if="show"
  >
    <div class="img-container" v-show="draggable">
      <a-tooltip v-if="showIcon">
        <template slot="title">拖动整行排序</template>
        <img class="drag-img" src="../../assets/merchant/drag_blue.png" />
      </a-tooltip>
    </div>
    <div class="title-con">
      <span class="title">{{ content.title }}</span>
      <span v-if="content.goods_count != undefined">（{{ content.goods_count }}）</span>
    </div>
    <div class="img-container" v-show="editable" @click.stop="handleClick('edit')">
      <img v-if="showIcon" class="edit-img" src="../../assets/merchant/edit_blue.png" />
    </div>
    <div class="img-container" v-if="content.children && content.children.length && showIcon">
      <img v-if="content.open" src="../../assets/merchant/up_blue.png" />
      <img v-else src="../../assets/merchant/down_blue.png" />
    </div>
    <div class="img-container" v-if="content.children && content.children.length && !showIcon">
      <img v-if="content.open" src="../../assets/merchant/up.png" />
      <img v-else src="../../assets/merchant/down.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DragItem',
  props: {
    // 可拖动的列表数据
    content: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 几级菜单 1 2 3
    type: {
      type: [Number, String],
      default: 1,
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
    // 是否显示
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentClass() {
      if (this.type == 1) {
        return 'first-box'
      } else if (this.type == 2) {
        return 'second-box'
      } else {
        return 'third-box'
      }
    },
    currentSelected() {
      if (this.content.selected == 1) {
        return 'parentactive'
      } else if (this.content.selected == 2) {
        return 'active'
      } else {
        return ''
      }
    },
  },
  data() {
    return {
      showIcon: false,
    }
  },
  mounted() {},
  methods: {
    handleClick(type) {
      this.$emit('handleItemClick', { type, data: this.content })
    },
    onMouseOver() {
      this.showIcon = true
    },
    onMouseOut() {
      this.showIcon = false
    },
  },
}
</script>

<style scoped lang='less'>
.handle {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
}
.first-box,
.second-box,
.third-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.second-box {
  margin-left: 20px;
}
.third-box {
  margin-left: 40px;
}
.img-container {
  width: 40px;
  height: 40px;
  img {
    width: 16px;
    height: 16px;
    margin: 12px;
  }
  .drag-img {
    cursor: move;
  }
}
.title-con {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(~'100% - 90px');
  .title {
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
    // flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}

.active {
  background: #1890ff20;
  box-shadow: 2px 0px 0px 0px #1890ff;
  color: #1890ff;
}
.parentactive {
  color: #1890ff;
}
</style>
