<template>
  <div class="attachment-list">
    <div v-if="!readonly" class="attachment-tip attachment-summary">
      附件字段取自“添加档案字段”里配置的图片/PDF类型，可为空，支持多次保存补传，单个文件不能超过20M。
    </div>

    <a-spin :spinning="loading">
      <div v-if="!displayGroups.length" class="attachment-empty attachment-empty-all">
        {{ readonly ? '暂无附件' : '请先到“添加档案字段”中新增图片或 PDF 类型字段' }}
      </div>
      <div v-else>
        <div v-for="group in displayGroups" :key="group.key" class="attachment-item" :class="{ 'attachment-item-readonly': readonly }">
          <div class="attachment-title">{{ group.title || '附件' }}</div>
          <div class="attachment-content">
            <div v-if="!readonly" class="attachment-toolbar">
              <a-upload
                name="file"
                :multiple="true"
                :show-upload-list="false"
                :accept="group.accept"
                :data="{ path: uploadPath }"
                action="/v20/public/index.php/community/village_api.ChatSidebar/uploadFile"
                :headers="headers"
                :before-upload="file => beforeUpload(file, group)"
                @change="info => handleUploadChange(info, group)"
              >
                <a-button type="primary" :loading="uploadingKey === group.key">
                  <a-icon type="upload" />
                  上传
                </a-button>
              </a-upload>
              <span class="attachment-type-tip">
                仅支持 {{ group.type_name || '附件' }}
              </span>
            </div>

            <div v-if="group.files && group.files.length" class="attachment-file-list">
              <template v-for="file in group.files">
                <span :key="fileKey(file, 'file')" class="attachment-file-tag">
                  <a :href="file.file_url_full || file.url" target="_blank">{{ file.original_name || file.name }}</a>
                </span>
                <a
                  v-if="!readonly"
                  :key="fileKey(file, 'delete')"
                  class="remove-attachment-file"
                  @click="removeFile(group, file)"
                >删除</a>
              </template>
            </div>
            <div v-else-if="!readonly" class="attachment-empty">暂无附件</div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import villageApi from '@/api/community/village'

export default {
  name: 'AttachmentList',
  props: {
    sourceType: {
      type: String,
      required: true
    },
    sourceId: {
      type: [String, Number],
      default: 0
    },
    readonly: {
      type: Boolean,
      default: true
    },
    uploadPath: {
      type: String,
      default: 'houseAttachment'
    }
  },
  data () {
    return {
      loading: false,
      uploadingKey: '',
      groups: [],
      headers: {
        authorization: 'authorization-text'
      }
    }
  },
  watch: {
    sourceId: {
      immediate: true,
      handler () {
        this.getList()
      }
    }
  },
  computed: {
    displayGroups () {
      if (!this.readonly) {
        return this.groups
      }
      return this.groups.filter(group => group.files && group.files.length)
    }
  },
  methods: {
    getList () {
      if (!this.sourceId) {
        this.groups = []
        return
      }
      this.loading = true
      const api = this.sourceType === 'room' ? villageApi.getRoomAttachmentList : villageApi.getUserAttachmentList
      const params = this.sourceType === 'room' ? { vacancy_id: this.sourceId } : { pigcms_id: this.sourceId }
      this.request(api, params).then((res) => {
        this.groups = this.normalizeGroups(res.list || [])
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeGroups (groups) {
      return groups.map((group, index) => ({
        ...group,
        key: group.key || String(index),
        files: group.files || [],
        allow_exts: Array.isArray(group.allow_exts)
          ? group.allow_exts
          : String(group.allow_exts_text || '').split(',').filter(Boolean)
      }))
    },
    beforeUpload (file, group) {
      const ext = (file.name || '').split('.').pop().toLowerCase()
      const allowExts = group.allow_exts || []
      if (allowExts.length && allowExts.indexOf(ext) === -1) {
        this.$message.error(`【${group.title || '附件'}】只支持${group.type_name || '指定'}格式`)
        return false
      }
      if (file.size > 20 * 1024 * 1024) {
        this.$message.error('单个附件不能超过20M')
        return false
      }
      return true
    },
    handleUploadChange (info, group) {
      this.uploadingKey = info.file.status === 'uploading' ? group.key : ''
      if (info.file.status === 'done') {
        this.uploadingKey = ''
        if (info.file.response.status === 1000) {
          const fileData = info.file.response.data || {}
          group.files = (group.files || []).concat([{
            file_url: fileData.url,
            original_name: fileData.name || info.file.name,
            size: info.file.size || 0,
            suffix: (info.file.name || '').split('.').pop(),
            add_time: Math.floor(Date.now() / 1000)
          }])
          this.saveRoomFiles()
        } else {
          this.$message.error(info.file.response.msg || `${info.file.name} 上传失败`)
        }
      } else if (info.file.status === 'error') {
        this.uploadingKey = ''
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    removeFile (group, file) {
      group.files = (group.files || []).filter(item => item.file_url !== file.file_url)
      this.saveRoomFiles()
    },
    fileKey (file, suffix) {
      return `${file.uid || file.file_url || file.name}_${suffix}`
    },
    saveRoomFiles () {
      if (this.readonly || this.sourceType !== 'room') {
        return
      }
      this.loading = true
      this.request(villageApi.saveRoomAttachmentList, {
        vacancy_id: this.sourceId,
        files: this.groups
      }).then((res) => {
        this.groups = this.normalizeGroups(res.list || [])
        this.$message.success('附件已更新')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.attachment-list {
  margin-top: 16px;
}
.attachment-summary {
  padding: 8px 12px;
  margin-bottom: 14px;
  margin-left: 0;
  line-height: 20px;
  background: #fff7f7;
  border: 1px solid #ffd6d6;
  border-radius: 2px;
}
.attachment-item {
  display: flex;
  padding: 14px 16px;
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
}
.attachment-item-readonly {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #fafafa;
}
.attachment-title {
  width: 104px;
  line-height: 32px;
  color: #333;
  font-weight: 500;
}
.attachment-content {
  flex: 1;
  min-width: 0;
}
.attachment-toolbar {
  display: flex;
  align-items: center;
  min-height: 32px;
  margin-bottom: 10px;
}
.attachment-tip {
  color: #f5222d;
}
.attachment-type-tip {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  margin-left: 10px;
  color: #f5222d;
  background: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 2px;
}
.attachment-file-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 8px;
}
.attachment-file-tag {
  display: inline-block;
  padding: 6px 10px;
  margin: 0 4px 10px 0;
  line-height: 20px;
  background: #f8fbff;
  border: 1px solid #d6e8ff;
  border-radius: 4px;
}
.remove-attachment-file {
  display: inline-block;
  margin: 0 16px 10px 6px;
  color: #f5222d;
}
.attachment-empty {
  min-height: 32px;
  line-height: 32px;
  color: #999;
}
.attachment-empty-all {
  padding: 0 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
}
.attachment-item-readonly .attachment-file-list {
  margin-top: 0;
}
.attachment-item-readonly .attachment-file-tag {
  margin-bottom: 0;
}
.attachment-item-readonly .attachment-empty {
  min-height: 28px;
  line-height: 28px;
}
</style>
