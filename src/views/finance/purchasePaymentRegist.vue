<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler" style="margin-top: -10px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <span class="span_label">类型</span>
              <el-radio-group v-model="pageType" @change="getData" size="small">
                <el-radio-button  label="1"     v-if="ButtonInfo['样品采购']!='0'">样品采购</el-radio-button>
                <el-radio-button  label="2"     v-if="ButtonInfo['成品采购']!='0'">成品采购</el-radio-button>
                <el-radio-button  label="3"     v-if="ButtonInfo['物料采购']!='0'">物料采购</el-radio-button>
              </el-radio-group><br/>
              <div class="mt-10">
                <span class="span_label" >状态</span>
                <el-radio-group v-model="stateType" @change="filterData" size="small">
                  <el-radio-button v-for="item in sampleOptions" :label="item.value" :key="item.value" v-show="pageType==1"     v-if="ButtonInfo['样品采购'+item.label]!='0'">{{item.label}}</el-radio-button>
                  <el-radio-button  v-for="(item,index) in nodeList" :key="item.value" :label="item.value" v-show="pageType==2"     v-if="ButtonInfo['成品采购'+item.label]!='0'">{{item.label}}</el-radio-button>
                  <el-radio-button v-for="item in materialOptions" :label="item.value" :key="item.value" v-show="pageType==3"     v-if="ButtonInfo['物料采购'+item.label]!='0'">{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" @click="dialogFlag.isOpen=true;">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button type="primary" size="small" v-if="stateType == 2 && pageType == 1 && ButtonInfo['样品采购/批量同意']!='0'" @click="updateStatus('sels','','4','确定批量同意此申请？')">批量同意</el-button>
        <el-button type="primary" size="small" v-if="stateType == 2 && pageType == 1 && ButtonInfo['样品采购/批量不同意']!='0'" @click="updateStatus('sels','','3','确定批量不同意此申请？')">批量不同意</el-button>
        <el-button type="primary" size="small" v-if="stateType == 3 && pageType == 1 && ButtonInfo['样品采购/批量回退']!='0'" @click="updateStatus('sels','','2','确定批量回退此申请？')">批量回退</el-button>

        <el-button type="primary" size="small" v-if="stateType == 2 && pageType == 3 && ButtonInfo['成品采购/批量同意']!='0'" @click="updateStatus('sels','','04','确定批量同意此申请？')">批量同意</el-button>
        <el-button type="primary" size="small" v-if="stateType == 2 && pageType == 3 && ButtonInfo['成品采购/批量不同意']!='0'" @click="updateStatus('sels','','03','确定批量不同意此申请？')">批量不同意</el-button>
        <el-button type="primary" size="small" v-if="stateType == 3 && pageType == 3 && ButtonInfo['成品采购/批量不同意']!='0'" @click="updateStatus('sels','','02','确定批量回退此申请？')">批量不同意</el-button>

        <el-button type="primary" size="small" v-if="stateType == 'T02' && pageType == 2 && ButtonInfo['物料采购/批量同意']!='0'" @click="updatePurchaseStatus('sels2','','T04','1','您确定批量同意此申请？')">批量同意</el-button>
        <el-button type="primary" size="small" v-if="stateType == 'T02' && pageType == 2 && ButtonInfo['物料采购/批量不同意']!='0'" @click="updatePurchaseStatus('sels2','','T03','0','您确定批量不同意此申请？')">批量不同意</el-button>
        <el-button type="primary" size="small" v-if="stateType == 'T03' && pageType == 2 && ButtonInfo['物料采购/批量回退']!='0'" @click="updatePurchaseStatus('sels2','','T02','1','您确定批量回退此申请？')">批量回退</el-button>
        <el-button type="primary" size="small" v-if="stateType == 'T06' && ButtonInfo['成品采购/批量核销']!='0'" @click="updatePurchaseStatus('sels2','','T07','1','您确定批量核销此申请？')">批量核销</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="samplePurchaseData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange1" v-show="pageType=='1'">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['样品采购/查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="'审核通过'" placement="top-start" v-if="scope.row.state == '2' && ButtonInfo['样品采购/审核通过']!='0'">
                <i class="iconfontyyy" @click="updateStatus('',scope.row,'4','确定通过申请？')">&#xe63d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="scope.row.state == '2' && ButtonInfo['样品采购/审核不通过']!='0'">
                <i class="iconfontyyy" @click="updateStatus('',scope.row,'3','确定不通过申请？')">&#xe619;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="退回" placement="top-start" v-if="scope.row.state == '3' && ButtonInfo['样品采购/退回']!='0'">
                <i class="iconfontyyy" @click="updateStatus('',scope.row,'2','确定退回申请？')">&#xe666;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="登记付款" placement="top-start" v-if="scope.row.state == '4' && ButtonInfo['样品采购/登记付款']!='0'">
                <i class="iconfontyyy"  @click="showPayInfoHistory(scope.row);dialogFlag.payDialog=true;dialogFlag.dialogTitle='登记付款'">&#xe757;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="样品采购单编号" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="生成时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="开发人"  align="center"></el-table-column>
          <el-table-column sortable prop="poUse" label="用途"   align="center"></el-table-column>
          <el-table-column sortable prop="totalamount" label="费用" align="center">
            <template scope="scope">
              {{tool.formatMoney(scope.row.totalamount)}}
            </template>
          </el-table-column>
          <el-table-column sortable prop="currencyId" label="币种"  align="center"></el-table-column>
          <el-table-column sortable prop="vendorName" label="收款单位"  align="center"></el-table-column>
          <el-table-column sortable prop="memo" label="备注"  align="center"></el-table-column>
        </el-table>
        <el-table :data="purchaseData" border tooltip-effect="dark" style="width: 100%"  @selection-change="selsChange2" v-show="pageType=='2'" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['成品采购/查看']!='0'">
                <i class="iconfontyyy" @click="showPurchaseDialog(scope.row);poId=scope.row.poId" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核通过" placement="top-start" v-if="scope.row.nodeName == '已申请待审批' && ButtonInfo['成品采购/审核通过']!='0'">
                <i class="iconfontyyy" @click="updatePurchaseStatus('',scope.row,'T04','1','您确定同意此申请？')">&#xe63d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="scope.row.nodeName == '已申请待审批' && ButtonInfo['成品采购/审核不通过']!='0'">
                <i class="iconfontyyy" @click="updatePurchaseStatus('',scope.row,'T03','0','您确定不同意此申请？')">&#xe619;</i>
              </el-tooltip>
              <el-tooltip content="打印物品清单"  effect="dark" placement="bottom" v-if="ButtonInfo['成品采购/打印物品清单']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="tool.goToPage('productsDetailedList?poId='+scope.row.poId)">&#xe638;</i>
              </el-tooltip>
              <el-tooltip content="打印合同"  effect="dark" placement="bottom" v-if="ButtonInfo['成品采购/打印合同']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="tool.goToPage('purchaseContract?poId='+scope.row.poId)">&#xe638;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="登记付款" placement="top-start" v-if="(scope.row.nodeName == '审批通过未登记'||scope.row.nodeName == '未核销'||scope.row.nodeName == '待核销') && ButtonInfo['成品采购/登记付款']!='0'">
                <i class="iconfontyyy"  @click="showPayInfoHistory(scope.row,0);dialogFlag.payDialog=true;dialogFlag.dialogTitle='登记付款'">&#xe757;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="登记退款" placement="top-start" v-if="(scope.row.nodeName == '未核销'||scope.row.nodeName == '待核销')  && ButtonInfo['成品采购/登记退款']!='0'">
                <i class="iconfontyyy"  @click="showPayInfoHistory(scope.row,1);dialogFlag.payDialog=true;dialogFlag.dialogTitle='登记退款'">&#xe690;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="退回" placement="top-start" v-if="scope.row.nodeName == '审批不通过' && ButtonInfo['成品采购/退回']!='0'">
                <i class="iconfontyyy" @click="updatePurchaseStatus('',scope.row,'T02','1','您确定确定退回此申请？')">&#xe666;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="核销" placement="top-start" v-if="scope.row.nodeName == '待核销' && ButtonInfo['成品采购/核销']!='0'">
                <i class="iconfontyyy"  @click="updatePurchaseStatus('',scope.row,'T07','1','您确定核销此申请？')">&#xe63d;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="采购单编号"    prop="poNo" align="center"  sortable  ></el-table-column>
          <el-table-column label="采购员"  prop="poUserName" align="center"  sortable ></el-table-column>
          <el-table-column label="创建时间" prop="addTime"  :formatter="tool.formatDate" align="center" width="180px" sortable ></el-table-column>
          <el-table-column label="供应商"  prop="vendorName"  sortable align="center"></el-table-column>
          <el-table-column label="货款小计"  align="center"  prop="totalAmount" sortable >
            <template scope="scope">
              {{tool.formatMoney(scope.row.totalAmount)}}
            </template>
          </el-table-column>

          <el-table-column label="其他费用"  align="center"  prop="otherExpenses" sortable >
            <template scope="scope">
              {{tool.formatMoney(scope.row.otherExpenses)}}
            </template>
          </el-table-column>

          <el-table-column label="抵扣" align="center"  prop="deductionCost"  sortable >
            <template scope="scope">
              {{tool.formatMoney(scope.row.deductionCost)}}
            </template>
          </el-table-column>

          <el-table-column label="货款总计" align="center"   prop="allAmount"  sortable >
            <template scope="scope">
              {{tool.formatMoney(scope.row.allAmount)}}
            </template>
          </el-table-column>

          <el-table-column label="交货仓库" align="center" prop="poWarehouse"  sortable ></el-table-column>
          <el-table-column label="审核状态" align="center" prop="nodeName"  sortable ></el-table-column>
          <el-table-column label="付款状态" align="center" prop="paymentStatus"  sortable ></el-table-column>
          <el-table-column label="到货状态" align="center" prop="warehouseStatus"  sortable ></el-table-column>
        </el-table>
        <el-table :data="materialData" border tooltip-effect="dark" style="width: 100%" @selection-change="selsChange3" v-show="pageType=='3'" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['物料采购/查看']!='0'">
                <i class="iconfontyyy" @click="showMaterialInfo(scope.row);" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核通过" placement="top-start" v-if="scope.row.state == '02' && ButtonInfo['物料采购/审核通过']!='0'">
                <i class="iconfontyyy" @click="updateStatus('',scope.row,'04','确定通过申请？')">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="scope.row.state == '02' && ButtonInfo['物料采购/审核不通过']!='0'">
                <i class="iconfontyyy" @click="updateStatus('',scope.row,'03','确定不通过此申请？')">&#xe665;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="退回" placement="top-start" v-if="scope.row.state == '03' && ButtonInfo['物料采购/退回']!='0'">
              <i class="iconfontyyy" @click="updateStatus('',scope.row,'02','确定退回此申请？')">&#xe619;</i>
            </el-tooltip>
              <el-tooltip class="item" effect="dark" content="登记付款" placement="top-start" v-if="scope.row.state == '04' && ButtonInfo['物料采购/登记付款']!='0'">
                <i class="iconfontyyy"  @click="showPayInfoHistory(scope.row,0);dialogFlag.payDialog=true;dialogFlag.dialogTitle='登记付款'">&#xe757;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="物料采购单编号" align="center"></el-table-column>
          <el-table-column sortable prop="poUse" label="用途" align="center"></el-table-column>
          <el-table-column sortable prop="qty" label="种数"  align="center"></el-table-column>
          <el-table-column sortable prop="totalQty" label="数量" align="center"></el-table-column>
          <el-table-column sortable prop="reqWh" label="申请仓库"  align="center"></el-table-column>
          <el-table-column sortable prop="totalAmount" label="费用"   align="center">
            <template scope="scope">
              {{tool.formatMoney(scope.row.totalAmount)}}
            </template>
          </el-table-column>
          <el-table-column sortable prop="reqUser" label="申请人"   align="center"></el-table-column>
          <el-table-column sortable prop="reqTime" label="申请时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="notes" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------查看 样品采购单 弹出框--------------------------->
      <el-dialog title="查看样品采购单" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" >
        <el-tabs v-model="activeTab" >
          <el-tab-pane label="供应商" name='0'>
            <el-form :model="poSamplesModel" :label-width="labelPosition" >
              <el-form-item label="用途："  prop="poUse"  >{{poSamplesModel.poUse}}</el-form-item>
              <el-form-item label="供应商："  prop="vendorName"  >{{poSamplesModel.vendorName}}</el-form-item>
              <el-form-item label="收款人/单位："  prop="proceedsUnit">{{poSamplesModel.proceedsUnit}}</el-form-item>
              <el-form-item label="收款账号："  prop="vendorBankno" >{{poSamplesModel.vendorBankNo}}</el-form-item>
              <el-form-item label="采购链接："  prop="poUrl" >{{poSamplesModel.poUrl}}</el-form-item>
              <el-form-item label="备注："  prop="memo" >{{poSamplesModel.memo}}</el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="产品" name='1'>
            <section class="productInfo">
              <div class="product_tit">
                <span class="title">产品信息</span>
              </div>
              <div class="table_padding">
                <el-table :data="poSamplesItemList" border tooltip-effect="dark" style="width: 100%" >
                  <el-table-column sortable label="物品名称" prop="productName" align="center" ></el-table-column>
                  <el-table-column sortable label="物品单价" prop="price" align="center" ></el-table-column>
                  <el-table-column sortable label="数量" prop="qty" align="center" ></el-table-column>
                  <el-table-column sortable label="备注" prop="memo" align="center" ></el-table-column>
                </el-table>
              </div>
            </section>
            <section class="priceInfo">
              <div class="price_tit"><span class="title">费用信息</span></div>
              <el-form :model="poSamplesChargesModel" ref="poSamplesChargesModel" class="priceData" >
                <el-form-item  label="产品个数：" prop="chargesCount">
                  {{poSamplesChargesModel.chargesCount}}<span v-if="poSamplesChargesModel.chargesCount != ''">个</span>
                </el-form-item>
                <el-form-item label="产品数量总计：" prop="allQty">
                  {{poSamplesChargesModel.allQty}}<span v-if="poSamplesChargesModel.allQty != ''">PCS</span>
                </el-form-item>
                <el-form-item label="运费："  prop="freight">
                  {{poSamplesChargesModel.freight}}
                </el-form-item>
                <el-form-item label="币种："  >{{poSamplesChargesModel.currencyId}}</el-form-item>
                <el-form-item label="费用总额：" prop="allCharges">{{poSamplesChargesModel.allCharges}}</el-form-item>
              </el-form>
            </section>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.infoDetail = false;">关闭</el-button>
        </div>
      </el-dialog>
    <!------------------查看/ 编辑 物料采购 弹出框--------------------------->
    <el-dialog title="查看物料采购" :visible.sync="dialogFlag.metarialDialog" :close-on-click-modal="false">
      <section class="infoData" id="infoData">
        <el-form :model="materialModel" :label-width="labelPosition" class="formData" >
          <el-form-item  label="申请信息：" ></el-form-item>
          <div style="margin-left: 40px;">
            <span>申请仓库：{{materialModel.whName}}</span><br/><br/>
            <span>申请人：{{materialModel.poUser}}</span><br/><br/>
            <span>申请时间：{{materialModel.poTime}}</span><br/><br/>
          </div>
          <el-form-item  label="申请用途：" prop="use"></el-form-item>
          <span style="margin-left: 40px;">{{materialModel.use}}</span><br/><br/>
          <el-form-item  label="申请备注：" prop="use"></el-form-item>
          <span style="margin-left: 40px;">{{materialModel.notes}}</span><br/><br/>
          <el-form-item  label="产品信息：" ></el-form-item>
          <div class="table_padding" style="margin-left: 40px;">
            <el-table :data="materialModel.proMaterials" border tooltip-effect="dark" style="width: 100%">
              <el-table-column sortable label="物品名称" prop="materialName" align="center"  ></el-table-column>
              <el-table-column sortable  label="物品个数" prop="qty" align="center"></el-table-column>
              <el-table-column sortable label="单位"  prop="unit" align="center"></el-table-column>
              <el-table-column sortable label="采购连接" align="center" prop="itemUrl" class="textarea" ></el-table-column>
              <el-table-column sortable label="备注" align="center" prop="memo" ></el-table-column>
              <el-table-column sortable label="单价" align="center" prop="price"></el-table-column>
              <el-table-column sortable label="小计" align="center">
                <template scope="scope">
                  <span>{{scope.row.price*scope.row.qty}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <br/>
          <div style="text-align: right;margin-bottom: -20px;">产品总价：<span>{{materialModel.totalAmount}}</span></div>
          <el-form-item  label="付款状态：" prop="state" >{{materialModel.state}}</el-form-item>
          <el-form-item  label="交货仓库：" prop="whId" >{{materialModel.whName}}</el-form-item>
        </el-form>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.metarialDialog = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!------------------登记付款/退款 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.payDialog" :close-on-click-modal="false" id="div" class="picHover" @close="resetForm('payInfo')">
      <el-form :model="payInfo" :rules="infoRules" ref="payInfo"  class="demo-ruleForm" label-width="120px">
        <el-form-item :label="dialogFlag.dialogTitle == '登记付款'?'资金来源':'资金去向'"  prop="payType" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-radio-group v-model="payInfo.payType">
            <el-radio label="0">银行卡</el-radio>
            <el-radio label="1">现金</el-radio>
            <el-radio label="2">PayPal</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标识"  prop="payBank" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <area-list :select-value="payInfo.payBank" @getData="getArea" :is-disabled="false"></area-list>
        </el-form-item>
        <el-form-item :label="dialogFlag.dialogTitle == '登记付款'?'支付金额':'退款金额'"  prop="payAmount" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="number" min="0" v-model="payInfo.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="手续费"  prop="poundage" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="number" min="0" v-model="payInfo.poundage"></el-input>
        </el-form-item>
        <el-form-item label="币种"  prop="currencyId" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <currency-list :select-value="payInfo.currencyId" :is-disabled="dialogFlag.inputDisabled" @child-change-Val="getCurrency"></currency-list>
        </el-form-item>
        <el-form-item label="交易时间"  prop="payTime" :rules="[{required:true,type:'date',message:'不能为空',trigger:'change'}]">
          <el-date-picker v-model="payInfo.payTime" size="small" editable type="datetime" placeholder="选择交易时间" formatter="yyyy-MM-dd mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注"  prop="memo" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <el-input type="textarea"  v-model="payInfo.memo"></el-input>
        </el-form-item>
        <el-form-item label="上传付款凭证"  prop="list" class="picture"  :rules="[{required:true,type:'array',message:'不能为空',trigger:'change'}]">
          <el-upload :http-request="uploadFilePic" :action="uploadPic" list-type="picture-card" drag multiple :file-list="attachList" :list-data="payInfo.list"  accept=".jpg,.jpeg,.png">
            <el-button size="small" type="primary" >点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="payInfoHistory">
        <div style="margin-bottom: 20px;">{{dialogFlag.dialogTitle == '登记付款'?'历史付款':'历史退款'}}</div>
        <el-table id="item_list" :data="payInfoHistory" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showImgDialog(scope.row);" >&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="payTime" label="付款时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="payAmount" label="付款金额"  align="center"></el-table-column>
          <el-table-column sortable prop="balance" label="付款后剩余未付"  align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.payDialog = false;">取消</el-button>
        <el-button type="primary" @click="savePayInfo('payInfo');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--图片放大框------------------------------------------------------------------------------>
    <el-dialog title="查看图片" :visible.sync="dialogFlag.imgDialog" size="tiny" class="ImgEnlarge" :close-on-click-modal="false">
      <div>
        <img :src="dialogImageUrl" class="picDetail">
      </div>
    </el-dialog>
    <!--筛选------------------------------------------------------------------------------>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="isGroup=false" @close="isGroup=true">
        <div class="data_body">
          <title-header></title-header>
          <div v-show="pageType == 1">
            <text-input :select-value="sampleFilter.poNo" condition-name="样品采购单编号" text-type="样品采购单编号" place-value="请输入样品采购单编号" @child-change-val="getTextInput"></text-input>
            <select-input :select-value="sampleFilter.addUser" condition-name="样品申请人" :options-data="userList" @child-change-val="getSelectInput"></select-input>
            <select-input :select-value="sampleFilter.state" condition-name="状态" :options-data="sampleOptions" @child-change-val="getSelectInput"></select-input>
            <time-data :start-time="sampleFilter.initialTime" condition-name="申请日期" :end-time="sampleFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          </div>
          <div v-show="pageType == 2">
            <text-input :select-value="purchaseFilter.poNo" condition-name="采购单编号" text-type="采购单编号" place-value="请输入采购单编号" @child-change-val="getTextInput"></text-input>
            <text-input :select-value="purchaseFilter.skuNo" condition-name="SKU" text-type="SKU" place-value="SKU" @child-change-val="getTextInput"></text-input>
            <time-data :start-time="purchaseFilter.startDate" condition-name="创建日期" :end-time="pageFilter.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
            <select-input :select-value="purchaseFilter.poUserId" condition-name="采购员" :options-data="userList" @child-change-val="getSelectInput"></select-input>
            <select-input :select-value="purchaseFilter.vendorId" condition-name="供应商" :options-data="vendorList" @child-change-val="getSelectInput"></select-input>
            <select-input :select-value="purchaseFilter.poWarehouse" condition-name="交货仓库" :options-data="warehouseList" @child-change-val="getSelectInput"></select-input>
            <select-input :select-value="purchaseFilter.nodeId" condition-name="付款状态" :options-data="nodeList" @child-change-val="getSelectInput"></select-input>
          </div>
          <div v-show="pageType == 3">
            <select-input :select-value="whId" condition-name="申请仓库" :options-data="warehouseList" @child-change-val="getSelectInput"></select-input>
            <select-input :select-value="pageFilter.poUser" condition-name="申请人" :options-data="userList" @child-change-val="getSelectInput"></select-input>
            <time-data :start-time="pageFilter.poTime1" condition-name="申请日期" :end-time="pageFilter.poTime2" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
            <select-input :select-value="pageFilter.state" condition-name="状态" :options-data="materialOptions" @child-change-val="getSelectInput"></select-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clearData">清除条件</el-button>
          <el-button @click="filterScreenData();">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
      <!------------------查看 采购订单 弹出框--------------------------->
      <el-dialog title="查看成品采购订单" :visible.sync="dialogFlag.purchaseDialog" :close-on-click-modal="false" size="small">
        <el-tabs v-model="activeTab"  disabled>
          <el-tab-pane label="产品&备货" name='0'>
            <pro-table-list :getpo-id="poId" :dis="true" :isopen="dialogFlag.purchaseDialog"></pro-table-list>
          </el-tab-pane>
          <el-tab-pane label="货款&交付" name='1'>
            <delivery-form  :getpo-id="poId" :dis="true" :isopen="dialogFlag.purchaseDialog"></delivery-form>
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
          <el-tab-pane label="付款&记录" name='3'>
            <el-table :data="purchasePayLog"  id="item_list"  border tooltip-effect="dark"   style="width:100%;" >
              <el-table-column label="付款时间" align="center" prop="payTime" :formatter="tool.formatDate" width="180px" sortable ></el-table-column>
              <el-table-column label="付款人" align="center" prop="payUser"  sortable ></el-table-column>
              <el-table-column label="付款金额" align="center" prop="payAmount"  sortable >
                <template scope="scope">
                  <span v-if="scope.row.payAmount != null ">{{scope.row.paymentType == 1 ? '-'+scope.row.payAmount+'元' : scope.row.payAmount+'元'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="付款后剩余未付" align="center" prop="balance"  sortable >
                <template scope="scope">{{scope.row.balance+'元'}}</template>
              </el-table-column>
              <el-table-column label="手续费" align="center" prop="poundage"  sortable >
                <template scope="scope"> {{scope.row.poundage+'元'}}</template>
              </el-table-column>
              <el-table-column label="付款银行" align="center" prop="payBank"  sortable ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.purchaseDialog = false;">关闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import selectInput from "../../components/ScreenModular/selectInput.vue"
  import textInput from "../../components/ScreenModular/textInput.vue"
  import {deliveryForm,proTableList} from 'views/purchase/import_modular'
  import currencyList from '../../components/listData/getCurrencyList'
  import areaList from '../../components/listData/getAreaList'
  export default{
    components: {areaList,titleHeader,timeData,textInput,selectInput,timeData,deliveryForm,proTableList,currencyList},
    data(){
      return {
        sampleOptions:[{value:'', label:'全部'},{value:'1', label:'待申请付款'},{value:'2', label:'已申请待审批'},{value:'3', label:'审核不通过'},{value:'4', label:'审核通过未登记'},{value:'5', label:'已完成'},],
        materialOptions:[{value:'', label:'全部'},{value:'01', label:'待申请付款'},{value:'02', label:'已申请待审批'},{value:'03', label:'审核不通过'},{value:'04', label:'审核通过未登记'},{value:'05', label:'已完成'},],
        purchaseOptions:[{value:'', label:'全部'},{value:'1', label:'待申请付款'},{value:'2', label:'已申请待审批'},{value:'3', label:'审核不通过'},{value:'4', label:'审核通过未登记'},{value:'5', label:'未核销'},{value:'6', label:'待核销'},{value:'7', label:'已核销'},],
        poSamplesChargesModel:{},
        materialModel:{},
        poSamplesItemList: [],
        poSamplesModel: {},            // 基本信息
        payInfo:{   // 付款退款
          payType:'',
          payAmount:'',
          poundage:'',
          currencyId:'',
          payTime:'',
          memo:'',
          payBank:'',
          list: [],
        },
        samplesItemIdList:[],
        sampleFilter:{   // 样品
          currentPage:1,
          pageSize:10,
          state:'',
          overTime:'',
          initialTime:'',
          addUser:'',
        },
        pageFilter:{   // 物料
          currentPage:1,
          pageSize:10,
          state:'', // 用到
          poNo:'',
          poUser:'',
          poTime1:'',
          poTime2:'',
          whId:''
        },
        purchaseFilter: {   // 成品
          currentPage: 1,
          pageSize: 10,
          processKey:'',//流程定义
          nodeId:'',//审核状态
          poNo:'',//采购单编号
          paymentStatus:'',//付款状态
          warehouseStatus:'',//到货状态
          skuNo:'',
          startDate:'',
          endDate:'',
          poUserId:'',
          vendorId:'',
          poWarehouse:'',//仓库ID
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        activeTab:'0',     //
        tabArr:['0','1'],     // tab 标签页数组
        samplePurchaseData:[],   // 样品采购数据
        materialData:[],     // 物料采购数据
        purchaseData:[],   // 成品采购数据
        dialogFlag:{
          isOpen:false,     // 筛选
          metarialDialog:false,     // 物料
          payDialog:false,     // 付款，退款
          purchaseDialog:false,     // 成品
          infoDetail:false,    //  样品
          imgDialog:false,    //  查看图片
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        labelPosition: '120px',
        pageType:'1',    // 区分当前是成品，样品还是物料页面
        stateType:'',   // 类型
        isGroup:true,
        warehouseList:[],  // 仓库
        vendorList:[], // 供应商
        userList:[], // 人员
        nodeList:[], // 节点
        noteData:[],   // 成品采购 ---备注
        purchasePayLog:[],   //  成品采购 -- 单中的付款记录
        whId:'',  // 物料采购筛选 仓库
        poId:'',  // 成品 采购单id
        poNo:'',  // 成品 采购单id
        relaId:'',  // 成品 任务单id
        sels1:[],
        sels2:[],
        sels3:[],
        dialogImageUrl:'',  // 查看放大图片src
        attachList:[],  //  上传图片
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getData();
      this.getOptionList();
      this.tool.addElemntLarge();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      filterData:function(){
        if(this.pageType == 1 && this.isGroup == true){
            this.sampleFilter.state = this.stateType;
            this.getData();
        }else if(this.pageType == 2 && this.isGroup == true){
            this.purchaseFilter.nodeId = this.stateType;
            this.getData();
        }else if(this.pageType == 3 && this.isGroup == true){
            this.pageFilter.state = this.stateType;
            this.getData();
        }
      },
      getOptionList:function(){   // 获取筛选中下拉数据源
        var vm = this;
        const getAllWareHouse = this.httpGet('productMaterial/getAllWareHouse');
        const selectProPurchaseStatus = this.httpPost('productPurchase/selectProPurchaseStatus');
        const selectAddUser = this.httpPost('sysUser/selectList',{});
        const selectVendorName = this.httpGet('/vendorRelation/selectVendorName');
        this.$http.all([getAllWareHouse,selectProPurchaseStatus,selectAddUser,selectVendorName])
          .then(this.$http.spread(function(wareData,statusData,userData,vendorData){
            vm.nodeList = vm.tool.replaceObjKey(statusData.data,'nodeId','nodeName');
            vm.nodeList.unshift({value:'',label:'全部'});
            vm.warehouseList = vm.tool.replaceObjKey(wareData.data,'whId','whName');
            vm.userList = vm.tool.replaceObjKey(userData.data,'userId','userName');
            vm.vendorList = vm.tool.replaceObjKey(vendorData.data.params.vendorNameList,'vendorId','vendorName');
          }))
      },
      getData:function(){
         this.dialogFlag.isOpen = false;
         switch(this.pageType){
            case '1':
               this.httpPost('samplesProcurement/select',this.sampleFilter).then(res =>{
                  if(res.data.result == true){
                    const pageData = res.data.params.samplesList;
                    this.page = pageData;
                    this.samplePurchaseData = pageData.listData;
                  }else{
                    this.samplePurchaseData = [];
                  }
                })
              break;
            case '2':
              this.httpPost('productPurchase/selectProPurchase',this.purchaseFilter).then(res =>{
                  const pageData = res.data;
                  this.page = pageData;
                  this.purchaseData = pageData.listData;
              })
                break;
            case '3':
              this.httpGet('poMaterialPayment/selectMaterialInfo',this.pageFilter).then(res =>{
                  const pageData = res.data;
                  this.page = pageData;
                  this.materialData = pageData.listData;
              })
              break;
          }
      },
      selsChange1:function(val){
        this.sels1 = val;
      },
      selsChange2:function(val){
        this.sels2 = val;
      },
      selsChange3:function(val){
        this.sels3 = val;
      },
      updateStatus:function(sels,row,status,msg){
        var url = this.pageType == 1 ? 'poSamplesPayment/updateStatus' : 'poMaterialPayment/updateStatus';
        var singleData = sels == '' ? [{poId:row.poId,status:status}] : [];
        var batchData = [];
        var arr = this.pageType == 1 ? this.sels1 : this.sels3 ;
        if(row == '' && arr.length>0){
          arr.forEach(function(item){
              batchData.push({poId:item.poId,status:status})
            })
        }else{
            batchData = [];
        }
        var data = sels != '' ? batchData : singleData;
        data.length < 1 ? this.tips() : this.doItem(msg,url,data,this.getData);
      },
      updatePurchaseStatus:function(sels,row,nodeId,agree,msg){
        var url = 'poPayRec/updateStatus';
        var singleData = sels == '' ? [{relaId:row.relaId,nodeId:nodeId,agree:agree,poId:row.poId}] : [];
        var batchData = [];
        var arr = this.sels2 ;
        if(row == '' && arr.length>0){
          arr.forEach(function(item){
            batchData.push({relaId:item.relaId,poId:item.poId,nodeId:nodeId,agree,agree})
          })
        }else{
          batchData = [];
        }
        var data = sels != '' ? batchData : singleData;
        data.length < 1 ? this.tips() : this.doItem(msg,url,data,this.getData);
      },
      showInfoDialog:function(row,val){
        this.httpPost('samplesProcurement/selectSingleData',{poId:row.poId}).then(res =>{
            if(res.data.result == true){
                let data = res.data.params.samplesProcurement;
                this.poSamplesModel = data.poSamplesModel;
                this.poSamplesItemList = data.poSamplesItemList;
                this.poSamplesChargesModel = data.poSamplesChargesModel;
                this.dialogFlag.infoDetail = true;
            }
        })
      },
      showPurchaseDialog:function(row){
        this.dialogFlag.purchaseDialog = true;
        var vm = this;
        this.dialogFlag.dialogTitle = '查看采购订单';
        const purchase = this.httpPost('productPurchase/query?poId='+row.poId);
        const payLog = this.httpPost('poPayRec/selectList',{poId:row.poId});
        this.$http.all([purchase,payLog]).then(this.$http.spread(function(purchaseData,payLogData){
          for(var item of purchaseData.data.purchaseNote){
            item.updTime = vm.tool.formatDate('','',item.updTime);
          }
          vm.noteData = purchaseData.data.purchaseNote;
          vm.purchasePayLog = payLogData.data;
        }))
      },
      showMaterialInfo:function(row,val){
        var vm = this;
        this.httpGet('productMaterial/getMaterial?poId='+row.poId).then(res =>{
          this.materialModel = res.data;
          this.materialModel.poTime = this.tool.dateFormatter('','',res.data.poTime);
          this.dialogFlag.metarialDialog=true;
        })
      },
      showPayInfoHistory:function(row,type){
         this.poId = row.poId;
         this.poNo = row.poNo;
         this.relaId = row.relaId;
         this.httpPost('poPayRec/selectList',{poId:row.poId,paymentType:type}).then(res =>{
           this.payInfoHistory = res.data;
           this.dialogFlag.payDialog=true;
           var date = new Date();
           this.payInfo.payTime = date;
         })
      },
      savePayInfo:function(formName){
        this.payInfo.poId = this.poId;
        this.payInfo.poNo = this.poNo;
        var data = JSON.parse(JSON.stringify(this.payInfo));
        data.sourceChannel = this.pageType == 1 ? 1 : this.pageType == 2 ? 0 : 2;
        data.paymentType = this.dialogFlag.dialogTitle == '登记付款' ? 0 : 1;
        var list = data.list;
        delete data.list;
        this.$refs[formName].validate((valid) =>{
          if(valid){
            if(Number(this.payInfo.payAmount) < 0){
                this.$message('金额不能小于零！');
            }else{
              this.httpPost('poPayRec/save',{poPayRec:data,list:list},'Sms').then(res =>{
                delete this.payInfo.list;
                if(res.data.result == true){
                  if(this.pageType == 2){
                    this.singleUpdateStatus(this.poId,this.relaId);
                  }else{
                    this.finishPayUpdateStatus();
                  }
                }else{
                  this.$message(res.data.message);
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      finishPayUpdateStatus:function(){   // 付款完成后修改状态 样品 物料
        var url = this.pageType == 1 ? 'poSamplesPayment/updateStatus' : 'poMaterialPayment/updateStatus';
        var status = this.pageType == 1 ? '5' : '05';
        var params = [{poId:this.poId,status:status}];
        this.httpPost(url,params).then(res =>{
          this.$message(res.data.message);
          if(res.data.result == true){
            this.dialogFlag.payDialog=false;
            this.getData();
          }
        })
      },
      singleUpdateStatus:function(poId,relaId){   // 付款完成后修改状态 成品
        var nodeId = this.stateType == 'T04' ? 'T05' : this.stateType == 'T05' ? 'T06' : 'T07';
        var params = [{poId:poId,relaId:relaId,nodeId:nodeId,agree:''}];
        this.httpPost('poPayRec/updateStatus',params).then(res =>{
            this.$message(res.data.message);
            if(res.data.result == true){
             this.dialogFlag.payDialog=false;
             this.getData();
            }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getSampleData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getSampleData();
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
        this.attachList=[];
      },
      getTime:function(val){
        if(this.pageType == 1){
          val.type == 'start' ? this.sampleFilter.initialTime = val.value : this.sampleFilter.overTime = val.value;
        }else if(this.pageType == 2){
          val.type == 'start' ? this.purchaseFilter.startDate = val.value : this.purchaseFilter.endDate = val.value;
        }else if(this.pageType == 3){
          val.type == 'start' ? this.pageFilter.poTime1 = val.value : this.pageFilter.poTime2 = val.value;
        }
      },
      getTextInput:function(val){
        if(this.pageType == 1){
          this.sampleFilter.poNo = val.value;
        }else if(this.pageType == 2){
          val.type == '采购单编号' ? this.purchaseFilter.poNo = val.value : this.purchaseFilter.skuNo = val.value;
        }
      },
      getSelectInput:function(val){
        if(this.pageType == 1){
          val.type == '状态' ? this.sampleFilter.state = val.value : this.sampleFilter.addUser = val.value;
        }else if(this.pageType == 2){
          val.type == '采购员' ? this.purchaseFilter.poUserId = val.value :  val.type == '供应商' ? this.purchaseFilter.vendorId = val.value :  val.type == '交货仓库' ?
            this.purchaseFilter.poWarehouse = val.value : this.purchaseFilter.nodeId = val.value;
        }else if(this.pageType == 3){
          val.type == '申请人' ? this.pageFilter.poUser = val.value : val.type == '申请仓库' ? this.pageFilter.whId = val.value:this.pageFilter.state = val.value;
        }
      },
      filterScreenData:function(){  //筛选
        if(this.pageType == 1){
          this.stateType = this.sampleFilter.state;
          this.getData();
        }else if(this.pageType == 2){
          this.stateType = this.purchaseFilter.nodeId;
          this.getData();
        }else if(this.pageType == 3){
          this.stateType = this.pageFilter.state;
          this.getData();
        }
      },
      getCurrency:function(val){
        this.payInfo.currencyId = val.value;
      },
      getArea:function(val){
        this.payInfo.payBank = val.value;
      },
      clearData:function(){
        if(this.pageType == 1){
          this.sampleFilter.overTime = '';
          this.sampleFilter.initialTime = '';
          this.sampleFilter.addUser = '';
          this.sampleFilter.poNo = '';
          this.sampleFilter.state = '';
        }else if(this.pageType == 2){
          this.purchaseFilter.startDate = '';
          this.purchaseFilter.poUserId = '';
          this.purchaseFilter.endDate = '';
          this.purchaseFilter.vendorId = '';
          this.purchaseFilter.poWarehouse = '';
          this.purchaseFilter.skuNo = '';
          this.purchaseFilter.poNo = '';
          this.purchaseFilter.nodeId = '';
        }else if(this.pageType == 3){
          this.pageFilter.state = '';
          this.pageFilter.whId = '';
          this.pageFilter.poUser = '';
          this.pageFilter.poTime1 = '';
          this.pageFilter.poTime2 = '';
        }
      },
      uploadFilePic:function(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          if(res.data.result == true){
            this.payInfo.list.push(res.data.params.attach.attachId);
            this.attachList.push( res.data.params.attach);
          }
        })
      },
      showImgDialog:function(row){
        this.httpPost('poPayAttachment/selectPicture',{payId:row.payId},'Sms').then(res =>{
          if(res.data.result == true){
            var imgArr = res.data.params.list;
            this.changePic(imgArr);
            this.dialogFlag.imgDialog = true;
          }else{
            this.$message(res.data.message);
          }
        })
      },
      changePic(docImgarr){  //点击左右按钮切换图片
        var vm=this;
        var imgIndex='';
        vm.dialogImageUrl = docImgarr[0];
        for(let i=0;i<docImgarr.length;i++){
          imgIndex = docImgarr.indexOf(vm.dialogImageUrl);
        }
        var divM = document.getElementById("imgLeft");
        divM.onclick = function () {
          imgIndex++;
          if(imgIndex > docImgarr.length -1){
            vm.$message('已经是最后一张啦！');
            imgIndex=docImgarr.length-1;
          }
          vm.dialogImageUrl = docImgarr[imgIndex];
        }
        var divR = document.getElementById("imgRight");
        divR.onclick = function () {
          imgIndex--;
          if(imgIndex < 0){
            vm.$message('已经是第一张啦！');
            imgIndex=0;
          }
          vm.dialogImageUrl = docImgarr[imgIndex];
        }
      },
    }
  }
</script>
<style scoped>
  .mt-10{
    margin-top:10px;
  }
  .product_tit{
    display:flex;
    justify-content:space-between;
    margin-bottom:20px;
  }
  .product_tit .title, .price_tit .title{
    font-size:16px;
    font-weight:bold;
  }
  .product_tit .addProduct,.price_tit .calc{
    font-size:15px;
    cursor: pointer;
    color:rgb(32,160,255)
  }
  .price_tit .calc{
    padding-left:30px;
  }
  .price_tit{
    margin-top:20px;
  }
  .priceData{
    margin:30px 0 0 30px;
  }
  .priceData .el-form-item {
    margin-bottom: 0;
  }
  .priceData .yufei_item{
  margin-bottom:10px!important;
}
  .remark{
    color:red;
    padding:0 10px;
  }
  .payInfoHistory{
    margin-left:20px;
  }
</style>
