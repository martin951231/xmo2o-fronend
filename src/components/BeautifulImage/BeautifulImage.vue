<template>
    <div class="content" :style="[{ width: width, height: height, borderRadius: shape ? '50%' : radius }]">
        <div
            class="status-1"
            v-if="is_Loading"
            :style="[{ width: '100%', height: '100%', borderRadius: shape ? '50%' : radius }]"
        >
            <a-icon v-if="is_error" type="exclamation-circle" />
            <a-icon v-else-if="is_Loading" type="loading" />
            <div v-if="is_error" class="trip">加载失败</div>
        </div>
        <img
            v-if="!is_error"
            :src="src"
            alt="暂无图片"
            @click="viewImg(src)"
            class="imgs"
            :class="[mode, hover ? 'is-hover' : '']"
            :style="[{ width: '100%', height: '100%', borderRadius: shape ? '50%' : radius }]"
            @error="imgOnRrror"
            @load="imgOnLoad"
            :title="visible ? '点击查看图片' : ''"
        />
        <!-- 查看图片样式一 -->
        <a-modal
            v-model="visibleImg"
            title="查看图片"
            :footer="null"
            :width="modalWidth"
            centered
            v-if="viewerStyle == '1'"
        >
            <img :src="src" alt="暂无图片" :style="[{ width: '100%', height: '100%' }]" @error="imgOnRrror" />
        </a-modal>
        <!-- 查看图片样式二 -->
        <div :id="imgKey" style="display: none" v-if="viewerStyle == '2'">
            <img v-for="item in imgList" :key="item" :src="item" />
        </div>
    </div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
    name: 'BeautifulImage',
    props: {
        src: {
            type: String,
            default: () => '',
        },
        width: {
            type: String,
            default: () => '100%',
        },
        height: {
            type: String,
            default: () => '100%',
        },
        //是否为圆形
        shape: {
            type: Boolean,
            default: () => false,
        },
        //圆角
        radius: {
            type: String,
            default: () => '0px',
        },
        //图片显示方式 contain cover fill scale-down
        mode: {
            type: String,
            default: () => '',
        },
        //是否开启点击图片查看功能
        visible: {
            type: Boolean,
            default: () => false,
        },
        //是否鼠标经过动画效果
        hover: {
            type: Boolean,
            default: () => false,
        },
        modalWidth: {
            type: String,
            default: () => '50%',
        },
        //查看图片样式1旧版查看器弹框模式，2新组件查看器
        viewerStyle: {
            type: String,
            default: () => '1',
        },
    },
    data() {
        return {
            visibleImg: false,
            defaultImg: '', //默认图片
            is_error: false, //是否加载失败
            is_Loading: true, //false为加载完成
            imgList: [],
            imgKey: '0',
        }
    },
    created() {
        if (this.viewerStyle == '2') {
            this.imgKey = guid(10)
        }
    },
    methods: {
        viewImg(src) {
            if (this.visible) {
                if (this.viewerStyle == '1') {
                    this.visibleImg = true
                } else if (this.viewerStyle == '2') {
                    this.imgList = [src]
                    this.$nextTick(() => {
                        this.previewImg()
                    })
                }
            }
        },
        imgOnLoad(e) {
            this.is_error = false
            this.is_Loading = false
        },
        imgOnRrror(e) {
            this.is_error = true
        },
        //加载查看图片插件
        previewImg() {
            let viewer = new Viewer(document.getElementById(this.imgKey), {
                button: true,
                inline: false,
                zoomable: true,
                title: true,
                tooltip: true,
                movable: true,
                interval: 2000,
                navbar: true,
                loading: true,
                show: function () {
                    viewer.full()
                },
                // 每次关闭查看时触发
                hide() {
                    viewer.destroy()
                },
                // 每次关闭查看时触发，在hide之后
                hidden() {
                    viewer.destroy()
                },
            })
            viewer.show()
        },
    },
}

/**
 * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
function guid(len = 32, firstU = true, radix = null) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = []
    radix = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
        uuid.shift()
        return 'u' + uuid.join('')
    } else {
        return uuid.join('')
    }
}
</script>

<style lang="less" scoped>
.content {
    cursor: pointer;
    overflow: hidden;
}
.imgs {
    transition: all 0.3s;
}
.contain {
    object-fit: contain;
}
.cover {
    object-fit: cover;
}
.fill {
    object-fit: fill;
}
.none {
    object-fit: none;
}
.scale-down {
    object-fit: scale-down;
}
.img-border-radius {
    border-radius: 50% !important;
}
.is-hover:hover {
    transform: scale(1.2);
}
.status-1 {
    background-color: #f3f4f6;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .trip {
        font-size: 10px;
        margin-top: 2px;
    }
}
</style>
