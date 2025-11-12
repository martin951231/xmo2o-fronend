<template>
    <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel" style="width: 600px !important;">
        <iframe v-if="visible" id="myframe" frameborder="0" :src="url" style="width: 100% !important;height: 600px !important;"></iframe>
    </a-modal>
</template>
<script>
    export default {
        components: {
        },
        data() {
            return {
                title: '新建',
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                url:''
            }
        },
        mounted() {
        },
        methods: {

            add(d) {
                this.title = '编辑';
                this.url = '/shequ.php?g=House&c=NewStreet&a=owner_edit&pigcms_id='+d.pigcms_id+'&usernum='+d.usernum+'&iframe=true';
                this.visible = true;
                this.disabled=false;
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>