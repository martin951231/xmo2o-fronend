<template>
    <div class="orgnizeType">
        <orgnizeStr></orgnizeStr>
    </div>
</template>

<script>
    import orgnizeStr from "../../components/orgnizeStruct/orgnizeStr.vue"
    export default{
        data() {
            return {
                key: 'value'
            }
        },
        components: {
            orgnizeStr
        },
    }
</script>

<style>
</style>
