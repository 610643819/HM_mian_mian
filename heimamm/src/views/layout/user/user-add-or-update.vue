<template>
  <div class="register">
    <el-dialog center :visible.sync="dialogVisible" width="40%">
      <div slot="title" class="title">{{modo?'新增用户':'修改'}}</div>
      <el-form :model="registerForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <!-- 下拉框 -->
          <el-select v-model="registerForm.role_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- -------------------------- -->
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- 下拉框 -->
          <el-select v-model="registerForm.status" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- -------------------------- -->
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input show-password v-model="registerForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submint" ref="comfirm" :loading="comfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱
    let emailFn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写邮箱"));
      }
      if (
        !/^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
      ) {
        callback(new Error("请输入正确的邮箱地址"));
      } else {
        callback();
      }
    };
    // 手机号码验证
    let phoneFn = (rule, value, callback) => {
      // console.log("this is value:", value);
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("输入正确的手机号码"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      comfirm: false,
      modo: true, //1为新增；2位修改
      dialogVisible: false,
      codeURL: process.env.VUE_APP_BASEURL,
      //   + "/user/add"
      registerForm: {
        username: "", //用户名
        email: "", //邮箱
        phone: "", //手机号
        role_id: "", //角色
        status: "", //状态
        remark: "" //备注
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        phone: [{ required: true, validator: phoneFn, trigger: "blur" }],
        email: [{ required: true, validator: emailFn, trigger: "blur" }],
        role_id: [{ required: true, trigger: "blur" }],
        status: [{ required: true, trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      //   角色下拉框数据
      value: "",
      value1: "",
      options: [
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
      // 状态下拉框
      options1: [
        {
          value: 1,
          label: "启用"
        },
        {
          value: 0,
          label: "禁用"
        }
      ]
    };
  },
  methods: {
    submint() {
      // 这里有个校验判断，valid为true就是校验通过，false为校验不通过return出函数
      // 校验之后执行一个回调函数
      // this.$refs.comfirm.disabled = true;
      // 确定按钮禁用
      this.comfirm = true;
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return (this.comfirm = !this.comfirm);
        console.log("sbmint", this.modo);
        let res = null;
        if (this.modo) {
          console.log("请求");
          // 新增请求
          res = await this.$axios.post("/user/add", this.registerForm);
        } else {
          // 修改修改
          res = res = await this.$axios.post("/user/edit", this.userForm);
        }
        console.log(res);
        if (res.data.code == 200) {
          console.log(res);
          // 提示hint
          this.$notify({
            title: this.modo ? "注册成功" : "编辑成功",
            message: res.data.message,
            type: "success"
          });
          // 关闭当前的对话框
          this.dialogVisible = false;
          // console.log(res);
          this.$parent.getUserList();
          this.comfirm = false;
        } else {
          // 提示hint
          this.$notify({
            title: this.modo ? "注册失败" : "编辑失败",
            message: res.data.message,
            type: "warning"
          });
          this.comfirm =false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.register {
  .title {
    height: 53px;
    background-color: #03c0f9;
    color: #fff;
    line-height: 53px;
    text-align: center;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>