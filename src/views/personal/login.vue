<template>
  <div class="login" id="flex-warp">
    <Headd></Headd>
    <div id="center-warp" class="grid-content bg-purple-dark">
      <div class="form rel">
        <el-form :model="ruleForm" ref="ruleForm"  class="demo-ruleForm">
          <div class="user-logo rel"><span>登录E睿宝</span></div>
          <el-form-item prop="userNo" :rules="[{ required: true, message: '请输帐号', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
            <img class="userPho abs" src="../../assets/icon_03.jpg"/>
            <el-input type="email"  class="login-email use-pho" v-model="ruleForm.userNo" @keyup.enter.native="submitForm('ruleForm')">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="{ required: true, message: '密码不能为空', trigger: 'blur'}">
            <img class="userPho abs" src="../../assets/icon_06.jpg"/>
            <el-input type="password" class="login-pass"  v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" :loading="$store.state.loading" type="primary" id="loginToHome" @click="submitForm('ruleForm')"  @keydown.enter.native="submitForm('ruleForm')">登  录</el-button>
          </el-form-item>
          <div class="reg"><router-link to="/reset">忘记密码?</router-link> | <router-link to="/register">立即注册</router-link></div>
        </el-form>
      </div>
    </div>
    <Footerr></Footerr>
  </div>
</template>
<script>
  import Headd from './head.vue'
  import Footerr from './footer.vue'
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default {
    components: {
      Headd,
      Footerr
    },
      data(){
          return{
            ruleForm: {
              userNo: '',
              password: '',
            },
            messg:'',
            useid1:{
              currentPage:'2'
            },
            useid2:{
              arr:"1,2,3,4"
            },
          }

      },
    mounted:function () {
        document.onkeydown = function(e){
         if(!e) e = window.event;//火狐中是 window.event
           if((e.keyCode || e.which) == 13){
               var doc = document.getElementById("loginToHome");
               if(doc && doc.id === 'loginToHome')doc.click();
           }
       };
      this.postmenu('')
      this.resetErrorCount(0);
    },
    methods:{
      ...mapMutations([
        'postmenu',
        'subnav',
        'getsub',
        'resetErrorCount'
  ]),
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost('toLogin',this.qs.stringify(this.ruleForm)).then(res=>{
              let ress = res.data.result;
              this.messg=res.data.message;

              //console.log( res.data)
//              console.log( 7777777777777777777777)
//              console.log(res.data.params.leftMenus)
              if(ress===true){

                //let str = res.data.params.user.userId;
                let str = res.data.params.Authorization;
                sessionStorage.setItem('MuneObj',JSON.stringify(res.data.params.leftMenus));
                sessionStorage.setItem('leftMenusArr',JSON.stringify(res.data.params.leftMenus));
                sessionStorage.setItem('topMenus',JSON.stringify(res.data.params.topMenus));
                sessionStorage.setItem("userSession",str);
               // console.log('Authorization='+str);
                this.$router.push({path:'/personal'})
              }else {
                //this.open()
                this.$message(this.messg);
              }
            })
          } else {
            return false;
          }
        });
      },
      open() {
        this.$alert(this.messg, '消息', {
          confirmButtonText: '确定',
        });
      }

      },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped rel="stylesheet/css">
  input {
    border: none;
  }

  a {
    color: #000;
  }

  .rel {
    position: relative;
  }

  .abs {
    position: absolute;
  }

  .login-button {
    width: 100%;
    background: #f6821f;
    border: none;
    color: #fff;
    font-size: 16px;
  }
  button.login-button:hover{
    background: #e4781b!important;
  }

  .grid-content {
    width: 100%;
    background: url("../../assets/banner_02.jpg") no-repeat center center/cover;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);

  }

  .user-logo {
    height: 37px;
    line-height: 37px;
    font-size: 20px;
    text-align: left;
    background: url("../../assets/user.png") no-repeat left center;
    padding-left: 45px;
    margin: 20px auto;
  }

  .userPho {
    top: 5px;
    left: 10px;
  }

  .form {
    max-width: 1024px;
    height: 400px;
    margin: 0 auto;
  }

  .el-row {
    width: 80%;
    margin: 0 auto;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content img {
    z-index: 22;
  }

  form {
    float: right;
    width: 364px;
    padding: 0 42px;
    right: 0;
    margin-top: 49px;
    background: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .reg {
    text-align: center;
    padding-bottom: 20px;
    padding-top: 10px;
    font-size: 14px;
  }
 .reg a:hover{
   color:#f6821f;
 }
  @media screen and (max-width: 1024px) {
    .grid-content {
      background: none;
    }

    .form {
      width: 100%;
      height: 100%;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      align-items: center;
      align-content: center;
    }

    form {
      position: relative;
      item: center;
      box-shadow: 1px 1px 3px #ccc;
    }
  }
  .border-r{
    border-right: none;
  }
</style>
<style>

</style>
