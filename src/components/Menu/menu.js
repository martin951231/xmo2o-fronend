import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

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
      firstRender: true
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
      this.firstRender = false
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
      if(key == '/property/property/communityData'){
          window.open('/v20/public/platform/#' + key)
      } else if(key == '/community/village/workOrder/orderTongji/orderTongji'){
          window.open('/v20/public/platform/#' + key)
      }else if(key =='/system/community/cityRegionManage/visualizationScreen'){
           window.open('/v20/public/platform/#' + key)  
      } else {
          this.$emit('select', { item, key, selectedKeys })
      }
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
      let CustomTag = null
      if(menu.path == '/property/property/communityData' || menu.path == '/community/village/workOrder/orderTongji/orderTongji' || menu.path == '/system/community/cityRegionManage/visualizationScreen'){
          CustomTag = 'div'
      } else{
          CustomTag = target && 'a' || 'router-link'
      }
      const props = { to: { name: menu.name } }
      const attrs = { href: target && 'a' ? menu.path : lt + menu.path, target: menu.meta.target }
      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      return (
        <Menu.Item {...{ key: menu.path }}>
          <CustomTag {...{ props, attrs }}>
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </CustomTag>
        </Menu.Item>
      )
    },
    renderSubMenu(menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      return (
        <Menu.SubMenu {...{ key: menu.path }}>
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
        <IconFont {... { props }} />
        // <Icon {... { props }} />
      )
    }
  },

  render() {
    const dynamicProps = {
      props: {
        mode: this.mode,
        theme: this.theme,
        // openKeys: this.openKeys,
        selectedKeys: this.selectedKeys,
        // defaultOpenKeys: ['/property_data_center', '/house_cashierorderlist']
      },
      on: {
        openChange: this.onOpenChange,
        select: this.onSelect
      }
    }
    if(this.firstRender){
        dynamicProps.props.defaultOpenKeys =  ['/property_data_center', '/house_cashierorderlist']
    } else{
        dynamicProps.props.openKeys =  this.openKeys
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
