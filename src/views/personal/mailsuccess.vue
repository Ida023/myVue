<template>
<section id="flex-warp">
  <Headd></Headd>
  <div id="center-warp" >
    <div class="progress" >
      <el-row class="reg-row">
        <el-col :span="8"><div class="col-msg grid-content bg-purple pro-information ">
          <img src="../../assets/b-1.png"  width='100%' alt="基础信息"/>
          <p>基础信息</p>
        </div></el-col>
        <el-col :span="8"><div class="col-email grid-content bg-purple-light pro-information">
          <img src="../../assets/b-2.png" width='100%' alt="邮箱验证"/>
          <p>邮箱验证</p>
        </div></el-col>
        <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
          <img src="../../assets/b-3.png" width='100%' alt="邮箱激活"/>
          <p>邮箱激活</p>
        </div></el-col>
      </el-row>
    </div>
    <div class="reg" >
      <!--注册表单开始-->
      <div class="reg-mailsuccess">
        <img src='../../assets/email.png' alt="邮箱注册"/>
        <div class="mailsuccess-text">
          <span>您已成功注册!</span><br>
          <router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
  <Footerr></Footerr>
</section>
</template>
<script>
  import Headd from './head.vue'
  import Progresss from './progress.vue'
  import Footerr from './footer.vue'
  export default {
    components: {
      Headd,
      Footerr,
      Progresss
    }
  }
</script>
<style scoped>
  .reg{
    width:80%;
    margin:0 auto;
    text-align: center;
  }
.reg-mailsuccess{
 margin:0 auto;
 margin-top:60px;
}
.reg-mailsuccess img{
float:left;
}
.reg-mailsuccess,.reg-mailsuccess span{
vertical-align:middle;
}
.reg-mailsuccess{
   display: inline-block;
   width:350px;
   line-height:35px;
   text-align:left;
   padding-left:95px;
}
.mailsuccess-text{
float:left;
padding-left:20px;
line-height:66px;
}
.mailsuccess-text a{
text-decoration:none;
color:#2b96e6;
}
</style>
