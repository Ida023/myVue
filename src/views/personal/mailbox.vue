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
          <img src="../../assets/g-3.png" width='100%' alt="邮箱激活"/>
          <p>邮箱激活</p>
        </div></el-col>
      </el-row>
    </div>
    <div class="reg" >
      <!--注册表单开始-->
      <div class="reg-mailbox">
        <img src='../../assets/email.png' alt="邮箱注册"/>
        <span>您的注册信息已经提交成功，激活邮件已经发送
            到您的注册邮箱中，请前往查收并激活。
            </span>
      </div>
    </div>
  </div>
<Footerr></Footerr>
</section>
</template>
<script>
  import Headd from './head.vue'
  import Footerr from './footer.vue'
  export default {
    components: {
      Headd,
      Footerr,
    },
    data(){
        return{
            url1:{
              url:''
            },
       messg:'',
        }
    },
    mounted: function () {
      this.verification('url');
//        this.getQueryStringArgs()
    },
    methods:{
      verification(){
       this.url1.url=location.href;
          this.$http.post(this.RmsUrl+'/verifyUserActiveCode',this.qs.stringify(this.url1)).then(res=>{
            this.messg=res.data.message;
            let ress = res.data.result;
            if(ress===true){
//              this.open()
              this.$router.push({path:'/mailsuccess'})
            }else {
//              this.open()
            }

          })

      },
      open() {
        this.$alert(this.messg, '消息', {
          confirmButtonText: '确定',
        });
      }


     }
  }

</script>
<style scoped>
  .reg{
     width:80%;
    margin:0 auto;
    text-align: center;
  }
.reg-mailbox{
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
</style>
