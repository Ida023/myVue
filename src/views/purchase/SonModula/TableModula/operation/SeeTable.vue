<template>
  <div>
    <div class="padno item_listBorder">
      <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false" ref="TableData"  @selection-change="selsChange">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column width="90" id="space" label="操作" align="center" >
          <template scope="scope">
            <!--{{ ScreenData.stateName}}-->
            <!--{{ ScreenData.add}}-->
            <el-tooltip content="费用"  effect="dark" placement="bottom" >
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '费用')">&#xe757;</i>
            </el-tooltip>
            <el-tooltip content="日志"  effect="dark" placement="bottom" v-if="ScreenData.add!==true">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '日志')">&#xe602;</i>
            </el-tooltip>
            <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="ScreenData.add!==true">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '查看')">&#xe600;</i>
            </el-tooltip>
            <el-tooltip content="编辑"  effect="dark" placement="bottom" v-show="ScreenData.add!==true && ButtonState===false && ScreenData.stateName!=='待采购' && ScreenData.stateName!=='审核中'">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '编辑')">&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip content="物流"  effect="dark" placement="bottom" v-if="ButtonState===false && ScreenData.stateName==='待采购' && ScreenData.add!==true">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '物流')">&#xe689;</i>
            </el-tooltip>
            <el-tooltip content="销售"  effect="dark" placement="bottom" v-if="ButtonState===false && ScreenData.stateName==='待采购' && ScreenData.add!==true">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '销售')">&#xe6f5;</i>
            </el-tooltip>
            <!--{{ScreenData.add}}-{{ ButtonState===false }}- {{ ScreenData.stateName }}-->
          </template>
        </el-table-column>
        <el-table-column sortable width="120" label="备货子ID　所属备货计划" align="center">
          <template scope="scope">
            <span>{{ scope.row.itemNo }}</span><br/>
            <!--<span class="Astyel">{{ scope.row.stockNo }}</span><br/>-->
            <span >{{ scope.row.stockNo }}</span><br/>
          </template>
        </el-table-column>
        <el-table-column sortable label="图片" align="center"  width="104">
          <template scope="scope">
            <div style="margin-left:0px">
              <img v-if="scope.row.productImage!=null" style="width: 70px; height: 70px;" :src="RmsUrl+scope.row.productImage"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable width="125" label="SKU/MSKU/ASIN/名称" align="center">
          <template scope="scope">
            <span>{{ scope.row.skuNo }}</span><br/>
            <span>{{ scope.row.productName }}</span><br>
            <el-row style="margin-top: 5px">
              <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '商品库存')">&#xe6f6;</i>
              </el-tooltip>
              <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '历史销量')">&#xe61b;</i>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column sortable label="需求数量" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.requestQty" :disabled="dis"  class="tableInput" name="input66" type="number" v-if="scope.row.stateUrl===true"></el-input>
            <span v-if="scope.row.stateUrl===false">{{ scope.row.requestQty }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="预估销售天数" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.requestSalesDays"  :disabled="dis" class="tableInput" name="input66" type="number" v-if="scope.row.stateUrl===true"></el-input>
            <span v-if="scope.row.stateUrl===false"> {{ scope.row.requestSalesDays }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column sortable label="采购仓库" align="center" width="120">-->
          <!--<template scope="scope">-->
            <!--<el-select  placeholder="请选择" v-model="scope.row.startStorehouse" :disabled="dis" clearable filterable class="tableInput" v-if="scope.row.stateUrl===true">-->
              <!--<el-option-->
                <!--v-for="item in WarehouseList2"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value"-->
              <!--&gt;-->
              <!--</el-option>-->
            <!--</el-select>-->
            <!--&lt;!&ndash;<span v-if="scope.row.stateUrl===false">{{ scope.row.startStorehouse }}</span>&ndash;&gt;-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column sortable label="运输方式" align="center" width="120">
          <template scope="scope">
            <el-select  placeholder="请选择" v-model="scope.row.requestTransportType" :disabled="dis" clearable filterable class="tableInput" v-if="scope.row.stateUrl===true">
              <el-option
                v-for="item in transport"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-if="scope.row.stateUrl===false">{{ scope.row.requestTransportType }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="目的仓" align="center" width="120">
          <template scope="scope">
            <el-select  placeholder="请选择" v-model="scope.row.requestWarehouse" :disabled="dis" clearable filterable class="tableInput" v-if="scope.row.stateUrl===true">
              <el-option
                v-for="item in WarehouseList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-if="scope.row.stateUrl===false">{{ scope.row.requestWarehouse }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column sortable label="库存信息" align="center" >-->
          <!--<template scope="scope">-->
            <!--<span>目的仓库存</span><br />-->
            <!--<span>货架数:{{ scope.row.shelvesCount }}</span><br />-->
            <!--<span>可销售:{{ scope.row.canSale }}</span><br />-->
            <!--<span>锁定数:{{ scope.row.slockCount }}</span><br />-->
            <!--<span>目的仓在途</span><br />-->
            <!--<span>海运:{{ scope.row.shippingProductCount }}</span><br />-->
            <!--<span>空运:{{ scope.row.airProductCount }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column sortable label="销售数据" align="center">-->
          <!--<template scope="scope">-->
            <!--<span>7天销量：{{ scope.row.salesCount_Seven }}</span><br />-->
            <!--<span>15天销量：{{ scope.row.salesCount_fifteen }}</span><br />-->
            <!--<span>30天销量：{{ scope.row.salesCount_thirty }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
        <el-table-column sortable label="到货记录" align="center" width="150">
          <template scope="scope">
          <span v-for="(items,index) in scope.row.data">
              <span>{{ items.cgNo }}</span><br />
              <span>{{ items.count }}</span><br />
            </span>
            <!--<el-tooltip content="入库"  effect="dark" placement="bottom" v-show="ButtonState===false && ScreenData.stateName!=='待采购'">-->
              <!--<i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '入库')">&#xe64f;</i>-->
            <!--</el-tooltip>-->
          </template>
        </el-table-column>
        <el-table-column sortable label="操作" align="center" width="50" >
          <template scope="scope">
            <!--<el-tooltip class="item" effect="dark" content="删除" v-if="ScreenData.add==true" >-->
              <!--<i class="iconfontyyy" @click="deleteRow(scope.$index, TableData); RowData(scope.row, '删除')">&#xe6f7;</i>-->
            <!--</el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" v-if="dis!==true" >
              <i class="iconfontyyy" @click="deleteRow(scope.$index, TableData); RowData(scope.row, '删除3')">&#xe6f7;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable label="状态" align="center"  width="80">
          <template scope="scope">
            <span v-if="scope.row.nodeName!==null" v-text="scope.row.nodeName">/</span>
            <span v-if="scope.row.allocationStatus!==null" v-text="'/'+scope.row.allocationStatus">/</span>
            <span v-if="scope.row.salesStatus!==null" v-text="'/'+scope.row.salesStatus">/</span>
            <span v-if="scope.row.purStatus!==null" v-text="'/'+scope.row.purStatus">/</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--备注弹窗-->
    <el-dialog title="添加备注" :visible.sync="RemarksDialog" size="tiny" :close-on-click-modal="false" @open="dilRemarks" >
      <el-input type="textarea" v-model="RemarksData.val"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addRemarks(RemarksState);" :loading="$store.state.loading">保 存</el-button>
          <el-button @click="RemarksDialog = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--查看弹窗-->
    <el-dialog :title="SeeDialog.SeeDialogTitle" :visible.sync="SeeDialog.dis" :size="SeeDialog.SeeDialogSize" :close-on-click-modal="false" @open="dilRemarks" >
      <Journal v-if="RemarksState==='日志'" ref="Journal"></Journal>
      <Remarks v-if="RemarksState==='查看'" ref="Remarks"></Remarks>
      <AllocationStatus v-if="RemarksState==='物流'" ref="AllocationStatus"></AllocationStatus>
      <SalesStatus v-if="RemarksState==='销售'" ref="SalesStatus"></SalesStatus>
      <CostDetails v-if="RemarksState==='入库'" ref="SalesStatus"></CostDetails>
      <span slot="footer" class="dialog-footer">
          <el-button @click="SeeDialog.dis = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--编辑查看小弹窗-->
    <el-dialog :title="editDialog.editDialogTitle" :visible.sync="editDialog.dis" size="small" :close-on-click-modal="false" @open="dilRemarks" >
      <StockingId ref="StockingId"></StockingId>
      <span slot="footer" class="dialog-footer">
          <el-button @click="" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="editDialog.dis = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import Journal from './Journal';
  import Remarks from './Remarks';
  import AllocationStatus from './AllocationStatus';
  import SalesStatus from './SalesStatus';
  import StockingId from './StockingId';
  import CostDetails from './CostDetails';
  export default{
    components:{
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
    props:['ScreenData','SeeTableData','Sonaccounts'],
    data() {
      return {
        TableData:[],
        sels:[],    //批量删除已选的条目数
        GrandsonID:'',//给孙子的 ID，根据具体要什么ID是什么ID，进行填值
        SonScreenData:this.ScreenData, //watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        SonTableListData:this.TableListData,//watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        ButtonState:true,
        transport:[
          {label:'空运',value:'01'},
          {label:'海运',value:'02'}
        ],
        WarehouseList:[],
        WarehouseList2:[],//始发仓
        RemarksDialog:false,
        SeeDialog:{
          dis:false,
          SeeDialogTitle:'',
          SeeDialogSize:'small'
        },
        editDialog:{
          dis:false,
          editDialogTitle:''
        },
        RemarksState:'',
        RemarksData:{
          val:'',
          id:[],
        },
        deleteList:[],
        dis:false,
        stateName:'草稿',
        RowDisabled:true

      }
    },
    mounted(){
      //      this.HandleData();
      this.getListData();
      this.ObjectiveWarehouseData();
    },

    methods:{
      getListData:function (val,dis) {
          this.TableData=val;
          this.dis=dis;
        console.log(this.TableData)
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      selsChange: function (sels) {//批量操作获取SKU
        this.sels = [];
        for(let i=0; i<sels.length;i++){
          this.sels.push(sels[i].Sku);
        }
        console.log(this.sels)
      },
      deletTableData:function () {//父组件关闭时候调用清空数据 一些重置动作
        this.$refs.TableData.clearSelection();
        this.TableData=[];
      },
      RowData:function (row, state) {//小行内 的点击操作：备货子ID
        let _this=this;
        let itemIdArr=[];
        let relaIdArr=[];
        let RowIndexData='';
        console.log(RowIndexData);
        this.RemarksState=state;
        this.RemarksData.id=[];
        this.RemarksData.id.push(RowIndexData.Id);
        console.log(this.RemarksData.id);
        this.SeeDialog.SeeDialogSize='small';
        if(state==='费用'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'费用'})
        }else if(state==='日志'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'日志'})
        }else if(state==='查看'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'查看'})
        }else if(state==='编辑'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'编辑'},row)
        }else if(state==='物流'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'物流'})
        }else if(state==='销售'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'销售'})
        } else if(state==='保存'){
//            alert('草稿保存')
        }else if(state==='删除'){
          this.$emit('SetSeeTableData',this.TableData)
        }else if(state==='删除2'){
          itemIdArr=[];
          relaIdArr=[];
          this.deleteList=[];
          setTimeout(()=>{
            itemIdArr.push(row.itemId);
            relaIdArr.push(row.relaId);
            this.deleteListFn(itemIdArr,relaIdArr);
            this.httpPost('stockProductPlan/deleteStockItemInfos',this.deleteList).then(res=>{
              if(res.data.result===true){
                console.log(res);
                this.$emit('DifferentiatedRequest');
                this.$message('操作成功')
              }else {
                this.$message(res.data.message)
              }
            })
          },20)
        }else if(state==='入库'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'入库'})
        }else if(state==='编辑2'){
          alert('编辑2')
        }else if(state==='保存2'){
          alert('保存2')
        }else if(state==='提交'){
          _this.doItem('您确定提交此备货计划给采购？','productDevInfo/auditCaogao',_this.RemarksData.id,_this.$emit('DifferentiatedRequest'));
        }else if(state==='同意'){
          this.RemarksDialog=true;
        }else if(state==='不同意'){
          this.RemarksDialog=true;
        }else if(state==='回退'){
          _this.doItem('您确定回退此备货计划？（备货计划将重新提交待供应链处理）','productDevInfo/auditCaogao',_this.RemarksData.id,_this.$emit('DifferentiatedRequest'));
        }else if(state==='历史销量'){
          window.open('#/HistoricalSales?Id='+row.stockId);
        }else if(state==='商品库存'){
          window.open('#/commodityStock?Id='+row.stockId);
        }
      },
      addRemarks:function (state) {//添加备注保存
        console.log(this.RemarksData);
        if(this.RemarksState==='同意'){
//          alert('同意提交')
          this.RemarksDialog=false;
        }else if(this.RemarksState==='不同意'){
//          alert('`提交')
          this.RemarksDialog=false;
        }
      },
      dilRemarks:function () {//添加备注清空
        setTimeout(()=>{//神经病 和保存事件走的异步，先后混乱；
          this.RemarksData.val='';
        },10)
      },
      deleteListFn:function (itemId,relaId) {//封数据
//        alert(itemId.length,1111)
        for(let i=0; i<itemId.length; i++){
          for(let k=0; k<relaId.length; k++){
            if(i===k){
              let Obj={itemId:itemId[i], relaId:relaId[k]};
              this.deleteList.push(Obj)
            }
          }
          console.log(this.deleteList)
        }
      },

      combination:function (val) {//条件符合第一阶段返回true 用于按钮切换
        let stateName=this.stateName;
        if(stateName==='草稿' || stateName==='待主管审核'|| stateName==='主管审核不通过'|| stateName==='待供应链处理'|| stateName==='待第三方审核'||
          stateName==='第三方审核不通过'|| stateName==='待提交采购'){
          this.ButtonState=true;
        }else {
          this.ButtonState=false;
        }
      },
      combinationDis:function (val) {//条件符合第一阶段返回true 禁用
        let stateName=this.stateName;
        if(stateName==='草稿'|| stateName==='待第三方审核'){
          this.RowDisabled=false;
        }else {
          this.RowDisabled=true;
        }
      },
      ObjectiveWarehouseData(val){
          if(val!==null && val!==undefined){
            this.httpGet('userAccountWarehouse?shopAccountId='+val,'','Scm').then(res => {
              console.log(res)
              let GetDataList = res.data.params.listWareInfo;+
                console.log(GetDataList)
              setTimeout(()=>{
                this.WarehouseList=this.tool.replaceObjKey(GetDataList,'userWare_Id','ware_Name')
              },20)
              console.log(this.WarehouseList)
            });
          }else {
            this.httpGet('userWareHouseInfo','','Scm').then(res => {
              console.log(res)
              let GetDataList = res.data.params.listWareInfo;+
                console.log(GetDataList)
              setTimeout(()=>{
                this.WarehouseList=this.tool.replaceObjKey(GetDataList,'userWare_Id','ware_Name')
              },20)
              console.log(this.WarehouseList)
            });
          }

        this.httpGet('productMaterial/getCompIdAllWareHouse?type=1','','Scm').then(res => {
          console.log(res)
          let GetDataList = res.data;
          console.log(GetDataList)
          setTimeout(()=>{
            this.WarehouseList2=this.tool.replaceObjKey(GetDataList,'whId','whName')
          },20)
          console.log(this.WarehouseList2)
        });
        this.httpGet('stockProductPlan/getRefTraType').then(res => {
          console.log(res)
          let GetDataList = res.data;
          setTimeout(()=>{
            this.transport=this.tool.replaceObjKey(GetDataList,'refId','refValue')
          },20)
        });
      },
    },
    watch:{
      'ScreenData':{
        handler(val){
          this.SonScreenData=val;
          this.stateName=val.stateName;
          this.combination(val);
          this.combinationDis();
        },
        deep: true,
        immediate: true
      },
      'TableListData':{
        handler(val){
          this.SonTableListData=val;
          this.combination();
          this.combinationDis();
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

</style>
