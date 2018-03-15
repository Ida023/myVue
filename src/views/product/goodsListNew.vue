<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row class="marginBottom"  :gutter="10">
        <el-col :span="3">
          <el-select size="small" v-model="selectParams.optionTitle" filterable  @clear="clearValue('0')" @change="selectParams.optionValue = ''">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="selectFilter('0')">搜索</el-button>
        </el-col>
      </el-row>
      <el-row  id="filer" class=" marginBottom">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <el-row class=" marginBottom">
              <span class="span_label">类型 </span>
              <el-radio-group v-model="pagefilters.isAssemby" size="small"@change="requestemStart($event,status)">
                <el-radio-button label="0" v-if="ButtonInfo['非组合商品']!='0'">非组合商品</el-radio-button>
                <el-radio-button label="1" v-if="ButtonInfo['组合商品']!='0'">组合商品</el-radio-button>
              </el-radio-group>
            </el-row>
            <el-row class=" marginBottom">
              <span class="span_label">销售状态</span>
              <el-radio-group v-model="pagefilters.salesStatus" size="small"  @change="requestemStart($event,status)">
                <el-radio-button label="1" v-if="ButtonInfo['正常销售']!='0'">正常销售</el-radio-button>
                <el-radio-button label="2" v-if="ButtonInfo['清货销售']!='0'">清货销售</el-radio-button>
                <el-radio-button label="3" v-if="ButtonInfo['暂停销售']!='0'">暂停销售</el-radio-button>
                <el-radio-button label="4" v-if="ButtonInfo['卖完不再销售']!='0'">卖完不再销售</el-radio-button>
                <el-radio-button label="5" v-if="ButtonInfo['侵权不再销售']!='0'">侵权不再销售</el-radio-button>
                <el-radio-button label="6" v-if="ButtonInfo['回收站']!='0'">回收站</el-radio-button>
              </el-radio-group>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="marginBottom" style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px; ">
        <el-button size="small"  type="primary"  v-if="ButtonInfo['添加商品']!='0'  && pagefilters.isAssemby=='0'" @click="dialogFlag.inputDisabled = false;dialogFlag.prlblemask =false;getaddCreateIssues(dialogFlag.addDialog  = false,'新增非组合商品基础资料');">添加非组合商品</el-button>
        <el-button size="small"  type="primary" v-if="ButtonInfo['添加组合商品']!='0' && pagefilters.isAssemby=='1'" @click="dialogFlag.inputDisabled = false;dialogFlag.prlblemask =false;assistlist.dialoglist=[];getaddCreateIssues(dialogFlag.addDialog = true,'新增组合商品基础资料');">添加组合商品</el-button>
        <el-button size="small"  type="primary"  v-if="ButtonInfo['筛选']!='0'"  @click="screen.screenisOpen = true;screenData();" >筛选</el-button>
        <el-button size="small"  type="primary"  v-if="ButtonInfo['批量导入']!='0'" @click="importData.isOpen = !importData.isOpen">批量导入</el-button>
        <el-button size="small"  type="primary"  v-if="ButtonInfo['批量导出']!='0'" @click="exportList(pagefilters.salesStatus)">批量导出</el-button>
      </el-row>
      <el-row class="marginBottom" v-if="pagefilters.salesStatus != ''">
        <el-button size="small"  type="primary"  v-if="ButtonInfo['批量调整销售状态']!='0'"@click="batchSales('','1','sales');dialogFlag.salesTitle='批量调整销售状态';" >批量调整销售状态</el-button>

      </el-row>
      <el-table  id="item_list" class="publicCell"   border  tooltip-effect="dark" :data="listData" label-width=""  @selection-change="handleSelectionChange"  style="word-wrap:break-word;word-break:break-all;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column  id="space" label="操作"  align="center"  width="125px" style="word-wrap:break-word;word-break:break-all;">
          <template scope="scope">
            <el-tooltip content="查看完整资料（含供应商）"  effect="dark" placement="bottom" v-if="ButtonInfo['查看基础资料（含供应商）']!='0'">
              <i  class="iconfontyyy" @click="getCreateIssues(scope.row,dialogFlag.inputDisabled = true,'查看'+(pagefilters.isAssemby=='0'?'非组合商品':'组合商品')+'完整资料（含供应商）');dialogFlag.prlblemask=true; assistlist.dialoglist=[];dialogFlag.addDialog  = false;" content="Bottom center">&#xe600;</i>
            </el-tooltip>
            <el-tooltip content="查看基础资料（不含供应商）"  effect="dark" placement="bottom" v-if="ButtonInfo['查看基础资料（不含供应商）']!='0'">
              <i  class="iconfontyyy" @click="getCreateIssues(scope.row,dialogFlag.inputDisabled = true,'查看'+(pagefilters.isAssemby=='0'?'非组合商品':'组合商品')+'基础资料（不含供应商）');dialogFlag.prlblemask=true; assistlist.dialoglist=[];dialogFlag.addDialog  = false;" content="Bottom center">&#xe675;</i>
            </el-tooltip>
            <el-tooltip content="编辑"  effect="dark" placement="bottom"   v-if="ButtonInfo['编辑']!='0'">
              <i  class="iconfontyyy" @click="getCreateIssues(scope.row,dialogFlag.inputDisabled = false,'编辑'+(pagefilters.isAssemby=='0'?'非组合商品':'组合商品')+'基础资料');dialogFlag.prlblemask=true;assistlist.dialoglist=[]; dialogFlag.addDialog  = false;" content="Bottom center">&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip content="编辑产品采购信息"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" @click="openpurchase(scope.row)" content="Bottom center">&#xe64b;</i>
            </el-tooltip>
            <el-tooltip content="上传图片"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" @click="openimage(scope.row)" content="Bottom center">&#xe614;</i>
            </el-tooltip>
            <el-tooltip content="销售状态"  effect="dark" placement="bottom"  v-if="ButtonInfo['销售状态']!='0'">
              <i  class="iconfontyyy" @click="batchSales(scope.row,'0','sales');dialogFlag.salesTitle='调整销售状态';" content="Bottom center">&#xe616;</i>
            </el-tooltip>
           <!-- <el-tooltip content="打印"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" @click="signPhoto(scope.row)" content="Bottom center">&#xe638;</i>
            </el-tooltip>
            <el-tooltip content="打印"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" @click="signPhoto(scope.row)" content="Bottom center">&#xe638;</i>
            </el-tooltip>-->

           <!--   <el-tooltip content="分配销售"  effect="dark" placement="bottom"  v-if="ButtonInfo['分配销售']!='0'">
              <i  class="iconfontyyy" @click="houseAssigned(scope.row,'0');dialogFlag.houseisOpen = true;skuAssigned.inputDisabled = false;" content="Bottom center">&#xe639;</i>
            </el-tooltip>-->
            <!-- <el-tooltip  content="调整分类"  effect="dark" placement="bottom">
             <i  class="iconfontyyy" @click="batchSales(scope.row,'0','classify');classifyData.batchAdjustment = false;classifyData.title='调整分类';dialogFlag.inputDisabled=false;" content="Bottom center">&#xe63c;</i>
           </el-tooltip>-->
          </template>
        </el-table-column>
        <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
        <el-table-column label="old SKU"    prop="oldSkuNo" align="center"  sortable  ></el-table-column>
        <el-table-column label="图片" prop="imageUrl" align="center" sortable >
          <template scope="scope">
            <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
          </template>
        </el-table-column>
        <el-table-column label="名称"  prop="cnName" align="center"  sortable ></el-table-column>
<!--
        <el-table-column label="EAN" prop="eanCode"  sortable align="center"></el-table-column>
-->
        <el-table-column label="分类"  sortable align="center" width="280px">
          <template scope="scope" >
              <span style="text-align: center" v-if="scope.row.oneCategoryName != null">{{scope.row.oneCategoryName}}<br></span>
              <span style="text-align: center" v-if="scope.row.twoCategoryName != null">{{scope.row.twoCategoryName}}<br></span>
              <span style="text-align: center" v-if="scope.row.threeCategoryName != null">{{scope.row.threeCategoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="开发"  align="center"  prop="developUser" sortable >
        </el-table-column>
        <el-table-column label="寻购"  align="center"  prop="purchaseUser" sortable ></el-table-column>
        <el-table-column label="摄影"  align="center"  prop="purchaseUser" sortable ></el-table-column>
        <el-table-column label="美工"  align="center"  prop="purchaseUser" sortable ></el-table-column>
        <el-table-column label="状态" align="center"  prop="salesStatus"  sortable ></el-table-column>
       <!-- <el-table-column label="仓库与销售" align="center"   sortable >
          <template scope="scope">
            <span class="link-type" v-if="scope.row.warehouseName != null" >{{scope.row.warehouseName}}<br></span>
              <el-tooltip  content="更多"  effect="dark" placement="bottom">
                <i @click="houseAssigned(scope.row,'0');dialogFlag.houseisOpen = true;skuAssigned.inputDisabled = true;" class="el-icon-more"></i>
              </el-tooltip>
          </template>
        </el-table-column>-->
      </el-table>
      <!--查看 编辑 新增弹窗-->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" @close="ResetFrom">
        <el-tabs v-model="dialogFlag.activeTab"  @tab-click="tabclick">
          <el-tab-pane label="基本信息"   :disabled="!dialogFlag.docmentNull"  name="0">
            <msg-dialog  ref="msgDialog"    :parentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId"
                         :input-disabled="dialogFlag.inputDisabled" :docment-null="dialogFlag.docmentNull" v-on:parentmsgg = "parentMsg" ></msg-dialog>
          </el-tab-pane>
          <el-tab-pane label="辅助信息" :disabled="!dialogFlag.docmentNull"  name="1">
            <assist-dialog-new  ref="assistDialog" :group-product="dialogFlag.addDialog" :has-data="hasdataa"  :product-id="pagefilters.productId"  :assidialoglist="assistlist.dialoglist"   :assistparentinfo-detail="dialogFlag.activeTab"
                            :input-disabled="dialogFlag.inputDisabled"  v-on:parentmsggl="assiparentmsgg"  v-on:assdialog="getassdialog" :docment-null="dialogFlag.docmentNull"  @parent-full="getchildFull"  :fullListt="fullList" ></assist-dialog-new>
          </el-tab-pane>
          <el-tab-pane label="组合商品" :disabled="!dialogFlag.docmentNull"  name="5" v-if="dialogFlag.dialogTitle=='查看组合商品完整资料（含供应商）' || dialogFlag.dialogTitle=='查看组合商品基础资料（不含供应商）' || dialogFlag.dialogTitle=='编辑组合商品基础资料' || dialogFlag.dialogTitle=='新增组合商品基础资料'">
           <portfolioDialog ref="portfolioDialog" :open="!dialogFlag.assistisOpen" :productId="pagefilters.productId" @changeEvent="getPortfolioIsOpen" :inputDisabled="dialogFlag.inputDisabled" ></portfolioDialog>
           <!-- <el-row :span="24">
              <el-col :span="4"><h4>组合产品信息</h4></el-col>
              <el-col :span="3" ><h4  class="Astyel"  @click="dialogFlag.assistisOpen=true">添加物品</h4></el-col>
            </el-row>
                <el-col class="table_border">
                  <el-table  border  tooltip-effect="dark" :data="listData" >
                    <el-table-column label="操作"  prop="" align="center"  sortable >
                      <template scope="scope" class="operation" style=""  >
                        <el-tooltip  content="删除" effect="dark" placement="bottom" v-if="dialogFlag.inputDisabled == false" >
                          <i  class="iconfontyyy"  >&#xe6f7;</i>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column label="图片"  prop="imageUrl" align="center"  >
                      <template scope="scope">
                        <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                      </template>
                    </el-table-column>
                    <el-table-column label="名称"  prop="cnName" align="center"  sortable></el-table-column>
                    <el-table-column label="SKU"  prop="skuNo" align="center"  sortable ></el-table-column>
                    <el-table-column label="数量"  prop="qty" align="center"  sortable >
                      <template  scope="scope">
                        <el-input style="width: 100%;height: 100%;" type="text" v-model="scope.row.qty" :disabled="inputDisabledd" ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="重量"  prop="productWeight" align="center"  sortable ></el-table-column>
                    <el-table-column label="长"  prop="productLength" align="center"  sortable ></el-table-column>
                    <el-table-column label="宽"  prop="productWidth" align="center"  sortable ></el-table-column>
                    <el-table-column label="高"  prop="productHeight" align="center"  sortable ></el-table-column>
                  </el-table>
                </el-col>-->
          </el-tab-pane>
          <el-tab-pane label="采购信息"  :disabled="!dialogFlag.docmentNull" name="2"  v-if="dialogFlag.dialogTitle=='查看组合商品完整资料（含供应商）' || dialogFlag.dialogTitle=='查看非组合商品完整资料（含供应商）'">
             <purchase-dialog-new ref="purchaseDialog"  :title="dialogFlag.dialogTitle"  :purchaseparentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId"
                              :input-disabled="true" v-on:parentmsggll="purparentmsgg"  :docment-null="dialogFlag.docmentNull"></purchase-dialog-new>
          </el-tab-pane>
          <el-tab-pane label="详细描述"  :disabled="!dialogFlag.docmentNull" name="3">
            <describe-dialog  ref="describeDialog"    @assignment="pustdescribe"  :disState="dialogFlag.inputDisabled" :Selected="pagefilters" ></describe-dialog>
          </el-tab-pane>
          <el-tab-pane label="产品图片"  :disabled="!dialogFlag.docmentNull" name="4" >
            <images-dialog-new @assignment="imageData"  @assignment3="imageData3"
                           @assignment4="imageData4" @assignment2="imageData2"
                           :disState="!dialogFlag.inputDisabled"
                           :Selected="pagefilters"
                           :docment-null="dialogFlag.docmentNull"
                           :isOpen="dialogFlag.isOpen"></images-dialog-new>
          </el-tab-pane>
          <!--<el-tab-pane label="物流方式"   name="5"  :disabled="!dialogFlag.docmentNull">
            <logistics-dialog ref="logisticsDialog" :logisticsparentinfo-detail="dialogFlag.activeTab"   @assignment="getLogisticsVlaue" :input-disabled="dialogFlag.inputDisabled" :product-id="pagefilters.productId"></logistics-dialog>
          </el-tab-pane>-->
          <el-tab-pane label="产品问题"  :disabled="!dialogFlag.docmentNull" name="6" >
            <problemDialog ref="problemDialog" :inputDisabled="dialogFlag.inputDisabled"  :productId="pagefilters.productId"   @parentproblem-ll="getparentproblem" ></problemDialog>
         <!--   <el-row v-if="dialogFlag.prlblemask == false"   style="text-align:center">
              <el-button to=""  @click="dialogFlag.problemisOpen=true; dialogFlag.problemTitle ='添加提问';dialogFlag.prlblemLabel='提问'">添加问题</el-button>
            </el-row>
            <el-row  v-if="dialogFlag.prlblemask == true" >
              <el-button to="" class="quesright" v-if="dialogFlag.inputDisabled == false" @click="dialogFlag.problemisOpen=true; dialogFlag.problemTitle ='添加提问';dialogFlag.prlblemLabel='提问'">添加问题</el-button>
              <el-col v-for="(item,index) in problem.problemparentForm" :key="item.askTitle" >
                <el-form :label-width="financeFormLabelWidth" >
                  <el-form-item label="问题" >
                    {{item.askTitle}}
                  </el-form-item>
                  <el-form-item label="发布时间" >
                    {{item.askTime}}
                  </el-form-item>
                  <el-form-item label="发布者">
                    {{item.askUser}}
                  </el-form-item>
                  <el-form-item label="解答" >
                      {{item.askContent}}
                    <el-col v-if="item.askContent == null" >
                      <el-button to=""  class="quesright"  v-if="dialogFlag.inputDisabled == false"  @click="addask(item.issueId);dialogFlag.problemisOpen=true; dialogFlag.problemTitle='我来回答';dialogFlag.prlblemLabel='回答'">我来回答</el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>-->
          </el-tab-pane>
          <el-tab-pane label="日志"  :disabled="!dialogFlag.docmentNull" name="7"  v-if="dialogFlag.dialogTitle!='新增非组合商品基础资料' && dialogFlag.dialogTitle!='新增组合商品基础资料'">
            <el-table  id="item_list" class="publicCell"   border  tooltip-effect="dark" :data="listData" label-width=""   style="word-wrap:break-word;word-break:break-all;">
              <el-table-column label="姓名" align="center"  prop="salesStatus"  sortable ></el-table-column>
              <el-table-column label="账号" align="center"  prop="salesStatus"  sortable ></el-table-column>
              <el-table-column label="动作" align="center"  prop="salesStatus"  sortable ></el-table-column>
              <el-table-column label="时间" align="center"  prop="salesStatus" :formatter="tool.formatDate"  sortable ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer" v-if="dialogFlag.prlblemask == true">
          <!--<el-col :span="9" style="color:red">切换并填写的时候，记得点击保存→→</el-col>-->
          <el-button @click="dialogFlag.isOpen = false;dialogFlag.activeTab='0';">关 闭</el-button>
          <el-button :loading="$store.state.loading" type="primary" @click="submitDialogForm" v-if="dialogFlag.inputDisabled == false">保 存</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-if="dialogFlag.prlblemask == false">
          <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
          <el-button type="" @click="goPrev()" v-if="dialogFlag.activeTab!=0">上一步</el-button>
          <el-button type="" @click="goNext()" v-if="dialogFlag.activeTab!=6 && dialogFlag.activeTab!=0 ">下一步</el-button>
          <el-button type="primary" :loading="$store.state.loading" @click="submitDialogForm" v-if="dialogFlag.activeTab == 6" >保 存</el-button>
          <el-button type="primary" :loading="$store.state.loading" @click="submitDialogForm" v-if="dialogFlag.activeTab!=6" >保 存&下一步</el-button>
        </div>
      </el-dialog>
      <!--辅助信息添加组合货品弹窗-->
      <el-dialog title="添加货品" :visible.sync="dialogFlag.assistisOpen" :close-on-click-modal="false" size="small"   >
        <el-row class="marginBottom" type="flex">
          <el-col :span="4">
            <el-select size="small" v-model="assistlist.selectParams.optionTitle" filterable clearable
                       @clear="clearValue('1')" @change="assistlist.selectParams.optionValue=''">
              <el-option v-for="item in assistlist.selectOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-input style="width:200px;" class="optionValue" v-model="assistlist.selectParams.optionValue"
                    :placeholder="getPlaceholderr" size="small"></el-input>
          <el-button type="primary" size="small" @click="selectFilter('1')">搜索</el-button>
          <span style="color:red;margin-left: 5px;line-height: 30px;">注:多个SKU请用,分开</span>
        </el-row>
          <el-row :span="24">
            <el-col :span="6" class="classLeft">
              <span @click="getlistall()" class="classAll">全部分类</span>
              <el-col  class="cate_tree">
                <el-tree class="classborder " :data="assistlist.data" :props="assistlist.defaultProps" @node-click="handleNodeClick"></el-tree>
              </el-col>
            </el-col>
            <el-col :span="17" class="classRight">
              <div class="table_border" >
                <el-table border class="publicCell  "  tooltip-effect="dark" :data="assistlist.listData"  @selection-change="handleSelectionChange2" >

                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column label="图片"   prop="imageUrl" align="center"   >
                    <template scope="scope">
                      <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column label="SKU"   prop="skuNo" align="center"  sortable></el-table-column>
                  <el-table-column label="商品名称"  prop="cnName" align="center"  sortable ></el-table-column>
                  <el-table-column label="重量"   prop="productWeight" align="center"  sortable ></el-table-column>
                  <el-table-column label="长"   prop="productLength" align="center"  sortable ></el-table-column>
                  <el-table-column label="宽"   prop="productWidth" align="center"  sortable ></el-table-column>
                  <el-table-column label="高"   prop="productHeight" align="center"  sortable ></el-table-column>

                </el-table>
              </div>
              <div  class="block page">
                <el-pagination
                  @size-change="handleSizeChange('1',$event)"
                  @current-change="handleCurrentChange('1',$event)"
                  :current-page="assistlist.page.currentPage"
                  :page-sizes="[10, 20, 30, 50,100]"
                  :page-size="assistlist.page.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="assistlist.page.totalCount">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag.assistisOpen = false;">关 闭</el-button>
            <el-button type="primary" @click="submitAssilist()" :loading="$store.state.loading">保 存</el-button>
          </div>
      </el-dialog>
      <!--产品问题添加问题弹窗-->
      <el-dialog :title="dialogFlag.problemTitle" :visible.sync="dialogFlag.problemisOpen" size="small" @close="problemDialog.ask='';">
        <el-form :model="problemDialog" ref="problemDialog" >
          <el-form-item :label="dialogFlag.prlblemLabel" prop="ask"
                        :rules="[{ required: true, message: '请输入字符！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                        ]">
            <el-input type="textarea" v-model="problemDialog.ask"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.problemisOpen = false;">关 闭</el-button>
          <el-button type="primary" @click="addProblem(dialogFlag.problemTitle,'problemDialog');" :loading="$store.state.loading">保 存</el-button>
        </div>
      </el-dialog>
      <!--SKU分配仓库及销售弹窗-->
      <!--
      <el-dialog title="分配销售" :visible.sync="dialogFlag.houseisOpen" size="tiny" @close="closeForm">

       <el-form v-if="skuAssigned.storehouse == true" v-model="skuAssigned" :label-width="financeFormLabelWidth" >
         <el-row v-for="(item,index) in skuAssigned.warehouseInfo" :key="item.refValue" class="salesCheckbox">
           <el-form-item :label="item.refValue" >
             <div style="margin: 15px 0;"></div>
             <el-checkbox-group v-model="skuAssignedForm.warehouseIds" @change="handleCheckedCitiesChange">
               <el-checkbox v-for="name in item.whList" :key="name.whId"  :label="name.whId" value="name.whId" :disabled="skuAssigned.inputDisabled">{{name.whName}}</el-checkbox>
             </el-checkbox-group>
           </el-form-item>
         </el-row>
       </el-form >
        <el-row v-if="skuAssigned.storehouse == false"  v-for="(item,index) in skuAssigned.listMap" :key="item.isIndeterminate" class="salesCheckbox">
            <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item)" :disabled="skuAssigned.inputDisabled" >{{item.deptName}}</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group   style="margin-left: 20px;" v-model="item.checkedUsers" @change="handlecheckedperNameChange(item)">
            <el-checkbox style="margin: 5px;" v-for="list in item.salesUserList" :label="list.userId" :key='list.userId' :disabled="skuAssigned.inputDisabled">{{list.userName}}<br></el-checkbox>
            <div style="margin: 10px 0;"></div>
          </el-checkbox-group>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.houseisOpen = false">关 闭</el-button>
          <el-button type="primary" @click="skuAssigned.storehouse = true" v-if="skuAssigned.storehouse == false " >上一步</el-button>
          <el-button type="primary" @click="submitskuAssigned();skuAssigned.storehouse = true;"   v-if="skuAssigned.storehouse == false && skuAssigned.inputDisabled == false" >保  存</el-button>
          <el-button type="primary" @click="skuAssigned.storehouse = false" v-if="skuAssigned.storehouse == true">下一步</el-button>
        </div>
      </el-dialog>-->
   <!--   <el-dialog title="分配销售" :visible.sync="dialogFlag.houseisOpen" size="tiny" @close="closeForm">

        <el-row  v-for="(item,index) in skuAssigned.listMap" :key="item.isIndeterminate" class="salesCheckbox">
          <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item)" :disabled="skuAssigned.inputDisabled" >{{item.deptName}}</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group   style="margin-left: 20px;" v-model="item.checkedUsers" @change="handlecheckedperNameChange(item)">
            <el-checkbox style="margin: 5px;" v-for="list in item.salesUserList" :label="list.userId" :key='list.userId' :disabled="skuAssigned.inputDisabled">{{list.userName}}<br></el-checkbox>
            <div style="margin: 10px 0;"></div>
          </el-checkbox-group>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.houseisOpen = false">关 闭</el-button>
          <el-button type="primary" @click="submitskuAssigned();skuAssigned.storehouse = true;"  >保  存</el-button>
        </div>
      </el-dialog>-->
      <!--添加商品2.0  2018.3.5-->
      <el-dialog title="添加商品" :visible.sync="dialogFlag.addisopen" size="small" :modal="false"  :modal-append-to-body="false" :close-on-click-modal="false"  @open="reFlash"  @close="changeOpen" class="add_product_wrap " id="add_product_wrap">
        <categoryProduct :default-key="defaltKey" ref="proData"></categoryProduct>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.addisopen = false">取消</el-button>
          <el-button type="primary" @click="addPro" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑采购信息2.0  2018.3.5-->
      <el-dialog title="编辑产品采购信息" :visible.sync="dialogFlag.purchaseisopen" size="small" :modal-append-to-body="false"  :close-on-click-modal="false" class="add_product_wrap " id="add_product_wrap">
        <purchase-dialog-new  ref="purchaseDialogEdit"  title="编辑产品采购信息"   :purchaseparentinfo-detail="2" :product-id="pagefilters.productId"
                         :input-disabled="false"  v-on:parentmsggll="purparentmsgg"  :docment-null="dialogFlag.docmentNull"></purchase-dialog-new>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.purchaseisopen = false">取消</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--商品图片编辑2.0  2018.3.5-->
      <el-dialog title="上传图片" :visible.sync="dialogFlag.imageisopen" size="small"  :modal-append-to-body="false" :close-on-click-modal="false" class="add_product_wrap " id="add_product_wrap">
        <images-dialog @assignment="imageData"  @assignment3="imageData3"
                       @assignment4="imageData4" @assignment2="imageData2"
                       :disState="true"
                       :Selected="pagefilters"
                       :docment-null="true"
                       :isOpen="dialogFlag.imageisopen"></images-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.imageisopen = false">取消</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--调整分类classify-->
      <el-dialog :title="classifyData.title" :visible.sync="dialogFlag.classifyisOpen" size="mini" >
        <el-form :label-width="financeFormLabelWidth" v-model="classifyData">
          <el-form-item label="原分类" v-if="classifyData.batchAdjustment == false">
           <!--<span v-if="classifyData.batchAdjustment == true">批量调整，包含多个商品分类</span>-->
            <el-row v-if="classifyData.batchAdjustment == false">
              <el-col :span="12">一级:{{classifyData.batchOne}}</el-col>
              <el-col :span="12">二级:{{classifyData.batchTwo}}</el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="调整">
            <el-cascader
              expand-trigger="hover"
              clearable
              :options="options"
              :props="props"
              v-model="selectedOptions"
              @change="handleChange"
              :disabled="dialogFlag.inputDisabled"
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.classifyisOpen = false">关 闭</el-button>
          <el-button type="primary" @click="submitAdjustment('classify');" :loading="$store.state.loading">保 存</el-button>
        </div>
      </el-dialog>
     <!--调整销售状态-->
      <el-dialog :title="dialogFlag.salesTitle" :visible.sync="dialogFlag.salesisOpen" size="mini">
        <el-form :label-width="financeFormLabelWidth" >
          <el-form-item label="销售状态">
            <el-select  filterable clearable  v-model="salesOptionsdata.salesStatus" :allow-create="true" :placeholder="placeholder"  >
              <el-option v-for="item in salesOptionsdata.salesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.salesisOpen = false">关 闭</el-button>
          <el-button type="primary" @click="submitAdjustment('sales');dialogFlag.classifyisOpen = false" :loading="$store.state.loading">保 存</el-button>
        </div>
      </el-dialog>
      <!--筛选-->
      <screen-dialog :screendialog-flag="screen" :recovery="true"   @parent-screen="screenChange"></screen-dialog>
      <!--所有人员-->
      <el-dialog title="添加人员"  :visible.sync="dialogFlag.Fullisopen"  class="headerBorder" :close-on-click-modal="false" >
        <get-allpersonnel @childValue="getChildValue" ></get-allpersonnel>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.Fullisopen = false;">关 闭</el-button>
          <el-button type="primary" @click="submitselected()" :loading="$store.state.loading">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="page" class="block page">
      <el-pagination
        @size-change="handleSizeChange('0',$event)"
        @current-change="handleCurrentChange('0',$event)"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50,100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>
      <!------------------导入手工订单 弹出框--------------------------->
      <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="requestem"></import-dialog>

    </div>
  </div>
</template>
<script>
  import categoryProduct from "components/singleTableData/addProduct";
  import { msgDialog,assistDialogNew,purchaseDialogNew,describeDialog,portfolioDialog,problemDialog,imagesDialogNew,logisticsDialog,screenDialog,getAllpersonnel} from 'views/product/import_modular';
  import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
  export default{
      components: {
        ElDialog,
        msgDialog,//基本信息
        assistDialogNew,//辅助信息
        purchaseDialogNew,//采购信息
        describeDialog,//详细描述
        imagesDialogNew,//商品图片
        logisticsDialog,//物流方式
        problemDialog,//产品问题
        portfolioDialog,//组合商品
        categoryProduct,//组合商品-添加商品
        screenDialog,//筛选
        getAllpersonnel//所有人员
      },
        data(){
            return {
              importData:{
                isOpen:false,
                importUrl:'productLeading/importProductInfo',
                modalUrl:'productLeading/exportModel',
              },
              ButtonInfo:{},//按钮权限列表20171227
              hasdataa:false,
              errorData:[],
              fullNum:'',
              fullList:[],//添加人员Id集合
              screen:{
                screenisOpen:false,
                salesStatus:'1'
              },
              requiredsubmit:false,
              require:false,
              activeNames: ['1'],    //  筛选 功能的折又又叠面板
              placeholder:'请选择',
            	//分类级联
              props:{
                value:'categoryId',
                label:'cnName',
                children:'categorys'
              },
              options: [],
              selectedOptions: [],
              //调整销售状态
              salesOptionsdata:{
                salesOptions:[
                  {
                    value:'1',
                    label:'正常销售'
                  },
                  {
                    value:'2',
                    label:'清货销售'
                  },
                  {
                    value:'3',
                    label:'暂停销售'
                  },
                  {
                    value:'4',
                    label:'卖完不再销售'
                  },
                  {
                    value:'5',
                    label:'侵权不再销售'
                  },
                  {
                    value:'6',
                    label:'回收站'
                  },

                ],
                salesStatus:''
              },
              //搜索下拉值
              selectOptions: [{
                value: 'SKU',
                label: 'SKU'
              }, {
                value: '产品名称',
                label: '产品名称'
              }],
              optionVal:'',    // 下拉选项值
              selectParams:{    //  下拉过滤
                optionValue:'',
                optionTitle:'SKU',
              },
              financeFormLabelWidth: '90px',
              //分类
              classifyData:{
                batchAdjustment: false,
                batchOne:'一级分类',
                batchTwo:'二级分类',
                title:''
              },
              //仓库分配与销售弹窗
              skuAssigned:{
                warehouseInfo:[],
                listMap:[],
                inputDisabled:false,
                label:'',
                storehouse:true,//仓库与销售切换
                isIndeterminate: false,
                checkList:[],//仓库列表
              },
              //产品问题
              problemDialog:{
                ask:'',
                issueId:''
              },

              problem:{
              	ask:'',
                problemparentForm:[
                  {
                    productId: '',
                    askTime: '',
                    askUser: '',
                    askTitle: '',
                    askContent: '',
                    issueId:''

                  }
                ]
              },
              //添加组合商品
              assistlist:{
              	dialoglist:[],
                data:[],
                defaultProps:{
                  label:'cnName',
                  children:'categorys'
                },
                listData:[],
                page: {
                  currentPage: 1, //当前页数
                  pageSize: 10, //每页条数
                  totalCount: 0, //总共条数
                  totalPage: 0, //总共页数
                  listData: []
                },
                pagefilters:{
                  skuNo:'',
                  cnName:'',
                  FNSKU:'',
                  includeAssemby:'0',
                  categoryId:'',
                  currentPage:1,
                  pageSize:10
                },
                classifybuteTree:[],
                optionVal:'',    // 下拉选项值
                selectParams:{    //  下拉过滤
                  optionValue:'',
                  optionTitle:'SKU',
                },
                selectOptions: [{
                  value: 'SKU',
                  label: 'SKU'
                }, {
                  value: '产品名称',
                  label: '产品名称'
                }, {
                  value: 'FNSKU',
                  label: 'FNSKU'
                }],

              },
              listData:[],
              //查看+编辑+添加
              dialogFlag: {
                imageisopen:false,
                purchaseisopen:false,
                addisopen:false,
                isOpenErr:false,//  批量导入异常框
                isOpenLead:false,//  批量导入框
              	Fullisopen:false,
                isOpen: false,
                problemisOpen:false,
                assistisOpen:false,
                houseisOpen:false,
                classifyisOpen:false,
                screenisOpen:false,
                salesisOpen:false,
                infoDetail: false,
                docmentNull:false,//文档名
                prlblemLabel:'',
                prlblemask:false,
                dialogTitle: "",
                problemTitle:'',
                salesTitle:'',
                houseTitle:'',
                inputDisabled: false,  //区分编辑和查看
                addDialog: true,//区分产品和组合产品
                activeTab:'1'
              },

                //分页得到的数据集合
                page: {
                  currentPage: 1, //当前页数
                  pageSize: 10, //每页条数
                  totalCount: 0, //总共条数
                  totalPage: 0, //总共页数
                  listData: []
                },
                //过滤返回数据
                pagefilters: {
                  isAssemby:'0',
                  productId:'',
                  currentPage: 1,
                  pageSize: 10,
                  skuNo: '',
                  cnName:'',
                  categoryId:'',
                  developUserId:'',
                  purchaseUserId:'',
                  photographyUserId:'',
                  imageDesignUserId:'',
                  salesStatus:'1',
                  warehouseId:'',
                  salesUserId:'',
                  logisticsState:'',
                },
              skuAssignedForm:{
                productIds:[],
                warehouseIds:[],
                salesUserIds:[]
              },
              msgparentForm: {}, // 基本信息
              purchaseparentForm:{},//采购信息
              assistparentForm:{},//辅助信息
              describeparentForm:{},//详细描述
              oneImageId:'',
              ImgFrom:[],
              ImgFrom2:[],
              ImgFrom3:[],
              ImgFrom4:[],
              logisticsparentForm:{},//物流方式
              productId:'',
              //批量
              batchList:[],
              batchList2:[],
              batchproductId:[],
              reg: /^\d{1,9}$/,
              status:true,
              tabArr:['0','1','2','3','4','5','6'],     // tab 标签页数组
              exportUrl:'',
              logisticsInfo:false,
            }
        },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
      },
      getPlaceholderr:function(){
        return this.assistlist.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.assistlist.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :this.assistlist.selectParams.optionTitle == 'FNSKU'?'FNSKU':'';
      },
    },
    mounted: function () {

      this.getauthorityList();
       this.requestem();
       //this.exportUrl=this.RmsUrl+'product/exportProductDate?Authorization='+sessionStorage.getItem('userSession')+'&salesStatus='+this.pagefilters.salesStatus;
    },
        methods: {
          /*********************页面按钮权限 20171227*****************************/
          getauthorityList(){
            var vm=this;
            vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
            console.log('horityList % 0',vm.ButtonInfo)

          },
          /*********************页面按钮权限 20171227*****************************/


          /*********************2.0  2018.3.4*****************************/
          openimage(row){
            this.pagefilters.productId=row.productId;
            this.dialogFlag.imageisopen=true;
          },
          openpurchase(row){
          	var that=this;
          	this.pagefilters.productId=row.productId;
          	//setTimeout(function(){  that.$refs.purchaseDialogEdit.requestem();},20)
            this.dialogFlag.purchaseisopen=true;
          },
          changeOpen(){
            var vm=this;
            vm.$nextTick(
              vm.$refs.portfolioDialog.changeaddisopen()
          )
          },
          getPortfolioIsOpen(val){
          	val.isopen==true?this.dialogFlag.addisopen = true: this.dialogFlag.addisopen = false;
          },

          reFlash:function(){
            var vm=this;
            vm.$nextTick(
              vm.$refs.proData.clearSels(),
              vm.$refs.proData.resetData(),

            )
          },
          addPro: function () {
            var vm = this,data = [];
            data=JSON.parse(JSON.stringify(vm.$refs.portfolioDialog.returnData()));
            console.log('999 %0',vm.$refs.portfolioDialog.returnData());
            var selectData = JSON.parse(JSON.stringify(vm.$refs.proData.returnData()));
            var idList = data.map(item =>item.productId);
            var flag = selectData.every(function(item){
              return idList.indexOf(item.productId) == -1;
            })
            if(flag){
              selectData.forEach(item =>{
                data.unshift({productId:item.productId,sku:item.skuNo,name:item.cnName,img:item.imageUrl,num:'',imageId:item.imageId});
              })
              vm.dialogFlag.addisopen = false;
              vm.$refs.portfolioDialog.changeData(data);
            }else{
              this.$message('不能选择已经添加的商品！');
            }
          },
          /*********************2.0  2018.3.4*****************************/
          getLogisticsVlaue(val){
          	this.logisticsInfo=val.value;
          },
        	//导出
          exportList(url){
           var urlLink=this.RmsUrl+'product/exportProductDate?Authorization='+sessionStorage.getItem('userSession')+'&salesStatus='+url;
           window.open(urlLink);
           console.log('urlLink===',urlLink)
          },
        	//人员添加
          submitselected(){
          var obj={};
          obj.userIds=this.fullList;
          if(this.fullList.length<1){
          	this.$message('请至少选择一个人员！')
          }else{
            this.fullNum == '1' ? obj.userGroup= '开发人员' :  this.fullNum == '2' ? obj.userGroup= '跟单人员' :this.fullNum == '3' ? obj.userGroup= '美工人员':this.fullNum == '4'?obj.userGroup= '摄影人员':'';
            this.httpPost('productUserGroup/updateList',obj).then(res=>{
              this.fullList=res.data;
              this.dialogFlag.Fullisopen=false;
            })
          }
          },
          getChildValue(val){
          	this.fullList = val.value;
          },
          getchildFull(data){
           this.dialogFlag.Fullisopen = true;
           this.fullNum=data;
          },
          goPrev:function(){

            this.dialogFlag.activeTab = this.tabArr[this.tabArr.indexOf(this.dialogFlag.activeTab)-1];
          },
          goNext:function() {
            this.dialogFlag.activeTab = this.tabArr[this.tabArr.indexOf(this.dialogFlag.activeTab) + 1];
          },
          screenData(){
            this.screen.salesStatus = this.pagefilters.salesStatus;
          },
          ResetFrom(){
          	if( this.dialogFlag.activeTab == 0 ){
              this.$refs.msgDialog.ResetFrom();
            }
            if(this.dialogFlag.dialogTitle=='查看组合商品完整资料（含供应商）' || this.dialogFlag.dialogTitle=='查看组合商品基础资料（不含供应商）' || this.dialogFlag.dialogTitle=='编辑组合商品基础资料' || this.dialogFlag.dialogTitle=='新增组合商品基础资料'){
              this.$refs.portfolioDialog.restData();

            }
            this.$refs.assistDialog.ResetFrom();
            if(this.dialogFlag.dialogTitle=='查看组合商品完整资料（含供应商）' || this.dialogFlag.dialogTitle=='查看非组合商品完整资料（含供应商）'){
              //this.$refs.purchaseDialog.ResetFrom();
            }
            this.$refs.describeDialog.ResetFrom();
/*
            this.$refs.logisticsDialog.removeForm();
*/
            this.dialogFlag.activeTab = '0';
            this.assistparentForm.combinations = [];
          },
          clearValue(val){
          	val == '0' ? this.selectParams.optionTitle = 'SKU' : this.assistlist.selectParams.optionTitle = 'SKU'
          },
          handleCheckedCitiesChange(val){
          	this.skuAssignedForm.warehouseIds = val;
          },
          imageData(val){
            this.ImgFrom2=val;
            console.log(val)
          },
          imageData3(val){
            this.ImgFrom3=val;
            console.log(val)
          },
          imageData4(val){
            this.ImgFrom4=val;
            console.log(val)
          },
          imageData2(val){
            this.oneImageId=val;
            console.log(val)
          },
          submitAssilist(){
          //  alert(9999)
          	this.hasdataa=!this.hasdataa;
            //this.assistlist.dialoglist=this.batchList2;
          	var _this=this;
            let goodsDialog = this.$refs.assistDialog.prentData();
            console.log(9999999999999)
             console.log('this.assistparentForm22222 % 0==',goodsDialog)

            let ids = goodsDialog.map(item =>item.productId);
            let goodsbatchList = _this.batchList2;
            var flag = goodsbatchList.every(function(item){
              return ids.indexOf(item.productId) == -1;
            });
            if(flag){
              goodsbatchList.forEach(item =>{
                goodsDialog.unshift(item);
              })
              _this.assistlist.dialoglist=goodsDialog;
              this.dialogFlag.assistisOpen = false;
            }else{
              this.$message('不能选择已经添加的商品！');
            }
          },
          handleNodeClick(data){
            this.assistlist.pagefilters.categoryId = data.categoryId;
            this.getlist();
          },
          //产品问题
          addask(val){
            this.problemDialog.issueId=val
          },
          getProductQuest(){
          	var _this=this;
            _this.httpPost('productDevInfo/getProductQuest?productId='+_this.pagefilters.productId).then(res=>{
              if(res.data == []){
                _this.dialogFlag.prlblemask = false;
              }else{
                _this.problem.problemparentForm = res.data;
                for(var i=0;i<_this.problem.problemparentForm.length;i++){
                  _this.problem.problemparentForm[i].askTime = _this.tool.formatDate('','',_this.problem.problemparentForm[i].askTime)
                }
              }

            })
          },
          addProblem:function(val,From){
                var _this=this;
               _this.$refs[From].validate((valid) => {
              if (valid){
                if(val == '添加提问'){
                  _this.httpGet('productDevInfo/postProductQuest?productId='+_this.pagefilters.productId+'&askTitle='+_this.problemDialog.ask).then(res=>{
                    if(res.data.result == true){
                    	_this.dialogFlag.prlblemask = true;
                      _this.getProductQuest();
                      _this.dialogFlag.problemisOpen = false;
                    }else{
                      _this.dialogFlag.prlblemask = false;
                      _this.$message(res.data.message)
                    }
                  });
                }else if(val == '我来回答'){
                  var quest ={};
                  quest.productId = _this.pagefilters.productId;
                  quest.askContent = _this.problemDialog.ask;
                  quest.issueId = this.problemDialog.issueId;
                  _this.httpPost('productDevInfo/patchProductQuest',quest).then(res=>{
                    if(res.data.result == true){
                      _this.getProductQuest();
                      _this.dialogFlag.problemisOpen = false;
                    }else {
                      _this.$message(res.data.message)
                    }
                  });
                }
              }else{
              	_this.$message('请输入合法数据！')
              }

            })
          },
          tabclick(val){
          if( val.index == 6 && this.dialogFlag.docmentNull == true){
            this.getProductQuest();
          }
          },
          //入口
          requestem(){
            this.httpPost('product/listProduct',this.pagefilters).then(res => {
              this.listData = res.data.listData;
              this.page = res.data;
              this.status=true;
            })
          },
          //搜索确认
          selectFilter:function(val){
          	if(val == '0'){
              this.status=false;
              if(this.selectParams.optionValue == '' ){
                this.pagefilters.skuNo = '';
                this.pagefilters.cnName='';
                this.pagefilters.developUserId ='' ;
                this.pagefilters.imageDesignUserId = '';
                //this.pagefilters.logisticsState = '';
                this.pagefilters.photographyUserId = '';
                this.pagefilters.purchaseUserId = '';
                this.pagefilters.categoryId = '';
                this.pagefilters.salesUserId = '';
                this.pagefilters.warehouseId = '';
                this.requestem();
              }else {
                var value = this.selectParams.optionValue;
                var title = this.selectParams.optionTitle;
                if(value == '' || title == '' ){

                }else{
                  var vm =this;
                  if(title == 'SKU'){
                    vm.pagefilters.skuNo=value;
                    vm.pagefilters.cnName='';
                    this.pagefilters.developUserId ='' ;
                    this.pagefilters.salesUserId = '';
                    this.pagefilters.imageDesignUserId = '';
                    //this.pagefilters.logisticsState = '';
                    this.pagefilters.photographyUserId = '';
                    this.pagefilters.purchaseUserId = '';
                    this.pagefilters.categoryId = '';
                    this.pagefilters.warehouseId = '';
                  }else if(title == '产品名称'){
                    vm.pagefilters.cnName=value;
                    vm.pagefilters.skuNo='';
                    this.pagefilters.developUserId ='' ;
                    this.pagefilters.imageDesignUserId = '';
                    //this.pagefilters.logisticsState = '';
                    this.pagefilters.photographyUserId = '';
                    this.pagefilters.purchaseUserId = '';
                    this.pagefilters.categoryId = '';
                    this.pagefilters.warehouseId = '';
                  }
                  vm.pagefilters.salesStatus='';
                  this.requestem();
                }
            }
            }else if(val == '1'){
              if(this.assistlist.selectParams.optionValue == '' ){
                this.assistlist.pagefilters.skuNo='';
                this.assistlist.pagefilters.cnName='';
                vm.assistlist.pagefilters.FNSKU='';
                this.getlist();
              }else{
                var value = this.assistlist.selectParams.optionValue;
                var title = this.assistlist.selectParams.optionTitle;
                if(value == '' || title == '' ){

                }else{
                  var vm =this;
                  if(title == 'SKU'){
                    vm.assistlist.pagefilters.skuNo=value;
                    vm.assistlist.pagefilters.cnName='';
                    vm.assistlist.pagefilters.FNSKU='';

                  }else if(title == '产品名称'){
                    vm.assistlist.pagefilters.cnName=value;
                    vm.assistlist.pagefilters.skuNo='';
                    vm.assistlist.pagefilters.FNSKU='';
                  }else if(title == 'FNSKU'){
                    vm.assistlist.pagefilters.cnName='';
                    vm.assistlist.pagefilters.skuNo='';
                    vm.assistlist.pagefilters.FNSKU=value;
                  }
                    this.getlist();
                }
              }
              }
          },
          //用户列表状态切换
          requestemStart(value,status){
            if(value != '' && status === true){
              this.pagefilters.currentPage = 1;
              this.pagefilters.skuNo='';
              this.pagefilters.cnName='';
              this.selectParams.optionValue='';
              this.pagefilters.developUserId ='' ;
              this.pagefilters.imageDesignUserId = '';
              this.pagefilters.salesUserId = '';
              this.pagefilters.photographyUserId = '';
              this.pagefilters.purchaseUserId = '';
              this.pagefilters.categoryId = '';
              this.pagefilters.warehouseId = '';
              this.requestem();
            }
          },
          //批量
          handleSelectionChange(val){
            this.batchList = val;
          },
          handleSelectionChange2(val){
          	  this.batchList2=[];
              this.batchList2=val;
          },
          //点击调整状态
           batchSales(row,val,state){
              var _this = this;
              var ids = _this.batchList.map(item => item.productId),productId=[];
              val == '1' ? productId = ids : productId.push(row.productId);
              if(productId.length == 0){
                _this.$message('请至少选择一项！')
              }else{
                  if(state == 'sales' ){
                    _this.dialogFlag.salesisOpen = true;
                    _this.salesOptionsdata.salesStatus = row.salesStatus;
                  }else{
                    _this.dialogFlag.classifyisOpen = true;
                    this.selectedOptions = [];
                    _this.getadjustClassify(row);
                  }
                this.batchproductId = productId;
              }
           },
          //调整状态提交
          submitAdjustment(state){
              var _this=this;
              var adjustalesStatus ={};
              adjustalesStatus.productIds = this.batchproductId;
              state == 'sales' ? adjustalesStatus.salesStatus = _this.salesOptionsdata.salesStatus : adjustalesStatus.categoryId = _this.pagefilters.categoryId;
              var url='';
              state == 'sales' ? url = 'product/adjustTheSalesStatus' : url = 'product/adjustClassify';
              _this.httpPost(url,adjustalesStatus).then(res => {
                console.log('返回的参数 % 0',adjustalesStatus)
                if(res.data.result == true){
                  _this.$message(res.data.message)
                  state == 'sales' ? _this.dialogFlag.salesisOpen = false : _this.dialogFlag.classifyisOpen = false;
                  _this.pagefilters.categoryId ='';
                  _this.requestem();
                }else {
                  _this.$message(res.data.message)
                }
              })
          },
          getlistall(){
          	this.assistlist.pagefilters.skuNo='';
            this.assistlist.pagefilters.cnName='';
            this.assistlist.pagefilters.categoryId='';
            this.assistlist.pagefilters.currentPage=1;
            this.assistlist.pagefilters.pageSize=10;
          	this.getlist();
          },
          getadjustClassify(row){
            var _this = this;
            this.productId = row.productId;
            this.classifyData.batchOne = row.oneCategoryName;
            this.classifyData.batchTwo = row.twoCategoryName;
            this.httpPost('productCategory/getList').then( res => {
              _this.options = res.data;
              var digui = function(val){
                for( var i=0;i<val.length;i++ ){
                  if(val[i].categorys){
                    if(!val[i].categorys.length){
                      delete val[i].categorys;
                    }else{
                      digui(val[i].categorys);
                    }
                  } else{
                    continue;
                  }
                }
              };
              digui(_this.options);
              digui(_this.assistlist.data);
            })
          },
          //分类
          handleChange(val){
            console.log('555% 0',this.selectedOptions)
            var optionsValue = val[val.length-1]
            this.pagefilters.categoryId = optionsValue;
          },
          //分配仓库与销售
          closeForm(){
              this.skuAssigned.storehouse = true;
              this.skuAssignedForm.productIds=[];
              this.skuAssignedForm.warehouseIds=[];
              this.skuAssignedForm.salesUserIds=[];
          },
          houseAssigned(row,val){
            var _this=this;
            var ids = _this.batchList.map(item => item.productId),productId=[];
            val == '1' ? productId = ids : productId.push(row.productId);
            _this.skuAssignedForm.productIds = productId;
            if(productId.length == 0){
              _this.$message('请至少选择一项！')
            }else{
              _this.dialogFlag.houseisOpen = true;
              if(val == '0'){
                let productId = row.productId
                //const getquerySales=_this.httpPost('product/querySales?productId='+productId);//勾选人员
                const getproductquerySignWarehouse=_this.httpPost('product/querySignWarehouse?productId='+productId);//勾选仓库
                _this.$http.all([getquerySales,getproductquerySignWarehouse]).then(this.$http.spread(function(salesInfo,SignWarehouse){
                   for(let i=0;i<SignWarehouse.data.length;i++){
                     _this.skuAssignedForm.warehouseIds.push(SignWarehouse.data[i].warehouseId)
                   }
                }))
              }else{
                _this.skuAssignedForm.warehouseIds=[];
              }
              const getqueryDeptAndUser = this.httpPost('product/queryDeptAndUser');
             // const getqueryWarehouseType = this.httpPost('product/queryWarehouseType');
              const getquerySales=_this.httpPost('product/querySales?productId='+productId);//勾选人员
              _this.$http.all([getqueryDeptAndUser,getquerySales]).then(this.$http.spread(function(andUserfo,querySales){
                 // _this.skuAssigned.warehouseInfo = warehouseInfo.data;
                  _this.skuAssigned.listMap = andUserfo.data;
                  console.log('999999 % 0====',andUserfo.data)
                for(let i=0;i<_this.skuAssigned.listMap.length;i++){
                  let item=_this.skuAssigned.listMap[i];
                  _this.$set(item,"checkedUsers",[]);
                  if(val === '0'){
                    _this.getCurCheckedUsers(querySales.data,item);
                  }
                  _this.$set(item,"checkAll",(_this.skuAssigned.listMap[i].checkedUsers.length>=_this.skuAssigned.listMap[i].salesUserList.length && _this.skuAssigned.listMap[i].checkedUsers.length > 0?true:false));
                  _this.$set(item,"isIndeterminate",(_this.skuAssigned.listMap[i].checkedUsers.length>0&&_this.skuAssigned.listMap[i].checkedUsers.length<_this.skuAssigned.listMap[i].salesUserList.length?true:false));
                }
                  for(let i=0;i<_this.skuAssigned.listMap.length;i++){
                    _this.skuAssignedForm.salesUserIds =_this.skuAssigned.listMap[i].checkedUsers
                  }
                })
              )
            }
          },
         /* handleCheckAllChange(item) {
            let _this=this;
            let users=[];
            for(let i=0;i<item.salesUserList.length;i++){
              users[i]=item.salesUserList[i].userId;
            }
            item.checkedUsers=[];
            if(item.checkAll){
              item.checkedUsers=users;
            }
            console.log(users);
            console.log(item);

            let checkedUserList=[];
            for(let i=0;i<_this.skuAssigned.listMap.length;i++){
              if(_this.skuAssigned.listMap[i].checkedUsers!==""){
                checkedUserList.push(_this.skuAssigned.listMap[i].checkedUsers);
              }
            }
            //console.log("allChecked2:",checkedUserList.join(',').split(','));
          },
          getCurCheckedUsers(allCheckedUsers,item){
          	console.log('item % 0',item)
            let checkedUsers=[];
            for(let i=0;i<allCheckedUsers.length;i++){
              for(let j=0;j<item.salesUserList.length;j++){
                if(allCheckedUsers[i].salesUserId === item.salesUserList[j].userId){
                  checkedUsers.push(allCheckedUsers[i]);
                  break;
                }
              }
            }
            console.log('checkedUsers6666666 % 0====',checkedUsers);
            return checkedUsers;
          },
          handlecheckedperNameChange(item) {
            let _this=this;
            let listMapObj=_this.skuAssigned.listMap;
            console.log(listMapObj)
            for(let j=0;j<listMapObj.length;j++){
              let checkedUsersLen=listMapObj[j].checkedUsers.length;
              let salesUserListLen=listMapObj[j].salesUserList.length;
              _this.$set(listMapObj[j],"checkAll",(checkedUsersLen>=salesUserListLen?true:false));
              _this.$set(listMapObj[j],"isIndeterminate",(checkedUsersLen>0&&checkedUsersLen<salesUserListLen?true:false));
            }
          },*/
          getCurCheckedUsers(allCheckedUsers,item){
            var userIdList = item.salesUserList.map(a =>a.userId);
            var allList = allCheckedUsers.map(a =>a.salesUserId);
            for(let i=0;i<allList.length;i++){
              console.log('userIdList % 0==',userIdList)
            	if(userIdList.indexOf(allList[i])!=-1){
                item.checkedUsers.push(allList[i]);
              }
            }
            return item.checkedUsers;
          },
          senduserList(item,num){
          	var _this=this;
            _this.skuAssignedForm.salesUserIds = [];
          	let users=[];
          	if(num == '0'){
              for(let i=0;i<item.salesUserList.length;i++){
                users[i]=item.salesUserList[i].userId;
              }
              item.checkedUsers=[];
              if(item.checkAll){
                item.checkedUsers=users;
              }
            }else if(num == '1'){
              for(let i=0;i<item.checkedUsers.length;i++){
                users[i]=item.checkedUsers[i];
              }
              if(item.checkedUsers.length==item.salesUserList.length){
                item.checkedUsers.length > 0 ? item.checkAll = true: '';
              }else{
                item.checkAll = false;
              }
            }
            let checkedUserList=[];
            for(let i=0;i<_this.skuAssigned.listMap.length;i++){
              if(_this.skuAssigned.listMap[i].checkedUsers!=""){
                checkedUserList.push(_this.skuAssigned.listMap[i].checkedUsers);
              }
            }
            _this.skuAssignedForm.salesUserIds = checkedUserList.join(',').split(',')
          },
          handleCheckAllChange(item) {
          	this.senduserList(item,'0');
          },
          handlecheckedperNameChange(item) {
          	this.senduserList(item,'1');
          },
          submitskuAssigned(){
          	   delete this.skuAssignedForm.warehouseIds;
               this.httpPost('/product/updateWarehouseSales',this.skuAssignedForm).then(res=>{
                 if(res.data.result == true){
                   this.dialogFlag.houseisOpen = false;
                   this.$message(res.data.message)
                 }else{
                 this.$message(res.data.message)
                 }
               })
          },
          //查看与编辑
          getCreateIssues(row,val,title){
          	var that=this;
           // alert(!this.dialogFlag.docmentNull)
            this.dialogFlag.docmentNull = true;
            this.dialogFlag.dialogTitle=title;
            //this.dialogFlag.dialogTitle = val ? '查看' : '编辑';
            this.dialogFlag.isOpen=true;
            this.pagefilters.productId = row.productId;
            setTimeout(()=>{
            	//alert(77)
              this.$refs.problemDialog.getProductQuest();
              this.$refs.msgDialog.requestem();
              this.$refs.assistDialog.requestem();
              if(this.dialogFlag.dialogTitle=='查看组合商品完整资料（含供应商）' || this.dialogFlag.dialogTitle=='查看非组合商品完整资料（含供应商）') {
                that.$refs.purchaseDialog.requestem();
              }
              this.$refs.describeDialog.getLanguage();
              this.$refs.describeDialog.addlang();
/*
              this.$refs.logisticsDialog.getLogisTypeForm(this.pagefilters.productId);
*/

            },20);
            this.dialogFlag.activeTab = '0';
          },
          //新增
          getaddCreateIssues(val,title){
          	//alert(!this.dialogFlag.docmentNull)
            this.dialogFlag.docmentNull =false;
            this.dialogFlag.isOpen=true;
            this.dialogFlag.dialogTitle = title ;
            this.dialogFlag.activeTab = '0';
            setTimeout(()=>{
              this.$refs.assistDialog.newForm();
              this.$refs.describeDialog.addlang();
            },20);
            this.httpGet('product/createProductId').then(res=>{
              this.pagefilters.productId = res.data;
/*
              this.$refs.logisticsDialog.getLogisTypeForm(this.pagefilters.productId);
*/
            })


          },
          parentMsg(data){
            this.msgparentForm = data.vendorInfoModel;
            this.require = data.require
            if(this.msgparentForm.spuInfo.spuId == ''){
              this.msgparentForm.spuInfo.spuId = data.supId;
            }
          // console.log('第一个基本儿子给的 % O',data)
          },
          assiparentmsgg(data){
          //  console.log('第二个辅助儿子给的 % O',data.assistInfoModel)
            this.assistparentForm = data.assistInfoModel;
          },
          //辅助信息添加组合商品
          getlist(){
            this.httpPost('product/listCargo',this.assistlist.pagefilters).then(res=>{
              this.assistlist.page = res.data;
              this.assistlist.listData = res.data.listData;
            });
          },
          getassdialog(val){
          	var _this = this;
            _this.dialogFlag.assistisOpen = true;
            _this.getlist();
            _this.httpPost('productCategory/getList').then( res => {
              _this.assistlist.data = res.data;
              var digui = function(val){
                for( var i=0;i<val.length;i++ ){
                  if(val[i].categorys){
                    if(!val[i].categorys.length){
                      delete val[i].categorys;
                    }else{
                      digui(val[i].categorys);
                    }
                  } else{
                    continue;
                  }
                }
              };
              digui(_this.assistlist.data);
            })
          },
          purparentmsgg(data){
          	console.log('第三个 % 0',data)
            this.purchaseparentForm = data;
          },
          pustdescribe(data){
          	this.describeparentForm = data;
          },
          //筛选
          screenChange(data){
          	console.log('data % 0====',data)
            this.screen.screenisOpen = data.dialog;
            if(data.dialog == false){
              this.listData = data.list.listData;
              this.page = data.list;
              this.pagefilters.salesStatus = data.status.salesStatus;
              this.pagefilters.salesUserId = data.status.salesUserId;
              this.pagefilters.developUserId = data.status.developUserId;
              this.pagefilters.imageDesignUserId = data.status.imageDesignUserId;
              //this.pagefilters.logisticsState = data.status.logisticsState;
              this.pagefilters.photographyUserId = data.status.photographyUserId;
              this.pagefilters.purchaseUserId = data.status.purchaseUserId;
              this.pagefilters.skuNo = data.status.skuNo;
              this.pagefilters.cnName = data.status.cnName;
              this.pagefilters.categoryId = data.status.categoryId;
              this.pagefilters.cnName = data.status.cnName;
              this.pagefilters.warehouseId = data.status.warehouseId;
              this.status = true;
            }
          },
          //添加+编辑保存提交
          submitDialogForm(){
          	var vm=this;
          	//alert(999)
            if(this.dialogFlag.activeTab == 0){
              var add = this.$refs.msgDialog.submitForm();
              var _this=this;
              if(add == true){
                if(_this.dialogFlag.addDialog == true){
                  _this.msgparentForm.isAssemby = true;
                }else{
                  delete _this.msgparentForm.isAssemby;
                }
                _this.msgparentForm.productId = _this.pagefilters.productId;
                _this.msgparentForm.attributeIds = _this.msgparentForm.attributeTree;
                let msgparentForm = JSON.parse(JSON.stringify(_this.msgparentForm));
                delete msgparentForm.classifybuteTree;
                delete msgparentForm.attributeTree;
                console.log('msgparentForm % 0===',msgparentForm)
                this.httpPost('product/editBasicMessage',msgparentForm).then(res => {
                  if(res.data.result == true){
                    _this.$message(res.data.message)
                    if(_this.dialogFlag.prlblemask == true){
                      //_this.dialogFlag.isOpen = false;
                      _this.requestem();
                    }else{
                      _this.goNext();
                    }
                  }else{
                    _this.$message(res.data.message)
                  }
                })
              }
            }
            else if(this.dialogFlag.activeTab == 1){
            	var _this=this;
              var add = _this.$refs.assistDialog.submitForm();
              if(add == true){
                _this.assistparentForm.productId= _this.pagefilters.productId;
             /*   if(_this.dialogFlag.addDialog === true || _this.assistparentForm.isAssemby === true){
                  let qtyArr = _this.assistparentForm.combinations.map(item => item.qty);
                  if(qtyArr.length  > 0){
                  	var aa=false;
                    for(let i=0;i<qtyArr.length;i++){
                      if(! this.reg.test(qtyArr[i])){
                        _this.$message('产品的数量只能填写整数且长度不超过9位！');
                        aa=false
                      }else {
                      	aa=true;
                      }
                    }
                    if(aa==true){
                      delete _this.assistparentForm.isAssemby;
                      _this.assistSubmit(_this.assistparentForm);
                    }
                  }else{
                    delete _this.assistparentForm.isAssemby;
                    _this.assistSubmit(_this.assistparentForm);
                  }
                }else{}*/
                  delete _this.assistparentForm.isAssemby;
                 _this.assistSubmit(_this.assistparentForm);

              }
            }
            else if(this.dialogFlag.activeTab == 2){
              var add = this.$refs.purchaseDialog.submitForm();

              if(add == true){
                // this.requiredsubmit = true;
                //console.log('this.purchaseparentForm % 0',this.purchaseparentForm)
                //this.purchaseparentForm.productId = this.pagefilters.productId;
                this.httpPost('product/editPurchaseMessage',this.purchaseparentForm).then(res => {
                  if(res.data.result == true){
                    this.$message(res.data.message);
                    if(this.dialogFlag.prlblemask === true){
                      //this.dialogFlag.isOpen = false;
                      this.requestem();
                    }else{
                      this.goNext();
                    }
                  }else{
                    this.$message(res.data.message)
                  }
                })
              }
            }
            else if(this.dialogFlag.activeTab == 3){
             var add = this.$refs.describeDialog.submitForm();
              if(add == true){
               /* this.describeparentForm.productId = this.pagefilters.productId;*/
              // this.describeparentForm.id = 0;
                this.httpPost('productDevInfo/postDescript',this.describeparentForm).then(res => {
                  if(res.data.result == true){
                    this.$message(res.data.message)
                    if(this.dialogFlag.prlblemask === true){
                     // this.dialogFlag.isOpen = false;
                      this.requestem();
                    }else{
                      this.goNext();
                    }
                  }else{
                    this.$message(res.data.message)
                  }
                })
              }
            }
            else if(this.dialogFlag.activeTab == 4){
              this.ImgFrom=this.ImgFrom2.concat(this.ImgFrom3).concat(this.ImgFrom4);
              console.log(this.ImgFrom)
              if(this.ImgFrom4.length>0){
                this.httpPost('productDevInfo/postProductImage?oneImageId='+this.oneImageId+'&proId='+this.pagefilters.productId,this.ImgFrom).then(res => {
                  console.log(res)
                  if(res.data.result === true){
                    this.$message(res.data.message)
                    if(this.dialogFlag.prlblemask === true){
                     // this.dialogFlag.isOpen = false;
                      this.requestem();
                    }else{
                      this.goNext();
                    }
                  }else {
                    this.$message(res.data.message)
                  }
                })
              }else{
                this.$message('主图不能为空！')
              }

            }
            else if(this.dialogFlag.activeTab == 5){
           /*   vm.$refs.logisticsDialog.submitForm();
                if(this.dialogFlag.prlblemask === true){
                  this.requestem();
                }else{
                  this.goNext();
                }*/
                 //this.goNext();
            }
            else if(this.dialogFlag.activeTab == 6){
            	vm.$refs.problemDialog.submitForm();
              if(this.dialogFlag.prlblemask === true){
                this.requestem();
              }else{
                this.goNext();
              }
            /*  this.dialogFlag.isOpen = false;
              this.requestem();*/
            }
            else if(this.dialogFlag.activeTab == 8){

            }
          },
          assistSubmit(arr){
            this.httpPost('product/editAssistMessage',arr).then(res => {
              if(res.data.result == true){
                this.$message(res.data.message);
                if(this.dialogFlag.prlblemask === true){
                  this.dialogFlag.isOpen = false;
                  this.requestem();
                }else{
                  this.goNext();
                }
              }else{
                this.$message(res.data.message)
              }

            })
          },
          //分页
          handleSizeChange(arr,val) {
          	arr == '0' ? this.pagefilters.pageSize = val : this.assistlist.pagefilters.pageSize = val;
            if(arr == '0'){
              this.requestem();
            }else{
              this.getassdialog();
            }

          },
          handleCurrentChange(arr,val) {
            arr == '0' ? this.pagefilters.currentPage = val : this.assistlist.pagefilters.currentPage = val;
            if(arr == '0'){
              this.requestem();
            }else{
              this.getassdialog();
            }
          },

        }
    }

</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  .optionValue{
    margin:0 10px;
  }
  .research_btn{
    padding:9px 12px;
  }
  .span_label{
    font-weight:bold;
    margin-right:10px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .importOptionVal{
    margin-top: 20px;
  }
  .importOptionVal .el-radio+.el-radio {
    margin-left: 0px;
  }
  .picDetail{
    width:150px;
    height:150px;
  }
  .data_body{
    border:1px solid #e4e4e4;
  }
  .data_body .row{
    border:1px solid #e4e4e4;
    border-right:none;
  }
  .row .col{
    padding: 10px 20px;
    border-right:1px solid #e4e4e4;
  }
  .col_input .el-select{
    width:100%;
  }
  .block .el-date-editor.el-input {
    width: 208px;
  }
  .quesright{
    float: right;
  }
  .classAll{
    //text-align: left;
    padding-left: 24px;
    display: inline-block;
    width: 100%;
    line-height: 36px;
   // border: 1px solid rgb(209, 219, 229);
    //border-bottom: none;
    cursor: pointer;
    box-sizing: border-box;
  }
  .classAll:hover{
    background: #eef1f6;
  }
  .el-tree.classborder{
    border:none!important;
  }
.classLeft{
  max-width: 400px;
  height: 460px;
  border:1px solid #ccc;
  margin-right: 10px;
  overflow: auto;
}
  .classRight{
    max-height: 460px;
    overflow: auto;
  }

</style>
