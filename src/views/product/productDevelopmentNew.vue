<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">

      <el-row class="filterOption" id="filterOption" >
        <el-col :span="2">
          <el-select v-if="defaultData.states=='待提交商品'"  v-model="selectParams.optionTitle" filterable clearable @change="selectFilter();selectParams.optionValue=''">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-if="defaultData.states!='待提交商品'"  v-model="selectParams.optionTitle" filterable clearable @change="selectFilter();selectParams.optionValue=''">
            <el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" class="input66" name="input66" @change="selectFilter()"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getPictureList">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" class="research_btn" size="small" @click="closeDialog(); getPictureList()">清除条件</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">开发状态</span>
            <el-radio-group v-model="defaultData.states" @change="getPictureList()"  size="small">
              <el-radio-button  label="" v-if="ButtonInfo['全部'] !='0'">全部</el-radio-button>
              <el-radio-button  label="待提交" v-if="ButtonInfo['待提交'] !='0'">待提交</el-radio-button>
              <el-radio-button  label="待主管审核" v-if="ButtonInfo['待主管审核'] !='0'">待主管审核</el-radio-button>
              <el-radio-button  label="主管审核完成" v-if="ButtonInfo['主管审核完成'] !='0'">主管审核完成</el-radio-button>
              <el-radio-button  label="销售审核不通过" v-if="ButtonInfo['销售审核不通过'] !='0'">销售审核不通过</el-radio-button>
              <el-radio-button  label="待提交商品" v-if="ButtonInfo['待提交商品'] !='0'">待提交商品</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" v-if="ButtonInfo.开发产品!='0'" class="el-icon-plus" @click="addprodu(); dialogVisible=true; title='新增产品开发'; isShow = true; isDisabledd=false;SonDis= false; picSrc=[]; addForm.productNote=''; ">开发产品</el-button>
        <el-button type="primary" size="small" @click="dialogVisible2=true; closeDialog2();"  v-if="ButtonInfo.筛选!='0'">筛选</el-button>
        <el-button type="primary" size="small" @click="importData.isOpen = !importData.isOpen"  v-if="ButtonInfo.批量导入待提交!='0'">批量导入待提交</el-button>
        <!--<el-button type="primary" size="small" @click="">批量导入待提交商品</el-button>-->
        <el-button type="primary" size="small" @click="" v-if="ButtonInfo.导出产品!='0'">导出产品</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button type="primary" size="small" @click="tool.goToPage('profitCalculation?flag='+'ebay')" v-if="(defaultData.states==='待主管审核' || defaultData.states==='待提交' ) && ButtonInfo['批量利润计算']!='0'">批量利润计算</el-button>

        <el-button type="primary" size="small" @click="batchInfoDialog3" v-if="defaultData.states==='待提交' && ButtonInfo['批量提交']!='0'">批量提交</el-button>
        <el-button type="primary" size="small" @click="batchInfoDialog4" v-if="defaultData.states==='待提交' && ButtonInfo['批量删除']!='0'">批量删除</el-button>
        <el-button type="primary" size="small" @click="batchInfoDialog5" v-if="defaultData.states==='待主管审核' && ButtonInfo['批量同意']!='0'">批量同意</el-button>
        <el-button type="primary" size="small" @click="batchInfoDialog6" v-if="defaultData.states==='待主管审核' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>

        <el-button type="primary" size="small" @click="batchInfoDialog7" v-if="defaultData.states==='待提交商品' && ButtonInfo['提交']!='0'">提交</el-button>
<!--
        <el-button type="primary" size="small" @click="batchInfoDialog8" v-if="defaultData.states==='待提交商品' && ButtonInfo['分配摄影美工']!='0'">分配摄影美工</el-button>
-->
      </el-row>
      <div id="item_list">
        <el-table :data="GetListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column width="150" id="space" label="操作" align="center" >
            <template scope="scope">
              <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交' && ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy" @click="getCreateIssues(scope.row);dialogVisible=true; SonDis= true;  isDisabledd= true; isShow=false; title='产品详情' " content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="scope.row.state==='待主管审核' && ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy" @click="getCreateIssues(scope.row);dialogVisible=true; title='产品详情'; SonDis= true; isDisabledd= true; isShow=false" content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="scope.row.state==='销售审核不通过' && ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy" @click="getCreateIssues(scope.row); dialogVisible=true; SonDis= true; title='产品详情'; isDisabledd= true; isShow=false" content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交商品' && ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy" @click="dialogFlag.prlblemask=true; SonDis= false;  describeDis= true; isShow=false; dialogFlag.dialogTitle='查看产品完整资料（含供应商）'; getCreateIssues(scope.row);
                describ(scope.row,dialogFlag.inputDisabled = true); dialogFlag.isOpen = true;" content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交商品' && ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy" @click="dialogFlag.prlblemask=true; SonDis= false;  describeDis= true; isShow=false; dialogFlag.dialogTitle='查看产品基础资料（不含供应商）'; getCreateIssues(scope.row);
                describ(scope.row,dialogFlag.inputDisabled = true); dialogFlag.isOpen = true;" content="Bottom center">&#xe675;</i>
              </el-tooltip>
              <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交' && ButtonInfo['编辑']!='0'">
                <i  class="iconfontyyy"  @click="getCreateIssues(scope.row); title='编辑产品详情'; dialogVisible=true; isShow=true;isDisabledd= false;SonDis= false" content="Bottom center">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="编辑产品采购信息"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交商品' && ButtonInfo['编辑产品采购信息']!='0'">
                <i  class="iconfontyyy" @click="openpurchase(scope.row) " content="Bottom center">&#xe64b;</i>
              </el-tooltip>
              <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交商品' && ButtonInfo['编辑']!='0'">
                <i  class="iconfontyyy" @click="dialogFlag.prlblemask=false; describeDis= false; SonDis= true;
                isShow=true; describ(scope.row,dialogFlag.inputDisabled = false); getCreateIssues(scope.row);dialogFlag.dialogTitle='编辑产品详情';dialogFlag.isOpen = true;add() " content="Bottom center">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="提交" placement="top-start" v-if="scope.row.state==='待提交' && ButtonInfo['提交']!='0'">
                <i class="iconfontyyy" @click="productSubmit(scope.row)">&#xe63e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="scope.row.state==='待提交' && ButtonInfo['删除']!='0'">
                <i class="iconfontyyy" @click="productDelete(scope.row)">&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="不同意" placement="top-start" v-if="scope.row.state==='待主管审核' && ButtonInfo['不同意']!='0'">
                <i class="iconfontyyy" @click="batchInfoDialog2(scope.row)">&#xe665;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="同意" placement="top-start" v-if="scope.row.state==='待主管审核' && ButtonInfo['同意']!='0'">
                <i class="iconfontyyy" @click="batchInfoDialog(scope.row,'1')" >&#xe67e;</i>
              </el-tooltip>
          <!--    <el-tooltip content="打印"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交商品' && ButtonInfo['打印']!='0'">
                <i  class="iconfontyyy" content="Bottom center">&#xe638;</i>
              </el-tooltip>
              <el-tooltip content="打印"  effect="dark" placement="bottom" v-if="scope.row.state==='待提交商品' && ButtonInfo['打印']!='0'">
                <i  class="iconfontyyy"  content="Bottom center">&#xe638;</i>
              </el-tooltip>-->
              <el-tooltip class="item" effect="dark" content="图片上传" placement="top-start" v-if="scope.row.state==='待提交商品' && ButtonInfo['图片上传']!='0'">
                <i class="iconfontyyy"  @click="GetImgDialog(scope.row); ImgDialog=true; SonDis= false; isShow=true; " content="Bottom center">&#xe614;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="提交" placement="top-start" v-if="scope.row.state==='待提交商品' && ButtonInfo['提交']!='0'">
                <i class="iconfontyyy" @click="productSubmit2(scope.row)" >&#xe63e;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable  label="SKU" align="center">
            <template scope="scope">
              {{scope.row.skuNo}}
            </template>

          </el-table-column>
          <el-table-column sortable prop="eanCode" label="EAN码" align="center"></el-table-column>
          <el-table-column sortable  label="图片"  align="center">
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
            </template>
          </el-table-column>
          <el-table-column sortable prop="cnName" label="产品名称"  align="center"></el-table-column>
          <el-table-column sortable  label="分类"  align="center">
            <template scope="scope">
              <span  v-if="scope.row.categoryId!=null" >{{scope.row.categoryId}} </span><br>
              <span v-if="scope.row.categoryParentid!=null">{{scope.row.categoryParentid}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="developUser" label="开发" align="center"></el-table-column>
          <el-table-column sortable prop="purchaseUser" label="跟单" align="center"></el-table-column>
          <el-table-column sortable prop="state" label="状态"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogVisible2" size="small" :close-on-click-modal="false">
        <div class="data_body">
          <el-row class="row_title row" :getter="20">
            <el-col class="col" :span="4">条件</el-col>
            <el-col class="col" :span="4">比较方式</el-col>
            <el-col class="col" :span="16">输入</el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">SKU</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-input v-model="defaultData.skuNo">
              </el-input>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">商品名称</el-col>
            <el-col class="tatestyle" :span="4">
              包含
            </el-col>
            <el-col class="col_input" :span="16">
              <el-input v-model="defaultData.cnName">
              </el-input>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">上传日期</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-row class="block">
                <el-col :span="12">
                  <el-date-picker v-model="defaultData.addTime" size="small" format="yyyy-MM-dd" type="datetime" placeholder="选择开始时间"></el-date-picker>
                </el-col>
                <!--<el-col :span="2">
                  <span style="padding:0 10px;">至</span>
                </el-col>-->
                <el-col :span="12">
                  <el-date-picker v-model="defaultData.addTimeEnd" size="small" format="yyyy-MM-dd" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">开发</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <ChoiceDevelopment @assignment="addData1" :disState="false" :Selected="defaultData.developUser"></ChoiceDevelopment>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">采购跟单</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <Merchandiser @assignment="addData2" :disState="false" :Selected="defaultData.purchaseUser"></Merchandiser>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">摄影</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <Photography @assignment="addData3" :disState="false" :Selected="defaultData.photographyUser"></Photography>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">美工</el-col>
            <el-col class="tatestyle"  :span="4">
              是

            </el-col>
            <el-col class="col_input" :span="16">
              <ArtDesigner @assignment="addData4" :disState="false" :Selected="defaultData.imageDesignUser"></ArtDesigner>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">状态</el-col>
            <el-col class="tatestyle"  :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-select  placeholder="请选择" v-model="defaultData2.states" clearable filterable>
                <el-option
                  v-if="ButtonInfo[item.label]!='0'"
                  v-for="item in stateMsg"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">清除条件</el-button>
          <el-button @click="defaultData.states=defaultData2.states; getPictureList(); dialogVisible2=false; ">筛 选</el-button>
          <el-button @click="dialogVisible2=false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" size="small" @close="addDil" @open="addDil2" :close-on-click-modal="false">
      <el-form :model="addForm"  :rules="infoRules" ref="addForm"  class="demo-ruleForm" :label-width="financeFormLabelWidth" >
        <el-form-item label="商品名称(中)"  prop="cnName" :label-width="financeFormLabelWidth">
          <el-input v-model="addForm.cnName" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="商品名称(英)"  prop="enName" :label-width="financeFormLabelWidth"  required>
          <el-input v-model="addForm.enName" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="产品价格"  prop="firstPrice" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-input type="number" min="0" v-model="addForm.firstPrice" :disabled="SonDis" style="width:50%"></el-input><span style="margin-left: 20px;">CNY</span>
        </el-form-item>
        <el-form-item label="产品重量"  prop="productWeight" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-input type="number" min="0" v-model="addForm.productWeight" :disabled="SonDis" style="width:50%"></el-input><span style="margin-left: 20px;">g</span>
        </el-form-item>
        <el-form-item label="长"  prop="productLength" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-input type="number" min="0" v-model="addForm.productLength" :disabled="SonDis" style="width:50%" @change="getBlisterWeight"></el-input><span style="margin-left: 20px;">cm</span>
        </el-form-item>
        <el-form-item label="宽"  prop="productWidth" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-input type="number" min="0" v-model="addForm.productWidth" :disabled="SonDis" style="width:50%" @change="getBlisterWeight"></el-input><span style="margin-left: 20px;">cm</span>
        </el-form-item>
        <el-form-item label="高"  prop="productHeight" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-input type="number" min="0" v-model="addForm.productHeight" :disabled="SonDis" style="width:50%" @change="getBlisterWeight"></el-input><span style="margin-left: 20px;">cm</span>
        </el-form-item>
        <el-form-item label="泡重"  :label-width="financeFormLabelWidth" >
          <span>{{blisterWeight}}</span>
        </el-form-item>
        <el-form-item label="所属SPU"  prop="spuId" :label-width="financeFormLabelWidth" >
          <spu-list :select-value="addForm.spuId" :is-disabled="SonDis" @getSpu="getSpu"></spu-list>
        </el-form-item>
        <el-form-item label="规格"  prop="specificationId" :label-width="financeFormLabelWidth"  required required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <spe-list :select-value="addForm.specificationId" :is-disabled="isDisabledd" @getSpe="getSpe"></spe-list>
        </el-form-item>
        <el-form-item label="SPU名称"  prop="spuName" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <el-input v-model="addForm.spuName" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="所属分类"  prop="SonClass" :label-width="financeFormLabelWidth"  required>
          <el-row>
            <el-col :span="10">
              <classify @assignment="addData6" :disState="isDisabledd" :Selected="addForm.categoryId" :skuno="skunoo"></classify>
            </el-col >
            <el-col :span="5" class="routerLink" ><span id="font_btn" @click="tool.goToPage('categoryManagerNew')">分类管理</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="特殊属性"  prop="" :label-width="financeFormLabelWidth" >
          <el-row>
            <el-col :span="15">
              <!--<SpecialAttributes  @assignment="addData5" :disState="SonDis" :Selected="SonAttribute" ref="SpecialAttributes"></SpecialAttributes>-->
              <SpecialAttributes2  @assignment="addData5" :disState="SonDis" :Selected="SonAttribute" ref="SpecialAttributes"></SpecialAttributes2>
            </el-col >
            <el-col :span="9" class="routerLink" ><span id="font_btn" @click="tool.goToPage('specialAttr')">特殊属性管理</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="产品平台"  prop="channelId" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <platForm-list :select-value="addForm.channelId" :is-disabled="SonDis" @getPla="getPla"></platForm-list>
        </el-form-item>
        <el-form-item label="调研连接"  prop="researchUrl" :label-width="financeFormLabelWidth"  >
          <el-input v-model="addForm.researchUrl" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="热销连接"  prop="sellHotUrl" :label-width="financeFormLabelWidth"  >
          <el-input v-model="addForm.sellHotUrl" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="最低价连接"  prop="pricelowestUrl" :label-width="financeFormLabelWidth"  >
          <el-input v-model="addForm.pricelowestUrl" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="A供应商"  prop="firstVendor" :label-width="financeFormLabelWidth"  >
          <el-input v-model="addForm.firstVendor" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="B供应商"  prop="secondVendor" :label-width="financeFormLabelWidth"  >
          <el-input v-model="addForm.secondVendor" :disabled="SonDis"></el-input>
        </el-form-item>
        <el-form-item label="备注信息"  prop="productNote" :label-width="financeFormLabelWidth" >
          <el-input type="textarea" :disabled="SonDis"  v-model="addForm.productNote"></el-input>
        </el-form-item>
        <el-form-item label="图片上传"  prop="" :label-width="financeFormLabelWidth" >
          <el-upload :on-preview="preview" :http-request="uploadFilePic" multiple :action="uploadPic"
                     list-type="picture-card" drag :file-list="picList" :on-remove="handleRemove" accept=".jpg,.jpeg,.png">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品开发"  prop="developUser" :label-width="financeFormLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
          <!--<ChoiceDevelopment @assignment="getDevelopUser" :disState="SonDis" :Selected="addForm.developUser" ></ChoiceDevelopment>-->
          <el-select  filterable clearable v-model="addForm.developUser"  placeholder="请选拔开发人员"  :disabled="SonDis" >
            <el-option v-for="item in developUserList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
          <el-tooltip class="item" effect="dark" content="添加人员" placement="top-start" v-if="SonDis == false">
            <i class="iconfontyyy" @click="getFull('1');">&#xe623;</i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button  @click="dialogVisible= false;">关 闭</el-button>
        <el-button type="primary" v-show="isShow==true" @click="addForm.state='caogao'; PreservationFrom('addForm')">保 存</el-button>
        <el-button type="primary"  v-show="isShow==true" @click="addForm.state='aduit'; PreservationFrom('addForm')">提交审核</el-button>
        </span>
    </el-dialog>
    <el-dialog title="分配摄影与美工" :visible.sync="distribution" @close="distributionDil" size="tiny" :close-on-click-modal="false">
      <el-form v-model="distributionFrom" :rules="distributionFrom" ref="distributionFrom"  class="demo-ruleForm" :label-width="financeFormLabelWidth">
        <el-form-item label="摄影"  prop="imageId" :label-width="financeFormLabelWidth">
          <Photography @assignment="Photographydata1" :disState="false" :Selected="distributionFrom2.imageId"></Photography>
        </el-form-item>
        <el-form-item label="美工"  prop="photoId" :label-width="financeFormLabelWidth">
          <ArtDesigner @assignment="Photographydata2" :disState="false" :Selected="distributionFrom2.photoId"></ArtDesigner>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button  @click="distribution=fales;">取 消</el-button>
        <el-button type="primary" @click="addDistribution">保 存</el-button>
        </span>
    </el-dialog>
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" @close="addDill">
      <el-tabs v-model="dialogFlag.activeTab"  @tab-click="clicktab">
        <el-tab-pane label="基本信息"   name="0">
          <msg-dialog ref="msgDialog"   :required='requiredsubmit'
                      :parentinfo-detail="dialogFlag.activeTab"
                      :product-id="productId"
                      :input-disabled="dialogFlag.inputDisabled"
                      :docment-null="dialogFlag.docmentNull = true"
                      v-on:parentmsgg = "parentMsg" ></msg-dialog>
        </el-tab-pane>
        <el-tab-pane label="辅助信息"   name="1">
          <assist-dialog-new  ref="assistDialog"  :group-product="dialogFlag.addDialog"
                         :product-id="productId"
                         :input-disabled="dialogFlag.inputDisabled"
                         :docment-null="dialogFlag.docmentNull"
                         :assistparentinfo-detail="dialogFlag.activeTab"
                         v-on:parentmsggl="assiparentmsgg"
                          @parent-full="getchildFull"
                          :fullListt="fullList"
          ></assist-dialog-new>
        </el-tab-pane>
        <el-tab-pane label="采购信息"  name="2"  v-if="dialogFlag.dialogTitle=='查看产品完整资料（含供应商）'" >
          <purchase-dialog-new ref="purchaseDialog"  title="查看组合商品完整资料（含供应商）"  :purchaseparentinfo-detail="dialogFlag.activeTab" :product-id="productId"
                               :input-disabled="true" v-on:parentmsggll="purparentmsgg"  :docment-null="dialogFlag.docmentNull"></purchase-dialog-new>
        </el-tab-pane>
      <!--  <el-tab-pane label="采购信息"   name="2">
          <purchase-dialog ref="purchaseDialog"  :purchaseparentinfo-detail="dialogFlag.activeTab"
                            :input-disabled="dialogFlag.inputDisabled"
                            :product-id="productId"
                            :docment-null="dialogFlag.docmentNull"
                            v-on:parentmsggll="purparentmsgg" ></purchase-dialog>

          &lt;!&ndash;<purchase-dialog  :purchaseparentinfo-detail="dialogFlag.activeTab" :input-disabled="dialogFlag.inputDisabled" ></purchase-dialog>&ndash;&gt;
        </el-tab-pane>-->
        <el-tab-pane label="详细描述"   name="3">
          <describe-dialog  ref="describeDialog"   @assignment="pustdescribe"  :disState="describeDis" :Selected="sonDataFrom" ></describe-dialog>
        </el-tab-pane>
        <el-tab-pane label="产品图片"   name="4" v-if="dialogFlag.dialogTitle!='编辑产品详情'">
          <images-dialog-new  @assignment="imageData"  @assignment3="imageData3"
                          @assignment4="imageData4" @assignment2="imageData2" :disState="SonDis"  :docment-null="true" :Selected="sonDataFrom" :isOpen="!dialogFlag.isOpen">

          </images-dialog-new>
        </el-tab-pane>
        <el-tab-pane label="物流方式"   name="5" >
          <logistics-dialog ref="logisticsDialog" :logisticsparentinfo-detail="dialogFlag.activeTab"   @assignment="getLogisticsVlaue" :input-disabled="dialogFlag.inputDisabled" :product-id="productId"></logistics-dialog>

          <!--<logistics-dialog  :logisticsparentinfo-detail="dialogFlag.activeTab" :input-disabled="dialogFlag.inputDisabled"></logistics-dialog>-->
        </el-tab-pane>
        <el-tab-pane label="产品问题"   name="6" >
          <problemDialog ref="problemDialog" :inputDisabled="dialogFlag.inputDisabled"  :productId="productId"   @parentproblem-ll="getparentproblem" ></problemDialog>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <!--<el-col :span="9" style="color:red">切换并填写的时候，记得点击保存→→</el-col>-->
        <el-button @click="dialogFlag.isOpen = false;dialogFlag.activeTab='0';">关 闭</el-button>
        <el-button type="primary" @click="submitDialogForm" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--产品问题添加问题弹窗-->
    <el-dialog :title="dialogFlag.problemTitle" :visible.sync="dialogFlag.problemisOpen" size="small" @close="problemDialog.ask='';">
      <el-form :model="problemDialog" ref="problemDialog">
        <el-form-item :label="dialogFlag.prlblemLabel" prop="ask" :rules="[{ required: true, message: '请输入字符！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
          <el-input type="textarea" v-model="problemDialog.ask"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.problemisOpen = false;">关 闭</el-button>
        <el-button :loading="$store.state.loading" type="primary" @click="dialogFlag.prlblemask =true;addProblem(dialogFlag.problemTitle,'problemDialog');" >保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisibleImg" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="上传图片" :visible.sync="ImgDialog" size="small" @close="problemDialog.ask='';" :close-on-click-modal="false">
      <images-dialog-new  @assignment="imageData"  @assignment3="imageData3"
                                       @assignment4="imageData4" @assignment2="imageData2"  :docment-null="true" :isOpen="!dialogFlag.isOpen" :disState="true" :Selected="sonDataFrom">
    </images-dialog-new>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ImgDialog = false;">关 闭</el-button>
        <el-button type="primary" @click="PreservationImg();" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--所有人员-->
    <el-dialog title="添加人员"  :visible.sync="dialogFlag.Fullisopen" size="tiny" :close-on-click-modal="false" class="headerBorder">
      <get-allpersonnel @childValue="getChildValue" ></get-allpersonnel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.Fullisopen = false;">关 闭</el-button>
        <el-button type="primary" @click="submitselected()" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--编辑采购信息2.0  2018.3.13-->
    <el-dialog title="编辑产品采购信息" :visible.sync="dialogFlag.purchaseisopen" size="small" :modal-append-to-body="false"  :close-on-click-modal="false" class="add_product_wrap " id="add_product_wrap">
      <purchase-dialog-new  ref="purchaseDialogEdit"  title="编辑产品采购信息"   :purchaseparentinfo-detail="2" :product-id="productId"
                            :input-disabled="false"  v-on:parentmsggll="purparentmsgg"  :docment-null="dialogFlag.docmentNull"></purchase-dialog-new>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.purchaseisopen = false">取消</el-button>
        <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------导入手工订单 弹出框--------------------------->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getPictureList"></import-dialog>

  </div>
</template>
<script>

  import { classify, SpecialAttributes, ChoiceDevelopment, Merchandiser, ArtDesigner,
    Photography, purchaseDialogNew,msgDialog,assistDialogNew,purchaseDialog,describeDialog,imagesDialogNew,
    logisticsDialog,problemDialog,screenDialog, group,getAllpersonnel } from 'views/product/import_modular';
  import spuList from "../../components/listData/getSpuList.vue"
  import SpecialAttributes2 from "../../components/ChoiceModular/attributeList.vue"
  import speList from "../../components/listData/getSpecificationList.vue"
  import platFormList from "../../components/listData/getPlatformList.vue"
  import store from '@/vuex/store'
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default{
    name:'productDevelopment',
    components: {
      spuList,
      speList,
      platFormList,
      classify,
      SpecialAttributes,
      SpecialAttributes2,
      ChoiceDevelopment,
      Merchandiser,
      ArtDesigner,
      Photography,
      msgDialog,//基本信息
      assistDialogNew,//辅助信息
      purchaseDialogNew,//采购信息
      describeDialog,//详细描述
      imagesDialogNew,//商品图片
      logisticsDialog,//物流方式
      problemDialog,//产品问题
      screenDialog,//筛选
      group,
      getAllpersonnel//人员选择穿搜框
    },
    data(){
      let name2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let name3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[A-Za-z]+[\s\S]*[^ ]$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        ButtonInfo:{},
        uploadExc:'',
        fullNum:'',
        fullList:[],//添加人员Id集合
        infoRules:{
         /* cnName:[
            { required: true, message: '请输入商品名称(中)', trigger: 'blur'},
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],*/
          enName:[
            { required: true, message: '请输入商品名称(英)', trigger: 'blur'},
            { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
            { validator: name3, trigger: 'blur'}
          ],
          SonClass:[
            { required: true, type:'array', message: '请选择分类！', trigger: 'blur'},
          ],
        },
        importData:{
          isOpen:false,
          importUrl:'productDevLeading/importProductDevInfo',
          modalUrl:'productDevLeading/exportModel',
        },
        excFile:[],
        excList:'',  //  已选择导入的文件
        requiredsubmit:false,
        sonDataFrom:{
          SonDis:false,
          productId:''
        },
        ImgDialog: false,
        title:'新增产品开发',
        skunoo:false,
        productId:'',
        states:'',
        describeData:'',//详情表单对象
        SonDis:false,
        SonClass:[],
        SonAttribute:[],
        distributionFrom:{
          productId:[],
          imageId:'',
          photoId:''
        },
        distributionFrom2:{
          productId:[],
          imageId:'',
          photoId:''
        },
        dataState:true,
        a:["2131","2156"],
        rowProductId:[],
        dialogVisible:false,
        dialogVisible2:false,
        dialogVisible3:false,
        distribution:false,
        financeFormLabelWidth: '120px',
        inputDisabled:false,   //checkbox是否处理可点击状态
        isPirates:'',
        diss:false,
        Selecteds:'',
        piratesOptions:[{
          value: '0',
          label: '非盗图'
        }, {
          value: '1',
          label: '盗图'
        }],
        userOptions:[],
        val:'等于',
        picList:[],     // 导入文件
        isShow:'',
        options: [{
          value: 0,
          label: 'SKU'
        }, {
          value: 1,
          label: '商品名称'
        }],
        optionss: [{
          value: 2,
          label: '开发ID'
        }],
        optionsData: [{
          value: '0',
          label: '等于'
        }, {
          value: '1',
          label: '包含'
        }],
        stateMsg:[
            {
              value:'',
              label:'全部'
            },
            {
              value:'待提交',
              label:'待提交'
            },
            {
              value:'待主管审核',
              label:'待主管审核'
            },
            {
              value:'销售审核不通过',
              label:'销售审核不通过'
            },
            {
              value:'待提交商品',
              label:'待提交商品'
            },
          ],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:2,
        },
        dialogImageUrl: '',
        dialogVisibleImg: false,
        GetListData:[],
        defaultData:{
          skuNo:'',//Sku
          cnName:'',//商品名称
          addTime:'',//提交日期1
          addTimeEnd:'',//提交日期2
          developUser:'',//开发
          purchaseUser:'',//采购跟单
          photographyUser:'',//摄影
          imageDesignUser:'',//美工
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
          states:'待提交',//开发状态
        },
        defaultData2:{
          states:'',
        },
        addForm:{
          cnName:'',//商品名称（中）
          enName:'',//商品名称（英）
          categoryId:[],//二级分类
          attributeId:[],//属性
          productNote:'',//备注信息
          imageId:[],
          state:'caogao',
          SonClass:[],
          firstPrice:'',
          productWeight:'',
          productLength:'',
          productWidth:'',
          productHeight:'',
          productModel:'',
          firstVendor:'',
          secondVendor:'',
          channelId:'',
          researchUrl:'',
          sellHotUrl:'',
          pricelowestUrl:'',
          developUser:'',
          specificationId:'', //  规格id
          spuName:'', //  Spu名称
          spuId:'',      //  所属Spu  -----> 拆出 addForm
          spuInfo:{
            /*spuId:'',
            spuNo:'',
            spuName:'',
            spuDesc:'',
            specificationId:'',
            categoryId:[],*/
          },
        },
        blisterWeight:'',      //  Spu名称  -----> 拆出 addForm
        isDisabledd:false,    // 以上是否可编辑
        developUserList:[],   // 2017-11-16
        errorData:[],   // 2017-11-16   导入异常数据展示
        addsb:{
          state:'caogao',
        },
        page:{          // 分页参数
          currentPage:0,
          pageSize:10,
          totalCount:10,
          totalPage:1
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        picListData:[],   // 供应商列表
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
        dialogFlag:{
          purchaseisopen:false,//供应商编辑弹框
          isOpenLead:false,    // 导入弹出框
          Fullisopen:false,
          docmentNull:false,
          addDialog:false,
          activeTab:'0',
          problemTitle:'',
          prlblemLabel:'',
          problemisOpen:false,
          prlblemask:false,
          isOpen:false,     // 批量及单个删除框
          isOpenLead:false,     // 批量导入框
          isOpenLeadError:false,     // 批量导入异常框
          isOpenErr:false, //  批量导入异常框
          openResetPass:false,  // 重置密码框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          isOpenMsg:'',      // 弹出框 的msg
          otherInputDisabled:false,  //用户邮箱是否可编辑  在添加与编辑中区分
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        sels:[],    //批量删除已选的条目数
        uploadPic:this.RmsUrl+'imageManage/saveAttach?Authorization='+this.sessuserid,   //  上传图片地址
        picSrc:[],
        image_Ids:[],
        picId:'',
        auditFrom:{
          productId:[],
          states:''
        },
        auditFrom2:{
          productIds:[],
        },
        auditFrom3:{
          productId:[],
        },
        oneImageId:'',
        ImgFrom:[],
        ImgFrom2:[],
        ImgFrom3:[],
        ImgFrom4:[],
        assisDialog:{
          docmentNull:false,
          inputDisabled:false,
          addDialog:false,
        },
        assistparentForm:{},//辅助信息
        purchaseparentForm:{},//采购信息
        msgparentForm: {},
        require:false,
        describeDis:false,
        logisticsInfo:false,
      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入SKU' : this.selectParams.optionTitle == 1 ? '请输入商品名称':this.selectParams.optionTitle == 2?'请输入开发ID':'';
      },
      ...mapState(["selectedArr"])
    },
    mounted () {
      this.getauthorityList();
      this.getPictureList();
      this.getinpuy()
      this.requestemper();   //开发人员列表
//      this.getDemo()
    },
    methods: {
      /*********************页面按钮权限 20171226*****************************/
      getauthorityList(){
        var vm = this;
        vm.ButtonInfo = vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0', vm.ButtonInfo)
      },
      /*********************页面按钮权限 20171226*****************************/
      openpurchase(row){
        var that=this;
        this.productId=row.productId;
        //setTimeout(function(){  that.$refs.purchaseDialogEdit.requestem();},20)
        this.dialogFlag.purchaseisopen=true;
      },
      //物流方式
      getLogisticsVlaue(val){
        this.logisticsInfo=val.value;
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
            if(this.fullNum == '1') {
                this.developUserList = res.data;
            }
            this.fullList=res.data;
            this.dialogFlag.Fullisopen=false;
          })
        }
      },
      getChildValue(val){
        this.fullList = val.value;
        console.log(11111111111111);
      },
      getchildFull(data){
        this.dialogFlag.Fullisopen = true;
        this.fullNum=data;
      },
      parentMsg(val){
        this.msgparentForm = data.vendorInfoModel;
        this.require = data.require
      },
      getDemo(){
        let imgObj = document.getElementsByClassName('el-upload-list__item');
        for(var i=0; i<imgObj.length; i++){
          imgObj[i].onclick =function(){
//            alert(998)
          }
        }
        console.log(imgObj)
        console.log(7776874)
      },
      getinpuy(){
        let obj = document.getElementsByName('input66')
        console.log(obj.value)
        console.log('bojjjj')
      },
      clicktab(val){
        //console.log('valvalval % 0',val.index)
        //alert('切了切了切了')
        //this.doItem('确定保存当前页面数据',url,jsonData,callback)
        if(val.index == 6){

          this.getProductQuest();
        }
      },
      //产品问题
      addask(val){
        this.problemDialog.issueId=val
      },
      getProductQuest(){
      	var _this=this;
//      	alert('qingqiule')
        _this.httpPost('productDevInfo/getProductQuest?productId='+this.productId).then(res=>{
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
      addProblem:function(val,formName){
        var _this=this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            if (val == '添加提问') {
              _this.httpGet('productDevInfo/postProductQuest?productId=' + _this.productId + '&askTitle=' + _this.problemDialog.ask).then(res => {
                if (res.data.result == true) {
                  _this.getProductQuest();
                  _this.dialogFlag.problemisOpen = false;
                } else {
                  _this.$message(res.data.message)
                }
              });
            } else if (val == '我来回答') {
              var quest = {};
              quest.productId = _this.productId;
              quest.askContent = _this.problemDialog.ask;
              quest.issueId = this.problemDialog.issueId;
              _this.httpPost('productDevInfo/patchProductQuest', quest).then(res => {
                if (res.data.result == true) {
                  _this.getProductQuest();
                  _this.dialogFlag.problemisOpen = false;
                } else {
                  _this.$message(res.data.message)
                }
              });
            }
          }
        })
      },
      //采购信息
      purparentmsgg(data){
        this.purchaseparentForm=data;
      },
      //辅助信息
      assiparentmsgg(data){
        this.assistparentForm = data.assistInfoModel;
        //console.log('第二个辅助儿子给的 % O',data)
        //alert(data.assiopen)

      },
      parentMsg(data){
        this.msgparentForm = data.vendorInfoModel;
        this.require = data.require
        //console.log('第一个基本儿子给的 % O',data.vendorInfoModel)
      },
      describ(row){
        this.dialogFlag.prlblemask=true;
        this.dialogFlag.isOpen = true;
        this.sonDataFrom.productId = row.productId;
        this.productId = row.productId;
//        alert(' this.productId======='+  this.productId)
        this.dialogFlag.docmentNull = true;
        setTimeout(()=>{
          this.$refs.msgDialog.requestem();
          this.$refs.assistDialog.requestem();
          if(this.dialogFlag.dialogTitle=='查看产品完整资料（含供应商）'){
            this.$refs.purchaseDialog.requestem();
          }
          this.$refs.describeDialog.getLanguage();
          this.$refs.describeDialog.addlang();
          this.$refs.logisticsDialog.getLogisTypeForm(row.productId);
        },20)
        this.dialogFlag.activeTab = '0';
      },
      selectChange(){
      },
      SubmitFrom(){
      },
      pustdescribe(val){
        this.describeData = val;
//        console.log(val)
      },
      assistSubmit(arr){
        this.httpPost('product/editAssistMessage',arr).then(res => {
          if(res.data.result == true){
            //this.dialogFlag.isOpen = false;
            this.$message(res.data.message)
            this.getPictureList();
          }else{
            this.$message(res.data.message)
          }
        })
      },
      submitDialogForm(){
        var vm=this;
        if(this.dialogFlag.activeTab == 0){

          var add = this.$refs.msgDialog.submitForm();
          if(this.dataState!==false){
            this.HandleData(this.addForm.categoryId);
          }
          if(add == true){
            this.msgparentForm.productId = this.productId;
            let msgparentForm = JSON.parse(JSON.stringify(this.msgparentForm));
            delete msgparentForm.classifybuteTree;
            delete msgparentForm.attributeTree;
            this.httpPost('product/editBasicMessage',msgparentForm).then(res => {
              if(res.data.result == true){
                //this.dialogFlag.isOpen = false;
                this.$message(res.data.message)
                this.getPictureList();
                this.dataState===false
              }else{
                this.dataState===false
                this.$message(res.data.message)
              }
            })
          }
        }
        else if(this.dialogFlag.activeTab == 1){
          var _this=this;
          // console.log('this.assistparentForm % 0==',this.assistparentForm)
          var add = _this.$refs.assistDialog.submitForm();
          // this.requiredsubmit = true;
          if(add == true){
            _this.assistparentForm.productId= _this.productId;
            if(_this.dialogFlag.docmentNull == false || _this.assistparentForm.isAssemby ==true){
              let qtyArr = _this.assistparentForm.combinations.map(item => item.qty);
              /*if(_this.assistparentForm.combinations.length == 0){
               _this.$message('请添加组合产品！');
               }else{*/
              for(let i=0;i<qtyArr.length;i++){
                if(! this.reg.test(qtyArr[i])){
                  _this.$message('产品的数量只能填写整数且长度不超过9位！');
                }else{
                  delete _this.assistparentForm.isAssemby;
                  _this.assistSubmit(_this.assistparentForm);
                }
              }
            }else{
              delete _this.assistparentForm.isAssemby;
              _this.assistSubmit(_this.assistparentForm);
            }
          }
        }
        else if(this.dialogFlag.activeTab == 2){
          var add = this.$refs.purchaseDialog.submitForm();
          if(add == true){
            this.httpPost('product/editPurchaseMessage',this.purchaseparentForm).then(res => {
              if(res.data.result == true){
                //this.dialogFlag.isOpen = false;
                this.$message(res.data.message)
                this.getPictureList();
              }else{
                this.$message(res.data.message)
              }

            })
          }
        }
        else if(this.dialogFlag.activeTab == 3){
          var add = this.$refs.describeDialog.submitForm();
          if(add == true){
            console.log(this.describeData)
            this.httpPost('productDevInfo/postDescript',this.describeData).then(res => {
              if(res.data.result == true){
                //this.dialogFlag.isOpen = false;
                this.$message(res.data.message)
                this.getPictureList();
              }else{
                this.$message(res.data.message)
              }
            })
          }
        }
        else if(this.dialogFlag.activeTab == 4){
          this.ImgFrom=this.ImgFrom2.concat(this.ImgFrom3).concat(this.ImgFrom4);
//          alert(this.ImgFrom.length)
          if(this.ImgFrom4.length>0){
            this.httpPost('productDevInfo/postProductImage?oneImageId='+this.oneImageId+'&proId='+this.productId,this.ImgFrom).then(res => {
              console.log(res)
              if(res.data.result === true){
                this.$message(res.data.message)
                if(this.dialogFlag.prlblemask === true){
                  //this.dialogFlag.isOpen = false;
                  this.getPictureList();
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
          vm.$refs.logisticsDialog.submitForm();
          if(this.dialogFlag.prlblemask === true){
            this.getPictureList();
          }else{
            this.goNext();
          }
          //this.goNext();
        }
       else if(this.dialogFlag.activeTab == 6){
          this.dialogFlag.isOpen = false;
          this.getPictureList();
        }
      },
      uploadFilePic(options){
        console.log(options);
        this.addForm.imageId=[];
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('productDevLeading/importProductDevInfo',data).then(res => {
          console.log(res);
          if(res.data.result == true){
            console.log(res.data.params.attach);
            this.picList.push(res.data.params.attach);
          }
        })
      },

      getUserNameList(){
        this.httpPost('imageManage/selectAddUser').then(res => {
          if(res.data.result == true){
            this.userOptions = res.data.params.strList;
          }
        })
      },
      addData6(val){
//        alert('触发')
        console.log(val);
        let  arr=val.value;
        this.categoryArr = val.value;
        this.HandleData(arr);
        this.addForm.SonClass = val.value;
        this.addForm.categoryId = val.value;
        this.dataState=false;
      },
      HandleData(arr){
        this.addForm.categoryId=arr[arr.length-1];
      },
      addData5(val){
        console.log('父拿到')
        console.log(val.value);
        this.addForm.attributeId=val.value;
        this.SonAttribute=val.value;
      },

      addData1(val){
        this.defaultData.developUser=val.value;
      },
      addData2(val){
        this.defaultData.purchaseUser=val.value;
      },
      addData3(val){
        this.defaultData.photographyUser=val.value;
      },
      addData4(val){
        this.defaultData.imageDesignUser=val.value;
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
//        alert('img2')
        this.oneImageId=val;
        console.log(val)
      },
      closeDialog(){
        this.defaultData.skuNo='';
        this.defaultData.cnName='';
        this.defaultData.addTime='';
        this.defaultData.addTimeEnd='';
        this.defaultData.developUser='';
        this.defaultData.purchaseUser='';
        this.defaultData.photographyUser='';
        this.defaultData.imageDesignUser='';
        this.selectParams.optionValue='';
      },
      closeDialog2(){
        this.defaultData2.states=this.defaultData.states;
      },

      batchInfoDialog:function(row,val){//同意审核
        let vm = this;
        console.log(row)
        console.log(val)
        vm.auditFrom.productId=[];
        vm.auditFrom.productId.push(row.productId)
        vm.auditFrom.states='1'
        let msg;
        msg = '您确定要同意此产品开发？';
        vm.doItem(msg,'productDevInfo/auditProductDevinfo',this.auditFrom,vm.getPictureList);
      },
      batchInfoDialog5:function(val){
        var vm = this;
        vm.auditFrom.productId=[];
        vm.auditFrom.states='1'
        vm.auditFrom.productId = vm.sels.map(item => item.productId);
        if(vm.auditFrom.productId == '' ){
          vm.tips();
        }else{
          var msg,isPirates;
          msg = '您确定要批量提交此产品开发?';
          vm.doItem(msg,'productDevInfo/auditProductDevinfo',this.auditFrom,vm.getPictureList);
        }
      },
      batchInfoDialog2:function(row,val){//不同意审核
        let vm = this;
        vm.auditFrom.productId=[];
        vm.auditFrom.productId.push(row.productId);
        vm.auditFrom.states='0';
        let msg;
        msg = '您确定不同意此产品开发？';
        vm.doItem(msg,'productDevInfo/auditProductDevinfo',this.auditFrom,vm.getPictureList);

      },
      batchInfoDialog6:function(val){
        var vm = this;
        vm.auditFrom.productId=[];
        vm.auditFrom.states='0'
        vm.auditFrom.productId = vm.sels.map(item => item.productId);
        if(vm.auditFrom.productId == '' ){
          vm.tips();
        }else{
          var msg,isPirates;
          msg = '您确定要批量不同意此产品开发?';
          vm.doItem(msg,'productDevInfo/auditProductDevinfo',this.auditFrom,vm.getPictureList);
        }
      },
      productDelete:function(row,val){//待提交删除
        let vm = this;
        vm.auditFrom2.productIds=[];
        vm.auditFrom2.productIds.push(row.productId)
        let msg;
        msg = '您确定删除此产品开发？';
        vm.doItem(msg,'productDevInfo/delete',this.auditFrom2.productIds,vm.getPictureList);

      },
      productSubmit:function(row,val){//待提交提交
        let vm = this;
        vm.auditFrom2.productIds=[];
        vm.auditFrom2.productIds.push(row.productId)
        let msg;
        msg = '您确定要提交此产品开发？';
        vm.doItem(msg,'productDevInfo/auditCaogao',this.auditFrom2.productIds,vm.getPictureList);
      },
      productSubmit2:function(row,val){//商品提交
        let vm = this;
        vm.auditFrom2.productIds=[];
        vm.auditFrom2.productIds.push(row.productId)
        let msg;
        msg = '您确定所有资料已经完善，发往商品列表？';
        vm.doItem(msg,'productDevInfo/patchProduct',this.auditFrom2.productIds,vm.getPictureList);
      },
      batchInfoDialog7(){
        var vm = this;
        vm.auditFrom3.productId=[];
        vm.auditFrom3.productId = vm.sels.map(item => item.productId);
        if(vm.auditFrom3.productId == '' ){
          vm.tips();
        }else{
          var msg,isPirates;
          msg = '您确定所有资料已经完善，发往商品列表？';
          console.log(this.auditFrom3)
          vm.doItem(msg,'productDevInfo/patchProduct',this.auditFrom3.productId,vm.getPictureList);
        }
      },
      add(){
        this.$refs.SpecialAttributes.addCheckedData(this.SonAttribute);
      },
      getCreateIssues(row,val){//查看

        let productId = row.productId;
        this.picList=[];
        console.log(row)
        this.httpGet('productDevInfo/getProductDevInfo?productId='+productId).then(res=>{
          console.log(55555555)
          console.log(res)
          this.addForm.cnName=res.data.cnName;
          this.addForm.enName=res.data.enName;
          // start 2017-11-14 查看后自动计算泡重
          this.addForm.spuId=res.data.spuId;
          this.addForm.firstPrice=res.data.firstPrice+'';
          this.addForm.productWeight=res.data.productWeight+'';
          this.addForm.productLength=res.data.productLength+'';
          this.addForm.productWidth=res.data.productWidth+'';
          this.addForm.productHeight=res.data.productHeight+'';
          this.addForm.firstVendor=res.data.firstVendor;
          this.addForm.secondVendor=res.data.secondVendor;
          this.addForm.researchUrl=res.data.researchUrl;
          this.addForm.channelId=res.data.channelId;
          this.addForm.sellHotUrl=res.data.sellHotUrl;
          this.addForm.priceLowestUrl=res.data.priceLowestUrl;
          this.addForm.developUser=res.data.developUser;
          // end
          this.addForm.categoryId=res.data.category;
          this.addForm.attributeId=res.data.attributeId;
          this.addForm.productNote=res.data.productNote;
          this.addForm.imageId=[];
          this.SonAttribute=res.data.attributeId;
         /* setTimeout(()=>{
          	alert(99999)
          	console.log(888888)
            vm.$refs.SpecialAttributes.addCheckedData(vm.SonAttribute);
          },100)*/
          this.addForm.productId=res.data.productId;
          this.SonClass=res.data.category;
          this.addForm.SonClass=res.data.category;
          this.picSrc=res.data.image;
          let picSrcs=res.data.image;
          for(let i=0; i<picSrcs.length; i++){
              let imgUrlObj={url:this.RmsUrl+picSrcs[i].imageUrl, attachId:picSrcs[i].imageId};
            this.picList.push(imgUrlObj)
          }
          console.log(this.picList)
          console.log(9999777)
          console.log(this.addForm)
          this.getBlisterWeight();   // 2017-11-15 查看后自动计算泡重
        })
      },
      addprodu:function () {
/*        this.SonAttribute=[];
        setTimeout(()=>{
          console.log(9999999)
          this.$refs.SpecialAttributes.addCheckedData(this.SonAttribute);
        },20)*/
        console.log(this.addForm);
        this.blisterWeight = '';   // 清空泡重
        this.addForm.attributeId = [];
        this.addForm.categoryId = [];
        this.addForm.SonClass = [];

        this.addForm.spuId='';
        this.addForm.firstPrice='';
        this.addForm.productWeight='';
        this.addForm.productLength='';
        this.addForm.productWidth='';
        this.addForm.productHeight='';
        this.addForm.firstVendor='';
        this.addForm.secondVendor='';
        this.addForm.researchUrl='';
        this.addForm.channelId='';
        this.addForm.sellHotUrl='';
        this.addForm.priceLowestUrl='';
        this.addForm.developUser='';
        this.addForm.spuInfo = {
         spuId:'',
         spuNo:'',
         spuName:'',
         spuDesc:'',
         specificationId:'',
         categoryId:'',
         addUser:'',
         addTime:'',
         compId:'',
         sequenceNo:'',
         updTime:'',
         updUser:'',
         categoryId:[],
       }
      },
      PreservationFrom(form){//编辑保存
        var _this=this;
        for(let i=0; i<_this.picList.length; i++){
            let attachId = _this.picList[i].attachId;
            console.log(attachId)
          _this.addForm.imageId.push(attachId);
        }
        _this.$refs[form].validate((valid) => {
          if (valid) {
            setTimeout(()=>{
              if(typeof _this.addForm.categoryId === 'object'){
                _this.HandleData(_this.addForm.categoryId);
              }
              var addFormobj=JSON.parse(JSON.stringify(_this.addForm));
              addFormobj.spuInfo.categoryId = addFormobj.categoryId;
              addFormobj.spuInfo.spuName = addFormobj.spuName;
              addFormobj.spuInfo.specificationId = addFormobj.specificationId;

              delete addFormobj.categoryId;
              delete addFormobj.spuId;
              delete addFormobj.specificationId;
              delete addFormobj.spuName;
              delete addFormobj.SonClass;
//              _this.httpPost('productDevInfo/postProductdevInfo', addFormobj).then(res => {
              _this.httpPost('productDevInfo/postProductdevInfo?productId='+this.addForm.productId, addFormobj).then(res => {
                if(res.data.result == true){
                  console.log(res);
                  _this.dialogVisible=false;
                  _this.getPictureList();
                }else{
                  this.picListData = [];
                  console.log('请求无数据');
                }
              }).catch(function(err){
                console.log(err);
              })
            },20);
          } else {
            console.log('error submit!!');
          }
        })
        console.log(this.addForm);
      },
      selectFilter:function(){
        var selectVal = this.selectParams.optionValue;
        var selectTittle = this.selectParams.optionTitle;
        var vm = this;
        switch(selectTittle){
          case 0:
            vm.defaultData.skuNo = selectVal ;
            vm.defaultData.cnName = '' ;
            break;
          case 1:
            vm.defaultData.cnName = selectVal ;
            vm.defaultData.skuNo = '' ;
            break;

        }
      },
      GetImgDialog:function (row) {
        this.sonDataFrom.productId=row.productId;
      },
      PreservationImg:function () {
        this.ImgFrom = this.ImgFrom2.concat(this.ImgFrom3).concat(this.ImgFrom4);
//        alert(this.ImgFrom.length)
        if (this.ImgFrom.length > 0) {
//          alert(this.ImgFrom2.length)
          this.httpPost('productDevInfo/postProductImage?oneImageId=' + this.oneImageId + '&proId=' + this.sonDataFrom.productId, this.ImgFrom).then(res => {
            console.log(res)
            if (res.data.result === true) {
//              alert(98)
              this.ImgDialog = false;             // 2017-11-18
              this.$message(res.data.message);    // 2017-11-18
              console.log(res)
            } else {
              this.$message(res.data.message)
            }
          })
        }
      },
      getPictureList:function(){
      	if(this.defaultData.states=='待提交商品'){
          this.selectParams.optionTitle=0;
        }else{
          this.selectParams.optionTitle=2;
        }

//          this.defaultData.developUser=''
        console.log('翻页传参 % O',this.defaultData);
        this.httpPost('productDevInfo/getAll',this.defaultData).then(res => {
          console.log(res);
//            alert(12)
          this.GetListData=res.data.listData;
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        }).catch(function(err){
          console.log(err);
        })
      },
      dilPictureList(){
        this.defaultData.states='待提交';
        this.defaultData.skuNo=''
      },
      addDil2:function () {
        this.addForm.SonClass=[];
        this.addForm.cnName='';
        this.addForm.enName='';
        this.addForm.productId='';
        this.picList=[];
      },
      addDil(){
//          alert('重置')
        this.dataState=true;
        this.addForm.productId='';
        this.addForm.cnName='';
        this.addForm.enName='';
        this.addForm.categoryId='';
        this.addForm.attributeId='';
        this.addForm.productNote='';
        this.addForm.state='caogao';
        this.addForm.imageId=[];
        this.SonDis=false;
        this.SonClass=[];
        this.addForm.SonClass=[];
        this.SonAttribute=[];
        this.distributionFrom.imageId=[];
        this.distributionFrom.photoId='';
        this.getPictureList();
        this.picList=[];
        this.$refs['addForm'].resetFields();
      },
      addDill(){
        if( this.dialogFlag.activeTab === '0' ){
          this.$refs.msgDialog.ResetFrom();
        }
//          alert('重置')
        //this.$refs.msgDialog.ResetFrom();     2017-11-14
        if(this.dialogFlag.dialogTitle=='查看产品完整资料（含供应商）'){
          this.$refs.purchaseDialog.ResetFrom();
        }
         this.$refs.assistDialog.ResetFrom();
         this.$refs.describeDialog.ResetFrom();
        this.$refs.logisticsDialog.removeForm();

        this.dialogFlag.activeTab = '0';
        //this.getPictureList();

      },
      selsChange: function (sels) {
        this.sels = sels;
        console.log(this.sels)
        console.log(999887)
      },
      batchInfoDialog3:function(val){
        //alert(9987)
        var vm = this;
        vm.auditFrom2.productIds=[];
        vm.auditFrom2.productIds = vm.sels.map(item => item.productId);
        if(vm.auditFrom2.productIds == '' ){
          vm.tips();
        }else{
          var msg,isPirates;
          msg = '您确定要批量提交此产品开发?';
          vm.doItem(msg,'productDevInfo/auditCaogao',this.auditFrom2.productIds,vm.getPictureList);
        }
      },
      batchInfoDialog4:function(row,val){//批量删除
        let vm = this;
        vm.auditFrom2.productIds=[];
        vm.auditFrom2.productIds = vm.sels.map(item => item.productId);
        if(vm.auditFrom2.productIds == '' ){
          vm.tips();
        }else{
          var msg,isPirates;
          msg = '您确定要批量删除此产品开发?';
          vm.doItem(msg,'productDevInfo/delete',this.auditFrom2.productIds,vm.getPictureList);
        }

      },

      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.getPictureList();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.getPictureList();
      },
      handleRemove(file,fileList) {
        for(var i=0;i<this.picList.length;i++){
          if(this.picList[i].attachId == file.attachId){
            this.picList.splice(i,1);
          }
        }
      },

      preview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      batchInfoDialog8(){
        let vm = this;
        vm.distributionFrom.productId=[];
        vm.distributionFrom.productId = vm.sels.map(item => item.productId);
        if(vm.distributionFrom.productId == '' ){
          vm.tips();
        }else{
          this.distribution=true;
        }
      },
      addDistribution(){
        this.httpPost('productDevInfo/putImagePhoto',this.distributionFrom).then(res=>{
          console.log(res)
          if (res.data.result==true){
            this.distribution=false;
            this.getPictureList()
          }
          this.$message(res.data.message)
        })
      },
      distributionDil(){

      },
      Photographydata1(val){
        this.distributionFrom.photoId=val.value
      },
      Photographydata2(val){
        console.log(val)
        this.distributionFrom.imageId=val.value
      },
      /*--------------2017-11-14  新增 hejing   start-------------------------------------*/
      getBlisterWeight:function(){
        if(this.addForm.productLength !='' && this.addForm.productWidth !='' && this.addForm.productHeight !=''){
            this.blisterWeight = Number((this.addForm.productLength*this.addForm.productWidth*this.addForm.productHeight/6000)).toFixed(4)
        }else{
            this.blisterWeight = '';
        }
      },
      getDevelopUser(val){
        this.addForm.developUser=val.value;
      },
      getSpu:function(val){
        var spuInfo = JSON.parse(JSON.stringify(val.data));
        this.addForm.spuInfo = spuInfo
        this.addForm.spuId = spuInfo.spuId;
        this.addForm.spuName = spuInfo.spuName;
        this.addForm.specificationId = spuInfo.specificationId;
        this.addForm.categoryId = spuInfo.categoryIds;
        this.addForm.SonClass = spuInfo.categoryIds;
        this.isDisabledd = val.value != '' ? true : false;
      },
      getSpe:function(val){
        this.addForm.specificationId = val.value;
      },
      getPla:function(val){
        this.addForm.channelId = val.value;
      },
      /*-------------开发人员使用穿梭框  2017-11-16-------------------------------------*/
      ...mapActions([
        'getselectedArr'
      ]),
      getFull:function(val){
        this.dialogFlag.Fullisopen = true;
        this.fullNum=val;
        this.getselectedArr(this.developUserList)
      },
      requestemper(){
        this.httpPost('productUserGroup/getList?groupName=开发人员').then(res => {
            this.developUserList = res.data;
        })
      },
    },
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  .tatestyle{
    display: block;
    line-height: 41px;
    /*text-align: center;*/
    padding-left: 20px;
    min-height: 41px;
    border-right: 1px solid #e4e4e4
  }
 .optionValue{
    margin:0 10px;
  }
  .picDetail{
    width:150px;
    height:150px;
  }
  .el-radio-group{
    display:flex!important;
  }
  .quesright{
    float: right;
  }
</style>
