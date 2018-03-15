<template>
<section id="flex-warp">
  <Headd></Headd>
  <div id="center-warp" >
    <div class="progress" >
      <el-row class="reg-row">
        <el-col :span="8"><div class="col-msg grid-content bg-purple pro-information ">
          <img src="../../assets/b-1.png"  width='100%' alt="基础信息"/>
          <p>邮箱验证</p>
        </div></el-col>
        <el-col :span="8"><div class="col-email grid-content bg-purple-light pro-information">
          <img src="../../assets/g-2.png" width='100%' alt="邮箱验证"/>
          <p>密码重置</p>
        </div></el-col>
        <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
          <img src="../../assets/g-3.png" width='100%' alt="邮箱激活"/>
          <p>重置成功</p>
        </div></el-col>
      </el-row>
    </div>
    <div class="reg" >
      <!--注册表单开始-->
      <div class="reg-mailbox">
        <div class="mail-s">
          <b>您的邮箱地址已提交成功!</b><br><br>
          密码重置邮件已经发送到您的邮箱中，请前往查收并重置密码。
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
.reg-mailbox{
 margin:0 auto;
 margin-top:60px;
 margin-bottom:60px;
 width:50%;
}
.reg-mailbox img,.reg-mailbox span{
vertical-align:middle;
}
.reg-mailbox span{
   display: inline-block;
   width:350px;
   line-height:35px;
   text-align:left;
   padding-left:16px;
}
.mail-s{
width:50%;
height:114px;
background:url("../../assets/email.png")no-repeat left center;
padding:33px 0 0 135px;
text-align:left;
margin:0 auto;
}
</style>
