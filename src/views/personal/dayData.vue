<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div class="dayData">
        <div class="titleClass"><span>版本更新记录</span></div>
        <div class="done">
          <span @click="goBack">返回</span>
        </div>
    </div>
    <div id="content_wrap" class="content_wrap">
      <div class="info_main">
            <div class="infoData" v-for="item in infoData" :key="item">
              <div class="date">{{item.updTime}}</div>
              <div v-html="item.content" class="contentAa"></div>
            </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
   data(){
       return{
         pageFilter:{
             currentPage:1,
             pageSize:10,
         },
         infoData:[]
       }
   },
    mounted(){
       this.getDayInfoData();
    },
    methods:{
      getDayInfoData(){
        this.httpPost('personalCentre/selectUpgradel',this.pageFilter).then(res =>{
          if(res.data.result == true){
              this.infoData = res.data.params.docsDataList.listData;
              for(var i=0;i<this.infoData.length;i++){
                  let time = this.tool.reserverDate(this.infoData[i].updTime);
                  this.infoData[i].updTime = time;
              }
          }
        })
      },
      goUpdPass(){
          this.$router.push({
            path:'/respaswd'
      })
    },
      goBack(){
          this.$router.go(-1);
    },
    }
  }
</script>

<style scoped>
.dayData{
  position: fixed;
  width:100%;
  margin:0 auto;
}
.titleClass{
  border-bottom: 1px solid #ccc;
  color:black;
  padding:15px 0;
  font-size:18px;
  font-weight:bold;
}
.titleClass{
  text-align: center;
}
  .done{
    cursor: pointer;
    text-align: right;
    color:#20a0ff;
    margin-right:20px;
    padding: 20px;
  }
  .infoData{
    margin:0 0 20px 0px;

  }
  .date{
    padding-bottom:10px;
  }
  .contentAa{
    font-size:14px;
  }
  .content_wrap{
    margin-top:60px;
    overflow: auto;
  }
</style>
