<template>
  <div class="head">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="head-left">
            <router-link to="/login" ></router-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'headd',
    data() {
      return {

      }
    },
    methods:{
      toLogin:function(){
          window.location.reload()
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .head {
    border-bottom: 1px solid #ccc;
  }

  .grid-content {
    max-width: 1024px;
    height: 70px;
    margin: 0 auto;
    text-align: left;
  }

  .head-left a {
    display: inline-block;
    width: 182px;
    height: 70px;
    background: url("../../assets/logo2.png") no-repeat left center;
    background-size: 100%;
  }

</style>
