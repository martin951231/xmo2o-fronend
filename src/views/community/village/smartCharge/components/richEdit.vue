<template>
    <a-modal
        title="富文本编辑"
        :visible="visible"
        :width="900"
        @ok="handleOk"
        @cancel="handleCancel">
        <div class="form_item">
            <div class="title">是否启用：</div>
            <a-radio-group name="radioGroup" v-model="richDetail.status">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="2">关闭</a-radio>
            </a-radio-group>
        </div>
        <div class="form_item">
            <div class="title">标题：</div>
            <a-input style="width: 270px;" placeholder="请输入" v-model="richDetail.title" />
        </div>
        <div class="form_item">
            <div class="title">内容：</div>
            <quill-editor
                v-model="richDetail.content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
                @ready="onEditorReady($event)">
            </quill-editor>
        </div>
    </a-modal>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    export default {
        components:{
            quillEditor
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            device_id: {
                type: [String, Number],
                default: 0
            }
        },
        data(){
            return{
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                deviceForm: {},
                rules: {},
                richText: '',
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
                            ['blockquote', 'code-block'], // 引用  代码块
                            [{ header: 1 }, { header: 2 }], // 1、2 级标题
                            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
                            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
                            [{ indent: '-1' }, { indent: '+1' }], // 缩进
                            [{ direction: 'rtl' }], // 文本方向
                            [{ size: ['12', '14', '16', '18', '20', '22', '24', '28', '32', '36'] }], // 字体大小
                            [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
                            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                            // [{ font: ['songti'] }], // 字体种类
                            [{ align: [] }], // 对齐方式
                            ['clean'], // 清除文本格式
                            ['image'] // 链接、图片、视频
                        ]
                    },
                    placeholder: '请输入正文',
                },
                richDetail: {
                    title: '',
                    content: '',
                    type: 1
                }
            }
        },
        methods: {
            handleOk(){
                this.$emit('close');
            },
            handleCancel(){
                this.$emit('close');
            },
            // 失去焦点事件
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            // 获得焦点事件
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            // 准备富文本编辑器
            onEditorReady(quill) {
                console.log('editor ready!', quill)
            },
            // 内容改变事件
            onEditorChange({ quill, html, text }) {
                console.log('editor change!', quill, html, text)
                this.richText = html
            },
            handleOk(){
                let that = this
                if(!that.richDetail.title){
                    that.$message.warn("请填写标题")
                    return
                }
                if(!that.richDetail.content){
                    that.$message.warn("请编辑内容")
                    return
                }
                that.request('/community/village_api.Pile/editNews', that.richDetail).then(res => {
                    that.$message.success("编辑成功！")
                    that.$emit('close')
                })
            },
            handleCancel(){
                this.$emit('close');
            },
            getDetail(){
                let that = this
                that.request('/community/village_api.Pile/getNews', {type: 1}).then(res => {
                    that.richDetail = res
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .form_item{
        display: flex;
        align-items: center;
        margin: 10px 0 20px 0;
        .title{
            width: 100px;
            text-align: right;
            flex-shrink: 0;
        }
    }
    /*加上height和滚动属性就可以，滚动条样式是系统默认样式，可能不同*/
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
        border-color: #ccc;
        height: 125px;
        overflow: auto;
    }
</style>