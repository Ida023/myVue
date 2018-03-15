<template>
  <div class="footer">
   <el-row>
     <el-col :span="24">
       © 2010-2017 深圳市睿搏科技集团有限公司 RBU 粤ICP备16006961号
     </el-col>
   </el-row>
  </div>
</template>
<script>
export default {
  name: 'footer',
   data() {
        return {

      }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer{
width:100%;
  align-self:flex-end;
border-top:1px solid #ccc;
/*position:fixed;*/
left:0;
bottom:0;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align:center;
  margin:0 auto;
}

</style>
