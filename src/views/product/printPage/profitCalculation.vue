<template>
  <div id="outermost_wrap" >
    <el-row style="text-align: center;border-bottom: 1px solid #ccc">
      <h4>产品开发利润计算试算表-{{flag}}平台</h4>
    </el-row>
    <el-row class="content_wrap" id="content_wrap">
      <el-col style="float: right;text-align: right">
        <el-button type="primary">导出Excel</el-button>
      </el-col>
      <el-form  class="demo-ruleForm" :model="proDetailForm" labelWidth="120px">
        <h4>基础配置</h4>
        <el-col>
          <el-col class="itemMagrin" :span="8">
            <el-form-item label="海运试算运费:" >
              <el-input type="number" class="inputWidth">
                <template slot="append">
                  <span>CNY/m³</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="空运试算运费:" >
              <el-input type="number" class="inputWidth">
                <template slot="append">
                  <span>CNY/KG</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <h4>预计售价</h4>
           <el-form-item label="全球:"  class="itemMagrin" v-if="flag!='ebay'">
             <el-input type="number"  class="inputWidth">
               <template slot="append">
                 <span>$</span>
               </template>
             </el-input>
           </el-form-item>
            <el-form-item label="德国:"  class="itemMagrin" v-if="flag=='ebay'" >
              <el-input type="number" class="inputWidth">
                <template slot="append">
                  <span>€</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="flag=='ebay'" label="英国:" class="itemMagrin">
              <el-input type="number" class="inputWidth">
                <template slot="append">
                  <span>£</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="flag=='ebay'" label="美国:" class="itemMagrin">
              <el-input type="number" class="inputWidth">
                <template slot="append">
                  <span>$</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="flag=='ebay'" label="法国:" class="itemMagrin">
              <el-input type="number" class="inputWidth">
                <template slot="append">
                  <span>€</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="flag=='ebay'" label="销售站点:" class="itemMagrin">
              {{}}
            </el-form-item>
            <el-form-item v-if="flag=='ebay'" label="平均售价:" class="itemMagrin">
              {{}}￥
            </el-form-item>
        <el-row class="marginBottom ">
          <el-col :span="2">
            <el-button type="primary">计算</el-button>
          </el-col>
          <el-col :span="5">
            <el-radio-group v-model="radio2">
              <el-radio :label="1">按昨日汇率计算</el-radio>
              <el-radio :label="2">按提交日期汇率计算</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <div  class="item_list">
          <el-table :data="proDetailForm.pacelList" v-if="flag!='ebay'" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column sortable prop="Parcel_Id" label="基本信息"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="开发员"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="时间" :formatter="tool.formatDate"  align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="图片"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="产品名称"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="a" label="采购价"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="开发费"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a/100 *  0.35) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="采购费"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a/100 *  0.1) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="深圳仓管理费"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a/100 * 8) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="实际重量"   align="center" >
              <template>
                <el-table-column sortable prop="a" label="重量(kg)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="a" label="重量(lb)"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a * 2.204) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="尺寸信息"   align="center" >
              <template>
                <el-table-column sortable prop="a" label="长(cm)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="a" label="宽(cm)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="a" label="高(cm)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="长('')"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a / 2.54) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="宽('')"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a / 2.54) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="高('')"   align="center" >
                  <template scope="scope">
                    <span>{{(scope.row.a / 2.54) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="体积(m³)"   align="center" >
                  <template scope="scope">
                    <span>{{((scope.row.a / 100)*(scope.row.a / 100)*(scope.row.a / 100)) .toFixed(4)}}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="到仓价格(深圳)"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="到仓(￥)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="深圳发货（平邮）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="利润(￥)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="深圳发货（挂号）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="利润(￥)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="俄罗斯仓IML"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="利润(￥)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="proDetailForm.pacelList" v-if="flag=='ebay'" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column sortable prop="Parcel_Id" label="基本信息"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="开发员"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="时间"  :formatter="tool.formatDate" align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="图片"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="a" label="产品名称"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="a" label="采购价"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="开发费"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="采购费"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="深圳仓管理费"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="实际重量"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="重量(kg)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="重量(lb)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="尺寸信息"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="长(cm)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="宽(cm)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="高(cm)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="长('')"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="宽('')"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="高('')"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="体积(m³)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="计费重信息"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="重量(KG)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="体积(KG)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="体积重(lb)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="计费重(lb)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="到仓价格(深圳)"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="到仓(￥)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓($)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓(£)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓(€)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="头程运费(￥)"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="空运"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="海运"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="到仓价格（海外）/空运"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="到仓(￥)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓($)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓(£)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓(€)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="到仓价格（海外）/海运"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="到仓(￥)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓($)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓(£)"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="到仓(€)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="海外管理费"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="海外管理(￥)"   align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="尾程派送费用（£€€$）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="海运综合成本（￥）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="海运平均"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="空运综合（￥）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="空运平均"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="海运利润（￥）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="海运平均"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="空运利润（￥）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="空运平均"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="海运利润率（%）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="海运平均"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column sortable prop="Parcel_Id" label="空运利润率（%）"   align="center" >
              <template>
                <el-table-column sortable prop="Parcel_Id" label="英国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="德国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="法国仓"   align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="美国仓"    align="center" >
                </el-table-column>
                <el-table-column sortable prop="Parcel_Id" label="空运平均"    align="center" >
                </el-table-column>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-table :data="proDetailForm.pacelList" border tooltip-effect="dark" style="width: 100%" >
              <el-table-column sortable prop="Parcel_Id" label="包裹编号"   align="center"  width="80px"></el-table-column>
    &lt;!&ndash;          <el-table-column sortable prop="Order_No" label="订单数" align="center">
              </el-table-column>
              <el-table-column sortable prop="nation" label="产品数" align="center">
              </el-table-column>&ndash;&gt;
              <el-table-column sortable prop="Order_Id" label="订单ID" align="center" width="180px">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" class="orderDIV simulation" >
                      <div class="childDiv paddingStyle " >
                        <img :src="getImage('shipmentBatch/getOrderCode',item.Order_Id)" alt="二维码" style="width: 150px;height: 90px;padding-top: 0px">
                      </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Ean_Code" label="EAN" align="center" width="120px">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''">
                    <div v-for="(info,index) in item.childList"  :class="item.childList.length>1? 'simulation':''">
                    <div class="childDiv paddingStyle" >
                     <img :src="getImage('shipmentBatch/getEanCode',info.Ean_Code)" alt="二维码" style="width:90px;height: 70px;padding-top: 0px">
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Sku_No" label="SKU" align="center" width="80px">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''">
                    <div v-for="(info,index) in item.childList"  :class="item.childList.length>1? 'simulation':''">
                      <div class="childDiv paddingStyle" >
                        {{info.Sku_No}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Image_Url" label="图片"  align="center" width="100px;" >
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        <img  v-if="info.Image_Url!=null" style="width: 70px; height: 70px" :src="info.Image_Url" >
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Cn_Name" label="商品名称"  align="center" width="100px;" >
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.Cn_Name}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Location_No" label="货位号"  align="center" width="80px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.Location_No}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Sales_Qty" label="SKU数"  align="center" width="70px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.Sales_Qty}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="packQty" label="拣货数"  align="center" width="70px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.packQty}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="notes" label="备注"  align="center" width="76px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList"  :class="scope.row.childList.length>1? 'simulation':''"  >
                    {{item.childList.length}}
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div v-for="(note,index) in info.notes" >
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
            </el-table>-->
        </div>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {
      ElButton
    },
    data(){
      return {
        radio2:2,
        name:'',
        poNo:'',
        flag:'',
        proDetailForm:{
          Picking_User:'',
          Picking_Start_Time:'',
          Picking_End_Time:'',
          Shippment_User:'',
          Shippment_Start_Time:'',
          Shippment_End_Time:'',
          printUser:'',
          printTime:'',
          pacelList:[
            {a:2}
          ],
          /*pacelList:[
            {Parcel_Id:'123',Parcel_No:'123',orderList:[{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]},{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]}]},{Parcel_Id:'123',Parcel_No:'123',orderList:[{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]},{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]}]},
          ],*/
        },
      }
    },
    mounted () {
      this.flag = this.tool.requestParams('flag');
      this.getProDetailList();
    },
    computed: {},
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
      getProDetailList:function(){
        this.httpGet('shipmentBatch/printPicking?batchId='+this.batchId,'','Sms').then(res => {
          //this.proDetailForm=res.data;
        })
      },
      print:function(){
        document.body.innerHTML=document.getElementById('outermost_wrap').innerHTML;
        window.print();
      },
      getImage(url,val){
      	var paramsUrl=url=='shipmentBatch/getOrderCode'?'shipmentBatch/getOrderCode?orderId=':'shipmentBatch/getEanCode?eanCode=';
      	return  this.RmsUrl+paramsUrl+val+'&Authorization='+sessionStorage.getItem('userSession');
      }
    }
  }
</script>
<style scoped>
  .inputWidth{
    width:200px;
  }
  .text-right{
    text-align: right;
    padding-right:20px
  }
  .itemMagrin {
    padding-left: 77px;
  }

  .itemMagrin i{
    display:inline-block;
    font-style:normal;
    width: 173px;
    border-bottom: 1px solid #000;
  }
  .fisrtIitem >div:first-child i{
    width: 152px;
  }
  .user_manager_wrap{
    padding:0 20px;
  }
  .header {
    width: 100%;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    line-height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left;
  }
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .header-right{
    text-align: right;
    padding: 13px 20px;
    font-size: 14px;
  }
  .simulation{
    border-bottom: 1px solid #dfe6ec;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 130px;
    position: relative;
  }
  .childDiv{
    position: relative;
    top:50%;
  }
  .orderDIV:last-child{
    border-bottom: none;
  }
  .textStyle{
    float: right;
  }
  .textStyle .el-form-item{
    text-align: left!important;
  }
  /*.simulation1{
    height: 150px;
    border-bottom: 1px solid #ccc;
  }
  .simulation2{
    height: 80px;
    border-bottom: 1px solid #ccc;

  }
  .simulation2:last-child{
    //border-bottom: none;
  }*/
</style>
