<template>
    <a-modal :title="title" :width="600" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
        <a-form>
            <a-radio-group @change="onChange" v-model="checked_label_id">
                <a-row>
                    <a-radio key="0" :value="0">
                        不选择标签
                    </a-radio>
                    <a-radio v-for="d in labels" :key="d.label_id" :value="d.label_id">
                        {{d.label_name}}
                    </a-radio>
                </a-row>
            </a-radio-group>
        </a-form>
    </a-modal>
</template>

<script>
    import qaApi from '@/api/qa'

    export default {
        name: "addLabelToAsk",
        data() {
            return {
                title: '选择标签',
                visible: false,
                id: 0,
                label_id: 0,
                checked_label_id:0,
                labels: []
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, {name: 'add_label_to_ask'});
        },
        methods: {
            onChange(e) {
                this.label_id = e.target.value;
            },
            add_label(id,label_id) {
                this.visible = true;
                this.id = id;
                this.checked_label_id = label_id;
                this.get_label();
            },
            get_label() {
                this.request(qaApi.getLabels, {}).then((res) => {
                    this.labels = res;
                })
            },
            handleCancel() {
                this.visible = false;
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.request(qaApi.saveAskLabel, {id: this.id, label_id: this.label_id}).then((res) => {
                            this.visible = false;
                            this.$message.success(this.L('设置成功'))
                            this.$emit('refreshLists',{})
                        })
                    }
                });
            },
        }
    }


</script>

<style scoped>

</style>