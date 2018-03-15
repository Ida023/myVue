<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row class="marginBottom">
        <OwnWarehouseList  :selectValue="pagefilters.whId"  select-type="house"  default="defaultt" placeValue="请选择仓库"  size="small"  @child-change-val="getChildren"   @child-change='getHouse' ></OwnWarehouseList>
      </el-row>
      <el-row class="marginBottom" style="padding: 50px 100px;border: 1px solid #dfe6ec;" >
        <el-steps :active="5" align-center  center finish-status="finish">
          <el-step title="生成波次" ></el-step>
          <el-step title="打印拣货单,打印地址标签,打印邮票" ></el-step>
          <el-step title="拣货打包" ></el-step>
          <el-step title="发货签名" ></el-step>
          <el-step title="标记发货" ></el-step>
        </el-steps>
      </el-row>
      <el-row  id="filer" class="marginBottom">
        <el-col class="marginBottom" style="padding: 10px;border: 1px solid #dfe6ec;">
          <span  class="span_label">类  型</span>
          <el-radio-group v-model="pagefilters.status" size="small"    @change="getdeliveryList();">
            <el-radio-button label="01">待发货波次</el-radio-button>
            <el-radio-button label="02">已发货波次</el-radio-button>
            <el-radio-button label="03">已退回波次</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="marginBottom"  style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
        <el-button size="small"  type="primary" @click="dialogFlag.sccrenisOpen=true;getLogistics();" >筛选</el-button>
      </el-row>
      <el-row class="marginBottom"  v-if="pagefilters.status=='01'" >
        <el-button size="small"  type="primary"  @click="returnList('')">批量退回</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="deliveryData" border tooltip-effect="dark" style="width: 100%"  @selection-change="handleChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column sortable width="120px" label="操作" prop=""  align="center" >
            <template scope="scope">
              <el-tooltip content="查看"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" @click="dialogFlag.WaveisOpen=true;getdeliverydetails(scope.row);"  content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="发货签名" v-if="pagefilters.status == '01'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center" @click="getautograph(scope.row);">&#xe66b;</i>
              </el-tooltip>
              <el-tooltip content="打印拣货单" v-if="pagefilters.status != '03'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"  @click="tool.goToPage('pickingList?batchId='+scope.row.Batch_Id)" content="Bottom center">&#xe638;</i>
              </el-tooltip>
              <el-tooltip content="回退" v-if="pagefilters.status == '01'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"  @click="returnList(scope.row)" content="Bottom center">&#xe61c;</i>
              </el-tooltip>
              <el-tooltip content="发货" v-if="pagefilters.status == '01'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"  @click="getLogisticsModeflag(scope.row,'1');" content="Bottom center">&#xe64b;</i>
              </el-tooltip>
            <!--  <el-tooltip content="导入" v-if="pagefilters.status == '01'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"  @click="dialogFlag.isOpenLead=true" content="Bottom center">&#xe63a;</i>
              </el-tooltip>
              <el-tooltip content="导出" v-if="pagefilters.status == '01'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center" @click="exportData(scope.row)">&#xe60a;</i>
              </el-tooltip>
              <el-tooltip content="打印波次邮票"  effect="dark" placement="bottom">
                <i  class="iconfontyyy"   @click="tool.goToPage('printStamp?batchId='+scope.row.Batch_Id)"  content="Bottom center">&#xe601;</i>
              </el-tooltip>
            &lt;!&ndash;  <el-tooltip content="打印波次邮票" v-if="pagefilters.status == '01'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"   @click="tool.goToPage('printStamp?batchId='+scope.row.Batch_Id)"  content="Bottom center">&#xe601;</i>
              </el-tooltip>&ndash;&gt;
              <el-tooltip content="打印波次地址标签" v-if="pagefilters.status != '03'" effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center">&#xe633;</i>
              </el-tooltip>-->
              <el-tooltip content="跟踪单号"   effect="dark" placement="bottom" v-if="scope.row.Shippment_User!='' && scope.row.Shippment_User!=null && pagefilters.status == '01'">
                <i  class="iconfontyyy"   content="Bottom center" @click="submitShipment(scope.row,'');getdeliverydetails(scope.row);">&#xe73e;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="波次ID"  align="center" prop="Batch_Id" sortable width="200px" >
              <template scope="scope">
                  <span :class="scope.row.interceptedCount>0?'fontRed':''">{{scope.row.Batch_Id}}</span><br>
                  <span :class="scope.row.interceptedCount>0?'fontRed':''" v-if="scope.row.interceptedCount>0">有包裹被拦截</span>
              </template>
          </el-table-column>
          <el-table-column label="仓库"  align="center" prop="Wh_Id" sortable>
          </el-table-column>
          <el-table-column label="物流方式"  align="center" prop="Cn_Name" sortable>
          </el-table-column>
          <el-table-column label="包裹数量"  align="center" prop="parcelCount" sortable>
          </el-table-column>
      <!--    <el-table-column label="退回包裹"  align="center" prop="" sortable>
          </el-table-column>-->
          <el-table-column label="已完成包裹"  align="center" prop="completeParcelCount" sortable>
          </el-table-column>
          <el-table-column label="订单总数"  align="center" prop="orderCount" sortable>
          </el-table-column>
          <el-table-column label="产品总数"  align="center" prop="productCount" sortable>
          </el-table-column>
          <el-table-column label="SKU数量"  align="center" prop="skuCount" sortable>
          </el-table-column>
          <el-table-column label="创建人"  align="center" prop="Add_User" sortable>
          </el-table-column>
          <el-table-column label="创建时间"  :formatter="tool.formatDate"  align="center" prop="Add_Time" sortable>
          </el-table-column>
          <el-table-column label="完成时间"  :formatter="tool.formatDate"  align="center" prop="Shippment_Last_Time" sortable>
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
              <el-select  filterable clearable v-model="pagefilters.methodId" :allow-create="true" placeholder="请选择"  >
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
              <el-select  filterable clearable v-model="statuss" :allow-create="true" placeholder="请选择"  >
                <el-option v-for="item in batchStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <text-input condition-name="波次Id"  @child-change-val="getChildren"  :selectValue="pagefilters.batchId"  text-type="batchId" ></text-input>
          <time-data  conditionName="生成日期"  :start-time="pagefilters.addStartTime" :end-time="pagefilters.addEndTime" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
          <time-data  conditionName="完成日期"  :start-time="pagefilters.startDate" :end-time="pagefilters.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseScreen();">清除条件</el-button>
          <el-button @click="dialogFlag.sccrenisOpen = false;screensubmit();">筛 选</el-button>
          <el-button @click="dialogFlag.sccrenisOpen = false;" >取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-------------导入弹出框------------------------>
    <el-dialog title="批量导入" :visible.sync="dialogFlag.isOpenLead" size="tiny" @close="excFile=[];">
      <el-upload class="upload-demo" :http-request="uploadFile"  :action="uploadExc" ref="upload" :auto-upload="false" :on-change="handExcChange" :file-list="excFile" accept='.xls,.xlsx,.xlsm'>
        <span>选择需要导入的文件</span>
        <el-button size="small" type="primary">选择文件</el-button>
      </el-upload>
      <br/>
      <span class="remark">请先导出模板数据，录入相关数据之后再导入。</span><br/>
<!--
      <span class="modelDown" @click="downDown(uploadExcModal)">excel模板下载</span>
-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpenLead = false;">取 消</el-button>
          <el-button type="primary" @click="submitUpload();">导 入</el-button>
        </span>
    </el-dialog>
    <!---------------导入导常弹出框-------------------------->
    <el-dialog title="上传失败提示" :visible.sync="dialogFlag.isOpen" size="tiny">
      <div id="item_list">
        <el-table :data="DataList" border tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="cellName" label="坐标" align="center"></el-table-column>
          <el-table-column prop="errorDesc" label="错误信息" align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;">关 闭</el-button>
      </div>
    </el-dialog>
    <!---------------查看波次详情-------------------------->
    <el-dialog title="查看波次详情" :visible.sync="dialogFlag.WaveisOpen"  @close="resetForm('waveForm.batch')">
      <el-form :model="waveForm.batch"  ref="waveForm.batch"  labelWidth="190px">
        <h3>基本信息</h3>
        <el-form-item label="波次号:" prop="Batch_Id">{{waveForm.batch.Batch_Id}}</el-form-item>
        <el-form-item label="物流方式:" prop="methods">{{waveForm.batch.methods}}</el-form-item>
        <el-form-item label="波次生成用户:" prop="Add_User">{{waveForm.batch.Add_User}}</el-form-item>
        <el-form-item label="包裹/订单/SKU/已完成数量:" prop="">{{waveForm.batch.parcelCount}}/{{waveForm.batch.orderCount}}/{{waveForm.batch.productCount}}/{{waveForm.batch.completeParcelCount}}</el-form-item>
        <el-form-item label="波次生成时间:" prop="">{{tool.formatDate('','',waveForm.batch.Add_Time)}}</el-form-item>
        <h3>订单详情</h3>
  <!--      <el-table :data="deliveryData" border tooltip-effect="dark" style="width: 100%"  >-->

          <el-table :data="waveForm.parcelList" border tooltip-effect="dark" style="width: 100%"  >
          <el-table-column sortable width="" label="操作" prop=""  align="center" >
            <template scope="scope">
              <el-tooltip content="发货"  effect="dark" placement="bottom">
                <i  class="iconfontyyy"  @click="getLogisticsModeflag(scope.row,'2');" content="Bottom center">&#xe64b;</i>
              </el-tooltip>
           <!--   <el-tooltip content="打印波次邮票"  effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center">&#xe601;</i>
              </el-tooltip>
              <el-tooltip content="打印波次地址标签"  effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center">&#xe633;</i>
              </el-tooltip>-->
              <el-tooltip content="查看"  effect="dark" placement="bottom" >
                <i  class="iconfontyyy" @click="getAddresseeMsg(scope.row)"  content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="回退"  effect="dark" placement="bottom" v-if="pagefilters.status!='03'">
                <i  class="iconfontyyy"  @click="dialogFlag.ReasonisOpen=true;openReason(scope.row)" content="Bottom center">&#xe61c;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="包裹编号"  align="center" prop="Parcel_Id" sortable>
          </el-table-column>
          <el-table-column label="订单ID"  align="center" prop="Order_Id" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" v-if="scope.row.childList!=[]" class="simulation" >
                <div class="childDiv paddingStyle"  >
                  <el-col>
                    {{item.Order_Id}}
                  </el-col>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="图片"  align="center" prop="Image_Url" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                <div v-for="(info,index) in item.childList" class="simulation" >
                <div class="childDiv paddingStyle"  >
                  <el-col>
                    <img  v-if="info.Image_Url!=null" style="width: 70px; height: 70px" :src="info.Image_Url" >
                  </el-col>
                </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="SKU"  align="center" prop="Sku_No" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" class="simulation"  v-if="scope.row.childList!=[]" >
                <div v-for="(info,index) in item.childList" class="simulation" >
                  <div class="childDiv paddingStyle"  >
                    <el-col>
                      {{info.Sku_No}}
                    </el-col>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="跟踪单号"  align="center" prop="Tracking_No" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                <div v-for="(info,index) in item.childList" class="simulation" >
                  <div class="childDiv paddingStyle"  >
                    <el-col>
                      {{info.Tracking_No}}
                    </el-col>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品名称"  align="center" prop="Cn_Name" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" class="simulation"  v-if="scope.row.childList!=[]">
                <div v-for="(info,index) in item.childList" class="simulation" >
                  <div class="childDiv paddingStyle"  >
                    <el-col>
                      {{info.Cn_Name}}
                    </el-col>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量"  align="center" prop="" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                <div v-for="(info,index) in item.childList" class="simulation" >
                  <div class="childDiv paddingStyle"  >
                    <el-col>
                    {{info.Sales_Qty}}
                    </el-col>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注"  align="center" prop="" sortable>
            <template scope="scope">
              <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                <div v-for="(info,index) in item.childList" class="simulation" >
                  <div v-for="(note,index) in info.notes" class="simulation" >
                  <div class="childDiv paddingStyle"  >
                    <el-col>
                      {{note.noteContent}}
                    </el-col>
                  </div>
                </div>
                </div>
              </div>
            </template>
          </el-table-column>
            <el-table-column label="拦截信息"  align="center" prop="" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                      <div class="childDiv paddingStyle"  >
                        <el-col>
                         <span class="fontRed" >{{info.InterceptMsg}}</span>
                        </el-col>
                      </div>
                  </div>
                </div>
              </template>
            </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.WaveisOpen = false;">关 闭</el-button>
      </div>
    </el-dialog>
    <!---------------收件人信息-------------------------->
    <el-dialog title="收件人信息" :visible.sync="dialogFlag.AddresseeisOpen" size="tiny">
      <el-form :model="CustomerForm" labelWidth="100px"   >
        <el-form-item label="收件人:" prop="customerName">{{CustomerForm.customerName}}</el-form-item>
        <el-form-item label="地址:" prop="address1">{{CustomerForm.address1}}</el-form-item>
        <el-form-item label="城市:" prop="city">{{CustomerForm.city}}</el-form-item>
        <el-form-item label="区:" prop="district">{{CustomerForm.district}}</el-form-item>
        <el-form-item label="州:" prop="state">{{CustomerForm.state}}</el-form-item>
        <el-form-item label="邮编:" prop="postCode">{{CustomerForm.postCode}}</el-form-item>
        <el-form-item label="电话:" prop="phone">{{CustomerForm.phone}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.AddresseeisOpen = false;">关 闭</el-button>
      </div>
    </el-dialog>
    <!---------------发货签名-------------------------->
    <el-dialog title="发货签名" :visible.sync="dialogFlag.autographisOpen" size="tiny" @close="resetForm('autographForm')">
      <el-form labelWidth="120px" :model="autographForm"  ref="autographForm">
        <h3>当前日期：{{getNowTime()}}</h3>
        <el-form-item label="拣货人:" prop="pickingUser"   :rules=" { required: true, message: '请输入该字段', trigger: 'blur' }"><el-input type="text" v-model="autographForm.pickingUser"></el-input></el-form-item>
        <el-form-item label="拣货时间:" prop="" >
          <el-row class="block">
            <el-col :span="12">
              <el-date-picker v-model="autographForm.pickingStartTime" size="small" editable type="datetime" placeholder="选择开始时间"></el-date-picker>
            </el-col>
            <el-col :span="12">
              <el-date-picker v-model="autographForm.pickingEndTime" size="small" editable type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="打包/发货人:" prop="shippmentUser" :rules="[{required:true,message:'请输入该字段',trigger:'blur'}]"><el-input type="text" v-model="autographForm.shippmentUser"></el-input></el-form-item>
        <el-form-item label="打包/发货时间:" prop="State" >
          <el-row class="block">
            <el-col :span="12">
              <el-date-picker v-model="autographForm.shippmentStartTime" size="small" editable type="datetime" placeholder="选择开始时间"></el-date-picker>
            </el-col>
            <el-col :span="12">
              <el-date-picker v-model="autographForm.shippmentEndTime" size="small" editable type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogFlag.autographisOpen = false;">关 闭</el-button>
        <el-button type="primary"  @click="submitautograph();" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!----------------------------------波次详情退回------------------------------------------------------>
    <el-dialog title="退回原因" :visible.sync="dialogFlag.ReasonisOpen" size="tiny" @close="memo=''">
      <el-form >
        <el-form-item  prop="memo">
          <el-input type="textarea"  v-model="memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.ReasonisOpen = false;">关 闭</el-button>
        <el-button type="primary"  @click="submitReason();" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!----------------------------------标记发货(需要跟踪单号)------------------------------------------------------>
    <el-dialog title="标记发货(需要跟踪单号)" :visible.sync="dialogFlag.signisOpen" size="small" >
      <el-form :model="waveForm.batch"  ref="waveForm.batch"  labelWidth="190px">
        <h3>基本信息</h3>
        <el-form-item label="波次号:" prop="Batch_Id">{{waveForm.batch.Batch_Id}}</el-form-item>
        <el-form-item label="物流方式:" prop="methods">{{waveForm.batch.methods}}</el-form-item>
        <el-form-item label="波次生成用户:" prop="Add_User">{{waveForm.batch.Add_User}}</el-form-item>
        <el-form-item label="订单数量/完成数量:" prop="">{{waveForm.batch.orderCount!=null?waveForm.batch.orderCount:0}}/{{waveForm.batch.completeParcelCount!=null?waveForm.batch.completeParcelCount:0}}</el-form-item>
        <el-form-item label="波次生成时间:" prop="">{{tool.formatDate('','',waveForm.batch.Add_Time)}}</el-form-item>
        <h3>订单详情</h3>
        <el-col class="marginBottom">
          <el-button type="primary" @click="submitNumbers('','part');">保存跟踪单号</el-button>
          <el-button type="primary" @click="submitShipment('','part')">标记发货</el-button>
        </el-col>
<!--
        <el-table :data="deliveryData" border tooltip-effect="dark" style="width: 100%"    @selection-change="handleSelectionChange">
-->
          <el-table :data="waveForm.parcelList" border tooltip-effect="dark" style="width: 100%"   @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column sortable width="" label="操作" prop=""  align="center" >
            <template scope="scope">
              <el-tooltip content="查看"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" @click="getAddresseeMsg(scope.row)"  content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="保存跟踪单号"  effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center" @click="submitNumbers(scope.row,'part')">&#xe613;</i>
              </el-tooltip>
              <el-tooltip content="标记发货"  effect="dark" placement="bottom">
                <i  class="iconfontyyy"   content="Bottom center" @click="submitShipment(scope.row,'part')">&#xe73e;</i>
              </el-tooltip>
            </template>
          </el-table-column>
            <el-table-column label="包裹编号"  align="center" prop="Parcel_Id" sortable>
            </el-table-column>
            <el-table-column label="订单ID"  align="center" prop="Order_Id" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" v-if="scope.row.childList!=[]" class="simulation" >
                  <div class="childDiv paddingStyle"  >
                    <el-col>
                      {{item.Order_Id}}
                    </el-col>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="图片"  align="center" prop="Image_Url" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        <img  v-if="info.Image_Url!=null" style="width: 70px; height: 70px" :src="info.Image_Url" >
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="SKU"  align="center" prop="Sku_No" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"  v-if="scope.row.childList!=[]" >
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        {{info.Sales_Qty}}
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="跟踪单号"  align="center" prop="Tracking_No" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        <el-input type="number" v-model="info.Tracking_No"></el-input>
<!--
                        {{info.Tracking_No}}
-->
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品名称"  align="center" prop="Cn_Name" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"  v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        {{info.Cn_Name}}
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量"  align="center" prop="" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        {{info.packQty}}
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态"  align="center" prop="" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        {{info.Status}}
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注"  align="center" prop="" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div v-for="(note,index) in info.notes" class="simulation" >
                      <div class="childDiv paddingStyle"  >
                        <el-col>
                          {{note.noteContent}}
                        </el-col>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="拦截信息"  align="center" prop="" sortable>
              <template scope="scope">
                <div v-for="(item,index) in scope.row.childList" class="simulation"   v-if="scope.row.childList!=[]">
                  <div v-for="(info,index) in item.childList" class="simulation" >
                    <div class="childDiv paddingStyle"  >
                      <el-col>
                        <span class="fontRed" >{{info.InterceptMsg}}</span>
                      </el-col>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="submitNumbers('','all');">保存跟踪单号</el-button>
        <el-button type="primary"  @click="submitShipment('','all')" >标记发货</el-button>
        <el-button @click="dialogFlag.signisOpen = false;">取 消</el-button>
      </div>
    </el-dialog>
    <!--打印-->
    <el-dialog title="发货" :visible.sync="dialogFlag.deliverisOpen" size="tiny" >
      <el-form labelWidth="80px">
     <!--   <el-form-item :label="Modeflag==1?'方式一':Modeflag==2?'方式二':Modeflag==3?'方式三':''">
        </el-form-item>-->
        <h3>{{modeData.Shippment_Type==1?'方式一':modeData.Shippment_Type==2?'方式二':modeData.Shippment_Type==3?'方式三':''}}</h3>
        <el-form-item v-if="modeData.Shippment_Type==1" >
          <div style="cursor: pointer" @click="printAddress('1');">
            <i class="iconfontyyy" >&#xe638;</i><span>打印地址面单</span>
          </div>
          <div style="cursor: pointer"  @click="printAddress('2');">
            <i class="iconfontyyy" >&#xe638;</i><span>打印邮票+地址面单</span>
          </div>
        </el-form-item>
        <el-form-item  v-if="modeData.Shippment_Type==2" >
          <div style="cursor: pointer" @click="tool.goToPage('printStamp?batchId='+rowBatchId)">
            <i class="iconfontyyy" >&#xe638;</i><span>获取跟踪单号/打印邮票/报关单/回邮地址</span>
          </div>
        </el-form-item>
        <el-form-item  v-if="modeData.Shippment_Type==3"   >
          <div  @click="exportData();" style="cursor: pointer">
            <i class="iconfontyyy" >&#xe60a;</i><span>导出订单信息</span>
          </div>
          <div  @click="importData.isOpen=!importData.isOpen" style="cursor: pointer">
            <i class="iconfontyyy"  >&#xe63a;</i><span>导入跟踪单号&运费</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="dialogFlag.deliverisOpen = false;" >确 定</el-button>
        <el-button @click="dialogFlag.deliverisOpen = false;">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入-->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getmarkList"></import-dialog>

    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                     :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue';
  import titleHeader from "components/ScreenModular/title.vue";
  import textInput from 'components/ScreenModular/textInput.vue';
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import timeData from "../../components/ScreenModular/timeDate.vue";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";

  export default{
    components: {
      ElButton,
      ElForm,
      ElFormItem,
      OwnWarehouseList,
      titleHeader,
      textInput,
      timeData
    },
    data(){
      return {
        importData:{  // /新建手工订单 子组件传参
          importUrl:'shippmentLeading/importData',
          modalUrl:'',
          isOpen:false,
        },
        rowBatchId:'',
        parcelId:'',
        memo:'',
        autographForm:{
          batchId:'',
          pickingUser:'',
          pickingStartTime:'',
          pickingEndTime:'',
          shippmentUser:'',
          shippmentStartTime:'',
          shippmentEndTime:''
        },
        CustomerForm:{
          Customer_Id:'',
          customerName:'',
          address1:'',
          city:'',
          district:'',
          state:'',
          postCode:'',
          phone:''
        },
        statuss:'',
        LogisticsArr:[],
        batchStatus:[
        	{label:'待发货波次',
           value:'01'},
          {label:'已发货波次',
            value:'02'},
          {label:'已退回波次',
            value:'03'}
        	],
        batchId:[],
        waveForm:{
          batch:{
            batchId:'',
            methods:'',
            Add_User:'',
            parcelCount:'',
            orderCount:'',
            productCount:'',
            completeParcelCount:'',
            Add_Time:''
          },
          parcelList:[]
        },
        //导入
        uploadExcModal:this.RmsUrl+'initStock/templateExport?Authorization='+sessionStorage.getItem('userSession'),   //  导入模板地址
        uploadExc:this.RmsUrl+'initStock/import?Authorization='+this.sessuserid,   //  上传导入文件地址
        excName:'',
        excList:'',
        excFile:[],
        DataList:[],//异常data
        //弹窗
        dialogFlag:{
          signisOpen:false,
          isOpenLead:false,
          isOpen:false,
          WaveisOpen:false,
          AddresseeisOpen:false,
          sccrenisOpen:false,
          autographisOpen:false,
          Trackingisopen:false,
          ReasonisOpen:false,
          deliverisOpen:false
        },
        //列表数据
     /*   deliveryData:[
          {Batch_Id:'123',Is_Need_TrackingNo:'1'},{Batch_Id:'123',Is_Need_TrackingNo:'0'}
        ],*/
        deliveryData:[
        ],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //wait/process/finish/error/success
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
          status:'01',
          whId:'',
          methodId:'',
          batchId: '',
          addStartTime:'',
          addEndTime:'',
          startDate:'',
          endDate:'',
          currentPage: 1,
          pageSize: 10,
        },
        selectionIds:[],
        modeData:{
          Batch_Id:'',
          Ref_Id:'',
          Shippment_Type:''
        },

      }
    },
    mounted: function () {
     // this.getdeliveryList();
      //this.getLogistics();
    },
    methods: {
      printAddress(val){
      	var obj={};
      	obj.batchId=this.rowBatchId;
      	obj.refId=this.modeData.Ref_Id;
      	obj.printType=val;
        //this.httpGet('shipmentBatch/printAddressSingle?batchId='+this.rowBatchId+'&refId='+this.modeData.Ref_Id+'&printType='+val)
        window.open(this.RmsUrl+'shipmentBatch/printAddressSingle?batchId='+this.rowBatchId+'&refId='+this.modeData.Ref_Id+'&printType='+val+'&Authorization=' + sessionStorage.getItem("userSession"));
        //this.httpPost('shipmentBatch/printAddressSingle',obj)
      },
      exportData(){
      	var url='';
        url=this.modeData.Ref_Id=='16'?'shippmentLeading/exportAliExpressData':this.modeData.Ref_Id=='13'?'shippmentLeading/exportAmericaData':this.modeData.Ref_Id=='04'?'shippmentLeading/exportAmericaData':'';
       //this.httpGet(url)
        window.open(this.RmsUrl+url + sessionStorage.getItem("userSession"));
      },
      getLogisticsModeflag(row,val){
      	var id='';
        console.log('val % 0',val)
        this.rowBatchId=row.Batch_Id;
        val=='1'?(id=row.Batch_Id,this.rowBatchId=row.Batch_Id):(id=row.childList[0].childList[0].Batch_Id,this.rowBatchId=row.childList[0].childList[0].Batch_Id);
            this.httpGet('shipmentBatch/queryMethod?batchId='+id).then(res=>{
              this.modeData= res.data;
              this.dialogFlag.deliverisOpen=true;
            })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    /*  exportData:function(row){
        var url = this.RmsUrl+'warehousestocktaking/excelExport?Authorization='+sessionStorage.getItem('userSession')+'&stoId='+row.Batch_Id+'&type=0';  //  导出地址
        window.open(url);
      },*/
      handleSelectionChange(val){
           this.selectionIds=val;
           console.log('val % 0',val)
      },
      getautograph(val){
      	this.rowBatchId=val.Batch_Id;
        this.dialogFlag.autographisOpen=true;
        this.httpGet("shipmentBatch/queryAutograph?batchId="+val.Batch_Id,'','Sms').then(res=>{
        	if(res.data!=null && res.data!=''){
            this.autographForm=res.data;
          }
        })
      },
    	//发货签名
      submitautograph(){
      	this.autographForm.batchId=this.rowBatchId;
        this.$refs['autographForm'].validate((valid) => {
        	if(valid){
        		if(this.autographForm.pickingStartTime=='' || this.autographForm.pickingEndTime=='' || this.autographForm.shippmentStartTime=='' || this.autographForm.shippmentEndTime==''  ){
                this.$message('请选择时间！')
            }else{
              this.httpPost('shipmentBatch/autograph',this.autographForm,'Sms').then(res=>{
                this.$message(res.data.message)
                if(res.data.result==true){
                 this.dialogFlag.Trackingisopen = true;
                 this.dialogFlag.autographisOpen = false;
                 this.getdeliveryList();
                 }
              })
            }

          }


        })

      },
      submitShipment(row,val){
        /*
        * row 单个订单标记发货     row
        * all 表格所有订单标记发货   deliveryData
        * part 选择部分发货       Selection
        * */

        this.dialogFlag.signisOpen=true;
        var obj={},vm=this;obj.ids=[];
        obj.batchId= this.rowBatchId;
        row!=''?(vm.rowBatchId=row.Batch_Id,obj.ids.push(row.Parcel_Id)): vm.selectionIds.forEach(item=>{
          obj.ids.push(item.Parcel_Id)
        });
        console.log('obj % 0',obj)
        val=='all'?vm.doGetItem('确定标记发货吗？','shipmentBatch/shipmentAll?batchId='+vm.rowBatchId,'',''): val=='part'?vm.submitShipmentPart(obj):'';
          //val=='all'?vm.submitShipmentAll(vm.rowBatchId): val=='part'?vm.submitShipmentPart(obj):'';
      },
      //标记发货全部
      submitShipmentAll(obj){
        this.httpGet('shipmentBatch/shipmentAll?batchId='+obj,'','Sms').then(res=>{
              this.$message(res.data.message);
              if(res.data.result==true){
              	this.dialogFlag.signisOpen = false;
              }
        })
      },
      //标记发货部份
      submitShipmentPart(obj){
      	var vm=this;
        if(obj.ids.length<=0){
          vm.tips();
        }else{
          vm.doItem('确定标记发货吗？','shipmentBatch/shipmentPart',obj,'');
          /*this.httpPost('shipmentBatch/shipmentPart',obj,'Sms').then(res=>{
            this.$message(res.data.message);
            if(res.data.result==true){
              this.dialogFlag.signisOpen = false;
            }
          })*/
        }

      },
      //保存跟踪单号
      submitNumbers(row,val){
      	var numArr=[],vm=this;
      	row!=''?numArr.push({parcelId:row.Parcel_Id,trackingNo:row.Tracking_No}): vm.recursionList(vm.selectionIds,numArr);
        val=='all'?vm.recursionList(vm.waveForm.parcelList,numArr):'';
        // val=='all'?this.waveForm.parcelList.forEach(item=>{numArr.push({parcelId:item.Parcel_Id,trackingNo:item.Tracking_No})}):'';
      	console.log('numArr % 0',numArr)
        var flag=numArr.every(item=>{return item.trackingNo!=''})
       if( numArr.length<=0){
         vm.tips();
       }else{
       	if(flag==true){
         vm.doItem('您确定保存跟踪单号？','shipmentBatch/editTrackingNo',numArr,'');
        }else{
       		this.$message('跟踪单号不能为空！')
        }
       }
      },
      recursionList(list,data){
        list.forEach(item=>{
        	if(item.childList && item.childList.length>=1){
            item.childList.forEach(info=>{
              if(info.childList && info.childList.length>=1){
              	console.log('8888 % 0',info.childList)
                info.childList.forEach(each=>{
                  data.push({parcelId:each.Parcel_Id,trackingNo:each.Tracking_No})
                })
              }
            })
          }
        })
      },
      openReason(val){
        this.parcelId=val.Parcel_Id;
      },
      //查看收件人信息
       getAddresseeMsg(val){
      	this.httpGet('shipmentBatch/queryCustomer?parcelId='+val.Parcel_Id,'','Sms').then(res=>{
      		if(res.data!='' && res.data!=null){
            this.CustomerForm=res.data;
          }
          this.dialogFlag.AddresseeisOpen=true;
        })
       },
    	//提交退回备注
      submitReason(){
      	var obj={};
        obj.batchId=this.rowBatchId;
        obj.parcelId=this.parcelId;
        obj.memo=this.memo;
        this.httpGet('shipmentBatch/returnParcel?batchId='+this.rowBatchId+'&parcelId='+this.parcelId+'&memo='+this.memo,'','Sms').then(res=>{
      		this.$message(res.data.message)
          if(res.data.result==true){
      			this.dialogFlag.ReasonisOpen=false;
      			this.getdelivery();

          }
        })
      },
    	//清除筛选条件
      colseScreen(){
       this.pagefilters.methodId='';
       this.statuss=this.pagefilters.status;
      // this.pagefilters.status='01';
       this.pagefilters.batchId='';
       this.pagefilters.addStartTime='';
       this.pagefilters.startDate='';
       this.pagefilters.addEndTime='';
       this.pagefilters.endDate='';
      },
     getNowTime(){
      var now=new Date();
      var year=now.getFullYear();
      var month=now.getMonth()+1;
      var date=now.getDate();
      var hour = now.getHours();       //获取当前小时数(0-23)
      var minutes = now.getMinutes();     //获取当前分钟数(0-59)
      var seconds = now.getSeconds();     //获取当前秒数(0-59)
      var millise = now.getMilliseconds();    //获取当前毫秒数(0-999)
      //console.log(year+month+date+hour+minutes+seconds+millise)
      month =  month >= 10 ? month : '0'+month;
      date =  date >= 10 ? date : '0'+date;
      hour =  hour >= 10 ? hour : '0'+hour;
      minutes =  minutes >= 10 ? minutes : '0'+minutes;
      seconds =  seconds >= 10 ? seconds : '0'+seconds;
      return year+ '-'+month+'-'+date;
    },
    	getCustomer(val){
        this.dialogFlag.AddresseeisOpen=true;

    /*		this.httpPost('shipmentBatch/queryCustomer?parcelId='+val.parcelId).then(res=>{
    		    if(res.data != '' && res.data!=null){
              this.CustomerForm=res.data;
            }
        })*/
      },
      getdeliverydetails(row){
    		console.log('row % 0',row)
        this.rowBatchId=row.Batch_Id;
        this.waveForm.batch.Batch_Id=row.Batch_Id;
        this.waveForm.batch.methods=row.Cn_Name;
        this.waveForm.batch.Add_User=row.Add_User;
        this.waveForm.batch.parcelCount=row.parcelCount;
        this.waveForm.batch.orderCount=row.orderCount;
        this.waveForm.batch.productCount=row.productCount;
        this.waveForm.batch.completeParcelCount=row.completeParcelCount;
        this.waveForm.batch.Add_Time=row.Add_Time;
        this.getdelivery();
       /* this.httpGet('shipmentBatch/query?batchId='+row.Batch_Id,'','Sms').then(res=>{
            /!*	if(res.data.batch!=null && res.data.batch!=''){
               this.waveForm=res.data.batch;
               console.log('this.waveForm % 0',this.waveForm)
              }*!/
              if(res.data.pacelList!=[]){
            		this.waveForm.parcelList=res.data.pacelList;
              }else{
                this.waveForm.parcelList=[];
              }
            console.log('this.waveForm % 0',this.waveForm)
        })*/
      },
      getdelivery(){
        this.httpGet('shipmentBatch/query?batchId='+this.rowBatchId,'','Sms').then(res=>{
          if(res.data.pacelList!=[]){
            this.waveForm.parcelList=res.data.pacelList;
          }else{
            this.waveForm.parcelList=[];
          }
          console.log('this.waveForm % 0',this.waveForm)
        })
      },
      screensubmit(){
      	this.pagefilters.status=this.statuss;
        this.getdeliveryList();
      },
      getTime:function(val){
        //alert(val.titleName)
        val.type == 'start' &&  val.titleName == '生成日期'? this.pagefilters.addStartTime = val.value : val.type == 'start' &&  val.titleName == '完成日期' ? this.pagefilters.startDate = val.value:'';
        val.type == 'end'   &&  val.titleName == '生成日期'? this.pagefilters.addEndTime = val.value : val.type == 'end' &&  val.titleName == '完成日期' ? this.pagefilters.endDate = val.value:'';
      },
      //物流方式
      getLogistics(){
        this.httpPost('partsApply/loadLogistics?whId='+this.pagefilters.whId) .then(res=>{
          this.LogisticsArr=res.data;
        })},
      handleChange(val){
        console.log('this.val==',val)
        this.batchId=[];
        val.forEach(item=>{this.batchId.push(item.Batch_Id)});
        console.log('this.batchId ==',this.batchId)
      },
      //退回波次
      returnList(val){
        var batchIds=[],vm=this;
        vm.parcelId=val.Parcel_Id;
        val == '' ? batchIds=vm.batchId : batchIds.push(val.Batch_Id);
        batchIds.length < 1 ? vm.tips() : vm.doItem('您确定退回此发货波次？','shipmentBatch/returnAll',batchIds,vm.getdeliveryList);
      },

      // 导入
      downDown:function(url){
        window.open(url);
      },
      handExcChange(file,fileList){
        this.excName = file.name;
        this.excList = fileList;
        console.log('this.excName % 0==',this.excName)
      },
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        var url = 'initStock/import';
        this.httpPost(url,data).then(res => {
          if(res.data.result == true){
            this.$message(res.data.message);
            this.dialogFlag.isOpenLead = false;
            this.excFile=[];
            this.getdeliveryList();
          }else{
            if(res.data.params.errorList.length <= 0){
              this.$message(res.data.message);
            }else{
              this.dialogFlag.isOpen=true;
              this.DataList=res.data.params.errorList;
            }

          }
        })
      },
      //进入页面
      getdeliveryList(){
                 this.httpPost('shipmentBatch/list',this.pagefilters,'Sms').then(res=>{
                 	if(res.data.listData!=[] && res.data.listData!=null){
                    this.deliveryData=res.data.listData;
                  }else{
                    this.deliveryData=[];
                  }
                   this.page=res.data;
                 })
      },
      //仓库
      getChildren(data){
        data.type === '波次Id'? this.pagefilters.batchId = data.value : '';
        if(data.type ==='house'){
          this.pagefilters.whId=data.value;
          this.getdeliveryList();
        }
      },
      getHouse(data){
        var valarr=data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
        this.getdeliveryList();
      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getdeliveryList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getdeliveryList();
      },

    }
  }

</script>

<style scoped>
.fontRed{
  color:red;
}

</style>
