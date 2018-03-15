<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo"><span class="titleName">调拨单{{ AllocationData.transferNo}}</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <div>
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="0">
            <div>
              <el-row style="margin-bottom: 15px">
                <span style="font-size: 21px">基本信息</span>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">调拨单编号</el-col>
                <el-col :span="21" style="margin-left: 40px">{{ AllocationData.transferNo}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">调拨类型</el-col>
                <el-col :span="21" style="margin-left: 40px">{{ AllocationData.transferType}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">调拨单状态</el-col>
                <el-col :span="21" style="margin-left: 40px">{{ AllocationData.tranferInfoTpye}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">创建人</el-col>
                <el-col :span="21" style="margin-left: 40px">{{ AllocationData.creatUser}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">创建时间</el-col>
                <el-col :span="21" style="margin-left: 40px"><span v-text="tool.formatDate('','',AllocationData.creatTime)"></span></el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">物流方式&跟踪号1</el-col>
                <el-col :span="8" style="margin-left: 40px">
                  <el-row>物流方式：{{ AllocationData.stockTransportTypeId}}</el-row>
                  <el-row>跟踪单号：{{ AllocationData.trackingNo}}</el-row>
                </el-col>
                <el-col :span="2" class="text-R" v-if="refValueList.length>0">物流方式&跟踪号2</el-col>
                <el-col :span="8" style="margin-left: 40px" v-if="refValueList.length>0">
                  <el-row>物流方式：{{ refValueList[0].refValue}}</el-row>
                  <el-row>跟踪单号：{{ refValueList[0].trackingNo}}</el-row>
                </el-col>
                <el-col :span="2" class="text-R Astyel" @click.native="refValueDal.Dal=true" v-if="refValueList.length>0">更多 >></el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="text-R">
                  <span > 备注</span>
                  <el-tooltip content="添加备注"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff" @click="addRemarks">&#xe623;</i>
                  </el-tooltip>
                </el-col>
                <el-col :span="21" style="margin-left: 40px">
                  <el-row><span>wave ID：{{ AllocationData.waveId}}</span></el-row>
                  <el-row><span>shipment ID：{{ AllocationData.shpimentId}}</span></el-row>
                  <el-row><span>Amazon账号：{{ AllocationData.amazonUserNo}}</span></el-row>
                  <div v-for="(item,index) in AllocationData.notes">
                    <el-row style="margin-bottom: 5px"><span>{{ item.addUser}} <span v-text="tool.formatDate('','',item.addTime)"></span></span></el-row>
                    <el-row><span>{{ item.transferNote}}</span></el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-card class="box-card" style="margin-top: 35px">
                <div slot="header" class="clearfix">
                  <span>调拨详情</span>
                </div>
                <div class="text item" style="text-align: center">

                  <el-row style="margin-top: 20px; margin-bottom: 35px">
                    <el-col :span="4"  style="margin-left: 120px;">
                      <el-row class="nav">
                        <span ><span style="margin-top: 6px"></span>调出仓库</span><br/>
                        <span>{{ WarehouseData.whIdKey.whId }}（已发<span class="textColor">{{ WarehouseData.whIdKey.carragerCount }}</span>箱）</span><br/>
                      </el-row>
                      <el-row style="margin-top: 20px" v-for="(item,index) in WarehouseData.whIdKey.action">
                        {{ item.userNo}}：{{ item.actionType}}     <span style="margin-left: 10px" v-text="tool.formatDate('','',item.actionTime)"></span>
                      </el-row>
                    </el-col>
                    <el-col :span="2">
                      <el-row>待标记箱数<span class="textColor">{{WarehouseData.signStayBoxIndex}}</span>箱</el-row>
                      <el-col :span="24" style="border-bottom: 1px dashed #20a0ff; margin:15px 0 15px 0;"></el-col>
                    </el-col>
                    <el-col :span="6" v-show="Whether==='0'">
                      <el-row class="nav">
                        <span style="margin-right: 20px">中转仓库</span>
                        <el-tooltip content="接收"  effect="dark" placement="bottom" >
                          <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff" @click="EntryFns('接收')">&#xe608;</i>
                        </el-tooltip>
                        <el-tooltip content="发出"  effect="dark" placement="bottom" >
                          <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff" @click="EntryFns('发出')">&#xe609;</i>
                        </el-tooltip><br/>
                        <span>{{WarehouseData.transitWhIdkey.whId}}（已标记接收<span class="textColor">{{WarehouseData.transitWhIdkey.carragerCount}}</span>箱）</span><br/>
                      </el-row>
                      <el-row style="margin-top: 20px" v-for="(item,index) in WarehouseData.transitWhIdkey.action">
                        {{ item.userNo}}：{{ item.actionType}}     <span style="margin-left: 10px" v-text="tool.formatDate('','',item.actionTime)"></span>
                      </el-row>
                    </el-col>
                    <el-col :span="2" v-show="Whether==='0'">
                      <el-row>待入库箱数<span class="textColor">{{ (WarehouseData.transitWhIdkey.carragerCount - WarehouseData.whIdStoreKey.carragerCount) > 0 ? WarehouseData.transitWhIdkey.carragerCount - WarehouseData.whIdStoreKey.carragerCount : 0}}</span>箱</el-row>
                      <el-col :span="24" style="border-bottom: 1px dashed #20a0ff; margin:15px 0 15px 0;"></el-col>
                    </el-col>
                    <el-col :span="4" >
                      <el-row class="nav">
                        <span style="margin-right: 20px">目的仓库</span>
                        <el-tooltip content="入库"  effect="dark" placement="bottom" >
                          <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff" @click="EntryFns('入库')">&#xe608;</i>
                        </el-tooltip><br/>
                        <span>{{WarehouseData.whIdStoreKey.whId}}（已入库<span class="textColor">{{WarehouseData.whIdStoreKey.carragerCount}}</span>箱）</span><br/>
                      </el-row>
                      <el-row style="margin-top: 20px" v-for="(item,index) in WarehouseData.whIdStoreKey.action">
                        {{ item.userNo}}：{{ item.actionType}}     <span style="margin-left: 10px" v-text="tool.formatDate('','',item.actionTime)"></span>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="装箱信息" name="1">
            <span>箱号列表</span>
            <!--<el-row>以下为该次调拨的所有箱号，您可以选中一箱或者多箱具体的箱号进行入库/标记，如果您所选的一个或者多个箱子有过入库/标记，此处“按箱入库/标记”将入库/标记所选箱子剩余的待签数量物</el-row>-->
            <el-row class="NoBtn">
              <el-button type="primary" size="small" @click="operationFn('按箱标记接收')" v-show="Whether==='0'">按箱标记接收</el-button>
              <el-button type="primary" size="small" @click="operationFn('按箱标记发出')" v-show="Whether==='0'">按箱标记发出</el-button>
              <el-button type="primary" size="small" @click="operationFn('中转拦截')" v-show="Whether==='0'">中转拦截</el-button>
              <el-button type="primary" size="small" @click="operationFn('按箱入库')">按箱入库</el-button>
            </el-row>
            <el-row class="NoNav">
              <el-row  class="blank">
                <el-collapse v-model="activeNames">
                  <el-collapse-item name="1">
                  <el-row>
                    <el-checkbox-group v-model="checkList">
                       <el-col :span="2" v-for="(item,index) in CaseListData"><el-checkbox :label="item.cartonId">{{ item.cartonIndex }}</el-checkbox></el-col>
                    </el-checkbox-group>
                  </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </el-row>
            <el-row class="SeeType">
              <span style="margin-right: 20px">查看方式</span>
              <el-select v-model="value" placeholder="请选择" @change="GetPackingData">
              <el-option
                v-for="(item,index) in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            </el-row>

            <el-row class="PackingNav" v-if="value==='3'">
              <el-row class="PackingNavTitle">
                <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]"
                               :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
              </el-row>
              <el-row class="PackingNavSon">
                <el-card class="box-card" v-for="(item,index) in PackingList">
                  <div slot="header" class="clearfix">
                    <span style="margin-right: 30px">箱号{{ item.cartonIndex }}: </span>
                    <span style="margin-right: 30px">重量：{{ item.maxWeight }}</span>
                    <span style="margin-right: 30px">体积：{{ item.maxLength  }}*{{ item.maxWidth  }}*{{ item.maxHeight  }}cm={{ item.maxLength* item.maxWidth*item.maxHeight}} cm3</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="SeePackingFn(item.cartonId)">查看箱唛</el-button>
                  </div>
                  <div id="item_list">
                    <el-table :data="item.skuinfo" border tooltip-effect="dark" style="width: 100%"  >
                      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
                      <el-table-column sortable  label="图片"  align="center">
                        <template scope="scope">
                          <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
                        </template>
                      </el-table-column>
                      <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
                      <el-table-column sortable prop="productName" label="商品名称" align="center"></el-table-column>
                      <el-table-column sortable prop="boxQty" label="装箱数量" align="center"></el-table-column>
                      <el-table-column sortable prop="reciveTotalQty" label="已中转标记接收数量（累计）" align="center"></el-table-column>
                      <el-table-column sortable prop="sendOutTotalQty" label="已中转标记发出数量（累计）" align="center"></el-table-column>
                      <el-table-column sortable prop="storgeTotalQty" label="目的仓入库数量（累计）" align="center"></el-table-column>
                      <el-table-column sortable prop="storgeStayQty" label="目的仓待入库数量" align="center">
                        <template scope="scope">
                          <span>{{scope.row.storgeStayQty > 0 ? scope.row.storgeStayQty : 0}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
               </el-card>
              </el-row>
            </el-row>
            <el-row class="PackingNav" v-if="value!=='3'">
              <el-row class="PackingNavSon">
                <el-card class="box-card" v-for="(item,index) in SkuTableData">
                  <div slot="header" class="clearfix">
                    <span style="margin-right: 30px">{{ item.skuNo }}</span>
                    <span style="margin-right: 30px">{{ item.enName }}</span>
                    <span style="margin-right: 30px">{{ item.locationNo }}</span>
                    <span style="margin-right: 30px">共计{{ item.totalCartonIndex }}箱</span>
                    <span style="margin-right: 30px">{{ item.cartonIndexInfo }}</span>
                    <el-button style="" type="text" @click="SkuOperationFn(item)" v-show="item.locationNo===null">分配</el-button>
                    <span style="margin-right: 30px" v-show="item.locationNo!==null">{{ item.locationNo }}</span>
                    <el-tooltip content="入库"  effect="dark" placement="bottom" >
                      <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff; float: right; margin-left: 5px" @click="EntryFn(item,'入库')">&#xe64f;</i>
                    </el-tooltip>
                    <el-tooltip content="接收"  effect="dark" placement="bottom" >
                        <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff; float: right; margin-left: 5px" @click="EntryFn(item,'接收')" v-show="Whether==='0'">&#xe608;</i>
                      </el-tooltip>
                    <el-tooltip content="发出"  effect="dark" placement="bottom" >
                      <i  class="iconfontyyy" content="Bottom center" style="color: #20a0ff; float: right; margin-left: 5px" @click="EntryFn(item,'发出')" v-show="Whether==='0'">&#xe609;</i>
                    </el-tooltip>

                  </div>
                  <div class="">
                    <el-row style="border: 1px solid #ccc; line-height: 45px">
                      <el-col style="border-right: 1px solid #ccc; width: 5%; text-align: center">序号</el-col>
                      <el-col :span="20" style="text-align: center">箱号详情</el-col>
                    </el-row>
                    <el-row style="border-right: 1px solid #ccc; border-left: 1px solid #ccc; border-bottom: 1px solid #ccc;">
                      <span v-for="(itens,index) in item.info">
                          <el-col  v-if="index % 10 == 0 " style="width: 5%; line-height: 36px; text-align: center; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;">{{ index / 10 + 1}}</el-col>
                          <el-col style="width: 9.5%; text-align: center; line-height: 36px; border-right: 1px solid #ccc; border-bottom: 1px solid #ccc;">
                            <span class="Astyel" @click="SkuOperationFns(itens, '查看')" v-if="itens.state===0"> {{ itens.cartonIndex }}</span>
                            <span class="Bstyel" @click="SkuOperationFns(itens, '查看')" v-if="itens.state===1"> {{ itens.cartonIndex }}</span>
                            <span v-if="value==='0'">
                              <el-tooltip content="接收"  effect="dark" placement="bottom" >
                                  <i  class="iconfontyyy" content="Bottom center" style="font-size: 11px; float: right; margin-left: 5px" @click="SkuOperationFns(itens, '接收')" v-show="Whether==='0'">&#xe608;</i>
                              </el-tooltip>
                              <el-tooltip content="发出"  effect="dark" placement="bottom" >
                                <i  class="iconfontyyy" content="Bottom center" style="font-size: 11px; float: right; margin-left: 5px" @click="SkuOperationFns(itens, '发出')" v-show="Whether==='0'">&#xe609;</i>
                              </el-tooltip>
                            </span>
                          </el-col>
                      </span>
                    </el-row>
                  </div>
                </el-card>
              </el-row>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="费用信息" name="2">
            <div>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">查看维度</el-col>
                <el-col :span="17" class="Mlstyle">
                  <el-radio v-model="radio" label="1">港币</el-radio>
                  <el-radio v-model="radio" label="2">人民币</el-radio>
                </el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">物流公司</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">燃油费</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">运费</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">Deferment</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">Duty</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">VAT</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">服务费</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
              <el-row class="TopStyle">
                <el-col :span="6" class="text-R">费用总计</el-col>
                <el-col :span="17" class="Mlstyle">3</el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--添加备注-->
    <el-dialog title="添加备注" :visible.sync="dialogFlag" :close-on-click-modal="false" size="tiny" @close="closeData">
        <el-input v-model="TransforNoteData.note" type="textarea" placeholder=""></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag = false;">关闭</el-button>
        <el-button type="primary" @click="TransforNoteFn(); ">确定</el-button>
      </div>
    </el-dialog>
    <!--查看箱唛-->
    <el-dialog title="查看箱唛" :visible.sync="SeePacking.dialogFlag" :close-on-click-modal="false" size="tiny" @close="closeData">
        <el-row style="text-align: left;border: solid 1px #ccc;border-right: solid 1px #ccc; ">
          <el-row style="border-bottom: solid 1px #ccc;">
            <el-col :span="6" style="padding: 10px;"><img :src="SeePackingData.qrCodeURl" alt="二维码" style="width: 100%;height: 100px;"></el-col>
            <el-col :span="18" >
              <el-col :span="16" class="breakAll" style="padding:10px 10px 10px 0;">
                <span>箱唛编号：{{ SeePackingData.cartonNo}}</span><br/>
                <span>{{ SeePackingData.whId}}-->{{ SeePackingData.transitWhId}}-->{{ SeePackingData.toWhId}}</span><br/>
                <span >重量：{{ SeePackingData.maxWeight}}KG</span><br/>
                <span >体积：{{ SeePackingData.maxLength}}*{{ SeePackingData.maxWidth}}*{{ SeePackingData.maxHeight}}cm={{ SeePackingData.maxHeight*SeePackingData.maxWidth*SeePackingData.maxLength}}</span><br/>
              </el-col>
              <el-col :span="8" style="border-left: solid 1px #ccc;">
                <div class="padding-style">
                  <span>报关</span>
                  <el-radio-group v-model="SeePackingData.isCustoms" style="margin-left: 10px;">
                    <el-radio label="1">是</el-radio><br/>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="box-style">
                  <span>箱号</span>
                  <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ SeePackingData.cartonIndex }}</h3>
                  <h3 class="breakAll" style="text-align: center;margin: 5px 0;">{{ SeePackingData.PNo }}</h3>
                </div>
              </el-col>
            </el-col>
          </el-row>
          <el-col style="margin:10px">
            <span class="" >物品个数总计（{{ SeePackingData.productCategoryCount }}种）/物品数量总计（{{ SeePackingData.productCount }}个）</span><br/>
          </el-col>
          <div style="margin:10px" class="breakAll" v-for="(item ,index) in SeePackingData.infos">
            <span class="">编号:{{ item.stockNo }}</span><span style="margin: 0 20px;">SKU:{{ item.skuNo }}</span><span>数量:{{ item.productCount }}/{{ item.signProductCount }}PCS</span><br/>
            <span class="">物品名称：{{ item.productName }}</span><br/>
          </div>
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SeePacking.dialogFlag = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!--SKU下-----接收-->
    <el-dialog title="装箱清单（有中转）-中转标记接收" :visible.sync="SkuDal.SkuDal" :close-on-click-modal="false" size="small" @close="closeData">
      <el-row>
        箱号：{{ SkuDalData.cartonIndex}}
      </el-row>
      <el-row>
        重量：{{ SkuDalData.maxWeight}}
      </el-row>
      <el-row>
        体积：{{ SkuDalData.maxLength}}*{{ SkuDalData.maxWidth}}*{{ SkuDalData.maxHeight}}cm={{ SkuDalData.maxHeight*SkuDalData.maxWidth*SkuDalData.maxLength}}
      </el-row>
      <el-row style="margin-top: 10px">
        <el-button type="primary" size="small" @click="SeePackingFn(SkuDalData.cartonId)">查看箱唛</el-button>
        <el-button type="primary" size="small" @click="SkuDalFn('中转标记接收')">中转标记接收</el-button>
      </el-row>
      <div style="margin-top: 10px">
        <div class="item_list">
          <el-table :data="SkuDalDataList" border tooltip-effect="dark" style="width: 100%"  >
            <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
            <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
            <el-table-column sortable  label="图片"  align="center">
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column sortable prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column sortable prop="boxQty" label="数量" align="center"></el-table-column>
            <el-table-column sortable prop="reciveTotalQty" label="累积标记接收" align="center"></el-table-column>
            <el-table-column sortable  label="待标记接收" align="center">
              <template scope="scope">
                <span>{{ scope.row.boxQty - scope.row.reciveTotalQty}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="本次标记接收" align="center">
              <template scope="scope">
                <el-input v-model="scope.row.qty"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SkuDal.SkuDal = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!--SKU下-----发出-->
    <el-dialog title="装箱清单（有中转）-中转标记发出" :visible.sync="SkuDal1" :close-on-click-modal="false" size="small" @close="closeData">
      <el-row>
        箱号：{{ SkuDalData.cartonIndex}}
      </el-row>
      <el-row>
        重量：{{ SkuDalData.maxWeight}}
      </el-row>
      <el-row>
        体积：{{ SkuDalData.maxLength}}*{{ SkuDalData.maxWidth}}*{{ SkuDalData.maxHeight}}cm={{ SkuDalData.maxHeight*SkuDalData.maxWidth*SkuDalData.maxLength}}
      </el-row>
      <el-row style="margin-top: 10px">
        <el-button type="primary" size="small" @click="SeePackingFn(SkuDalData.cartonId)">查看箱唛</el-button>
        <el-button type="primary" size="small" @click="SkuDalFn('中转标记发出')">中转标记发出</el-button>
      </el-row>
      <div style="margin-top: 10px">
        <div class="item_list">
          <el-table :data="SkuDalDataList" border tooltip-effect="dark" style="width: 100%"  >
            <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
            <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
            <el-table-column sortable  label="图片"  align="center">
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column sortable prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column sortable prop="boxQty" label="数量" align="center"></el-table-column>
            <el-table-column sortable prop="sendOutTotalQty" label="累积标记发出" align="center"></el-table-column>
            <el-table-column sortable  label="待标记发出" align="center">
              <template scope="scope">
                <span>{{ scope.row.boxQty - scope.row.sendOutTotalQty}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="本次标记发出" align="center">
              <template scope="scope">
                <el-input v-model="scope.row.qty"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SkuDal1 = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!--SKU下-----查看-->
    <el-dialog title="装箱清单-目的仓入库" :visible.sync="SkuDal2" :close-on-click-modal="false" size="small" @close="closeData">
      <el-row>
        箱号：{{ SkuDalData.cartonIndex}}
      </el-row>
      <el-row>
        重量：{{ SkuDalData.maxWeight}}
      </el-row>
      <el-row>
        体积：{{ SkuDalData.maxLength}}*{{ SkuDalData.maxWidth}}*{{ SkuDalData.maxHeight}}cm={{ SkuDalData.maxHeight*SkuDalData.maxWidth*SkuDalData.maxLength}}
      </el-row>
      <el-row style="margin-top: 10px">
        <el-button type="primary" size="small" @click="SeePackingFn(SkuDalData.cartonId)">查看箱唛</el-button>
        <el-button type="primary" size="small" @click="SkuDalFn('入库')">入库</el-button>
      </el-row>
      <div style="margin-top: 10px">
        <div class="item_list">
          <el-table :data="SkuDalDataList" border tooltip-effect="dark" style="width: 100%"  >
            <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
            <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
            <el-table-column sortable  label="图片"  align="center">
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column sortable prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column sortable prop="boxQty" label="数量" align="center"></el-table-column>
            <el-table-column sortable prop="reciveTotalQty" label="已入库" align="center"></el-table-column>
            <el-table-column sortable label="本次入库" align="center">
              <template scope="scope">
                <el-input v-model="scope.row.qty"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SkuDal2 = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!--批量单混-->
    <el-dialog :title="SkuBatchDal.title" :visible.sync="SkuBatchDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><el-checkbox :indeterminate="single.isIndeterminate" v-model="single.checkAll" @change="handleCheckAllChange1">单装</el-checkbox></span>
        </div>
        <div >
          <el-checkbox-group v-model="single.checkedCities" @change="handleCheckedCitiesChange1">
            <el-checkbox v-for="city in single.cities" :key="city.cartonId" :label="city.cartonId"  :disabled="city.qty==city.reciveTotalQty" v-if="SkuBatchDal.state==='接收'">
              {{city.cartonIndex}} (（{{city.qty}}/{{city.reciveTotalQty}}）)
            </el-checkbox>
            <el-checkbox v-for="city in single.cities" :key="city.cartonId" :label="city.cartonId"  :disabled="city.qty==city.sendOutTotalQty" v-if="SkuBatchDal.state==='发出'">
              {{city.cartonIndex}} (（{{city.qty}}/{{city.sendOutTotalQty}}）)
            </el-checkbox>
            <el-checkbox v-for="city in single.cities" :key="city.cartonId" :label="city.cartonId"  :disabled="city.qty==city.storgeTotalQty" v-if="SkuBatchDal.state==='入库'">
              {{city.cartonIndex}} (（{{city.qty}}/{{city.storgeTotalQty}}）)
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><el-checkbox :indeterminate="double.isIndeterminate" v-model="double.checkAll" @change="handleCheckAllChange">混装</el-checkbox></span>
        </div>
        <div >
          <el-checkbox-group v-model="double.checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in double.cities" :key="city.cartonId" :label="city.cartonId"  :disabled="city.qty==city.reciveTotalQty" v-if="SkuBatchDal.state==='接收'">
              {{city.cartonIndex}} (（{{city.qty}}/{{city.reciveTotalQty}}）)
            </el-checkbox>
            <el-checkbox v-for="city in double.cities" :key="city.cartonId" :label="city.cartonId"  :disabled="city.qty==city.sendOutTotalQty" v-if="SkuBatchDal.state==='发出'">
              {{city.cartonIndex}} (（{{city.qty}}/{{city.sendOutTotalQty}}）)
            </el-checkbox>
            <el-checkbox v-for="city in double.cities" :key="city.cartonId" :label="city.cartonId"  :disabled="city.qty==city.storgeTotalQty" v-if="SkuBatchDal.state==='入库'">
              {{city.cartonIndex}} (（{{city.qty}}/{{city.storgeTotalQty}}）)
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SkuBatchDal.Dal = false;">关闭</el-button>
        <el-button type="primary" @click="SkuBatchFn(); " :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请输入库位号" :visible.sync="distributionDal" :close-on-click-modal="false" size="tiny" @close="closeData">
      <el-input v-model="distributionData.locationNo" placeholder=""></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="distributionDal = false;">关闭</el-button>
        <el-button type="primary" @click="distributionDalFn(); " :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择物流方式" :visible.sync="logististicTypeDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
      <LogisticsType @assignment="SonData" ref="LogisticsType"></LogisticsType>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logististicTypeDal.Dal = false;">关闭</el-button>
        <el-button type="primary" @click="logististicTypeFn(); " :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择物流方式" :visible.sync="refValueDal.Dal" :close-on-click-modal="false">
      <div class="item_list">
        <el-table :data="refValueList" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  prop="goodsName" sortable  label="手动包裹单" align="center"></el-table-column>
          <el-table-column  prop="cartonInNofo" sortable  label="箱号" align="center"></el-table-column>
          <el-table-column  prop="trackingNo"  sortable label="跟踪单号" align="center"></el-table-column>
          <el-table-column  prop="whId" sortable  label="始发仓" align="center"></el-table-column>
          <el-table-column  prop="transitWhId"  sortable label="中转仓"  align="center"></el-table-column>
          <el-table-column  prop="toWhId"  sortable label="目的仓"  align="center"></el-table-column>
          <el-table-column  prop="creatUser"  sortable label="创建人"  align="center"></el-table-column>
          <el-table-column sortable label="创建时间" align="center" prop="addTime" :formatter="tool.parcelCreatTime"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refValueDal.Dal = false;">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import LogisticsType from "./LogisticsType.vue";
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component";
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  export default{
    components: {
      ElInput,
      ElDialog,
      ElButton,
      ElCol,
      LogisticsType,
      ElRow},
    data(){
      return {
        activeName2: '0',
        transferId:'',
        AllocationData:{},
        WarehouseData:{},
        dialogFlag:false,
        TransforNoteData:{
          transferId:'',
          note:'',
        },
        radio:'1',
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        CaseListData:[],
        checkList:[],
        options: [{
          value: '3',
          label: '按箱号显示装箱清单'
        }, {
          value: '0',
          label: '按SKU装箱显示所有'
        }, {
          value: '1',
          label: '按SKU装箱只显示单装'
        }, {
          value: '2',
          label: '按SKU装箱只显示混装'
        }],
        value: '3',
        defaultData: {
          transferId:'',//始发仓
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
        },
        page:{          // 分页参数
          currentPage:0,
          pageSize:10,
          totalCount:10,
          totalPage:1
        },
        PackingList:[],
        SeePacking:{
          dialogFlag:false
        },
        postSeePacking:{
          cartonId:'',
          type:'2'
        },
        SeePackingData:{},
        radio2:'',
        getSkuData:{
          packType:'',
          transferId:'',
        },
        SkuTableData:[],
        list:[],
        PostSku:{
          transferId:'',
          cartonId:''
        },
        SkuDal:{
            dis:false,
            SkuDal:false,
            text:'',
        },
        SkuDalData:{},
        SkuDalDataList:[],
        SkuDal1:false,
        SkuDal2:false,
        SkuBatchData:{
          transferId:'',
          skuNo:''
        },
        SkuBatchDal:{
          Dal:false,
          title:'',
          state:''
        },
        SkuBatchDalData:{},
        single:{//单
          checkAll: false,
          checkedCities: [],//选中
          cities: [],//全部
          isIndeterminate: true,
        },
        double:{//混
          checkAll: false,
          checkedCities: [],
          cities: [],
          isIndeterminate: true,
        },
        distributionData:{
          transferId:'',
          productId:'',
          locationNo:'',
          skuNo:''
        },
        distributionDal:false,
        Whether:'',
        logististicTypeDal:{//
          Dal:false,
          Dis:false,
          type:'',
        },
        refValueDal:{//
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
        refValueList:[],// 二段物流
      }
    },
    watch: {
    },
    mounted(){
      this.transferId=this.tool.requestParams('transferId');
      this.defaultData.transferId=this.tool.requestParams('transferId');
      this.getSkuData.transferId=this.tool.requestParams('transferId');
      this.PostSku.transferId=this.tool.requestParams('transferId');
      this.Whether=this.tool.requestParams('Whether');// 1无 0 有
      this.getListData();
      this.getrefValue();
      this.getCaseList();
      this.GetPackingData();
      this.getAllocation();
    },
    methods: {
      ...mapMutations([
        'getSeeCardData',
      ]),
      SonData:function (val) {
        console.log(val.Obj)
        console.log(8888888)
        this.logististicType=val.Obj;
      },
      logististicTypeFn:function () {
          let _this=this;
        switch (this.logististicTypeDal.type){
          case '1':
            this.logististicTypeDal.Dal=false;
            this.signData.transferId=this.transferId;
            this.signData.logististicType=this.logististicType;
            _this.doItem('您确定一键标记该调拨单所有物品从中转仓发出？标记数量将等于调拨数量减去已标记数量，请谨慎操作！',
              'warehouseAllotting/oneSignBoxSendOut',this.signData, _this.RefreshFn);
            break;
            case '2':
            this.logististicTypeDal.Dal=false;
            this.signData2.cartonId=this.checkList;
            this.signData2.logististicType=this.logististicType;
              _this.doItem('你确定要按箱标记发出？','warehouseAllotting/signBoxSendOut',this.signData2,_this.RefreshFn);
            break;
          case '3':
            this.logististicTypeDal.Dal=false;
            this.signData2.logististicType=this.logististicType;
            this.SkuBatchDal.Dal=true;
            break;
            case '4':
            this.logististicTypeDal.Dal=false;
              this.SkuDalData.infos=this.SkuDalDataList;
              this.httpPost('warehouseAllotting/productQtySignOut',this.SkuDalData ).then(res=>{
                if(res.data.result===true){
                  this.SkuDal1=false;
                  this.RefreshFn();
                }else {
                  this.$message(res.data.message)
                }
              });
            break;
        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      RefreshFn:function () {
        this.GetPackingData();
        this.getAllocation();
        this.getListData();
        this.getCaseList();
      },
      GetPackingData:function () {//装箱数据
        let _this=this;
        switch (this.value){
          case '3':
            this.httpPost('warehouseAllotting/queryByCartonIndex',this.defaultData ).then(res=>{
              const pageData = res.data;
              this.page.currentPage = pageData.currentPage;
              this.page.totalCount = pageData.totalCount;
              this.page.totalPage = pageData.totalPage;
              this.page.pageSize = pageData.pageSize;
              this.PackingList=res.data.listData;
            });
            break;
          default:
            this.getSkuData.packType=this.value;
//            this.getSkuData.transferId=this.tool.requestParams('transferId');
            this.httpPost('warehouseAllotting/queryCartonInfoBySku',this.getSkuData ).then(res=>{//Sku
              this.SkuTableData=res.data;

            });

        }
      },
      getrefValue:function () { // 二段物流方式
        this.httpGet('warehouseAllotting/getStockTransferLogistisTypeInfo?transferId='+this.transferId ).then(res=>{
          this.refValueList=res.data;
        })
      },
      getListData:function () {
        this.httpPost('warehouseAllotting/getTransforTrakingInfo?transferId='+this.transferId ).then(res=>{
          this.AllocationData=res.data;
        })
      },
      getCaseList:function () {//箱号
        this.httpPost('warehouseAllotting/getTransforBoxInfo?transferId='+this.transferId ).then(res=>{
          this.CaseListData=res.data;
        })
      },
      getAllocation:function () {//调拨详情
        this.httpPost('warehouseAllotting/getTransforInfoByTaskId?transferId='+this.transferId ).then(res=>{
          this.WarehouseData=res.data;
          console.log(this.WarehouseData)
          console.log(8888888888888888888888888)
        })
      },
      SeePackingFn:function (val) {//查看箱唛
        this.SeePacking.dialogFlag=true;
        this.postSeePacking.cartonId=val;
        this.httpPost('warehouseAllotting/getstockCartonInfoById',this.postSeePacking ).then(res=>{
          this.SeePackingData=res.data;
        })
      },

      SkuOperationFns:function (val,key) {//SKU下单个
        let _this=this;
        this.PostSku.cartonId=val.cartonId;
        this.httpPost('warehouseAllotting/productSignRecInfo',this.PostSku ).then(res=>{
          this.SkuDalData=res.data;
          for (let i=0; i<res.data.infos.length; i++){
            res.data.infos[i].qty=res.data.infos[i].boxQty-res.data.infos[i].reciveTotalQty;
          }
          this.SkuDalDataList=res.data.infos;
        });
        switch (key){
          case '查看':
            this.SkuDal2=true;
            break;
          case '发出':
            this.SkuDal1=true;
            break;
          case '接收':
            this.SkuDal.SkuDal=true;
            break;
          case '分配':

            break;

        }
      },
      SkuDalFn:function (key) {//SKU弹窗内操作
        switch (key){
          case '中转标记接收':
            this.SkuDalData.infos=this.SkuDalDataList;
            this.httpPost('warehouseAllotting/productSignReception',this.SkuDalData ).then(res=>{
              if(res.data.result===true){
                this.SkuDal.SkuDal=false;
                this.RefreshFn();
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '中转标记发出':
            this.SkuDalData.infos=this.SkuDalDataList;
            this.httpPost('warehouseAllotting/productQtySignOut',this.SkuDalData ).then(res=>{
              if(res.data.result===true){
                this.SkuDal1=false;
                this.RefreshFn();
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '入库':
            this.SkuDalData.infos=this.SkuDalDataList;
            this.httpPost('warehouseAllotting/producQtySignIn',this.SkuDalData ).then(res=>{
              if(res.data.result===true){
                this.SkuDal2=false;
                this.RefreshFn();
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '按箱入库':
            _this.doItem('你确定要按箱入库？','warehouseAllotting/signBoxInStorage',this.checkList,_this.RefreshFn);
            break;
        }
      },
      operationFn:function (key) {
        let _this=this;
          if(this.checkList.length<1){
            _this.tips();
          }else {
            switch (key){
              case '按箱标记接收':
                _this.doItem('你确定要按箱标记接收？','warehouseAllotting/signBoxReception',this.checkList,_this.RefreshFn);
                break;
              case '按箱标记发出':
                this.logististicTypeDal.Dal=true;
                this.logististicTypeDal.type='2';
                break;
              case '中转拦截':
                  let Obj={
                    cartonId:this.checkList,
                    transferId:this.transferId,
                  };
                _this.doItem('你确定要中转拦截？','warehouseAllotting/signBoxIntercept',Obj,_this.RefreshFn);
                break;
              case '按箱入库':
                _this.doItem('你确定要按箱入库？','warehouseAllotting/signBoxInStorage',this.checkList,_this.RefreshFn);
                break;
            }
          }
      },

      closeData:function () {//清空数据
        this.tool.clearObjValue(this.TransforNoteData);//清空备注
        this.tool.clearObjValue(this.distributionData);//清空双
        this.single.checkedCities=[];//清空单
        this.double.checkedCities=[];//清空双
        this.$refs.LogisticsType.ResetFn();
      },
      SkuOperationFn:function (val) {//SKU下 分配库位号打开
        console.log(val);
        this.distributionDal=true;
        this.distributionData.transferId=val.transferId;
        this.distributionData.productId=val.productId;
        this.distributionData.skuNo=val.skuNo;
      },
      distributionDalFn:function () {//SKU下 分配库位号确定
        this.httpPost('warehouseAllotting/saveWareLocationNo',this.distributionData).then(res=>{
          if(res.data.result===true){
            this.distributionDal=false;
            this.RefreshFn();
          }else {
            this.$message(res.data.message)
          }
        });
      },
      SkuBatchFn:function () {//SKU批量 接收 发出 入库
        console.log('单',this.single.checkedCities);
        console.log('双',this.double.checkedCities);
        let arr = this.single.checkedCities.concat(this.double.checkedCities);
        console.log('合并',this.double.checkedCities);
        this.signData2.cartonId=arr;
        switch (this.SkuBatchDal.title){
          case '您确定按SKU标记接收?此SKU分布如下箱号':
            this.httpPost('warehouseAllotting/signBoxReception',arr).then(res=>{
              if(res.data.result===true){
                this.SkuBatchDal.Dal = false;
                this.RefreshFn();
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '您确定按SKU标记发出?此SKU分布如下箱号':
            this.httpPost('warehouseAllotting/signBoxSendOut',this.signData2).then(res=>{
              if(res.data.result===true){
                this.SkuBatchDal.Dal = false;
                this.RefreshFn();
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '您确定按SKU入库?此SKU分布如下箱号':
            this.httpPost('warehouseAllotting/signBoxInStorage',arr).then(res=>{
              if(res.data.result===true){
                this.SkuBatchDal.Dal = false;
                this.RefreshFn();
              }else {
                this.$message(res.data.message)
              }
            });
            break;
        }
      },
      EntryFn:function (val,key) {//SKU下
        let _this=this;
        this.SkuBatchDal.state=key;
        this.SkuBatchData.transferId=this.transferId;
        this.SkuBatchData.skuNo=val.skuNo;

        this.httpPost('warehouseAllotting/productSkuQtyInfo',this.SkuBatchData ).then(res=>{
          this.SkuBatchDalData=res;
          this.single.cities=res.data.typeOne;
          this.double.cities=res.data.typeTwo;
        });
        switch (key){
          case '接收':
            this.SkuBatchDal.Dal=true;
            this.SkuBatchDal.title='您确定按SKU标记接收?此SKU分布如下箱号';
            break;
          case '发出':
            this.logististicTypeDal.Dal=true;
            this.SkuBatchDal.title='您确定按SKU标记发出?此SKU分布如下箱号';
            this.logististicTypeDal.type='3';
            break;
          case '入库':
            this.SkuBatchDal.Dal=true;
            this.SkuBatchDal.title='您确定按SKU入库?此SKU分布如下箱号';
            break;
        }
      },
      EntryFns:function (key) {//基本信息下
        let _this=this;
        switch (key){
          case '接收':
            _this.doItem('您确定一键标记该调拨单所有物品从中转仓接收？标记数量将等于调拨数量减去已标记数量，由于无法回退，请谨慎操作！',
              'warehouseAllotting/oneSignBoxReception?transferId='+_this.transferId,'', _this.RefreshFn);
            break;
          case '发出':
            this.logististicTypeDal.Dal=true;
            this.logististicTypeDal.type='1';
            break;
          case '入库':
            _this.doItem('您确定一键入库该调拨单所有物品，入库数量将等于调拨数量减去已入库入库数量，由于无法回退，请谨慎操作！',
              'warehouseAllotting/oneSignBoxInStorage?transferId='+_this.transferId,'', _this.RefreshFn);
            break;
        }
      },
      handleCheckAllChange1(val) {//单批量 全选反选
        this.single.checkedCities = val.target.checked ? this.single.cities : [];
        this.single.isIndeterminate = false;
      },
      handleCheckedCitiesChange1(value) {//单批量 单选
        let checkedCount = value.length;
        this.single.checkAll = checkedCount === this.single.cities.length;
        this.single.isIndeterminate = checkedCount > 0 && checkedCount < this.single.cities.length;
      },
      handleCheckAllChange(val) {//混装
        this.double.checkedCities = val.target.checked ? this.double.cities : [];
        this.double.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.double.checkAll = checkedCount === this.double.cities.length;
        this.double.isIndeterminate = checkedCount > 0 && checkedCount < this.double.cities.length;
      },
      addRemarks:function () {//添加备注打开
          this.dialogFlag=true;
          this.TransforNoteData.transferId=this.transferId;
      },
      TransforNoteFn:function () {//添加备注确定
        this.httpPost('warehouseAllotting/postTransforNoteInfo',this.TransforNoteData ).then(res=>{
          if(res.data.result===true){
            this.dialogFlag=false;
            this.RefreshFn();
          }else {
            this.$message(res.data.message)
          }
        })
      },
      fN:function () {
          let obj={
              specificationName:'666',
              compid:[1,2,3,4],
              obj2:{
                data1:'666',
                data2:[1,2,3,4],
              }
          };
          console.log(this.qs.stringify(obj))
          console.log(99999999)
        this.httpPost('productSpecification/save',obj).then(res=>{
          if(res.data.result===true){
            this.dialogFlag=false;
          }else {
            this.$message(res.data.message)
          }
        })
      },
      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.RefreshFn();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.RefreshFn();
      },

    }
  }
</script>
<style scoped>
  .header {
    width: 100%;
    line-height: 80px;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left;
  }
.PackingNavSon{
  margin-top: 10px;
}
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .padding-style{
    padding:10px;
  }
  .box-style{
    border-top: solid 1px #ccc;
  }

 .nav{
   border: 1px solid #ccc;
   height: 80px
 }

  .breakAll{
    word-break: break-all;
  }
  .Mlstyle{
    margin-left: 60px;
  }
  .PackingNavTitle{
    margin-top: 10px;
  }
  .TopStyle{
    margin-top: 20px;
  }
  .NoBtn{
    margin-top: 15px;
  }
  .box-card{
    margin-bottom: 10px;
  }
  .SeeType{
    margin-top: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
  }
</style>
