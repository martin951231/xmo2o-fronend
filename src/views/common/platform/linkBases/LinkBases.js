import Vue from 'vue'
import LinkBases from './LinkBases.vue'
const LinkBasesBox = Vue.extend(LinkBases)
 
LinkBases.install = function (data) {
    // console.log(data,'data')
    let instance = new LinkBasesBox({
        data
    }).$mount()
 
    document.body.appendChild(instance.$el)
 
    Vue.nextTick(() => {
        // console.log(instance,'instance')
        // visible 和弹窗组件里的visible对应，用于控制显隐 设置默认值
        instance.visible = data.visible || true
        instance.title = data.title || '设置链接地址'
        instance.source = data.source || 'platform'
        instance.type = data.type || 'h5'
        instance.source_id = data.source_id || ''
        instance.store_id = data.store_id || ''
        const modalGetContainer = () => {
            return document.body
        }
        instance.modalGetContainer = data.modalGetContainer || modalGetContainer
        instance.getLinkCategory()
    })
}
export default LinkBases