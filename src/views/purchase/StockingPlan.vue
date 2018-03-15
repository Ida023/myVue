<template>
    <div id="outermost_wrap" class="user_manager_wrap">
      <div id="sub_wrap" class="top-nav">
        <CrumbsNav></CrumbsNav>
      </div>
      <div id="content_wrap" class="content_wrap" style="margin-top: -10px">
        <el-row id="filers" class="supplierFiler">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <div>
                <div class="stateDiv">
                  <span class="span_label">审核阶段</span>
                  <el-radio-group v-model="SelectedStateID" size="small">
                  <span v-for="(items,index) in stateList" :key="index">
                      <el-radio-button  :label="items.nodeName" v-if="ButtonInfo[items.nodeName]!='0'">{{ items.nodeName }}</el-radio-button>
                  </span>
                  </el-radio-group>
                </div>
                <div class="stateDiv">
                  <span class="span_label">采购阶段</span>
                  <el-radio-group v-model="SelectedStateID" size="small" >
                    <!--<el-radio-button  label="待采购">待采购</el-radio-button>-->
                    <el-radio-button  label="审核中" v-if="ButtonInfo['审核中']!='0'">审核中</el-radio-button>
                    <el-radio-button  label="等待入库" v-if="ButtonInfo['等待入库']!='0'">等待入库</el-radio-button>
                    <el-radio-button  label="部分入库" v-if="ButtonInfo['部分入库']!='0'">部分入库</el-radio-button>
                    <el-radio-button  label="完全入库" v-if="ButtonInfo['完全入库']!='0'">完全入库</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="stateDiv">
                  <span class="span_label">调拨阶段</span>
                  <el-radio-group v-model="SelectedStateID" size="small">
                    <el-radio-button  label="待调拨" v-if="ButtonInfo['待调拨']!='0'">待调拨</el-radio-button>
                    <el-radio-button  label="部分调拨" v-if="ButtonInfo['部分调拨']!='0'">部分调拨</el-radio-button>
                    <el-radio-button  label="完全调拨" v-if="ButtonInfo['完全调拨']!='0'">完全调拨</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="stateDiv">
                  <span class="span_label">销售阶段</span>
                  <el-radio-group v-model="SelectedStateID" size="small">
                    <el-radio-button  label="销售中" v-if="ButtonInfo['销售中']!='0'">销售中</el-radio-button>
                    <el-radio-button  label="全部销售" v-if="ButtonInfo['全部销售']!='0'">全部销售</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-row>
        <el-row id="filer" class="supplierFiler">
          <el-collapse v-model="activeNames2">
            <el-collapse-item name="1">
              <div>
                <div class="updSea">
                  <span class="span_label">查看</span>
                  <el-radio-group v-model="condition" size="small">
                    <el-radio-button  label="1"  v-if="ButtonInfo['按备货单号']!='0'">按备货单号</el-radio-button>
                    <el-radio-button  label="2"  v-if="ButtonInfo['按备货子ID']!='0'">按备货子ID</el-radio-button>
                    <el-radio-button  label="3"  v-if="ButtonInfo['按SKU']!='0'">按SKU</el-radio-button>
                    <el-radio-button  label="4"  v-if="ButtonInfo['按供应商']!='0'">按供应商</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="updSea">
                  <el-row>
                    <el-col :span="3" style="margin-top: 6px">
                      <span class="span_label" >查看</span>
                    </el-col>
                    <el-col :span="18" class="inputstyle">
                      <el-input v-model="defaultData.stockNumber" v-show="condition==1" placeholder="请输入备货单编号"></el-input>
                      <el-input v-model="defaultData.stockItemIdNo" v-show="condition==2" placeholder="请输入备货子ID"></el-input>
                      <el-input v-model="defaultData.skockSkuNo" v-show="condition==3" placeholder="请输入SKU"></el-input>
                      <el-input v-model="defaultData.venderName" v-show="condition==4" placeholder="请输入供应商名称"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="DifferentiatedRequest">搜索</el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-row>
        <el-row class="supplier_btn">
          <el-button type="primary" size="small" v-if="ButtonInfo['新增备货']!='0'"  class="el-icon-plus" @click="NewStock">新增备货</el-button>
          <el-button type="primary" size="small" v-if="ButtonInfo['筛选']!='0'"  @click="ScreenDialog=true; addDialogFn();" >筛选</el-button>
        </el-row>

        <div class="smallDia" >
          <el-dialog title="筛选" :visible.sync="ScreenDialog" size="small" :close-on-click-modal="false">
            <div class="data_body">
              <el-row class="row_title row" :getter="20">
                <el-col class="col" :span="4">条件</el-col>
                <el-col class="col" :span="4">比较方式</el-col>
                <el-col class="col" :span="16">输入</el-col>
              </el-row>
              <el-row class="row" v-if="condition==1">
                <el-col class="col" :span="4">备货单号</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <el-input v-model="screenDatas.stockNumber">
                  </el-input>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition==2 ">
                <el-col class="col" :span="4">备货子ID</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <el-input v-model="screenDatas.stockItemIdNo">
                  </el-input>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition==3 || condition==4">
                <el-col class="col" :span="4">SKU</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <el-input v-model="screenDatas.skockSkuNo">
                  </el-input>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition==4">
                <el-col class="col" :span="4">供应商</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <el-input v-model="screenDatas.venderName">
                  </el-input>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition!=3 && condition!=4">
                <el-col class="col" :span="4">备货发起日期</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <el-row class="block">
                    <el-col :span="12">
                      <el-date-picker v-model="defaultData.stockTime1" size="small" editable type="datetime" placeholder="选择开始时间"></el-date-picker>
                    </el-col>
                    <!--<el-col :span="2">
                      <span style="padding:0 10px;">至</span>
                    </el-col>-->
                    <el-col :span="12">
                      <el-date-picker v-model="defaultData.stockTime2" size="small" editable type="datetime" placeholder="选择结束时间"></el-date-picker>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition!=3 && condition!=4">
                <el-col class="col" :span="4">备货类型</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <StockingType @assignment="SonData" :Selected="StockingTypeData" scene="screen"></StockingType>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition==2">
                <el-col class="col" :span="4">备货目的仓</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <ObjectiveWarehouse @assignment="SonData" :Selected="ObjectiveWarehouseData"></ObjectiveWarehouse>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition==2">
                <el-col class="col" :span="4">备货运输方式</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <el-select  placeholder="请选择" v-model="screenDatas.stockTransportType" clearable filterable>
                    <el-option
                      v-for="item in transport"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition!=3 && condition!=4">
                <el-col class="col" :span="4">备货部门</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <getDeptList :select-value="warehouse" :selectValue="selectValue" selectType="screen" :isDisabled="isDisabled" scene="screen" @child-change-Val="SonData"></getDeptList>
                </el-col>
              </el-row>
              <el-row class="row" v-if="condition!=3 && condition!=4">
                <el-col class="col" :span="4" >备货用户</el-col>
                <el-col class="tatestyle" :span="4">
                  是
                </el-col>
                <el-col class="col_input" :span="16">
                  <user @assignment="SonData" :Selected="userData"></user>
                </el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="DeleteScreen(); ScreenDialog=false;">清除条件</el-button>
              <el-button @click="ScreenDialog=false; GiveScreen()">筛 选</el-button>
              <el-button @click="ScreenDialog=false">取 消</el-button>
            </div>
          </el-dialog>
        </div>
        <div id="item_listBorder">
            <div v-if="condition==1">
              <el-row class="supplier_btn" style="margin: 10px 0 10px 0">
                <el-button type="primary" size="small" @click="BatchOperation('草稿','0')" v-if="ScreenData.stateName==='草稿' && ButtonInfo['批量提交']!='0'">批量提交</el-button>
                <el-button type="primary" size="small" @click="BatchOperation('草稿','1')" v-if="ScreenData.stateName==='草稿' && ButtonInfo['批量删除']!='0'">批量删除</el-button>
                <el-button type="primary" size="small" @click="BatchOperation('待主管审核','0')" v-if="ScreenData.stateName==='待主管审核' && ButtonInfo['批量同意']!='0'">批量同意</el-button>
                <el-button type="primary" size="small" @click="BatchOperation('待主管审核','1')" v-if="ScreenData.stateName==='待主管审核' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
                <el-button type="primary" size="small" @click="BatchOperation('待提交采购')" v-if="ScreenData.stateName==='待提交采购' && ButtonInfo['提交采购']!='0'">提交采购</el-button>
                <!--<span v-if="ScreenData.stateName==='待提交采购'">-->
                  <span v-if="ScreenData.stateName==='待提交采购'">装箱共计:<span style="color: red">{{ ScreenData.productVolumes }}</span>m³</span>
                <span style="margin-left: 20px" v-if="ScreenData.stateName==='待提交采购'">
                  <span>重量共计:<span style="color: red">{{ ScreenData.productWeights }}</span>KG</span></span>
              </el-row>
              <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column width="150" id="space" label="操作" align="center" >
                  <template scope="scope">
                    <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="ButtonInfo['查看']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '查看')">&#xe600;</i>
                    </el-tooltip>
                    <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='草稿' && ButtonInfo['编辑']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '编辑')">&#xe6e5;</i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" v-if="ScreenData.stateName==='草稿' && ButtonInfo['删除']!='0'">
                      <i class="iconfontyyy" @click="RowData(scope.row, '删除')">&#xe6f7;</i>
                    </el-tooltip>
                    <el-tooltip content="提交"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='草稿' && ButtonInfo['提交']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '提交')">&#xe63e;</i>
                    </el-tooltip>
                    <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待主管审核' && ButtonInfo['同意']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '同意')">&#xe67e;</i>
                    </el-tooltip>
                    <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待主管审核' && ButtonInfo['不同意']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '不同意')">&#xe665;</i>
                    </el-tooltip>
                    <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' && ButtonInfo['同意']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '同意2')">&#xe67e;</i>
                    </el-tooltip>
                    <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' && ButtonInfo['不同意']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '不同意2')">&#xe665;</i>
                    </el-tooltip>
                    <el-tooltip content="回退"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='第三方审核不通过' && ButtonInfo['回退']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '回退')">&#xe666;</i>
                    </el-tooltip>
                    <el-tooltip content="提交"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待提交采购' && ButtonInfo['提交']!='0'">
                      <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '提交2')">&#xe63e;</i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column sortable label="备货单编号" align="center" prop="stockNo"></el-table-column>
                <el-table-column sortable label="SKU个数" align="center" prop="skuCount"></el-table-column>
                <el-table-column sortable label="备货目的" align="center" prop="stockTypeValue"></el-table-column>
                <el-table-column sortable label="备货部门" align="center" prop="stockDepart"></el-table-column>
                <el-table-column sortable label="备货人" align="center" prop="stockUser"></el-table-column>
                <el-table-column sortable label="状态" align="center">
                  <template scope="scope">
                    <span v-show="scope.row.state!=''">{{ scope.row.state }}</span>
                    <!--<span v-show="scope.row.allocationStatus!=''">{{ scope.row.allocationStatus }}</span><br />-->
                    <!--<span v-show="scope.row.salesStatus!=''">{{ scope.row.salesStatus }}</span><br />-->
                    <!--<span v-show="scope.row.purStatus!=''">{{ scope.row.purStatus }}</span><br />-->
                    <!--<span v-show="scope.row.nodeName!=''">{{ scope.row.nodeName }}</span><br />-->
                  </template>
                </el-table-column>
                <el-table-column sortable label="创建时间" align="center" :formatter="tool.formatDate" prop="addTime"></el-table-column>
              </el-table>
              <!--备注弹窗-->
              <el-dialog title="添加备注" :visible.sync="RemarksDialog" size="tiny" :close-on-click-modal="false" @open="dilRemarks" >
                <el-input type="textarea" v-model="HandleTasks.stockItemNote"></el-input>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addRemarks(RemarksState);" >保 存</el-button>
                  <el-button @click="RemarksDialog = false">取 消</el-button>
                </span>
              </el-dialog>
            </div>
            <div v-if="condition==2">
              <PickingId ref="PickingId" @SonRowData="SonRowData" @SeeDialogFn="SeeDialogFn" @DifferentiatedRequest="DifferentiatedRequest" @ReceiveData="ReceiveData" :ScreenData="ScreenData" :TableListData="TableListData" :condition="condition"></PickingId>
            </div>
            <div v-if="condition==3">
              <PickingSKU ref="PickingSKU" @SonRowData="SonRowData" @SeeDialogFn="SeeDialogFn" @DifferentiatedRequest="DifferentiatedRequest" @ReceiveData="ReceiveData" :ScreenData="ScreenData" :TableListData="TableListData" :condition="condition"></PickingSKU>
            </div>
            <div v-if="condition==4">
              <PickingSupplier ref="PickingSupplier" @SonRowData="SonRowData"  @DifferentiatedRequest="DifferentiatedRequest" :SondefaultData="defaultData" @SeeDialogFn="SeeDialogFn" @firstData="firstData" @ReceiveData="ReceiveData" :ScreenData="ScreenData" :TableListData="TableListData" :condition="condition"></PickingSupplier>
            </div>
        </div>
      </div>
      <!--新增编辑查看弹窗-->
      <el-dialog :title="addDialog.DialogTitle" :visible.sync="addDialog.Dialog" size="large" :close-on-click-modal="false" @close="diladdDialog">
       <div>
         <h4><span class="titlesize" style="margin-top: -20px">基本信息</span></h4>
         <el-row style="margin-bottom: 10px" v-if="addDialog.dis===true">
           <el-col :span="2">备货编号</el-col>
           <el-col :span="16"> <span>{{ rowSeeData.stockNo }}</span></el-col>
         </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="2">备货类型</el-col>
            <el-col :span="16"> <StockingType ref="StockingType" @assignment="SonData" :Selected="StockingTypeData" scene="add"></StockingType></el-col>
          </el-row>
         <el-row style="margin-bottom: 10px">
           <el-col :span="2">部门</el-col>
           <el-col :span="16"><getDeptList :select-value="warehouse" :selectValue="selectValue" selectType="add" :isDisabled="isDisabled" scene="add" @child-change-Val="SonData"></getDeptList></el-col>
         </el-row>
         <el-row style="margin-bottom: 10px" v-if="ifAccounts==='销售FBA备货'">
           <el-col :span="2">帐号</el-col>
           <el-col :span="16"><accounts ref="accounts" @assignment="SonData" :Selected="accountsData"  scene="add"></accounts></el-col>
         </el-row>
       </div>
        <div v-if="addDialog.dis===false">
          <el-row>
            <el-col :span="2">
              <h4><span class="titlesize" style="margin-top: -20px">销售备注</span></h4>
             </el-col>
            <el-col :span="16">
               <el-input type="textarea" :rows="2" placeholder="请输入销售备注" v-model="addStockingData.salesNote"></el-input>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-bottom: 10px" v-if="addDialog.dis===true">
          <el-col :span="2">申请人</el-col>
          <el-col :span="16"> <span>{{ rowSeeData.stockUser }}</span></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px" v-if="addDialog.dis===true">
          <el-col :span="2">申请时间</el-col>
          <el-col :span="16"> <span v-text="tool.formatDate('','',rowSeeData.appTime)"></span></el-col>
        </el-row>
        <div>
          <h4><span class="titlesize">产品信息</span><span v-if="addDialog.dis===true" class="SkuStyle">共{{ rowSeeData.skuCount }}个SKU</span> <span @click="SkuDialogFn" class="SkuStyle" v-if="addDialog.dis===false">添加SKU</span></h4>
          <span></span>
          <SeeTable ref="SeeTable" :accounts= "Sonaccounts" @DifferentiatedRequest="DifferentiatedRequest" @SetSeeTableData="SetSeeTableData" @addSeeTableData="addSeeTableData" @SeeDialogFn="SeeDialogFn" @ReceiveData="ReceiveData" :ScreenData="ScreenData" :SeeTableData="SeeTableData" :condition="condition"></SeeTable>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button :loading="$store.state.loading" type="primary" @click="addStocking('0'); addStockingData.state='保存草稿'" v-if="addDialog.dis===false">保 存</el-button>
           <el-button :loading="$store.state.loading" type="primary" @click="addStocking('1'); addStockingData.state='提交审核'" v-if="addDialog.dis===false">提 交</el-button>
          <el-button @click="addDialog.Dialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!--添加SKU-->
      <el-dialog title="添加货品" :visible.sync="SkuDialog" :close-on-click-modal="false" size="small">
        <s-k-u ref="Sku" @addSeeTableData="addSeeTableData"></s-k-u>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="addSkuFn" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="SkuDialog=false">取 消</el-button>
        </span>
      </el-dialog>
      <!--查看弹窗-->
      <el-dialog :title="SeeDialog.SeeDialogTitle" :visible.sync="SeeDialog.dis" :size="SeeDialog.SeeDialogSize" :close-on-click-modal="false" @open="" >
        <Journal v-if="ifSeeDialog==='日志'" ref="Journal"></Journal>
        <Remarks v-if="ifSeeDialog==='查看'" ref="Remarks"></Remarks>
        <AllocationStatus v-if="ifSeeDialog==='调拨状态'" ref="AllocationStatus"></AllocationStatus>
        <SalesStatus v-if="ifSeeDialog==='销售'" ref="SalesStatus"></SalesStatus>
        <CostDetails v-if="ifSeeDialog==='分配'" ref="CostDetails" @CostDetailsFalse="CostDetailsFalse"></CostDetails>
        <span slot="footer" class="dialog-footer">
          <el-button @click="SeeDialog.dis = false">取 消</el-button>
          <el-button type="primary" @click="CostDetailsFn" v-if="ifSeeDialog==='分配'" :loading="$store.state.loading">确 定</el-button>
        </span>
      </el-dialog>
      <!--编辑查看小弹窗-->
      <el-dialog title="修改备货子计划" :visible.sync="editDialog.dis" size="small" :close-on-click-modal="false" @close="emptyFn" >
        <StockingId ref="StockingId" @editDialogFsale="editDialogFsale"></StockingId>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog.dis = false">取 消</el-button>
           <el-button @click="$refs.StockingId.PostStocking()"  type="primary" :loading="$store.state.loading">确 定</el-button>
        </span>
      </el-dialog>

      <div id="page" class="page">
        <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
      </div>
    </div>
</template>

<script>
  import { department, ObjectiveWarehouse, StockingType, SKU, accounts, user, PickingId, PickingList, PickingSKU, PickingSupplier, GrandsonDemo, SeeTable, getDeptList,
    Journal, Remarks, SalesStatus, CostDetails, StockingId } from 'views/purchase/import_modular';
  export default{
      components:{department, ObjectiveWarehouse, StockingType, user, PickingId, PickingList, PickingSKU, PickingSupplier, GrandsonDemo, SeeTable, getDeptList, accounts, SKU, Remarks, Journal, SalesStatus, CostDetails, StockingId
    },
    data(){
        return {
        	ButtonInfo:{},//按钮权限列表20171227
          TableListData:[],
          stateList:[],
          defaultData: {
            nodeId:'',//节点ID
            purStatus:'',//采购状态
            transfersStatus:'',//调拨状态
            salesStatus:'',//调拨状态
            processKey:'stock_plan',//子主题
            stockNumber:'',//备货单编号
            stockTime1:'',//备货发起日期1
            stockTime2:'',//备货发起日期2
            stockProductType:'',//备货类型
            stockProductWare:'',//备货目的仓
            stockTransportType:'',//备货运输方式
            stockProductDepart:'',//备货部门
            stockProductUser:'',//备货用户
            stockItemIdNo:'',//备货子id
            skockSkuNo:'',//Sku
            venderName:'',//供应商
            venderId:'',
            currentPage:1,//当前页数
            pageSize:10,//页面显示条数
          },
          ScreenData:{
            dis:false,
            stateName:'草稿',
            nodeId:'',
            nodeName:'',
            add:false,
            productWeights:'',//体积
            productVolumes:''//重量共计
          },
          SelectedStateID:'草稿',//状态默认值
          condition:'1',
          activeNames: ['1'],    //  筛选 功能的折叠面板
          activeNames2: ['1'],    //  筛选 功能的折叠面板
          ScreenDialog:false,
          page:{          // 分页参数
            currentPage:0,
            pageSize:10,
            totalCount:10,
            totalPage:1
          },
          screenDatas:{//筛选
            stockNumber:'',//备货单编号
            stockItemIdNo:'',//备货子id
            skockSkuNo:'',//Sku
            venderName:'',//供应商
            stockTransportType:''//运输方式
          },
          transport:[
            {label:'空运',value:'01'},
            {label:'海运',value:'02'}
          ],
          departmentData:{
              dis:false,//是否禁用
              Selected:''//默认值
          },
          StockingTypeData:{
            dis:false,//是否禁用
            Selected:''//默认值
          },
          accountsData:{
            dis:false,//是否禁用
            Selected:'',//默认值
            deptId:''//部门ID
          },
          ObjectiveWarehouseData:{
            dis:false,//是否禁用
            Selected:''//默认值
          },
          userData:{
            dis:false,//是否禁用
            Selected:''//默认值
          },
          RemarksState:'',
          RemarksData:{
            val:'',
            stockId:[],
          },
          DeletePlan:{
            stockId:[],
            nodeId:'',
            processKey:'stock_plan',
          },
          DeleteSonPlan:[
            {
              stockId:'',
              nodeId:'',
              processKey:'stock_plan',
            },
            {
              stockId:'',
              nodeId:'',
              processKey:'stock_plan',
            },
          ],
          TableData:[],
          sels:[],    //批量删除已选的条目数
          batchData:{
            itemId:[],
            relaId:[],
            stockId:[],
          },
          RemarksDialog:false,
          addDialog:{
            Dialog:false,
            dis:false,
            DialogTitle:'11',
          },
          isDisabled:false,
          warehouse:'',
          selectValue:[],
          ifAccounts:'',
          SkuDialog:false,
          SeeTableData:[],
          addStockingData:{//新增
            stockId:'',//备货Id
            stockNo:'',//备货单编号
            processKey:'stock_plan',//
            refId:'',//备货类型id
            deptId:'',//部门id
            stockUserAccountId:'',//账号id
            salesNote:'',//销售备注
            stockItem:[],
            state:''
          },
          StockingPlanData:{
            stockId:'',//备货Id
            processKey:'stock_plan',//
            nodeId:''//节点Id
          },
          HandleTasks:{
            relaId:[],
            state:true,
            processkey:'stock_plan',
            stockItemNote:'',
            nodeId:'',
            nodeName:'',
            stockId:[],
            itemId:'',
          },
          getfirstData:'',
          SeeDialog:{
            dis:false,
            SeeDialogTitle:'',
            SeeDialogSize:'small'
          },
          editDialog:{
            dis:false,
            editDialogTitle:''
          },
          ifSeeDialog:'',
          rowSeeData:'',
          getWeightDatas:{
            nodeId:'',
            processKey:'stock_plan'
          },
          stateName:'草稿',
          Sonaccounts:'', //帐号id 用于请求 目的仓
        }
    },
    watch:{
      'SelectedStateID':{
        handler(val){
          this.ResetState();
          setTimeout(()=>{
            this.HandleStateData();
            this.ScreenData.stateName=val;
            if(this.condition==='4'){
                this.$refs.PickingSupplier.getSkuCount();
            }
            if(val==='待提交采购'){
              this.getWeightData();
            }
            this.DifferentiatedRequest();
          },20)

        }
      },
      'condition':{
        handler(val){
          this.DeleteScreen();
          setTimeout(()=>{
            if(val==='4'){
              this.$refs.PickingSupplier.getSkuCount();
            }
            if(this.SelectedStateID==='待提交采购'){
              this.getWeightData();
            }
            this.DifferentiatedRequest();
          },20)

        }
      },
      'defaultData':{
        handler(val){

        },
        deep: true
      },
      'SeeTableData':{
        handler(val){
//          alert(111)
        },
        deep: true
      },

    },
    computed:{
    },
    mounted(){
      this.getauthorityList();
      this.getStateBtn();
      this.DifferentiatedRequest();
    },
    methods:{
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getStateBtn:function () {
        this.httpGet('stockProductPlan/getAllStockNode?processKey=stock_plan').then(res=>{
          console.log(res.data);
          for(let item in res.data){
            this.stateList=res.data[item];
              console.log(this.stateList)
          }
		  this.defaultData.nodeId=this.stateList[0].nodeId;
        })
      },
      SetSeeTableData:function (val) {
//          alert(val.length)
        this.addStockingData.stockItem=val
      },
      addStocking:function (val) {//新增保存
          if(val==='0'){
              console.log(this.addStockingData)
            this.httpPost('stockProductPlan/postStockInfos',this.addStockingData).then(res=>{
              if(res.data.result===true){
                console.log(res);
                this.addDialog.Dialog=false;
                this.condition='1';
                this.DifferentiatedRequest();
              }else {
                this.$message(res.data.message)
              }
            })
          }else {
            this.httpPost('stockProductPlan/postStockInfos',this.addStockingData).then(res=>{
              if(res.data.result===true){
                console.log(res);
                this.addDialog.Dialog=false;
                this.DifferentiatedRequest();
              }else {
                this.$message(res.data.message)
              }
            })
          }

      },
      addSeeTableData:function (val) {
//          alert(this.SeeTableData.length)
        if(this.SeeTableData.length<1){
          this.SeeTableData=val;
          this.addStockingData.stockItem=val;
          this.$refs.SeeTable.getListData(val)
        }else {
          var _this=this;
          var oldcombinations = val.map(item => item);
          var newcombinations = _this.SeeTableData.map(item => item.productId);
          for(let i=0;i<oldcombinations.length;i++){
            if(newcombinations.indexOf(oldcombinations[i].productId) == -1) {
              _this.SeeTableData.push(oldcombinations[i])
            }else{
              _this.$message('重复添加请手动添加数量！')
            }
            console.log(_this.SeeTableData)
          }
        }
      },
      NewStock:function () {//新增备货
        this.ScreenData.add=true;
        this.addDialog.Dialog=true;
        this.addDialog.dis=false;
        this.addDialog.DialogTitle='新增备货计划';
        this.addStockingData.stockNo='';
        this.addStockingData.stockId='';
        this.addStockingData.stockItem=[];
        this.isDisabled=false;
        this.StockingTypeData.dis=false;
        this.StockingTypeData.Selected='';
        this.accountsData.dis=false;
        this.accountsData.deptId='';
        this.SeeTableData='';
//        this.ScreenData.stateName='新增'
//        this.ScreenData.stateName='草稿'
        console.log(this.addStockingData)
      },
      diladdDialog:function () {//新增编辑打开回调
        this.ScreenData.add=false;
        this.$refs.StockingType.deleteData();
        this.StockingTypeData.Selected='';
        this.addStockingData.salesNote='';
        this.addStockingData.stockId='';
        this.addStockingData.stockItem=[];
        this.selectValue=[];
        this.accountsData.dis=false;
        this.accountsData.Selected='';
        this.accountsData.deptId='';
        this.SeeTableData='';
        this.$refs.SeeTable.deletTableData();
      },
      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.DifferentiatedRequest();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.DifferentiatedRequest();
      },
      ReceiveData:function (val) {
//        alert('儿子给爸爸的值，暂时不用')
      },
      ResetState:function () {
        this.defaultData.purStatus='';
        this.defaultData.transfersStatus='';
        this.defaultData.salesStatus='';
        this.defaultData.nodeId='';
      },
      getWeightData:function () {//体积 重量
        this.getWeightDatas.nodeId=this.defaultData.nodeId;
        this.httpPost('stockProductPlan/getSockPwInfos',this.getWeightDatas).then(res=>{
          this.ScreenData.productWeights=res.data.productWeights;
          this.ScreenData.productVolumes=res.data.productVolumes;
          console.log(res)
        })
      },
      HandleStateData:function () {
          let stateList=this.stateList;
        if(this.SelectedStateID==='草稿' || this.SelectedStateID==='待主管审核'|| this.SelectedStateID==='主管审核不通过'|| this.SelectedStateID==='待供应链处理'|| this.SelectedStateID==='待第三方审核'||
          this.SelectedStateID==='第三方审核不通过'|| this.SelectedStateID==='待提交采购' || this.SelectedStateID==='待采购'){//审核阶段
          for(let i=0; i<stateList.length; i++) {
            if (stateList[i].nodeName === this.SelectedStateID) {
              this.defaultData.nodeId = stateList[i].nodeId;
              this.ScreenData.nodeId=stateList[i].nodeId;
              this.ScreenData.nodeName=stateList[i].nodeName;
            }
          }
        }else if( this.SelectedStateID==='部分入库'|| this.SelectedStateID==='完全入库'|| this.SelectedStateID==='审核中'|| this.SelectedStateID==='等待入库') {//采购阶段
          this.defaultData.purStatus=this.SelectedStateID;
        }else if(this.SelectedStateID==='待调拨' || this.SelectedStateID==='部分调拨'|| this.SelectedStateID==='完全调拨') {//调拨阶段
          this.defaultData.transfersStatus=this.SelectedStateID;
        }else if(this.SelectedStateID==='销售中' || this.SelectedStateID==='全部销售') {//销售阶段
          this.defaultData.salesStatus=this.SelectedStateID;
        }
        if(this.condition!=='4') {
          this.DifferentiatedRequest();
        }
      },
      SonData:function (val) {
        let SonData=val.value;
        let SonSign=val.sign;
        let SonScene=val.scene;
        if(SonSign==='getDeptList'){//部门
          if(SonScene==='add'){
            console.log(SonData);
            this.addStockingData.deptId=SonData;
            this.accountsData.deptId=SonData;
            this.addStockingData.stockUserAccountId='';
            if(this.ifAccounts==='销售FBA备货'){
              setTimeout(()=>{
                this.$refs.accounts.getData(SonData);
              },20)
            }
            this.$refs.SeeTable.ObjectiveWarehouseData()
          }else {
            this.defaultData.stockProductDepart=SonData;
//            this.selectValue=SonData;
          }

        }else if(SonSign==='ObjectiveWarehouse'){
          this.defaultData.stockProductWare=SonData;
          this.ObjectiveWarehouseData.Selected=SonData;
        }else if(SonSign==='StockingType'){
          if(SonScene==='add'){
            this.ifAccounts=val.label;
            this.addStockingData.refId=SonData;
            this.$refs.SeeTable.ObjectiveWarehouseData()
          }else {
            this.defaultData.stockTransportType=SonData;
            this.StockingTypeData.Selected=SonData;
          }

        }else if(SonSign==='accounts'){
          this.addStockingData.stockUserAccountId=SonData;
          this.Sonaccounts = SonData
          this.$refs.SeeTable.ObjectiveWarehouseData(SonData)
        }else if(SonSign==='user'){
          this.defaultData.stockProductUser=SonData;
          this.userData.Selected=SonData;
        }
      },
      addDialogFn:function () {
        this.screenDatas.stockNumber=this.defaultData.stockNumber;
        this.screenDatas.stockItemIdNo=this.defaultData.stockItemIdNo;
        this.screenDatas.skockSkuNo=this.defaultData.skockSkuNo;
        this.screenDatas.venderName=this.defaultData.venderName;
//        this.screenDatas.venderId=this.defaultData.venderId;
      },
      GiveScreen:function () {
        this.defaultData.stockNumber=this.screenDatas.stockNumber;
        this.defaultData.stockItemIdNo=this.screenDatas.stockItemIdNo;
        this.defaultData.skockSkuNo=this.screenDatas.skockSkuNo;
        this.defaultData.venderName=this.screenDatas.venderName;
        this.defaultData.stockTransportType=this.screenDatas.stockTransportType;

//        this.defaultData.venderId=this.screenDatas.venderId;
        this.DifferentiatedRequest();
      },
      DeleteScreen:function () {
//          alert(22)
        this.screenDatas.stockNumber='';
        this.screenDatas.stockItemIdNo='';
        this.screenDatas.skockSkuNo='';
        this.screenDatas.stockTransportType='';
        this.screenDatas.venderName='';
        this.defaultData.stockTime1='';
        this.defaultData.stockTime2='';
        this.defaultData.stockProductType='';
        this.defaultData.stockProductWare='';
        this.defaultData.stockTransportType='';
        this.defaultData.stockProductDepart='';
        this.defaultData.stockProductUser='';
        this.defaultData.venderName='';
        this.defaultData.venderId='';
        this.screenDatas.stockNumber=this.defaultData.stockNumber;
        this.screenDatas.stockItemIdNo=this.defaultData.stockItemIdNo;
        this.screenDatas.skockSkuNo=this.defaultData.skockSkuNo;
        this.screenDatas.venderName=this.defaultData.venderName;
        this.StockingTypeData.Selected='';
        this.accountsData.deptId='';
        this.selectValue=[];
        this.userData.Selected='';
        this.GiveScreen();
        if(this.condition!=='4'){
          this.DifferentiatedRequest();
        }

      },
//      备货单号
      GetListObj:function () {//      备货单号
        console.log('备货单号')
        console.log(999999)
        this.httpPost('stockProductPlan/getInfosByBHNo',this.defaultData).then(res=>{
          console.log(res)
          this.TableData=res.data.listData;
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
          this.ScreenData.productWeights='';
          this.ScreenData.productVolumes='';
          for(let i=0; i<res.data.listData.length; i++){

          }
        })
      },
      getStockingId:function () {//备货ID
        console.log('备货ID')
        this.httpPost('stockProductPlan/getInfoByItem',this.defaultData).then(res=>{
          this.TableListData=res.data.listData;
          this.$refs.PickingId.getListData(res.data.listData)
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        })
      },
      getSkuList:function () {//SKU
        console.log('SKU')
        this.httpPost('stockProductPlan/getInfoBySku',this.defaultData).then(res=>{
          this.TableListData=res.data.listData;
          this.$refs.PickingSKU.getListData(res.data.listData);
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        })
      },
      getPickingSupplier:function () {//供应商
//        alert(this.defaultData.venderId)
        this.httpPost('stockProductPlan/getInfoBySku',this.defaultData).then(res=>{
          this.TableListData=res.data.listData;
          this.$refs.PickingSupplier.getListData(res.data.listData);
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        })
      },
      firstData:function (val) {//子组件给的供应商ID
        this.defaultData.venderId=val;
//        alert(this.defaultData.venderId)
        this.DifferentiatedRequest();
        //        if(this.condition==='4'){
//          this.$refs.PickingSupplier.getSkuCount();
//        }
      },

      DifferentiatedRequest:function () {
        if(this.SelectedStateID==='待提交采购'){
          this.getWeightData();
        }
        switch(this.condition){
          case '1':
              this.GetListObj();
            break;
          case '2':
            this.getStockingId();
            break;
          case '3':
           this.getSkuList();
            break;
          case '4':
              setTimeout(()=>{
                this.getPickingSupplier();
              },200);
            break;
        }
      },
      SeeDialogFn:function (val,RowIndexData) {
        this.ifSeeDialog=val.state;
        console.log(val)
        switch(val.state){
          case '日志':
            this.SeeDialog.SeeDialogTitle='备货子ID 日志';
            this.SeeDialog.dis=true;
              setTimeout(()=>{
                this.$refs.Journal.getList(val.itemId);
              },20)
            break;
          case '查看':
            this.SeeDialog.dis=true;
            this.SeeDialog.SeeDialogTitle='备注';
            setTimeout(()=>{
              this.$refs.Remarks.getList(val.itemId);
            },20)
            break;
          case '编辑':
            this.editDialog.dis=true;
            setTimeout(()=>{
              this.$refs.StockingId.getList(RowIndexData,this.defaultData.nodeId);
            },20)
            break;
          case '物流':
            this.SeeDialog.SeeDialogTitle='调拨状态';
            this.SeeDialog.dis=true;
            setTimeout(()=>{
              this.$message('待开发')
            },20)
            break;
          case '销售':
            this.SeeDialog.SeeDialogTitle='销售状态';
            this.SeeDialog.dis=true;
            setTimeout(()=>{
              this.$message('待开发')
            },20)
            break;
          case '费用':
            this.SeeDialog.SeeDialogTitle='费用';
            setTimeout(()=>{
              this.$message('待开发')
            },20)
            break;
          case '分配':
            this.SeeDialog.SeeDialogTitle='分配详情';
            this.SeeDialog.dis=true;
            setTimeout(()=>{
              this.$refs.CostDetails.getList(RowIndexData)
            },20)
            break;
        }
      },
      addSkuFn:function () {//添加商品 添加SKU 确定按钮
        this.SkuDialog=false;
        this.$refs.Sku.addSku()
      },
      SkuDialogFn:function () {//添加商品 添加SKU 打开
        this.SkuDialog=true;
        setTimeout(()=>{
          this.$refs.Sku.deleteSku(this.addStockingData.stockUserAccountId)
        },20)

      },
      RowData:function (row, state) {
        let _this=this;
        _this.DeletePlan.stockId=[];
        this.HandleTasks.stockId=[];
        this.HandleTasks.nodeId=this.defaultData.nodeId;
        this.HandleTasks.stockId.push(row.stockId);
        this.HandleTasks.nodeName=this.SelectedStateID;
        this.HandleTasks.stockItemNote=this.RemarksData.val;
        console.log(this.HandleTasks)
        if(state==='查看'){
          this.HandleTasks.stockId=[];
          row.stateUrl=false;
          this.addDialog.Dialog=true;
          this.StockingTypeData.dis=true;
          this.isDisabled=true;
          this.addDialog.DialogTitle='查看备货计划';
          this.addDialog.dis=true;
          this.StockingPlanData.nodeId=this.defaultData.nodeId;
          this.StockingPlanData.stockId=row.stockId;
          this.ScreenData.dis=true;
          this.httpPost('stockProductPlan/getStockInfos',this.StockingPlanData).then(res=>{
            let val = res.data.stockItemInfos;
            this.rowSeeData=res.data;
            this.selectValue=res.data.deptId;
            this.addStockingData.salesNote=res.data.salesNote;
            this.addStockingData.stockItem=res.data.stockItemInfos;
            this.StockingTypeData.Selected=res.data.refId;
            this.accountsData.deptId=res.data.stockUserAccountId;
            this.$refs.SeeTable.getListData(val,true);
//            this.$refs.department.SelectedData(val);
          })
        }else if(state==='编辑'){
          this.addDialog.Dialog=true;
          this.addDialog.DialogTitle='编辑备货计划';
          this.addDialog.dis=false;
          this.isDisabled=false;
          this.StockingTypeData.dis=false;
          this.accountsData.dis=false;
          this.StockingPlanData.nodeId=this.defaultData.nodeId;
          this.StockingPlanData.stockId=row.stockId;
          this.ScreenData.dis=false;
          this.httpPost('stockProductPlan/getStockInfos',this.StockingPlanData).then(res=>{
            let val = res.data.stockItemInfos;
            this.selectValue=res.data.deptId;
            this.SeeTableData=res.data.stockItemInfos;
            this.addStockingData.stockItem=res.data.stockItemInfos;
            this.addStockingData.salesNote=res.data.salesNote;
            this.addStockingData.stockId=res.data.stockId;
            this.addStockingData.stockNo=res.data.stockNo;
            this.StockingTypeData.Selected=res.data.refId;
            this.accountsData.deptId=res.data.stockUserAccountId;
//            alert(res.data.stockNo)
            this.$refs.SeeTable.getListData(val,false);
//            this.$refs.department.SelectedData(val);
          })
        }else if(state==='删除'){
          _this.DeletePlan.stockId.push(row.stockId);
          _this.DeletePlan.nodeId=_this.defaultData.nodeId;
          _this.doItem('您确定删除此备货计划？','stockProductPlan/deleteStockInfos',_this.DeletePlan,_this.DifferentiatedRequest);
        }else if(state==='提交'){
          this.HandleTasks.state=true;
          _this.doItem('您确定提交此备货计划给主管审核？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
        }else if(state==='同意'){
          this.HandleTasks.state=true;
          _this.doItem('您确定同意此备货计划？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
        }else if(state==='不同意'){
          this.HandleTasks.state=false;
          _this.doItem('您确定不同意此备货计划？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
        }else if(state==='同意2'){
          this.RemarksState='同意';
          this.RemarksDialog=true;
          this.HandleTasks.state=true;
        }else if(state==='不同意2'){
          this.RemarksState='不同意';
          this.RemarksDialog=true;
          this.HandleTasks.state=false;
        }else if(state==='回退'){
          this.HandleTasks.state=false;
          _this.doItem('您确定回退此备货计划？（备货计划将重新提交待供应链处理）','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
        }else if(state==='提交2'){
          this.HandleTasks.state=true;
          _this.doItem('您确定提交此备货计划给采购？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
        }
      },
      selsChange: function (sels) {//批量操作获取SKU
        this.sels = [];
        this.batchData.stockId=[];
        this.batchData.relaId=[];
        this.batchData.itemId='';
        for(let i=0; i<sels.length;i++){
            if(sels[i].relaId){
              this.batchData.relaIdpush(sels[i].relaId)
            }else if(sels[i].stockId){
              this.batchData.stockId.push(sels[i].stockId)
            }
        }
        console.log(this.batchData)
      },
      HandleBatchData:function (itemId,stockId,relaId) {
        if(itemId.length<1){

        }else if(stockId.length<1){

        }else if(relaId.length<1){

        }
      },
      SonRowData:function (val) {
          console.log(val)
        this.HandleTasks.stockId=[];
//        val.stateUrl=false;
        this.addDialog.Dialog=true;
        this.StockingTypeData.dis=true;
        this.isDisabled=true;
        this.addDialog.DialogTitle='查看备货计划';
        this.addDialog.dis=true;
        this.accountsData.dis=true;
        this.StockingPlanData.nodeId=this.defaultData.nodeId;
        this.StockingPlanData.stockId=val.stockId;
        this.ScreenData.dis=true;
        this.httpPost('stockProductPlan/getStockInfos',this.StockingPlanData).then(res=>{
          let val = res.data.stockItemInfos;
          this.rowSeeData=res.data;
          this.selectValue=res.data.deptId;
          this.addStockingData.salesNote=res.data.salesNote;
          this.addStockingData.stockItem=res.data.stockItemInfos;
          this.StockingTypeData.Selected=res.data.refId;
          this.accountsData.deptId=res.data.stockUserAccountId;
          this.$refs.SeeTable.getListData(val,true);
        })

      },
      BatchOperation:function (val,state) {//批量操作，状态区分做操作。
        let _this=this;
        let batchData=this.batchData;
        _this.HandleTasks.stockId=batchData.stockId;
        _this.HandleTasks.relaId=batchData.relaId;
        _this.HandleTasks.nodeName=_this.SelectedStateID;
        _this.HandleTasks.nodeId=_this.defaultData.nodeId;
        if(_this.batchData.stockId.length<1 && _this.batchData.itemId.length<1 && _this.batchData.relaId.length<1){
          _this.tips();
        }else{
          let msg,isPirates;
          console.log('批量提交的Sku长度',_this.sels.length);
          if(val==='草稿'){
            if(state==='0'){
              _this.HandleTasks.state=true;
              _this.doItem('您确定提交此备货计划给主管审核？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
            }else if (state==='1'){
              _this.HandleTasks.state=false;
              _this.DeletePlan.stockId=this.batchData.stockId;
              _this.DeletePlan.nodeId=_this.defaultData.nodeId;
              _this.doItem('您确定删除此备货计划？','stockProductPlan/deleteStockInfos',_this.DeletePlan,_this.DifferentiatedRequest);
            }
          }else if(val==='待主管审核'){
            if(state==='0'){
              _this.HandleTasks.state=true;
              _this.doItem('您确定同意此备货计划？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
            }else if (state==='1'){
              _this.HandleTasks.state=false;
              _this.doItem('您确定不同意此备货计划？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
            }
          }else if(val==='待提交采购'){
            _this.HandleTasks.state=true;
            _this.doItem('您确定提交此备货计划给采购？','stockProductPlan/pacthStockState',_this.HandleTasks,_this.DifferentiatedRequest);
          }
        }
      },
      addRemarks:function (state) {//添加备注保存
        console.log(this.RemarksData);
        let _this=this;
        if(this.RemarksState==='同意'){
//          alert('同意提交')
          this.httpPost('stockProductPlan/pacthStockState',_this.HandleTasks).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.DifferentiatedRequest();
            }else {
              this.$message(res.data.message)
            }
          })
        }else if(this.RemarksState==='不同意'){
//          alert('不同意提交')
          this.httpPost('stockProductPlan/pacthStockState',_this.HandleTasks).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.DifferentiatedRequest();
            }else {
              this.$message(res.data.message)
            }
          })
        }
      },
      editDialogFsale:function () {
        this.editDialog.dis = false
        this.DifferentiatedRequest();
      },
      dilRemarks:function () {//添加备注清空
        setTimeout(()=>{//神经病 和保存事件走的异步，先后混乱；
          this.HandleTasks.stockItemNote='';
        },10)
      },
      emptyFn:function () {
        this.$refs.StockingId.SonemptyFn();
      },
      CostDetailsFn:function () {
        this.$refs.CostDetails.PostData();
      },
      CostDetailsFalse:function () {
        this.SeeDialog.dis = false;
        this.DifferentiatedRequest();
      },
      combination:function (val) {//符合第一阶段返回true
        let stateName=this.stateName;
        if(stateName==='草稿' || stateName==='待主管审核'|| stateName==='主管审核不通过'|| stateName==='待供应链处理'|| stateName==='待第三方审核'||
          stateName==='第三方审核不通过'|| stateName==='待提交采购' ){
          this.ButtonState=true;
        }else {
          this.ButtonState=false;
        }
      },
      ScreenLogic:function () {
//        if(this.defaultData.stockNumber!==''){
        if(this.condition==='1'){
          this.defaultData.stockItemIdNo='';
          this.defaultData.skockSkuNo='';
          this.defaultData.venderName='';
          this.defaultData.stockProductWare='';
          this.defaultData.stockTransportType='';
        }
//        else if(this.defaultData.stockItemId!=='') {
        else if(this.condition==='2') {
          this.defaultData.stockNumber='';
          this.defaultData.skockSkuNo='';
          this.defaultData.venderName='';
        }
//        else if(this.defaultData.skockSkuNo!=='') {
        else if(this.condition==='3') {
          this.defaultData.stockNumber='';
          this.defaultData.stockNumber='';
          this.defaultData.venderName='';
          this.defaultData.stockProductWare='';
          this.defaultData.stockTransportType='';
        }
//        else if(this.defaultData.venderName!=='') {
        else if(this.condition==='4') {
          this.defaultData.stockNumber='';
          this.defaultData.stockNumber='';
          this.defaultData.skockSkuNo='';
          this.defaultData.stockProductWare='';
          this.defaultData.stockTransportType='';
        }
      },//暂时不用
    }
  }

</script>

<style scoped>
  .updSea{
    margin-bottom: 10px;
  }
  .research_btn{
    padding:9px 12px;
    margin-left: 20px;
  }
  .span_label{
    margin-right: 20px;
  }
  .inputstyle{
    padding-left: 4px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .tatestyle{
    display: block;
    line-height: 41px;
    /*text-align: center;*/
    padding-left: 20px;
    min-height: 41px;
    border-right: 1px solid #e4e4e4
  }
.stateDiv{
  margin-bottom: 5px;
}
  .SkuStyle{
    color: #20a0ff;
    margin-left: 20px;
  }
  .SkuStyle:hover{
    cursor: pointer;
  }
</style>
