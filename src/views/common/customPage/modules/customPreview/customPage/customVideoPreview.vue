<template>
    <div class="video-content">
        <!-- 选择上传的视频时展示 -->
        <video
            v-if="content && content.video_type_val && content.video_type_val == '1' && content.choose_video_list"
            :poster="
                content.surface_type_val == '2' && content.choose_surface_list
                    ? content.choose_surface_list[0]
                    : content.choose_video_list[1]
            "
            controls="controls"
            width="100%"
            height="100%"
            :src="content.choose_video_list ? content.choose_video_list[0] : ''"
        ></video>

        <!-- 选择粘贴的视频地址时展示 -->
        <video
            v-if="content && content.video_type_val && content.video_type_val == '2' && content.choose_surface_list"
            :poster="content.choose_surface_list ? content.choose_surface_list[0] : 'poster'"
            controls="controls"
            width="100%"
            height="100%"
            :src="content.paste_video_url ? content.paste_video_url : ''"
        ></video>

        <!-- 初始页面的空白video -->
        <div
            v-if="
                (content.video_type_val == '1' && content.surface_type_val == '1' && !content.choose_video_list) ||
                (!content.choose_surface_list && content.video_type_val == '2') ||
                (!content.choose_video_list && content.video_type_val == '1')
            "
            style="width: 100%; height: 100%; position: relative"
        >
            <video
                src="placeholder"
                :poster="
                    content.choose_surface_list && content.surface_type_val == '2' ? content.choose_surface_list[0] : ''
                "
                controls="controls"
                width="100%"
                height="100%"
            ></video>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    }
}
</script>

<style scoped>
.video-content {
    width: 100%;
    height: 207px;
}
</style>
