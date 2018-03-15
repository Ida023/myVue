<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row id="filer" class="marginBottom">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <el-row class="marginBottom">
              <span class="span_label">始发仓库名称</span>
              <el-radio-group v-model="pagefilters.whId" size="small"  @change="pagefilters.parcelNo='';pagefilters.refId='';getlogisticsName();">
                <el-radio-button v-for="item in options" :label="item.value" :key="item.value" :value="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-row>
            <el-row  class="marginBottom">
              <span class="span_label">物流方式</span>
              <el-radio-group v-model="pagefilters.refId" size="small"  @change="pagefilters.parcelNo='';getParcelList();"  >
                <el-radio-button v-for="item in logisticsName" :key="item.Ref_Id" :label="item.Ref_Id"  :value="item.Ref_Id" >{{item.Ref_Value}}</el-radio-button>
              </el-radio-group>
            </el-row>
            <el-row  class="marginBottom">
              <span class="span_label">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 态</span>
              <el-radio-group v-model="pagefilters.status" size="small"  @change="pagefilters.parcelNo='';getParcelList();">
                <el-radio-button label="01"     v-if="ButtonInfo['待生成跟踪单号']!='0'">待生成跟踪单号</el-radio-button>
                <el-radio-button label="02"     v-if="ButtonInfo['已生成跟踪单号']!='0'">已生成跟踪单号</el-radio-button>
                <el-radio-button label="03"     v-if="ButtonInfo['已打印邮票']!='0'">已打印邮票</el-radio-button>
                <el-radio-button label="04"     v-if="ButtonInfo['已发货']!='0'">已发货</el-radio-button>
              </el-radio-group>
            </el-row>
            <el-row>
              <span class="span_label">搜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 索</span>
              <el-input v-model="pagefilters.parcelNo" placeholder="请输入包裹订单号" size="small" style="width:240px;"></el-input>
              <el-button type="primary" size="small" style="margin-left: 5px;" @click="getParcelList();">搜索</el-button>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn"  style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;" v-if="ButtonInfo['新建包裹']!='0'">
        <el-button type="primary" size="small" class="el-icon-plus" @click="dialogFlag.dialogTitle='新建手动包裹单';dialogFlag.dialogDisabled = true;dialogFlag.inputDisabled=false;getDialogList('');"> 新建包裹</el-button>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" v-if= "pagefilters.status == '01'&& ButtonInfo['批量删除']!='0'"  @click="ChangeList('','delete');">批量删除</el-button>
        <el-button type="primary" size="small"  v-if="pagefilters.status == '01'&& ButtonInfo['批量提交获取跟踪单号']!='0'"  @click="ChangeList('','submit');">批量提交获取跟踪单号</el-button>
        <el-button type="primary" size="small"  v-if="pagefilters.status == '02'&& ButtonInfo['重新获取']!='0'"  @click="ChangeList('','again');">重新获取</el-button>
        <el-button type="primary" size="small"  v-if="pagefilters.status != '01'&& ButtonInfo['批量打印DHL邮票']!='0'" @click="pageStamp('',batchList,'manualPackage/printStamp');">批量打印DHL邮票</el-button>
        <el-button type="primary" size="small"  v-if="pagefilters.status == '03'&& ButtonInfo['批量标记发货']!='0'"  @click="ChangeList('','sign');">批量标记发货</el-button>
        <el-button type="primary" size="small"  v-if="pagefilters.status == '04'&& ButtonInfo['批量打印回邮邮票']!='0'">批量打印回邮邮票</el-button>
        <el-button type="primary" size="small"  v-if="pagefilters.status == '04'&& ButtonInfo['批量打印报关单']!='0'" >批量打印报关单</el-button>
      </el-row>
      <div id="item_list">
        <el-table  :data="parcelList"  ref="parcelList"  border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
            <template scope="scope">
              <el-tooltip content="查看"   effect="dark" placement="bottom" v-if="ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.dialogTitle='查看手动包裹单';dialogFlag.dialogDisabled=false;dialogFlag.inputDisabled=true;getDialogList(scope.row);">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="编辑"   effect="dark" placement="bottom"  v-if="scope.row.status == '待生成跟踪单号' && ButtonInfo['编辑']!='0'" >
                <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.dialogTitle='编辑手动包裹单';dialogFlag.dialogDisabled=false;dialogFlag.inputDisabled=false;getDialogList(scope.row);">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="提交获取跟踪单号"   effect="dark" placement="bottom"  v-if="scope.row.status == '待生成跟踪单号' && ButtonInfo['提交获取跟踪单号']!='0'" >
                <i  class="iconfontyyy"  v-if="scope.row.status" content="Bottom center" @click="ChangeList(scope.row,'submit');">&#xe63e;</i>
              </el-tooltip>
              <el-tooltip content="删除"   effect="dark" placement="bottom"  v-if="(scope.row.status == '已生成跟踪单号' || scope.row.status == '待生成跟踪单号') && ButtonInfo['删除']!='0' " >
                <i  class="iconfontyyy"  content="Bottom center" @click="ChangeList(scope.row,'delete');">&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip content="重新发起"   effect="dark" placement="bottom" v-if="(scope.row.status == '已生成跟踪单号' || scope.row.status == '已打印邮票')  && ButtonInfo['重新发起']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="ChangeList(scope.row,'again');">&#xe61c;</i>
              </el-tooltip>
              <el-tooltip content="标记发货"   effect="dark" placement="bottom" v-if="scope.row.status == '已打印邮票' && ButtonInfo['标记发货']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="ChangeList(scope.row,'sign');">&#xe73e;</i>
              </el-tooltip>
              <el-tooltip content="打印邮票"   effect="dark" placement="bottom" v-if="scope.row.status != '待生成跟踪单号' && ButtonInfo['打印邮票']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="pageStamp(scope.row,'','manualPackage/printStamp');">&#xe601;</i>
              </el-tooltip>
              <el-tooltip content="打印回邮邮票"   effect="dark" placement="bottom" v-if="scope.row.status == '已发货' && ButtonInfo['打印回邮邮票']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="">&#xe601;</i>
              </el-tooltip>
              <el-tooltip content="打印报关单"   effect="dark" placement="bottom" v-if="scope.row.status == '已发货' && ButtonInfo['打印报关单']!='0'">
                <i  class="iconfontyyy"  content="Bottom center" @click="">&#xe638;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="包裹单编号"    prop="parcelNo" align="center"  sortable  ></el-table-column>
          <el-table-column label="订单ID"  prop="parcelId" align="center"  sortable ></el-table-column>
          <el-table-column label="包裹重量" prop="parcelWeight"  align="center" sortable >
          </el-table-column>
          <el-table-column label="发货日期"  prop="shippmentDate"  :formatter="tool.formatDate" sortable align="center"></el-table-column>
          <el-table-column label="更新时间"  align="center" :formatter="tool.formatDate" prop="updTime" sortable ></el-table-column>
          <el-table-column label="跟踪单号"  align="center"  prop="trackingNo" sortable ></el-table-column>
          <el-table-column label="发货人" align="center"  prop="consigner"  sortable ></el-table-column>
          <el-table-column label="收件人" align="center"   prop="consignee"  sortable ></el-table-column>
          <el-table-column label="收件国家" align="center" prop="toCountry"  sortable >
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status"  sortable >
          </el-table-column>
          <el-table-column label="创建人" align="center" prop="addUser"  sortable >
          </el-table-column>
          <el-table-column label="创建时间" align="center" :formatter="tool.formatDate" prop="addTime"  sortable >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!----------------------------------------------------弹框-------------------------------------------------->

    <!--查看/编辑/新增 弹出框-->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" size="small"
               :close-on-click-modal="false" @close="resetForm" @open="openDialog">
      <el-tabs v-model="dialogFlag.activeTab" @tab-click="tabs">
        <el-tab-pane label="基础信息"  name="1" :disabled="dialogFlag.dialogDisabled" >
          <el-form labelWidth="120px" :model="msgData" ref="msgData" :rules="msgrules" >
            <el-col :span="12">
              <el-form-item label="包裹单相关标示" prop="parcelId">
                {{msgData.parcelId}}
              </el-form-item>
              <el-form-item label="发货日期" prop="shippmentDate">
                <el-date-picker :disabled="dialogFlag.inputDisabled" v-model="msgData.shippmentDate"
                                @change="changeDate"
                                align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="重量" prop="parcelWeight" required  >
                <el-input type="number" :disabled="dialogFlag.inputDisabled" min="1" v-model="msgData.parcelWeight">
                  <template slot="append">KG</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="parcelLength">
                <el-input type="number" :disabled="dialogFlag.inputDisabled"  min="1" v-model="msgData.parcelLength">
                  <template slot="prepend">长</template>
                  <template slot="append">CM</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="parcelWidth">
                <el-input type="number" :disabled="dialogFlag.inputDisabled"  min="1" v-model="msgData.parcelWidth">
                  <template slot="prepend">宽</template>
                  <template slot="append">CM</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="parcelHeight">
                <el-input type="number" :disabled="dialogFlag.inputDisabled"  min="1"  v-model="msgData.parcelHeight">
                  <template slot="prepend">高</template>
                  <template slot="append">CM</template>
                </el-input>
              </el-form-item>
              <el-form-item label="周长" prop="">
                {{Number(msgData.parcelHeight * 2) + Number(msgData.parcelWidth * 2) + Number(msgData.parcelLength)}}  CM
                <!--  <el-input type="weight" :disabled="dialogFlag.inputDisabled"  >
                    <template slot="prepend">周长</template>
                    <template slot="append">CM</template>
                  </el-input>-->
              </el-form-item>
              <!-- <el-form-item label="账单账号" prop="">
                 <el-input type="text" disabled></el-input>
               </el-form-item>-->
              <el-form-item label="包裹个数" prop="parcelQty">
                <el-input type="number" :disabled="pagefilters.refId != '02' || dialogFlag.inputDisabled==true ? true :false" min="1"  v-model="msgData.parcelQty"></el-input>
              </el-form-item>
              <el-form-item label="包裹价值" prop="parcelValue" required >
                <el-col :span="11" style="margin-right:5px;">
                  <el-input type="number" :disabled="dialogFlag.inputDisabled" v-model="msgData.parcelValue" min="1" ></el-input>
                  <span ></span>
                </el-col>
                <el-col :span="12" v-if="dialogFlag.inputDisabled == false">
                  <CurrencyList :selectValue="msgData.currencyId" v-on:child-change-Val="getCurrency"></CurrencyList>
                </el-col>
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="发件人信息"  :disabled="dialogFlag.dialogDisabled" name="2">
          <msgform ref="addremsgform"
                   :Disabled="dialogFlag.inputDisabled"
                   :houseId="pagefilters.whId"
                   :logisticsId="pagefilters.refId"
                   :getpoId="lineId"
                   :typeName="type"
                   v-on:child-change-Val="getChildvalue"
                   :dialogTitle="dialogFlag.dialogTitle" ></msgform>
        </el-tab-pane>
        <el-tab-pane label="收件人信息"  :disabled="dialogFlag.dialogDisabled" name="3">
          <msgform ref="addremsgform1" @changecountry-value="changeValue"
                   v-on:child-change-Val="getChildvalue"
                   :dialogTitle="dialogFlag.dialogTitle"
                   :Disabled="dialogFlag.inputDisabled"
                   :houseId="pagefilters.whId"
                   :typeName="type"
                   :logisticsId="pagefilters.refId"
                   :getpoId="lineId"></msgform>
        </el-tab-pane>
        <el-tab-pane :label="pagefilters.refId === '02' ?  '回邮地址':'包裹类型与服务'"  :disabled="dialogFlag.dialogDisabled" name="4">
          <el-form :label-width="financeFormLabelWidth" :model="serviceData" ref="serviceData">
            <el-col>
              <el-col v-if="pagefilters.refId === '02' ? false:true">
                <el-form-item label="shipping confirmation,Email" prop="confirmEmail">
                  <el-col :span="10">
                    <el-input type="text" v-model="serviceData.confirmEmail"
                              :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="Bulky goods" prop="isBulky">
                  <el-switch
                    :disabled="dialogFlag.inputDisabled"
                    v-model="serviceData.isBulky"

                    on-text="是"
                    off-text="否">
                  </el-switch>
                </el-form-item>
                <el-form-item label="Sender‘s Instructions" prop="sendInstructions">
                  <el-col :span="15">
                    <el-radio-group v-model="serviceData.sendInstructions" :disabled="dialogFlag.inputDisabled" >
                      <el-radio class="radio" :label='1'>immediate</el-radio>
                      <el-radio class="radio" :label='2'>after-deadlind</el-radio>
                      <el-radio class="radio" :label='3'>Abandounment</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-form-item>
                <el-form-item label="Additional Insurance,Amount Insured" prop="insuredAmount">
                  <el-col :span="10">
                    <el-input type="text" v-model="serviceData.insuredAmount"
                              :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <h4 >自定义回邮地址</h4>
              <!-- <el-col style="margin-left: 50px;" v-if="pagefilters.refId =='01'">
                 <msgform ref="addremsgform" :Disabled="dialogFlag.inputDisabled" :logisticsId="pagefilters.refId"
                          typeName="" :getpoId="lineId" v-on:child-change-Val="getChildvalue" :dialogTitle="dialogFlag.dialogTitle" ></msgform>
               </el-col>-->
              <el-col style="margin-left:40px;">
                <el-col class="marginBottom">
                  需要回邮服务
                  <el-switch :disabled="dialogFlag.inputDisabled"
                             v-model="isReturnAddress"
                             on-text="是"
                             off-text="否"
                  >
                  </el-switch>
                </el-col>
                <el-col class="marginBottom" v-if="isReturnAddress == true" >
                  同发件人地址
                  <el-switch :disabled="dialogFlag.inputDisabled"
                             v-model="issameAddress"
                             @change="changeAddress"
                             on-text="是"
                             off-text="否"
                  >
                  </el-switch>
                </el-col>
                <msgform ref="addremsgform2"
                         v-on:child-change-Val="getChildvalue"
                         :dialogTitle="dialogFlag.dialogTitle"
                         v-if="isReturnAddress == true"
                         :Disabled="dialogFlag.inputDisabled"
                         :typeName="type"
                         :modelForm="modelFormm"
                         :logisticsId="pagefilters.refId"
                         :getpoId="lineId" ></msgform>
              </el-col>
            </el-col>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" v-if="dialogFlag.dialogDisabled== true">
        <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
        <el-button type="" @click="goPrev()" v-if="dialogFlag.activeTab != '1'">上一步</el-button>
        <el-button type="" @click="goNext()" v-if="dialogFlag.activeTab != '1'">下一步</el-button>
        <el-button type="primary" @click="submitDialogForm();" v-if="dialogFlag.activeTab == '4'" :loading="$store.state.loading" >保 存</el-button>
        <el-button type="primary" @click="submitDialogForm();" v-if="dialogFlag.activeTab != '4'" :loading="$store.state.loading" >保 存&下一步</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-if="dialogFlag.dialogDisabled == false">
        <el-button @click="dialogFlag.isOpen = false;">关 闭</el-button>
        <el-button type="primary" @click="submitDialogForm();" :loading="$store.state.loading" v-if="dialogFlag.inputDisabled==false">保 存</el-button>
      </div>
    </el-dialog>
    <!--收件人国家非欧盟弹窗-->
<!--
    <el-dialog  title="报关单" :visible.sync="dialogFlag.CustomSisOpen" size="small" :close-on-click-modal="false" @close="dialogFlag.activeTab='1';" >
      <el-form labelWidth="110px">
        <el-row>
          <el-col :span="3" style="font-weight: bold"> 申报类型</el-col>
          <el-col :span="21">
            <el-radio-group v-model="radio2">
              <el-radio class="radio"  label="1">Rerurn of goods</el-radio>
              <el-radio class="radio"  label="2">Document</el-radio>
              <el-radio class="radio"  label="3">Commercial Sample</el-radio>
              <el-radio class="radio"  label="4">Present</el-radio>
              <el-radio class="radio"  label="5">Other</el-radio>
            </el-radio-group></el-col>
        </el-row>
        <el-form-item label="申报类型描述" required style="margin-top: 10px" v-if="radio2 == '5'">
          <el-col :span="10" >
            <el-input type="text"></el-input>
          </el-col>
        </el-form-item>
        <h4>物品信息</h4>
        <el-form-item>
          <el-table  :data="parcelList" class="" ref="parcelList"  border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
              <template scope="scope">
                <el-tooltip content="查看"   effect="dark" placement="bottom">
                  <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.CustomsCodeisOpen=true;">&#xe600;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="物品名称"  prop=""  sortable align="center">
              <template scope="scope">
                <el-input type="textarea" v-model="scope.row.initQty"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="物品数量"  prop=""  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.initQty"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位净重"  prop=""  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.initQty"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位价值"  prop=""  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.initQty"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="报关编码"  prop=""  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.initQty"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="原产地国家简码"  prop=""  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.initQty"></el-input>
              </template>
            </el-table-column>

          </el-table>
        </el-form-item>
        <h4>报关信息</h4>
        <el-col :span="10">
          <el-form-item label="incoterms Codes" ><el-select   filterable clearable  >
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select></el-form-item>
          <el-form-item label="Place of Commital" required><el-input type="text"></el-input></el-form-item>
          <el-form-item label="Additional Fee" required><el-input type="text"></el-input></el-form-item>
          <el-form-item label="Permit No."><el-input type="text"></el-input></el-form-item>
          <el-form-item label="Attestation No."><el-input type="text"></el-input></el-form-item>
          <el-form-item label="With Electronic Export Ntfctn"> <el-switch
            v-model="value"
            on-text="是"
            off-text="否">
          </el-switch></el-form-item>
        </el-col>

      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFlag.CustomSisOpen = false;">取消</el-button>
        <el-button type="primary" @click="submitDialogForm" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
-->
    <!--常用海关编码-->
    <el-dialog  title="常用海关编码" :visible.sync="dialogFlag.CustomsCodeisOpen" size="small" :close-on-click-modal="false" @close="dialogFlag.activeTab='1'" >
      <el-row class="marginBottom"  :gutter="10">
        <el-col :span="6" class="optionValue">
          <el-input v-model="skuNo" size="small" placeholder="请输入SKU"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" >搜索</el-button>
        </el-col>
      </el-row>
      <el-table  :data="parcelList" class="" ref="parcelList"  border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="SKU"  prop=""  sortable align="center">
        </el-table-column>
        <el-table-column label="海关编码"  prop=""  sortable align="center">
        </el-table-column>
        <el-table-column label="商品描述（英）"  prop=""  sortable align="center">
        </el-table-column>
        <el-table-column label="商品描述（德）"  prop=""  sortable align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFlag.CustomsCodeisOpen = false;">取消</el-button>
        <el-button type="primary" @click="submitDialogForm" :loading="$store.state.loading" v-if="">确 定</el-button>
      </div>
    </el-dialog>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                     :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import msgform from "./SonModula/AddressmsgForm.vue"
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import CurrencyList from '../../components/listData/getCurrencyList.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";


  export default{
    components: {
      ElButton,
      ElFormItem,
      msgform,
      CurrencyList
    },
    data(){
      let number = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^\d{1,20}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        modelFormm:{},
        loadCountry:{
          countryNo:'',
          isoCode2:''
        },
        FaddressId:'',
        SaddressId:'',
        EaddressId:'',
        type: '',
        service:{},
        addSender: {},//发件人
        addAddressee: {},//收件人
        parcelId: '',
        selectOptions: [],
        lineId: '',
        skuNo: '',
        value: '1',
        isReturnAddress: false,
        issameAddress: false,
        financeFormLabelWidth: '130px',
        radio2: '1',
        serviceData: {
          parcelId: '',
          confirmEmail: '',
          isBulky: false,
          insuredAmount: '',
          sendInstructions: '1',
        },
        msgData: {
          refId: '',
          parcelId: '',
          referenceId: '',
          shippmentDate: '',
          parcelWeight: '',
          parcelLength: '',
          parcelWidth: '',
          parcelHeight: '',
          parcelQty: '',
          parcelValue: '',
          currencyId: '',
        },
        logisticsFlag:false,
        tabArr: ['1', '2', '3', '4'],
        dialogFlag: {
          isOpen: false,
          dialogTitle: '',
          activeTab: '1',
          dialogDisabled: false,
          CustomSisOpen: false,
          CustomsCodeisOpen: false,
          inputDisabled: false
        },
        batchList: [],
        logisticsName: [],
        parcelList: [
          {
            parcelId: '123',
            initQty: '5'
          },
        ],
        options: [],
        whRefId: '',
        activeNames: ['1'],
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        msgrules: {
          parcelWeight: [
            { validator: number, trigger: 'blur', required: true },

          ],
          parcelValue:[
            { validator: number, trigger: 'blur', required: true },

          ]
        },
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
          whId:'01',
          refId:'',
          status:'01',
          parcelNo:'',
          currentPage: 1,
          pageSize: 10,
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted: function () {
      this.getauthorityList();
      this.getWarehouseList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      //打印
      pageStamp(val,batch,url){
        var arr= val !=''? [val.parcelId] : batch;
        if(arr.length<1){this.tips();}else{window.open(this.RmsUrl+url+'?parcelIds='+arr+'&Authorization=' + sessionStorage.getItem("userSession"));}
      },

      changeAddress(val){
        this.type= val == true?'发件人':'联系人';
        //	val==false ? this.$refs.addremsgform2.resetForm():this.$refs.addremsgform2.getFormList(this.type);
        if(this.dialogFlag.dialogTitle=='新建手动包裹单'&&	val==true){
          this.$refs.addremsgform.getFormList(this.type);
          this.modelFormm=JSON.parse(JSON.stringify(this.addSender));
        }else if(val==true){
          this.$refs.addremsgform2.getFormList(this.type);
        }else if(val==false){
          this.$refs.addremsgform2.resetForm();
        }

      },
      //openDialog(){this.$refs.addremsgform.getFormList();this.$refs.addremsgform1.getFormList()},
      resetForm(){
        this.$refs['msgData'].resetFields();
        this.$refs['serviceData'].resetFields();
        this.isReturnAddress=false;
        this.type='';
        this.dialogFlag.activeTab='1';
        this.msgData.currencyId='';
        if(this.pagefilters.refId == '01'){this.msgData.parcelQty= '1';}
        this.$refs.addremsgform.resetForm();
        this.$refs.addremsgform1.resetForm();
        this.getParcelList();
      },
      getChildvalue:function(val){
        var obj=JSON.parse(JSON.stringify(val.value));
        val.type=='发件人'?(this.addSender = obj,this.FaddressId=val.addressId):val.type=='收件人'?(this.addAddressee=obj,this.SaddressId=val.addressId):val.type == '联系人'?(this.serviceData.addresser=obj):'';
        if(val.type=='发件人' && this.issameAddress == true ){this.serviceData.addresser=obj;this.serviceData.addresser.logisticsCategory=this.pagefilters.refId;}
        console.log('this.addAddressee % 0===',this.service)
       //console.log('obj % 0000000000===',this.addSender)

      },
      //币种改变
      getCurrency(val){
        this.msgData.currencyId = val.value;
      },
      tabs(val){
        this.dialogFlag.activeTab== '2' ?(this.type='发件人',  this.$refs.addremsgform.getFormList(this.type))  : this.dialogFlag.activeTab=='3' ? (this.type='收件人',this.$refs.addremsgform1.getFormList(this.type)):this.type='联系人';
        //if(this.dialogFlag.inputDisabled == false){this.$refs['addremsgform'].gettypeService();}

      },
      changeValue(){
        this.dialogFlag.CustomSisOpen=true;
      },
      submitDialogForm(){
        if(this.dialogFlag.activeTab == '1'){
          this.submitMsgdata();
        }else if(this.dialogFlag.activeTab == '2'){

          this.submitaddressmsgForm('manualPackage/addSender')
        }else if(this.dialogFlag.activeTab == '3'){
          this.submitaddressmsgForm('manualPackage/addAddressee')
        }else if(this.dialogFlag.activeTab == '4'){
          //if(this.serviceData.addresser){this.serviceData.addresser=this.service;}else{delete this.serviceData.addresser}
          this.mubmitserviceData();
        }
      },
      //基本信息保存
      submitMsgdata(){
        this.$refs['msgData'].validate((valid) => {
          if(valid){
            this.dialogFlag.dialogDisabled== true ? this.msgData.parcelId=this.parcelId:this.msgData.parcelId=this.lineId;
            this.msgData.refId=this.pagefilters.refId;
            this.msgData.whId=this.pagefilters.whId;
            this.httpPost('manualPackage/addBase',this.msgData) .then(res=>{
              this.$message(res.data.message)
              if(res.data.result==true){
                if(this.dialogFlag.dialogDisabled== true){
                  this.goNext();
                }
              }
            })
          }
        })
      },
      //服务信息保存
      mubmitserviceData(){
        this.dialogFlag.dialogDisabled== true ? this.serviceData.parcelId=this.parcelId:this.serviceData.parcelId=this.lineId;
        //this.serviceData.refId=this.pagefilters.refId;logisticsCategory
        //this.serviceData.addresser.logisticsCategory=this.pagefilters.refId;
        if(this.dialogFlag.dialogTitle=='编辑手动包裹单'){
          if(this.serviceData.addresser.addressId != this.EaddressId || this.serviceData.addresser.addressId==''){
            this.serviceData.addresser.parcelAddressId='';
          }
        }else{
          this.serviceData.addresser.parcelAddressId='';
        }
        if(this.isReturnAddress==false){ delete this.serviceData.addresser}
        this.httpPost('manualPackage/addTypeService',this.serviceData).then(res=>{
          this.$message(res.data.message);
          if(res.data.result==true){
            this.dialogFlag.isOpen=false;
          }
        })
      },
      //发件人/收件人保存
      submitaddressmsgForm(url){
        var a= false;
        var obj={};
        a = url == 'manualPackage/addSender' ? this.$refs.addremsgform.submitForm(): url == 'manualPackage/addAddressee' ? this.$refs.addremsgform1.submitForm():'';
        obj= url == 'manualPackage/addSender' ? this.addSender : url == 'manualPackage/addAddressee' ? this.addAddressee:'';
        console.log('obj % 0===',obj)
        if(this.dialogFlag.dialogTitle=='编辑手动包裹单'){
          //	alert('obj'+this.FaddressId)
          // alert('old'+obj.parcelAddressId)
          if( url == 'manualPackage/addSender'){
            if(obj.addressId !=this.FaddressId || obj.addressId==''){
              obj.parcelAddressId='';
            }
          }else if(url == 'manualPackage/addAddressee'){
            //obj=this.addAddressee;
            if(obj.addressId !=this.SaddressId || obj.addressId==''){
              obj.parcelAddressId='';
            }
          }
        }else if(this.dialogFlag.dialogTitle=='新建手动包裹单'){obj.parcelAddressId=''}
        obj.logisticsCategory=this.pagefilters.refId;
        this.dialogFlag.dialogDisabled== true ? obj.parcelId=this.parcelId:obj.parcelId=this.lineId;
        //this.dialogFlag.dialogTitle=='新建手动包裹单'?obj.parcelAddressId='':'';
        if(url == 'manualPackage/addSender' && a==true){
          this.sumbit(url,obj);
        } else if(url == 'manualPackage/addAddressee' && a==true){
          this.sumbit(url,obj);
        }
      },
      sumbit(url,obj){
        this.httpPost(url, obj).then(res => {
          this.$message(res.data.message)
          if(res.data.result==true){
            if (this.dialogFlag.dialogDisabled == true) {
              this.goNext();
            }
          }
        })
      },
      changeDate(val){
        //alert(this.msgData.dateValue)
      },
      goPrev:function(){
        this.dialogFlag.activeTab = this.tabArr[this.tabArr.indexOf(this.dialogFlag.activeTab)-1];
      },
      goNext:function() {
        var vm=this;
        this.dialogFlag.activeTab = this.tabArr[this.tabArr.indexOf(this.dialogFlag.activeTab) + 1];
        this.type = this.dialogFlag.activeTab =='2' ? '发件人' :this.dialogFlag.activeTab =='3' ? '收件人':'联系人';
        this.dialogFlag.activeTab =='2' ? this.$refs.addremsgform.getFormList(this.type):this.dialogFlag.activeTab =='3'?this.$refs.addremsgform1.getFormList(this.type): this.$refs.addremsgform2.getFormList(this.type);
        /*  this.$refs.addremsgform.getFormList(this.type);
         this.$refs.addremsgform1.getFormList(this.type);
         this.$refs.addremsgform2.getFormList(this.type);*/
        if(this.dialogFlag.dialogDisabled===true && this.dialogFlag.activeTab=== '2'){
          vm.$refs.addremsgform.getaddCountry();
        }
      },
      getDialogList(val){
        if(this.logisticsFlag==true){
          this.dialogFlag.isOpen=true;
          if(val !== ''){
            this.lineId=val.parcelId;
            this.getMsgData(val.parcelId);
            this.gettypeService(val.parcelId);
          }else{
            if(this.pagefilters.refId == '01'){this.msgData.parcelQty= '1';}
            this.getaddCode();
          }
        }else{
          this.$message('当前仓库无物流方式无法创建包裹单！')
        }
      },
      //新增请求ID
      getaddCode(){
        this.httpPost('manualPackage/getParcelId').then(res=>{
          var aa=res.data.substr(0,res.data.length-1)
          this.parcelId = aa;
        })
      },
      //基本信息
      getMsgData(val){
        this.httpPost('manualPackage/queryBase?parcelId='+val).then(res=>{
          this.msgData=res.data;
        })
      },
      //包裹类型与服务
      gettypeService(val){
        var aa={},vm=this;
        this.httpPost('manualPackage/queryTypeService?parcelId='+val).then(res=>{
          this.serviceData=res.data;
          if(res.data.addresser.firstAddresser !=null && res.data !=''  && res.data.addresser!=null){
            this.isReturnAddress=true;
            this.service=res.data.addresser;
            this.serviceData.addresser = res.data.addresser;
            this.EaddressId=res.data.addresser.addressId;

            aa=res.data.addresser;
            vm.$nextTick(()=>{
              vm.$refs.addremsgform2.ChildgettypeService(aa)
            })
            //this.modelFormm=res.data.addresser;
            console.log('this.serviceData.addresser  % 0==',this.modelFormm )
          }else{
            this.isReturnAddress=false;
            //this.serviceData.addresser.logisticsCategory='';
          }
        });
      },
      batchChange(val){
        this.batchList=[];
        val.forEach(item=>this.batchList.push(item.parcelId));
        console.log(this.batchList)
      },
      ChangeList(val,data){
        var parcelIds=[],vm=this,url='',msg='';
        val == '' ? parcelIds=vm.batchList : parcelIds.push(val.parcelId);
        msg = data == 'delete' ? '您确定删除手动包裹单？' : data == 'again' ? '您确定重新获取跟踪单号？':data == 'sign' ? '您确定标记发货？': data=='submit' ? '确定提交获取跟踪单号？':'';
        url = data == 'delete' ? 'manualPackage/delete' : data == 'again' ? 'manualPackage/updateTrackingNo': data == 'sign' ? 'manualPackage/shippment': data=='submit' ? 'manualPackage/addTrackingNo':'';
        parcelIds <= 0 ? vm.tips() : vm.doItem(msg,url,parcelIds,vm.getParcelList);
      },
      //物流方式
      getlogisticsName(){
        this.httpPost('manualPackage/type?whId='+this.pagefilters.whId).then(res=>{
          if(res.data!=[] && res.data.length >= 1){
            this.logisticsName=res.data;
            this.logisticsName.forEach((item,index,data)=>{
            	if(item.Ref_Id == '05'){
                data.splice(index,1)
              }
              })
              this.pagefilters.refId=this.logisticsName[0].Ref_Id;
              this.logisticsFlag=true;
              this.getParcelList();
          }else{
            this.logisticsName=[];
            this.logisticsFlag=false;
          }
        })
      },
      //仓库名
      getWarehouseList(){
        this.httpGet('manualPackage/getHaveWh').then(res => {
          this.options = this.tool.replaceObjKey(res.data,'whId','whName');
          this.pagefilters.whId=res.data[0].whId;
        })
        //alert(res.data[0].whId);

      },
      //列表数据
      getParcelList(){
        this.httpPost('manualPackage/list',this.pagefilters).then(res=>{
          this.parcelList=res.data.listData;
          this.page=res.data;
        })
      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getParcelList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getParcelList();
      },

    }
  }

</script>

<style scoped>


</style>
