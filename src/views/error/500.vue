<template>
  <div class="errPage-container">
    <el-button @click="back" icon='arrow-left' class="pan-back-btn">返回</el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>服务器崩溃了！</h2>
        <h6>你可以尝试</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link :to="refresh">刷新当前页</router-link>
          </li>
          <li class="link-type">
            <router-link to="/personal">返回首页</router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import errGif from '../../assets/error/403.gif';
  export default {
    data() {
      return {
        errGif: errGif,
        refresh:sessionStorage.getItem('fromPath'),
      }
    },
    beforeRouteEnter(to, from, next) {
      let fromPath = from.path;
      sessionStorage.setItem('fromPath',fromPath);
      next();
    },
    methods: {
      back() {
          this.$router.push({
            path:this.refresh
          })
      },
    }
  };
</script>

<style scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
  }
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
    }
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
      }
        a:hover {
          text-decoration: underline;
        }

</style>
