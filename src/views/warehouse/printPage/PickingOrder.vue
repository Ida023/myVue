<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo" ><span class="titleName" style="margin-left: 250px">拣货单</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap" style="padding: 0 50px 0 50px">
     <h3>基本信息</h3>
      <div >
        <el-row class="pdd">
          <el-col :span="12" class="pddPd">始发仓库：{{ ObjData.whId }}</el-col>
          <el-col :span="5" class="pddPd"></el-col>
        </el-row>
        <el-row class="pdd">
          <el-col :span="12" class="pddPd">目的仓库：{{ ObjData.wIdStore }}</el-col>
          <el-col :span="5" class="pddPd">打印人：{{ ObjData.printUser }}</el-col>
        </el-row>
        <el-row class="pdd">
        <el-col :span="12" class="pddPd">产品品种总数/产品数量总计：{{ ObjData.productCategoryCount }}/{{ ObjData.productCount }}</el-col>
        <el-col :span="5" class="pddPd">打印时间：<span v-text="tool.formatDate('','',ObjData.printTime)"></span></el-col>
       </el-row>
      </div>
      <h3>签名信息</h3>
      <div >
        <el-row class="pdd">
          <el-col :span="6" class="pddPd">拣货人_________________</el-col>
          <el-col :span="6" class="pddPd">开始时间_______________</el-col>
          <el-col :span="6" class="pddPd">结束时间_______________</el-col>
        </el-row>
        <el-row class="pdd">
          <el-col :span="6" class="pddPd">打包/发货人____________</el-col>
          <el-col :span="6" class="pddPd">开始时间_______________</el-col>
          <el-col :span="6" class="pddPd">结束时间_______________</el-col>
        </el-row>
      </div>
      <h3>产品信息</h3>
      <div id="item_list">
        <el-table :data="ObjData.infos" border tooltip-effect="dark" style="width: 100%"  @selection-change="">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column sortable label="SKU" align="center" prop="skuNo">
          </el-table-column>
          <el-table-column sortable label="图片" align="center">
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
            </template>
          </el-table-column>
          <el-table-column sortable label="商品名称"  prop="productName" align="center"></el-table-column>
          <el-table-column sortable label="数量"  prop="productCount" align="center"></el-table-column>
          <el-table-column sortable label="库位号"  prop="locationNo" align="center"></el-table-column>
          <el-table-column sortable label="报关数量"  prop="customsCount" align="center"></el-table-column>
          <el-table-column sortable label="备注"  prop="note" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default{
    components: {
      ElCol,
      ElRow},
    data(){
      return {
        radio2:'',
        src:'',
        historyData:[],
        itemList:[],
        sels:[],
        poId:'',
        ObjData:{},
        type:'',
        arr:'',
        shipmentId:''
      }
    },
    mounted(){
      this.arr=this.tool.requestParams('arr');
      this.shipmentId=this.tool.requestParams('shipmentId');
      this.type=this.tool.requestParams('type');
      this.getListData();
      this.httpPost('selectAllCategoryList').then(res => {
        if (res.data.result == true) {
          this.categoryList = res.data.params.mapList;
        }
      })
    },
    methods: {
      toLabelCardBoard:function(){
        window.open('#/labelCardBoard');
      },
      getListData:function () {
          if(this.type==='0'){
//            let arr;
//            let str=location.href;
//            let num=str.indexOf("?");
//            str=str.substr(num+1);
//            arr=str.split(",");
//            alert(this.arr)
            let arrs = this.arr.split(",")
            this.httpPost('warehouseAllotting/printOrder',arrs).then(res=>{
              this.ObjData=res.data;
            })
          }else {
            this.httpGet('warehouseAllotting/printFbaOrder?shipmentId='+this.shipmentId).then(res=>{
              this.ObjData=res.data;
            })
          }
      },
      GetQueryString:function (url) {

      }

    }
  }
</script>
<style scoped>
  .header {
    width: 100%;
    line-height: 80px;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left;
  }
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .pdd{
    padding-left: 100px;
  }
 .pddPd{
   margin-top: 10px !important;
 }
  .breakAll{
    word-break: break-all;
  }
  .padding-style{
    padding:10px;
  }
  .box-style{
    border-top: solid 1px #ccc;
  }
</style>
