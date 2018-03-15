<template>
    <div id="">
      <el-row>
        <el-col :span="8" class="cardStyle" v-for="(item,index) in ListData">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 16px;">{{ item.type }}</span>
            </div>
            <div  class="text item">
             <div > <span> {{ item.addUser }} <span v-html="tool.formatDate('','',item.addTime)"></span></span></div><br />
              {{ item.note }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  export default{
    data(){
        return{
          ListData:[]
      }
    },
    mounted(){},
    methods:{
        getList:function (val) {
          this.httpGet('stockProductPlan/selectStockNotes?itemId='+val).then(res=>{
//              alert(11)
            console.log(res)
            this.ListData=res.data;
          })
        }
    },
  }

</script>

<style scoped>
  .cardStyle{
    padding: 0 15px 0 15px;
  }
  .text{
    min-height: 150px;
  }
</style>
