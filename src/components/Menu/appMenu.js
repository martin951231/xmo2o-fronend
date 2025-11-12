import Menu from 'ant-design-vue/es/menu'
import './menu.css'

import IconFont from '@/utils/icon'
export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: [],
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted() {
    this.updateMenu()
  },
  watch: {
    collapsed(val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange(openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
      // console.log(this.openKeys)
    },
    onSelect({ item, key, selectedKeys }) {
      this.selectedKeys = selectedKeys
      this.$emit('select', { item, key, selectedKeys })
    },
    updateMenu() {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      const open_key = routes[routes.length - 1].meta.open_key
      let open_route = ''
      if (open_key) {
        open_route = routes[routes.length - 1].parent.path
      }
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]

      } else {
        this.selectedKeys = [routes.pop().path]
      }
      if (open_key) {
        this.selectedKeys = [open_route]
      }
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }
      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },

    // render
    renderItem(menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem(menu) {
      const lt = location.origin + location.pathname + '#'
      const target = menu.meta.target || null
      const CustomTag = target && 'a' || 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: lt + menu.path, target: menu.meta.target }

      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      if((menu.name == 'menu_710' || menu.name == 'menu_718' || menu.name == 'menu_707' || menu.name == 'menu_708') && menu.meta.not_audit_num > 0){
          return (
              // , class: 'appMenu'
              <Menu.Item {...{ key: menu.path, class: 'appMenu' }}>
              <CustomTag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
              <span style="min-width:20px;height:20px;border-radius:18px;background:#e83338;color:#fff;padding:0 6px;">{menu.meta.not_audit_num}</span>
              </CustomTag>
              </Menu.Item>
          )
      }else{
          return (
              // , class: 'appMenu'
              <Menu.Item {...{ key: menu.path, class: 'appMenu' }}>
              <CustomTag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
              </CustomTag>
              </Menu.Item>
      )
      }
    },
    renderSubMenu(menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      return (
        // , class: 'appMenu' 
        <Menu.SubMenu {...{ key: menu.path, class: 'subMenu' }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {itemArr}
        </Menu.SubMenu>
      )
    },
    renderIcon(icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        // 自定义iconfont图标
        <IconFont {... { props }} style="font-size: 16px;" />
        // <Icon {... { props }} />
      )
    }
  },

  render() {
    const dynamicProps = {
      props: {
        mode: this.mode,
        theme: this.theme,
        openKeys: this.openKeys,
        selectedKeys: this.selectedKeys
      },
      on: {
        openChange: this.onOpenChange,
        select: this.onSelect
      }
    }

    const menuTree = this.menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    return (<Menu {...dynamicProps}>{menuTree}</Menu>)
  }
}
