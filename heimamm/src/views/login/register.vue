<template>
  <div class="register">
    <el-dialog center :visible.sync="dialogVisible" width="40%">
      <div slot="title" class="title">注册</div>
      <el-form :model="registerForm" :rules="rules" ref="ruleForm" label-width="55px">
        <el-form-item label="头像" prop="avatar">
          <!-- action要上传到哪的链接 -->
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <el-row>
            <el-col :span="17">
              <el-input v-model="registerForm.code"></el-input>
            </el-col>
            <el-col style="margin-left:10px" :span="6">
              <img :src="codeURL" @click="getCodeImg" style="width:100%;height:40px" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row>
            <el-col :span="17">
              <el-input v-model="registerForm.rcode"></el-input>
            </el-col>
            <el-col style="margin-left:10px" :span="6">
              <el-button @click="rcode">发送验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "regiter",
  // 从标签组件接收数据 isShow
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
      imageUrl: "",
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
      dialogVisible: false,
      registerForm: {
        // post请求方式
        username: "", //用户名
        phone: "", //手机号
        email: "", //邮箱
        avatar: "", //头像地址
        password: "", //密码
        rcode: "", //验证码
        code: "" //图像码
      },
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads",
      rules: {
        avatar: [{ required: true, message: "选择头像", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        phone: [{ required: true, validator: phoneFn, trigger: "blur" }],
        email: [{ required: true, validator: emailFn, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最小6位数", trigger: "blur" }
        ],
        rcode: [],
        code: [
          {  message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "请输入正确的验证码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getCodeImg() {
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms" +
        "&a=" +
        Math.random() * 99;
    },
    rcode() {
      this.$axios
        .post("/sendsms", {
          code: this.registerForm.code,
          phone: this.registerForm.phone
        })
        .then(res => {
          // console.log(this.registerForm.code,'----',this.registerForm.phone)
          console.log(res);
          if (res.data.code === 200) {
            this.registerForm.rcode = res.data.data.captcha;
          } else {
            this.getCodeImg();
          }
        });
    },
    handleAvatarSuccess(res) {
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      this.registerForm.avatar = res.data.file_path;
      console.log(res);
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/pdf";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async submit() {
      const res = await this.$axios.post("/register", this.registerForm);
      console.log(res);
      if (res.data.code === 200) {
        this.$message({
          message: "注册成功",
          type: "success"
        });
        this.dialogVisible = false;
      } else {
        this.$message.error("错了哦，这是一条错误消息");
      }
    }
  },
  watch:{
    dialogVisible(newvalue){
      newvalue?'':this.$refs.ruleForm.resetFields();this.imageUrl = '';
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