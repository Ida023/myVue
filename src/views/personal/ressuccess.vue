<template>
  <section id="flex-warp">
    <Headd></Headd>
    <div id="center-warp">
      <div class="progress" >
        <el-row class="reg-row">
          <el-col :span="8"><div class="col-msg grid-content bg-purple pro-information ">
            <img src="../../assets/b-1.png"  width='100%' alt="基础信息"/>
            <p>邮箱验证</p>
          </div></el-col>
          <el-col :span="8"><div class="col-email grid-content bg-purple-light pro-information">
            <img src="../../assets/b-2.png" width='100%' alt="邮箱验证"/>
            <p>密码重置</p>
          </div></el-col>
          <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
            <img src="../../assets/b-3.png" width='100%' alt="邮箱激活"/>
            <p>重置成功</p>
          </div></el-col>
        </el-row>
      </div>
      <div class="reg" >
        <div class="reg-mailbox">
          <div class="mail-s">
            <b>您的新密码已生效！</b><br><br>
            <!--您可以通过邮箱<b>13603035423@139.com</b><router-link to="/login">登录E睿宝。</router-link><br>-->
            您可以通过邮箱<router-link to="/login" style="display: inline-block;color:#1c4fc6;">登录E睿宝。</router-link>祝您使用愉快!
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
 width:50%;
 margin:0 auto;
 margin-top:60px;
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
height:100px;
background:url("../../assets/ok.png")no-repeat 20% center;
padding:33px 0 0 214px;
text-align:left;
margin:0 auto;  background-position-x: 20%;
}

</style>
