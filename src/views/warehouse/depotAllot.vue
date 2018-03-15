<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap" style="margin-top: -10px">
      <el-row id="filer" class="">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
              <div class="marginBottom flex">
                <div class="span_label">始发仓</div>
                <el-radio-group v-model="defaultData.wIdStart" size="small" class="flex1">
                  <el-radio-button  class="marginBottom" :label="item.whId" v-for="(item,index) in BasicsData1" v-if="ButtonInfo[item.whName]!='0'">{{ item.whName }}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="marginBottom flex">
                <div class="span_label">目的仓类型</div>
                <el-radio-group v-model="objectiveDepotType" size="small"  class="flex1">
                  <el-radio-button class="marginBottom"  label="1" v-if="ButtonInfo['自有仓']!='0'">自有仓</el-radio-button>
                  <el-radio-button class="marginBottom"  label="3" v-if="ButtonInfo['FBA']!='0'">FBA</el-radio-button>
                </el-radio-group>
              </div>
              <div class="marginBottom flex">
                <div class="span_label" >目的仓仓库</div>
                <el-radio-group v-model="defaultData.wIdStore" size="small"  class="flex1">
                  <el-radio-button class="marginBottom"  :label="item.whId" v-for="(item,index) in BasicsData2">{{ item.whName }}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="marginBottom flex" v-show="whTypeData.whType==='01'">
                <div class="span_label">运输方式</div>
                <el-radio-group v-model="defaultData.stockTransportType" size="small"  class="flex1">
                  <el-radio-button class="marginBottom"  :label="item.id" v-for="(item,index) in transports">{{ item.value }}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="marginBottom flex" v-show="whTypeData.whType!=='01'">
                <div class="span_label">物流方式</div>
                <el-radio-group v-model="defaultData.logisticsType" size="small"  class="flex1">
                  <el-radio-button class="marginBottom"   :label="item.id" v-for="(item,index) in transportss">{{ item.value }}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="marginBottom flex">
                <div class="span_label">状态</div>
                <el-radio-group v-model="state" size="small" class="flex1">
                  <el-radio-button  class="marginBottom" label="0"  v-if="ButtonInfo['待装箱']!='0'">待装箱</el-radio-button>
                  <el-radio-button  class="marginBottom" label="01" v-if="ButtonInfo['已装箱待调拨']!='0'">已装箱待调拨</el-radio-button>
                  <el-radio-button  class="marginBottom" label="02" v-if="ButtonInfo['已调拨出库']!='0'">已调拨出库</el-radio-button>
                  <el-radio-button  class="marginBottom" label="03" v-if="ButtonInfo['已到中转仓']!='0'">已到中转仓</el-radio-button>
                  <el-radio-button  class="marginBottom" label="04" v-if="ButtonInfo['已出中转仓']!='0'">已出中转仓</el-radio-button>
                  <el-radio-button  class="marginBottom" label="05" v-if="ButtonInfo['已部分入目的仓']!='0'">已部分入目的仓</el-radio-button>
                  <el-radio-button  class="marginBottom" label="06" v-if="ButtonInfo['已全部入目的仓']!='0'">已全部入目的仓</el-radio-button>
                </el-radio-group>
              </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
          <!--待装箱-->
        <div v-show="state==='0'">
          <el-tabs v-model="defaultData.packState" type="card" @tab-click="handleClick" style="margin-top: 20px" @click.native="getListData" v-if="objectiveDepotType==='1'">
            <el-tab-pane label="待装箱数据列表" name="0"  v-if="ButtonInfo['待装箱数据列表']!='0'"></el-tab-pane>
            <el-tab-pane label="已装箱数据列表" name="1"  v-if="ButtonInfo['已装箱数据列表']!='0'"></el-tab-pane>
          </el-tabs>
          <el-tabs v-model="FBAtype" type="card" @tab-click="handleClick" style="margin-top: 20px" @click.native="getListDatadel" v-if="objectiveDepotType==='3'">
            <el-tab-pane label="FBA待装箱" name="0"  v-if="ButtonInfo['FBA待装箱']!='0'"></el-tab-pane>
            <el-tab-pane label="FBA发货计划" name="1"  v-if="ButtonInfo['FBA发货计划']!='0'"></el-tab-pane>
            <el-tab-pane label="FNSKU标签" name="2"  v-if="ButtonInfo['FNSKU标签']!='0'"></el-tab-pane>
          </el-tabs>
          <el-row>
            <el-col :span="4"><el-input placeholder="请输入shipmentId" v-model="getFBAData.shipmentId" v-if="FBAtype==='1' && objectiveDepotType==='3'"></el-input></el-col>
            <el-col :span="4"><el-input placeholder="请输入SKU" v-model="defaultData.skuNo" v-if="FBAtype==='2' && objectiveDepotType==='3'"></el-input></el-col>
            <el-col :span="2">
              <el-button @click="getListData" type="primary" size="small" v-if="FBAtype==='1' && objectiveDepotType==='3'" style="margin-top: 5px; margin-left: 10px">搜 索</el-button>
              <el-button @click="getListData" type="primary" size="small" v-if="FBAtype==='2' && objectiveDepotType==='3'" style="margin-top: 5px; margin-left: 10px">搜 索</el-button>
            </el-col>
          </el-row>
          <el-row class="supplier_btn" v-if="defaultData.packState==='0'">
            <el-button type="primary" size="small"  v-if="ButtonInfo['打印当前页拣货单']!='0' && objectiveDepotType==='1'"class="el-icon-plus" @click="PickingOrderFn()">打印当前页拣货单</el-button>
            <el-button type="primary" size="small" v-if="ButtonInfo['筛选']!='0' && FBAtype==='0'" @click="ScreenDialog=true; addDialogFn();" >筛选</el-button>
          </el-row>
          <el-row class="supplier_btn" v-if="objectiveDepotType==='3' && FBAtype==='0'">
            <el-button type="primary" size="small" v-if="ButtonInfo['创建FBA发货计划']!='0'" @click="EstablishFn('创建FBA发货计划')" >创建FBA发货计划</el-button>
          </el-row>
          <!--FBA待装箱-->
          <div id="item_listBorder" v-show="FBAtype==='0'">
            <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChanges">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column width="150" id="space" label="操作" align="center" >
              <template scope="scope">
                <el-tooltip content="打印商品标签"  effect="dark" placement="bottom"      v-if="ButtonInfo['打印商品标签']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'打印商品标签')">&#xe638;</i>
                </el-tooltip>
                <el-tooltip content="装箱&调拨详情"  effect="dark" placement="bottom"      v-if="ButtonInfo['装箱&调拨详情']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'装箱&调拨详情');dialogFlag.infoDetail=true;">&#xe600;</i>
                </el-tooltip>
                <el-tooltip content="申报故障品"  effect="dark" placement="bottom" v-if="defaultData.packState==='0' && ButtonInfo['申报故障品']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'申报故障品');dialogFlag.dialogTitle='申报故障品';dialogFlag.isOpen=true;">&#xe7b1;</i>
                </el-tooltip>
                <el-tooltip content="申报数量异常"  effect="dark" placement="bottom" v-if="defaultData.packState==='0' && ButtonInfo['申报数量异常']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'申报数量异常');dialogFlag.dialogTitle='申报数量异常';dialogFlag.isOpen=true;">&#xe667;</i>
                </el-tooltip>
                <!--<el-tooltip content="作废"  effect="dark" placement="bottom" >-->
                  <!--<i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'作废')">&#xe6f7;</i>-->
                <!--</el-tooltip>-->
              </template>
            </el-table-column>
            <el-table-column sortable label="SKU" align="center" prop="skuNo"></el-table-column>
            <el-table-column sortable label="图片" align="center">
              <template scope="scope">
                <img v-show="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column sortable label="商品名称" align="center" prop="productName"></el-table-column>
            <el-table-column sortable label="待装箱数量" align="center" prop="availableQty" v-if="defaultData.packState==='0'"></el-table-column>
            <el-table-column sortable label="已装箱数量" align="center" prop="localkedQty"  v-if="defaultData.packState==='1'"></el-table-column>
            <el-table-column sortable label="始发仓" align="center" prop="whId"></el-table-column>
            <el-table-column sortable label="目的仓" align="center" prop="wIdStore"></el-table-column>
            <el-table-column sortable label="运输方式" align="center" prop="stockTransportType">
              <template scope="scope">
                <span v-show="scope.row.stockTransportType!==''">{{ scope.row.stockTransportType}}</span>
                <span v-show="scope.row.logisticsType!==''">{{ scope.row.logisticsType}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="报关数量" align="center" prop="customsCount"></el-table-column>
            <el-table-column sortable label="中转仓" align="center" prop="transitWhId"></el-table-column>
            <el-table-column sortable label="关联采购订单" align="center" prop="cgNo"></el-table-column>
            <el-table-column sortable label="所属备货计划" align="center" prop="stockNo"></el-table-column>
           </el-table>
        </div>
          <!--FBA发货计划-->
          <div class="item_listBorder" v-show="FBAtype==='1'">
            <el-table :data="FBAlist" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column width="150" id="space" label="操作" align="center" >
                <template scope="scope">
                  <el-tooltip content="退回"  effect="dark" placement="bottom" v-if="ButtonInfo['退回']!='0'">
                    <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'退回')">&#xe62a;</i>
                  </el-tooltip>
                  <el-tooltip content="FBA计划清单"  effect="dark" placement="bottom"  v-if="ButtonInfo['FBA计划清单']!='0'">
                    <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'FBA计划清单')">&#xe600;</i>
                  </el-tooltip>
                  <el-tooltip content="打印拣货单"  effect="dark" placement="bottom" v-if="ButtonInfo['打印拣货单']!='0'">
                    <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'打印拣货单')">&#xe638;</i>
                  </el-tooltip>
                  <el-tooltip content="打印FNSKU"  effect="dark" placement="bottom" v-show="objectiveDepotType==='3' && ButtonInfo['打印FNSKU']!='0'">
                    <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'打印FNSKU')">&#xe638;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column sortable label="shipment ID" align="center" prop="shipmentId"></el-table-column>
              <el-table-column sortable label="amazon 账号" align="center" prop="amazonNo"></el-table-column>
              <el-table-column sortable label="目的国家" align="center" prop="toCountryNo"></el-table-column>
              <el-table-column sortable label="FBA创建人" align="center" prop="shippmentAddUser"></el-table-column>
              <el-table-column sortable label="创建计划时间" align="center" :formatter="tool.formatDate" prop="shippmentAddTime"></el-table-column>
              <el-table-column sortable label="运输方式" align="center" prop="">
                <template scope="scope">
                  <span v-show="scope.row.transportType!==''">{{ scope.row.transportType}}</span>
                  <span v-show="scope.row.logisticsType!==''">{{ scope.row.logisticsType}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column sortable label="是否中转" align="center" prop=""></el-table-column>-->
            </el-table>
          </div>
          <!--FNSKU标签-->
          <div class="item_listBorder" v-show="FBAtype==='2'">
            <el-table :data="FBAlist2" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column width="150" id="space" label="操作" align="center" >
                <template scope="scope">
                  <el-tooltip content="打印FNSKU"  effect="dark" placement="bottom" v-if="ButtonInfo['打印FNSKU']!='0'">
                    <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'打印FNSKU')">&#xe638;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column sortable label="SKU" align="center" prop="skuNo"></el-table-column>
              <el-table-column sortable label="图片" align="center">
                <template scope="scope">
                  <img v-show="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
                </template>
              </el-table-column>
              <el-table-column sortable label="商品名称" align="center" prop="productName"></el-table-column>
              <el-table-column sortable label="FNSKU" align="center" prop="fnSKu"></el-table-column>
              <el-table-column sortable label="目的仓" align="center" prop="wIdStore"></el-table-column>
              <el-table-column sortable label="运输方式" align="center" prop="">
                <template scope="scope">
                  <span v-show="scope.row.stockTransportType!==''">{{ scope.row.stockTransportType}}</span>
                  <span v-show="scope.row.logisticsType!==''">{{ scope.row.logisticsType}}</span>
                </template>
              </el-table-column>
              <el-table-column sortable label="创建时间" align="center" :formatter="tool.formatDate" prop="shippmentAddTime"></el-table-column>
              <el-table-column sortable label="数量" align="center" prop="planQty"></el-table-column>
              <el-table-column sortable label="所属备货计划" align="center" prop="stockNo"></el-table-column>
            </el-table>
          </div>
      </div>
      <!--已装箱 待调拨-->
      <div v-show="state==='01'">
        <el-tabs v-model="defaultData.cartonState" type="card" @tab-click="handleClick" style="margin-top: 20px" @click.native="getListData">
          <el-tab-pane label="正常待调拨箱唛" name="1"   v-if="ButtonInfo['正常待调拨箱唛']!='0'"></el-tab-pane>
          <el-tab-pane label="已作废箱唛" name="0"   v-if="ButtonInfo['已作废箱唛']!='0'"></el-tab-pane>
        </el-tabs>
        <el-row>
          <el-col :span="4">
            <el-input v-model="transportVal" @change="selectFilter()"></el-input>
          </el-col>
          <el-col :span="2">
            <el-select  placeholder="请选择" v-model="transportTF" clearable filterable @change="selectFilter()">
              <el-option
                v-for="(item,index) in transport"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" size="small" @click="getListData()" style="margin-top: 5px; margin-left: 10px">搜索</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 6px">
          装箱信息：已装箱 <span class="textColor">{{BasicsData3.countCartonInfos}}</span> 箱，装箱总计 <span class="textColor">{{BasicsData3.totalWeghit}}</span> KG，<span class="textColor">{{BasicsData3.totaVolume}}</span> m³
          <span class="Astyel" style="margin-left: 20px" @click="getBoardNoInfo()">查看卡板标签</span>
        </el-row>
        <el-row class="supplier_btn" v-if="defaultData.cartonState==='1'">
          <el-button type="primary" size="small"     v-if="ButtonInfo['创建调拨并出库']!='0'"  @click="EstablishFn('创建调拨并出库');">创建调拨并出库</el-button>
          <el-button type="primary" size="small"     v-if="ButtonInfo['批量打印']!='0'"  @click="EstablishFn('批量打印');">批量打印</el-button>
          <el-button type="primary" size="small"     v-if="ButtonInfo['批量作废']!='0'"  @click="EstablishFn('批量作废');">批量作废</el-button>
          <el-button type="primary" size="small"     v-if="ButtonInfo['生成卡板标签']!='0'"  @click="EstablishFn('生成卡板标签');">生成卡板标签</el-button>
        </el-row>
        <el-row class="supplier_btn" v-if="defaultData.cartonState==='0' && ButtonInfo['批量恢复']!='0'" >
          <el-button type="primary" size="small"   @click="EstablishFn('批量恢复');">批量恢复</el-button>
        </el-row>
        <div class="item_listBorder">
          <el-table :data="TableData2" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChanges">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column width="150" id="space" label="操作" align="center" >
              <template scope="scope">
                <el-tooltip content="打印"  effect="dark"  v-if="defaultData.cartonState == 1  && ButtonInfo['打印']!='0'" placement="bottom" >
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'打印2')">&#xe638;</i>
                </el-tooltip>
                <el-tooltip content="装箱详情"  effect="dark" placement="bottom"     v-if="ButtonInfo['装箱详情']!='0'" >
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'装箱详情'); dialogFlag.zhuangXiang=true;">&#xe600;</i>
                </el-tooltip>
                <el-tooltip content="装箱清单"  effect="dark" placement="bottom"     v-if="ButtonInfo['装箱清单']!='0'" >
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'装箱清单');;">&#xe6a9;</i>
                </el-tooltip>
                <el-tooltip content="恢复"  effect="dark" placement="bottom" v-show="defaultData.cartonState == 0  && ButtonInfo['恢复']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'恢复');">&#xe666;</i>
                </el-tooltip>
                <el-tooltip content="作废"   v-if="defaultData.cartonState == 1  && ButtonInfo['作废']!='0'" effect="dark" placement="bottom" >
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'作废');">&#xe6f7;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column sortable label="箱唛编号" align="center" >
              <template scope="scope">
               {{scope.row.cartonNo }}
              </template>
            </el-table-column>
            <el-table-column sortable label="箱号" align="center" prop="cartonIndex"></el-table-column>
            <el-table-column sortable label="产品种数" align="center" prop="productCategoryCount"></el-table-column>
            <el-table-column sortable label="数量总计" align="center" prop="productCount"></el-table-column>
            <!--<el-table-column sortable label="始发仓" align="center" prop="whId"></el-table-column>-->
            <!--<el-table-column sortable label="目的仓" align="center" prop="wIdStore"></el-table-column>-->
            <el-table-column sortable label="报关与否" align="center">
              <template scope="scope">
                {{scope.row.isCustoms }}
              </template>
            </el-table-column>
            <el-table-column sortable label="重量" align="center" prop="maxWeight"></el-table-column>
            <el-table-column sortable label="长" align="center" prop="maxLength"></el-table-column>
            <el-table-column sortable label="宽" align="center" prop="maxWidth"></el-table-column>
            <el-table-column sortable label="高" align="center" prop="maxHeight"></el-table-column>
            <el-table-column sortable label="体积" align="center" >
              <template scope="scope">
                {{scope.row.maxLength * scope.row.maxWidth * scope.row.maxHeight }} cm³
              </template>
            </el-table-column>
            <el-table-column sortable label="是否有卡板标签" align="center">
              <template scope="scope">
                {{scope.row.boardNo===null ? '否':'是' }}
                <!--<span v-text="scope.row.boardNo=null ? '否':'是'"></span>-->
              </template>
            </el-table-column>
            <el-table-column sortable label="对应卡板标签编号" align="center" prop="boardNo"></el-table-column>
            <el-table-column sortable label="状态" align="center" prop="sate"></el-table-column>
          </el-table>
        </div>
      </div>
      <!------------------------------------------------------已到中转仓----------------------------------------------------------->
      <div v-show="state!=='0' && state!=='01'" style="margin-top: 20px">
        <div class="item_listBorder">
          <el-table :data="TableData3" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChangess">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column width="150" id="space" label="操作" align="center" >
              <template scope="scope">
                <el-tooltip content="查看调拨单"  effect="dark" placement="bottom" v-if="ButtonInfo['查看调拨单']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'查看调拨单')">&#xe600;</i>
                </el-tooltip>
                <el-tooltip content="打印调拨箱唛"  effect="dark" placement="bottom" v-if="ButtonInfo['打印调拨箱唛']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'打印调拨箱唛')">&#xe6a9;</i>
                </el-tooltip>
                <el-tooltip content="录入跟踪单号"  effect="dark" placement="bottom" v-if="ButtonInfo['录入跟踪单号']!='0'" >
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'录入跟踪单号');">&#xe617;</i>
                </el-tooltip>
                <el-tooltip content="导出报关装箱单"  effect="dark" placement="bottom" v-if="state==='2' && ButtonInfo['导出报关装箱单']!='0'">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'导出报关装箱单')">&#xe61b;</i>
                </el-tooltip>
                <!--<el-tooltip content="新建手动包裹单"  effect="dark" placement="bottom" v-if="(state==='03'|| state==='04') && ButtonInfo['新建手动包裹单']!='0'">-->
                  <!--<i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'新建手动包裹单')">&#xe639;</i>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip content="标记发货2"  effect="dark" placement="bottom" v-if="state==='03'|| state==='04' || state==='05'">-->
                  <!--<i  class="iconfontyyy" content="Bottom center" @click="RowFn(scope.row,'标记发货2')">&#xe61b;</i>-->
                <!--</el-tooltip>-->
              </template>
            </el-table-column>
            <el-table-column sortable label="调拨单" align="center" prop="transferNo"></el-table-column>
            <el-table-column sortable label="调拨类型" align="center" prop="transferType"></el-table-column>
            <el-table-column sortable label="始发仓" align="center" prop="whId"></el-table-column>
            <el-table-column sortable label="中转仓" align="center" prop="transitWhId"></el-table-column>
            <el-table-column sortable label="目的仓" align="center" prop="wIdStore"></el-table-column>
            <el-table-column sortable label="运输方式" align="center" >
              <template scope="scope">
                <span v-show="scope.row.stockTransportType!==''">{{ scope.row.stockTransportType}}</span>
                <span v-show="scope.row.logisticsType!==''">{{ scope.row.logisticsType}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="状态" align="center" prop="sate"></el-table-column>
            <el-table-column sortable label="始发仓出仓时间" align="center" prop="sendOutTime"  :formatter="tool.formatDate"></el-table-column>
            <el-table-column sortable label="中转仓首次标记时间" align="center" prop="transtSignTime" :formatter="tool.formatDate"></el-table-column>
            <el-table-column sortable label="目的仓首次签收时间" align="center" prop="storeTime" :formatter="tool.formatDate"></el-table-column>
            <el-table-column sortable label="创建人" align="center" prop="creatUser"></el-table-column>
            <el-table-column sortable label="创建时间" align="center" prop="creatTime" :formatter="tool.formatDate"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--筛选框-->
    <div class="smallDia" >
      <el-dialog title="筛选" :visible.sync="ScreenDialog" size="small" :close-on-click-modal="false" @open="DeleteScreen">
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
              <el-input v-model="screenData.skuNo">
              </el-input>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">是否报关</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                <el-option
                  v-for="(item,index) in DeclareAtCustoms"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">特殊属性</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-cascader
                expand-trigger="hover"
                :options="AttributeData"
                v-model="AttributeDatas"
                @change="handleChange"
                :props="props"
                change-on-select="true">
              </el-cascader>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">关联采购订单</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-input v-model="screenData.cgNo">
              </el-input>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">所属备货计划</el-col>
            <el-col class="tatestyle" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <el-input v-model="screenData.stockNo">
              </el-input>
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
    <!--  待装箱下的----装箱&调拨详情--------------------------->
    <el-dialog title="装箱&调拨详情" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" >
      <el-form :model="infoForm">
        <el-form-item label="应装箱数量：" class="form-item">{{ SeeinfoData.count}}</el-form-item>
        <el-form-item label="报关数量：" class="form-item">{{ SeeinfoData.customsCount}}</el-form-item>
        <el-form-item label="待装箱数量：" class="form-item">{{ SeeinfoData.unlockedQty}}</el-form-item>
        <el-form-item label="已装箱数量：" class="form-item">{{ SeeinfoData.lockedQty}}({{ SeeinfoData.locakedBoxCount}})</el-form-item>
        <el-form-item label="已调拨数量：" class="form-item">{{ SeeinfoData.sendOutQty}}({{ SeeinfoData.sendOutBoxCount}})</el-form-item>
        <el-col :span="12" >
          <div v-for="(item,index) in SeeinfoData.lockedInfo" >
            <div style="margin-bottom: 10px;">已装箱箱唛：</div>
            <el-row style="text-align: left;border: solid 1px #ccc;border-right: solid 1px #ccc; ">
              <el-row style="border-bottom: solid 1px #ccc;">
                <el-col :span="6" style="padding: 10px;"><img :src="item.qrCodeURl" alt="二维码" style="width: 100%;height: 100px;"></el-col>
                <el-col :span="18" >
                  <el-col :span="16" class="breakAll" style="padding:10px 10px 10px 0;border-right: solid 1px #ccc;">
                    <span>箱唛编号：{{ item.cartonNo }}</span><br/>
                    <span>{{ item.whId }}-->{{ item.transitWhId }}-->{{ item.toWhId }}</span><br/>
                    <span >重量：{{ item.maxWeight }}</span><br/>
                    <span >体积：{{ item.maxLength }}*{{ item.maxWidth }}*{{ item.maxHeight }}cm=<span v-text="item.maxLength*item.maxWidth*item.maxHeight"></span>cm3</span><br/>
                  </el-col>
                  <el-col :span="8">
                    <div class="padding-style">
                      <span>报关</span>
                      <el-radio-group v-model="item.isCustoms" style="margin-left: 10px;" disabled="true">
                        <el-radio label="1">是</el-radio><br/>
                        <el-radio label="0">否</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="box-style">
                      <span>箱号</span>
                      <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ item.PNo}}</h3>
                      <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ item.cartonIndex}}</h3>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
              <el-col style="margin:10px">
                <span class="" >物品个数总计（{{ item.productCategoryCount}}种）/物品数量总计（{{ item.productCount}}个）</span><br/>
              </el-col>
              <div style="margin:10px" class="breakAll" v-for="(items,index) in item.infos">
                <span class="">编号:{{ items.stockNo }}</span><span style="margin: 0 20px;">SKU:{{ items.skuNo }}</span><span>数量:{{ items.productCount }}</span><br/>
                <span class="">物品名称：{{ items.productName }}</span><br/>
              </div>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12" >
          <div v-for="(item,index) in SeeinfoData.sendOutInfo" >
            <div style="margin-bottom: 10px;">已调拨箱唛：</div>
            <el-row style="text-align: left;border: solid 1px #ccc;border-right: solid 1px #ccc; ">
              <el-row style="border-bottom: solid 1px #ccc;">
                <el-col :span="6" style="padding: 10px;"><img :src="item.qrCodeURl" alt="二维码" style="width: 100%;height: 100px;"></el-col>
                <el-col :span="18" >
                  <el-col :span="16" class="breakAll" style="padding:10px 10px 10px 0;border-right: solid 1px #ccc;">
                    <span>箱唛编号：{{ item.cartonNo }}</span><br/>
                    <span>{{ item.whId }}-->{{ item.transitWhId }}-->{{ item.toWhId }}</span><br/>
                    <span >重量：{{ item.maxWeight }}</span><br/>
                    <span >体积：{{ item.maxLength }}*{{ item.maxWidth }}*{{ item.maxHeight }}cm=<span v-text="item.maxLength*item.maxWidth*item.maxHeight"></span>cm3</span><br/>
                  </el-col>
                  <el-col :span="8">
                    <div class="padding-style">
                      <span>报关</span>
                      <el-radio-group v-model="item.isCustoms" style="margin-left: 10px;" disabled="true">
                        <el-radio label="1">是</el-radio><br/>
                        <el-radio label="0">否</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="box-style">
                      <span>箱号</span>
                      <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ item.PNo}}</h3>
                      <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ item.cartonIndex}}</h3>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
              <el-col style="margin:10px">
                <span class="" >物品个数总计（{{ item.productCategoryCount}}种）/物品数量总计（{{ item.productCount}}个）</span><br/>
              </el-col>
              <div style="margin:10px" class="breakAll" v-for="(items,index) in item.infos">
                <span class="">编号:{{ items.stockNo }}</span><span style="margin: 0 20px;">SKU:{{ items.skuNo }}</span><span>数量:{{ items.productCount }}</span><br/>
                <span class="">物品名称：{{ items.productName }}</span><br/>
              </div>
            </el-row>
          </div>

        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">关 闭</el-button>
      </div>
    </el-dialog>
    <!--  待装箱下的----生成卡板标签--------------------------->
    <el-dialog title="生成卡板标签" :visible.sync="GenerateCardDal" size="tiny" :close-on-click-modal="false" >
      <el-form :model="infoForm">
        <el-col :span="12">
          <el-row style="text-align: left;border: solid 1px #ccc;border-right: solid 1px #ccc; ">
            <el-row style="border-bottom: solid 1px #ccc;">
              <el-col :span="6" style="padding: 10px;"><img v-if="generateCardData.qrCodeUrl!=null" :src="generateCardData.qrCodeUrl" alt="二维码" style="width: 100%;height: 100px;"></el-col>
              <el-col :span="18" >
                <el-col :span="16" class="breakAll" style="padding:10px 10px 10px 0;border-right: solid 1px #ccc;">
                  <span>箱唛编号：{{ generateCardData.boardNo }}</span><br/>
                  <span>{{ generateCardData.whId }}-->{{ generateCardData.transitWhId }}-->{{ generateCardData.wIdStore }}</span><br/>
                  <span >重量：{{ generateCardData.totalWeight }}</span><br/>
                  <!--<span >体积：{{ generateCardData.totalLength }}*{{ generateCardData.totalWidth }}*{{ generateCardData.totalHeight }}cm=<span v-text="generateCardData.totalLength*generateCardData.totalWidth*generateCardData.totalHeight"></span>cm3</span><br/>-->
                  <span >体积：{{ generateCardData.totalVolume }}<span>cm3</span></span><br/>
                </el-col>
                <el-col :span="8">
                  <div class="padding-style">
                    <span>报关</span>
                    <el-radio-group v-model="generateCardData.isCustoms" style="margin-left: 10px;" disabled="true">
                      <el-radio label="1">是</el-radio><br/>
                      <el-radio label="0">否</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="box-style">
                    <span>箱号详情</span>
                    <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ generateCardData.boxNu}}</h3>
                  </div>
                </el-col>
              </el-col>
            </el-row>
            <div style="margin:10px" class="breakAll">
              <span class="">毛重总计:{{ generateCardData.maxWeight }}</span><br/>
              <span class="">箱数总计:{{ generateCardData.boxCount }}</span><br/>
              <span class="">物品个数总计：{{ generateCardData.productCategoryCount }}</span><br/>
              <span class="">物品数量总计：{{ generateCardData.productCount }}</span><br/>
            </div>
          </el-row>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="GenerateCardDal = false;">关闭</el-button>
        <el-button type="primary" @click="infoDetailFn(); " :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--  待装箱下的----申报故障品 及 数量异常  及调拨下的----标记发货--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="tiny" @close="closeData">
      <el-form :model="infoForm" style="margin-left:20px;">
        <el-form-item  v-if="dialogFlag.dialogTitle == '申报数量异常'" label="原始数量：" >{{ NumberAbnormal}}</el-form-item>
        <el-form-item  v-if="dialogFlag.dialogTitle == '申报数量异常'" label="实际数量：" ><el-input v-model="declareData.qty" type="text"></el-input></el-form-item>
        <el-form-item  v-if="dialogFlag.dialogTitle == '申报故障品'" label="故障品数量：" ><el-input v-model="declareData.qty" type="text"></el-input></el-form-item>
        <el-form-item  v-if="dialogFlag.dialogTitle != '录入跟踪单号'"  label="备注：" ><el-input v-model="declareData.note" type="textarea"></el-input></el-form-item>
        <el-row v-if="dialogFlag.dialogTitle == '录入跟踪单号'">
          <!--<span>物流方式: {{ RowStockTransportTypeId }}</span>-->
          <!--<el-select  placeholder="请选择" v-model="TrackNumberdata.logisticsType" clearable filterable>-->
            <!--<el-option-->
              <!--v-for="(item,index) in transportsss"-->
              <!--:key="item.id"-->
              <!--:label="item.value"-->
              <!--:value="item.id"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-row>
        <el-form-item  v-if="dialogFlag.dialogTitle == '录入跟踪单号'"  label="跟踪单号：" >
          <el-input v-model="PostTrackingList.trackingNo" type="textarea" placeholder="多个跟踪单号请用“，”隔开 "></el-input>
        </el-form-item>
        <el-form-item  v-if="dialogFlag.dialogTitle == '录入跟踪单号'"  label="备注：" >
          <el-input v-model="PostTrackingList.note" type="textarea" placeholder="备注 "></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;">关闭</el-button>
        <el-button type="primary" @click="declareFn(); " :loading="$store.state.loading" v-show="dialogFlag.dialogTitle !== '录入跟踪单号'">确 定</el-button>
        <el-button type="primary" @click="TrackingListFn('1'); " :loading="$store.state.loading" v-show="dialogFlag.dialogTitle === '录入跟踪单号'">确 定</el-button>
      </div>
    </el-dialog>
    <!--  已装箱下的----箱唛--------------------------->
    <el-dialog title="箱唛" :visible.sync="dialogFlag.zhuangXiang" :close-on-click-modal="false"  size="tiny" @close="closeData">
      <el-form :model="infoForm">
          <el-row style="text-align: left;border: solid 1px #ccc;border-right: solid 1px #ccc; ">
            <el-row style="border-bottom: solid 1px #ccc;">
              <el-col :span="6" style="padding: 10px;"><img :src="AlreadyPackingData.qrCodeURl" alt="二维码" style="width: 100%;height: 100px;"></el-col>
              <el-col :span="18" >
                <el-col :span="16" class="breakAll" style="padding:10px 10px 10px 0;">
                  <span>箱唛编号：{{ AlreadyPackingData.cartonNo }}</span><br/>
                  <span>{{ AlreadyPackingData.whId }}-->{{ AlreadyPackingData.transitWhId }}-->{{ AlreadyPackingData.toWhId }}</span><br/>
                  <span >重量：{{ AlreadyPackingData.maxWeight }}</span><br/>
                  <span >体积：{{ AlreadyPackingData.maxLength }}*{{ AlreadyPackingData.maxWidth }}*{{ AlreadyPackingData.maxHeight }}={{ AlreadyPackingData.maxLength*AlreadyPackingData.maxWidth*AlreadyPackingData.maxHeight }}cm3</span><br/>
                </el-col>
                <el-col :span="8" style="border-left: solid 1px #ccc;">
                  <div class="padding-style">
                    <span>报关</span>
                    <el-radio-group v-model="AlreadyPackingData.isCustoms" style="margin-left: 10px;" disabled="true">
                      <el-radio label="1">是</el-radio><br/>
                      <el-radio label="0">否</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="box-style">
                    <span>箱号</span>
                    <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ AlreadyPackingData.cartonIndex }}</h3>
                    <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ AlreadyPackingData.pno }}</h3>
                  </div>
                </el-col>
              </el-col>
            </el-row>
            <el-col style="margin:10px">
              <span class="" >物品个数总计（{{ AlreadyPackingData.productCategoryCount}}种）/物品数量总计（{{ AlreadyPackingData.productCount}}个）</span><br/>
            </el-col>
            <div style="margin:10px" class="breakAll" v-for="(items,index) in AlreadyPackingData.infos">
              <span class="" v-if="index < 2">编号:{{ items.stockNo }}</span><span style="margin: 0 20px;">SKU:{{ items.skuNo }}</span><span>数量:{{ items.productCount }}</span><br/>
              <span class="" v-if="index < 2">物品名称：{{ items.productName }}</span><br/>
            </div>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.zhuangXiang = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!--  已装箱下的----装箱清单--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.zhuangXiang2" :close-on-click-modal="false" size="small" @close="closeData">
      <div class="table_padding">
        <el-table :data="SeePackingData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" ></el-table-column>
          <el-table-column sortable label="SKU" align="center" prop="skuNo"></el-table-column>
          <el-table-column sortable label="图片" align="center" prop="stockNo">
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
            </template>
          </el-table-column>
          <el-table-column sortable label="商品名称" align="center" prop="productName"></el-table-column>
          <el-table-column sortable label="数量" align="center" prop="productCount"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.zhuangXiang2 = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!--  已装箱下的----中转调拨--------------------------->
    <el-dialog title="提示" :visible.sync="EstablishDal.EstablishDal" :close-on-click-modal="false" size="tiny" @close="closeData">
      <div>
        <el-row style="text-align: center">
          <span >您确定将所选箱唛创建调拨？如需中转，请选择具体的中转仓！</span>
        </el-row>
        <el-row style="padding-left: 72px; margin-top: 10px">
          <el-col :span="5" style="margin-top: 6px">中转仓选择</el-col>
          <el-col :span="12">
            <el-select  placeholder="请选择" v-model="EstablishData.transitWhId" clearable filterable>
              <el-option
                v-for="(item,index) in transferList"
                :key="item.whId"
                :label="item.whName"
                :value="item.whId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EstablishDal.EstablishDal = false;">关闭</el-button>
        <el-button type="primary" @click="Establish(); " :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--  手动包裹单--------------------------->
    <el-dialog title="选择箱号新建手动包裹单" :visible.sync="packageDal" :close-on-click-modal="false" size="tiny" @close="closeData2">
      <el-row style="margin-bottom: 10px">
        <LogisticsType @assignment="SonData" ref="LogisticsType"></LogisticsType>
      </el-row>
      <el-row>
        <el-checkbox-group v-model="pustpackage.cartonId">
          <el-col :span="2" v-for="(item,index) in packageList">
            <el-checkbox :label="item.cartonId">{{ item.cartonIndex }}</el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="packageDal = false;">关闭</el-button>
        <el-button type="primary" @click="pustpackageFn();" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
      <!--  跟踪单--------------------------->
    <el-dialog title="录入跟踪单号" :visible.sync="TrackingListDal" :close-on-click-modal="false" size="small" @close="closeData">
      <el-row>
        <el-row style="margin-bottom: 15px">
          <span style="font-size: 21px">基本信息</span>
        </el-row>
        <el-row>
          <el-col :span="6" class="text-R">调拨单编号：</el-col>
          <el-col :span="15" style="margin-left: 40px">{{ TrackingListData.transferNo}}</el-col>
        </el-row>
        <!--<el-row>-->
          <!--<el-col :span="6" class="text-R">物流方式：</el-col>-->
          <!--<el-col :span="15" style="margin-left: 40px">{{ TrackingListData.stockTransportTypeId }}</el-col>-->
        <!--</el-row>-->
        <el-row>
          <el-col :span="6" class="text-R">调拨单创建人：</el-col>
          <el-col :span="15" style="margin-left: 40px">{{ TrackingListData.creatUser}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="text-R">调拨单创建时间：</el-col>
          <el-col :span="15" style="margin-left: 40px"><span v-text="tool.formatDate('','',TrackingListData.creatTime)"></span></el-col>
        </el-row>
      </el-row>
      <!--TrackingListDataItem-->
      <el-row style="margin-bottom: 15px">
        <span style="font-size: 21px">调拨详情</span>
      </el-row>
      <div class="item_list">
        <el-table :data="TrackingListDataItem" border tooltip-effect="dark" style="width: 100%"  >
          <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
          <el-table-column sortable prop="cartonIndex" label="箱号" align="center"></el-table-column>
          <el-table-column sortable label="跟踪单号" align="center">
            <template scope="scope">
              <el-input v-model="PostTrackingList.trackingNo"></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable prop="whId" label="始发仓" align="center"></el-table-column>
          <el-table-column sortable prop="transitWhId" label="中转仓" align="center"></el-table-column>
          <el-table-column sortable prop="wIdStore" label="目的仓" align="center"></el-table-column>
          <el-table-column sortable prop="creatUser" label="创建人" align="center"></el-table-column>
          <el-table-column sortable prop="creatTime" label="创建时间" align="center" :formatter="tool.formatDate"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TrackingListDal = false;">关闭</el-button>
        <el-button type="primary" @click="TrackingListFn('1'); " :loading="$store.state.loading">保存跟踪单号</el-button>
        <!--<el-button type="primary" @click="TrackingListFn('2'); " :loading="$store.state.loading">标记发货</el-button>-->
      </div>
    </el-dialog>
    <!--  请选择物流方式--------------------------->
    <el-dialog title="请选择物流方式" :visible.sync="logististicTypeDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData2">
      <LogisticsType @assignment="SonData" ref="LogisticsType"></LogisticsType>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logististicTypeDal.Dal = false;">关闭</el-button>
        <el-button type="primary" @click="logististicTypeFn(); " :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ElCol from "element-ui/packages/col/src/col";
  import ElRow from "element-ui/packages/row/src/row";
  import LogisticsType from "./printPage/LogisticsType.vue";
  import { SpecialAttributes } from 'views/product/import_modular';
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default{
    components:{
      ElButton,
      ElInput,
      ElRow,
      ElCol,
      SpecialAttributes,
      LogisticsType
    },
    data(){
      return {
        DeclareAtCustoms: [{
          value: 'true',
          label: '是'
        },
          {
          value: 'false',
          label: '否'
        }],
        value: '',
        infoForm:{
            a:''
        },
        state:'0',
        radio2:3,
        TableListData:[],
        stateList:[],
        defaultData: {
          wIdStart:'',//始发仓
          wIdStore:'',//目的仓仓库id
          skuNo:'',
          isCustoms:'',//是否报关
          attributeId:[],//属性Id
          cgNo:'',//采购单号
          stockNo:'',//备货单号
          cartonNo:'',//箱唛编号
          boardNo:'',//卡板标签编号
          packState:'0',//装箱状态
          cartonState:'1',//箱唛状态
          stockTransportType:'',//运输方式
          logisticsType:'',//物流方式
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
          fbaType:'0', //fba类型
        },
        defaultData2:{
          status:'',
          whId:'',//始发仓
          wIdStore:'',//目的仓仓库id
          stockTransportType:'01',//运输方式
          logisticsType:'',//物流方式
        },
        activeName:'1',
        activeName2:'1',
        ScreenData:{
          dis:false,
          stateName:'草稿',
          nodeId:'',
          nodeName:''
        },
        objectiveDepotType:'1',//目的仓类型
        FBAtype:'0',//目的仓类型
        dialogFlag: {
          isOpen: false,
          zhuangXiang: false,
          zhuangXiang2: false,
          infoDetail: false,
          dialogTitle: "",
          inputDisabled: false,
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
        screenData:{//筛选
          stockNo:'',//所属备货计划
          cgNo:'',//关联采购订单
          skuNo:'',//Sku
          isCustoms:'',//是否报关
          attributeId:[],//属性Id
        },
        SonAttribute:[],
        transport:[
          {label:'箱唛编号',value:'0'},
          {label:'卡板标签编号',value:'1'}
        ],
        transportTF:'0',
        transportVal:'',
        SonDis:false,
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
        TableData:[],
        TableData2:[],
        TableData3:[],
        sels:[],    //批量删除已选的条目数
        sels2:[],    //批量删除已选的条目数
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
        BasicsData1:[],
        BasicsData2:[],
        BasicsData3:{},//装箱待调拨，统计装箱信息
        BasicsData4:[],
        transports:[],//运输方式
        transportss:[],//物流方式
        transportsss:[],//调拨发货下物流方式
        declareData:{//申报故障
          taskId:'',
          qty:'',
          note:''
        },
        NumberAbnormal:'',//原始数量
        ObjisOwn:{
          isOwn:'1',//仓库类型
        },
        SeeinfoData:{},
        taskId:[],
        cartonId:[],
        EstablishData:{//创建调拨并出库
          transitWhId:'',
          cartonId:[],
        },
        transferList:[],//中转仓库
        EstablishDal:{
          EstablishDal:false,
          dis:false,
        },
        BoardNoInfo:{
          whId:'',//始发仓
          wIdStore:'',//目的仓
          stockTransportType:'',//物流方式
          type:'',//
        },
        TrackNumberdata:{//标记发货
          transferId:'',//调拨单Id
          trakingNo:'',//单号
          note:'',
          logisticsType:''
        },
        RowStockTransportTypeId:'',
        SeePacking:{//装箱待调拨 查看装箱清单
          cartonId:'1',
          type:'1',
        },
        SeePackingData:[],
        AlreadyPackingData:{},
        AttributeData:[],
        AttributeDatas:[],
        props:{
          value:'attributeId',
          label:'cnName',
          children:'info'
        },
        packageDal:false,
        packageList:[],
        pustpackage:{
          cartonId:[],
          logististicType:{},
//          transferId:''
        },
        TrackingListDal:false,
        TrackingListData:{},
        TrackingListDataItem:[
          {
            cartonIndex:'',
            whId:'',
            transitWhId:'',
            wIdStore:'',
            trackingNo:'',
            creatTime:'',
            creatUser:'',
          }
        ],
        PostTrackingList:{
          transferId:'',
          trackingNo:'',
          state:'1',
          note:''
        },
        GenerateCardDal:false,
        generateCardData:{},
        infoDetailData:{//生成标签确定
          cartonId:[],
          boardNo:'',
        },
        wIdStartName:'',
        whTypeData:{
          whId:'',//
          whType:'01',//01为本地运输方式 02其它为海外仓运输方式
        },
        startType:'',
        startTypeName:'',
        logististicTypeDal:{//
          Dal:false,
          Dis:false,
          type:'',
        },
        signData:{
          logististicType:{},
          transferId:''
        },
        signData2:{
          logististicType:{},
          cartonId:[],
        },
        logististicType:{},//物流对象
        ButtonInfo:{},//按钮权限列表20171227
        getFBAData:{
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
          shipmentId: '',//shipment ID（选填）
          wIdStart: '',//始发仓
          wIdStore: '',//目的仓仓库id
          logisticsType: '',//物流方式
          stockTransportType: '',//运输方式
        },
        FBAlist:[],
        FBAlist2:[],

      }
    },
    watch:{
      'state':{
        handler(val){
          this.getListData(val);
          if(val==='0' ){
            this.defaultData.packState='0';
            this.defaultData.cartonState=''
          }else if(val==='01'){
            this.defaultData.packState='';
            this.defaultData.cartonState='1'
          }
        }
      },
      'defaultData.wIdStart':{
        handler(val){
          this.getTransport();
          this.whTypeData.whId=val;
          for(let i=0; i<this.BasicsData1.length; i++){
              if(this.BasicsData1[i].whId===val){
                this.whTypeData.whType=this.BasicsData1[i].whType;
                this.startType=this.BasicsData1[i].whType;
                this.startTypeName=this.BasicsData1[i].whName;
              }
          }
        }
      },
      'defaultData.wIdStore':{
        handler(val){
          this.getListData(val);
        }
      },
      'defaultData.stockTransportType':{
        handler(val){
          this.getListData(val);
        }
      },
      'defaultData.logisticsType':{
        handler(val){
          this.getListData(val);
        }
      },
      'defaultData.packState':{
        handler(val){
//          this.getListData(val);
        }
      },
      'defaultData.cartonState':{
        handler(val){

        }
      },
      'wIdStartName':{
        handler(val){
//          if(val==='01'){
//            this.defaultData.logisticsType='';
//            this.defaultData.stockTransportType=this.transports[0].id;
//          }else {
//            alert(this.transportss[0].id)
//            this.defaultData.stockTransportType='';
//            this.defaultData.logisticsType=this.transportss[0].id;
//          }
        }
      },
      'objectiveDepotType':{
        handler(val){
            if(val==='1'){
              this.FBAtype='0'
              this.defaultData.fbaType = '0'
            }else {
              this.defaultData.fbaType = '1'
            }
          this.getBasicsData2();
          this.getListData(val);
        }
      },
      'FBAtype':{
        handler(val){
         if(val==='0'){
            this.defaultData.fbaType = '1'
            this.getFBAData.shipmentId = ''
         }else if(val==='1'){
           this.defaultData.skuNo = ''
         }else if(val==='2'){
           this.defaultData.fbaType = '2'
           this.getFBAData.shipmentId = ''
         }
        }
      },
      'SeeTableData':{
        handler(val){
          alert(111)
        },
        deep: true
      },

    },

    computed:{
      ...mapGetters([
        'getters',
        'menu',
        'collapsed',
        'subNav'
      ]),
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入订单编号' : this.selectParams.optionTitle == 1 ? '请输入平台编号':'';
      },
    },
    mounted(){
      this.getauthorityList();
      this.getListData2();
      this.getAttribute();
      this.getBasicsData();
      this.getBasicsData2();
      this.getCompIdAllWareHouse();//中转仓库
//      this.whTypeFn();
    },
    methods: {
      ...mapMutations([
        'getSeeCardData',
      ]),

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getListData2:function () {
        this.$http.get('static/Table2.json').then(res=>{
//          this.TableData3=res.data.table;
//          this.TableData=res.data.table;
//          this.TableData2=res.data.table;

        })
      },
      whTypeFn:function () {
        if(this.whTypeData.whType==='01'){
          alert('111111111111111111')
//          alert(this.transports[0].id)
          console.log(this.transports);
          this.defaultData.logisticsType='';
//          this.defaultData.stockTransportType=this.transports[0].id;
//          this.$set(this.defaultData,'stockTransportType',this.transports[0].id)
//          console.log(this.defaultData.stockTransportType)
          this.getListData();
        }else {
          alert('22222222222222222')
          alert(this.transportss[0].id)
          this.defaultData.stockTransportType='';
//          this.defaultData.logisticsType=this.transportss[0].id;
//          this.$set(this.defaultData,'logisticsType',this.transportss[0].id)
          this.getListData();
        }
      },
      handleChange(value) {
        this.defaultData.attributeId=value;
      },
      getListData:function (val) {//表格数据
          switch (this.state){
            case '0':
//                this.getListData2();
              if(this.objectiveDepotType==='1'){
                this.httpPost('warehouseAllotting/getAllForpackingInfo',this.defaultData).then(res=>{
                  this.TableData=res.data.listData;
                  const pageData = res.data;
                  this.page.currentPage = pageData.currentPage;
                  this.page.totalCount = pageData.totalCount;
                  this.page.totalPage = pageData.totalPage;
                  this.page.pageSize = pageData.pageSize;
                });
              }else {
                if(this.FBAtype==='0'){
                  this.httpPost('warehouseAllotting/getAllForpackingInfo',this.defaultData).then(res=>{
                    this.TableData=res.data.listData;
                    const pageData = res.data;
                    this.page.currentPage = pageData.currentPage;
                    this.page.totalCount = pageData.totalCount;
                    this.page.totalPage = pageData.totalPage;
                    this.page.pageSize = pageData.pageSize;
                  });
                }else if(this.FBAtype==='1'){
                  this.CopyObj(this.getFBAData,this.defaultData)
                  console.log(this.getFBAData)
//                  this.httpPost('warehouseAllotting/getAllForpackingInfo',this.defaultData).then(res=>{
                  this.httpPost('warehouseAllotting/getFbaPlanForpackingInfo',this.getFBAData).then(res=>{
                    this.FBAlist=res.data.listData;
                    const pageData = res.data;
                    this.page.currentPage = pageData.currentPage;
                    this.page.totalCount = pageData.totalCount;
                    this.page.totalPage = pageData.totalPage;
                    this.page.pageSize = pageData.pageSize;
                  });
                }else if(this.FBAtype==='2'){
                  this.httpPost('warehouseAllotting/getAllForpackingInfo',this.defaultData).then(res=>{
                    this.FBAlist2=res.data.listData;
                    const pageData = res.data;
                    this.page.currentPage = pageData.currentPage;
                    this.page.totalCount = pageData.totalCount;
                    this.page.totalPage = pageData.totalPage;
                    this.page.pageSize = pageData.pageSize;
                  });
                }
              }

              break;
            case '01'://已装箱待调拨
              this.httpPost('warehouseAllotting/getCartonInfo',this.defaultData).then(res=>{
                this.TableData2=res.data.listData;
                const pageData = res.data;
                this.page.currentPage = pageData.currentPage;
                this.page.totalCount = pageData.totalCount;
                this.page.totalPage = pageData.totalPage;
                this.page.pageSize = pageData.pageSize;
              });
              this.getBasicsData3();
//              this.httpPost('warehouseAllotting/getAllForpackingInfo',this.defaultData).then(res=>{
//                this.TableData2=res.data.listData;
//              });
//              this.getListData2();
              break;
            default:
              this.defaultData2.status=this.state;
              this.defaultData2.whId=this.defaultData.wIdStart;
              this.defaultData2.wIdStore=this.defaultData.wIdStore;
              this.defaultData2.stockTransportType=this.defaultData.stockTransportType;
              this.defaultData2.logisticsType=this.defaultData.logisticsType;
              this.httpPost('warehouseAllotting/queryTransferInfo',this.defaultData2).then(res=>{//正确
                this.TableData3=res.data.listData;
                const pageData = res.data;
                this.page.currentPage = pageData.currentPage;
                this.page.totalCount = pageData.totalCount;
                this.page.totalPage = pageData.totalPage;
                this.page.pageSize = pageData.pageSize;
              });
//              this.httpPost('warehouseAllotting/getAllForpackingInfo',this.defaultData).then(res=>{
//                this.TableData3=res.data.listData;
//              });
//              this.getListData2();
//              console.log(this.TableData3)
//              console.log(111111111111)
          }
      },
      RowFn:function (row,key) {//表格行内操作
        let _this=this;
        let vm = this
        this.cartonId=[];
        switch (key){
          case '打印商品标签':
            let urls = this.RmsUrl+'poItem/selectProductLable?Authorization='+sessionStorage.getItem('userSession')+'&productId='+row.productId+'&poId='+row.poId;
            window.open(urls);
            break;
          case '打印FNSKU':
            let url = this.RmsUrl+'warehouseAllotting/printFBASku?Authorization='+sessionStorage.getItem('userSession')+'&fnSKu='+row.fnSKu+'&productName='+row.productName
            window.open(url);
            break;
          case '装箱&调拨详情':
            this.httpPost('warehouseAllotting/getForpackingInfoById?taskId='+row.taskId).then(res=>{
              this.SeeinfoData=res.data;
              console.log(this.SeeinfoData)
            });
            break;
          case '申报故障品':
            this.declareData.taskId=row.taskId;
            break;
          case '申报数量异常':
            this.declareData.taskId=row.taskId;
            this.httpPost('warehouseAllotting/getOriginalQty?taskId='+row.taskId).then(res=>{
//              this.NumberAbnormal=res.data.originalQty;
              this.NumberAbnormal=res.data;
            })
            break;
            case '查看调拨单':
                if(row.transitWhId!==null){
                  window.open('#/SeeAllocation?transferId='+row.transferId+ '&Whether=0');
                }else {
                  window.open('#/SeeAllocation?transferId='+row.transferId+ '&Whether=1');
                }

            break;
            case '录入跟踪单号':
              if(row.stockTransportType!==''){
                this.RowStockTransportTypeId = row.stockTransportType;
              }else {
                this.RowStockTransportTypeId= row.logisticsType;
              }
              if(this.state==='03' || this.state==='04'){//是否有中转仓库
                if(row.isApi==='1'){//有中转仓库,且为 英国仓 德国仓
                  this.transportsss=this.transportss;
                  this.TrackingListDal=true;
                  this.httpPost('warehouseAllotting/productTransitWhSignSendOut?transferId='+row.transferId).then(res=> {
                    this.TrackingListData = res.data;
                    this.TrackingListData.stockTransportTypeId = this.RowStockTransportTypeId;
                    this.TrackingListDataItem[0].cartonIndex = res.data.cartonIndex;
                    this.TrackingListDataItem[0].whId = res.data.whId;
                    this.TrackingListDataItem[0].transitWhId = res.data.transitWhId;
                    this.TrackingListDataItem[0].wIdStore = res.data.wIdStore;
                    this.TrackingListDataItem[0].creatTime = res.data.creatTime;
                    this.TrackingListDataItem[0].creatUser = res.data.creatUser;
                    this.PostTrackingList.transferId = row.transferId;
                  });
                }else {
                  this.transportsss=this.transports;
                  this.dialogFlag.dialogTitle='录入跟踪单号';
                  this.dialogFlag.isOpen=true;
                  this.PostTrackingList.transferId=row.transferId;
                }
              }else {
                if(row.isApi==='1'){//无中转仓库，情况下，始发仓类型， 德国仓 英国仓
                  this.transportsss=this.transportss;
                  this.TrackingListDal=true;
                  this.httpPost('warehouseAllotting/productTransitWhSignSendOut?transferId='+row.transferId).then(res=> {
                    this.TrackingListData = res.data;
                    this.TrackingListData.stockTransportTypeId=this.RowStockTransportTypeId;
                    this.TrackingListDataItem[0].cartonIndex = res.data.cartonIndex;
                    this.TrackingListDataItem[0].whId = res.data.whId;
                    this.TrackingListDataItem[0].transitWhId = res.data.transitWhId;
                    this.TrackingListDataItem[0].wIdStore = res.data.wIdStore;
                    this.TrackingListDataItem[0].creatTime = res.data.creatTime;
                    this.TrackingListDataItem[0].creatUser = res.data.creatUser;
                    this.PostTrackingList.transferId = row.transferId;
                  });
                }else {
                  this.transportsss=this.transports;
                  this.dialogFlag.dialogTitle='录入跟踪单号';
                  this.dialogFlag.isOpen=true;
                  this.PostTrackingList.transferId=row.transferId;
                }
              }
            break;
          case '打印调拨箱唛':
            this.BoardNoInfo.whId=this.defaultData.wIdStart;
            this.BoardNoInfo.wIdStore=this.defaultData.wIdStore;
            this.BoardNoInfo.stockTransportType=this.defaultData.stockTransportType;
//            this.BoardNoInfo.type=this.defaultData.cartonState;
            if(this.state === '01'){
              this.BoardNoInfo.type = '1'
            }else {
              this.BoardNoInfo.type = '2'
            }
            this.getSeeCardData(this.BoardNoInfo);
            sessionStorage.setItem('SeeCardData',JSON.stringify(this.BoardNoInfo));
            window.open('#/alloctShippingmark?transferId='+row.transferId);
            break;
          case '打印2':
              this.cartonId.push(row.cartonId)
            window.open(this.RmsUrl+'warehouseAllotting/printCartonLabel?Authorization='+sessionStorage.getItem('userSession')+'&cartonId='+this.cartonId);
//            this.RmsUrl+'product/exportProductDate?Authorization='+sessionStorage.getItem('userSession')+'&salesStatus='+url;
            break;
           case '新建手动包裹单':
//            this.pustpackage.transferId=row.transferId;
            this.packageDal=true;
             this.httpPost('warehouseAllotting/getTransforBoxInfo?transferId='+row.transferId ).then(res=>{
               this.packageList=res.data;
             });
             break;
          case '标记发货2':
            this.TrackingListDal=true;
//            this.httpPost('warehouseAllotting/productTransitWhSignSendOut?transferId=1').then(res=>{
            this.httpPost('warehouseAllotting/productTransitWhSignSendOut?transferId='+row.transferId).then(res=>{
              this.TrackingListData=res.data;
              this.TrackingListDataItem[0].cartonIndex=res.data.cartonIndex;
              this.TrackingListDataItem[0].whId=res.data.whId;
              this.TrackingListDataItem[0].transitWhId=res.data.transitWhId;
              this.TrackingListDataItem[0].wIdStore=res.data.wIdStore;
              this.TrackingListDataItem[0].creatTime=res.data.creatTime;
              this.TrackingListDataItem[0].creatUser=res.data.creatUser;
              this.PostTrackingList.transferId=row.transferId;
            });
            break;
          case '装箱详情':
            this.SeePacking.cartonId=row.cartonId;
            this.SeePacking.type=this.defaultData.cartonState;
            this.httpPost('warehouseAllotting/getstockCartonInfoById',this.SeePacking ).then(res=>{
              this.AlreadyPackingData=res.data;
            });
            break;
            case '装箱清单':
//            alert(row.cartonId)
             this.dialogFlag.zhuangXiang2 = true;
             this.dialogFlag.dialogTitle = '装箱清单';
              this.SeePacking.cartonId=row.cartonId;
              this.SeePacking.type=this.defaultData.cartonState;
              this.httpPost('warehouseAllotting/getStockCartonBoxInfoById',this.SeePacking ).then(res=>{
                this.SeePackingData=res.data;
              });
            break;
            case 'FBA计划清单':
//            alert(row.cartonId)
             this.dialogFlag.zhuangXiang2 = true;
            this.dialogFlag.dialogTitle = 'FBA计划清单';
              this.httpGet('warehouseAllotting/getFbaStockCartonBoxInfoById?shipmentId='+ row.shipmentId ).then(res=>{
                this.SeePackingData=res.data;
              });
            break;

          case '作废':
            this.cartonId.push(row.cartonId);
            _this.doItem('您确定作废此备货箱唛？','warehouseAllotting/cartontToCartonInvalidById',this.cartonId, _this.getListData);
            break;
            case '恢复':
              this.cartonId.push(row.cartonId);
              _this.doItem('您确定恢复此备货箱唛？','warehouseAllotting/recoverCartonNoBycarTonId',this.cartonId, _this.getListData);
            break;
          case '退回':
            _this.doItem('您确定退回发货计划？','warehouseAllotting/revocationFBAPlan?shipmentId='+ row.shipmentId, '',_this.getListData);
            break;
          case '打印拣货单':
            window.open('#/PickingOrder?shipmentId='+ row.shipmentId + '&type=1');
            break;
          default:
            alert(444)
        }
      },
        getBasicsData:function() {
          this.httpGet('productMaterial/getWareHouse').then(res=>{//始发仓
            this.BasicsData1=res.data;
            setTimeout(()=>{
              this.defaultData.wIdStart=res.data[0].whId;
//              this.defaultData.wIdStart='20171019175254241117';
//              this.getTransport();
            },20)
          })
        },
      getBasicsData2:function() {
        this.ObjisOwn.isOwn=this.objectiveDepotType;
        this.httpPost('warehouseAllotting/getTargetWarehouse?isOwn='+ this.ObjisOwn.isOwn).then(res=>{//目的仓库
          this.BasicsData2=res.data;
          this.defaultData.wIdStore=res.data[0].whId;
        })
      },
      getTransport:function() {
        this.httpGet('warehouseAllotting/getInfo',this.whTypeData).then(res=>{//物流方式
          if(this.whTypeData.whType==='01'){
            this.transports=res.data;
            this.defaultData.stockTransportType=res.data[0].id;
            this.defaultData.logisticsType='';
            this.getListData();
//            this.whTypeFn();
          }else {
            this.transportss=res.data;
            this.defaultData.logisticsType=res.data[0].id;
            this.defaultData.stockTransportType='';
            this.getListData();
          }
        });
      },
      pustpackageFn:function () {
        this.pustpackage.logististicType=this.logististicType;
        this.httpPost('warehouseAllotting/creatManualPackingList',this.pustpackage).then(res=>{//手动发货
          if(res.data.result===true){
            this.packageDal = false;
          }else {
            this.$message(res.data.message)
          }
        })
      },
      getBasicsData3:function() {
        this.httpPost('warehouseAllotting/getAllCartonBoxInfo',this.defaultData).then(res=>{//装箱待调拨，统计装箱信息
          this.BasicsData3=res.data;
        })
      },
      TrackingListFn:function (val) {//跟踪单号确定
//        this.PostTrackingList.trackingNo=this.TrackingListDataItem[0].trackingNo;
        let Url='';
        this.PostTrackingList.state='1';
        if(this.state==='02'){
          Url='warehouseAllotting/postTrakingNo';
        }else {
          Url='warehouseAllotting/postTransitWhSendOutInfo';
        }
        this.httpPost(Url,this.PostTrackingList).then(res=> {
          if (res.data.result === true) {
            this.TrackingListDal = false;
            this.dialogFlag.isOpen = false;
            this.getListData();
          } else {
            this.$message(res.data.message)
          }
        });
      },
      getBoardNoInfo:function () {//查看卡板标签
        this.BoardNoInfo.whId=this.defaultData.wIdStart;
        this.BoardNoInfo.wIdStore=this.defaultData.wIdStore;
        this.BoardNoInfo.stockTransportType=this.defaultData.stockTransportType;
//        this.BoardNoInfo.type=this.defaultData.cartonState;
        if(this.state === '01'){
          this.BoardNoInfo.type='1'
        }else {
          this.BoardNoInfo.type='2'
        }
        this.getSeeCardData(this.BoardNoInfo);
        sessionStorage.setItem('SeeCardData',JSON.stringify(this.BoardNoInfo));
        window.open('#/labelCardBoard');
      },
      GiveScreen:function () {//筛选赋值给defaultData
        this.defaultData.stockNo=this.screenData.stockNo;
        this.defaultData.cgNo=this.screenData.cgNo;
        this.defaultData.skuNo=this.screenData.skuNo;
        this.defaultData.isCustoms=this.screenData.isCustoms;
        this.defaultData.stockNo=this.screenData.stockNo;
        console.log(this.defaultData);
        this.getListData();
      },
      a:function () {
        alert(22)
      },
      DeleteScreen:function () {//清除筛选条件
        console.log(this.screenData);
        console.log(8888);
        this.tool.clearObjValue(this.screenData);
        this.CopyObj(this.defaultData,this.screenData);
        this.AttributeDatas=[];
        console.log(this.defaultData);
        console.log(this.screenData);
        console.log(99999999999);

      },
      CopyObj:function (obj1,obj2) {
        for(let i in obj1){
            for(let k in obj2){
                if(i===k){
                  obj1[i]=obj2[k];
                }
            }
        }
      },
      declareFn:function () {
        switch (this.dialogFlag.dialogTitle){
          case '申报故障品':
            this.httpPost('warehouseAllotting/creatFaultyInfo',this.declareData).then(res=>{
              if(res.data.result===true){
                this.dialogFlag.isOpen = false;
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '申报数量异常':
            this.httpPost('warehouseAllotting/creatQtyAbnormal',this.declareData).then(res=>{
              if(res.data.result===true){
                this.dialogFlag.isOpen = false;
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '录入跟踪单号':
            this.httpPost('warehouseAllotting/postTrakingNo',this.TrackNumberdata).then(res=>{
              if(res.data.result===true){
                this.dialogFlag.isOpen = false;
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          default:
            alert(555)
        }

      },
      infoDetailFn:function () {//装箱待调拨 生成卡板标签 确定按钮
        this.infoDetailData.cartonId=this.cartonId;
        this.infoDetailData.boardNo=this.generateCardData.boardNo;
        this.httpPost('warehouseAllotting/postCartonNoBycarTonId',this.infoDetailData).then(res=>{
          if(res.data.result===true){
            this.GenerateCardDal = false;
            this.getListData();
          }else {
            this.$message(res.data.message)
          }
        });
      },
      selectFilter:function(){
        var vm = this;
        switch(this.transportTF){
          case '0':
            vm.defaultData.cartonNo = this.transportVal ;
            vm.defaultData.boardNo = '' ;
            break;
          case '1':
            vm.defaultData.boardNo = this.transportVal ;
            vm.defaultData.cartonNo = '' ;
            break;
          case '3':

            break;
        }
      },
      Establish:function () {//创建调拨并出库
        this.EstablishData.cartonId=this.cartonId;
        this.httpPost('warehouseAllotting/creatCartonInfo',this.EstablishData).then(res=>{
          if(res.data.result===true){
            this.EstablishDal.EstablishDal=false;
            this.getListData();
          }else {
            this.$message(res.data.message)
          }
        })
      },
      getCompIdAllWareHouse:function () {//创建调拨并出库  中转仓
        this.httpGet('productMaterial/getCompIdAllWareHouse?type=').then(res=>{
          this.transferList=res.data;
        })
      },
      EstablishFn:function (val) {//已装箱待调拨批量按钮
        let _this=_this;
        let vm = this;
        this.cartonId=[];
        this.taskId=[];
//        for(let i=0; i<this.sels.length; i++){
//          this.cartonId.push(this.sels2[i].cartonId);
//        }
        vm.cartonId = vm.sels2.map(item => item.cartonId)
        vm.taskId = vm.sels2.map(item => item.taskId)
        this.EstablishData.cartonId=this.cartonId;
        if(vm.sels2.length<1 ){
          vm.tips();
        }else{
          switch(val){
            case '创建调拨并出库':
              if(this.startType==='01'){
                this.EstablishDal.EstablishDal=true;
              }else {
                //this.logististicTypeDal.Dal=true;
                this.logististicTypeDal.type='1';
                /*---------------分仓调拨创建调拨去除物流弹窗：2017-12-23 start-----------------*/
                this.signData2.cartonId=this.cartonId;
                var logType = this.defaultData.logisticsType;
                this.transportss.forEach(function(item){
                  if(item.id == logType){
                    vm.signData2.logististicType = item;
                  }
                })
                this.httpPost('warehouseAllotting/creatParcelInfo',this.signData2).then(res=>{
                  this.$message(res.data.message)
                  if(res.data.result===true){
                    //this.logististicTypeDal.Dal=false;
                    //this.$router.push({path:'/manualParcelList'})
                    this.getListData();
                  }
                })
                /*---------------分仓调拨创建调拨去除物流弹窗：2017-12-23 end-----------------*/
//                this.$router.push({path:'/manualParcelList'})
              }
              break;
            case '批量打印':
              window.open(this.RmsUrl+'warehouseAllotting/printCartonLabel?Authorization='+sessionStorage.getItem('userSession')+'&cartonId='+this.cartonId);
              break;
            case '批量作废':
              vm.doItem('您确定批量作废备货箱唛？','warehouseAllotting/cartontToCartonInvalidById',this.cartonId,vm.getListData);
              break;
            case '生成卡板标签':
              this.httpPost('warehouseAllotting/creatBoardNo',this.cartonId).then(res=>{
                if(res.data.result===true){
                  this.generateCardData=res.data.params.boardInfo;
                  console.log(this.generateCardData)
                  this.GenerateCardDal = true;
//                  this.getListData();
                }else {
                  this.$message(res.data.message)
                }
              });
              break;
            case '批量恢复':
              vm.doItem('您确定恢复此备货箱唛？','warehouseAllotting/recoverCartonNoBycarTonId',vm.cartonId,vm.getListData);
              break;
            case '创建FBA发货计划':
              vm.doItem('您确定创建FBA发货计划？','warehouseAllotting/creatPlan',vm.taskId,vm.getListData);
              break;
          }
        }
      },
      PickingOrderFn:function () {//打印拣货单
        this.taskId=[];
        for(let i=0; i<this.sels.length; i++){
          this.taskId.push(this.sels[i].taskId);
        }
        let vm = this;
        vm.taskId = vm.sels.map(item => item.taskId);
        if(vm.sels.length<1 ){
          vm.tips();
        }else{
          window.open('#/PickingOrder?arr='+this.taskId+ '&type=0');
        }
      },
      closeData:function (val) {//清空数据
        this.tool.clearObjValue(this.declareData);//清空申报故障
        this.tool.clearObjValue(this.EstablishData);//创建调拨并出库
        this.tool.clearObjValue(this.TrackNumberdata);//标记发货

//        this.tool.clearObjValue(this.TrackingListData);//跟踪单
        this.tool.clearObjValue(this.PostTrackingList);//跟踪单
        this.NumberAbnormal='';
//        this.$refs.LogisticsType.ResetFn();
      },
      closeData2:function () {
        this.$refs.LogisticsType.ResetFn();
        this.tool.clearObjValue(this.pustpackage);//手动
      },
      logististicTypeFn:function () {
        let _this=this;
        switch (this.logististicTypeDal.type){
          case '1':
            this.signData2.logististicType=this.logististicType;
            this.signData2.cartonId=this.cartonId;
            var logType = this.defaultData.logisticsType;
            this.transportss.forEach(function(item){
                if(item.id == logType){
                  this.signData2.logististicType = item;
                }
            })
            this.httpPost('warehouseAllotting/creatParcelInfo',this.signData2).then(res=>{
              if(res.data.result===true){
                this.logististicTypeDal.Dal=false;
                this.$router.push({path:'/manualParcelList'})
              }else {
                this.$message(res.data.message)
              }
            })
            break;
          case '2':

            break;
          case '3':

            break;
          case '4':

            break;
        }
      },
      SonData:function (val) {
        console.log(val.Obj)
        console.log(8888888)
        this.logististicType=val.Obj;
      },
      getAttribute:function () {//属性
        var _this = this;
        this.httpGet('warehouseAllotting/getProAttributeInfo').then(res=>{
          _this.AttributeData=res.data;
          var digui = function(val){
            for( var i=0;i<val.length;i++ ){
              if(val[i].info){
                if(!val[i].info.length){
                  delete val[i].info;
                }else{
                  digui(val[i].info);
                }
              } else{
                continue;
              }
            }
          };
          digui(_this.AttributeData);
        })
      },
      toAlloctShippingmark:function(){
        window.open('#/alloctShippingmark?taskId='+this.taskId);
      },

      handleClick:function (tab, event) {//选项卡回调
        console.log(tab, event);
      },
      RowData:function (row, state) {//行内操作

      },
      addDialogFn:function () {//筛选框向外赋值

      },
      getListDatadel: function () {
        setTimeout(()=>{
            this.getListData()
        },20)
      },
      selsChange: function (sels) {//批量操作获取ID
        this.sels = sels;
        this.taskId=[];
        console.log(this.sels)
      },
      selsChanges: function (sels) {//已装箱待调拨
        this.sels2 = sels;
        this.cartonId=[];
        console.log(this.sels2)
      },
      selsChangess: function (sels) {//3 以后的
        this.sels2 = sels;
        this.cartonId=[];
        console.log(this.sels2)
      },

      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.getListData();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.getListData();
      },
    }
  }

</script>

<style scoped>
.form-item{
  margin-bottom: 0px;
}
.breakAll{
  word-break: break-all;
}
.padding-style{
  padding:10px;
}
.box-style{
  border-top: solid 1px #ccc;
}
  .span_label{
    width: 80px !important;
    display: inline-block;
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
  .marginBottom{
    margin-bottom: 5px;
  }
  .SkuStyle{
    color: #20a0ff;
    margin-left: 20px;
  }
  .SkuStyle:hover{
    cursor: pointer;
  }
  .nav{
    margin-top: 10px;
    margin-bottom: -10px;
    padding-left: 20px;
  }
  /*img{*/
    /*display: none !important;*/
  /*}*/
</style>
