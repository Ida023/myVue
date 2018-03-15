<template>
  <div style="padding: 20px;width: 100%;">
    <!--  签收异常 页面--------------------------->
    <el-row type="flex" justify="space-between">
      <el-col :span="18">
        <el-tabs v-model="pageFilter.resendType" @tab-click="getData">
          <el-tab-pane label="签收异常" name="0"></el-tab-pane>
          <el-tab-pane label="已处理" name="1"></el-tab-pane>
          <el-tab-pane label="已签收" name="2"></el-tab-pane>
        </el-tabs>
      </el-col>
      <div style="text-align: right;" class="Astyel" @click="goBack">返回</div>
    </el-row>
    <el-table :data="modelData" style="width: 100%"  border tooltip-effect="dark" >
      <el-table-column   label="操作"  align="center" v-if="pageFilter.resendType == '0'">
        <template scope="scope">
          <el-tooltip content="处理" effect="dark" placement="bottom">
            <i  class="iconfontyyy" content="Bottom center" @click="getProductLabel(scope.row);">&#xe67e;</i>
          </el-tooltip>
          <el-tooltip content="签收"  effect="dark" placement="bottom" >
            <i  class="iconfontyyy" content="Bottom center" @click="getProductLabel(scope.row);">&#xe66e;</i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="parcelNo" align="center"  sortable  width="106px">
        <template scope="scope">
          <span v-text="scope.row.label" class="Astyel" @click="tool.goToPage('orderDetails?transferId='+scope.row.orderId)"></span>
        </template>
      </el-table-column>
      <el-table-column label="销售" prop="label" align="center" sortable></el-table-column>
      <el-table-column label="发货时间" prop="label" align="center" sortable></el-table-column>
      <el-table-column label="物流方式" prop="label" align="center" sortable></el-table-column>
      <el-table-column label="跟踪单号" prop="label" align="center" sortable></el-table-column>
      <el-table-column label="跟踪详情" prop="label" align="center" sortable></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        pageFilter:{
          resendType:'0',
        },
        fromPath:'',
      }
    },
    mounted () {
      //this.getData();
      //this.$route.query.orderId;
    },
    beforeRouteEnter:function(to,from,next){
        // 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建。
      //不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
        next(vm =>{
            vm.fromPath = from.path;
        })
    },
    methods: {
      getData(){
        this.httpGet('orderItems/selectByOrderId',{orderId:this.idValue},'Sms').then(res =>{
            if(res.data) {
              this.resendForm.redirectItems = res.data;
              this.$set(this.resendForm.redirectItems, 'qyt', '');
            }
         })
      },
      goBack:function(){
        this.$router.push({
          path:this.fromPath
        })
      }
    },
    watch:{

      },
  }
</script>
<style scoped>

</style>
