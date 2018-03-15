<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo"><span class="titleName">卡板标签</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <!--<el-row class="supplier_btn">-->
        <!--<el-button type="primary"  size="small"  @click="toPrint('',sels)">批量打印</el-button>-->
      <!--</el-row>-->
      <!--<el-row style="margin-bottom: 20px">-->
        <!--<span>状态</span>-->
        <!--<el-radio-group v-model="SonSeeCardData.type" size="small" @change="vuexState">-->
          <!--<el-radio-button  label="1">正常</el-radio-button>-->
          <!--<el-radio-button  label="0">已作废</el-radio-button>-->
        <!--</el-radio-group>-->
      <!--</el-row>-->
      <div id="item_list">
        <el-table :data="historyData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="打印" placement="top-start" >
                <i class="iconfontyyy" @click="RowFn(scope.row,'打印')" >&#xe638;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="作废" placement="top-start" >
                <i class="iconfontyyy" @click="RowFn(scope.row,'作废')" >&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable label="卡板标签" align="center" width="425px">
            <template scope="scope">
              <el-row style="text-align: left;margin:0 -18px;">
                <el-col :span="18" style="border-right: 1px solid #ccc">
                    <el-row style=" padding: 10px;">
                      <el-row style="border: 1px solid #ccc">
                        <el-col :span="8">
                          <img :src="scope.row.qrCodeUrl" alt="二维码" style="width: 100%;height: 100px;">
                        </el-col>
                        <el-col :span="16" style="padding-left: 10px">
                          <el-row style="border-bottom: 1px solid #ccc; height: 48px">卡板标签编号：{{ scope.row.boardNo}}</el-row>
                          <el-row>
                            <el-col :span="12" style="border-right: 1px solid #ccc; height: 70px">
                                <span>报关:</span><br />
                                <el-radio-group v-model="scope.row.isCustoms" style="margin-left: 40px;" disabled="true">
                                  <el-radio label="1">是</el-radio><br/>
                                  <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-col>
                            <el-col :span="12" style="padding-left: 6px">
                              <span>箱数总计:</span><br>
                              <span style="font-size: 16px; margin-left: 20px; margin-top: 6px">{{ scope.row.boxCount}}箱</span>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-row>
                  <el-row style="border-top: 1px solid #ccc">
                    <el-col :span="12" style="border-right: 1px solid #ccc; padding-left: 10px">
                      <span>毛重总计：{{ scope.row.maxWeight }}KG</span><br/>
                      <span>物品个数总计：{{ scope.row.productCategoryCount}}种</span><br/>
                      <span>物品数量总计：{{ scope.row.productCount}}个</span><br/>
                    </el-col>
                    <el-col :span="12" style="padding-left: 6px">
                      <span>箱号详情：</span><br/>
                      <span>{{ scope.row.boxNu}}</span><br/>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="6">
                  <el-row style="height: 70px; border-bottom: 1px solid #ccc; text-align: center">
                    <span>始发仓</span><br/>
                    <span style="font-size: 16px">{{ scope.row.whId }}</span>
                  </el-row>
                  <el-row style="height: 71px; border-bottom: 1px solid #ccc; text-align: center">
                    <span>中转仓</span><br/>
                    <span style="font-size: 16px">{{ scope.row.transitWhId }}</span>
                  </el-row>
                  <el-row style="height: 73px; text-align: center">
                    <span>目的仓</span><br/>
                    <span style="font-size: 16px">{{ scope.row.wIdStore }}</span>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column sortable label="卡板标签编号"  prop="boardNo" align="center"></el-table-column>
          <el-table-column sortable label="是否报关"  prop="stockNo" align="center">
            <template scope="scope">
              <span v-text="scope.row.isCustoms==='1' ? '是' : '否'"></span>
            </template>
          </el-table-column>
          <el-table-column sortable label="物品种数" align="center">
            <template scope="scope">
              <span v-text="scope.row.productCategoryCount"></span>
            </template>
          </el-table-column>
          <el-table-column sortable label="数量总计"  prop="productCount" align="center"></el-table-column>
          <el-table-column sortable label="箱数"  prop="boxCount" align="center"></el-table-column>
          <el-table-column sortable label="创建人"  prop="creatUser" align="center"></el-table-column>
          <el-table-column sortable label="创建时间"  :formatter="tool.formatDate" prop="creatTime" align="center"></el-table-column>
          <el-table-column sortable label="状态"  prop="state" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {
      ElButton,
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
        SonSeeCardData:{},
        cardData:{
          boardNo:'',
          isCustoms:''
        }
      }
    },
    mounted(){
      this.SonSeeCardData=JSON.parse(sessionStorage.getItem('SeeCardData'));
      this.getListData();
    },
    methods: {
      ...mapMutations([
        'getSeeCardData',
      ]),
      vuexState:function () {
        this.getListData()
      },
      getListData:function () {
        this.httpPost('warehouseAllotting/getBoardNoInfo',this.SonSeeCardData).then(res=>{
          this.historyData=res.data;
        })
      },
      RowFn:function (row,key) {//表格行内操作
        let _this = this;
        this.cartonId = [];
        switch (key) {
          case '打印':
              this.cardData.isCustoms=row.isCustoms;
              this.cardData.boardNo=row.boardNo;
            window.open(this.RmsUrl+'warehouseAllotting/printBoardLabel?Authorization='+sessionStorage.getItem('userSession')+'&boardNo='+this.cardData.boardNo+'&isCustoms='+this.cardData.isCustoms);
            break;
          case '作废':
//              alert(row.boardNo)
            _this.doItem('您确定作废此卡板标签？','warehouseAllotting/deleteCartonNoBycarTonId?boardNo='+row.boardNo, '', _this.getListData);
            break;
        }
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
