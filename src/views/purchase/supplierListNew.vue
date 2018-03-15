<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="2">
          <el-select v-model="selectParams.optionTitle" filterable @change="selectParams.optionValue=''" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="optionValue" id="research_btn" size="small" @click="selectFilter">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">供应商状态</span>
            <el-radio-group v-model="pageFilter.isUse" @change="getSupplierList" size="small">
              <el-radio-button v-for="item in modalData" :label="item.value" :key="item.value" :value="item.value" v-if="ButtonInfo[item.value]!='0'">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small"   v-if="ButtonInfo['添加供应商']!='0'" class="el-icon-plus" @click="showAddDialog(dialogFlag.dialogTitle='添加供应商');dialogFlag.inputDisabled=false;activeTab='0';">&nbsp;添加供应商</el-button>
        <el-button type="primary" size="small"   v-if="ButtonInfo['筛选']!='0'"  @click="dialogFlag.openFF = true;">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.isUse != 3">
        <el-button type="primary" size="small"   v-if="ButtonInfo['批量导入']!='0'" icon="" @click="importData.isOpen = !importData.isOpen">批量导入</el-button>
        <el-button type="primary" size="small"  v-if="ButtonInfo['批量导出']!='0'"  @click="downDown(exportUrl)">批量导出</el-button>
        <el-button size="small" type="primary"  v-if="ButtonInfo['批量删除']!='0' && pageFilter.isUse == 0" id="supplier_delete_btn" @click="batchDelete()" class="supplier_delete_btn">批量删除</el-button>
        <el-button size="small" type="primary"  v-if="ButtonInfo['批量提交']!='0' && pageFilter.isUse == 0" id="supplier_delete_btn" @click="batchDelete()" class="supplier_delete_btn">批量提交</el-button>
        <el-button size="small" type="primary"  v-if="ButtonInfo['批量通过']!='0' && pageFilter.isUse == 1" id="supplier_delete_btn" @click="batchDelete()" class="supplier_delete_btn">批量通过</el-button>
        <el-button size="small" type="primary"  v-if="ButtonInfo['批量不通过']!='0' && pageFilter.isUse == 1" id="supplier_delete_btn" @click="batchDelete()" class="supplier_delete_btn">批量不通过</el-button>
        <el-button size="small" type="primary"  v-if="ButtonInfo['批量回退']!='0' && pageFilter.isUse == 2" id="supplier_delete_btn" @click="batchDelete()" class="supplier_delete_btn">批量回退</el-button>
        <el-button size="small" type="primary"  v-if="ButtonInfo['批量分配']!='0' && pageFilter.isUse == 4" id="supplier_delete_btn" @click="batchDelete()" class="supplier_delete_btn">批量分配</el-button>
      </el-row>
      <el-tabs :tab-position="tabPosition" v-if="pageFilter.isUse == 3">
        <el-tab-pane label="未启用供应商平台"></el-tab-pane>
        <el-tab-pane label="已启用供应商平台"></el-tab-pane>
      </el-tabs>
      <div id="item_list">
        <el-table :data="supplierListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.dialogTitle='查看供应商');dialogFlag.inputDisabled=true;activeTab='0';" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="pageFilter.isUse == 0 ||　pageFilter.isUse == 3">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.dialogTitle='编辑供应商');dialogFlag.inputDisabled=false;activeTab='0';">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="pageFilter.isUse == 0">
                <i class="iconfontyyy" @click="showDelDialog(scope.row)">&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark"content="同意" placement="top-start"  v-if="ButtonInfo['同意']!='0'">
                <i class="iconfontyyy" v-if="pageFilter.isUse == 0"  @click="showDelDialog">&#xe67e;</i>
                <i class="iconfontyyy" v-if="pageFilter.isUse == 1"  @click="showDelDialog">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" v-if="pageFilter.isUse == 1" content="不同意" placement="top-start">
                <i class="iconfontyyy" @click="showDelDialog">&#xe665;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" v-if="pageFilter.isUse == 2" content="回退" placement="top-start">
                <i class="iconfontyyy" @click="showDelDialog">&#xe666;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" v-if="pageFilter.isUse == 4 || pageFilter.isUse == 5" content="分配" placement="top-start">
                <i class="iconfontyyy" @click="dialogFlag.openT = true">&#xe639;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="vendorName" label="供应商名称" align="center"></el-table-column>
          <el-table-column sortable prop="province" label="省份" align="center"></el-table-column>
          <el-table-column sortable prop="city" label="地市" align="center"></el-table-column>
          <el-table-column sortable prop="street" label="开发"  align="center"></el-table-column>
          <el-table-column sortable prop="street" label="跟单"  align="center"></el-table-column>
          <el-table-column sortable prop="street" label="是否开通供应商平台"  align="center"></el-table-column>
          <el-table-column sortable prop="contactUser" label="联系人"  align="center"></el-table-column>
          <el-table-column sortable prop="contactTel" label="联系电话"  align="center"></el-table-column>
          <el-table-column sortable prop="contactUser" label="添加人"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="添加时间"  :formatter="tool.dateFormatter" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------查看 / 编辑 / 添加 供应商 弹出框--------------------------->
    <div id="div" class="picHover">
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="resetForm('vendorInfoModel');">
        <el-tabs v-model="activeTab" >
          <el-tab-pane label="基本信息" name='0' :disabled="false">
            <el-form :model="vendorInfoModel"  :rules="infoRules" ref="vendorInfoModel" label-width="180px" class="demo-ruleForm">
              <el-form-item label="供应商名称"  prop="vendorName" required>
                <el-input v-model="vendorInfoModel.vendorName" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="网址"  prop="websiteUrl" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }">
                <el-input v-model="vendorInfoModel.websiteUrl" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="地址"  required>
                <el-row>
                  <el-col :span="6">
                    <el-form-item prop="province">
                      <el-select size="small" v-model="vendorInfoModel.province" placeholder="请选择省份" @change="getProv($event)" :disabled="dialogFlag.inputDisabled">
                        <el-option v-for="item in provs" :label="item.label" :value="item.value" :key="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col >
                  <el-col :span='6'>
                    <el-form-item prop="city">
                      <el-select size="small"v-model="vendorInfoModel.city"placeholder="请选择城市":disabled="dialogFlag.inputDisabled" >
                        <el-option v-for="item in citys" :label="item.label" :value="item.value" :key="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item prop="street">
                      <el-input v-model="vendorInfoModel.street" :disabled="dialogFlag.inputDisabled" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="工厂地址" >
                <el-row>
                  <el-col :span="6">
                    <el-form-item prop="province">
                      <el-select size="small" v-model="vendorInfoModel.province" placeholder="请选择省份" @change="getProv($event)" :disabled="dialogFlag.inputDisabled">
                        <el-option v-for="item in provs" :label="item.label" :value="item.value" :key="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col >
                  <el-col :span='6'>
                    <el-form-item prop="city">
                      <el-select size="small"v-model="vendorInfoModel.city"placeholder="请选择城市":disabled="dialogFlag.inputDisabled" >
                        <el-option v-for="item in citys" :label="item.label" :value="item.value" :key="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item prop="street">
                      <el-input v-model="vendorInfoModel.street" :disabled="dialogFlag.inputDisabled" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="固话"  prop="telNo" :rules="{ min: 1, max: 20, message: '固话长度不能超过 20 个字符', trigger: 'change' }">
                <el-input v-model="vendorInfoModel.telNo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="传真"  prop="faxNo" :rules="{ min: 1, max: 20, message: '不能超过 20 个字符', trigger: 'change' }">
                <el-input v-model="vendorInfoModel.faxNo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="性质"  prop="companyNature"  required>
                <el-radio-group v-model="vendorInfoModel.companyNature">
                  <el-radio  :label="true" name="1" :disabled="dialogFlag.inputDisabled">工厂</el-radio>
                  <el-radio  :label="true" name="bankTransfer" :disabled="dialogFlag.inputDisabled">公司</el-radio>
                  <el-radio  :label="false" name="alipay" :disabled="dialogFlag.inputDisabled">个人</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="营业执照&法人身份证" class="picture" required>
                <el-upload :http-request="uploadFilePic" :action="uploadPic" list-type="picture-card" drag :file-list="vendorInfoModel.attachList"  :on-remove="handleRemove" accept=".jpg,.jpeg,.png">
                  <el-button size="small" type="primary" v-if='dialogFlag.inputDisabled == false'>点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="廉洁共建协议书" class="picture">
                <el-upload :http-request="uploadFilePic" :action="uploadPic" list-type="picture-card" drag :file-list="vendorInfoModel.attachList"  :on-remove="handleRemove" accept=".jpg,.jpeg,.png">
                  <el-button size="small" type="primary" v-if='dialogFlag.inputDisabled == false'>点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="备注" class="picture">
                <el-input type="textarea"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="联系人" name='1' :disabled="false">
            <el-form :model="form"  ref="form">
              <div style="text-align: right;margin-bottom: 10px;">
                <el-button size="small" type="primary"   @click="addRelationship" :disabled="dialogFlag.inputDisabled" v-if='dialogFlag.inputDisabled == false'>添加联系人</el-button>
              </div>
              <el-table :data="vendorContactList" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column  label="操作" align="center" width="120px">
                  <template scope="scope" >
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="scope.$index != 0">
                      <i class="iconfontyyy" @click="deleteRelationship(item)" :disabled="dialogFlag.inputDisabled" v-if='dialogFlag.inputDisabled == false'>&#xe6f7;</i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="contactUser" label="姓名*" align="center">
                  <template scope="scope" >
                    <el-input type="text"></el-input>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="contactUser" label="电话*" align="center">
                  <template scope="scope" >
                    <el-input type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="contactUser" label="职位" align="center">
                  <template scope="scope" >
                    <el-input type="text"></el-input>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="contactUser" label="QQ*"  align="center">
                  <template scope="scope" >
                    <el-input type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="contactUser" label="阿里旺旺"  align="center">
                  <template scope="scope" >
                    <el-input type="text"></el-input>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="contactUser" label="邮箱"  align="center">
                  <template scope="scope" >
                    <el-input type="text"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="财务信息" name='2' :disabled="false">
            <el-form :model="venderPaymentModel" ref="venderPaymentModel" label-width="120px" class="demo-ruleForm">
              <el-form-item label="付款方式1" prop="paymentType" >
                <el-radio v-model="venderPaymentModel.paymentType" :label="0" name="bankTransfer" :disabled="dialogFlag.inputDisabled">月结</el-radio><br/>
                <el-radio v-model="venderPaymentModel.paymentType" :label="1" name="alipay" :disabled="dialogFlag.inputDisabled">
                  <span>货到付款</span> <el-input type="text" placeholder="请输入天数" style="width: 100px;"></el-input> <span>天</span>
                </el-radio><br/>
                <el-radio v-model="venderPaymentModel.paymentType" :label="2" name="cash" :disabled="dialogFlag.inputDisabled">先款后货</el-radio><br/>
                <el-radio v-model="venderPaymentModel.paymentType" :label="3" name="cash" :disabled="dialogFlag.inputDisabled">第三方付款</el-radio><br/>
              </el-form-item>
              <el-form-item label="税率" prop="bankName" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }">
                <el-radio v-model="venderPaymentModel.paymentType2" :label="1" name="cash" :disabled="dialogFlag.inputDisabled">不开票</el-radio>
                <el-radio v-model="venderPaymentModel.paymentType2" :label="2" name="cash" :disabled="dialogFlag.inputDisabled">普通发票</el-radio>
                <el-radio v-model="venderPaymentModel.paymentType2" :label="3" name="cash" :disabled="dialogFlag.inputDisabled">增值发票</el-radio>
                <span v-if="venderPaymentModel.paymentType2 != 1">税率 <el-input type="number" min="0" max="0.99999999999" placeholder="请输入1以下的小数" style="width: 100px;"></el-input></span>
              </el-form-item>
              <el-form-item label="付款方式2" prop="bankName" >
                <el-radio v-model="venderPaymentModel.paymentType1" :label="1" name="cash" :disabled="dialogFlag.inputDisabled">公账</el-radio>
                <el-radio v-model="venderPaymentModel.paymentType1" :label="2" name="cash" :disabled="dialogFlag.inputDisabled">私账</el-radio>
                <el-radio v-model="venderPaymentModel.paymentType1" :label="3" name="cash" :disabled="dialogFlag.inputDisabled">支付宝</el-radio>
              </el-form-item>
              <el-form-item label="收款单位" prop="bankAccNo" v-if="venderPaymentModel.paymentType1 != 3" :rules="{ min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'change' }">
                <el-input v-model="venderPaymentModel.bankAccNo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="收款账号" prop="bankAccNo" v-if="venderPaymentModel.paymentType1 != 3" :rules="{ min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'change' }">
                <el-input v-model="venderPaymentModel.bankAccNo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="开户银行信息" prop="bankAccName" v-if="venderPaymentModel.paymentType1 != 3" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }">
                <el-input v-model="venderPaymentModel.bankAccName" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="支付宝收款账号" prop="alipayAccNo" v-if="venderPaymentModel.paymentType1 == 3" :rules="{ min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'change' }">
                <el-input v-model="venderPaymentModel.alipayAccNo" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="支付宝收款人" prop="alipayAccName" v-if="venderPaymentModel.paymentType1 == 3" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }">
                <el-input v-model="venderPaymentModel.alipayAccName" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="高级功能" name='3' :disabled="false">
            <el-form :model="vendorAccountsModel" label-width="160px" ref="vendorAccountsModel"  class="demo-ruleForm">
              <div style="margin-left: 20px;font-weight: bold;font-size: 16px;">供应商平台</div>
              <el-form-item label="供应商系统地址"   prop="webUrl" :rules="{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }">
                <el-input v-model="vendorAccountsModel.webUrl" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="供应商账号"  prop="userNo" :rules="{ min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'change' }">
                <el-input v-model="vendorAccountsModel.userNo" placeholder="建议采用供应商联系人手机" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="供应商密码"  prop="userPwd" >
                <span>供应商初始密码为</span><span v-model="vendorAccountsModel.userPwd">123456</span><el-button class="resetPass" @click="showMessage" :disabled="dialogFlag.inputDisabled">重置密码</el-button>
              </el-form-item>
              <el-form-item label="状态"  prop="isUse">
                <el-radio-group v-model="vendorAccountsModel.isUse">
                  <el-radio  :label="true" name="bankTransfer" :disabled="dialogFlag.inputDisabled">启用</el-radio>
                  <el-radio  :label="false" name="alipay" :disabled="dialogFlag.inputDisabled">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <div style="margin-left: 20px;font-weight: bold;font-size: 16px;">跟单</div>
              <el-form-item label="跟单" label-width="120px"  prop="webUrl" :rules="{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'change' }">
                <el-input v-model="vendorAccountsModel.webUrl" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.infoDetail = false;activeTab='0';vendorInfoModel.attachList=[];">{{dialogFlag.inputDisabled==true? '关闭': '取消'}}</el-button>
          <el-button type="" @click="goPrev()" v-if="activeTab!=0" v-show="dialogFlag.inputDisabled==false">上一步</el-button>
          <el-button type="" @click="goNext()" v-if="activeTab!=3" v-show="dialogFlag.inputDisabled==false">下一步</el-button>
          <el-button type="primary" @click="addOrUpdateSupplier();vendorInfoModel.attachList=[]" v-if="this.activeTab == '3'" :loading="$store.state.loading" v-show="this.dialogFlag.inputDisabled == false">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <!------------------导入手工订单 弹出框--------------------------->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getSupplierList"></import-dialog>
    <!--所有人员-->
    <el-dialog title="添加人员"  :visible.sync="dialogFlag.openF" size="tiny" :close-on-click-modal="false" class="headerBorder">
      <get-allpersonnel @childValue="getChildValue" ></get-allpersonnel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openF = false;">关 闭</el-button>
        <el-button type="primary" @click="submitselected()" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!------------------------分配人员---------------------------------->
    <el-dialog title="分配人员" :visible.sync="dialogFlag.openT" :close-on-click-modal="false">
      <el-select  filterable clearable v-model="developUser"  placeholder="请选拔开发人员"  :disabled="SonDis" style="margin-left: 40px;">
        <el-option v-for="item in developUserList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
      </el-select>
      <el-tooltip class="item" effect="dark" content="添加人员" placement="top-start" v-if="pageFilter.isUse == 4">
        <i class="iconfontyyy" @click="getFull('1');">&#xe623;</i>
      </el-tooltip>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openT = false">取消</el-button>
        <el-button type="primary" @click="dialogFlag.openT = false" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--筛选------------------------------------------------------------------------------>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.openFF" size="small" :close-on-click-modal="false" >
        <div class="data_body">
          <title-header></title-header>
          <text-input :select-value="pageFilter.stoId" condition-name="供应商" text-type="供应商" place-value="请输入供应商" @child-change-val="getTextInput"></text-input>
          <time-data :start-time="pageFilter.stoStaStartTime" condition-name="创建日期" :end-time="pageFilter.stoStaEndTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <select-input :select-value="pageFilter.userId" condition-name="盘点人" :options-data="modalData" @child-change-val="getSelectInput"></select-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">清除条件</el-button>
          <el-button @click="dialogFlag.openFF = false;">筛 选</el-button>
          <el-button @click="dialogFlag.openFF = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import timeData from '../../components/ScreenModular/timeDate.vue'
  export default{
    components: {titleHeader, textInput,selectInput,timeData},
    data(){
      String.prototype.trim=function() {
        return this.replace(/(^\s*)|(\s*$)/g,'');
      };
      const regNature = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入性质'));
        } else{
          callback();
        }
      };
      const regProv = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择城市'));
        } else{
          callback();
        }
      };
      const regCity = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择市'));
        } else{
          callback();
        }
      };
      const regName = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请输入供应商名称'));
        }else{
          callback();
        }
      };
      const regStreet = (rule, value, callback) => {
        if (value.trim() == '') {
          callback(new Error('请输入详细地址'));
        }else{
          callback();
        }
      };
      return {
        developUser:'',
        provs:[{label:"北京",value:"北京"},
          {label:"天津",value:"天津"},
          {label:"河北省",value:"河北省"},
          {label:"山西省",value:"山西省"},
          {label:"内蒙古自治区",value:"内蒙古自治区"},
          {label:"辽宁省",value:"辽宁省"},
          {label:"吉林省",value:"吉林省"},
          {label:"黑龙江省",value:"黑龙江省"},
          {label:"上海",value:"上海"},
          {label:"江苏省",value:"江苏省"},
          {label:"浙江省",value:"浙江省"},
          {label:"安徽省",value:"安徽省"},
          {label:"福建省",value:"福建省"},
          {label:"江西省",value:"江西省"},
          {label:"山东省",value:"山东省"},
          {label:"河南省",value:"河南省"},
          {label:"湖北省",value:"湖北省"},
          {label:"湖南省",value:"湖南省"},
          {label:"广东省",value:"广东省"},
          {label:"广西壮族自治区",value:"广西壮族自治区"},
          {label:"海南省",value:"海南省"},
          {label:"重庆",value:"重庆"},
          {label:"四川省",value:"四川省"},
          {label:"贵州省",value:"贵州省"},
          {label:"云南省",value:"云南省"},
          {label:"西藏自治区",value:"西藏自治区"},
          {label:"陕西省",value:"陕西省"},
          {label:"甘肃省",value:"甘肃省"},
          {label:"青海省",value:"青海省"},
          {label:"宁夏回族自治区",value:"宁夏回族自治区"},
          {label:"新疆维吾尔自治区",value:"新疆维吾尔自治区"},
          {label:"台湾省",value:"台湾省"},
          {label:"香港特别行政区",value:"香港特别行政区"},
          {label:"澳门特别行政区",value:"澳门特别行政区"}] ,
        allCity:[
          {
            prov: "北京",
            label: "北京市"
          }, {
            prov: "天津",
            label: "天津市"
          }, {
            prov: "河北省",
            label: "石家庄市"
          }, {
            prov: "河北省",
            label: "唐山市"
          }, {
            prov: "河北省",
            label: "秦皇岛市"
          }, {
            prov: "河北省",
            label: "邯郸市"
          }, {
            prov: "河北省",
            label: "邢台市"
          }, {
            prov: "河北省",
            label: "保定市"
          }, {
            prov: "河北省",
            label: "张家口市"
          }, {
            prov: "河北省",
            label: "承德市"
          }, {
            prov: "河北省",
            label: "沧州市"
          }, {
            prov: "河北省",
            label: "廊坊市"
          }, {
            prov: "河北省",
            label: "衡水市"
          }, {
            prov: "山西省",
            label: "太原市"
          }, {
            prov: "山西省",
            label: "大同市"
          }, {
            prov: "山西省",
            label: "阳泉市"
          }, {
            prov: "山西省",
            label: "长治市"
          }, {
            prov: "山西省",
            label: "晋城市"
          }, {
            prov: "山西省",
            label: "朔州市"
          }, {
            prov: "山西省",
            label: "晋中市"
          }, {
            prov: "山西省",
            label: "运城市"
          }, {
            prov: "山西省",
            label: "忻州市"
          }, {
            prov: "山西省",
            label: "临汾市"
          }, {
            prov: "山西省",
            label: "吕梁市"
          }, {
            prov: "内蒙古自治区",
            label: "呼和浩特市"
          }, {
            prov: "内蒙古自治区",
            label: "包头市"
          }, {
            prov: "内蒙古自治区",
            label: "乌海市"
          }, {
            prov: "内蒙古自治区",
            label: "赤峰市"
          }, {
            prov: "内蒙古自治区",
            label: "通辽市"
          }, {
            prov: "内蒙古自治区",
            label: "鄂尔多斯市"
          }, {
            prov: "内蒙古自治区",
            label: "呼伦贝尔市"
          }, {
            prov: "内蒙古自治区",
            label: "巴彦淖尔市"
          }, {
            prov: "内蒙古自治区",
            label: "乌兰察布市"
          }, {
            prov: "内蒙古自治区",
            label: "兴安盟"
          }, {
            prov: "内蒙古自治区",
            label: "锡林郭勒盟"
          }, {
            prov: "内蒙古自治区",
            label: "阿拉善盟"
          }, {
            prov: "辽宁省",
            label: "沈阳市"
          }, {
            prov: "辽宁省",
            label: "大连市"
          }, {
            prov: "辽宁省",
            label: "鞍山市"
          }, {
            prov: "辽宁省",
            label: "抚顺市"
          }, {
            prov: "辽宁省",
            label: "本溪市"
          }, {
            prov: "辽宁省",
            label: "丹东市"
          }, {
            prov: "辽宁省",
            label: "锦州市"
          }, {
            prov: "辽宁省",
            label: "营口市"
          }, {
            prov: "辽宁省",
            label: "阜新市"
          }, {
            prov: "辽宁省",
            label: "辽阳市"
          }, {
            prov: "辽宁省",
            label: "盘锦市"
          }, {
            prov: "辽宁省",
            label: "铁岭市"
          }, {
            prov: "辽宁省",
            label: "朝阳市"
          }, {
            prov: "辽宁省",
            label: "葫芦岛市"
          }, {
            prov: "吉林省",
            label: "长春市"
          }, {
            prov: "吉林省",
            label: "吉林市"
          }, {
            prov: "吉林省",
            label: "四平市"
          }, {
            prov: "吉林省",
            label: "辽源市"
          }, {
            prov: "吉林省",
            label: "通化市"
          }, {
            prov: "吉林省",
            label: "白山市"
          }, {
            prov: "吉林省",
            label: "松原市"
          }, {
            prov: "吉林省",
            label: "白城市"
          }, {
            prov: "吉林省",
            label: "延边朝鲜族自治州"
          }, {
            prov: "黑龙江省",
            label: "哈尔滨市"
          }, {
            prov: "黑龙江省",
            label: "齐齐哈尔市"
          }, {
            prov: "黑龙江省",
            label: "鸡西市"
          }, {
            prov: "黑龙江省",
            label: "鹤岗市"
          }, {
            prov: "黑龙江省",
            label: "双鸭山市"
          }, {
            prov: "黑龙江省",
            label: "大庆市"
          }, {
            prov: "黑龙江省",
            label: "伊春市"
          }, {
            prov: "黑龙江省",
            label: "佳木斯市"
          }, {
            prov: "黑龙江省",
            label: "七台河市"
          }, {
            prov: "黑龙江省",
            label: "牡丹江市"
          }, {
            prov: "黑龙江省",
            label: "黑河市"
          }, {
            prov: "黑龙江省",
            label: "绥化市"
          }, {
            prov: "黑龙江省",
            label: "大兴安岭地区"
          }, {
            prov: "上海",
            label: "上海市"
          }, {
            prov: "江苏省",
            label: "南京市"
          }, {
            prov: "江苏省",
            label: "无锡市"
          }, {
            prov: "江苏省",
            label: "徐州市"
          }, {
            prov: "江苏省",
            label: "常州市"
          }, {
            prov: "江苏省",
            label: "苏州市"
          }, {
            prov: "江苏省",
            label: "南通市"
          }, {
            prov: "江苏省",
            label: "连云港市"
          }, {
            prov: "江苏省",
            label: "淮安市"
          }, {
            prov: "江苏省",
            label: "盐城市"
          }, {
            prov: "江苏省",
            label: "扬州市"
          }, {
            prov: "江苏省",
            label: "镇江市"
          }, {
            prov: "江苏省",
            label: "泰州市"
          }, {
            prov: "江苏省",
            label: "宿迁市"
          }, {
            prov: "浙江省",
            label: "杭州市"
          }, {
            prov: "浙江省",
            label: "宁波市"
          }, {
            prov: "浙江省",
            label: "温州市"
          }, {
            prov: "浙江省",
            label: "嘉兴市"
          }, {
            prov: "浙江省",
            label: "湖州市"
          }, {
            prov: "浙江省",
            label: "绍兴市"
          }, {
            prov: "浙江省",
            label: "金华市"
          }, {
            prov: "浙江省",
            label: "衢州市"
          }, {
            prov: "浙江省",
            label: "舟山市"
          }, {
            prov: "浙江省",
            label: "台州市"
          }, {
            prov: "浙江省",
            label: "丽水市"
          }, {
            prov: "安徽省",
            label: "合肥市"
          }, {
            prov: "安徽省",
            label: "芜湖市"
          }, {
            prov: "安徽省",
            label: "蚌埠市"
          }, {
            prov: "安徽省",
            label: "淮南市"
          }, {
            prov: "安徽省",
            label: "马鞍山市"
          }, {
            prov: "安徽省",
            label: "淮北市"
          }, {
            prov: "安徽省",
            label: "铜陵市"
          }, {
            prov: "安徽省",
            label: "安庆市"
          }, {
            prov: "安徽省",
            label: "黄山市"
          }, {
            prov: "安徽省",
            label: "滁州市"
          }, {
            prov: "安徽省",
            label: "阜阳市"
          }, {
            prov: "安徽省",
            label: "宿州市"
          }, {
            prov: "安徽省",
            label: "六安市"
          }, {
            prov: "安徽省",
            label: "亳州市"
          }, {
            prov: "安徽省",
            label: "池州市"
          }, {
            prov: "安徽省",
            label: "宣城市"
          }, {
            prov: "福建省",
            label: "福州市"
          }, {
            prov: "福建省",
            label: "厦门市"
          }, {
            prov: "福建省",
            label: "莆田市"
          }, {
            prov: "福建省",
            label: "三明市"
          }, {
            prov: "福建省",
            label: "泉州市"
          }, {
            prov: "福建省",
            label: "漳州市"
          }, {
            prov: "福建省",
            label: "南平市"
          }, {
            prov: "福建省",
            label: "龙岩市"
          }, {
            prov: "福建省",
            label: "宁德市"
          }, {
            prov: "江西省",
            label: "南昌市"
          }, {
            prov: "江西省",
            label: "景德镇市"
          }, {
            prov: "江西省",
            label: "萍乡市"
          }, {
            prov: "江西省",
            label: "九江市"
          }, {
            prov: "江西省",
            label: "新余市"
          }, {
            prov: "江西省",
            label: "鹰潭市"
          }, {
            prov: "江西省",
            label: "赣州市"
          }, {
            prov: "江西省",
            label: "吉安市"
          }, {
            prov: "江西省",
            label: "宜春市"
          }, {
            prov: "江西省",
            label: "抚州市"
          }, {
            prov: "江西省",
            label: "上饶市"
          }, {
            prov: "山东省",
            label: "济南市"
          }, {
            prov: "山东省",
            label: "青岛市"
          }, {
            prov: "山东省",
            label: "淄博市"
          }, {
            prov: "山东省",
            label: "枣庄市"
          }, {
            prov: "山东省",
            label: "东营市"
          }, {
            prov: "山东省",
            label: "烟台市"
          }, {
            prov: "山东省",
            label: "潍坊市"
          }, {
            prov: "山东省",
            label: "济宁市"
          }, {
            prov: "山东省",
            label: "泰安市"
          }, {
            prov: "山东省",
            label: "威海市"
          }, {
            prov: "山东省",
            label: "日照市"
          }, {
            prov: "山东省",
            label: "莱芜市"
          }, {
            prov: "山东省",
            label: "临沂市"
          }, {
            prov: "山东省",
            label: "德州市"
          }, {
            prov: "山东省",
            label: "聊城市"
          }, {
            prov: "山东省",
            label: "滨州市"
          }, {
            prov: "山东省",
            label: "菏泽市"
          }, {
            prov: "河南省",
            label: "郑州市"
          }, {
            prov: "河南省",
            label: "开封市"
          }, {
            prov: "河南省",
            label: "洛阳市"
          }, {
            prov: "河南省",
            label: "平顶山市"
          }, {
            prov: "河南省",
            label: "安阳市"
          }, {
            prov: "河南省",
            label: "鹤壁市"
          }, {
            prov: "河南省",
            label: "新乡市"
          }, {
            prov: "河南省",
            label: "焦作市"
          }, {
            prov: "河南省",
            label: "濮阳市"
          }, {
            prov: "河南省",
            label: "许昌市"
          }, {
            prov: "河南省",
            label: "漯河市"
          }, {
            prov: "河南省",
            label: "三门峡市"
          }, {
            prov: "河南省",
            label: "南阳市"
          }, {
            prov: "河南省",
            label: "商丘市"
          }, {
            prov: "河南省",
            label: "信阳市"
          }, {
            prov: "河南省",
            label: "周口市"
          }, {
            prov: "河南省",
            label: "驻马店市"
          }, {
            prov: "河南省",
            label: "省直辖县级行政区划"
          }, {
            prov: "湖北省",
            label: "武汉市"
          }, {
            prov: "湖北省",
            label: "黄石市"
          }, {
            prov: "湖北省",
            label: "十堰市"
          }, {
            prov: "湖北省",
            label: "宜昌市"
          }, {
            prov: "湖北省",
            label: "襄阳市"
          }, {
            prov: "湖北省",
            label: "鄂州市"
          }, {
            prov: "湖北省",
            label: "荆门市"
          }, {
            prov: "湖北省",
            label: "孝感市"
          }, {
            prov: "湖北省",
            label: "荆州市"
          }, {
            prov: "湖北省",
            label: "黄冈市"
          }, {
            prov: "湖北省",
            label: "咸宁市"
          }, {
            prov: "湖北省",
            label: "随州市"
          }, {
            prov: "湖北省",
            label: "恩施土家族苗族自治州"
          }, {
            prov: "湖北省",
            label: "省直辖县级行政区划"
          }, {
            prov: "湖北省",
            label: "仙桃市"
          }, {
            prov: "湖北省",
            label: "潜江市"
          }, {
            prov: "湖北省",
            label: "天门市"
          }, {
            prov: "湖北省",
            label: "神农架林区"
          }, {
            prov: "湖南省",
            label: "长沙市"
          }, {
            prov: "湖南省",
            label: "株洲市"
          }, {
            prov: "湖南省",
            label: "湘潭市"
          }, {
            prov: "湖南省",
            label: "衡阳市"
          }, {
            prov: "湖南省",
            label: "邵阳市"
          }, {
            prov: "湖南省",
            label: "岳阳市"
          }, {
            prov: "湖南省",
            label: "常德市"
          }, {
            prov: "湖南省",
            label: "张家界市"
          }, {
            prov: "湖南省",
            label: "益阳市"
          }, {
            prov: "湖南省",
            label: "郴州市"
          }, {
            prov: "湖南省",
            label: "永州市"
          }, {
            prov: "湖南省",
            label: "怀化市"
          }, {
            prov: "湖南省",
            label: "娄底市"
          }, {
            prov: "湖南省",
            label: "湘西土家族苗族自治州"
          }, {
            prov: "广东省",
            label: "广州市"
          }, {
            prov: "广东省",
            label: "韶关市"
          }, {
            prov: "广东省",
            label: "深圳市"
          }, {
            prov: "广东省",
            label: "珠海市"
          }, {
            prov: "广东省",
            label: "汕头市"
          }, {
            prov: "广东省",
            label: "佛山市"
          }, {
            prov: "广东省",
            label: "江门市"
          }, {
            prov: "广东省",
            label: "湛江市"
          }, {
            prov: "广东省",
            label: "茂名市"
          }, {
            prov: "广东省",
            label: "肇庆市"
          }, {
            prov: "广东省",
            label: "惠州市"
          }, {
            prov: "广东省",
            label: "梅州市"
          }, {
            prov: "广东省",
            label: "汕尾市"
          }, {
            prov: "广东省",
            label: "河源市"
          }, {
            prov: "广东省",
            label: "阳江市"
          }, {
            prov: "广东省",
            label: "清远市"
          }, {
            prov: "广东省",
            label: "东莞市"
          }, {
            prov: "广东省",
            label: "中山市"
          }, {
            prov: "广东省",
            label: "潮州市"
          }, {
            prov: "广东省",
            label: "揭阳市"
          }, {
            prov: "广东省",
            label: "云浮市"
          }, {
            prov: "广西壮族自治区",
            label: "南宁市"
          }, {
            prov: "广西壮族自治区",
            label: "柳州市"
          }, {
            prov: "广西壮族自治区",
            label: "桂林市"
          }, {
            prov: "广西壮族自治区",
            label: "梧州市"
          }, {
            prov: "广西壮族自治区",
            label: "北海市"
          }, {
            prov: "广西壮族自治区",
            label: "防城港市"
          }, {
            prov: "广西壮族自治区",
            label: "钦州市"
          }, {
            prov: "广西壮族自治区",
            label: "贵港市"
          }, {
            prov: "广西壮族自治区",
            label: "玉林市"
          }, {
            prov: "广西壮族自治区",
            label: "百色市"
          }, {
            prov: "广西壮族自治区",
            label: "贺州市"
          }, {
            prov: "广西壮族自治区",
            label: "河池市"
          }, {
            prov: "广西壮族自治区",
            label: "来宾市"
          }, {
            prov: "广西壮族自治区",
            label: "崇左市"
          }, {
            prov: "海南省",
            label: "海口市"
          }, {
            prov: "海南省",
            label: "三亚市"
          }, {
            prov: "海南省",
            label: "三沙市"
          }, {
            prov: "海南省",
            label: "省直辖县级行政区划"
          }, {
            prov: "海南省",
            label: "五指山市"
          }, {
            prov: "海南省",
            label: "琼海市"
          }, {
            prov: "海南省",
            label: "儋州市"
          }, {
            prov: "海南省",
            label: "文昌市"
          }, {
            prov: "海南省",
            label: "万宁市"
          }, {
            prov: "海南省",
            label: "东方市"
          }, {
            prov: "海南省",
            label: "定安县"
          }, {
            prov: "海南省",
            label: "屯昌县"
          }, {
            prov: "海南省",
            label: "澄迈县"
          }, {
            prov: "海南省",
            label: "临高县"
          }, {
            prov: "海南省",
            label: "白沙黎族自治县"
          }, {
            prov: "海南省",
            label: "昌江黎族自治县"
          }, {
            prov: "海南省",
            label: "乐东黎族自治县"
          }, {
            prov: "海南省",
            label: "陵水黎族自治县"
          }, {
            prov: "海南省",
            label: "保亭黎族苗族自治县"
          }, {
            prov: "海南省",
            label: "琼中黎族苗族自治县"
          }, {
            prov: "重庆",
            label: "重庆市"
          }, {
            prov: "四川省",
            label: "成都市"
          }, {
            prov: "四川省",
            label: "自贡市"
          }, {
            prov: "四川省",
            label: "攀枝花市"
          }, {
            prov: "四川省",
            label: "泸州市"
          }, {
            prov: "四川省",
            label: "德阳市"
          }, {
            prov: "四川省",
            label: "绵阳市"
          }, {
            prov: "四川省",
            label: "广元市"
          }, {
            prov: "四川省",
            label: "遂宁市"
          }, {
            prov: "四川省",
            label: "内江市"
          }, {
            prov: "四川省",
            label: "乐山市"
          }, {
            prov: "四川省",
            label: "南充市"
          }, {
            prov: "四川省",
            label: "眉山市"
          }, {
            prov: "四川省",
            label: "宜宾市"
          }, {
            prov: "四川省",
            label: "广安市"
          }, {
            prov: "四川省",
            label: "达州市"
          }, {
            prov: "四川省",
            label: "雅安市"
          }, {
            prov: "四川省",
            label: "巴中市"
          }, {
            prov: "四川省",
            label: "资阳市"
          }, {
            prov: "四川省",
            label: "阿坝藏族羌族自治州"
          }, {
            prov: "四川省",
            label: "甘孜藏族自治州"
          }, {
            prov: "四川省",
            label: "凉山彝族自治州"
          }, {
            prov: "贵州省",
            label: "贵阳市"
          }, {
            prov: "贵州省",
            label: "六盘水市"
          }, {
            prov: "贵州省",
            label: "遵义市"
          }, {
            prov: "贵州省",
            label: "安顺市"
          }, {
            prov: "贵州省",
            label: "毕节市"
          }, {
            prov: "贵州省",
            label: "铜仁市"
          }, {
            prov: "贵州省",
            label: "黔西南布依族苗族自治州"
          }, {
            prov: "贵州省",
            label: "黔东南苗族侗族自治州"
          }, {
            prov: "贵州省",
            label: "黔南布依族苗族自治州"
          }, {
            prov: "云南省",
            label: "昆明市"
          }, {
            prov: "云南省",
            label: "曲靖市"
          }, {
            prov: "云南省",
            label: "玉溪市"
          }, {
            prov: "云南省",
            label: "保山市"
          }, {
            prov: "云南省",
            label: "昭通市"
          }, {
            prov: "云南省",
            label: "丽江市"
          }, {
            prov: "云南省",
            label: "普洱市"
          }, {
            prov: "云南省",
            label: "临沧市"
          }, {
            prov: "云南省",
            label: "楚雄彝族自治州"
          }, {
            prov: "云南省",
            label: "红河哈尼族彝族自治州"
          }, {
            prov: "云南省",
            label: "文山壮族苗族自治州"
          }, {
            prov: "云南省",
            label: "西双版纳傣族自治州"
          }, {
            prov: "云南省",
            label: "大理白族自治州"
          }, {
            prov: "云南省",
            label: "德宏傣族景颇族自治州"
          }, {
            prov: "云南省",
            label: "怒江傈僳族自治州"
          }, {
            prov: "云南省",
            label: "迪庆藏族自治州"
          }, {
            prov: "西藏自治区",
            label: "拉萨市"
          }, {
            prov: "西藏自治区",
            label: "昌都地区"
          }, {
            prov: "西藏自治区",
            label: "山南地区"
          }, {
            prov: "西藏自治区",
            label: "日喀则地区"
          }, {
            prov: "西藏自治区",
            label: "那曲地区"
          }, {
            prov: "西藏自治区",
            label: "阿里地区"
          }, {
            prov: "西藏自治区",
            label: "林芝地区"
          }, {
            prov: "陕西省",
            label: "西安市"
          }, {
            prov: "陕西省",
            label: "铜川市"
          }, {
            prov: "陕西省",
            label: "宝鸡市"
          }, {
            prov: "陕西省",
            label: "咸阳市"
          }, {
            prov: "陕西省",
            label: "渭南市"
          }, {
            prov: "陕西省",
            label: "延安市"
          }, {
            prov: "陕西省",
            label: "汉中市"
          }, {
            prov: "陕西省",
            label: "榆林市"
          }, {
            prov: "陕西省",
            label: "安康市"
          }, {
            prov: "陕西省",
            label: "商洛市"
          }, {
            prov: "甘肃省",
            label: "兰州市"
          }, {
            prov: "甘肃省",
            label: "嘉峪关市"
          }, {
            prov: "甘肃省",
            label: "金昌市"
          }, {
            prov: "甘肃省",
            label: "白银市"
          }, {
            prov: "甘肃省",
            label: "天水市"
          }, {
            prov: "甘肃省",
            label: "武威市"
          }, {
            prov: "甘肃省",
            label: "张掖市"
          }, {
            prov: "甘肃省",
            label: "平凉市"
          }, {
            prov: "甘肃省",
            label: "酒泉市"
          }, {
            prov: "甘肃省",
            label: "庆阳市"
          }, {
            prov: "甘肃省",
            label: "定西市"
          }, {
            prov: "甘肃省",
            label: "陇南市"
          }, {
            prov: "甘肃省",
            label: "临夏回族自治州"
          }, {
            prov: "甘肃省",
            label: "甘南藏族自治州"
          }, {
            prov: "青海省",
            label: "西宁市"
          }, {
            prov: "青海省",
            label: "海东市"
          }, {
            prov: "青海省",
            label: "海北藏族自治州"
          }, {
            prov: "青海省",
            label: "黄南藏族自治州"
          }, {
            prov: "青海省",
            label: "海南藏族自治州"
          }, {
            prov: "青海省",
            label: "果洛藏族自治州"
          }, {
            prov: "青海省",
            label: "玉树藏族自治州"
          }, {
            prov: "青海省",
            label: "海西蒙古族藏族自治州"
          }, {
            prov: "宁夏回族自治区",
            label: "银川市"
          }, {
            prov: "宁夏回族自治区",
            label: "石嘴山市"
          }, {
            prov: "宁夏回族自治区",
            label: "吴忠市"
          }, {
            prov: "宁夏回族自治区",
            label: "固原市"
          }, {
            prov: "宁夏回族自治区",
            label: "中卫市"
          }, {
            prov: "新疆维吾尔自治区",
            label: "乌鲁木齐市"
          }, {
            prov: "新疆维吾尔自治区",
            label: "克拉玛依市"
          }, {
            prov: "新疆维吾尔自治区",
            label: "吐鲁番地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "哈密地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "昌吉回族自治州"
          }, {
            prov: "新疆维吾尔自治区",
            label: "博尔塔拉蒙古自治州"
          }, {
            prov: "新疆维吾尔自治区",
            label: "巴音郭楞蒙古自治州"
          }, {
            prov: "新疆维吾尔自治区",
            label: "阿克苏地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "克孜勒苏柯尔克孜自治州"
          }, {
            prov: "新疆维吾尔自治区",
            label: "喀什地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "和田地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "伊犁哈萨克自治州"
          }, {
            prov: "新疆维吾尔自治区",
            label: "塔城地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "阿勒泰地区"
          }, {
            prov: "新疆维吾尔自治区",
            label: "自治区直辖县级行政区划"
          }, {
            prov: "新疆维吾尔自治区",
            label: "石河子市"
          }, {
            prov: "新疆维吾尔自治区",
            label: "阿拉尔市"
          }, {
            prov: "新疆维吾尔自治区",
            label: "图木舒克市"
          }, {
            prov: "新疆维吾尔自治区",
            label: "五家渠市"
          }, {
            prov: "台湾省",
            label: "台北市"
          }, {
            prov: "台湾省",
            label: "高雄市"
          }, {
            prov: "台湾省",
            label: "基隆市"
          }, {
            prov: "台湾省",
            label: "台中市"
          }, {
            prov: "台湾省",
            label: "台南市"
          }, {
            prov: "台湾省",
            label: "新竹市"
          }, {
            prov: "台湾省",
            label: "嘉义市"
          }, {
            prov: "台湾省",
            label: "省直辖"
          }, {
            prov: "香港特别行政区",
            label: "香港岛"
          }, {
            prov: "香港特别行政区",
            label: "九龙"
          }, {
            prov: "香港特别行政区",
            label: "新界"
          }, {
            prov: "澳门特别行政区",
            label: "澳门半岛"
          }, {
            prov: "澳门特别行政区",
            label: "澳门离岛"
          }, {
            prov: "澳门特别行政区",
            label: "无堂区划分区域"
          }],
        citys:[],
        developUserList :[],
        excFile:[],     // 导入exc文件
        options: [{
          value: 0,
          label: '名称'
        }, {
          value: 1,
          label: '联系人'
        }, {
          value: 2,
          label: '联系电话'
        }],
        modalData: [{value: 0, label: '草稿'}, {value: 1, label: '待寻购主管审核'},{value: 2, label: '寻购主管审核不通过'},{value:3, label: '寻购主管审核通过'},{value: 4, label: '待跟单主管分配跟单'},{value: 5, label: '已分配跟单'}],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          vendorName:'',
          contactUser:'',
          contactTel:'',
          isUse:'',   //  1：启用，0停用
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        activeTab:'0',     // 查看 编辑 添加 弹出框 的 tab 标签页
        tabArr:['0','1','2','3'],     // tab 标签页数组
        supplierListData:[{vendorName:121},{vendorName:121},{vendorName:121},{vendorName:121},],   // 供应商列表
        dialogFlag:{
          isOpen:false,
          openT:false,
          openF:false,
          openFF:false,
          infoDetail:false,
          dialogTitle:"",     // 弹出框 的title
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        vendor_id:1111,   // 存储供应商id
        sels:[],    //批量删除已选的条目数
        vendorInfoModel: {             // 基本信息
          vendorName: '',
          companyNature:'',
          telNo: '',
          additionData:'',
          websiteUrl:'',
          province:'',
          city:'',
          street:'',
        },
        form:{             //  联系人信息
          vendorContactList:[{
            contactUser:'1',
            contactPost:'',
            contactTel:'',
            contactQq:'',
            aliwangwang:'',
            contactEmail:'',
            compId:'',
          }] ,
          name:'',
        },
        venderPaymentModel: {             // 财务信息
          paymentType: '',
          paymentType2: '',
          paymentType1: '',
          bankName: '',
          bankAccNo: '',
          bankAccName: '',
          alipayAccNo: '',
          alipayAccName: '',
        },
        vendorAccountsModel: {             // 高级功能信息
          webUrl: '',
          userNo: '',
          userPwd: '',
          isUse: '',
        },
        fullNum:'',
        fullList:[],//添加人员Id集合
        importData:{
          isOpen:false,
          importUrl:'importVendorInfo',
          modalUrl:'vendorBasisDataExport',
        },
        exportUrl:'',   //  导出文件地址
        uploadExc:this.RmsUrl+'venderLeadingin?Authorization='+this.sessuserid,   //  上传导入文件地址
        uploadPic:this.RmsUrl+'saveAttachmentMultipartFile?Authorization='+this.sessuserid,   //  上传图片地址
        picList : {
          attachInfoId:[],
          removeAttachInfoId:[],
        },
        tabPosition:'未启用供应商平台',
        vendor_ids:[],   // 删除ids
        num:1,   // 第几次变更省
        excList:'',  //  已选择导入的文件
        infoRules: {
          companyNature:[
            {validator: regNature, trigger: 'change'},
          ],
          street:[
            {validator: regStreet, trigger: 'change'},
            { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }
          ],
          vendorName:[
            {validator: regName, trigger: 'change'},
            { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }
          ],
          province:[
            {validator: regProv, trigger: 'change'}
          ],
          city:[
            {validator: regCity, trigger: 'change'}
          ],
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入名称' : this.selectParams.optionTitle == 1 ? '请输入联系人' :this.selectParams.optionTitle == 2 ? '请输入联系电话' : '';
      },
    },
    mounted () {
      //this.getauthorityList();
      this.getSupplierList();
      this.exportUrl = this.RmsUrl+'deriveVendorData?Authorization='+sessionStorage.getItem('userSession')+'&isUse='+this.pageFilter.isUse;
      console.log(this.exportUrl);
    },
    methods: {

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      selectFilter:function(){
        var selectVal = this.selectParams.optionValue;
        var selectTittle = this.selectParams.optionTitle;
        var vm = this;
        switch(selectTittle){
          case 0:
            vm.pageFilter.vendorName = selectVal ;
            vm.pageFilter.contactUser = '' ;
            vm.pageFilter.contactTel = '';
            this.getSupplierList();
            break;
          case 1:
            vm.pageFilter.contactUser = selectVal ;
            vm.pageFilter.contactTel = '' ;
            vm.pageFilter.vendorName = '';
            this.getSupplierList();
            break;
          case 2:
            vm.pageFilter.contactTel = selectVal ;
            vm.pageFilter.contactUser = '' ;
            vm.pageFilter.vendorName = '';
            this.getSupplierList();
            break;
        }

      },
      getSupplierList:function(){
        this.httpPost('selectVendorAllData',this.qs.stringify(this.pageFilter)).then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.docsDataList;
            this.page = pageData;
            this.supplierListData = pageData.listData;
            this.supplierListData = [{vendorName:121},{vendorName:121},{vendorName:121},{vendorName:121},];
          }else{
            this.supplierListData = [];
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      batchDelete:function(){
        this.vendor_ids = this.sels.map(item => item.vendorId);
        var vm = this;
        if(this.vendor_ids == '' ){
          vm.tips();
        }else{
          this.vendor_ids.join();
          var url = 'removeVendorData?vendorId='+this.vendor_ids;
          vm.doItem('您将永久删除所选数据，确定删除？',url,'',vm.getSupplierList);
        }
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      addRelationship:function(){
        if(this.form.vendorContactList.length >= 10){
          this.$message('最多只能添加十个联系人')
        }else{
          this.form.vendorContactList.push({
            contactUser:'',
            contactTel:'',
            contactQq:'',
            aliwangwang:'',
            contactEmail:'',
            contactPost:'',
            compId:'',
          });
        }
      },
      deleteRelationship:function(val){
        var index = this.form.vendorContactList.indexOf(val);
        if(this.form.vendorContactList.length == 1){
          this.$message('最少保留一位联系人！')
        }else if (index !== -1) {
          this.httpPost('removeVendorContactData?contactId='+this.form.vendorContactList[index].contactId).then(res =>{
            if(res.data.result == true){
              this.form.vendorContactList.splice(index, 1)
            }else{
              this.$message(res.data.message);
            }
          })
        }
      },
      goNext:function(){
        var vm = this;var  data = this.form.vendorContactList;var vp  = this.venderPaymentModel;var regS = /^[^\s]+$/;
        var vali = function(val){
          vm.$refs[val].validate((valid) => {
            if (valid) {
              vm.activeTab = vm.tabArr[vm.tabArr.indexOf(vm.activeTab)+1];
            }else{
              return false;
            }
          });
        };
        switch(this.activeTab){
          case '0':
            vali('vendorInfoModel');
            break;
          case '1':
            for(var i=0;i<data.length;i++){
              if(data[i].contactUser.trim() == '' || data[i].contactTel.trim() == ''){
                this.$message('联系人和联系人电话不能为空！');
                return false;
              }else if(!regS.test(data[i].contactTel.trim())){
                this.$message('联系电话不能输入空格！');
                return false;
              }else if(data[i].contactUser.trim().length>=50 ||data[i].contactPost.trim().length>=50 ||data[i].aliwangwang.trim().length>=50||data[i].contactEmail.trim().length>=50){
                this.$message('姓名，职位及阿里旺旺的长度不能超过50位！');
                return false;
              }else if(data[i].contactTel.trim().length>=20 ||data[i].contactQq.trim().length>=20){
                this.$message('联系电话及QQ长度不能超过20位！');
                return false;
              } else if(!(data[i].contactTel.trim().length>=20 || data[i].contactQq.trim().length>=20) && i==data.length-1){
                this.activeTab = this.tabArr[this.tabArr.indexOf(this.activeTab)+1];
              }
            }
            break;
          case '2':
            if(vp.paymentType == '0'){
              if(vp.bankName == '' || vp.bankAccNo == '' || vp.bankAccName == ''|| vp.bankName == null || vp.bankAccNo == null || vp.bankAccName == null){
                this.$message('付款方式为银行卡时，银行、卡号及收款人不能为空！');
                return false;
              }else{
                vali('venderPaymentModel');
              }
            }else if(vp.paymentType == '1'){
              if(vp.alipayAccNo == '' || vp.alipayAccName == '' || vp.alipayAccNo == null || vp.alipayAccName == null){
                this.$message('付款方式为支付宝时，支付宝账号及支付宝收款人不能为空！');
                return false;
              }else{
                vali('venderPaymentModel');
              }
            }else{
              this.activeTab = this.tabArr[this.tabArr.indexOf(this.activeTab)+1];
            }
            break;
          case '3':
            this.activeTab = this.tabArr[this.tabArr.indexOf(this.activeTab)+1];
            break;
        }
        console.log('当前弹窗tab标签：'+this.activeTab);
      },
      goPrev:function(){
        this.activeTab = this.tabArr[this.tabArr.indexOf(this.activeTab)-1];
      },
      showAddDialog:function(val){
        this.changeClass(val);
        this.num = 1;
        this.picList.removeAttachInfoId = [];
        this.picList.attachInfoId = [];
        this.tool.clearObjValue(this.vendorInfoModel); // 基本信息
        this.tool.clearObjValue(this.venderPaymentModel);// 财务信息
        this.tool.clearObjValue(this.vendorAccountsModel);// 高级功能信息
        this.form.vendorContactList=[{   //  联系人信息
          contactUser:'',
          contactPost:'',
          contactTel:'',
          contactQq:'',
          aliwangwang:'',
          contactEmail:'',
        }];
        this.dialogFlag.infoDetail=true;
      },
      addOrUpdateSupplier:function(){
        var paramsData={};var vm = this;
        if(this.vendorAccountsModel.isUse === ''){
          this.vendorAccountsModel.isUse = "true";
        }
        var attachInfoId = this.picList.attachInfoId.join();
        var removeAttachInfoId = this.picList.removeAttachInfoId.join();
        this.vendorInfoModel.attachInfoId = attachInfoId;
        this.vendorInfoModel.removeAttachInfoId = removeAttachInfoId;
        paramsData.vendorInfoModel = JSON.stringify(this.vendorInfoModel);
        paramsData.vendorAccountsModel = JSON.stringify(this.vendorAccountsModel);
        paramsData.venderPaymentModel = JSON.stringify(this.venderPaymentModel);
        paramsData.vendorId = this.vendor_id;
        var valList = this.form.vendorContactList;
        if(valList){
          for(var i=0;i<valList.length;i++){
            JSON.stringify(valList[i]);
            console.log(valList[i]);
          }
        }
        valList.join();
        paramsData.vendorContactList = valList;
        if(this.dialogFlag.dialogTitle == '添加供应商'){
          delete paramsData.vendorId;
          vm.commonSaveFun('vendorAccountsModel','saveVendorData','添加成功',paramsData);
        }else if(this.dialogFlag.dialogTitle == '编辑供应商'){
          paramsData.vendorId = this.vendor_id;
          console.log('paramsData % O',paramsData);
          vm.commonSaveFun('vendorAccountsModel','updataVendorData','添加成功',paramsData);
        }else{
          return false;
        }
      },
      commonSaveFun(formName,url,msg,params){
        var vm = this;
        vm.$refs[formName].validate((valid) => {
          if (valid) {
            vm.httpPost(url,vm.qs.stringify(params)).then(res =>{
              if(res.data.result == true){
                vm.activeTab='0';
                vm.$message(msg);
                vm.dialogFlag.infoDetail = false;
                vm.getSupplierList();
              }else{
                vm.$message(res.data.message);
              }
            })
          }else{
            return false;
          }
        });
      },
      showInfoDialog:function(row,val){
        this.num = 1;
        this.picList.removeAttachInfoId = [];
        this.picList.attachInfoId = [];
        this.vendor_id = row.vendorId;
        this.httpPost('selectVendorData?vendorId='+this.vendor_id).then(res =>{
          if(res.data.result == true){
            console.log(res);
            this.vendorInfoModel = res.data.params.vendorInfoModel;
            this.form.vendorContactList = res.data.params.vendorContactList;
            this.vendorAccountsModel = res.data.params.vendorAccountsModel;
            this.venderPaymentModel = res.data.params.venderPaymentModel;
            this.changeClass(val);
            this.dialogFlag.infoDetail = true;
          }else{
              this.$message(res.data.message);
          }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getSupplierList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getSupplierList();
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
      handleRemove(file) {
        console.log(file);
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
            console.log(res)
          }else{
            this.$message(res.data.message);
          }
        })
      },
      handleExcRemove(file) {
        console.log(file);
      },
      showMessage:function(){
        this.$confirm('确定重置密码为123456', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$message({
            message: '重置成功!'
          });
        }).catch(() => {
        });
      },
      showDelDialog:function(row) {
        this.vendor_ids = [];
        this.vendor_ids.push(row.vendorId);
        this.vendor_ids.join();
        var url = 'removeVendorData?vendorId='+this.vendor_ids;
        var vm = this;
        this.doItem('您将永久删除所选数据，确定删除？',url,'',vm.getSupplierList);
      },
      getProv: function (prov) {
        var vm = this;
        let tempCity=[];
        vm.citys=[];
        if(this.num > 1){
          this.vendorInfoModel.city = '';
        }
        this.num++;
        for (var val of vm.allCity){
          if (prov == val.prov){
            console.log(val);
            tempCity.push({label: val.label, value: val.label})
          }
        }
        vm.citys = tempCity;
      },
      uploadFilePic(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('saveVendorAttachFile',data).then(res => {
          if(res.data.result == true){
            this.picList.attachInfoId.push(res.data.params.attachInfoId);
          }else{
            this.$message(res.data.message);
          }
        })
      },
      beforeCloseChange(val){
        this.excFile = [];
        this.dialogFlag.isOpenLead = false;
      },
      changeClass(val){
        var div = document.getElementById('div');
        div.className= val == '查看供应商' ? 'picHover' : '';
      },
      /*-------------开发人员使用穿梭框 ------------------------------------*/
      // 人员添加
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
            this.dialogFlag.openF=false;
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
      ...mapActions([
        'getselectedArr'
      ]),
      getFull:function(val){
        this.dialogFlag.openF = true;
        this.fullNum=val;
        this.getselectedArr(this.developUserList)
      },
      requestemper(){
        this.httpPost('productUserGroup/getList?groupName=开发人员').then(res => {
          this.developUserList = res.data;
        })
      },
    }
  }
</script>

<style scoped>
  .addRelationship{
    margin-left:80px;
  }
  .resetPass{
    border:none;.
    margin-left:20px;
    color: #297dfa;
    cursor:pointer;
  }
  .el-col-6 {
    width: 20% !important;
  }
  .el-col-16 {
    width: 60% !important;
  }
</style>
