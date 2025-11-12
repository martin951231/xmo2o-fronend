<template>
    <div>
        <!-- 静态富文本示例 -->
        <div class="sample-text" draggable="false" v-if="!content.richTextCode">
            <div
                class="cap-richtext relative sx-hidden sy-hidden"
                :style="{
                    'background-color': bgColor,
                    padding: content.show_full_screen == 'full' ? '' : '13px 13px 0',
                }"
            >
                <componentBgImage
                    :bgImage="content.bg_image"
                    :show="content.bg_color_style == 2 && content.bg_image ? true : false"
                    :opacity="content.bg_color_opacity"
                ></componentBgImage>
                <div class="relative">
                    <p style="margin-bottom: 16px">
                        <strong>{{ L('点此编辑『富文本』内容') }} ——></strong>
                    </p>
                    <p style="margin-bottom: 20px">
                        {{ L('你可以对文字进行') }}<strong>{{ L('加粗') }}</strong
                        >、<em>{{ L('斜体') }}</em
                        >、<span style="text-decoration: underline">{{ L('下划线') }}</span
                        >、<span style="text-decoration: line-through">{{ L('删除线') }}</span
                        >{{ L('、文字') }}<span style="color: rgb(0, 176, 240)">{{ L('颜色') }}</span
                        >、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255)">{{
                            L('背景色')
                        }}</span
                        >{{ L('、以及字号') }}<span style="font-size: 20px">大</span
                        ><span style="font-size: 14px">{{ L('小') }}</span
                        ><span>{{ L('等简单排版操作。') }}</span>
                    </p>
                    <p style="margin-bottom: 16px">{{ L('还可以在这里加入表格了') }}</p>
                    <table class="table-style">
                        <tbody>
                            <tr>
                                <td>{{ L('中奖客户') }}</td>
                                <td>{{ L('发放奖品') }}</td>
                                <td>{{ L('备注') }}</td>
                            </tr>
                            <tr>
                                <td>{{ L('猪猪') }}</td>
                                <td>{{ L('内测码') }}</td>
                                <td>
                                    <em
                                        ><span style="color: rgb(255, 0, 0)">{{ L('已经发放') }}</span></em
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td>{{ L('大麦') }}</td>
                                <td>{{ L('积分') }}</td>
                                <td>
                                    <a href="javascript: void(0);" target="_blank" draggable="false">{{
                                        L('领取地址')
                                    }}</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="text-align: left; padding: 14px auto 20px">
                        <span style="text-align: left">{{
                            L('也可在这里插入图片、并对图片加上超级链接，方便用户点击。')
                        }}</span>
                    </p>
                </div>
            </div>
        </div>

        <!-- 富文本渲染 -->
        <div class="sample-text" v-if="content.richTextCode">
            <div
                class="cap-richtext relative sx-hidden sy-hidden"
                :style="{
                    'background-color': bgColor,
                    padding: content.show_full_screen == 'full' ? '' : '13px 13px 0',
                }"
            >
                <componentBgImage
                    :bgImage="content.bg_image"
                    :show="content.bg_color_style == 2 && content.bg_image ? true : false"
                    :opacity="content.bg_color_opacity"
                ></componentBgImage>
                <div v-html="richTextContent" style="width: 100%" class="relative text-wrap"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { colorRgb } from '@/utils/util'
import componentBgImage from '@/views/common/customPage/modules/common/componentBgImage.vue'
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    components: {
        componentBgImage,
    },
    data() {
        return {}
    },
    computed: {
        richTextContent() {
            let richTextHtml = this.content.richTextCode
            if (richTextHtml.indexOf('<img') != -1) {
                richTextHtml = richTextHtml.replace(/<img/g, "<img style='vertical-align: bottom;width:100%'")
            }
            return richTextHtml
        },
        bgColor() {
            if (!this.content) return ''
            return colorRgb(this.content.bg_color, this.content.bg_color_opacity)
        },
    },
}
</script>

<style scoped>
.sample-text {
    width: 100%;
    min-height: 20px;
}

.cap-richtext {
    box-sizing: border-box;
    overflow: hidden;
    color: #333;
    font-size: 15px;
    text-align: left;
    word-wrap: break-word;
    background-color: #f9f9f9;
    background-repeat-x: no-repeat;
    background-repeat-y: repeat;
    background-size: cover;
}

.sample-text >>> table {
    box-sizing: border-box;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border: none;
}
.table-style {
    word-break: break-all;
    margin: 0 auto 10px;
}
.table-style td {
    border: 1px solid #dddddd;
    padding: 5px 10px;
}
.cap-richtext >>> td {
    border: 1px solid #dddddd;
    padding: 5px 10px;
}
</style>
