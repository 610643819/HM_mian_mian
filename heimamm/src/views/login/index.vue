<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!-- form表单部分 -->
      <el-form class="login-form" :model="ruleForm" :rules="rules1" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-user" placeholder="请输入手机号" v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="18">
            <el-col :span="16">
              <el-input prefix-icon="el-icon-key" placeholder="请输入验证码" v-model="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="codeURL" @click="getCodeImg" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheckBox">
          <el-checkbox v-model="ruleForm.isCheckBox"></el-checkbox>我已阅读并同意
          <el-link type="primary" href="http://www.baidu.com">用户协议</el-link>和
          <el-link type="primary" href="http://www.baidu.com">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="submitLogin('loginFormRef')">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
    <!-- 注册子组件 -->
    <Register ref="registerRef"></Register>
  </div>
</template>

<script>
import Register from './register';
export default {
  name:'Login',
  components:{Register},
  data() {
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
    // 用户协议勾选
    let CheckBox = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请勾选用户协议"));
      }
      callback();
    };
    // 密码验证 6位到11位不含符号
    let passwordFn = (rule, value, callback) => {
      // console.log(value);
      if (!/^[a-zA-Z\d]{6,11}$/.test(value)) {
        return callback(new Error("6位到11位不含符号"));
      }
      callback();
    };
    let codeFn = (rule, value, callback) => {
      // console.log(value.length);
      if (!value) {
        return callback("请输入验证码");
      }
      callback();
    };

    return {
      isShow:false,
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      // +"&a="+Math.random()*99
      ruleForm: {
        phone: "18511111111", //手机号码
        password: "12345678", //密码
        code: "", //验证码
        isCheckBox: true //用或协议checkbox
      },
      rules1: {
        phone: [{ validator: phoneFn, trigger: "blur" }],
        isCheckBox: [{ validator: CheckBox, trigger: "change" }],
        password: [{ validator: passwordFn, trigger: "blur" }],
        code: [{ validator: codeFn, trigger: "blur" }]
      }
    };
  },
  methods: {
    getCodeImg() {
      this.codeURL = this.codeURL + +"&a=" + Math.random() * 99;
    },
    // 提交验证
    submitLogin(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid)//true || false
        if (!valid) return;
        this.$axios.post("/login", this.ruleForm).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            localStorage.setItem('token',res.data.data.token)
            this.$message({
              message: '登录成功',
              type: "success"
            });
            this.$router.push('/layout')
          } else {
            this.$message.error('登录失败');
            this.getCodeImg()
          }
        });
      });
    },
    register(){
      this.isShow = true
      this.$refs.registerRef.dialogVisible = true
    }
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>
