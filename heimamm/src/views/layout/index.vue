<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i style="font-size: 20px;" class="el-icon-s-fold" @click="isCollapse = !isCollapse"></i>
        <img src="@/assets/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <span class="name">{{ username }} 欢迎您</span>
        <el-button @click="logout" type="primary">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 左边菜单栏容器 -->
      <el-aside width="auto">
        <el-menu
          default-active="3"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :collapse-transition="true"
        >
          <router-link to="/layout/chart">
            <el-menu-item index="1">
              <i class="el-icon-pie-chart"></i>
              <span slot="title">数据预览</span>
            </el-menu-item>
          </router-link>
          <router-link to="/layout/user">
            <el-menu-item index="2">
              <i class="el-icon-user"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </router-link>
          <router-link to="/layout/enterprise">
            <el-menu-item index="3">
              <i class="el-icon-office-building"></i>
              <span slot="title">企业列表</span>
            </el-menu-item>
          </router-link>
          <router-link to="/layout/question">
            <el-menu-item index="4">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">题库列表</span>
            </el-menu-item>
          </router-link>
          <router-link to="/layout/subject">
            <el-menu-item index="5">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">学科列表</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>
      <el-main style="background-color:#e8e9ec;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      avatar: "", // 用户的头像
      username: "", // 昵称
      isCollapse: false // 是否收起折叠菜单
    };
  },
  created() {
    this.getUserInfoData();
  },
  methods: {
    // 获取用户信息
    async getUserInfoData() {
      const res = await this.$axios.get("/info", {
        // headers: {
        //   token: getToken(),
        // },
      });

      if (res.data.code === 200) {
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
        this.username = res.data.data.username;
      }
    },
    // 退出
    logout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.get("/logout");

          if (res.data.code === 200) {
            // 1、删除token
            localStorage.removeItem("token");

            // 2、跳转到首页
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>
