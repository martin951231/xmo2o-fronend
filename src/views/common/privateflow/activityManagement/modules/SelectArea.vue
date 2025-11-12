<template>
  <div class="select-area">
    <a-drawer title="指定区域" placement="right" :visible="visible" @close="onClose" destroyOnClose :width="600">
      <div class="content" v-if="list.length">
        <div class="col" style="border-right: 1px solid #f4f4f4">
          <div class="header">选择省份</div>
          <div class="list">
            <div class="item" v-for="(item, index) of list" :key="item.area_id"  :style="item.selected ? 'color:#1890ff' : ''" @click="selectArea(index)">
              <a-icon v-if="item.selected" class="flod-icon" type="caret-down" />
              <a-icon v-else class="flod-icon" type="caret-right" />
              <a-checkbox :checked="item.checked" @change="(val) => onCheckChange(val, index, 1)"> </a-checkbox>
              <span class="city-name" >
                {{ item.area_name }}
              </span>
            </div>
          </div>
        </div>
        <div class="col" style="border-right: 1px solid #f4f4f4">
          <div class="header">选择城市</div>
          <div class="list" v-if="twoList.length">
            <div class="item" v-for="(item, index) of twoList" :key="item.area_id" :style="item.selected ? 'color:#1890ff' : ''" @click="selectArea(index1, index)">
              <a-icon v-if="item.selected" class="flod-icon" type="caret-down" />
              <a-icon v-else class="flod-icon" type="caret-right" />
              <a-checkbox :checked="item.checked" @change="(val) => onCheckChange(val, index, 2)"> </a-checkbox>
              <span class="city-name"  >
                {{ item.area_name }}
              </span>
            </div>
          </div>
          <div v-else class="no-data">--</div>
        </div>
        <div class="col">
          <div class="header">选择辖区</div>
          <div class="list" v-if="threeList.length">
            <div class="item" v-for="(item, index) of threeList" :key="item.area_id">
              <a-checkbox :checked="item.checked" @change="(val) => onCheckChange(val, index, 3)"> </a-checkbox>
              <span class="city-name" :style="item.selected ? 'color:#1890ff' : ''">
                {{ item.area_name }}
              </span>
            </div>
          </div>
          <div v-else class="no-data">--</div>
        </div>
      </div>
      <div class="footer">
        <a-checkbox
          style="margin-right: 20px"
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        >
          全选
        </a-checkbox>
        <a-button @click="submit" type="primary" size="large">确 定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import privateFlowApi from '@/api/common/priviteflow'
export default {
  name: 'PrivateFlowSelectArea',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      },
    },
    areaList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      visible: false,
      indeterminate: false,
      checkAll: false,
      list: [],
      index1: -1, // 省index
      index2: -1, // 市index
      twoList: [],
      threeList: [],
      checkedList: [],
      length: 0, //省市区总数量
    }
  },
  watch: {
    checkedList(val) {
      if (val.length && val.length != this.length) {
        this.indeterminate = true
      } else {
        this.indeterminate = false
        if (val.length == this.length) {
          this.checkAll = true
        }
      }
    },
  },
  mounted() {},
  methods: {
    handleList() {
      console.log('handleList')
      this.twoList = []
      this.threeList = []
      this.index1 = -1
      this.index2 = -1
      this.length = 0
      if (!this.list.length) {
        this.list = JSON.parse(JSON.stringify(this.areaList))
      }
      const checkedList = this.detail.area_ids || []
      this.checkedList = [...checkedList]
      this.list.forEach((item) => {
        item.selected = false
        item.checked = false
        this.length++
        if (checkedList.length) {
          checkedList.forEach((c) => {
            if (c == item.area_id) {
              item.checked = true
            }
          })
        }
        if (item.children && item.children.length) {
          item.children.forEach((item2) => {
            this.length++
            item2.selected = false
            item2.checked = false
            if (checkedList.length) {
              checkedList.forEach((c) => {
                if (c == item2.area_id) {
                  item2.checked = true
                }
              })
            }
            if (item2.children && item2.children.length) {
              item2.children.forEach((item3) => {
                this.length++
                item3.selected = false
                item3.checked = false
                if (checkedList.length) {
                  checkedList.forEach((c) => {
                    if (c == item3.area_id) {
                      item3.checked = true
                    }
                  })
                }
              })
            }
          })
        }
      })
      this.$set(this, 'list', this.list)
    },
    selectArea(index1, index2) {
      this.noCity = false
      this.noArea = false
      this.list.forEach((item1, i1) => {
        item1.selected = false
        if (index1 == i1) {
          item1.selected = true
          this.index1 = index1
          this.twoList = item1.children || []
          if (item1.children && item1.children.length && index2 > -1) {
            item1.children.forEach((item2, i2) => {
              item2.selected = false
              if (index2 == i2) {
                item2.selected = true
                this.index2 = index2
                this.threeList = item2.children || []
              }
            })
          } else {
            this.threeList = []
            // this.noArea = true
          }
        } else {
          if (item1.children && item1.children.length) {
            item1.children.forEach((item2, i2) => {
              item2.selected = false
            })
          }
        }
      })
      this.$set(this, 'list', this.list)
    },
    openDrawer() {
      this.$nextTick(() => {
        this.handleList()
      })
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    onCheckChange(e, index, type) {
      const checked = e.target.checked
      let item = null
      if (type == 1) {
        item = this.list[index]
        item.checked = checked
        this.$set(this.list, index, item)
      } else if (type == 2) {
        item = this.list[this.index1].children[index]
        item.checked = checked
        this.$set(this.list[this.index1].children, index, item)
      } else {
        item = this.list[this.index1].children[this.index2].children[index]
        item.checked = checked
        this.$set(this.list[this.index1].children[this.index2].children, index, item)
      }
      if (checked) {
        this.checkedList.push(item.area_id)
      } else {
        const i = this.checkedList.indexOf(item.area_id)
        this.checkedList.splice(i, 1)
      }
    },
    onCheckAllChange(e) {
      console.log(111, e)
      const checked = e.target.checked
      if (checked) {
        this.checkAll = true
        this.indeterminate = false
      } else {
        this.checkAll = false
        this.indeterminate = false
      }
      this.setListChecked(checked)
    },
    setListChecked(checked) {
      let checkedList = []
      this.list.forEach((item) => {
        item.checked = checked
        checkedList.push(item.area_id)
        if (item.children && item.children.length) {
          item.children.forEach((item2) => {
            item2.checked = checked
            checkedList.push(item2.area_id)
            if (item2.children && item2.children.length) {
              item2.children.forEach((item3) => {
                checkedList.push(item3.area_id)
                item3.checked = checked
              })
            }
          })
        }
      })
      if (checked) {
        this.checkedList = [...checkedList]
      } else {
        this.checkedList = []
      }
      this.$set(this, 'list', this.list)
    },
    submit() {
      this.request(privateFlowApi.assignArea, { id: this.detail.id, area_ids: this.checkedList }).then((data) => {
        this.$message.success('操作成功！')
        this.$emit('submit')
        this.visible = false
      })
    },
  },
}
</script>
<style  scoped>
.content {
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  /* border-top: 1px solid #f4f4f4; */
}

.col {
  flex: 1;
  text-align: left;
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}
.col .header {
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
}
.list .item {
  line-height: 30px;
  margin-top: 10px;
}
.city-name {
  margin-left: 10px;
  cursor: pointer;
}
.no-data {
  text-align: center;
  /* margin-top: 10px; */
  color: #999;
}
.footer {
  position: fixed;
  bottom: 10px;
  right: 40px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.flod-icon {
  margin-right: 10px;
}
</style>