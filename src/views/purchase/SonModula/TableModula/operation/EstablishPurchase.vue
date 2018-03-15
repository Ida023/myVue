<template>
  <div>
    <div v-for="(item,index) in Obj.idSkuCount" class="EstablishPurchaseNav">
      <el-row class="linHe">
        <el-col :span="3" class="textStyle ">
          <span >SKU</span>
        </el-col>
        <el-col :span="8">
          <span>{{ item.skuNo }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="textStyle textTop">
          <span >采购数量</span>
        </el-col>
        <el-col :span="8" style="margin-top: 6px">
          <span >{{ item.count }}</span>
        </el-col >
      </el-row>
    </div>


  </div>
</template>

<script>
  import Journal from './Journal';
  import Remarks from './Remarks';
  import AllocationStatus from './AllocationStatus';
  import SalesStatus from './SalesStatus';
  import StockingId from './StockingId';
  import CostDetails from './CostDetails';
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import ElInput from "../../../../../../node_modules/element-ui/packages/input/src/input";
  export default{
    components:{
      ElInput,
      ElCol,
      ElRow,
      Journal,
      Remarks,
      AllocationStatus,
      SalesStatus,
      StockingId,
      CostDetails
    },
    /*
     ScreenData:父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     TableListData：父组件 条件过滤后拿到的 list，用于table；
     */
    props:['ScreenData','SeeTableData','SondefaultData'],
    data() {
      return {
        TableData:[],
        Obj:{
          state:'true',
          processkey:'',
          nodeId:'',
          stockId:[],
          idSkuCount:{}
        }
      }
    },
    mounted(){
      //      this.HandleData();
//      this.getListData();
      console.log(this.SondefaultData)
      console.log(46464646464)
    },
    methods:{
      getListData:function (val,stockId,vendorId) {
        this.Obj.processkey=this.SondefaultData.processKey;
        this.Obj.nodeId=this.SondefaultData.nodeId;
        this.Obj.stockId=stockId;
        this.Obj.vendorId=vendorId;
        this.httpPost('stockProductPlan/selectSku',val).then(res=>{
          console.log(res)
          this.Obj.idSkuCount=res.data;
          this.$emit('SonDifferentiatedRequest')
        })
      },
      PostData:function (val) {
        this.httpPost('stockProductPlan/creatPoInfo',this.Obj).then(res=>{
          if(res.data.result){
            this.$emit('dilEstablishPurchase')
          }else {
              this.$message(res.data.message)
          }
        })
      },
    },
    watch:{
      'ScreenData':{
        handler(val){
          this.SonScreenData=val;
          this.combination(val)
        },
        deep: true
      },
      'TableListData':{
        handler(val){
          this.SonTableListData=val;
        },
        deep: true
      },
    },

  }


</script>

<style scoped>
  .simulation{
    border-bottom: 1px solid #dfe6ec;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 180px;
    position: relative;
  }
  .childDiv{
    position: relative;
    top:50%;
  }
.textStyle{
  text-align: right;
}
  .linHe{
    line-height: 40px;
  }
  .EstablishPurchaseNav{
    margin-bottom: 20px;
  }
</style>
