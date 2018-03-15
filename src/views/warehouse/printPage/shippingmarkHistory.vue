<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo"><span class="titleName">采购箱唛历史记录</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row class="supplier_btn">
        <el-button type="primary"  size="small"  @click="toPrint('',sels)">批量打印</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="historyData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="打印" placement="top-start" >
                <i class="iconfontyyy" @click="toPrint(scope.row,'')" >&#xe638;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable label="采购箱唛" align="center" width="425px">
            <template scope="scope">
              <el-row style="text-align: left;padding:18px 0">
                <!--<el-col :span="9"><img src="../../../assets/imgTest.jpg" alt="二维码" style="width: 130px;height: 140px;padding-top: 0px"></el-col>-->
                <el-col :span="9"><img :src="getImage(scope.row.cartonDataList.cartonId)" alt="二维码" style="width: 130px;height: 140px;padding-top: 0px"></el-col>
                <el-col :span="15">
                  <span>编号：{{scope.row.cartonDataList.cartonNo}}</span><br/>
                  <span>订单编号（{{scope.row.cartonDataList.poCount}}个）/物品个数（{{scope.row.cartonDataList.productCount}}种）：</span><br/>
                  <span v-for="(item,index) in scope.row.cartonPoInfoList" v-if="index == 0 || index == 1 || index == 2">{{item.poNo}}<br/></span>
                  <span style="margin-top: 20px;">重量：{{scope.row.cartonDataList.weight}}KG</span><br/>
                  <span>体积：{{scope.row.cartonDataList.lengh+'*'+scope.row.cartonDataList.width+'*'+scope.row.cartonDataList.height+'cm'+'='+scope.row.cartonDataList.voiume}}cm3</span>
                </el-col>
              </el-row>
              <el-row style="text-align: left;">
                <el-col>
                  <div v-for="(item,index) in scope.row.cartonIntemList" v-if="index == 0 || index == 1" style="margin:10px 0">
                    <span>物品名称：{{item.productName}}</span><br/>
                    <span>SKU：{{item.skuNo}}</span><br/>
                    <span>装箱/套袋数量：{{item.qty == null ? '' : item.qty}}/{{item.labelQty == null ? '' : item.labelQty}} PCS/PCS</span><br/>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column sortable label="订单个数"   align="center">
            <template scope="scope">
              {{scope.row.cartonDataList.poCount}}
            </template>
          </el-table-column>
          <el-table-column sortable prop="city" label="订单详情" align="center" width="180px">
            <template scope="scope">
              <span v-for="item in scope.row.cartonPoInfoList">{{item.poNo}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable label="SKU种数" align="center">
            <template scope="scope">
              <span>{{scope.row.cartonDataList.productCount}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="SKU详情" align="center"  width="180px">
            <template scope="scope">
              <span v-for="item in scope.row.cartonIntemList">{{item.skuNo}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable label="创建人" align="center" >
            <template scope="scope">
              <span>{{scope.row.cartonDataList.addUser}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable label="创建时间"  align="center" width="180px">
            <template scope="scope">
              <span>{{scope.row.cartonDataList.addTime}}<br/></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        src:'',
        historyData:[],
        itemList:[],
        sels:[],
        poId:'',
        imgSrc:'',
      }
    },
    mounted () {
      this.poId = this.tool.requestParams('poId');
      this.getMarkHistoryList();
    },
    methods: {
      selsChange:function (sels) {
        this.sels = sels.map(item =>item.cartonDataList.cartonId);
      },
      getMarkHistoryList:function(){
        this.httpPost('pocarton/selectCartonInfo',{poId:this.poId}).then(res => {
            if(res.data.result == true){
              this.historyData = res.data.params.list;
            }else{
                this.$alert('未登录请重新登录', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.replace({
                      path: '/login',
                    })
                  }
                });
              }
        })
      },
      toPrint:function(row,sels){
        var arr1 = row != '' ? [row.cartonDataList.cartonId] : [];
        var arr2 = sels.length >0 ? sels : [];
        var arr = sels.length > 0 ?  arr2 : arr1;
        if(arr.length<1){
            this.tips();
        }else{
          window.open(this.RmsUrl+'pocarton/downloadCartonInfo?strList='+arr+'&Authorization=' + sessionStorage.getItem("userSession"));
        }
      },
      getImage:function(row){
         return this.RmsUrl+'pocarton/printCartonCode?strData='+row+'&Authorization='+sessionStorage.getItem('userSession');
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
</style>
