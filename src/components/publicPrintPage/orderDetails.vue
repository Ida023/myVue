<template>
    <div id="outermost_wrap">
      <el-row class="header">
        <el-col class="header-left logo" :span="8"></el-col>
        <el-col :span="8" style="text-align: center;"><span class="titleName">订单详情</span></el-col>
      </el-row>
      <el-row class="main" style=" display: inline-block">
        <div  style="padding: 10px;">
         <div style="padding: 10px;border: 1px solid #dfe6ec; margin: 10px 0;">
           <el-tag type="gray" >标签二</el-tag>
         </div>
          <div style="position: absolute;right: 20px;z-index: 9999;margin-top: 7px;">
            <el-tooltip content="可编辑"   effect="dark" placement="bottom" v-if="editMsgAll==true">
            <i  class="iconfontyyy Astyel"  content="Bottom center" @click="changeEdit();">&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip content="不可编辑"   effect="dark" placement="bottom" v-if="editMsgAll==false" >
              <i  class="iconfontyyy "   content="Bottom center" @click="changeNoEdit();">&#xe6e5;</i>
            </el-tooltip>
          </div>
          <el-tabs v-model="activeName" @tab-click="tabClick" type="border-card"  >
            <el-tab-pane label="基本信息" name="1">
              <!--订单信息-->
              <el-form :labelWidth="formlabelWidth" :model="msgForm.orderInfo" class="formBottom" ref="msgForm.orderInfo">
                <el-col>
                  <span style="font-weight: bold;font-size: 18px;">订单信息</span>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="editMsg==false && editMsgAll == true">
                    <i class=" iconfontyyy " @click="editMsg = true;">&#xe6e5;</i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="保存" placement="top-start" v-if="editMsg==true && editMsgAll == true">
                    <i class="iconfontyyy" @click="submitMsgform();">&#xe613;</i>
                  </el-tooltip>
                </el-col>
                <el-form-item label="系统订单编号：" prop="orderNo">
                  {{msgForm.orderInfo.orderNo}}
                </el-form-item>
                <el-form-item label="平台订单编号：" prop="shopOrderId" :rules="[{required:sourceType!='0'?false:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editMsg==false ">{{msgForm.orderInfo.shopOrderId}}</span>
                    <el-col  v-if="editMsg==true ">
                      <el-input type="text" v-model="msgForm.orderInfo.shopOrderId"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="销售：" prop="salesUser" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editMsg==false ">{{msgForm.orderInfo.salesUserName}}</span>
                  <el-select class="input-Maginbottom" v-if="editMsg==true " v-model="msgForm.orderInfo.salesUser">
                    <el-option v-for="item in Salesoption" :label="item.userName" :key="item.userId"
                               :value="item.userId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="渠道：" prop="channelId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editMsg==false ">{{msgForm.orderInfo.channelName}}</span>
                  <el-select class="input-Maginbottom" v-if="editMsg==true " v-model="msgForm.orderInfo.channelId" @change="getAccoun(msgForm.orderInfo.channelId);getsales(msgForm.orderInfo.channelId);" >
                    <el-option v-for="item in Channeloption" :label="item.channelName" :key="item.channelId"
                               :value="item.channelId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="店铺账号：" prop="accountId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editMsg==false ">{{msgForm.orderInfo.accountNo}}</span>
                  <el-select class="input-Maginbottom"  v-model="msgForm.orderInfo.accountId" v-if="editMsg==true " @change="getSite(msgForm.orderInfo.accountId)" >
                    <el-option v-for="item in Accountoption" :label="item.accountNo" :key="item.accountId"
                               :value="item.accountId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="市场/站点：" prop="countryNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editMsg==false ">{{msgForm.orderInfo.countryNo}}</span>
                  <el-select class="input-Maginbottom" v-if="editMsg==true " v-model="msgForm.orderInfo.countryNo">
                    <el-option v-for="item in Siteoption" :label="item.countryName" :key="item.countryNo"
                               :value="item.countryNo"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="金额：" prop="totalAmount" required :rules="[{required:true, type:'number', message:'不能为空',trigger:'change'}]">
                  <el-col :span="18">
                    <span v-if="editMsg==false ">{{msgForm.orderInfo.totalAmount}}</span>
                    <el-col :span="2" style="margin-right:5px;" v-if="editMsg==true ">
                      <el-input type="number" v-model.number="msgForm.orderInfo.totalAmount"></el-input>
                    </el-col>
                    <el-col :span="2">
                      <el-select class="input-Maginbottom" v-if="editMsg==true " v-model="msgForm.orderInfo.currencyId">
                        <el-option v-for="item in Currencyoptions" :label="item.cnName" :key="item.cnName"
                                   :value="item.currencyId"></el-option>
                      </el-select>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="付款方式：" prop="payType" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editMsg==false ">{{msgForm.orderInfo.payType=='1'?'PayPal':msgForm.orderInfo.payType=='2'?'银行转账':msgForm.orderInfo.payType=='3'?'现金':''}}</span>
                  <el-select class="input-Maginbottom" v-if="editMsg==true " v-model="msgForm.orderInfo.payType">
                    <el-option v-for="item in payTypeoptions" :label="item.label" :key="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <!--客户信息-->
              <el-form :labelWidth="formlabelWidth" :model="msgForm.orderCustomer" ref="msgForm.orderCustomer" class="formBottom borderTop">
                <el-col>
                  <span style="font-weight: bold;font-size: 18px;">客户信息</span>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="editCustomer==false && editMsgAll == true">
                    <i class=" iconfontyyy " @click="editCustomer = true;">&#xe6e5;</i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="保存" placement="top-start" v-if="editCustomer==true && editMsgAll == true">
                    <i class="iconfontyyy" @click="submitorderCustomer();">&#xe613;</i>
                  </el-tooltip>
                </el-col>
                <el-form-item label="客户ID：" prop="customerId" >
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.customerId}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.customerId"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="姓名：" prop="customerName" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.customerName}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.customerName"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="收件人姓名：" prop="recipient" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.recipient}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.recipient"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="地址1：" prop="address1" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.address1}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.address1"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="地址2：" prop="address2" >
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.address2}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.address2"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="地址3：" prop="address3" >
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.address3}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.address3"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="城市：" prop="city" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.city}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.city"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="州：" prop="state" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.state}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.state"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="街道：" prop="district" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.district}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.district"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="国家：" prop="countryNo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editCustomer==false ">{{msgForm.orderCustomer.countryName}}</span>
                  <el-select class="input-Maginbottom"  v-model="msgForm.orderCustomer.countryNo" v-if="editCustomer==true ">
                    <el-option v-for="item in Countryoptions" :label="item.cnName" :key="item.cnName"
                               :value="item.countryNo"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮编：" prop="postCode" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.postCode}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.postCode"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.phone}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.phone"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
                <el-form-item label="客户邮箱：" prop="customerEmail" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <el-col :span="3">
                    <span v-if="editCustomer==false ">{{msgForm.orderCustomer.customerEmail}}</span>
                    <el-col  v-if="editCustomer==true ">
                      <el-input type="text" v-model="msgForm.orderCustomer.customerEmail"></el-input>
                    </el-col>
                  </el-col>
                </el-form-item>
              </el-form>
              <!--各类时间-->
              <el-form :labelWidth="formlabelWidth" :model="msgForm.orderInfo" class="formBottom borderTop">
                <h4>各类时间</h4>
                <el-form-item label="下单时间：" prop="orderTime">
                  <span v-if="msgForm.orderInfo.orderTime!=''">
                                    {{tool.formatDate('','',msgForm.orderInfo.orderTime)}}
                  </span>
                </el-form-item>
                <el-form-item label="付款时间：" prop="payTime">
                  <span v-if="msgForm.orderInfo.payTime!=''">
                                      {{tool.formatDate('','',msgForm.orderInfo.payTime)}}

                  </span>
                </el-form-item>
                <el-form-item label="系统同步时间：" prop="syncTime">
                  <span v-if="msgForm.orderInfo.syncTime!=''">
                                      {{tool.formatDate('','',msgForm.orderInfo.syncTime)}}

                  </span>
                </el-form-item>
              </el-form>
              <!--交易信息-->
              <el-form :labelWidth="formlabelWidth" :model="msgForm.payInfo"  class="formBottom borderTop">
                <h4>交易时间</h4>
                <el-form-item label="交易方式：" prop="payType">
                  {{msgForm.payInfo.payType}}
                </el-form-item>
                <el-form-item label="交易类型：" prop="tradingType">
                   {{msgForm.payInfo.tradingType}}
                </el-form-item>
                <el-form-item label="交易金额：" prop="amount">
                   {{msgForm.payInfo.amount}}
                </el-form-item>
                <el-form-item label="交易手续费：" prop="handlingCost">
                   {{msgForm.payInfo.handlingCost}}
                </el-form-item>
                <el-form-item label="交易流水号：" prop="flowId">
                   {{msgForm.payInfo.flowId}}
                </el-form-item>
                <el-form-item label="交易时间：" prop="">
                  <span v-if="msgForm.payInfo.payTime!='' || msgForm.payInfo.boundedTime!=''">
                    {{tool.formatDate(msgForm.payInfo.payTime) }}/{{tool.formatDate(msgForm.payInfo.boundedTime )}}
                  </span>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="物品信息" name="2">
              <el-col style="margin-bottom: 5px"><span>平台商品信息</span>&nbsp;&nbsp;
                <el-col style="text-align: center">
                  <span  :class="[goodsStyle == '1' ? 'Astyel':'Cstyel']" @click="goodsTable='1';getGoodsData('1');">Amazon</span>&nbsp;&nbsp;
                  <span :class="[goodsStyle == '2' ? 'Astyel':'Cstyel']" @click="goodsTable='2';getGoodsData('2');">eBay</span>&nbsp;&nbsp;
                  <span :class="[goodsStyle == '3' ? 'Astyel':'Cstyel']" @click="goodsTable='3';getGoodsData('3');">AliExpress</span>
                </el-col>
              </el-col>
              <div >
                <!--Amazon-->
                <div class="table_padding">
                  <el-table  :data="itemInformation.esbItems"  border  tooltip-effect="dark" v-if="goodsTable==='1'">
                    <el-table-column label="商品描述" width="" prop="title"  sortable align="center"></el-table-column>
                    <el-table-column label="ASIN" width="" prop="asin"  sortable align="center"></el-table-column>
                    <el-table-column label="MSKU" width="" prop="shippmentDate"  sortable align="center"></el-table-column>
                    <el-table-column label="FNSKU" width="" prop="shippmentDate"  sortable align="center"></el-table-column>
                    <el-table-column label="数量" width="" prop="quantityOrdered"  sortable align="center"></el-table-column>
                    <el-table-column label="成家价" width="" prop="itemPriceAmount"  sortable align="center"></el-table-column>
                    <!--    <el-table-column label="平台手续费"  prop="shippmentDate"  sortable align="center">
                          <template scope="scope">
                            <el-input type="text" style="width: 77%"></el-input>
                            <i class="iconfontyyy">&#xe613;</i>
                          </template>
                        </el-table-column>
                        <el-table-column label="FBA费用"  prop="shippmentDate"  sortable align="center" >
                          <template scope="scope">
                            <el-input type="text" style="width: 77%"></el-input>
                            <i class="iconfontyyy">&#xe613;</i>
                          </template>
                        </el-table-column>-->
                  </el-table>
                </div>
                <!--eBay-->
                <div class="table_padding">
                  <el-table  :data="itemInformation.esbItems"  border  tooltip-effect="dark"  v-if="goodsTable==='2'">
                    <el-table-column label="EAN" width="" prop="imageUrl"  sortable align="center">
                      <template scope="scope">
                        <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="scope.row.imageUrl"/>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品描述" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
                    <el-table-column label="Item No." width="" prop="esbItemId"  sortable align="center"></el-table-column>
                    <el-table-column label="Seller SKU" width="" prop="esbItemSku"  sortable align="center"></el-table-column>
                    <el-table-column label="数量" width="" prop="productsQty"  sortable align="center"></el-table-column>
                    <el-table-column label="成家价" width="" prop="esbItemSalePrice"  sortable align="center"></el-table-column>
                    <!--   <el-table-column label="平台手续费"  prop="shippmentDate"  sortable align="center">
                         <template scope="scope">
                           <el-input type="text" style="width: 77%"></el-input>
                           <i class="iconfontyyy">&#xe613;</i>
                         </template>
                       </el-table-column>
                       <el-table-column label="PP费用"  prop="shippmentDate"  sortable align="center" >
                         <template scope="scope">
                           <el-input type="text" style="width:77%"></el-input>
                           <i class="iconfontyyy">&#xe613;</i>
                         </template>
                       </el-table-column>-->
                  </el-table>
                </div>
                <!--AliExpress-->
                <div class="table_padding">
                  <el-table  :data="itemInformation.esbItems"  border  tooltip-effect="dark" v-if="goodsTable==='3'">
                    <el-table-column label="EAN" width="" prop="productImageUrl"  sortable align="center">
                      <template scope="scope">
                        <img v-if="scope.row.productImageUrl!=null" style="width: 70px; height: 70px;" :src="scope.row.productImageUrl"/>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品描述" width="" prop="productName"  sortable align="center"></el-table-column>
                    <el-table-column label="Item No." width="" prop="productId"  sortable align="center"></el-table-column>
                    <el-table-column label="Seller SKU" width="" prop="skuCode"  sortable align="center"></el-table-column>
                    <el-table-column label="数量" width="" prop="productCount"  sortable align="center"></el-table-column>
                    <el-table-column label="成家价" width="" prop="productUnitPrice"  sortable align="center"></el-table-column>
                    <!-- <el-table-column label="平台手续费"  prop="shippmentDate"  sortable align="center">
                       <template scope="scope">
                         <el-input type="text" style="width: 77%"></el-input>
                         <i class="iconfontyyy">&#xe613;</i>
                       </template>
                     </el-table-column>
                     <el-table-column label="PP费用"  prop="shippmentDate"  sortable align="center" >
                       <template scope="scope">
                         <el-input type="text" style="width:77%"></el-input>
                         <i class="iconfontyyy">&#xe613;</i>
                       </template>
                     </el-table-column>-->
                  </el-table>
                </div>
              </div>
              <el-col style="margin-bottom: 5px"><span>系统商品信息</span>&nbsp;&nbsp;
              </el-col>
              <div >
                <el-table  :data="itemInformation.items"  border tooltip-effect="dark"    style="width:100%;">
                  <el-table-column label="图片"  prop="imageUrl"  sortable align="center">
                    <template scope="scope">
                      <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="scope.row.imageUrl"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品名称"  prop="productName"  sortable align="center">
                  </el-table-column>
                  <el-table-column label="SKU"  prop="skuNo"  sortable align="center"></el-table-column>
                  <el-table-column label="尺寸"  prop=""  sortable align="center">
                    <template scope="scope">
                      <span>{{scope.row.productLength}}*{{scope.row.productWidth}}*{{scope.row.productHeight}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量"  prop="salesQty"  sortable align="center"></el-table-column>
                  <el-table-column label="净重"  prop="productWeight"  sortable align="center"></el-table-column>
                  <el-table-column label="毛重"  prop="productWeight"  sortable align="center">
                  </el-table-column>
                  <el-table-column label="到仓成本"  prop="toWarehouseCost"  sortable align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="物流跟踪" name="3">
              <el-form :labelWidth="formlabelWidth" ref="logisticsForm" :model="logisticsForm" class="formBottom borderTop">
                <el-col>
                  <span style="font-weight: bold;font-size: 18px;">尾程信息</span>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="editWeiCheng==false && editMsgAll == true">
                    <i class=" iconfontyyy " @click="changeLogisticsForm();">&#xe6e5;</i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="保存" placement="top-start" v-if="editWeiCheng==true && editMsgAll == true">
                    <i class="iconfontyyy" @click="submitlogisticsForm();">&#xe613;</i>
                  </el-tooltip>
                </el-col>
                <el-form-item label="客户制定物流方式：" prop="freightCost">
                  <el-col :span="3">
                    <span>{{logisticsForm.logsticsPlatformCode}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="平台运费：" prop="freightCost" >
                    <el-col :span="18">
                      <span v-if="editWeiCheng==false ">{{logisticsForm.freightCost}}</span>
                      <el-col :span="2" style="margin-right:5px;" v-if="editWeiCheng==true ">
                        <el-input v-model="logisticsForm.freightCost"></el-input>
                      </el-col>
                      <el-col :span="2" v-if="editWeiCheng==true ">
                        <el-select class="input-Maginbottom" v-if="editMsg==true " v-model="msgForm.orderInfo.currencyId">
                          <el-option v-for="item in Currencyoptions" :label="item.cnName" :key="item.cnName"
                                     :value="item.currencyId"></el-option>
                        </el-select>
                      </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="发货仓库：" prop="whId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editWeiCheng==false ">{{logisticsForm.whName}}</span>
                  <el-select class="input-Maginbottom" v-model="logisticsForm.whId" @change="getLogisticsMethod(logisticsForm.whId)" v-if="editWeiCheng==true ">
                    <el-option v-for="item in warehouseoptions" :label="item.whName" :key="item.whId"
                               :value="item.whId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="物流方式：" prop="logisticsMethod" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
                  <span v-if="editWeiCheng==false ">{{logisticsForm.logisticsMethodName}}</span>
                  <el-select class="input-Maginbottom" v-model="logisticsForm.logisticsMethod"  v-if="editWeiCheng==true ">
                    <el-option v-for="item in logisticsMethodoptions" :label="item.cnName" :key="item.methodId"
                               :value="item.methodId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="重量：" prop="totalWeight" >
                  <el-col :span="3">
                    <span >{{logisticsForm.totalWeight}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="估计运费：" prop="estimateTransportCost" >
                  <el-col :span="3">
                    <span >{{logisticsForm.estimateTransportCost}}</span>
                  <!--  <el-col  v-if="editWeiCheng==true ">
                      <el-input type="text" v-model="logisticsForm.logsticsPlatformCode"></el-input>
                    </el-col>-->
                  </el-col>
                </el-form-item>
                <el-form-item label="跟踪单号：" prop="trackingNo" >
                  <el-col :span="3">
                    <span v-if="editWeiCheng==false ">{{logisticsForm.trackingNo}}</span>
                   <!-- <el-col  v-if="editWeiCheng==true ">
                      <el-input type="text" v-model="logisticsForm.logsticsPlatformCode"></el-input>
                    </el-col>-->
                  </el-col>
                </el-form-item>
              </el-form>
              <h4>尾程跟踪</h4>
              <el-steps :space="100" direction="vertical" :active="3" center>
                <el-step v-for="item in logisticsForm.trackingList" :title="item.trackingContent" :description="item.trackingTime" icon="upload"></el-step>
              </el-steps>
            </el-tab-pane>
            <el-tab-pane label="售后" name="4">
              <el-tabs v-model="activeName2" @tab-click="salestabClick">
                <el-tab-pane label="重寄" name="1">
                  <el-form labelWidth="180px" :model="salesForm.selectByOrderId" class="formBottom ">
                    <h4>重寄信息</h4>
                    <el-form-item label="重寄仓库：" prop="whName">
                      {{salesForm.selectByOrderId.whName}}
                    </el-form-item>
                    <el-form-item label="物流方式：" prop="logisticsMethodName">
                      {{salesForm.selectByOrderId.logisticsMethodName}}
                    </el-form-item>
                    <el-form-item label="重寄原因：" prop="rmaDesc">
                      {{salesForm.selectByOrderId.rmaDesc}}
                    </el-form-item>
                    <el-form-item label="重寄选项：" prop="redirectOption">
                      {{salesForm.selectByOrderId.redirectOption=='0'?'先退件':salesForm.selectByOrderId.redirectOption=='1'?'先重寄':''}}
                    </el-form-item>
                    <el-form-item label="是否需要退件：" prop="returnOption">
                      <span>{{salesForm.selectByOrderId.returnOption=='0'?'不需要退件':salesForm.selectByOrderId.returnOption=='1'?'部分退件':salesForm.selectByOrderId.returnOption=='2'?'完全退件':''}}</span>
                      <span @click="dialogFlag.Returnisopen=true;getReturnForm('重寄');" class="Astyel">查看详情>></span>
                    </el-form-item>
                    <el-form-item label="图片：" prop="attachUrls" class="picHover" >
                      <el-upload  list-type="picture-card" drag  class="disabledImg"  :file-list="salesForm.selectByOrderId.attachUrls" accept=".jpg,.jpeg,.png" >
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="备注：" prop="memo">
                      {{salesForm.selectByOrderId.memo}}
                    </el-form-item>
                    <el-form-item label="重寄订单状态：" prop="status">
                      {{salesForm.selectByOrderId.status}}
                    </el-form-item>
                    <h4>新订单信息</h4>
                    <el-form-item label="新订单编号：" prop="newOrderId">
                      {{salesForm.selectByOrderId.newOrderId}}
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="退款" name="2">
                  <el-form labelWidth="180px" :model="salesForm.Refundselect" class="formBottom ">
                    <h4>退款信息</h4>
                    <el-form-item label="退款原因：" prop="rmaDesc">
                      {{salesForm.Refundselect.rmaDesc}}
                    </el-form-item>
                    <el-form-item label="全部/部分退款：" prop="refundOption">
                      {{salesForm.Refundselect.refundOption == 1 ?'部分退款': salesForm.Refundselect.refundOption== 0 ? '全部退款':''}}
                      {{Number(salesForm.Refundselect.refundAmount)*Number(salesForm.Refundselect.currencyRate)}}
                      {{salesForm.Refundselect.currencyId}}
                    </el-form-item>
                    <el-form-item label="是否已发货：" prop="">
                      {{salesForm.Refundselect.isShipped=='0'?'否':salesForm.Refundselect.isShipped=='1'?'是':''}}
                    </el-form-item>
                    <el-form-item label="是否需要退件：" prop="returnOption">
                      {{salesForm.Refundselect.returnOption=='0'?'不需要':salesForm.Refundselect.returnOption=='1'?'部分退件':salesForm.Refundselect.returnOption=='2'?'完全退件':''}}
                      <span @click="dialogFlag.Returnisopen=true;getReturnForm('退款');" class="Astyel">查看详情>></span>
                    </el-form-item>
                    <el-form-item label="退款方式：" prop="">
                      <span> {{salesForm.Refundselect.refundMethod =='1'?'PayPal':salesForm.Refundselect.refundMethod =='2'?'银行转账': salesForm.Refundselect.refundMethod =='3'?'现金':''}}</span><br>
                      <span v-if="salesForm.Refundselect.refundMethod=='1'"> {{salesForm.Refundselect.tradingAccount}}</span><br>
                      <span v-if="salesForm.Refundselect.refundMethod=='1'"> {{salesForm.Refundselect.tradingNo}}</span>
                    </el-form-item>
                    <el-form-item label="图片：" prop="attachUrls" class="picHover">
                      <el-upload   class="disabledImg" list-type="picture-card" drag :file-list="salesForm.Refundselect.attachUrls"  accept=".jpg,.jpeg,.png" >
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="退款备注：" prop="memo">
                      {{salesForm.Refundselect.memo}}
                    </el-form-item>
                    <el-form-item label="退款订单状态：" prop="status">
                      {{salesForm.Refundselect.status}}
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="配件" name="3">
                  <el-form labelWidth="180px" :model="salesForm.accessoryInfo" class="formBottom ">
                    <h4>退件信息</h4>
                    <el-form-item label="配件：">
                      <el-col :span="8">
                        <el-table class="table_padding" :data="salesForm.accessoryInfo.items"  border  tooltip-effect="dark"  >
                          <el-table-column label="SKU"        prop="skuNo" align="center"  sortable  ></el-table-column>
                          <el-table-column label="SKU数量"     prop="skuQty" align="center"  sortable  >
                            <template scope="scope">
                              <el-input type="text" v-model="scope.row.skuQty" style="width: 80%"></el-input>
                              <i class="iconfontyyy">&#xe613;</i>
                            </template>
                          </el-table-column>
                          <el-table-column label="配件数量"      prop="reqQty" align="center"  sortable  >
                            <template scope="scope">
                              <el-input type="text"  v-model="scope.row.reqQty" style="width: 80%"></el-input>
                              <i class="iconfontyyy">&#xe613;</i>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="仓库：" prop="whName">
                      {{salesForm.accessoryInfo.whName}}
                    </el-form-item>
                    <el-form-item label="图片：" prop="attachUrls" class="picHover">
                      <el-upload  class="disabledImg" list-type="picture-card" drag :file-list="salesForm.accessoryInfo.attachUrls"  accept=".jpg,.jpeg,.png" >
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="配件申请备注：" prop="reqMemo">
                      {{salesForm.accessoryInfo.reqMemo}}
                    </el-form-item>
                    <el-form-item label="配件状态：" prop="whStatusName">
                      {{salesForm.accessoryInfo.whStatusName}}
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="待补单" name="4">
                  <el-form labelWidth="180px" :model="salesForm.orderReturn" class="formBottom ">
                    <h4>退件信息</h4>
                    <el-form-item label="退件：">
                      <el-col :span="10">
                        <el-table class="table_padding" :data="salesForm.orderReturn.returnItems"  border  tooltip-effect="dark"  >
                          <el-table-column label="图片"        prop="imageUrl" align="center"  sortable  >
                            <template scope="scope">
                              <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="scope.row.imageUrl"/>
                            </template>
                          </el-table-column>
                          <el-table-column label="商品名称"     prop="productName" align="center"  sortable  >
                          </el-table-column>
                          <el-table-column label="SKU"      prop="skuNo" align="center"  sortable  >
                          </el-table-column>
                          <el-table-column label="尺寸"      prop="parcelNo" align="center"  sortable  >
                            <template scope="scope">
                              {{scope.row.productLength}}*{{scope.row.productWidth}}*{{scope.row.productHeight}}
                            </template>
                          </el-table-column>
                          <el-table-column label="数量"      prop="qty" align="center"  sortable  >
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="图片：" prop="attachUrls" class="picHover">
                      <el-upload  class="disabledImg" list-type="picture-card" drag :file-list="salesForm.orderReturn.attachUrls"  accept=".jpg,.jpeg,.png" >
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="退件备注：" prop="memo">
                      {{salesForm.orderReturn.memo}}
                    </el-form-item>
                    <el-form-item label="退件状态：" prop="status">
                      {{salesForm.orderReturn.status}}
                    </el-form-item>
                    <el-form-item label="操作：">
                      <span class="Astyel" v-if="allowRefund=='1'"   @click="refundApplication();">补退款申请</span>&nbsp;&nbsp;&nbsp;
                      <span class="Astyel" v-if="allowRedirect=='1'"  @click="getChildForm()">补重寄申请</span>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          <!--  <el-tab-pane label="利润" name="5">
              <el-tabs v-model="activeName3" @tab-click="profitTabClick">
                <el-tab-pane label="财务版" name="1">
                  <el-radio-group >
                    <el-radio :label="3">
                      按下单汇率计算：1 HKD=0.900000000 CNY   1 EUR=10.00000000 CNY
                    </el-radio>
                    <el-radio :label="3">
                      按当前汇率计算：1 HKD=0.900000000 CNY   1 EUR=10.00000000 CNY
                    </el-radio>
                  </el-radio-group>
                  <el-row style="text-align: right">
                    <el-tooltip content="补充费用"  effect="dark" placement="bottom" >
                      <i  class="iconfontyyy" @click="dialogFlag.CostisOpen=true;" content="Bottom center">&#xe623;</i>
                    </el-tooltip>
                    <el-tooltip content="删除费用"  effect="dark" placement="bottom" >
                      <i  class="iconfontyyy" @click="deleteCost();" content="Bottom center">&#xe6f7;</i>
                    </el-tooltip>
                  </el-row>
                  <table class="salesTable">
                    <thead>
                    <tr>
                      <th>段</th>
                      <th>类别</th>
                      <th>计算公式</th>
                      <th>金额</th>
                      <th>汇率</th>
                      <th>折合人民币</th>
                    </tr>
                    </thead>
                    <tbody>
                    &lt;!&ndash;<tr v-for="(item,index) in Data.listData">
                      <td :rowspan="index == '0' ? Data.listData.length : ''">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.money}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td v-if="index == '0'">{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData2">
                      <td >{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData3">
                      <td :rowspan="index == '0' ? Data.listData3.length : ''">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.money}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td v-if="index == '0'">{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData4">
                      <td colspan="2">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td colspan="3">{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData5">
                      <td :rowspan="index == '0' ? Data.listData.length : ''">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.money}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td v-if="index == '0'">{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData6">
                      <td colspan="2">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td colspan="3">{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData7">
                      <td >{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                      <td >{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData8">
                      <td colspan="2">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td colspan="3">{{item.type}}</td>
                    </tr>
                    <tr v-for="(item,index) in Data.listData9">
                      <td colspan="2">{{item.id}}</td>
                      <td >{{item.type}}</td>
                      <td colspan="3">{{item.type}}</td>
                    </tr>&lt;!&ndash;dash;&gt;
                    <tr>
                     <td data-label="深圳段" rowspan="4">深圳段</td>
                     <td data-label="类别">1.采购价</td>
                     <td data-label="计算公式">A采购单价*m+B采购单价*n</td>
                     <td data-label="金额" >{{salesAmount.salesCost.purchaseCost}}</td>
                     <td data-label="汇率" >-&#45;&#45;</td>
                     <td data-label="折合人民币" >-&#45;&#45;</td>
                   </tr>
                  <tr>
                     <td data-label="开发费用">2.开发费用</td>
                     <td data-label="类别">(A采购单价*m+B采购单价*n)*0.35%</td>
                     <td data-label="周期">{{salesAmount.salesCost.developCost}}</td>
                     <td data-label="周期">-&#45;&#45;</td>
                     <td data-label="周期">-&#45;&#45;</td>
                   </tr>
                   <tr>
                     <td data-label="开发费用">3.采购费用</td>
                     <td data-label="类别">(A采购单价*m+B采购单价*n)*0.10%</td>
                     <td data-label="金额" >{{salesAmount.salesCost.purchaseFee}}</td>
                     <td data-label="汇率" >-&#45;&#45;</td>
                     <td data-label="折合人民币" >-&#45;&#45;</td>
                   </tr>
                   <tr>
                     <td data-label="开发费用">4.深圳仓管理</td>
                     <td data-label="类别">(A采购单价*m+B采购单价*n)*8.00%</td>
                     <td data-label="金额" >{{salesAmount.salesCost.warehouseFee}}</td>
                     <td data-label="汇率" >-&#45;&#45;</td>
                     <td data-label="折合人民币" >-&#45;&#45;</td>
                   </tr>
                   <tr>
                     <td data-label="深圳段" >头程</td>
                     <td data-label="日期">5.头程运费</td>
                     <td data-label="金额">AB产品对应备货子ID所属调拨费用分摊</td>
                     <td data-label="金额">{{salesAmount.salesCost.transportCost}}HKD</td>
                     <td data-label="汇率" >1HKD=0.90000000CNY</td>
                     <td data-label="折合人民币" >1.8000CNY</td>
                   </tr>
                    <tr>
                      <td data-label="海外段" rowspan="4">海外段</td>
                      <td data-label="类别">6.Duty</td>
                      <td data-label="计算公式">AB产品对应备货子ID所属调拨费用分摊</td>
                      <td data-label="金额" >{{salesAmount.salesCost.dutyCost}}HKD</td>
                      <td data-label="汇率" >1HKD=0.90000000CNY</td>
                      <td data-label="折合人民币" >1.8000CNY</td>
                    </tr>
                    <tr>
                      <td data-label="类别">7.VAT</td>
                      <td data-label="计算公式">AB产品对应备货子ID所属调拨费用分摊</td>
                      <td data-label="金额" >{{salesAmount.salesCost.vatCost}}HKD</td>
                      <td data-label="汇率" >1HKD=0.90000000CNY</td>
                      <td data-label="折合人民币" >1.8000CNY</td>
                    </tr>
                    <tr>
                      <td data-label="类别">8.海外仓其他</td>
                      <td data-label="计算公式">AB产品对应备货子ID所属调拨费用分摊/td>
                      <td data-label="金额" >{{salesAmount.salesCost.otherFee}}HKD</td>
                      <td data-label="汇率" >1HKD=0.90000000CNY</td>
                      <td data-label="折合人民币" >1.8000CNY</td>
                    </tr>
                    <tr>
                      <td data-label="类别">9.海外仓管理</td>
                      <td data-label="计算公式">(A采购单价*m+B采购单价*n)*10.00%</td>
                      <td data-label="金额" >{{salesAmount.salesCost.warehouseFee2}}CNY</td>
                      <td data-label="汇率" >-&#45;&#45;</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="到仓成本" colspan="2">Ⅰ到仓成本</td>
                      <td data-label="计算公式">1+2+3+4+5+6+7+8+9</td>
                      <td data-label="周期" colspan="3">120.9CNY</td>
                    </tr>
                    <tr>
                      <td data-label="海外段" rowspan="6">销售段</td>
                      <td data-label="类别">10.成交手续费</td>
                      <td data-label="计算公式">该订单平台手续费（产生订单时同步）</td>
                      <td data-label="金额" >{{salesAmount.salesCost.tradingFee}}EUR</td>
                      <td data-label="汇率" >
                        1EUR=10.00000000CNY</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="类别">11.PayPal费</td>
                      <td data-label="计算公式">该订单PP费（产生订单时同步）</td>
                      <td data-label="金额" >{{salesAmount.salesCost.paypalFee}}EUR</td>
                      <td data-label="汇率" >
                        1EUR=10.00000000CNY</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="类别">12.FBA费用</td>
                      <td data-label="计算公式">该订单FBA费用（产生订单时同步）</td>
                      <td data-label="金额" >{{salesAmount.salesCost.fbaFee}}</td>
                      <td data-label="汇率" >-&#45;&#45;</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="类别">13.销售VAT</td>
                      <td data-label="计算公式">销售价格*VAT费率</td>
                      <td data-label="金额" >{{salesAmount.salesCost.salesVatFee}}EUR</td>
                      <td data-label="汇率" >
                        1EUR=10.00000000CNY</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="类别">14.尾程运费</td>
                      <td data-label="计算公式">该订单尾程运费</td>
                      <td data-label="金额" >{{salesAmount.salesCost.transportCost2}}EUR</td>
                      <td data-label="汇率" >
                        1EUR=10.00000000CNY</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="类别">15.售后费用</td>
                      <td data-label="计算公式">订单金额*2%</td>
                      <td data-label="金额" >{{salesAmount.salesCost.afterSalesFee}}EUR</td>
                      <td data-label="汇率" >
                        1EUR=10.00000000CNY</td>
                      <td data-label="折合人民币" >-&#45;&#45;</td>
                    </tr>
                    <tr>
                      <td data-label="到仓成本" colspan="2">Ⅱ销售成本</td>
                      <td data-label="计算公式">I(到仓成本)+10+11+12+13+14+15</td>
                      <td data-label="周期" colspan="3">120.9CNY</td>
                    </tr>
                    <tr>
                      <td data-label="到仓成本" colspan="2">销售额</td>
                      <td data-label="计算公式">I(到仓成本)+10+11+12+13+14+15</td>
                      <td data-label="周期" colspan="3">{{salesAmount.totalAmount}}CNY</td>
                    </tr>
                    <tr>
                      <td data-label="到仓成本" colspan="2">利润</td>
                      <td data-label="计算公式">订单金额-II</td>
                      <td data-label="周期" colspan="3">{{salesAmount.profitsAmount}}CNY</td>
                    </tr>
                    <tr>
                      <td data-label="利润率" colspan="2">利润率</td>
                      <td data-label="计算公式">利润/订单金额</td>
                      <td data-label="周期" colspan="3">{{salesAmount.profitsRate}}CNY</td>
                    </tr>
                    </tbody>
                  </table>
                </el-tab-pane>
                <el-tab-pane label="销售版" name="2">
                  <el-radio-group>
                    <el-radio :label="3">
                      按下单汇率计算：1 HKD=0.900000000 CNY   1 EUR=10.00000000 CNY
                    </el-radio>
                    <el-radio :label="3">
                      按当前汇率计算：1 HKD=0.900000000 CNY   1 EUR=10.00000000 CNY
                    </el-radio>
                  </el-radio-group>
                  <el-row style="text-align: right">
                    <el-tooltip content="补充费用"  effect="dark" placement="bottom" >
                      <i  class="iconfontyyy" @click="dialogFlag.CostisOpen=true;" content="Bottom center">&#xe623;</i>
                    </el-tooltip>
                    <el-tooltip content="删除费用"  effect="dark" placement="bottom" >
                      <i  class="iconfontyyy" @click="deleteCost();" content="Bottom center">&#xe6f7;</i>
                    </el-tooltip>
                  </el-row>
                  <table class="salesTable">
                    <thead>
                    <tr>
                      <th>类别</th>
                      <th>计算公式</th>
                      <th>金额</th>
                      <th>汇率</th>
                      <th>折合人民币</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>I.到仓成本</td>
                      <td>1+2+3+4+5+6+7+8+9</td>
                      <td colspan="3">{{selectOrder.toWarehouseCost}}CNY</td>
                    </tr>
                    <tr>
                      <td>II.销售成本</td>
                      <td>I(到仓成本)+10+11+12+13+14+15</td>
                      <td colspan="3">{{selectOrder.salesCost}}CNY</td>
                    </tr>
                    <tr>
                      <el-tooltip class="item" effect="dark" content="备注" placement="top"> <td class="textColor">成本（补充费用）</td></el-tooltip>
                      <td></td>
                      <td >{{selectOrder.otherCost}}CNY</td>
                      <td >{{selectOrder.otherCost}}CNY</td>
                      <td >{{selectOrder.otherCost}}CNY</td>
                    </tr>
                    <tr>
                      <td>销售额</td>
                      <td>订单金额</td>
                      <td >{{selectOrder.salesAmount}}CNY</td>
                      <td >{{selectOrder.salesAmount}}CNY</td>
                      <td >{{selectOrder.salesAmount}}CNY</td>
                    </tr>
                    <tr>
                      <td>利润</td>
                      <td>订单金额-II</td>
                      <td colspan="3">{{selectOrder.profitsAmount}}CNY</td>
                    </tr>
                    <tr>
                      <el-tooltip class="item" effect="dark" content="备注" placement="top"><td class="textColor">利润（补充费用）</td></el-tooltip>
                      <td></td>
                      <td >{{selectOrder.otherProfitsAmount}}CNY</td>
                      <td >{{selectOrder.otherProfitsAmount}}CNY</td>
                      <td >{{selectOrder.otherProfitsAmount}}CNY</td>
                    </tr>
                    <tr>
                      <td>利润率</td>
                      <td>利润/订单金额</td>
                      <td colspan="3">{{selectOrder.prifitsRate}}CNY</td>
                    </tr>
                    </tbody>
                  </table>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>-->
            <el-tab-pane label="日志" name="6">
              <el-table  :data="orderLogData"  border tooltip-effect="dark"    style="width:100%;">
                <el-table-column label="时间"  prop="logTime"  sortable :formatter="tool.formatDate"  align="center">

                </el-table-column>
                <el-table-column label="日志内容"  prop="logContent"  sortable align="center"></el-table-column>
                <el-table-column label="操作人"  prop="updUserName"  sortable align="center"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="备注" name="7">
              <el-row style="text-align: center">
                <span  :class="[noteStyle == '0' ? 'Astyel':'Cstyel']" @click="noteObj.isToWh=0;changeNoteStyle(0);">备注</span>&nbsp;&nbsp;
                <span :class="[noteStyle == '1' ? 'Astyel':'Cstyel']" @click="noteObj.isToWh=1;changeNoteStyle(1);">to仓库的备注</span>&nbsp;&nbsp;
              </el-row>
              <el-row style="text-align: right">
                <el-tooltip content="添加备注"  effect="dark" placement="bottom" >
                  <i  class="iconfontyyy" @click="dialogFlag.RemarkisOpen=true;" content="Bottom center">&#xe623;</i>
                </el-tooltip>
              </el-row>
              <el-row :span="24" class="noteDiv" v-if="dataNote!=[] && dataNote.length>0"  >
                <el-col :span="24" class="note">
                  <div v-for="(item,index) in dataNote" :key="item.updUser">
                    <div class="bottom clearfix deleteNote" >
                      <span v-if="item.isUse==false">已作废</span>
                      <el-tooltip content="删除"  effect="dark" placement="bottom" >
                        <i class="iconfontyyy" v-if="item.isUse==true"   @click="deleteNote('/orderNote/invalid',item);"   content="Bottom center">&#xe6f7;</i>
                      </el-tooltip>
                      <el-tooltip content="恢复"  effect="dark" placement="bottom" >
                        <i class="iconfontyyy" v-if="item.isUse==false"  @click="deleteNote('/orderNote/restore',item);" content="Bottom center">&#xe61c;</i>
                      </el-tooltip>
                    </div>
                    <span>{{item.updUser}}</span>
                    <time class="time">{{tool.formatDate('','',item.noteTime)}}</time>
                    <el-col class="noteText">{{item.noteContent}}</el-col>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="留言" name="8">
              <el-form labelWidth="100px" :model="CustomerMsg">
                <el-col v-for="item in CustomerMsg.orderCustomerMsg" :key="item.msgId">
                  <el-form-item label="客户留言" >
                    {{item.msgContent}}
                  </el-form-item>
                  <el-form-item label="客户时间">
                    {{tool.formatDate('','',item.msgTime)}}
                  </el-form-item>
                </el-col>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <router-view></router-view>
        </div>
      </el-row>
      <!--退件查看详情-->
      <el-dialog title="需退件详情"  :visible.sync="dialogFlag.Returnisopen" size="small" :close-on-click-modal="false"  @close="">
        <h4>退件物品详情:</h4>
        <el-form :model="ReturnForm" labelWidth="150px" class="formText" >
          <el-form-item label="" labelWidth="0" >
            <el-table :data="ReturnForm.returnItems"  border tooltip-effect="dark"  >
              <el-table-column label="图片"    prop="imageUrl" align="center"  sortable  >
                <template scope="scope">
                  <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="scope.row.Image_Url"/>
                </template>
              </el-table-column>
              <el-table-column label="商品名称"    prop="productName" align="center"  sortable  ></el-table-column>
              <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="尺寸"    prop="parcelNo" align="center"  sortable  >
                <template scope="scope">
                  {{scope.row.productLength}}*{{scope.row.productWidth}}*{{scope.row.productHeight}}
                </template>
              </el-table-column>
              <el-table-column label="数量"    prop="qty" align="center"  sortable  ></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="退回仓库" prop="whName">
            {{ReturnForm.whName}}
          </el-form-item>
          <el-form-item label="重寄需退回物品备注" prop="memo">
            {{ReturnForm.memo}}
          </el-form-item>
          <el-form-item label="仓库是否收到" prop="ReturnForm.isReceived">
            {{ReturnForm.isReceived=='0'?'否':ReturnForm.isReceived=='1'?'是':''}}
          </el-form-item>
          <el-form-item label="退件ID" prop="requestNo">
            {{ReturnForm.requestNo}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.Returnisopen =  false;">关 闭</el-button>
        </div>
      </el-dialog>
      <!--补退款申请-->
<!--
       <el-dialog title="退款"  :visible.sync="dialogFlag.refundisopen" size="tiny" :close-on-click-modal="false"  @close="">
     <el-form :model="refundForm" labelWidth="120px" >
       <el-form-item label="全部/部分退款：" >
         <el-radio-group v-model="refundForm.refundradio">
           <el-radio :label="1">退款申请</el-radio>
           <el-radio :label="2">直接退款</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="退款原因">
         <el-select v-model="refundForm.Reason" placeholder="请选择">
           <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="全部/部分退款：">
         <el-radio-group v-model="refundForm.allradio">
           <el-radio :label="1">全部退款</el-radio>
           <el-radio :label="2">部分退款</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="退款金额">
         <span>该订单的金额 {{refundForm.money}}</span>

       </el-form-item>
       <el-form-item label="是否已发货">
         <el-radio-group v-model="refundForm.isnoradio">
           <el-radio :label="1">全部退款</el-radio>
           <el-radio :label="2">部分退款</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="是否已完成退款">
         <el-radio-group v-model="refundForm.finishradio">
           <el-radio :label="1">全部退款</el-radio>
           <el-radio :label="2">部分退款</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="退款方式">
         <el-select v-model="refundForm.mode" placeholder="请选择">
           <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="图片">

       </el-form-item>
       <el-form-item label="退款备注">
        <el-input type="textarea"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFlag.refundisopen =  false;">取 消</el-button>
       <el-button @click="" type="primary" :loading="$store.state.loading">确 定</el-button>
     </div>
   </el-dialog>
-->
      <refunds-dialog ref="refundsDialog" :is-open="dialogFlag.refundisopen" :request-id-value="requestId" :id-value="orderId"></refunds-dialog>
      <!--重寄申请-->
      <el-dialog title="重寄申请"  :visible.sync="dialogFlag.Redirectisopen" size="small" :close-on-click-modal="false"  @close="">
        <apply-form  ref="redform" @childForm="getRedirectForm" @childisopen="getisopen" :order-id='orderId' :redirect-label="redirectformLabel"> </apply-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.Redirectisopen =  false;">取 消</el-button>
          <el-button @click="submitRedirectForm" type="primary" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--重寄需退件物品选择-->
      <el-dialog title="重寄需退件物品选择"  :visible.sync="dialogFlag.RedirectChangeisopen" size="small" :close-on-click-modal="false"  @close="clearRedirect">
        <apply-form  ref="retform"  @childForm="getRedirectForm" :order-id='orderId' @childisopen="getisopen" :redirect-label="redirectformLabel"> </apply-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.RedirectChangeisopen = false;">取 消</el-button>
          <el-button @click="submitRedirectForm" type="primary" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑/添加 备注-->
      <el-dialog title="添加备注" :visible.sync="dialogFlag.RemarkisOpen" size="tiny" :close-on-click-modal="false" @close="resetForm('noteObj')" >
        <el-form  :model="noteObj" ref="noteObj">
          <el-form-item prop="noteContent"  required :rules=" { required: true, message: '请输入备注！', trigger: 'blur' }">
            <el-input v-model="noteObj.noteContent" type="textarea" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary"  @click="dialogFlag.RemarkisOpen = false" >关 闭</el-button>
          <el-button type="primary" @click="submitorderLog();" :loading="$store.state.loading">确 定</el-button>
        </span>
      </el-dialog>
        <!--补充费用-->
      <el-dialog title="补充费用" :visible.sync="dialogFlag.CostisOpen" size="tiny" :close-on-click-modal="false" @close="resetForm('costForm')" >
        <el-form  labelWidth="120px" :model="costForm" ref="costForm">
          <el-form-item prop="name" label="费用名称" >补充其他费用
          </el-form-item>
          <el-form-item prop="money" label="费用属性" :rules="[{ required: true, message: '请选择费用属性！', trigger: 'blur' }]">
            <el-select class="input-Maginbottom" v-model="costForm.money">
              <el-option v-for="item in costTypeoptions" :label="item.label" :key="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="responsibility" label="责任方"  :rules="[{ required: true, message: '请选择责任方！', trigger: 'blur' }]">
            <el-select class="input-Maginbottom" v-model="costForm.responsibility">
              <el-option v-for="item in responsibleOptions" :label="item.label" :key="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="currencyId" label="币种" :rules="[{ required: true, message: '请选择币种！', trigger: 'blur' }]">
            <el-select class="input-Maginbottom"  v-model="costForm.currencyId">
              <el-option v-for="item in Currencyoptions" :label="item.cnName" :key="item.cnName"
                         :value="item.currencyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="money" label="金额"  :rules="[{ required: true, message: '请输入金额！', trigger: 'blur' }]">
            <el-input type="text" v-model="costForm.money"></el-input>
          </el-form-item>
          <el-form-item prop="note" label="备注" :rules="[{ required: true, message: '请输入备注！', trigger: 'blur' }]">
            <el-input v-model="costForm.note" type="textarea" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary"  @click="dialogFlag.CostisOpen = false" >关 闭</el-button>
          <el-button type="primary" @click="subMitRemark()" :loading="$store.state.loading">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import applyForm from './SonModula/ApplyForm.vue'
  import refundsDialog from 'components/order/refundsDialog.vue'


  export default {
    components: {
      applyForm,
      refundsDialog
    },
    data () {
      return {
        sourceType:'',//不同平台的订单标识
        picList:[],
        formlabelWidth:'140px',
        Channeloption:[],//平台渠道
        Accountoption:[],//店铺账号
        Siteoption:[],//市场站点
        Salesoption:[],//销售人员
        Currencyoptions:[],//币种
        Countryoptions:[],//国家
        warehouseoptions:[],//仓库
        logisticsMethodoptions:[],//仓库的物流方式
        responsibleOptions:[
          {value:'公司',label:'公司'},
          {value:'销售',label:'销售'},
          {value:'仓库',label:'仓库'},
          {value:'采购',label:'采购'},
        ],
        costTypeoptions:[
          {value:'利润',label:'利润'},
          {value:'成本',label:'成本'},
        ],
        //付款方式
        payTypeoptions:[
          {value:'2',label:'银行转账'},
          {value:'1',label:'PayPal'},
          {value:'3',label:'现金'},

        ],
        costForm:{
        	name:'',
          type:'',
          responsibility:'',
          currencyId:'',
          money:'',
          note:''
        },
        //利润--财务版
        salesAmount:{
          salesCost:{
            purchaseCost:'7',
            developCost:'6',
            purchaseFee:'5',
            warehouseFee:'5',
            transportCost:'5',
            dutyCost:'5',
            vatCost:'5',
            otherFee:'5',
            warehouseFee2:'5',
            tradingFee:'5',
            paypalFee:'5',
            fbaFee:'5',
            salesVatFee:'5',
            transportCost2:'5',
            afterSalesFee:'5',
          },
          totalAmount:'7',
          profitsAmount:'7',
          profitsRate:'7'
        },
        //利润--销售版
        selectOrder:{
          orderId:'6',
          toWarehouseCost:'6',
          salesCost:'6',
          otherCost:'6',
          salesAmount:'6',
          profitsAmount:'6',
          otherProfitsAmount:'6',
          prifitsRate:'6'
        },
        Data: {
        listData: [
          {
            id: '深圳段',
            type: '22',
            money: '88',
            huilv: '0.02',
            CNY: '55',
          },
          {
            id: '',
            type: '22',
            money: '88',
            huilv: '0.02',
            CNY: '55',
          },
          {
            id: 55,
            type: '22',
            money: '88',
            huilv: '0.02',
            CNY: '55',
          },
          {
            id: 55,
            type: '22',
            money: '88',
            huilv: '0.02',
            CNY: '55',
          },
          {
            type: '22',
            money: '88',
            huilv: '0.02',
            CNY: '55',
          },
          {
            type: '22',
            money: '88',
            huilv: '0.02',
            CNY: '55',
          },

        ],
          listData2: [
            {
              id: '头程',
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
          ],
          listData3: [
            {
              id: '海外段',
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              id: 55,
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              id: 55,
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              id: 55,
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },

          ],
          listData4: [
            {
              id: '倒仓成本',
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
          ],
          listData5: [
            {
              id: '销售段',
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              id: 55,
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              id: 55,
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              id: 55,
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
            {
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },

          ],
          listData6: [
            {
              id: '销售成本',
              type: '22',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },
          ],
          listData7: [
            {
            	id:'销售额',
              type: '99',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },

          ],
          listData8: [

            {
            	id:'利润',
              type: '33',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },

          ],
          listData9: [

            {
              id:'利润率',
              type: '55',
              money: '88',
              huilv: '0.02',
              CNY: '55',
            },

          ],
        },
      	index:'4',
        options:[
          {label:'1',value:'1'}
        ],
        redirectformLabel:'',
        RedirectLabelhouse:'',
        RedirectLabelmode:'',
        addSku:false,
        //重寄退件物品
        RedirectForm:{
          productData:[{id:'12'},],
          house:'',
          mode:'',
          reason:'',
          radio:'1',
          image:[],
          note:''
        },
      	//退件详情弹框model
        ReturnForm:{
          requestId:'',
          requestNo:'',
          whId:'',
          whName:'',
          memo:'',
          isReceived:'',
          attachUrls:[],
          returnItems:[],
        },
        //补退款申请弹框model
        refundForm:{
          refundradio:'1', //全部/部分退款：
          Reason:'',    //退款原因
          allradio:false,//全部/部分退款：
          money:'',//退款金额
          isnoradio:false,//是否已发货
          finishradio:false,//是否已完成退款
          mode:'', //退款方式
          image:[], //
          note:'' //

        },
        //基本信息
        msgForm:{
          orderInfo:{
            orderId:'',
            orderNo:'',
            shopOrderId:'',
            salesUser:'',
            channelId:'',
            accountNo:'',
            countryNo:'',
            totalAmount:'',
            currencyId:'',
            currencyRate:'',
            payType:'',
            orderTime:'',
            payTime:'',
            syncTime:''
          },
          orderCustomer:{
            customerId:'',
            customerName:'',
            recipient:'',
            city:'',
            state:'',
            district:'',
            address1:'',
            address2:'',
            address3:'',
            postCode:'',
            countryNo:'',
            phone:'',
            customerEmail:''
          },
          payInfo:{
            payType:'',
            tradingType:'',
            amount:'',
            handlingCost:'',
            flowId:'',
            payTime:'',
            boundedTime:''
          }
        },
        //物品信息
        itemInformation:{
          items:[],
          esbItems:[]
        },
        //物流信息
        logisticsForm:{
          orderId:'',
          logsticsPlatformCode:'',
          freightCost:'',
          whId:'',
          whName:'',
          logisticsMethod:'',
          logisticsMethodName:'',
          totalWeight:'',
          estimateTransportCost:'',
          trackingNo:'',
          trackingList:[],
        },
        //售后
        salesForm:{
          //重寄信息
          selectByOrderId:{
            requestId:'',
            requestNo:'',
            whName:'',
            logisticsMethodName:'',
            rmaDesc:'',
            redirectOption:'',
            returnOption:'',
            attachUrls:[],
            memo:'',
            status:'',
            newOrderId:''
          },
          //退款信息
          Refundselect:{
            requestId:'',
            requestNo:'',
            rmaDesc:'',
            refundOption:'666',
            refundAmount:'',
            currencyId:'',
            currencyRate:'',
            isShipped:'',
            returnOption:'',
            refundMethod:'',
            tradingAccount:'',
            tradingNo:'',
            attachUrls:[],
            memo:'',
            status:''
          },
          //配件信息
          accessoryInfo:{
            items:[],
            whName:'',
            attachUrls:[],
            reqMemo:'',
            whStatusName:''
          },
          //待补单
          orderReturn:{
            requestId:'',
            requestNo:'',
            memo:'',
            status:'',
            attachUrls:[],
            returnItems:[]
          },

        },
        //日志
        orderLogData:[],
        //备注
        dataNote:[],
        noteObj:{
          orderId:'',
          noteContent:'',
          isToWh:0,
        },
        //留言
        CustomerMsg:{orderCustomerMsg:[]},
      	goodsStyle:'1',
        noteStyle:'0',
        goodsTable:'1',//控制物品信息表格
        editMsgAll:false,//控制全场小笔的编辑
      	editMsg:false,//控制订单信息单个有小笔的编辑
        editCustomer:false,//控制客户信息单个有小笔的编辑
        editWeiCheng:false,//控制尾程信息单个有小笔的编辑
        dialogFlag:{
          RemarkisOpen:false,
          refundisopen:false,
          Returnisopen:false,
          Redirectisopen:false,
          RedirectChangeisopen:false,
          CostisOpen:false,
        },
        activeName:'1',
        activeName2:'1',
        activeName3:'1',
        productData:[
          {id:'12'},
        ],
        msg: JSON.parse(sessionStorage.getItem('topMenus')),
        menuId:'',
        activeIndex: '/product',
        uesr:{
          userId:this.sessuserid
        },
        uesr2:{
          userId:this.sessuserid,
          menuId:''
        },
        orderId:'',
        requestId:'',
        changeFlag:false,
        WeiChengFlag:false,
        allowRefund:'',//是否允许退款
        allowRedirect:'',//是否允许重寄
        allowReturn:''//是否允许退件
      }
    },
    mounted: function () {
    	this.initializeData();
  /*    var url = !!location.search ? location.search : location.hash;
      var params = this.tool.requestParams('transferId');
      console.log('  this.allowReturn   % 0',  params );*/
   /*   var Request = {};
      var strr=params.split("&");*/

 /*     this.orderId=strr[0];
      for (var i = 1; i < strr.length; i++) {
        Request[strr[i].split("=")[0]] = decodeURIComponent(strr[i].split("=")[1]);
      }
      this.allowRefund = Request.allowRefund;
      this.allowRedirect = Request.allowRedirect;
      this.allowReturn = Request.allowReturn;*/
  /*    console.log(typeof this.allowRefund )
      console.log('  this.allowRedirect   % 0',  this.allowRedirect  )
      console.log('  this.allowReturn   % 0',  this.allowReturn  )*/
      this.getOderDetails();
    	this.getChannel();
    	this. getCurrencyList();
    	this.getCountryList();
    //	this.changetabsIcon();
//      this.cartView();
////      this.dd()
//      this.handleSelect2()
    },
    computed: {
      ...mapGetters([
        'getters',
        'menus',
        'menu',
        'collapsed',
        'getCount'
      ])
    },
    methods: {
      initializeData(){
        var search = !!location.search ? location.search : location.hash;
        var params={};
        if(search!=""){
          search.slice(1).split("&").forEach(
            function(val){
              var arr=val.split("=");
              params[arr[0]]=arr[1];
            }
          );
        }
        this.orderId=params['/orderDetails?transferId'];
        this.allowRefund = params.allowRefund;
        this.allowRedirect = params.allowRedirect;
        this.allowReturn = params.allowReturn;
      },
      refundApplication(){
      	var vm=this;
      	this.dialogFlag.refundisopen = !this.dialogFlag.refundisopen;
      	},
      //利润Tab
      profitTabClick(){
        if(this.activeName3=='1'){
        // this.getOrderProfits();
        }else if(this.activeName3=='2'){
         // this.getselectOrder();
        }
      },
      //售后Tab
      salestabClick(){
      	if(this.activeName2=='2'){
         this.getRefundselect();
        }else if(this.activeName2=='3'){
         this.getaccessoryInfo();
        }else if(this.activeName2=='4'){
          this.getorderReturn();
        }
      },
      //主页Tab
      tabClick(){
      	if(this.activeName=='2'){
            this.getItemsList();
        }else if(this.activeName=='3'){
          this.WeiChengFlag=false;
      		this.getwarehouse();
      		this.getrLogisticsList();
          //this.getLogisticsMethod(this.logisticsForm.whId)
        }else if(this.activeName=='4'){
        	this.getselectByOrderId();
        }else if(this.activeName=='6'){
          this.getorderLog();
        }else if(this.activeName=='7'){
          this.changeNoteStyle(0);
        }else if(this.activeName=='8'){
          this.getorderCustomerMsg();
        }
      },
      //获取利润--财务版
      getOrderProfits(){
      	this.httpGet('orderInfo/selectOrderProfits?orderId='+this.orderId,'','Sms').then(res=>{
          if(res.data.salesCost!='' && res.data.salesCost!=null){
            this.salesAmount.salesCost=res.data.salesCost;
          }
        })
      },
      //获取利润--销售版
      getselectOrder(){
        this.httpGet('/orderInfo/selectOrderProfitsForSales?orderId='+this.orderId,'','Sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.selectOrder=res.data;
          }
        })
      },
      //获取物品信息
      getItemsList(){
      	this.httpGet('/orderInfo/selectItems?orderId='+this.orderId,'','sms').then(res=>{
      	    if(res.data!='' && res.data!=null){
              this.itemInformation=res.data;
            }
        })
      },
      //获取物流跟踪--尾程信息
      getrLogisticsList(){
      	var vm=this;
        this.httpGet('orderLogisticsTracking/selectByOrder?orderId='+this.orderId,'','sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.WeiChengFlag=false;
            this.logisticsForm=res.data;
            if( res.data.trackingList!=[]){
              this.logisticsForm.trackingList.forEach(item=>{
              	item.trackingTime=vm.tool.formatDate(item.trackingTime)
              })
            }
            this.getLogisticsMethod(this.logisticsForm.whId)

          }
        })
      },
      //获取售后-重寄信息
      getselectByOrderId(){
      	this.httpGet('/orderRedirect/selectByOrderId?orderId='+this.orderId,'','sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.salesForm.selectByOrderId=JSON.parse(JSON.stringify(res.data));
            this.salesForm.selectByOrderId.attachUrls	=[];
            if(res.data.attachUrls!=[]){
              res.data.attachUrls.forEach(item=>{
                this.salesForm.selectByOrderId.attachUrls.push({url:item})
              })
            //  console.log('7777 % 0',this.salesForm.selectByOrderId.attachUrls)
            }
          }
        })
      },
      //获取售后-退款信息
      getRefundselect(){
        this.httpGet('/orderRefund/selectByOrderId?orderId='+this.orderId,'','sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.salesForm.Refundselect=JSON.parse(JSON.stringify(res.data));
            this.requestId=res.data.requestId;
            this.salesForm.Refundselect.attachUrls=[];
            if(res.data.attachUrls!=[]){
              res.data.attachUrls.forEach(item=>{
                this.salesForm.Refundselect.attachUrls.push({url:item})
              })
            }
          }
        })
      },
      //获取售后-配件信息
      getaccessoryInfo(){
        this.httpGet('accessoryInfo/selectByOrderId?orderId='+this.orderId,'','sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.salesForm.accessoryInfo=JSON.parse(JSON.stringify(res.data));
            this.salesForm.accessoryInfo.attachUrls=[];
            if(res.data.attachUrls!=[]){
              res.data.attachUrls.forEach(item=>{
                this.salesForm.accessoryInfo.attachUrls.push({url:item})
              })
            }
          }
        })
      },
      //获取售后-待补单退件信息
      getorderReturn(){
      	var obj={};
      	obj.orderId=this.orderId;
      	obj.status='待销售补申请单';
      	obj.sourceId='';
        this.httpPost('orderReturn/select',obj,'sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.salesForm.orderReturn=JSON.parse(JSON.stringify(res.data));
            this.salesForm.orderReturn.attachUrls=[];
            if(res.data.attachUrls!=[]){
              res.data.attachUrls.forEach(item=>{
                this.salesForm.orderReturn.attachUrls.push({url:item})
              })
            }
          }
        })
      },
      //获取日志
      getorderLog(){
        this.httpGet('orderLog/selectByOrderId?orderId='+this.orderId,'','sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.orderLogData=res.data;
          }
        })
      },
      //获取备注
      changeNoteStyle(val){
        val==0?this.noteStyle='0':this.noteStyle='1';
        this.getorderNote(val);
      },
      getorderNote(val){
      	var obj={};
      	obj.orderId=this.orderId;
      	obj.isToWh=val;
        this.httpPost('orderNote/selectList',obj,'sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.dataNote=res.data;
          }else{
            this.dataNote=[];
          }
        })
      },
      //新增备注
      submitorderLog(){
      	this.noteObj.orderId=this.orderId;
        this.$refs['noteObj'].validate((valid) => {
          if (valid) {
            this.httpPost('orderNote/save',this.noteObj,'sms').then(res=>{
              this.$message(res.data.message)
              if(res.data.result==true){
                this.changeNoteStyle(this.noteObj.isToWh);
                this.dialogFlag.RemarkisOpen=false;
              }
            })
          }
        })
      },

      //删除备注
      deleteNote(url,row){
      	console.log('l;lll % 0',row)
      	var msg='';
        msg= url=='/orderNote/invalid'?'您确定要标记此备注作废？标记作废不会删除，但状态更新为已作废':'您确定要恢复此备注？';
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpGet(url+'?noteId='+row.noteId,'','sms').then(res=>{
                 this.$message(res.data.message)
               if(res.data.result==true){
                 	this.changeNoteStyle(0);
               }
          })
        }).catch(() => {
        });
      },
      //获取留言
      getorderCustomerMsg(){
        this.httpGet('orderCustomerMsg/selectByOrderId?orderId='+this.orderId,'','sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.orderCustomerMsg.CustomerMsg=res.data;
          }
        })
      },
      //查看退件详情
      getReturnForm(val){
      	var obj={};
      	obj.orderId=this.orderId;
      	val=='重寄'?obj.sourceId=this.salesForm.selectByOrderId.requestId:obj.sourceId=this.salesForm.selectByOrderId.requestId;
      	obj.status='';
      	this.httpPost('/orderReturn/select',obj,'sms').then(res=>{
          if(res.data!='' && res.data!=null){
            this.ReturnForm=res.data;
          }
        })
      },
    	//保存基本信息-订单信息
      submitMsgform(){
      	this.msgForm.orderInfo.orderId=this.orderId;
        this.$refs['msgForm.orderInfo'].validate((valid) => {
          if (valid) {
                this.httpPost('/orderInfo/changeOrderInfo',this.msgForm.orderInfo,'sms').then(res=>{
                	this.$message(res.data.message)
                  if(res.data.result==true){
                		 this.editMsg=false;
                		 this.getOderDetails();
                  }
                })
          }
        })
      },

      //保存基本信息-客户信息
      submitorderCustomer(){
        this.msgForm.orderCustomer.orderId=this.orderId;
        this.$refs['msgForm.orderCustomer'].validate((valid) => {
          if (valid) {
            this.httpPost('orderCustomer/save',this.msgForm.orderCustomer,'sms').then(res=>{
              this.$message(res.data.message)
              if(res.data.result==true){
               // this.editMsg=false;
                this.editCustomer = false;
                this.getOderDetails();
              }
            })
          }
        })
      },
      //保存物流跟踪-尾程信息
      submitlogisticsForm(){
        this.logisticsForm.orderId=this.orderId;
        this.$refs['logisticsForm'].validate((valid) => {
          if (valid) {
            this.httpPost('/orderInfo/saveShippmentInfo',this.logisticsForm,'sms').then(res=>{
              this.$message(res.data.message);
              if(res.data.result==true){
                this.editWeiCheng = false;
                this.getrLogisticsList();

              }
            })
          }
        })

      },
      //利润--补充其他费用提交
      subMitRemark(){
        this.$refs['costForm'].validate((valid) => {
          if (valid) {

          }
        })
      },
      //利润--删除费用
      deleteCost(){
      	/*var flag='';
        this.activeName3=='1'?flag=''*/
      	this.doItem('您确定要删除手工录入的成本/利润？删除后不可回复，需重新录入','url','obj',this.getOrderProfits());
      },
      //仓库
      getwarehouse(){
      	this.httpGet('/warehouse/selectAllList','','lwms').then(res=>{
      		if(res.data.params.listData!=[]){
            this.warehouseoptions=res.data.params.listData;

          }
        })
      },
      //物流方式
      getLogisticsMethod(val){
        this.httpGet('logisticsMethod/selectListByWhId?whId='+val,'','sms').then(res=>{
          this.logisticsMethodoptions=res.data;
          if(this.WeiChengFlag==true){
          	this.logisticsForm.logisticsMethod='';
          }
          this.WeiChengFlag=true;
        })
      },
      changeLogisticsForm(){
        this.editWeiCheng = true;this.getwarehouse();
      },
      //国家
      getCountryList(){
        this.httpPost('addresser/selectCountry').then(res =>{
          if(res.data.result == true){
            this.Countryoptions = res.data.params.list;
          }
        })
      },
      //币种
      getCurrencyList(){
        this.httpGet('/dictCurrency/selectList','','scm').then(res => {
          this.Currencyoptions = res.data;
        })
      },
      //渠道平台
      getChannel(){
        this.httpGet('/dictChannel/selectList','','scm').then(res=>{
          if(res.data!=[] && res.data.length>1){
            this.Channeloption=res.data;
            this.msgForm.channelId=res.data[0].channelId;
          }
        })
      },
      //账号
      getAccoun(val){
          this.httpGet('/shopAccount/selectListByChannel?channelId='+val,'','sms').then(res=>{
            if(res.data!=[] && res.data.length>=1){
              this.Accountoption=res.data;
              if(this.changeFlag==true){
                  this.msgForm.orderInfo.accountId='';
                  this.msgForm.orderInfo.salesUser='';
                  this.msgForm.orderInfo.countryNo='';
                  this.Siteoption=[];
              }
              this.changeFlag=true;
            }
          })
      },
      //站点
      getSite(val){
        this.httpGet('/shopAccount/selectCountryList?accountId='+val,'','sms').then(res=>{
            if(res.data!=[] && res.data.length>=1){
              this.Siteoption=res.data;
           }
        })
      },
      //销售
      getsales(val){
          this.httpGet('/shopAccount/selectSalesUserList?channelId='+val,'','sms').then(res=>{
            if(res.data!=[] && res.data.length>=1){
              this.Salesoption=res.data;


            }
          })
      },
      //初始---基本信息
      getOderDetails(){
        this.httpGet('orderInfo/selectOrderDetail?orderId='+this.orderId,'','sms').then(res => {
          if(res.data.orderCustomer!='' && res.data.orderCustomer!=null){
            this.msgForm.orderCustomer=res.data.orderCustomer;
          }
          if(res.data.orderInfo!='' && res.data.orderInfo!=null){
          	this.changeFlag=false;
            this.msgForm.orderInfo=res.data.orderInfo;
            this.getAccoun(this.msgForm.orderInfo.channelId);
            this.getsales(this.msgForm.orderInfo.channelId);
            this.getSite(this.msgForm.orderInfo.accountId)
          }
          if(res.data.payInfo!='' && res.data.payInfo!=null){
            this.msgForm.payInfo=res.data.payInfo;
          }
          this.sourceType=res.data.orderInfo.sourceType+'';

        })
      },

      getChildForm(){
        this.redirectformLabel='重寄仓库';

        this.$nextTick(function () {
          this.$refs.redform.getFormData();
        });
        this.dialogFlag.Redirectisopen=true;
        //	setTimeout(function(){this.$refs.redform.add();},500)
      },
      submitRedirectForm(){
      	if(this.dialogFlag.RedirectChangeisopen==true){
          this.$refs.retform.submitForm();
        }else{
          this.$refs.redform.submitForm();
        }

      },
      getRedirectForm(){

      },
      getisopen(val){
      	var vm=this;
        vm.dialogFlag.RedirectChangeisopen = val.isopen;
        vm.redirectformLabel=val.houseName;
        vm.$nextTick(function () {
         vm.$refs.retform.getFormData();
        })
      },
      clearRedirect(){
      	//alert(888)
        this.redirectformLabel='重寄仓库';
      },
      changeRedirectradio(val){
      	if(val !== 1){
          this.dialogFlag.RedirectChangeisopen=true;
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeEdit(){
        this.editMsgAll = false;this.editMsg=false;this.editCustomer=false;this.editWeiCheng=false;
        if(this.activeName=='1'){
          this.changeFlag=false;
          this.resetFormAll();
          this.getOderDetails();
        }else if(this.activeName=='3'){
          this.getrLogisticsList();
        }

        //this.getwarehouse();
      },
      changeNoEdit(){
        this.editMsgAll = true;this.editMsg=true;this.editCustomer=true;this.editWeiCheng=true;
        if(this.activeName=='1'){
          this.changeFlag=false;
          this.getOderDetails();
        }else if(this.activeName=='3'){
          this.getrLogisticsList();

        }

      },
      resetFormAll(){
       this.resetForm('msgForm.orderInfo');
       this.resetForm('msgForm.orderCustomer');
      },
      //物品平台商品信息
      getGoodsData(val){
        val == '1'? this.goodsStyle='1' : val == '2' ? this.goodsStyle='2':this.goodsStyle='3';
      },

      ...mapMutations([
        'collapse',

      ]),
      cartView: function () {
        this.$http.post(this.RmsUrl+'/login/getTopMenus',this.qs.stringify(this.uesr)).then(res => {
          this.msg = res.data;
          console.log('横向导航  % O',res.data);
        })

      },
      /*菜单折叠*/
      handleSelect(key, keyPath) {
//        sessionStorage.setItem("currentnav",key);
//        this.$refs.subnav.handleParentClick(key);
      },

      changetabsIcon(){

      },
      personal(){
        this.$refs.subnav.handleParentClick(mull);
      }
    },

  }

</script>

<style scoped>
  /*头部start*/
  .header {
    width: 100%;
    line-height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    box-sizing: border-box;
    background:url("../../assets/banner_title.jpg")no-repeat left center;
    background-size:100%;

  }
  .titleName{
  //padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }

  /*头部end*/

  table.salesTable {
    border: 1px solid #ccc;
    width: 100%;
    padding:0;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0 auto;
  }
  table.salesTable tr {
    border: 1px solid #ddd;
    padding: 5px;
  }
  table.salesTable th, table td {
    padding: 10px;
    text-align: center;
    border-right: 1px solid #ddd;
  }
  table.salesTable th:last-child, table td:last-child {
    border:0;
  }

  table.salesTable th {
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 1px;
  }

  @media screen and (max-width: 600px) {

    table {
      border: 0;
    }

    table thead {
      display: none;
    }

    table tr {
      margin-bottom: 10px;
      display: block;
      border-bottom: 2px solid #ddd;
    }

    table td {
      display: block;
      text-align: right;
      font-size: 13px;
      border-bottom: 1px dotted #ccc;
    }

    table td:last-child {
      border-bottom: 0;
    }

    table td:before {
      content: attr(data-label);
      float: left;
      text-transform: uppercase;
      font-weight: bold;
    }
  }

  .note{max-width: 100%; margin: 0 auto;}

  .formText .el-form-item .el-form-item__label{
   text-align: left!important;
  }
  .noteDiv{
    border:1px solid #d1dbe5;
    padding:10px;
    margin-top:10px;
  }
  .note{
    border-bottom: 1px solid #d1dbe5;
    margin-bottom:7px;
    position: relative;
  }
  .note .deleteNote{
    text-align: center;
    float: right;
   /* position: absolute;
    top: 1px;
    right: 2px;*/
  }
  .note .noteText{
    padding:10px 0;
  }
  .borderTop{
    padding-top:10px;
    border-top:1px solid #d1dbe5;
  }
  .formBottom .el-form-item{
    //margin-bottom: 7px!important;
  }

.textColor{
  color:red
}

</style>
