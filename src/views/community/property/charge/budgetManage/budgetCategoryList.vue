<template>
  <div class="budget-category-container">
    <!-- 页面标题 + 新增按钮 -->
    <div class="page-header">
      <h2>预算分类管理</h2>
      <button class="btn-add" @click="openModal('add')" :disabled="loading">新增预算分类</button>
    </div>

    <!-- 预算分类列表 -->
    <div class="table-box">
      <table class="category-table">
        <thead>
        <tr>
          <th>序号</th>
          <th>分类名称</th>
          <th>单位</th>
          <th>状态</th>
          <th>添加时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <!-- 加载中占位 -->
        <tr v-if="loading">
          <td colspan="6" class="empty-tip">加载中...</td>
        </tr>
        <!-- 数据列表 -->
        <tr v-else v-for="(item, index) in categoryList" :key="item.id">
          <!-- 序号计算：(当前页-1)*每页条数 + 索引+1 -->
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ item.category_name }}</td>
          <td>{{ item.unit || '无' }}</td>
          <td>
              <span class="status-tag" :class="item.status === 1 ? 'status-normal' : 'status-disable'">
                {{ item.status === 1 ? '正常' : '禁用' }}
              </span>
          </td>
          <td>{{ item.add_time }}</td>
          <td class="operate-btn">
            <button class="btn-edit" @click="openModal('edit', item)" :disabled="loading">编辑</button>
            <button class="btn-delete" @click="handleDelete(item.id)" :disabled="loading">删除</button>
          </td>
        </tr>
        <!-- 空数据 -->
        <tr v-else-if="categoryList.length === 0">
          <td colspan="6" class="empty-tip">暂无预算分类数据</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页（适配截图样式） -->
    <div class="pagination-box" v-if="!loading && total > 0">
      <span class="page-info">共 {{ total }} 条记录 | 第 {{ currentPage }}/{{ totalPage }} 页 | 每页 {{ pageSize }} 条</span>
      <div class="page-btn-group">
        <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1 || loading">上一页</button>
        <!-- 优化分页按钮显示：最多显示10个页码，避免页码过多 -->
        <button
          :class="currentPage === page ? 'active' : ''"
          v-for="page in showPageList"
          :key="page"
          @click="handlePageChange(page)"
          :disabled="loading"
        >
          {{ page }}
        </button>
        <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPage || loading">下一页</button>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div class="modal-mask" v-if="modalVisible" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑预算分类' : '新增预算分类' }}</h3>
          <span class="close-icon" @click="closeModal" :disabled="loading">&times;</span>
        </div>
        <div class="modal-body">
          <form class="form-box" @submit.prevent="submitForm">
            <!-- 分类名称 -->
            <div class="form-item">
              <label class="form-label">分类名称：</label>
              <input
                type="text"
                v-model="formData.category_name"
                class="form-input"
                placeholder="请输入预算分类名称"
                required
                :disabled="loading"
              />
            </div>

            <!-- 单位 -->
            <div class="form-item">
              <label class="form-label">单位：</label>
              <input
                type="text"
                v-model="formData.unit"
                class="form-input"
                placeholder="如：元、度、吨等"
                :disabled="loading"
              />
            </div>

            <!-- 状态 -->
            <div class="form-item">
              <label class="form-label">状态：</label>
              <label class="radio-label">
                <input type="radio" v-model="formData.status" value="1" checked :disabled="loading" /> 正常
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.status" value="0" :disabled="loading" /> 禁用
              </label>
            </div>

            <!-- 提交按钮 -->
            <div class="form-submit">
              <button type="button" class="btn-cancel" @click="closeModal" :disabled="loading">取消</button>
              <button type="submit" class="btn-save" :disabled="loading">{{ isEdit ? '保存修改' : '新增' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import newChargeApi from '@/api/community/property/packages'

export default {
  name: 'BudgetCategory',
  data() {
    return {
      // 列表数据
      categoryList: [],
      // 分页参数 - 调整pageSize为15
      currentPage: 1,
      pageSize: 15, // 每页默认15条
      total: 0,
      totalPage: 1,
      // 弹窗相关
      modalVisible: false,
      isEdit: false,
      // 表单数据
      formData: {
        id: '',
        category_name: '',
        unit: '',
        status: '1'
      },
      // 加载状态
      loading: false
    }
  },
  computed: {
    // 计算要显示的分页按钮列表（最多显示10个页码）
    showPageList() {
      const list = []
      const maxShow = 10 // 最多显示10个页码
      const half = Math.floor(maxShow / 2)
      let start = Math.max(1, this.currentPage - half)
      let end = start + maxShow - 1

      if (end > this.totalPage) {
        end = this.totalPage
        start = Math.max(1, end - maxShow + 1)
      }

      for (let i = start; i <= end; i++) {
        list.push(i)
      }
      return list
    }
  },
  mounted() {
    // 初始化加载列表数据
    this.getBudgetCategoryList()
  },
  methods: {
    /**
     * 获取预算分类列表（对接后端接口）
     */
    getBudgetCategoryList() {
      this.loading = true
      // 调整参数名：后端常用limit表示每页条数，和后端保持一致
      this.request(newChargeApi.getBudgetCategoryList, {
        page: this.currentPage,
        limit: this.pageSize // 改为limit，适配后端常用参数名
      })
        .then((res) => {
          // 适配后端返回格式：list=数据列表，total=总条数
          this.categoryList = res.list || []
          this.total = res.total || 0
          // 重新计算总页数
          this.totalPage = Math.ceil(this.total / this.pageSize)
        })
        .catch((err) => {
          console.error('获取预算分类失败：', err)
          this.$message.error('获取数据失败，请重试')
          this.categoryList = []
          this.total = 0
          this.totalPage = 1
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 分页切换
     * @param {Number} page 目标页码
     */
    handlePageChange(page) {
      if (page < 1 || page > this.totalPage || page === this.currentPage) return
      this.currentPage = page
      // 切换页码后重新加载数据
      this.getBudgetCategoryList()
    },

    /**
     * 打开新增/编辑弹窗
     * @param {String} type add-新增 edit-编辑
     * @param {Object} row 编辑行数据
     */
    openModal(type, row = {}) {
      this.modalVisible = true
      this.isEdit = type === 'edit'

      // 重置表单
      this.formData = {
        id: '',
        category_name: '',
        unit: '',
        status: '1'
      }

      // 编辑时回显数据
      if (this.isEdit) {
        this.formData = {
          id: row.id || '',
          category_name: row.category_name || '',
          unit: row.unit || '',
          status: (row.status || row.status === 0) ? row.status.toString() : '1'
        }
      }
    },

    /**
     * 关闭弹窗
     */
    closeModal() {
      this.modalVisible = false
      this.isEdit = false
      // 重置表单
      this.formData = {
        id: '',
        category_name: '',
        unit: '',
        status: '1'
      }
    },

    /**
     * 提交表单（新增/编辑）
     * 新增：不传id 或 id为空
     * 编辑：传id
     */
    submitForm() {
      // 表单校验
      if (!this.formData.category_name.trim()) {
        this.$message.warning('请输入预算分类名称！')
        return
      }

      this.loading = true
      // 构造提交参数（通过id是否存在区分新增/编辑）
      const submitData = {
        id: this.formData.id || '', // 新增：空字符串/undefined；编辑：分类ID
        category_name: this.formData.category_name.trim(),
        unit: this.formData.unit.trim() || '',
        status: Number(this.formData.status) // 确保是数字类型
      }

      this.request(newChargeApi.saveBudgetCategoryList, submitData)
        .then((res) => {
          // 适配后端返回码（200表示成功）
          if (res.code === 200) {
            this.$message.success(this.isEdit ? '编辑成功！' : '新增成功！')
            // 关闭弹窗
            this.closeModal()
            // 重新加载列表数据
            this.getBudgetCategoryList()
          } else {
            this.$message.error(res.msg || (this.isEdit ? '编辑失败' : '新增失败'))
          }
        })
        .catch((err) => {
          console.error('提交预算分类失败：', err)
          this.$message.error('操作失败，请重试')
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 删除分类（可选：如需对接删除接口，可参考此写法）
     * @param {Number} id 分类ID
     */
    handleDelete(id) {
      if (!id) return

      // 原生confirm弹窗：返回布尔值（true=确认，false=取消）
      const isConfirm = window.confirm('确定要删除该预算分类吗？删除后不可恢复！')

      // 确认删除
      if (isConfirm) {
        this.loading = true
        // 调用后端删除接口
        this.request(newChargeApi.deleteBudgetCategory, { id })
          .then((res) => {
            if (res.code === 200) { // 匹配后端返回的成功码（0）
              // 原生alert提示成功（也可保留this.$message，若项目有全局封装的message）
              this.$message.success( '删除成功')
              this.getBudgetCategoryList() // 重新加载列表
            } else {
              this.$message.error( '删除失败')
            }
          })
          .catch((err) => {
            this.$message.error( '删除失败')
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        // 取消删除的提示（可选）
        this.$message.info( '已取消删除')
      }
    }
  }
}
</script>

<style scoped>
#app .ant-layout-content{
  background-color: #fff !important;
}
/* 整体容器 */
.budget-category-container {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  font-family: "Microsoft Yahei";
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  color: #333;
}
.btn-add {
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-add:disabled {
  background: #91d5ff;
  cursor: not-allowed;
}

/* 表格样式 */
.table-box {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  overflow: hidden;
}
.category-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}
.category-table thead {
  background: #f5f5f5;
}
.category-table th, .category-table td {
  padding: 12px;
  border-bottom: 1px solid #e6e6e6;
}
.status-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.status-normal {
  background: #f0f9eb;
  color: #52c41a;
}
.status-disable {
  background: #fff2e8;
  color: #fa8c16;
}
.empty-tip {
  color: #999;
  padding: 30px 0;
}
.operate-btn {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.btn-edit {
  padding: 4px 8px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.btn-delete {
  padding: 4px 8px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.btn-edit:disabled, .btn-delete:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 分页样式 */
.pagination-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: #666;
  flex-wrap: wrap;
  gap: 10px;
}
.page-info {
  white-space: nowrap;
}
.page-btn-group {
  display: flex;
  gap: 4px;
}
.page-btn-group button {
  padding: 4px 10px;
  border: 1px solid #e6e6e6;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  min-width: 36px;
}
.page-btn-group button.active {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
.page-btn-group button:disabled {
  cursor: not-allowed;
  color: #999;
  background: #f5f5f5;
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  width: 500px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  color: #333;
}
.close-icon {
  font-size: 20px;
  cursor: pointer;
  color: #999;
}
.close-icon:hover {
  color: #333;
}
.close-icon:disabled {
  cursor: not-allowed;
  color: #ccc;
}
.modal-body {
  padding: 20px;
}

/* 表单样式 */
.form-box {
  width: 100%;
}
.form-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.form-label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
  color: #333;
}
.form-input, .form-select {
  flex: 1;
  padding: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  outline: none;
}
.form-input:focus, .form-select:focus {
  border-color: #1890ff;
}
.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}
.radio-label {
  margin-right: 20px;
  cursor: pointer;
}
.radio-label input:disabled {
  cursor: not-allowed;
}
.form-submit {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.btn-cancel {
  padding: 8px 20px;
  background: #fff;
  color: #666;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: pointer;
}
.btn-save {
  padding: 8px 20px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-cancel:disabled, .btn-save:disabled {
  background: #ccc;
  color: #fff;
  cursor: not-allowed;
  border-color: #ccc;
}
</style>