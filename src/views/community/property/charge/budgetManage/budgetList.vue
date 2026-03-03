<template>
  <div class="budget-category-container">
    <!-- 页面标题 + 功能按钮（新增+导出+导入） -->
    <div class="page-header">
      <h2>预算管理</h2>
      <div class="btn-group">
        <button class="btn-add" @click="openModal('add')" :disabled="loading">新增</button>
        <button class="btn-export" @click="handleExport" :disabled="loading">导出模板</button>
        <label class="btn-import" :disabled="loading">
          导入表格
          <input
            type="file"
            accept=".xlsx,.xls"
            class="import-file-input"
            @change="handleImport"
            :disabled="loading"
          />
        </label>
      </div>
    </div>

    <!-- 预算分类列表 -->
    <div class="table-box">
      <!-- 预算分类列表 -->
      <div class="table-box">
        <table class="category-table">
          <thead>
          <tr>
            <th>序号</th>
            <th>分类名称</th>
            <th>金额</th>
            <th>单位</th>
            <th>状态</th>
            <th>添加时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <!-- 第一步：判断加载状态 -->
          <tr v-if="loading">
            <td colspan="6" class="empty-tip">加载中...</td>
          </tr>

          <!-- 第二步：非加载状态时，用template包裹后续逻辑（template不会渲染成实际DOM） -->
          <template v-else>
            <!-- 空数据状态 -->
            <tr v-if="List.length === 0">
              <td colspan="6" class="empty-tip">暂无预算分类数据</td>
            </tr>

            <!-- 有数据时渲染列表（v-for单独在tr上，无任何条件指令） -->
            <tr v-for="(item, index) in List" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.category_name }}</td>
              <td>{{ item.amount }}</td>
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
          </template>
          </tbody>
        </table>
      </div>
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
        <!-- 弹窗头部 -->
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑预算分类' : '新增预算分类' }}</h3>
          <span class="close-icon" @click="closeModal" :disabled="loading">&times;</span>
        </div>

        <!-- 弹窗主体（表单） -->
        <div class="modal-body">
          <form class="form-box" @submit.prevent="submitForm">
            <!-- 分类名称下拉 -->
            <div class="form-item">
              <label class="form-label">分类名称：</label>
              <select
                v-model="formData.category_id"
                class="form-select"
                :disabled="loading"
                required
              >
                <option value="">请选择分类</option>
                <option
                  v-for="item in categoryList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.category_name }}
                </option>
              </select>
            </div>

            <!-- 小区名称下拉 -->
            <div class="form-item">
              <label class="form-label">小区：</label>
              <select
                v-model="formData.village_id"
                class="form-select"
                :disabled="loading"
                required
              >
                <option value="">请选择小区</option>
                <option
                  v-for="item in villageList"
                  :key="item.village_id"
                  :value="item.village_id"
                >
                  {{ item.village_name }}
                </option>
              </select>
            </div>

            <!-- 金额输入 -->
            <div class="form-item">
              <label class="form-label">金额：</label>
              <input
                type="number"
                v-model="formData.amount"
                class="form-input"
                :disabled="loading"
                placeholder="请输入预算金额"
                step="0.01"
                min="0"
                required
              />
            </div>

            <!-- 月份输入（限制YYYY-MM格式） -->
            <div class="form-item">
              <label class="form-label">月份：</label>
              <input
                type="text"
                v-model="formData.month"
                class="form-input"
                :disabled="loading"
                placeholder="请输入月份（格式：2025-02）"
                @blur="checkMonthFormat"
                required
              />
              <span class="form-tip" v-if="monthError">{{ monthError }}</span>
            </div>

            <!-- 状态单选 -->
            <div class="form-item">
              <label class="form-label">状态：</label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.status"
                  value="1"
                  :disabled="loading"
                /> 正常
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.status"
                  value="0"
                  :disabled="loading"
                /> 禁用
              </label>
            </div>

            <!-- 提交按钮区 -->
            <div class="form-submit">
              <button
                type="button"
                class="btn-cancel"
                @click="closeModal"
                :disabled="loading"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn-save"
                :disabled="loading"
              >
                {{ isEdit ? '保存修改' : '新增' }}
              </button>
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
      List: [],
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
        category_id: '', // 分类ID（下拉绑定）
        village_id: '',  // 小区ID（下拉绑定）
        amount: '',      // 金额
        month: '',       // 月份（YYYY-MM）
        status: '1'      // 状态默认正常
      },
      // 加载状态
      loading: false,
      categoryList: [],
      villageList: [],
      monthError: ''
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
    this.getBudgetList()
  },
  methods: {
    /**
     * 获取预算分类列表（对接后端接口）
     */
    getBudgetList() {
      this.loading = true
      // 调整参数名：后端常用limit表示每页条数，和后端保持一致
      this.request(newChargeApi.getBudgetList, {
        page: this.currentPage,
        limit: this.pageSize // 改为limit，适配后端常用参数名
      })
        .then((res) => {
          // 适配后端返回格式：list=数据列表，total=总条数
          this.List = res.list || []
          this.total = res.total || 0
          // 重新计算总页数
          this.totalPage = Math.ceil(this.total / this.pageSize)
          this.categoryList = res.categoryList || []
          this.villageList = res.villageList || []
        })
        .catch((err) => {
          console.error('获取预算分类失败：', err)
          this.$message.error('获取数据失败，请重试')
          this.List = []
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
      this.getBudgetList()
    },

    /**
     * 打开新增/编辑弹窗
     * @param {String} type add-新增 edit-编辑
     * @param {Object} row 编辑行数据
     */
    openModal(type, row = {}) {
      this.modalVisible = true;
      this.isEdit = type;
      this.monthError = '';
      // 重置表单
      this.formData = {
        category_id: '',
        village_id: '',
        amount: '',
        month: '',
        status: '1'
      }


      console.log( row )
      // 编辑时回显数据
      if (this.isEdit) {
        this.formData = {
          category_id: row.category_id || '',
          village_id: row.village_id || '',
          amount: row.amount || '',
          month: row.month || '',
          status: row.status || '1'
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
        category_id: '',
        village_id: '',
        amount: '',
        month: '',
        status: '1'
      }
    },

    /**
     * 提交表单（新增/编辑）
     * 新增：不传id 或 id为空
     * 编辑：传id
     */
    async submitForm() {
      // 先校验月份格式
      this.checkMonthFormat();
      if (this.monthError) {
        this.$message.warning(this.monthError);
        return;
      }

      // 表单必填项校验
      if (!this.formData.category_id) {
        this.$message.warning('请选择分类名称');
        return;
      }
      if (!this.formData.village_id) {
        this.$message.warning('请选择小区');
        return;
      }
      if (!this.formData.amount) {
        this.$message.warning('请输入预算金额');
        return;
      }

      try {
        this.loading = true;
        // 调用后端接口（替换为你的实际接口）
        this.request(newChargeApi.saveVillageBudget, {
          village_id: this.formData.village_id,
          category_id: this.formData.category_id,
          month: this.formData.month,
          status: this.formData.status,
          amount: this.formData.amount,
        })
          .then((res) => {
            console.log( res )
            if (res.code === 200) { // 匹配后端返回的成功码（0）
              this.$message.success(this.isEdit ? '编辑成功' : '新增成功');
              this.closeModal();
              this.getBudgetList() // 重新加载列表
            } else {
              this.$message.error(res.msg || (this.isEdit ? '编辑失败' : '新增失败'));
            }
          })
          .catch((err) => {
            this.$message.error('操作失败，请重试');
          })
          .finally(() => {
            this.loading = false
          })
      } catch (err) {
        console.error('提交失败：', err);
        this.$message.error('操作失败，请重试');
      } finally {
        this.loading = false;
      }
    },

    // 校验月份格式（YYYY-MM）
    checkMonthFormat() {
      const month = this.formData.month.trim();
      if (!month) {
        this.monthError = '月份不能为空';
        return;
      }
      // 正则匹配YYYY-MM格式
      const reg = /^\d{4}-\d{2}$/;
      if (!reg.test(month)) {
        this.monthError = '月份格式错误，请输入YYYY-MM（如2025-02）';
        return;
      }
      // 校验月份范围（1-12）
      const [year, monthNum] = month.split('-');
      if (parseInt(monthNum) < 1 || parseInt(monthNum) > 12) {
        this.monthError = '月份范围错误，请输入1-12的月份';
        return;
      }
      // 格式正确
      this.monthError = '';
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
        this.request(newChargeApi.deleteVillageBudget, { id })
          .then((res) => {
            if (res.code === 200) { // 匹配后端返回的成功码（0）
              // 原生alert提示成功（也可保留this.$message，若项目有全局封装的message）
              this.$message.success( '删除成功')
              this.getBudgetList() // 重新加载列表
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
    },

    /**
     * 导出表格模板
     */
    handleExport() {
      this.loading = true
      // { responseType: 'blob' })

      this.requestNew(newChargeApi.exportBudget,
        {},
        'post',
        null)
        .then((res) => {
          const a = document.createElement('a')
          a.href = res.url
          a.download = '预算分类模板.xlsx' // 自定义下载文件名
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          this.$message.success('模板导出成功！')
        })
        .catch((err) => {
          console.error('导出模板失败：', err)
          this.$message.error('模板导出失败，请重试')
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 导入表格数据
     * @param {Event} e 文件选择事件
     */
    handleImport(e) {
      const file = e.target.files[0]
      if (!file) return

      // 校验文件类型
      const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (fileType !== '.xlsx' && fileType !== '.xls') {
        this.$message.warning('请上传Excel文件（.xlsx/.xls格式）！')
        // 清空文件选择框
        e.target.value = ''
        return
      }

      // 构造FormData（文件上传专用）
      const formData = new FormData()
      formData.append('file', file) // 后端接收文件的参数名，需和后端确认

      this.loading = true
      this.requestNew(newChargeApi.importBudget, formData, 'post',null,{
        headers: {
          'Content-Type': 'multipart/form-data' // 关键：文件上传的Content-Type
        }
      })
        .then((res) => {
          console.log( res )
          if (res.code === 200){
            this.$message.success('表格导入成功！')
            // 重新加载列表数据
            this.getBudgetList()
          } else if (res.code === 201) {
            this.$message.success('表格导入成功！')
            const a = document.createElement('a')
            a.href = res.data.url
            a.download = '导入失败列表.xlsx' // 自定义下载文件名
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            // 重新加载列表数据
            this.getBudgetList()
          } else {
            this.$message.error(res.msg || '表格导入失败')
          }
        })
        .catch((err) => {
          console.error('导入表格失败：', err)
          this.$message.error('表格导入失败，请重试')
        })
        .finally(() => {
          // 清空文件选择框，避免重复上传同一文件无响应
          e.target.value = ''
          this.loading = false
        })
    },

    /**
     * 通用请求封装（兼容普通请求和文件上传/下载）
     * @param {Function} apiFunc 接口函数
     * @param {Object|FormData} params 请求参数
     * @param {Object} options 额外配置（如responseType、headers等）
     * @returns {Promise}
     */
    // request(apiFunc, params = {}, options = {}) {
    //   return new Promise((resolve, reject) => {
    //     apiFunc(params, options)
    //       .then(res => resolve(res))
    //       .catch(err => reject(err))
    //   })
    // }
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
/* 按钮组样式 */
.btn-group {
  display: flex;
  gap: 10px;
}
.btn-add {
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-export {
  padding: 8px 16px;
  background: #52c41a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
/* 导入按钮样式（隐藏原生input） */
.btn-import {
  padding: 8px 16px;
  background: #fa8c16;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  position: relative;
}
.import-file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
/* 禁用状态样式统一 */
.btn-add:disabled, .btn-export:disabled, .btn-import:disabled {
  opacity: 0.6;
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
/* 弹窗遮罩 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 弹窗容器 */
.modal-content {
  width: 480px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 弹窗头部 */
.modal-header {
  height: 48px;
  line-height: 48px;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: normal;
  color: #333;
}

.close-icon {
  font-size: 18px;
  color: #999;
  cursor: pointer;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
}

.close-icon:hover {
  color: #666;
}

.close-icon:disabled {
  cursor: not-allowed;
  color: #ccc;
}

/* 弹窗主体 */
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
}

.form-label {
  width: 80px;
  padding-right: 12px;
  text-align: right;
  font-size: 14px;
  color: #333;
  line-height: 32px;
}

.form-control {
  flex: 1;
  position: relative;
}

/* 下拉/输入框样式 */
.form-select, .form-input {
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  font-size: 14px;
  color: #666;
  background: #fff;
  outline: none;
}

.form-select:focus, .form-input:focus {
  border-color: #409eff;
}

.form-select:disabled, .form-input:disabled {
  background: #f5f7fa;
  cursor: not-allowed;
  color: #999;
}

/* 单选框组 */
.radio-group {
  display: flex;
  align-items: center;
}

.radio-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.radio-item input {
  margin-right: 6px;
  vertical-align: middle;
}

/* 错误提示 */
.error-tip {
  position: absolute;
  left: 0;
  top: 36px;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1;
}

/* 按钮组 */
.form-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  outline: none;
}

.btn-cancel {
  color: #666;
  background: #f5f5f5;
  border-color: #dcdfe6;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-confirm {
  color: #fff;
  background: #409eff;
  border-color: #409eff;
}

.btn-confirm:hover {
  background: #66b1ff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>