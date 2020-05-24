<template>
  <div class="user">
    <!-- 搜索 -->
    <el-header class="hearder">
      <el-card>
        <el-form
          :inline="true"
          :model="formInline"
          label-width="80px"
          ref="seachFormRef"
          style="height:40px"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="formInline.username" class="w-150" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="formInline.email" class="w-150" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id">
            <el-select
              v-model="formInline.role_id"
              placeholder="请选择"
              style="width:150px;margin-right:30px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="seach">搜索</el-button>
            <el-button @click="clear">清除</el-button>
            <el-button type="primary" @click="AddOrUpdate">+新增用户</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-header>
    <!-- 主体main -->
    <el-main style="margin-top:20px">
      <el-card>
        <el-table :data="userList" stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role" label="角色"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color:red;">禁用</span>
              <span v-if="scope.row.status === 1" style="color:#6ac144;">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="primary" @click="redact(scope.row)">编辑</el-button>
              <el-button
                :type="scope.row.status === 0 ? 'success' : 'info'"
              >{{scope.row.status === 0 ? "启用" : "禁用"}}</el-button>
              <el-button type="default">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:20px;text-align:center;">
          <el-pagination
            @current-change="renderCurrent"
            @size-change="renderSize"
            background
            layout="total, sizes, prev, pager, next,jumper"
            :page-sizes="[2, 5]"
            :page-size="limit"
            :current-page="page"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </el-main>
    <UserAddOrUpdate ref="userAddOrUpdateRef"></UserAddOrUpdate>
  </div>
</template>

<script>
import UserAddOrUpdate from "./user-add-or-update.vue";
export default {
  components: { UserAddOrUpdate },
  data() {
    return {
      isShow: false,
      formInline: {
        username: "", // 昵称
        email: "", // 邮箱
        role_id: "" // 角色数字 1、超级管理员 2管理员、3老师、 4学生
      },
      options: [
        {
          value: null,
          label: "请选择"
        },
        {
          value: 1,
          label: "超级管理员"
        },
        {
          value: 2,
          label: "管理员"
        },
        {
          value: 3,
          label: "老师"
        },
        {
          value: 4,
          label: "学生"
        }
      ],
      page: 1, // 查询第几页
      limit: 2, // 查询时候的页容量(每页查询多少条)
      userList: [], //请求回来的用户信息list数组
      total: 0 //
    };
  },
  methods: {
    async getUserList() {
      const res = await this.$axios({
        method: "get",
        url: "/user/list",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.formInline
        }
      });
      console.log(res);
      if (res.data.code == 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 清除搜索结果，form数据
    clear() {
      // 清form数据
      this.$refs.seachFormRef.resetFields();
      // 重置搜索结果
      this.getUserList();
    },
    seach() {
      this.getUserList();
    },

    // 第几页触发时修改请求的页数，发起请求
    renderCurrent(value) {
      this.page = value;
      this.$refs.seachFormRef.resetFields();
      this.getUserList();
    },

    // 一页多少条数据，修改触发
    renderSize(value) {
      this.limit = value;
      this.$refs.seachFormRef.resetFields();
      this.getUserList();
    },
    // 添加
    AddOrUpdate() {
      this.isShow = true;

      this.$refs.userAddOrUpdateRef.dialogVisible = true;
      this.$refs.userAddOrUpdateRef.modo = true;
      this.$nextTick(() => {
        this.$refs.userAddOrUpdateRef.registerForm = {
          username: "", //用户名
          email: "", //邮箱
          phone: "", //手机号
          role_id: "", //角色
          status: "", //状态
          remark: "" //备注
        };
      });
    },
    // 编辑
    redact(rowList) {
      this.$refs.userAddOrUpdateRef.dialogVisible = true;
      this.$refs.userAddOrUpdateRef.modo = false;
      this.$refs.userAddOrUpdateRef.registerForm = JSON.parse(
        JSON.stringify(rowList)
      );
      this.$nextTick(() => {
        this.$refs.userAddOrUpdateRef.$refs.ruleForm.clearValidate();
      });
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="less" scoped>
.user {
  .hearder {
    .w-150 {
      width: 150px;
    }
  }
  .main {
    margin-top: 20px;
  }
}

.el-scrollbar {
  margin-top: 135px;
}
</style>