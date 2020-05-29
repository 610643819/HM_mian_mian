<template>
  <div>
    <!-- 表头 -->
    <el-card class="box-card">
      <el-form :inline="true" ref="searchForm" label-width="80px" :model="searchForm">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="searchForm.rid" placeholder="学科编号" style="width:170px"></el-input>
        </el-form-item>
        <el-form-item label="学科姓名" prop="name">
          <el-input v-model="searchForm.name" placeholder="学科姓名" style="width:170px"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="searchForm.username" placeholder="创建者" style="width:170px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="状态" style="width:170px" v-model="searchForm.status">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="add">+新增科学</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- list页面 -->
    <el-card style="margin-top:15px;">
      <el-table :data="subjectList" border stripe>
        <el-table-column type="index" width="50" />
        <el-table-column label="创建日期" prop="create_time" width="180" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button :style="{ color: scope.row.status === 0 ? 'red' : '#6ac144' }">
              {{ scope.row.status === 0 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="editSubject(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status === 0 ? 'success' : 'info'"
            >{{ scope.row.status === 0 ? "启用" : "禁用" }}</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top:15px;text-align:center;">
        <el-pagination
          :current-page="page"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="limit"
          @size-change="currentChange"
          @current-change="currentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <subjectAdd ref="subjectAddOrUpdate"></subjectAdd>
  </div>
</template>

<script>
import subjectAdd from "./subject-add-or-update";
export default {
  name:'science',
  components: {
    subjectAdd
  },
  data() {
    return {
      searchForm: {
        rid: "", // 学科编号
        name: "", // 学科姓名
        username: "", // 创建者
        status: "" // 状态
      },
      page: 1, // 页码
      limit: 2, // 页容量
      total: 0, // 总条数
      subjectList: [] // 学科列表数据
    };
  },
  methods: {
    // list页面获取渲染
    async getSubjectList() {
      const res = await this.$axios.get("/subject/list", {
        params: {
          limit: this.limit,
          ...this.searchForm
        }
      });
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索
    search() {
      this.page = 1;
      this.getSubjectList();
    },
    // 单页显式数量变化刷新
    currentChange(value) {
      this.limit = value;
      this.getSubjectList();
    },
    // 分页条的页容量发生了改变，如果是页容量发生了改变我们要从第一页开始加载
    sizeChange(val) {
      this.limit = val;
      this.getSubjectList();
    },
    // 点击添加科学
    add() {
      // dialogVisible
      this.$refs.subjectAddOrUpdate.dialogVisible = true;
      this.$refs.subjectAddOrUpdate.mode = true;
      this.searchForm = {
        rid: "", // 学科编号
        name: "", // 学科姓名
        username: "", // 创建者
        status: "" // 状态
      }
    },
    // 清除搜索框内容
    clear() {
      this.$refs.searchForm.resetFields();
      
    }
  },
  created() {
    // 初始渲染
    this.getSubjectList();
  }
};
</script>

<style lang="less" scoped>
.box-card {
}
</style>