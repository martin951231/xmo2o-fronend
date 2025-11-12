<script>
import events from './events'
import Vue from 'vue'
import { setCustomTitle } from './setMenuTitle'
import { isEmpty } from '@/utils/util'

let pages = []
let fullPathList = []
export default {
  name: 'MultiTab',
  data() {
    return {
      // fullPathList: [],
      // pages: [],
      activeKey: '',
      newTabIndex: 0,
    }
  },
  created() {
    // bind event
    events
      .$on('open', (val) => {
        if (!val) {
          throw new Error(`multi-tab: open tab ${val} err`)
        }
        this.activeKey = val
      })
      .$on('close', (val) => {
        if (!val) {
          this.closeThat(this.activeKey)
          return
        }
        this.closeThat(val)
      })
      .$on('rename', ({ key, name }) => {
        console.log('rename', key, name)
        try {
          const item = pages.find((item) => item.path === key)
          item.meta.customTitle = name
          this.$forceUpdate()
        } catch (e) {}
      })
    this.handlePageList(this.$route)
    // this.selectedLastPath()
  },
  methods: {
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    remove(targetKey) {
      pages = pages.filter((page) => page.fullPath !== targetKey)
      fullPathList = fullPathList.filter((path) => path !== targetKey)
      this.$forceUpdate()
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath() {
      this.activeKey = fullPathList[fullPathList.length - 1]
    },

    // content menu
    closeThat(e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (fullPathList.length > 1) {
        this.remove(e)
      } else {
        // this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    closeLeft(e) {
      const currentIndex = fullPathList.indexOf(e)
      if (currentIndex > 0) {
        fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight(e) {
      const currentIndex = fullPathList.indexOf(e)
      if (currentIndex < fullPathList.length - 1) {
        fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeAll(e) {
      const currentIndex = fullPathList.indexOf(e)
      fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    closeMenuClick(key, route) {
      this[key](route)
    },
    refreshPath() {
      this.$router.replace({ path: '/refresh' })
    },
    renderTabPaneMenu(e) {
      return (
        <a-menu
          {...{
            on: {
              click: ({ key, item, domEvent }) => {
                this.closeMenuClick(key, e)
              },
            },
          }}
        >
          <a-menu-item key="refreshPath">刷新当前标签</a-menu-item>
          <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭全部</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane(title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)
      const refreshIcon = this.renderRefreshIcon(keyPath)
      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }} class="lh-20">
            {title}
            {refreshIcon}
          </span>
        </a-dropdown>
      )
    },
    renderRefreshIcon(keyPath) {
      if (keyPath == this.activeKey) {
        return (
          <a-icon
            style="margin-left:10px;font-size: 12px;"
            type="reload"
            {...{
              on: {
                click: () => {
                  this.refreshPath()
                },
              },
            }}
          />
        )
      }
    },
    // 当前路由是否已经在tab列表里
    handlePageList(val) {
      this.activeKey = val.fullPath
      if (fullPathList.indexOf(val.fullPath) < 0) {
        fullPathList.push(val.fullPath)
        pages.push(val)
      }
    },
  },
  watch: {
    $route: function (newVal) {
      this.handlePageList(newVal)
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    },
  },
  render() {
    const { onEdit } = this
    const panes = pages.map((page) => {
      let cTitle = ''
      if (!isEmpty(page.query)) {
        // 一般情况下有参数才会导致标题不一样，加个判断节省渲染时间
        cTitle = setCustomTitle(page)
      }
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(cTitle || page.meta.customTitle || page.meta.title, page.fullPath)}
          key={page.fullPath}
          closable={pages.length > 1}
        ></a-tab-pane>
      )
    })
    this.$store.commit('SET_TAB_NUM', panes.length)
    if (panes.length > 1) {
      return (
        <div class="ant-pro-multi-tab" style="margin-bottom: 0px">
          <div class="ant-pro-multi-tab-wrapper">
            <a-tabs
              hideAdd
              type={'editable-card'}
              v-model={this.activeKey}
              tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
              {...{ on: { edit: onEdit } }}
            >
              {panes}
            </a-tabs>
          </div>
        </div>
      )
    }
    return null
  },
}
</script>
