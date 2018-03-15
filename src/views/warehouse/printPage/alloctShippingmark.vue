<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo"><span class="titleName">调拨箱唛</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row class="supplier_btn">
        <el-button type="primary"  size="small"  @click="toPrint()">批量打印</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="historyData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="打印" placement="top-start" >
                <i class="iconfontyyy" @click="RowFn(scope.row,'打印')" >&#xe638;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" >
                <i class="iconfontyyy" @click="RowFn(scope.row,'查看')" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="卡板标签" placement="top-start" >
                <i class="iconfontyyy" @click="RowFn(scope.row,'卡板标签')" >&#xe638;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable label="调拨箱唛" align="center" width="425px">
            <template scope="scope">
                <el-row style="text-align: left;margin:0 -18px ">
                  <el-row style="border-bottom: solid 1px #ccc;">
                    <el-col :span="6" style="padding: 10px;">
                      <img :src="scope.row.qrCodeURl" alt="二维码" style="width: 100%;height: 100px;">
                    </el-col>
                    <el-col :span="18" >
                      <el-col :span="16" class="breakAll" style="padding:10px 10px 10px 0;">
                        <span>箱唛编号：{{ scope.row.cartonNo}}</span><br/>
                        <span>{{ scope.row.whId}}-->{{ scope.row.transitWhId}}-->{{ scope.row.toWhId}}</span><br/>
                        <span >重量：{{ scope.row.maxWeight}}KG</span><br/>
                        <span >体积：{{ scope.row.maxLength }}*{{ scope.row.maxWidth }}*{{ scope.row.maxHeight }}cm=<span v-text="scope.row.maxLength*scope.row.maxWidth*scope.row.maxHeight"></span>cm3</span><br/>
                      </el-col>
                      <el-col :span="8" style="border-left: solid 1px #ccc;">
                        <div class="padding-style">
                          <span>报关</span>
                          <el-radio-group v-model="scope.row.isCustoms" style="margin-left: 10px;" disabled="true">
                            <el-radio label="1">是</el-radio><br/>
                            <el-radio label="0">否</el-radio>
                          </el-radio-group>
                        </div>
                        <div class="box-style">
                          <span>箱号</span>
                          <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ scope.row.cartonIndex }}</h3>
                          <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ scope.row.PNo }}</h3>
                        </div>
                      </el-col>
                    </el-col>
                  </el-row>
                  <el-col style="margin:10px">
                    <span class="" >物品个数总计（{{ scope.row.productCategoryCount }}种）/物品数量总计（{{ scope.row.productCount }}个）</span><br/>
                  </el-col>
                  <div style="margin:10px" class="breakAll" v-for="(item ,index) in scope.row.infos">
                    <span class="">编号:{{ item.stockNo }}</span><span style="margin: 0 20px;">SKU:{{ item.skuNo }}</span><span>数量:{{ item.productCount }}/{{ item.signProductCount }}PCS</span><br/>
                    <span class="">{{ item.productName }}</span><br/>
                  </div>
                </el-row>
            </template>
          </el-table-column>
          <el-table-column sortable label="调拨单编号"  prop="transferNo" align="center"></el-table-column>
          <el-table-column sortable label="是否报关"align="center">
            <template scope="scope">
              <span v-text="scope.row.isCustoms === '0' ? '否' : '是'"></span>
            </template>
          </el-table-column>
          <el-table-column sortable label="物品种数" align="center">
            <template scope="scope">
              <span>{{ scope.row.productCategoryCount }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="数量总计"  prop="stockNo" align="center">
            <template scope="scope">
              <span>{{ scope.row.productCount }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="箱号" align="center">
            <template scope="scope">
              <span>{{ scope.row.cartonIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="创建人"  prop="creatUser" align="center"></el-table-column>
          <el-table-column sortable label="创建时间"  prop="creatTime" align="center" :formatter="tool.formatDate"></el-table-column>
          <el-table-column sortable label="状态"  prop="sate" align="center"></el-table-column>
        </el-table>
      </div>
      <!--  已装箱下的----装箱清单--------------------------->
      <el-dialog title="已装箱详情" :visible.sync="dialogFlag.zhuangXiang2" :close-on-click-modal="false" size="tiny" @close="closeData">
        <div class="table_padding">
          <el-table :data="SeePackingData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column sortable label="SKU" align="center" prop="skuNo"></el-table-column>
            <el-table-column sortable label="图片" align="center" prop="stockNo">
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column sortable label="商品名称" align="center" prop="productName"></el-table-column>
            <el-table-column sortable label="数量" align="center" prop="productCount"></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.zhuangXiang2 = false;">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        radio2:'',
        src:'',
        historyData:[],
        itemList:[],
        sels:[],
        poId:'',
        transferId:'',
        dialogFlag: {
          isOpen: false,
          zhuangXiang: false,
          zhuangXiang2: false,
          infoDetail: false,
          dialogTitle: "",
          inputDisabled: false,
        },
        SeePackingData:[],
        SeePacking:{//装箱待调拨 查看装箱清单
          cartonId:'',
          type:'1',
        },
        sels:[],
        cartonId:[]
      }
    },
    mounted(){
      this.transferId=this.tool.requestParams('transferId');
      this.getListData();

    },
    methods: {
      toLabelCardBoard:function(){
/*        this.$router.replace({
          path:'/labelCardBoard',
          query:{a:1}
        })*/
        window.open('#/labelCardBoard');
      },
      toPrint:function () {
        let _this=this;
        _this.cartonId = _this.sels.map(item => item.cartonId);
        if(this.sels.length<1){
          _this.tips();
        }else {
          window.open(this.RmsUrl+'warehouseAllotting/printCartonLabel?Authorization='+sessionStorage.getItem('userSession')+'&cartonId='+this.cartonId);
        }

      },
      selsChange: function (sels) {//批量操作获取 ID
        this.sels = sels;
        this.cartonId=[];
        console.log(this.sels)
      },
      RowFn:function (row,key) {//表格行内操作
        let _this = this;
        this.cartonId = [];
        switch (key) {
          case '打印':
            this.cartonId.push(row.cartonId)
            window.open(this.RmsUrl+'warehouseAllotting/printCartonLabel?Authorization='+sessionStorage.getItem('userSession')+'&cartonId='+this.cartonId);
            break;
          case '卡板标签':
            window.open('#/labelCardBoard');
            break;
          case '查看':
            this.dialogFlag.zhuangXiang2 = true;
            this.SeePacking.cartonId=row.cartonId;
            this.httpPost('warehouseAllotting/getStockCartonBoxInfoById',this.SeePacking ).then(res=>{
              this.SeePackingData=res.data;
            });
        }
      },
      getListData:function () {
        this.httpPost('warehouseAllotting/selectTraCartonNoById?transferId='+this.transferId).then(res => {
          this.historyData=res.data;
        })
      },

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
