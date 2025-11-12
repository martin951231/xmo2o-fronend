// myMixin.js  
import { v4 as uuidv4 } from 'uuid' // 使用 uuidv4 的导入方式
import { cloneDeep } from 'lodash'
import draggable from 'vuedraggable'
export default {
    props: {
        content: {
            type: Object,
            default: () => {
                return {}
            },
        },
        index: {
            type: Number,
            default: -1,
        },
        no: {
            type: Number,
            default: -1,
        },
        isSelect: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        draggable,
    },
    data() {
        return {
            form: null,
            radioStyle: {
                display: 'block',
                height: '50px',
                lineHeight: '50px',
            },
            sexIcon: {
                1: {
                    icon: 'man',
                    color: '#1055ff'
                },
                2: {
                    icon: 'woman',
                    color: '#ff3333'
                },
                0: {
                    icon: 'eye-invisible',
                    color: '#333'
                }
            },
        }
    },
    methods: {
        //更新表单
        updateForm(item) {
            this.form = item
        },
        //删除其他选项
        deleteOther() {
            this.form.extra_config.is_other = false
            this.form.extra_config.is_other_value = ''
            this.$emit('deleteOther', this.index)
        },
        //表单回调事件
        componentCallBack(type, item, index) {
            this.$emit('componentCallBack', type, this.form, index, item)
        },
    },
    mounted() {
        this.form = cloneDeep(this.content)
    },
};
