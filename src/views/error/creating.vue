<template>
  <div class="div">
    <el-col :span="7">&nbsp;</el-col>
    <el-col :span="10" class="divImg"><img src="../../assets/beingPic.png" alt=""></el-col>
    <el-col :span="7">&nbsp;</el-col>
  </div>
</template>
<script>
    export default{
        data(){
            return {}
        },
        mounted () {

        },
        methods: {}
    }
</script>

<style scoped>
    [v-cloak] {
        display: none;
    }
    .div{
      width: 100%;
      height: 100%;
    }
    .divImg{
      margin-top:10px;
    }
    img{
      width: 100%;
      height: 100%;
    }
</style>
