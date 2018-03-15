<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="pageFilter.itemId" placeholder="请输入备货子ID" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getUpdateData();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div class="updType">
                <span class="span_label">修改类型</span>
                <el-radio-group v-model="type" @change="pageFilter.changeStatus='01';getUpdateData()" size="small">
                  <el-radio-button  label="updateList/select"    v-if="ButtonInfo['修改备货计划']!='0'">修改备货计划</el-radio-button>
                  <el-radio-button  label="updateList/selectStockItemEcnInfo"    v-if="ButtonInfo['优先分配']!='0'">优先分配</el-radio-button>
                </el-radio-group>
              </div>
              <div class="updSea">
                <span class="span_label">搜索</span>
                <el-radio-group v-model="pageFilter.changeStatus" @change="getUpdateData" size="small">
                  <el-radio-button label="01" v-if="type=='updateList/select' && ButtonInfo['入库前修改']!='0'">入库前修改</el-radio-button>
                  <el-radio-button label="02" v-if="type=='updateList/select'  && ButtonInfo['入库后修改未处理']!='0'">入库后修改未处理</el-radio-button>
                  <el-radio-button label="03" v-if="type=='updateList/select'  && ButtonInfo['入库后修改已处理']!='0'">入库后修改已处理</el-radio-button>
                  <el-radio-button label="01" v-if="type=='updateList/selectStockItemEcnInfo'  && ButtonInfo['优先分配未处理']!='0'">优先分配未处理</el-radio-button>
                  <el-radio-button label="02" v-if="type=='updateList/selectStockItemEcnInfo'  && ButtonInfo['优先分配已处理']!='0'">优先分配已处理</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"  @click="handlerItems('','sels')"  v-if="type == 'updateList/select'  && ButtonInfo['批量处理']!='0'  " v-show="pageFilter.changeStatus == '02'">批量处理</el-button>
        <el-button type="primary" size="small"  @click="handlerItems('','poSels')"  v-if="type == 'updateList/selectStockItemEcnInfo'  && ButtonInfo['批量处理']!='0'" v-show="pageFilter.changeStatus == '01'">批量处理</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="updListData" ref="tableData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" v-if="type == 'updateList/select'">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" v-if="pageFilter.changeStatus == '02'">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="提交处理" placement="top-start" v-if="pageFilter.changeStatus == '02' && ButtonInfo['提交处理']!='0' ">
                <i class="iconfontyyy" @click="handlerItems(scope.row.id,'')" >&#xe63d;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="itemNo" label="原备货子ID"  align="center"></el-table-column>
          <el-table-column sortable prop="skuNo" label="sku"  align="center"></el-table-column>
          <el-table-column sortable  label="所属备货单编号"  align="center">
            <template scope="scope">
              <span class="doSomething" @click="getStockInfo(scope.row.stockId);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='查看备货计划'">{{scope.row.stockNo}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="qty" label="原备货个数"  align="center"></el-table-column>
          <el-table-column sortable prop="transportType" label="原运输方式" align="center"></el-table-column>
          <el-table-column sortable prop="warehouse" label="原目的仓"   align="center"></el-table-column>
          <el-table-column sortable label="关联采购单"   align="center">
            <template scope="scope">
              <span class="doSomething" @click="tool.goToPage('productsDetailedList?poId='+scope.row.poId)">{{scope.row.poNo}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="addTime" label="原备货单创建时间" width="180px" :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable prop="newQty" label="新备货个数"   align="center"></el-table-column>
          <el-table-column sortable prop="newTransportType" label="新运输方式" align="center"></el-table-column>
          <el-table-column sortable prop="newWarehouse" label="新目的仓"  align="center"></el-table-column>
          <el-table-column sortable prop="newAddTime" label="修改时间" width="180px" :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable label="新增备货单编号"   align="center">
            <template scope="scope">
              <span class="doSomething" @click="getStockInfo(scope.row.newStockId);dialogFlag.infoDetail=true;dialogFlag.dialogTitle='查看备货计划'">{{scope.row.newItemNo}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="newStockNo" label="新备货子ID"   align="center"></el-table-column>
        </el-table>
      </div>
      <div id="item_list">
        <el-table :data="prodListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" v-if="type == 'updateList/selectStockItemEcnInfo'">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" v-if="pageFilter.changeStatus == '01'">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="提交处理" placement="top-start" v-if="pageFilter.changeStatus == '01' && ButtonInfo['提交处理']!='0'">
                <i class="iconfontyyy" @click="handlerItems(scope.row.ecnId,'');" >&#xe63d;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable  label="采购订单"  align="center">
            <template scope="scope">
              <span class="doSomething" @click="tool.goToPage('productsDetailedList?poId='+scope.row.poId)">{{scope.row.poNo}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="skuNo" label="sku"  align="center"></el-table-column>
          <el-table-column sortable prop="purQty" label="采购数量"  align="center"></el-table-column>
          <el-table-column sortable label="关联备货子计划" align="center">
            <template scope="scope" >
              <span v-for="item in scope.row.stockItemQtyList">{{item.id}}/{{item.qty}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="receiveQty" label="入库数量"   align="center"></el-table-column>
          <el-table-column sortable prop="receiveTime" label="入库时间"  width="180px"  :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable prop="stockQtyList" label="原数量分配" align="center">
            <template scope="scope" >
              <span v-for="item in scope.row.stockQtyList">{{item.id}}/{{item.qty}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="newStockQtyLis" label="优先分配" align="center">
            <template scope="scope" >
              <span v-for="item in scope.row.newStockQtyList">{{item.id}}/{{item.qty}}<br/></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="updUser" label="修改人"  width="180px"   align="center"></el-table-column>
          <el-table-column sortable prop="updTime" label="修改时间"  width="180px"  :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable prop="processUser" label="处理人"  width="180px"   align="center"></el-table-column>
          <el-table-column sortable prop="processTime" label="处理时间"  width="180px"  :formatter="tool.formatDate" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------点击备货单号----来查看备货计划 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" >
      <section class="infoData">
            <div class="info_tit"><span class="title">基本信息</span></div>
            <el-form :model="infoFormData" ref="infoFormData" class="formData" >
              <el-form-item  label="备货编号：">{{infoFormData.stockNo}}</el-form-item>
              <el-form-item label="备货类型：">
                <StockingType :Selected="refId"></StockingType>
              </el-form-item>
              <el-form-item label="备货部门：" class="yufei_item">
                <getDeptList :select-value="infoFormData.deptId" :isDisabled="true"></getDeptList>
              </el-form-item>
              <el-form-item label="账号："  >{{infoFormData.stockUserAccountId}}</el-form-item>
              <el-form-item label="申请人：">{{infoFormData.stockUser}}</el-form-item>
              <el-form-item label="申请时间：">{{tool.formatDate('','',infoFormData.appTime)}}</el-form-item>
            </el-form>
          </section>
      <section class="infoData">
        <div class="info_tit" style="margin-bottom: 20px;">
          <span class="title">产品信息</span>
        </div>
        <div class="table_padding">
          <el-table :data="infoFormData.stockItemInfos" border tooltip-effect="dark" style="width: 100%" id="tableBody">
            <el-table-column prop="itemNo" label="备货子ID" width="120" align="center"></el-table-column>
            <el-table-column prop="" label="图片" width="106" align="center">
              <template scope="scope">
                <img :src="RmsUrl+scope.row.productImage" alt="" width="70px" height="70px">
              </template>
            </el-table-column>
            <el-table-column sortable width="140px" label="SKU/名称" align="center">
              <template scope="scope">
                <span>{{ scope.row.skuNo }}</span><br/>
                <span>{{ scope.row.productName }}</span><br>
              </template>
            </el-table-column>
            <el-table-column prop="requestQty" label="需求数量" width="120" align="center"></el-table-column>
            <el-table-column prop="requestSalesDays" label="预估销售天数" width="120" align="center"></el-table-column>
            <el-table-column prop="requestTransportValue" label="运输方式" width="120" align="center"></el-table-column>
            <el-table-column prop="requestWarehoueValue" label="目的仓" width="120" align="center"></el-table-column>
            <el-table-column prop="" label="库存信息" width="120" align="center">
              <template scope="scope">
                <span>货架数:{{scope.row.shelvesCount == null ? 0 : scope.row.shelvesCount}}</span><br/>
                <span>可销售:{{scope.row.canSale == null ? 0 : scope.row.canSale}}</span><br/>
                <span>锁定数:{{scope.row.slockCount == null ? 0 : scope.row.slockCount}}</span><br/>
              </template>
            </el-table-column>
            <el-table-column label="销售数据" width="120" align="center">
              <template scope="scope">
                <span>{{'7天销售:'+scope.row.salesCount_Seven}}</span><br/>
                <span>{{'15天销售:'+scope.row.salesCount_fifteen}}</span><br/>
                <span>{{'30天销售:'+scope.row.salesCount_thirty}}</span><br/>
              </template>
            </el-table-column>
            <el-table-column sortable label="重量（kg）" align="center">
              <template scope="scope">
                <span v-text="(scope.row.productWeight* scope.row.requestQty)/1000"></span>
              </template>
            </el-table-column>
            <el-table-column sortable label="体积（cm³）" align="center">
              <template scope="scope">
                <span v-text="scope.row.productbulk * scope.row.requestQty"></span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="到货记录" width="120px" align="center">
              <template scope="scope">
                  <span v-for="(items,index) in scope.row.purLog" :key="index">
                    <span>{{ items.cgNo }}</span><br />
                    <span>{{ items.count }}</span><br />
                  </span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeName" label="状态" width="120" align="center">
              <template scope="scope">
                <span v-if="scope.row.nodeName!=null">{{scope.row.nodeName}}<br/></span>
                <span v-if="scope.row.allocationStatus!=null">{{scope.row.allocationStatus}}<br/></span>
                <span v-if="scope.row.salesStatus!=null">{{scope.row.salesStatus}}<br/></span>
                <span v-if="scope.row.purStatus!=null" >{{scope.row.purStatus}}<br/></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!------------------查看 采购订单 弹出框--------------------------->
<!--    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="large">
      <el-tabs v-model="activeTab"  disabled>
        <el-tab-pane label="产品&备货" name='0'>
          <pro-table-list :getpo-id="poId" :dis="true" :isopen="dialogFlag.isOpen"></pro-table-list>
        </el-tab-pane>
        <el-tab-pane label="货款&交付" name='1'>
          <delivery-form  :getpo-id="poId" :dis="true" :isopen="dialogFlag.isOpen"></delivery-form>
        </el-tab-pane>
        <el-tab-pane label="备注" name="2">
          <section style="padding: 10px;border:1px solid #d1dbe5" v-if="noteData.length > 0">
            <div v-for="item in noteData" style="border-bottom:1px solid #d1dbe5;margin-bottom: 20px;">
              <div>
                <span>{{item.userName}}</span>
                <span>{{item.updTime}}</span>
              </div>
              <div style="word-wrap: break-word;padding-bottom: 10px;">{{item.note}}</div>
            </div>
          </section>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;">关闭</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
import getDeptList  from 'components/listData/getDeptList.vue';
import StockingType from './SonModula/BasicsModula/StockingType.vue';
import proTableList from './SonModula/TabModula/proTableList.vue'
import deliveryForm from './SonModula/TabModula/deliveryForm.vue'
  export default{
    components: {StockingType, getDeptList,proTableList,deliveryForm},
    data(){
      return {
        ButtonInfo:{},//按钮权限列表20171227
        refId:{
          Selected:'',
          dis:true,
        },
        activeTab:'0',     //
        infoFormData:{
          stockUser:'',
          stockUserAccountId:'',
          salesNote:'',
          appTime:'',
          deptId:[],
          refId:'',
          stockNo:'',
          stockId:'',
          stockItemInfos:'',
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          changeStatus:'01',
          itemId:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],
        updListData:[],
        prodListData:[],
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          inputDisabled:false,
        },
        sels:[],
        poSels:[],
        type:'updateList/select',
        poId:'',
        noteData:[],
      }
    },
    mounted () {
      this.getauthorityList();
      this.getUpdateData();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/

      getUpdateData:function(){
        this.httpPost(this.type,this.pageFilter).then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.updateList;
            this.page= pageData;
            this.type == 'updateList/select' ? this.updListData = pageData.listData :this.prodListData = pageData.listData;
          }else{
            this.updListData = [];
            this.prodListData = [];
            this.$message(res.data.message);
          }
        })
      },
      selsChange: function (sels) {
        this.type == 'updateList/select' ?  this.sels = sels.map(item =>item.id) : this.poSels = sels.map(item =>item.ecnId);
      },
      handlerItems:function(row,sels){
        var status = this.type == 'updateList/select'? '0' : '1';
        var vm = this;
        var singleData = sels == '' ? {id:[row],status:status} : {id:[],status:status};
        var ids = [];
        var batchData = {}
        var arr = this.type == 'updateList/select' ?  this.sels:this.poSels;
        if(row == '' && arr.length>0){
          arr.forEach(function(item){
            ids.push(item);
          })
          batchData.id = ids;
          batchData.status = status;
        }else{
          batchData = {id:[],status:status};
        }
        var data = sels != '' ? batchData : singleData;
        var idarr = sels != '' ? batchData.id : singleData.id;
        idarr.length < 1 ? this.tips() : this.doItem('你确定已处理完了此笔修改的备货计划','updateList/updateStatus',data,vm.getUpdateData);
      },
      getStockInfo:function(val){
          this.httpPost('stockProductPlan/getStockInfos',{stockId:val,processKey:'stock_plan',nodeId:''}).then(res =>{
            this.infoFormData = res.data;
            this.refId.Selected = this.infoFormData.refId;
            var table = document.getElementById('tableBody');
            var content = table.getElementsByClassName('el-table__body-wrapper')[0];
            content.scrollLeft = 0;
            //this.dialogFlag.infoDetail=true;
          })
      },
      showInfoDialog:function(row){
        this.dialogFlag.dialogTitle = '查看采购订单';
        this.httpPost('/productPurchase/query?poId='+row.poId).then(res =>{
          for(var item of res.data.purchaseNote){
            item.updTime = this.tool.formatDate('','',item.updTime);
          }
          this.noteData = res.data.purchaseNote;
          this.dialogFlag.isOpen = true;
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getUpdateData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getUpdateData();
      },
    }
  }
</script>
<style scoped>
.updSea{
  margin-top:10px;
}
  .formData .el-form-item {
    margin:0 0 0 30px;
  }
  .formData{
    margin:10px 0;
  }
.doSomething{
  cursor: pointer;
  color:rgb(32,160,255)
}
  .info_tit{
    display:flex;
    justify-content:space-between;
  }
  .infoData{
    margin-left:10px;
  }
  .info_tit .title{
    font-size:16px;
    font-weight:bold;
  }
</style>
