<template>
   <div class="progress" >
          <el-row class="reg-row">
            <el-col :span="8"><div class="col-msg grid-content bg-purple pro-information ">
             <img src="../../assets/g-1.png"  width='100%' alt="基础信息"/>
              <p>基础信息</p>
            </div></el-col>
            <el-col :span="8"><div class="col-email grid-content bg-purple-light pro-information">
             <img src="../../assets/g-2.png" width='100%' alt="邮箱验证"/>
                       <p>邮箱验证</p>
            </div></el-col>
            <el-col :span="8"><div class="col-Success grid-content bg-purple pro-information">
             <img src="../../assets/g-3.png" width='100%' alt="邮箱激活"/>
                         <p>邮箱激活</p>
            </div></el-col>
          </el-row>
     </div>
</template>
<script>
  export default {
    data() {
      return {
        tabimg: '',

      }
    },
    props:['tabimg']
  }
</script>
<style scoped>
.progress{
  margin-top:52px;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  position: relative;
  width:100%;

}
 .progress div.reg-row {
   width:68%;
   margin:0 auto;
  }

  .pro-information {
    border-radius: 4px;
    min-height: 36px;
    text-align:center;
  }
.el-col>div.pro-information{
    margin-right:0;
  }
  .pro-information img{
    width:100%;
  }

@media screen and (max-width: 1080px) {
  .progress div.reg-row{
    width:100%;
  }
  .progress{
    width:100%;
  }
}
</style>
