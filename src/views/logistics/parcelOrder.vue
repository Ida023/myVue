<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row class="marginBottom">
        <OwnWarehouseList  :selectValue="pagefilters.whId"  select-type="house"  default="defaultt" placeValue="请选择仓库"  size="small"  @child-change-val="getChildren"   @child-change='getHouse' ></OwnWarehouseList>
      </el-row>
      <el-row  id="filer" class="marginBottom">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <el-col class="marginBottom">
              <span  class="span_label">物流方式类型</span>
              <el-radio-group v-model="pagefilters.isNeedTrackingNo" size="small"   @change="getParceList();" >
                <el-radio-button label="0">需要跟踪单号</el-radio-button>
                <el-radio-button label="1">不需要跟踪单号</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col class="marginBottom">
              <span  class="span_label">物流方式&nbsp;&nbsp;&nbsp;</span>
              <el-button size="small" :class="[filermethodId ? 'butactive':'']"  @click="Logistics=[];pagefilters.methodId='';getParceList();">全 部</el-button>
              <el-checkbox-group v-model="Logistics" size="small" @change="changeLogistics" style="display: inline-block;" class="typeButton">
                <el-checkbox-button v-for="item in LogisticsArr"  :label="item.methodId" :key="item.methodId" >{{item.whLogisticsCnName}}</el-checkbox-button>
              </el-checkbox-group>
            </el-col>
            <el-col class="marginBottom">
              <span  class="span_label">包裹状态&nbsp;&nbsp;&nbsp;</span>
              <el-radio-group v-model="pagefilters.status" size="small"   @change="getParceList();" >
                <el-radio-button label="1">未生成波次</el-radio-button>
                <el-radio-button label="2">已生成波次</el-radio-button>
                <el-radio-button label="3">已打印</el-radio-button>
                <el-radio-button label="4">已发货</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col class="marginBottom">
              <span  class="span_label">包裹类型&nbsp;&nbsp;&nbsp;</span>
              <el-button size="small" :class="[filerTpey ? 'butactive':'']" @click="parcelType=[];pagefilters.parcelType1='';pagefilters.parcelType2='';pagefilters.parcelType3='';pagefilters.parcelType4='';pagefilters.parcelType5='';getParceList();">全 部</el-button>
              <el-checkbox-group v-model="parcelType" size="small" @change="changeType" style="display: inline-block;" class="typeButton">
                <el-checkbox-button v-for="menu in packageArr"  :label="menu.value" :key="menu.value"  >{{menu.label}}</el-checkbox-button>
              </el-checkbox-group>
              <!--  <el-radio-group v-model="pagefilters.whStatus" size="small"   @change="getParceList();" >
                  <el-radio-button  >88</el-radio-button>
                </el-radio-group>-->
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="marginBottom"  style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
        <el-button size="small"  type="primary" @click="dialogFlag.sccrenisOpen = true" >筛选</el-button>
      </el-row>
      <el-row class="marginBottom"  >
        <el-button size="small"  type="primary"  v-if="pagefilters.status=='4' && ButtonInfo['批量修改运费']!='0'" @click="waveGeneration('','freightCost','');" >批量修改运费</el-button>
        <el-button size="small"  type="primary"  v-if="pagefilters.status=='4' && ButtonInfo['批量修改跟踪单号']!='0'" @click="waveGeneration('','trackingNo','');" >批量修改跟踪单号</el-button>
        <el-button size="small"  type="primary" v-if="pagefilters.status=='1' && ButtonInfo['生成波次']!='0'" @click="waveGeneration('','Wave','');"  >生成波次</el-button>
      </el-row>
      <div id="item_list">
        <!--
         <el-table :data="parcelData" border tooltip-effect="dark" style="width: 100%" :stripe="false"   >
           <el-table-column type="selection" width="55" align="center"></el-table-column>
           <el-table-column sortable width="" label="0" prop="productName"  align="center"  > </el-table-column>
           <el-table-column sortable width="" label="1"  prop="productName" align="center">
             <template scope="scope">
               <div class="simulation" v-for="(item,index) in scope.row.stockItems"  :id="'simulation' +'-'  + scope.$index +'/' + index">
                 <div class='childDiv' >
                   {{ item.productName }}
                 </div>
               </div>
             </template>
           </el-table-column>
           <el-table-column sortable width="" label="2"  prop="productName" align="center">
             <template  scope="scope"  >
               <div class="simulation" v-for="(item,index) in scope.row.stockItems"  :id="'simulation' +'-'  + scope.$index +'/' + index">
                   <div class='childDiv' >
                     {{ item.productName }}
                   </div>
                 <el-tooltip content="费用"  effect="dark" placement="bottom" >
                   <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '费用')">&#xe757;</i>
                 </el-tooltip>
                 <el-tooltip content="费用"  effect="dark" placement="bottom" >
                   <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '费用')">&#xe757;</i>
                 </el-tooltip>
               </div>
             </template>
           </el-table-column>
           <el-table-column sortable width="" label="3"  prop="productName" align="center">
             <template  scope="scope"  >
               <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
                     <div class='childDiv' >
                       {{ item.productName }}
                 </div>
               </div>
             </template>
           </el-table-column>
           <el-table-column sortable width="" label="4"  prop="productName" align="center"> </el-table-column>
         </el-table>
-->

       <el-table :data="parcelData" border tooltip-effect="dark" style="width: 100%" :stripe="false" class="parcelData" @selection-change="batchChange"  >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column sortable width="" label="波次ID" prop="Batch_Id" width="70" align="center"  >
          </el-table-column>
          <el-table-column sortable width="" label="包裹ID"  prop="Parcel_Id" width="70" align="center" >
            <template scope="scope">
<!--
              <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList" >
                <div class='childDiv' >
                  <span>{{ item.Parcel_Id }}</span><br>
                  <el-tooltip content="修改运费"  effect="dark"   placement="bottom"  v-if="scope.row.status == '已发货' && ButtonInfo['修改运费']!='0'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="waveGeneration(item,'freightCost',scope.row)">&#xe62b;</i>
                  </el-tooltip>
                  <el-tooltip content="修改跟踪单号"   effect="dark"  placement="bottom" v-if="scope.row.status == '已发货' && ButtonInfo['修改跟踪单号']!='0'" >
                    <i  class="iconfontyyy"   content="Bottom center" @click="waveGeneration(item,'trackingNo',scope.row)">&#xe6e5;</i>
                  </el-tooltip>
                  <el-tooltip content="查看"   effect="dark"  placement="bottom" v-if="ButtonInfo['查看']!='0'" >
                    <i  class="iconfontyyy"   content="Bottom center" @click="dialogFlag.isOpen = true;dialogFlag.dialogTitle='查看';dialogFlag.inputDisabled=true;getDialogList(scope.row)">&#xe600;</i>
                  </el-tooltip>
                  <el-tooltip content="编辑"   effect="dark"  placement="bottom" v-if=" ButtonInfo['编辑']!='0'" >
                    <i  class="iconfontyyy"   content="Bottom center" @click="dialogFlag.isOpen = true;dialogFlag.dialogTitle='编辑';dialogFlag.inputDisabled=false;getDialogList(scope.row)">&#xe6e5;</i>
                  </el-tooltip>
                </div>
              </div>
-->
              <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList" >
                <div class='childDiv' >
                  <span>{{ item.Parcel_Id }}</span><br>
                  <el-tooltip content="修改运费"  effect="dark"   placement="bottom" v-if="scope.row.Status=='已发货' && ButtonInfo['修改运费']!='0'" >
                    <i  class="iconfontyyy"  content="Bottom center" @click="waveGeneration(item,'freightCost',scope.row)">&#xe62b;</i>
                  </el-tooltip>
                  <el-tooltip content="修改跟踪单号"   effect="dark"  placement="bottom" v-if="scope.row.Status=='已发货' && ButtonInfo['修改跟踪单号']!='0'" >
                    <i  class="iconfontyyy"   content="Bottom center" @click="waveGeneration(item,'trackingNo',scope.row)">&#xe6e5;</i>
                  </el-tooltip>
                  <el-tooltip content="查看"   effect="dark"  placement="bottom" v-if="ButtonInfo['查看']!='0'" >
                    <i  class="iconfontyyy"   content="Bottom center" @click="dialogFlag.isOpen = true;dialogFlag.dialogTitle='查看';dialogFlag.inputDisabled=true;getDialogList(item)">&#xe600;</i>
                  </el-tooltip>
                  <el-tooltip content="编辑"   effect="dark"  placement="bottom"  v-if="  ButtonInfo['编辑']!='0'">
                    <i  class="iconfontyyy"   content="Bottom center" @click="dialogFlag.isOpen = true;dialogFlag.dialogTitle='编辑';dialogFlag.inputDisabled=false;getDialogList(item)">&#xe6e5;</i>
                  </el-tooltip>
                </div>
              </div>

            </template>
          </el-table-column>
          <el-table-column sortable width="" label="订单ID" width="70" prop="Order_Id" align="center">
            <template  scope="scope"  >
              <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"   >
                <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                  <div class="childDiv" >
                    {{ va.Order_Id }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable width="" label="图片"  prop="" align="center" width="120px">
            <template  scope="scope"  >
              <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
                <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                  <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                    <div class="childDiv" >
                      <div style="margin-left:0px" >
                        <img v-if="vb.Image_Url!=null" style="width: 70px; height: 70px;" :src="RmsUrl+vb.Image_Url"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
         <el-table-column sortable width="" label="SKU" width="70" prop="Sku_No" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{vb.Sku_No}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
         </el-table-column>
         <el-table-column sortable width="" label="产品名称"  prop="Cn_Name" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{vb.Cn_Name}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
         </el-table-column>
         <el-table-column sortable width="" label="库位号"  prop="Location_No" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{vb.Location_No}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="数量"  prop="Sales_Qty" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv">
                     <div style="margin-left:0px">
                       {{vb.Sales_Qty}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="下单时间"  prop=""  align="center" :formatter="tool.formatDate">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{tool.formatDate('','',vb.Add_Time)}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="收件人" width="150" prop="" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       <el-tooltip placement="top">
                         <div slot="content">客户ID:{{vb.Customer_Id}}<br>客户姓名:{{vb.Customer_Name}}<br>地址1:{{vb.Address_1}}<br>市:{{vb.City}}<br>区:{{vb.District}}<br>州:{{vb.State}}<br>邮编:{{vb.PostCode}}<br>手机:{{vb.Phone}}<br>国家:{{vb.cuntryArea}}</div>
                         <span>客户ID:{{vb.Customer_Id}}<br>客户姓名:{{vb.Customer_Name}}<br>地址1:{{vb.Address_1}}<br>市:{{vb.City}}<br>区:{{vb.District}}<br>州:{{vb.State}}<br>邮编:{{vb.PostCode}}<br>手机:{{vb.Phone}}<br>国家:{{vb.cuntryArea}}
                         </span>
                       </el-tooltip>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
          <!-- <template  scope="scope"  >
             <div class="simulation" v-for="(item,index) in scope.row.childList" :id="'simulation' +'-'  + scope.$index +'/' + index">
                   <div class='childDiv' >
                     <div style="margin-left:0px">
                       客户ID:{{item.Customer_Id}}<br>客户姓名:{{vb.Customer_Name}}<br>地址1:{{vb.Address_1}}<br>市:{{vb.City}}<br>区:{{vb.District}}<br>州:{{vb.State}}<br>邮编:{{vb.PostCode}}<br>手机:{{vb.Phone}}<br>国家:{{vb.cuntryArea}}
                     </div>
                   </div>
             </div>
           </template>-->
       </el-table-column>
         <el-table-column sortable width="" label="物流方式"  prop="methodCnName" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv2"></div>
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{vb.methodCnName}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="状态"  prop="Status" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{vb.Status}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="发货时间"  prop="Shippment_Date" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{tool.formatDate('','',vb.Shippment_Date)}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="物流跟踪单"  prop="Tracking_No" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       {{vb.Tracking_No}}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
       </el-table-column>
         <el-table-column sortable width="" label="备注信息"  prop="" align="center">
         <template  scope="scope"  >
           <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
             <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
               <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                 <div class="childDiv" >
                   <div style="margin-left:0px">
                     {{}}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </template>
       </el-table-column>
         <el-table-column sortable width="" label="拦截信息"  prop="" align="center">
           <template  scope="scope"  >
             <div class="simulation simulationOne" v-for="(item,index) in scope.row.childList"  >
               <div class="simulation simulationTwo" v-for="(va,index) in item.childList"  >
                 <div class="simulation simulationThree" v-for="(vb,index) in va.childList" >
                   <div class="childDiv" >
                     <div style="margin-left:0px">
                       <span class="fontRed">
                          {{vb.InterceptMsg}}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </template>
         </el-table-column>
        </el-table>
      </div>
    </div>
    <!--筛选弹窗-->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.sccrenisOpen" size="small" :close-on-click-modal="false"  @open="colseScreen();">
        <div class="data_body">
          <title-header></title-header>
          <el-row class="row-text">
            <el-col class="col-matching" :span="4">物流方式</el-col>
            <el-col class="col-matching col_input" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-select  filterable clearable v-model="methodId" :allow-create="true" placeholder="请选择"  >
                <el-option v-for="item in LogisticsArr" :key="item.methodId" :label="item.whLogisticsCnName" :value="item.methodId"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="row-text">
            <el-col class="col-matching" :span="4">订单状态</el-col>
            <el-col class="col-matching col_input" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-select  filterable clearable v-model="status" :allow-create="true" placeholder="请选择"  >
                <el-option v-for="item in parceStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <text-input condition-name="订单编号"  @child-change-val="getChildren"  :selectValue="pagefilters.orderNo"  text-type="orderNo" ></text-input>
          <time-data  conditionName="下单日期"  :start-time="pagefilters.addStartTime" :end-time="pagefilters.addEndTime" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
          <time-data  conditionName="发货日期"  :start-time="pagefilters.shippmentStartDate" :end-time="pagefilters.shippmentEndDate" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
          <text-input condition-name="跟踪单号"  @child-change-val="getChildren"  :selectValue="pagefilters.trackingNo"  text-type="trackingNo" ></text-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseScreen();">清除条件</el-button>
          <el-button @click="dialogFlag.sccrenisOpen = false;screensubmit();">筛 选</el-button>
          <el-button @click="dialogFlag.sccrenisOpen = false;" >取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--修改运费-->
    <el-dialog title="修改运费"  :visible.sync="dialogFlag.freightisOpen" size="tiny" :close-on-click-modal="false"  @close="editDialog.ids = [];freightCost='';">
      <el-form labelWidth="">
        <el-form-item label="" required :rules="[{required:true,message:'不能为空',type:'text',trigger:'blur'},{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}]">
          <el-input type="text" v-model="freightCost"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.freightisOpen =  false;">取 消</el-button>
        <el-button @click="submitedit('parcelOrder/editFreightCost','freightisOpen')" type="primary" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改跟踪单号-->
    <el-dialog title="修改跟踪单号"  :visible.sync="dialogFlag.signedisOpen" size="tiny" :close-on-click-modal="false"  @close="editDialog.ids = []; trackingNo = '';">
      <el-form labelWidth="">
        <el-form-item label="" :rules="[{required:true,message:'不能为空',type:'text',trigger:'blur'},{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}]">
          <el-input type="textarea" v-model="trackingNo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.signedisOpen =  false;">取 消</el-button>
        <el-button @click="submitedit('parcelOrder/editTrackingNo','signedisOpen')" type="primary" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看/编辑 弹出框-->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" size="small"
               :close-on-click-modal="false" @close="resetForm" >
      <el-tabs v-model="dialogFlag.activeTab" @tab-click="tabs">
        <el-tab-pane label="基础信息"  name="1" >
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
              <el-form-item label="重量" prop="parcelWeight"   >
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
              </el-form-item>
              <el-form-item label="包裹个数" prop="parcelQty">
                <el-input type="number" :disabled="refId != '02' || dialogFlag.inputDisabled==true ? true :false" min="1"  v-model="msgData.parcelQty"></el-input>
              </el-form-item>
              <el-form-item label="包裹价值" prop="parcelValue"  >
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
        <el-tab-pane label="发件人信息"  name="2">
          <msgform ref="addremsgform"
                   :Disabled="dialogFlag.inputDisabled"
                   :houseId="pagefilters.whId"
                   :logisticsId="refId"
                   :getpoId="lineId"
                   :typeName="type"
                   v-on:child-change-Val="getChildvalue"
                   :dialogTitle="dialogFlag.dialogTitle" ></msgform>
        </el-tab-pane>
        <el-tab-pane label="收件人信息"  name="3">
          <msgform ref="addremsgform1" @changecountry-value="changeValue"
                   v-on:child-change-Val="getChildvalue"
                   :dialogTitle="dialogFlag.dialogTitle"
                   :Disabled="dialogFlag.inputDisabled"
                   :houseId="pagefilters.whId"
                   :typeName="type"
                   :logisticsId="refId"
                   :getpoId="lineId"></msgform>
        </el-tab-pane>
        <el-tab-pane :label="refId === '02' ?  '回邮地址':'包裹类型与服务'"  name="4">
          <el-form :label-width="financeFormLabelWidth" :model="serviceData" ref="serviceData">
            <el-col>
              <el-col v-if="refId === '02' ? false:true">
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
              <!-- <el-col style="margin-left: 50px;" v-if="refId =='01'">
                 <msgform ref="addremsgform" :Disabled="dialogFlag.inputDisabled" :logisticsId="refId"
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
                         :logisticsId="refId"
                         :getpoId="lineId" ></msgform>
              </el-col>
            </el-col>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" v-if="dialogFlag.dialogDisabled == false">
        <el-button @click="dialogFlag.isOpen = false;">关 闭</el-button>
        <el-button type="primary" @click="submitDialogForm();" :loading="$store.state.loading" v-if="dialogFlag.inputDisabled==false">保 存</el-button>
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
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import titleHeader from "components/ScreenModular/title.vue"
  import textInput from 'components/ScreenModular/textInput.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import msgform from "./SonModula/AddressmsgForm.vue"
  import CurrencyList from '../../components/listData/getCurrencyList.vue'


  export default{
    components: {
      ElButton,
      OwnWarehouseList,titleHeader,textInput,timeData,msgform,CurrencyList},
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
        parcelId:'',
        FaddressId:'',
        addSender: {},//发件人
        addAddressee: {},//收件人
        issameAddress: false,
        service:{},
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
        type:'',
        modelFormm:{},
        lineId:'',
        refId:'',//物流方式
        whId:'',
        isReturnAddress: false,
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
      	editDialog:{
          ids:[],
        },
        methodId:'',
        status:'',
      	parceStatus:[
          {value:'1',label:'未生成波次'},
          {value:'2',label:'已生成波次'},
          {value:'3',label:'已打印'},
          {value:'4',label:'已发货'},
        ],
        LogisticsArr:[],
        Logistics:[],
        parcelType:[],
        packageArr:[
        	{value:'1',label:'一个订单一种SKU数量一个'},
          {value:'2',label:'一个订单一种SKU数量多个'},
          {value:'3',label:'一个订单多种SKU'},
          {value:'4',label:'多个订单一种SKU'},
          {value:'5',label:'多个订单多种SKU'},
        ],
        freightCost:'',//运费
        trackingNo:'',//跟踪单号
        dialogFlag:{
          inputDisabled:false,
          dialogDisabled:false,
          dialogTitle:'',
          activeTab:'1',
          isOpen:false,
          sccrenisOpen:false,
          freightisOpen:false,
          signedisOpen:false,
        },
        batchId:[],
        parcelData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        selectOptions:
          [{
            value: '1',
            label: '国家1'
          }, {
            value: '2',
            label: '国家2'
          },
            {
              value: '3',
              label: '非欧盟'
            }],
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
         whId:'',
          isNeedTrackingNo:'0',
          methodId:'',
          status:'1',
          parcelType1:'',
          parcelType2:'',
          parcelType3:'',
          parcelType4:'',
          parcelType5:'',
          orderNo:'',
          addStartTime:'',
          addEndTime:'',
          shippmentEndDate:'',
          shippmentStartDate:'',
          trackingNo:'',
          currentPage: 1,
          pageSize: 10,
        },
        ButtonInfo:{},//按钮权限列表20171227
        msgrules: {
          parcelWeight: [
            { validator: number, trigger: 'blur', required: true },
          ],
          parcelValue:[
            { validator: number, trigger: 'blur', required: true },
          ]
        },
      }
    },
    computed:{
      filerTpey(){
        if(this.parcelType.length < 1){
          return true;
        }else{
          return false;
        }
      },
      filermethodId(){
        if( this.Logistics<1){
          return true;
        }else{
          return false;
        }
      },
    },
    mounted: function () {
      this.getauthorityList();
      this.getParceList();
      this.setsimulationHeight();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getChildvalue:function(val){
        var obj=JSON.parse(JSON.stringify(val.value));
        val.type=='发件人'?(this.addSender = obj,this.FaddressId=val.addressId):val.type=='收件人'?(this.addAddressee=obj,this.SaddressId=val.addressId):val.type == '联系人'?(this.serviceData.addresser=obj):'';
        if(val.type=='发件人' && this.issameAddress == true ){this.serviceData.addresser=obj;this.serviceData.addresser.logisticsCategory=this.refId;}
        console.log('this.addAddressee % 0===',this.service)
        //console.log('obj % 0000000000===',this.addSender)

      },
      //币种改变
      getCurrency(val){
        this.msgData.currencyId = val.value;
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
            this.msgData.refId=this.refId;
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
        if(this.dialogFlag.dialogTitle=='编辑'){
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
        if(this.dialogFlag.dialogTitle=='编辑'){
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
        obj.logisticsCategory=this.refId;
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
      getDialogList(val){
      	console.log('val %0',val)
            this.refId=val.Logistics_Type;
            this.lineId=val.Parcel_Id;
            this.getMsgData(val.Parcel_Id);
            this.gettypeService(val.Parcel_Id);
      },
      tabs(val){
        this.dialogFlag.activeTab== '2' ?(this.type='发件人',  this.$refs.addremsgform.getFormList(this.type))  : this.dialogFlag.activeTab=='3' ? (this.type='收件人',this.$refs.addremsgform1.getFormList(this.type)):this.type='联系人';
        //if(this.dialogFlag.inputDisabled == false){this.$refs['addremsgform'].gettypeService();}

      },
      resetForm(){
        this.$refs['msgData'].resetFields();
        this.$refs['serviceData'].resetFields();
        this.isReturnAddress=false;
        this.type='';
        this.dialogFlag.activeTab='1';
        this.msgData.currencyId='';
        if(this.refId == '01'){this.msgData.parcelQty= '1';}
        this.$refs.addremsgform.resetForm();
        this.$refs.addremsgform1.resetForm();
        this.getParceList();
      },
      //基本信息
      getMsgData(val){
        this.httpPost('manualPackage/queryBase?parcelId='+val).then(res=>{
        	if(res.data!='' && res.data!=null){
            this.msgData=res.data;
          }
        })
      },
      //包裹类型与服务
      gettypeService(val){
        var aa={},vm=this;
        this.httpPost('manualPackage/queryTypeService?parcelId='+val).then(res=>{
          this.serviceData=res.data;
          if( res.data !=''  && res.data.addresser!=null && res.data.addresser.firstAddresser !=null ){
            this.isReturnAddress=true;
            this.service=res.data.addresser;
            this.serviceData.addresser = res.data.addresser;
            this.EaddressId=res.data.addresser.addressId;
            aa=JSON.parse(JSON.stringify(res.data.addresser));
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
        this.batchId=[];
       val.forEach(item=>item.childList.forEach(parcelId=>this.batchId.push(parcelId.Parcel_Id)));
//        val.forEach(item=>this.batchId.push(item.Batch_Id));
        console.log(7777)
        console.log(val)
        console.log(this.batchId)
      },
      screensubmit(){
      	this.pagefilters.methodId = this.methodId;
        this.pagefilters.status = this.status;
        this.getParceList();
      },
      getalltype(){

      },
      changeLogistics(){
        this.pagefilters.methodId=this.Logistics.join();
        this.getParceList();
      },
      changeType(val){
        	this.parcelType.forEach(item=>{
            item == '1' ? this.pagefilters.parcelType1='1':item == '2' ? this.pagefilters.parcelType2='2':item == '3'? this.pagefilters.parcelType3='3':item == '4'?this.pagefilters.parcelType4='4':item == '5'?this.pagefilters.parcelType5='5':'';
          });
        if(this.parcelType.indexOf('1')==-1){
          this.pagefilters.parcelType1=''
        }
        if(this.parcelType.indexOf('2')==-1){
          this.pagefilters.parcelType2=''
        }
        if(this.parcelType.indexOf('3')==-1){
          this.pagefilters.parcelType3=''
        }
        if(this.parcelType.indexOf('4')==-1){
          this.pagefilters.parcelType4=''
        }
        if(this.parcelType.indexOf('5')==-1){
          this.pagefilters.parcelType5=''
        }
        this.getParceList();
      	},
      colseScreen(){
          this.methodId='';
          this.status='';
          this.pagefilters.addStartTime='';
          this.pagefilters.addEndTime = '';
           this.pagefilters.shippmentStartDate='';
           this.pagefilters.shippmentEndDate ='';
           this.pagefilters.orderNo='';
           this.pagefilters.trackingNo='';
      },
      submitFreightCost(){

      },
      submitsign(){


      },
      waveGeneration(id,val,BaId){
      	//alert(this.freightCost)
        console.log('id % 000=',id)
        id !== '' ? this.editDialog.ids.push(id.Parcel_Id) : this.editDialog.ids=this.batchId;
        val == 'trackingNo' ? this.editDialog.trackingNo=this.trackingNo:val == 'freightCost'?this.editDialog.freightCost=this.freightCost:val == 'Wave'?this.editDialog.whId=this.pagefilters.whId:'';
        if(val === 'Wave'){
          if(this.editDialog.trackingNo){delete this.editDialog.trackingNo}
          if(this.editDialog.freightCost){delete this.editDialog.freightCost }
        	this.editDialog.ids<1?this.tips():this.doItem('您确定生成波次吗？','parcelOrder/addBatch',this.editDialog,this.getParceList)
        }else{
        	if(val === 'freightCost'){
            this.editDialog.ids<1?this.tips():this.dialogFlag.freightisOpen=true;}
           else{
            this.editDialog.ids<1?this.tips():this.dialogFlag.signedisOpen=true;
          }
        }
      },
      submitedit(url,isopen){
      	console.log(this.editDialog)
        if(this.dialogFlag.freightisOpen===true){
        	this.editDialog.freightCost=this.freightCost;
        	if(this.editDialog.trackingNo){delete this.editDialog.trackingNo }
        };
        if(this.dialogFlag.signedisOpen===true){this.editDialog.trackingNo=this.trackingNo ;
          if(this.editDialog.freightCost){delete this.editDialog.freightCost }
        };
        this.httpPost(url,this.editDialog).then(res=>{
      		this.$message(res.data.message);
      		if(res.data.result===true){
      			 isopen=='freightisOpen'?this.dialogFlag.freightisOpen=false:this.dialogFlag.signedisOpen=false;
             this.getParceList();
          }
        })
      },
      getTime:function(val){
        //alert(val.titleName)
        val.type == 'start' &&  val.titleName == '下单日期'? this.pagefilters.addStartTime = val.value : val.type == 'start' &&  val.titleName == '发货日期' ? this.pagefilters.shippmentStartDate = val.value:'';
        val.type == 'end'   &&  val.titleName == '下单日期'? this.pagefilters.addEndTime = val.value : val.type == 'end' &&  val.titleName == '发货日期' ? this.pagefilters.shippmentEndDate = val.value:'';
      },
      CalculationHeight:function () {
        //合并表格 小行统一高度。
        let objList=document.getElementsByClassName('simulation');
        console.log('objCell.id % 0==',objList)
        let heights=[];
        for(let i=0;i<objList.length;i++) {
          let objCell = objList[i];
          let objId = objCell.id;
          let subName = objId.substring(objId.indexOf('-') + 1).split('/');
          let group = subName[0];
          let groupRow = subName[1];
         console.log('heights length:', group);
          if (heights.length < group + 1) {
            this.$set(heights, group, []);
          }
          setTimeout(() => {
            if (heights[group].length < groupRow + 1) {
              this.$set(heights[group], groupRow, 0);
            }
          }, 20);
          setTimeout(() => {
            if (heights[group][groupRow] < objCell.offsetHeight) {
              this.$set(heights[group], groupRow, objCell.offsetHeight);
            }
          }, 80)
        }
        console.log('heights length:', heights);

        setTimeout(()=>{//设置最大高度和 子元素的 -top 值；
          for (let m = 0; m < heights.length; m++) {
            for (let n = 0; n < heights[m].length; n++) {
              for (let k = 0; k < objList.length; k++) {
                if (objList[k].id == 'simulation-' + m + '/' + n) {
                  objList[k].style.height = (heights[m][n]+42) + 'px';
                  let child = objList[k].childNodes[0];
                  child.style.marginTop = -(child.offsetHeight/2)+'px';
                }
              }
            }
          }
        },100)
      },
      getChildren(data){
        data.type === 'orderNo'? this.pagefilters.orderNo = data.value : data.type==='trackingNo' ? this.pagefilters.trackingNo = data.value : '';
        if(data.type ==='house'){
          this.pagefilters.whId=data.value;
          this.getParceList();
        }
      },
      getHouse(data){
        var valarr=data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
        this.getLogistics();
      },
      //物流方式
      getLogistics(){
      	this.httpPost('partsApply/loadLogistics?whId='+this.pagefilters.whId) .then(res=>{
      		this.LogisticsArr=res.data;
        })},
      //列表数据
      getParceList(){
        this.httpPost('parcelOrder/list',this.pagefilters).then(res=>{
           this.parcelData=res.data.listData;
           this.page=res.data;
          this.setsimulationHeight(this.parcelData);
          //console.log('this.page % 0==',this.page)
        })
      },
      setsimulationHeight(){
      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getParceList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getParceList();
      },

    }
  }

</script>

<style scoped>
  .tableHeight .cell{}
  .typeButton .el-checkbox-button {
         margin-right: 8px!important;
         border-left: 1px solid #bfcbd9;
         border-radius: 2px;
  }
  .typeButton  .el-checkbox-button:first-child{
      border-left:none;
  }
  .simulation{
    word-break:break-all;
    white-space:normal;
    border-bottom: 1px solid #dfe6ec;
    //margin-left: -18px !important;
    //margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 180px;
    position: relative;
  }
  .childDiv{
    white-space:normal;
    word-wrap:break-word;
    word-break:break-all;
    padding-top:30px;
    height: 226px;
    box-sizing:border-box;
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
    overflow: hidden;
   /* position: relative;
    top:50%;*/
  }
 /* .childDiv:first-child{
    padding:0;
  }*/
  .childDiv2{

  }
  div.simulation:last-child {
    border-bottom: 0;
  }
  .fontRed{
    color:red;
  }

</style>
