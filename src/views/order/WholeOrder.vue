<template>
    <div id="outermost_wrap" class="user_manager_wrap">
      <div id="sub_wrap">
        <CrumbsNav></CrumbsNav>
      </div>
      {{ $route.path }}-{{ $route.name}}-{{ $store.state.menu}}
      <div id="content_wrap" class="content_wrap">
        <el-row class="filterOption" id="filterOption" >
          <el-col :span="6" class="optionValue">
            <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" class="input66" name="input66" @change="selectFilter()"></el-input>
          </el-col>
          <el-col :span="2">
            <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="13" style="margin-left: 20px; margin-top: 5px">
            <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getOrderList">搜索</el-button>
          </el-col>
          <el-col :span="1"  style="margin-top: 5px; text-align: right">
            <el-button type="primary" class="research_btn" size="small"  @click="MainOperation('手工同步订单',$route.name)">手工同步订单</el-button>
          </el-col>
        </el-row>
        <el-row  id="filer" class="marginBottom">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <el-col  class="marginBottom">
                <span class="span_label1">平台渠道</span>
                <el-radio-group v-model="defaultData.whId" size="small"   >
                  <!--<el-radio-button :label="item.whId" v-for="(item,index) in BasicsData2">{{ item.whName }}</el-radio-button>-->
                  <el-radio-button label="1" >2222</el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col  class="marginBottom">
                <span class="span_label1">店铺账号</span>
                <el-radio-group v-model="defaultData.saleStatusId" size="small"   >
                  <!--<el-radio-button :label="item.refId" v-for="(item,index) in BasicsData3">{{ item.refValue }}</el-radio-button>-->
                  <el-radio-button label="1" >2222</el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col  class="marginBottom">
                <span class="span_label1">市场/站点</span>
                <el-radio-group v-model="defaultData.saleStatusId" size="small"   >
                  <!--<el-radio-button :label="item.refId" v-for="(item,index) in BasicsData3">{{ item.refValue }}</el-radio-button>-->
                  <el-radio-button label="1" >2222</el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col  class="marginBottom">
                <span class="span_label1">收件人国家</span>
                <el-radio-group v-model="defaultData.saleStatusId" size="small"   >
                  <!--<el-radio-button :label="item.refId" v-for="(item,index) in BasicsData3">{{ item.refValue }}</el-radio-button>-->
                  <el-select v-model="selectParams.optionTitle" filterable clearable >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-radio-group>
              </el-col>
            </el-collapse-item>
          </el-collapse>
        </el-row>

        <!--退款重寄下 Tab 切换-->
        <el-row v-show="$route.name==='重寄订单' || $route.name==='退款订单'">
          <el-tabs v-model="defaultData.activeName2" type="card" @tab-click="handleClick2">
            <el-tab-pane label="待审核" name="0"></el-tab-pane>
            <el-tab-pane label="等待退件" name="1"></el-tab-pane>
            <el-tab-pane label="待财务审核" name="2"></el-tab-pane>
            <el-tab-pane label="已退款" name="3"></el-tab-pane>
          </el-tabs>
        </el-row>
        <!--头部操作按钮-->
        <el-row class="supplier_btn">
          <el-button type="primary" size="small" @click="MainOperation('手工订单',$route.name)" class="el-icon-plus" v-show="$route.name==='手工订单'">手工订单</el-button>
          <el-button type="primary" size="small" @click="MainOperation('导入订单',$route.name)" v-if="$route.name==='手工订单'">导入订单</el-button>
          <el-button type="primary" size="small" @click="MainOperation('审核设置',$route.name)" v-show="$route.name==='全部'|| $route.name==='已付款'">审核设置</el-button>
          <el-button type="primary" size="small" @click="MainOperation('导出跟踪单',$route.name)"
                     v-show="$route.name==='已发货'|| $route.name==='已签收'|| $route.name==='已作废'">导出跟踪单</el-button>
          <el-button type="primary" size="small" @click="MainOperation('筛选',$route.name)">筛选</el-button>
        </el-row>
        <!--批量操作按钮-->
        <el-row class="supplier_btn">
          <el-button type="primary" size="small" @click="SingleOperation('发邮件')">发邮件</el-button>
          <el-button type="primary" size="small" @click="SingleOperation('提交审核')"  v-show="$route.name==='已付款'">提交审核</el-button>
          <el-button type="primary" size="small" @click="SingleOperation('批量提单')"  v-show="$route.name==='异常订单'">批量提单</el-button>
          <el-button type="primary" size="small" @click="SingleOperation('批量作废' ,$route.name)"  v-show="$route.name==='异常订单'">批量作废</el-button>
          <el-button type="primary" size="small" @click="SingleOperation('批量提单')"  v-show="$route.name==='缺货订单'">批量提单</el-button>
          <el-button type="primary" size="small" @click="SingleOperation('批量同意',$route.name)"
                     v-show="$route.name==='待审核' || $route.name==='重寄订单' || $route.name==='退款订单'">批量同意</el-button>
          <el-button type="primary" size="small" @click="SingleOperation('批量同意',$route.name)"
                     v-show="$route.name==='待审核' || $route.name==='重寄订单' || $route.name==='退款订单'">批量不同意</el-button>
        </el-row>
        <!--  Table  Table  Table--------------------------->
        <div class="item_list">
          <el-table :data="GetListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="操作"  prop="label" align="center"  width="150">
              <template scope="scope">
                <el-tooltip content="订单详情"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '订单详情')">&#xe600;</i>
                </el-tooltip>
                <el-tooltip content="添加备注"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '添加备注')">&#xe623;</i>
                </el-tooltip>
                <el-tooltip content="发送消息/邮件"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '发送消息/邮件')">&#xe738;</i>
                </el-tooltip>
                <el-tooltip content="取消绑定"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '取消绑定')">&#xe62a;</i>
                </el-tooltip>
                <el-tooltip content="复制创建手工订单"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '复制创建手工订单')">&#xe607;</i>
                </el-tooltip>
                <el-tooltip content="发起预退件"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '发起预退件')">&#xe666;</i>
                </el-tooltip>
                <el-tooltip content="重寄申请"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '重寄申请')">&#xe61c;</i>
                </el-tooltip>
                <el-tooltip content="新增配件申请"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '新增配件申请')">&#xe60d;</i>
                </el-tooltip>
                <el-tooltip content="下载VTA发票"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '下载VTA发票')">&#xe804;</i>
                </el-tooltip>
                <el-tooltip content="拦截订单"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '拦截订单')">&#xe652;</i>
                </el-tooltip>
                <el-tooltip content="退款"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '退款')">&#xe690;</i>
                </el-tooltip>
                <el-tooltip content="提交"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '提交')">&#xe63e;</i>
                </el-tooltip>
                <el-tooltip content="作废订单"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '作废订单')">&#xe6f7;</i>
                </el-tooltip>
                <el-tooltip content="同意"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '同意')">&#xe63d;</i>
                </el-tooltip>
                <el-tooltip content="不同意"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '不同意')">&#xe611;</i>
                </el-tooltip>
                <el-tooltip content="认领付款"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '认领付款')">&#xe757;</i>
                </el-tooltip>
                <el-tooltip content="取消订单"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '取消订单')">&#xe619;</i>
                </el-tooltip>
                <el-tooltip content="银行转账"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '银行转账')">&#xe6e8;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="订单信息"  prop="label" align="center" >
              <template scope="scope">
                <div v-for="(item,index) in scope.row.detailInventory" class="simulation">
                  <div class="childDiv">
                    <el-row>
                      <el-col :span="8">
                        <img :src="item.qty"/>
                      </el-col>
                      <el-col :span="16">
                        {{ item.inventoryQty }}
                        <div style="float: right">
                          <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '商品库存')">&#xe6f6;</i>
                          </el-tooltip>
                          <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '历史销量')">&#xe61b;</i>
                          </el-tooltip>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        Lorem ipsum consectetur adipiscing elit. Aenean euismod bibend
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="产品信息"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="收件人"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="仓库与物流"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="状态"  prop="label" align="center" width="100">
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="时间"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--  审核设置Dal--------------------------->
      <el-dialog title="审核设置"  :visible.sync="AuditSettingsDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
       <el-row style="margin-bottom: 20px">
         <el-col :span="8" class="text-R">自动提交审核</el-col>
         <el-col :span="12" style="margin-left: 40px">
           <el-switch v-model="AuditSettingsDal.AuditSettingsData.data1"></el-switch>
         </el-col>
         {{AuditSettingsDal.AuditSettingsData.data1}}
       </el-row>
        <el-row>
          <el-col :span="8" class="text-R">在以下时间开启/关闭</el-col>
          <el-col :span="12" style="margin-left: 40px">
            <el-select v-model="AuditSettingsDal.AuditSettingsData.data2" placeholder="请选择" :disabled="AuditSettingsDal.AuditSettingsData.data1===true">
              <el-option
                v-for="item in AuditSettingsDal.List"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px" v-if="AuditSettingsDal.AuditSettingsData.data2==='3' || AuditSettingsDal.AuditSettingsData.data2==='4'">
          <el-col :span="8" class="text-R" style="color: #ffffff">.</el-col>
          <el-col :span="12" style="margin-left: 40px">
            <el-time-picker
              is-range
              v-model="AuditSettingsDal.Time"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AuditSettingsDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  备注dal--------------------------->
      <el-dialog title="添加备注"  :visible.sync="AddRemarksDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
        <el-input type="textarea"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddRemarksDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  添加SKU--------------------------->
      <el-dialog title="添加SKU"  :visible.sync="AddSkuDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
        <el-row style="margin-bottom: 15px">
          <el-col :span="6" class="text-R" style="margin-right: 30px; margin-top: 6px">
            SKU
          </el-col>
          <el-col :span="16">
            <el-input v-model="AddSkuDal.AddSkuData.data1"> </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="text-R" style="margin-right: 30px; margin-top: 6px">
            数量
          </el-col>
          <el-col :span="16">
            <el-input v-model="AddSkuDal.AddSkuData.data2"> </el-input>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddSkuDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  邮件dal--------------------------->
      <el-dialog title="发送消息/邮件" :visible.sync="EailDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row style="margin-bottom: 20px">
          <el-col :span="4">
            <span style="margin-top: 8px; display: inline-block">
               模板选择
            </span>
          </el-col>
          <el-col :span="15">
            <el-select v-model="EailDal.EailData.data1" placeholder="请选择">
              <el-option
                v-for="item in List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <span style="line-height: 30px">标题</span>
        </el-row>
        <el-row>
          <el-input ></el-input>
        </el-row>
        <el-row>
          <span style="line-height: 30px">内容</span>
        </el-row>
        <Editor></Editor>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EailDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  批量邮件dal--------------------------->
      <el-dialog title="发送消息/邮件" :visible.sync="BatchEailDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row style="margin-bottom: 20px">
          <el-col :span="4">
            <span style="margin-top: 8px; display: inline-block">
               模板选择
            </span>
          </el-col>
          <el-col :span="15">
            <el-select v-model="EailDal.EailData.data1" placeholder="请选择">
              <el-option
                v-for="item in List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <span style="line-height: 30px">标题</span>
        </el-row>
        <el-row>
          <el-input ></el-input>
        </el-row>
        <el-row>
          <span style="line-height: 30px">内容</span>
        </el-row>
        <Editor></Editor>
        <div slot="footer" class="dialog-footer">
          <el-button @click="BatchEailDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  新增---复制手工dal--------------------------->
      <el-dialog :title="AddOrderDal.Title"  :visible.sync="AddOrderDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row>
          <el-tabs v-model="AddOrderDal.activeName" @tab-click="" >
            <el-tab-pane label="基础信息" name="0" :disabled="AddOrderDal.TabDis">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="平台" prop="name">
                  <el-select v-model="ruleForm.name" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="账号信息" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="市场/站点" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发货仓库" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="物流方式" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="订单币种" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="运费" prop="number">
                  <el-input v-model.number="ruleForm.number" auto-complete="off" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="desc">
                  <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品信息" name="1" :disabled="AddOrderDal.TabDis">
              <el-row style="margin-bottom: 15px">
                <el-button type="primary" size="small" @click="AddSkuDal.Dal=true" class="el-icon-plus">添加SKU</el-button>
              </el-row>
              <div class="item_list">
                <el-table :data="GetListData" border tooltip-effect="dark" style="width: 100%" >
                  <el-table-column label="操作"  prop="label" align="center" >
                    <template scope="scope">
                      <span v-text="scope.row.stockId"></span><br>
                    </template>
                  </el-table-column>
                  <el-table-column sortable label="图片" align="center" prop="stockNo">
                    <template scope="scope">
                      <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="RmsUrl+scope.row.imageUrl"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="SKU"  prop="label" align="center" ></el-table-column>
                  <el-table-column label="商品名称"  prop="label" align="center" >
                    <template scope="scope">
                      <span v-text="scope.row.stockId"></span><br>
                    </template>
                  </el-table-column>
                  <el-table-column label="SKU均价"  prop="label" align="center" >
                    <template scope="scope">
                      <span v-text="scope.row.stockId"></span><br>
                    </template>
                  </el-table-column>
                  <el-table-column label="本次售价"  prop="label" align="center" >
                    <template scope="scope">
                      <div>
                        <el-input type="number" v-model="scope.row" @change=""></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量"  prop="label" align="center" >
                    <template scope="scope">
                      <div>
                        <el-input type="number" v-model="scope.row" @change=""></el-input>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="客户信息" name="2" :disabled="AddOrderDal.TabDis">
              <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                  <el-form-item label="客户ID" prop="date1">
                    <el-input v-model="ruleForm2.date1"></el-input>
                  </el-form-item>
                  <el-form-item label="买家名" prop="date1">
                    <el-input v-model="ruleForm2.date1" ></el-input>
                  </el-form-item>
                  <el-form-item label="买家邮箱" prop="date1">
                    <el-input v-model="ruleForm2.date1"></el-input>
                  </el-form-item>
                  <el-form-item label="收件人" prop="date1">
                    <el-input v-model="ruleForm2.date1"></el-input>
                  </el-form-item>
                <el-form-item label="收件人地址1" prop="date2">
                  <el-input v-model="ruleForm2.date2"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址2" prop="date2">
                  <el-input v-model="ruleForm2.date2"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址3" prop="date2">
                  <el-input v-model="ruleForm2.date2"></el-input>
                </el-form-item>
                <el-form-item label="city" prop="date2">
                  <el-input v-model="ruleForm2.date1"></el-input>
                </el-form-item>
                <el-form-item label="District" prop="date2">
                  <el-input v-model="ruleForm2.date1"></el-input>
                </el-form-item>
                <el-form-item label="State" prop="date2">
                  <el-input v-model="ruleForm2.date1"></el-input>
                </el-form-item>
                <el-form-item label="Post Code" prop="date2">
                  <el-input v-model="ruleForm2.date1"></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="date2">
                  <el-input v-model="ruleForm2.date1"></el-input>
                </el-form-item>
                <el-form-item label="国家" prop="region">
                  <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="付款信息" name="3" :disabled="AddOrderDal.TabDis">
              <el-row>
                <el-col :span="6" class="text-R" style="margin-right: 50px">
                  <el-row class="text-Lh">付款方式2</el-row>
                  <el-row class="text-Lh" v-show="radio2===1">PayPal账号</el-row>
                  <el-row class="text-Lh" v-show="radio2===1">PayPal交易号</el-row>
                  <el-row class="text-Lh" v-show="radio2===2">银行转账交易ID</el-row>
                  <el-row class="text-Lh" v-show="radio2===2">交易ID详情</el-row>
                  <el-row class="text-Lh text-R" v-show="radio2===2" >
                    <el-col :span="11" style="margin-left: 5px"> 扩大范围</el-col>
                    <el-col :span="5" style="margin-left: 5px"> <el-input size="small"></el-input></el-col>
                    <el-col :span="5" > <el-button type="primary" size="small" :loading="$store.state.loading">确定</el-button></el-col>
                  </el-row>
                </el-col>
                <el-col :span="14">
                  <el-row class="text-Lh">
                    <el-radio-group v-model="radio2">
                      <el-radio :label="1">1</el-radio>
                      <el-radio :label="2">2</el-radio>
                      <el-radio :label="3">3</el-radio>
                    </el-radio-group>
                  </el-row>
                  <el-row class="text-Lh" v-show="radio2===1">
                    <el-select v-model="Tabel4.data1" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="text-Lh" v-show="radio2===1">
                    <el-input v-model="Tabel4.data2"></el-input>
                  </el-row>
                  <el-row class="text-Lh" v-show="radio2===2">
                    <el-select v-model="Tabel4.data1" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-row>
                  <el-row  v-show="radio2===2">
                    <el-row style="border: 1px solid #bfcbd9; margin-top: 10px; line-height: 25px">
                      <el-col :span="2" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 35px">
                        <el-radio class="radio" v-model="radio" label="addd" ><span v-show="false" > 222</span></el-radio>
                      </el-col>
                      <el-col :span="3" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 20px">
                       <span>交易id</span><br />
                        <el-tooltip content="查看"  effect="dark" placement="bottom">
                          <i  class="iconfontyyy" content="Bottom center" @click="">&#xe600;</i>
                        </el-tooltip>
                      </el-col>
                      <el-col :span="19">
                        <el-row style="border-bottom: 1px solid #bfcbd9; height: 80px; text-align: center;">
                          <el-col :span="4">备注</el-col>
                          <el-col :span="20">备注备注备注备注备备注备注备注备注备备注备注备注备注备备注备注备注备注备注注注注</el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4" style="text-align: center;">付款人</el-col>
                          <el-col :span="20">备备注备注备注备注注</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row style="border: 1px solid #bfcbd9; margin-top: 10px; line-height: 25px">
                      <el-col :span="2" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 35px">
                        <el-radio class="radio" v-model="radio" label="abb" ><span v-show="false" > 222</span></el-radio>
                      </el-col>
                      <el-col :span="3" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 20px">
                        <span>交易id</span><br />
                        <el-tooltip content="查看"  effect="dark" placement="bottom">
                          <i  class="iconfontyyy" content="Bottom center" @click="">&#xe600;</i>
                        </el-tooltip>
                      </el-col>
                      <el-col :span="19">
                        <el-row style="border-bottom: 1px solid #bfcbd9; height: 80px; text-align: center;">
                          <el-col :span="4">备注</el-col>
                          <el-col :span="20">备注备注备注备注备备注备注备注备注备备注备注备注备注备备注备注备注备注备注注注注</el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4" style="text-align: center;">付款人</el-col>
                          <el-col :span="20">备备注备注备注备注注</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddOrderDal.Dal = false;">关闭</el-button>
          <el-button type="" @click="goPrev()" v-if="AddOrderDal.activeName!=0">上一步</el-button>
          <el-button type="" @click="goNext()" v-if="AddOrderDal.activeName!=3 && AddOrderDal.activeName!=0 ">下一步</el-button>
          <el-button type="primary" @click="" v-if="AddOrderDal.activeName == 4" :loading="$store.state.loading">保 存</el-button>
          <el-button type="primary" @click="goNext()" v-if="AddOrderDal.activeName!=4" :loading="$store.state.loading">保 存&下一步</el-button>
        </div>
      </el-dialog>
      <!--  退款dal--------------------------->
      <el-dialog title="退款"  :visible.sync="RefundDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row>
          <el-col :span="7" class="text-R" style="margin-right: 50px">
            <el-row>全部/部分退款：</el-row>
          </el-col>
          <el-col :span="15">
            <el-row>
              <el-radio-group v-model="radio2">
                <el-radio :label="1">退款申请</el-radio>
                <el-radio :label="2">直接退款</el-radio>
              </el-radio-group>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="radio2===1">
          <el-col :span="7" class="text-R" style="margin-right: 50px">
            <el-row class="textLin">退款原因：</el-row>
            <el-row class="textLin">全部/部分退款：</el-row>
            <el-row class="textLin">退款金额：</el-row>
            <el-row class="textLin">是否已发货：</el-row>
            <el-row class="textLin">是否需退件：</el-row>
            <el-row class="textLin">是否已完成退款：</el-row>
            <el-row class="textLin">退款方式：</el-row>
            <el-row class="textLin">图片：</el-row>
            <el-row class="textLin">退款备注：</el-row>
          </el-col>
          <el-col :span="15">
            <el-row class="textLin">
              <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-row>
            <el-row class="textLin">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">全部退款</el-radio>
                <el-radio :label="2">部分退款</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="textLin">
              <!--<span >该订单的金额如 2.10EUR</span>-->
              <el-col :span="9"><el-input type="text" size="small"></el-input></el-col>
              <el-col :span="3" style="margin-left: 10px">单位</el-col>
            </el-row>
            <el-row class="textLin">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="textLin">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">不需要</el-radio>
                <el-radio :label="2">需要部分退回</el-radio>
                <el-radio :label="3">需要完全退回</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="textLin">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="textLin">
              <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-row>
            <el-row class="textLin">
              <el-button type="primary" size="small" @click="">添加图片</el-button>
            </el-row>
            <el-row class="textLin">
              <el-input type="textarea"></el-input>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="radio2===2">
          <el-col :span="7" class="text-R" style="margin-right: 50px">
            <el-row class="textLin">退款原因：</el-row>
            <el-row class="textLin">退款金额：</el-row>
            <el-row class="textLin">是否已发货：</el-row>
            <el-row class="textLin">是否需退件：</el-row>
            <el-row class="textLin">退款方式：</el-row>
            <el-row class="textLin">PaypalP账号：</el-row>
            <el-row class="textLin">PayPal交易号：</el-row>
            <el-row class="textLin">退款备注：</el-row>
          </el-col>
          <el-col :span="15">
            <el-row class="textLin">
              <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-row>
            <el-row class="textLin">
              <span >该订单的金额如 2.10EUR</span>
            </el-row>
            <el-row class="textLin">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="textLin">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">不需要</el-radio>
                <el-radio :label="2">需要部分退回</el-radio>
                <el-radio :label="3">需要完全退回</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="textLin">
              <span >PayPal</span>
            </el-row>
            <el-row class="textLin">
              <span >该订单对应的收款账号</span>
            </el-row>
            <el-row class="textLin">
              <span >该订单收款是的交易号</span>
            </el-row>
            <el-row class="textLin">
              <el-input type="textarea"></el-input>
            </el-row>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="RefundDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  拦截dal--------------------------->
      <el-dialog title="拦截订单"  :visible.sync="InterceptDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <template>
          <el-tabs v-model="InterceptDal.activeName" @tab-click="handleClick">
            <el-tab-pane label="改地址" name="1">
              <el-row style="font-size: 16px; margin-bottom: 20px">客户信息</el-row>
              <el-form ref="form" :model="InterceptDal.InterceptData" label-width="120px">
                <el-form-item label="客户ID：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="姓名：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="地址：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="城市：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="州：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="国家：">
                  <el-select v-model="InterceptDal.InterceptData.data2" placeholder="请选择国家">
                    <el-option label="国家1" value="shanghai"></el-option>
                    <el-option label="国家2" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮编：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="客户邮箱：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="改发货方式" name="2">
              <el-row style="font-size: 16px; margin-bottom: 20px">尾程信息</el-row>
              <el-form ref="form" :model="InterceptDal.InterceptData" label-width="120px">
                <el-form-item label="客户指定物流方式：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="平台运费：">
                  <el-col :span="18">
                    <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="InterceptDal.InterceptData.data2" placeholder="请选择国家">
                      <el-option label="国家1" value="shanghai"></el-option>
                      <el-option label="国家2" value="beijing"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="发货仓库：" :rules="[ { required: true, message: '请选择发货仓库', trigger: 'blur'}]">
                  <el-select v-model="InterceptDal.InterceptData.data2" placeholder="请选择国家">
                    <el-option label="国家1" value="shanghai"></el-option>
                    <el-option label="国家2" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="物流方式：" :rules="[ { required: true, message: '请选择物流方式', trigger: 'blur'}]">
                  <el-select v-model="InterceptDal.InterceptData.data2" placeholder="请选择国家">
                    <el-option label="国家1" value="shanghai"></el-option>
                    <el-option label="国家2" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="重量：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>
                <el-form-item label="估计运费：">
                  <el-col :span="18">
                    <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="InterceptDal.InterceptData.data2" placeholder="请选择国家">
                      <el-option label="国家1" value="shanghai"></el-option>
                      <el-option label="国家2" value="beijing"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="跟踪单号：">
                  <el-input v-model="InterceptDal.InterceptData.data1"></el-input>
                </el-form-item>

              </el-form>
            </el-tab-pane>
            <el-tab-pane label="退款" name="3">
              <el-input type="textarea" placeholder="请输入拦截原因"></el-input>
            </el-tab-pane>
            <el-tab-pane label="其他" name="4">
              <el-input type="textarea" placeholder="请输入拦截原因"></el-input>
            </el-tab-pane>
          </el-tabs>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click="InterceptDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  发起预退件&& 重寄申请 dal--------------------------->
      <el-dialog :title="LaunchReturnDal.title"  :visible.sync="LaunchReturnDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row >
          <el-col :span="10" style="font-size: 16px">订单产品信息</el-col>
          <el-col :span="8" >
            <el-input placeholder="请输入SKU" v-show="switchs===false"></el-input>
            <span v-show="switchs===true" style="color: #ffffff">.</span>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-input placeholder="数量" v-show="switchs===false"></el-input>
            <span v-show="switchs===true" style="color: #ffffff">.</span>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button  v-show="switchs===false" type="primary" :loading="$store.state.loading">确 定</el-button>
            <span v-show="switchs===true" style="color: #ffffff">.</span>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button  type="text" class="Astyle" @click="switchsFn">添加SKU</el-button>
          </el-col>
        </el-row>
        <div class="item_list">
          <el-table :data="GetListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
            <el-table-column label="操作"  prop="label" align="center"  width="150">
              <template scope="scope">
                <el-tooltip content="删除"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="DalRowData(scope.row, '删除')">&#xe6f7;</i>
                </el-tooltip>
                <el-tooltip content="打印"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="DalRowData(scope.row, '打印')">&#xe638;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="图片"  prop="label" align="center" >
              <template scope="scope">
              </template>
            </el-table-column>
            <el-table-column label="商品名称"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="SKU"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="尺寸"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="数量"  prop="label" align="center" width="100">
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row style="font-size: 16px; line-height: 40px">退回仓库</el-row>
        <el-row>
          <el-select v-model="InterceptDal.InterceptData.data2" placeholder="">
            <el-option label="国家1" value="shanghai"></el-option>
            <el-option label="国家2" value="beijing"></el-option>
          </el-select>
        </el-row>
        <el-row style="font-size: 16px; line-height: 40px">退回配送方式</el-row>
        <el-row>
          <el-select v-model="InterceptDal.InterceptData.data2" placeholder="">
            <el-option label="国家1" value="shanghai"></el-option>
            <el-option label="国家2" value="beijing"></el-option>
          </el-select>
        </el-row>
        <el-row style="font-size: 16px; line-height: 40px"><el-button  type="text" class="Astyle" @click="">添加图片</el-button></el-row>
        <!--重寄申请-->
        <el-row v-show="LaunchReturnDal.title==='重寄申请'">
          <el-row style="font-size: 16px; line-height: 40px">重寄原因</el-row>
          <el-row>
            <el-select v-model="InterceptDal.InterceptData.data2" placeholder="">
              <el-option label="国家1" value="shanghai"></el-option>
              <el-option label="国家2" value="beijing"></el-option>
            </el-select>
          </el-row>
          <el-row style="font-size: 16px; line-height: 40px">是否需退件：</el-row>
          <el-row>
            <el-radio-group v-model="radio2">
              <el-radio :label="1" >不需要</el-radio>
              <el-radio :label="2" @click.native ="LaunchReturnGoodsFn">需要部分退回</el-radio>
              <el-radio :label="3" @click.native="LaunchReturnGoodsFn">需要完全退回</el-radio>
            </el-radio-group>
          </el-row>
        </el-row>
        <el-row style="font-size: 16px; line-height: 40px">备注</el-row>
        <el-row>
          <el-input type="textarea" placeholder="请输入备注"></el-input>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="LaunchReturnDal.Dal = false;">关 闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  重寄需退件物品选择 dal--------------------------->
      <el-dialog :title="LaunchReturnGoodsDal.title"  :visible.sync="LaunchReturnGoodsDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row >
          <el-col :span="10" style="font-size: 16px">订单产品信息</el-col>
          <el-col :span="8" >
            <el-input placeholder="请输入SKU" v-show="switchs===false"></el-input>
            <span v-show="switchs===true" style="color: #ffffff">.</span>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-input placeholder="数量" v-show="switchs===false"></el-input>
            <span v-show="switchs===true" style="color: #ffffff">.</span>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button  v-show="switchs===false" type="primary" :loading="$store.state.loading">确 定</el-button>
            <span v-show="switchs===true" style="color: #ffffff">.</span>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button  type="text" class="Astyle" @click="switchsFn">添加SKU</el-button>
          </el-col>
        </el-row>
        <div class="item_list">
          <el-table :data="GetListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
            <el-table-column label="操作"  prop="label" align="center"  width="150">
              <template scope="scope">
                <el-tooltip content="删除"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="DalRowData(scope.row, '删除')">&#xe6f7;</i>
                </el-tooltip>
                <el-tooltip content="打印"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="DalRowData(scope.row, '打印')">&#xe638;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="图片"  prop="label" align="center" >
              <template scope="scope">
              </template>
            </el-table-column>
            <el-table-column label="商品名称"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="SKU"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="尺寸"  prop="label" align="center" >
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
            <el-table-column label="数量"  prop="label" align="center" width="100">
              <template scope="scope">
                <span v-text="scope.row.stockId"></span><br>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row style="font-size: 16px; line-height: 40px">退回仓库</el-row>
        <el-row>
          <el-select v-model="InterceptDal.InterceptData.data2" placeholder="">
            <el-option label="国家1" value="shanghai"></el-option>
            <el-option label="国家2" value="beijing"></el-option>
          </el-select>
        </el-row>
        <el-row style="font-size: 16px; line-height: 40px">退回配送方式</el-row>
        <el-row>
          <el-select v-model="InterceptDal.InterceptData.data2" placeholder="">
            <el-option label="国家1" value="shanghai"></el-option>
            <el-option label="国家2" value="beijing"></el-option>
          </el-select>
        </el-row>
        <el-row style="font-size: 16px; line-height: 40px">重寄需退件物品备注</el-row>
        <el-row>
          <el-input type="textarea" placeholder="请输入备注"></el-input>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="LaunchReturnGoodsDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  手工同步订单 dal--------------------------->
      <el-dialog title="手工同步订单"  :visible.sync="SynchroOrderDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
        <el-row >
          <el-col :span="7" class="text-R" style="margin-right: 50px">
            <el-row class="textLin">平台：</el-row>
            <el-row class="textLin">账号：</el-row>
            <el-row class="textLin">市场/站点：</el-row>
            <el-row class="textLin">平台订单号：</el-row>
            <el-row class="textLin">开始时间：</el-row>
            <el-row class="textLin">结束时间：</el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="textLin">
              <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-row>
            <el-row class="textLin">
              <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-row>
            <el-row class="textLin">
              <el-select v-model="selectParams.optionTitle" filterable clearable @change="getOrderList();" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-row>
            <el-row class="textLin">
             <el-input></el-input>
            </el-row>
            <el-row class="textLin">
              <el-input></el-input>
            </el-row>
            <el-row class="textLin">
              <el-input></el-input>
            </el-row>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="SynchroOrderDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  新增配件申请 外部组件 --------------------------->
      <Accessory :DialogTitle="getinfoModel.title" :getpoId="orderId" :getdata="dialogInfo"  :infoisOpen="getinfoModel.isOpen"  @Change-list="getchangeList"></Accessory>
      <!--  认领付款dal--------------------------->
      <el-dialog title="认领付款" :visible.sync="ClaimPaymentDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
        <el-row>
          <el-col :span="6" class="text-R" style="margin-right: 50px">
            <el-row class="text-Lh" >银行转账交易ID</el-row>
            <el-row class="text-Lh" >交易ID详情</el-row>
            <el-row class="text-Lh text-R"  >
              <el-col :span="11" style="margin-left: 5px"> 扩大范围</el-col>
              <el-col :span="5" style="margin-left: 5px"> <el-input size="small"></el-input></el-col>
              <el-col :span="5" > <el-button type="primary" size="small" :loading="$store.state.loading">确定</el-button></el-col>
            </el-row>
          </el-col>
          <el-col :span="14">
            <el-row class="text-Lh" >
              <el-input v-model="Tabel4.data2"></el-input>
            </el-row>
            <el-row class="text-Lh" >
              <el-select v-model="Tabel4.data1" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-row>
            <el-row  >
              <el-row style="border: 1px solid #bfcbd9; margin-top: 10px; line-height: 25px">
                <el-col :span="2" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 35px">
                  <el-radio class="radio" v-model="radio" label="addd" ><span v-show="false" > 222</span></el-radio>
                </el-col>
                <el-col :span="3" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 20px">
                  <span>交易id</span><br />
                  <el-tooltip content="查看"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="SeeBankAccountDal.Dal=true">&#xe600;</i>
                  </el-tooltip>
                </el-col>
                <el-col :span="19">
                  <el-row style="border-bottom: 1px solid #bfcbd9; height: 80px; text-align: center;">
                    <el-col :span="4">备注</el-col>
                    <el-col :span="20" >备注备注备注备注备备注备注备注备注备备注备注备注备注备备注备注备注备注备注注注注</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" style="text-align: center;">付款人</el-col>
                    <el-col :span="20">备备注备注备注备注注</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row style="border: 1px solid #bfcbd9; margin-top: 10px; line-height: 25px">
                <el-col :span="2" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 35px">
                  <el-radio class="radio" v-model="radio" label="abb" ><span v-show="false" > 222</span></el-radio>
                </el-col>
                <el-col :span="3" style="border-right: 1px solid #bfcbd9; text-align: center; height: 105px; padding-top: 20px">
                  <span>交易id</span><br />
                  <el-tooltip content="查看"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="SonDal()">&#xe600;</i>
                  </el-tooltip>
                </el-col>
                <el-col :span="19">
                  <el-row style="border-bottom: 1px solid #bfcbd9; height: 80px; text-align: center;">
                    <el-col :span="4">备注</el-col>
                    <el-col :span="20">备注备注备注备注备备注备注备注备注备备注备注备注备注备备注备注备注备注备注注注注</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" style="text-align: center;">付款人</el-col>
                    <el-col :span="20">备备注备注备注备注注</el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ClaimPaymentDal.Dal = false;">关 闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  取消订单dal--------------------------->
      <el-dialog title="取消订单" :visible.sync="CancelOrderDal.Dal" :close-on-click-modal="false" size="tiny" @close="closeData">
        <el-row style="text-align: center">
          您确定客户或者您需要取消订单？请选择取消原因！
        </el-row>
        <el-row style="margin-bottom: 20px; text-align: center; margin-top: 20px">
            <el-select v-model="CancelOrderDal.CancelOrderData.data1" placeholder="请选择">
              <el-option
                v-for="item in List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="CancelOrderDal.Dal = false;">关闭</el-button>
          <el-button type="primary" @click="" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--  查看银行转账dal--------------------------->
      <el-dialog title="查看银行转账" :visible.sync="SeeBankAccountDal.Dal" :close-on-click-modal="false" size="small" @close="closeData">
       <el-row>
         <el-col :span="6" class="text-R" style="margin-right: 30px">
           <el-row style="line-height: 25px">交易银行</el-row>
           <el-row style="line-height: 25px">付款日期</el-row>
           <el-row style="line-height: 25px">计息日（value date）</el-row>
           <el-row style="line-height: 25px">交易类型</el-row>
           <el-row style="line-height: 25px">付款金额</el-row>
           <el-row style="line-height: 25px">币种</el-row>
           <el-row style="line-height: 25px">转账备注(booking text)</el-row>
           <el-row style="line-height: 25px">Account of Initiator</el-row>
           <el-row style="line-height: 25px">Bank Code</el-row>
           <el-row style="line-height: 25px">IBAN</el-row>
           <el-row style="line-height: 25px">关联订单</el-row>
           <el-row style="line-height: 25px">关联操作人</el-row>
           <el-row style="line-height: 25px">关联时间</el-row>
         </el-col>
         <el-col :span="13">
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
           <el-row style="line-height: 25px">{{SeeBankAccountDal.SeeBankAccountData.data1}}</el-row>
         </el-col>
       </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="SeeBankAccountDal.Dal = false;">关闭</el-button>
        </div>
      </el-dialog>
      <!--  筛选dal--------------------------->
      <div class="smallDia" >
        <el-dialog title="筛选" :visible.sync="ScreenDialog" size="small" :close-on-click-modal="false" @open="DeleteScreen">
          <div class="data_body">
            <el-row class="row_title row" :getter="20">
              <el-col class="col" :span="4">条件</el-col>
              <el-col class="col" :span="4">比较方式</el-col>
              <el-col class="col" :span="16">输入</el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">平台</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">店铺账号</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">市场/站点</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">订单号</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-input v-model="screenData.cgNo">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">收件人/邮箱/地址/邮编</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-input v-model="screenData.stockNo">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">物流方式</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">发货仓库</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">SKU</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-input v-model="screenData.stockNo">
                </el-input>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">销售人员</el-col>
              <el-col class="tatestyle" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  placeholder="请选择" v-model="screenData.isCustoms" clearable filterable>
                  <el-option
                    v-for="item in options"
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
            <el-button @click="DeleteScreen(); ScreenDialog=false;">清除条件</el-button>
            <el-button @click="ScreenDialog=false; GiveScreen()">筛 选</el-button>
            <el-button @click="ScreenDialog=false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <ClaimPayment ref="ClaimPayment"></ClaimPayment>
      <div id="page" class="page">
        <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
      </div>

    </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  import ClaimPayment from "./OrderDialgog/ClaimPayment.vue";
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import Accessory from './SonModula/AccessoryApplication.vue'
//  import Editor from "components/Tinymce/Editor.vue";
  export default{
    components: {
      ElButton,
      ElDialog,
      ElInput,
      ElCol,
      ElRow,
      Accessory,
      ClaimPayment

    },
    data(){
      return {
        List:[
          {label:'111',value:'222'},
          {label:'111',value:'222'},
          {label:'111',value:'222'},
        ],
        radio2:1,
        radio:'',
        switchs:true,
        GetListData:[],
        activeNames: ['1'],    //  筛选 功能的折叠面板
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        TableData:[],
        defaultData:{
          activeName2:'0',
          isFavorite:'',
          exportType:'',
          skuNos:[],//Sku
          whId:'',//仓库ID
          saleStatusId:'',//销售状态ID
          keyPath:'',//分类路径
          locationNo:'',//库位号
          prductNames:'',//多个商品名称
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
        },
        options: [
          {
            value: 0,
            label: '系统订单号'
          },
          {
            value: 1,
            label: '平台订单号'
          }],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        ScreenDialog:false,
        screenData:{//筛选
          stockNo:'',//所属备货计划
          cgNo:'',//关联采购订单
          skuNo:'',//Sku
          isCustoms:'',//是否报关
          attributeId:'',//属性Id
        },
        sels:[],//批量对象
        EailDal:{//邮件
          Dal:false,
          Dis:false,
          EailData:{
            data1:'',
            data2:'',
            data3:'',
          }
        },
        AddOrderDal:{//新增
          Dal:false,
          Dis:false,
          Title:'',
          AddOrderData:{
            data1:'',
            data2:'',
            data3:'',
          },
          activeName:'',
          TabDis:false,
        },
        AddRemarksDal:{//备注
          Dal:false,
          Dis:false,
          AddRemarksDate:{
            data1:'',
            data2:'',
            data3:'',
          },
          activeName: 'second'
        },
        AddSkuDal:{//备注
          Dal:false,
          Dis:false,
          AddSkuData:{
            data1:'',
            data2:'',
            data3:'',
          },
          activeName: 'second'
        },
        BatchEailDal:{//批量邮件
          Dal:false,
          Dis:false,
          EailData:{
            data1:'',
            data2:'',
            data3:'',
          }
        },
        AuditSettingsDal:{//审核设置
          Dal:false,
          Dis:false,
          AuditSettingsData:{
            data1:'',
            data2:'',
            data3:'',
          },
          List:[
            {value:'一直开启', key:'1'},
            {value:'一直关闭', key:'2'},
            {value:'以下时间开启', key:'3'},
            {value:'以下时间关闭', key:'4'},
          ],
          startTime: '',
          Time: [],
          tabArr:['0','1','2','3','4'],     // tab 标签页数组
        },
        RefundDal:{
          Dal:false,
          Dis:false,
          RefundData:{
            data1:'',
            data2:'',
            data3:'',
          },
        },
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number: ''
        },
        rules: {
          date1: [
            { required: true, message: '请选择平台', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择账号信息', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: false, message: '请填写活动形式', trigger: 'blur' }
          ],
          number:[
            { required: true, message: '运费不能为空'},
            { type: 'number', message: '必须为数字值'},
            { min: 1, max: 20, message: '超出长度', trigger: 'blur' }
          ]
        },
        ruleForm2: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number: ''
        },
        rules2: {
          date1: [
            { required: true, message: '请选择平台', trigger: 'blur' },
          ],
          date2: [
            { required: true, message: '请选择账号信息', trigger: 'change' }
          ],
          number:[
            { required: true, message: '运费不能为空'},
            { type: 'number', message: '必须为数字值'},
            { min: 1, max: 20, message: '超出长度', trigger: 'blur' }
          ]
        },
        Tabel4:{
            data1:'',
            data2:'',
            data3:'',
            data4:'',
            data5:'',
        },
        InterceptDal:{//拦截
          activeName:'1',
          Dal:false,
          Dis:false,
          InterceptData:{
            data1:'',
            data2:'',
            data3:'',
          },
        },
        LaunchReturnDal:{//预退件
          title:'',
          activeName:'1',
          Dal:false,
          Dis:false,
          LaunchReturnData:{
            data1:'',
            data2:'',
            data3:'',
          },
        },
        LaunchReturnGoodsDal:{//重寄需退件物品选择
          title:'',
          activeName:'1',
          Dal:false,
          Dis:false,
          LaunchReturnGoodsData:{
            data1:'',
            data2:'',
            data3:'',
          },
        },
        getinfoModel:{
          isOpen:false,
          type:'',
          title:''
        },
        orderId:'',
        dialogInfo:false,
        SynchroOrderDal:{//同步手工订单
          Dal:false,
          Dis:false,
          SynchroOrderData:{
            data1:'',
            data2:'',
            data3:'',
        },
      },
        ClaimPaymentDal: {//认领付款
          Dal: false,
          Dis: false,
          ClaimPaymentData: {
            data1: '',
            data2: '',
            data3: '',
          }
        },
        CancelOrderDal: {//认领付款
          Dal: false,
          Dis: false,
          CancelOrderData: {
            data1: '',
            data2: '',
            data3: '',
          }
        },
        SeeBankAccountDal: {//银行转账
          Dal: false,
          Dis: false,
          SeeBankAccountData: {
            data1: '1',
            data2: '12',
            data3: '123',
          }
        },
        SonDalDal: {//银行转账
          Dal: false,
          Dis: false,
          modal: true,
          SeeBankAccountData: {
            data1: '1',
            data2: '12',
            data3: '123',
          }
        },

      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入订单编号' : this.selectParams.optionTitle == 1 ? '请输入平台编号':'';
      },
    },
    mounted () {
      this.getOrderList();

    },
    methods: {
      ...mapMutations([
        'EditorContent',
      ]),
      SonDal:function () {
        this.SonDalDal.Dal=true;
        this.SonDalDal.modal=false;
        this.$refs.ClaimPayment.Initialization(this.SonDalDal)
      },
      getOrderList:function () {
        this.$http.get('static/Table2.json').then(res=>{
          this.GetListData=res.data.table;
        })
      },
      handleClick(tab, event) {//新增弹窗
        console.log(tab, event);
      },
      handleClick2(tab, event) {//重寄 退货下 tabs
        console.log(tab, event);
      },
      goPrev:function(){
        this.AddOrderDal.activeName = this.AuditSettingsDal.tabArr[this.AuditSettingsDal.tabArr.indexOf(this.AddOrderDal.activeName)-1];
      },
      goNext:function() {
        this.AddOrderDal.activeName = this.AuditSettingsDal.tabArr[this.AuditSettingsDal.tabArr.indexOf(this.AddOrderDal.activeName) + 1];
      },
      RowData:function (row, state) {//行内操作
        let _this=this;
        switch(state){
          case '查看':

            break;
          case '打印':
            alert('打印')
            break;
          case '历史销量':
            window.open('#/HistoricalSales?Id='+row.stockId);
            break;
          case '商品库存':
            window.open('#/commodityStock?Id='+row.stockId);
            break;
          case '订单详情':
            window.open('#/orderDetails?transferId='+row.transferId+ '&Whether=0');
            break;
          case '拦截订单':
           this.InterceptDal.Dal=true;
          break;
          case '添加备注':
            this.AddRemarksDal.Dal=true;
            break;
          case '发送消息/邮件':
              this.EailDal.Dal= true;
            this.EditorContent('<p>44424224</p><p>3232</p>');
            break;
          case '作废订单':
            _this.doItem('您确定要作废该订单？作废后将移入已作废订单，请谨慎操作!','warehouseAllotting/cartontToCartonInvalidById',row.stockId,_this.getOrderList());
            break;
          case '提交审核':
            _this.doItem('您确定提交该订单进行审核？','warehouseAllotting/cartontToCartonInvalidById',row.stockId,_this.getOrderList());
            break;
          case '取消绑定':
            _this.doItem('您确定该订单认领付款的需要解绑？解绑后该订单进入未付款。','warehouseAllotting/cartontToCartonInvalidById',row.stockId,_this.getOrderList());
            break;
          case '复制创建手工订单':
            this.AddOrderDal.Title='复制创建手工订单';
            this.AddOrderDal.Dal=true;
            break;
          case '发起预退件':
            this.LaunchReturnDal.Dal=true;
            this.LaunchReturnDal.title='发起预退件';
            break;
          case '重寄申请':
            this.LaunchReturnDal.Dal=true;
            this.LaunchReturnDal.title='重寄申请';
            break;
          case '新增配件申请':
            this.dialogInfo=false;
            this.getinfoModel.isOpen = true;
            this.getinfoModel.title='新增配件申请';
            break;
          case '退款':
            this.RefundDal.Dal = true;
            break;
          case '认领付款':
            this.ClaimPaymentDal.Dal = true;
            break;
          case '取消订单':
            this.CancelOrderDal.Dal = true;
            break;
          case '银行转账':
            this.SeeBankAccountDal.Dal = true;
            break;
        }
      },
      SingleOperation:function (key,Sonkey) {
          let _this=this;
          let sels=this.sels;//表格对象
          for(let i=0; i<sels.length; i++){//for出需要的批量数组

          }
          if(this.sels.length<1){
            _this.tips();
          }else {
            switch(key){
              case '发邮件':
                  this.BatchEailDal.Dal=true;
                break;
              case '提交审核':
                _this.doItem('您确定要提交该订单的审核？','warehouseAllotting/cartontToCartonInvalidById',sels,_this.getOrderList());
                break;
              case '批量提单':
                _this.doItem('您确定要提交该订单提交第三方审核？','warehouseAllotting/cartontToCartonInvalidById',sels,_this.getOrderList());
                break;
              case '批量作废':
                alert(Sonkey+'模块')
                _this.doItem('您确定要作废该订单？','warehouseAllotting/cartontToCartonInvalidById',sels,_this.getOrderList());
                break;
              case '批量同意':
                  alert(Sonkey+'模块')
                _this.doItem('您确定要同意该订单？','warehouseAllotting/cartontToCartonInvalidById',sels,_this.getOrderList());
                break;
                case '批量不同意':
                  _this.doItem('您确定不同意该订单？','warehouseAllotting/cartontToCartonInvalidById',sels,_this.getOrderList());
                break;
                case '批量回退':
                  _this.doItem('您确定要回退该订单到异常订单？','warehouseAllotting/cartontToCartonInvalidById',sels,_this.getOrderList());
                break;
                case 'SKU':

                break;
            }
          }

      },
      MainOperation:function (key) {//第一排操作
        switch(key){
          case '手工订单':
            this.AddOrderDal.Title='新建手工订单';
            this.AddOrderDal.Dal=true;
            break;
          case '导入订单':
            alert('导入订单')
            break;
          case '筛选':
            this.ScreenDialog=true;
            break;
          case '审核设置':
            this.AuditSettingsDal.Dal=true;
            break;
          case '导出跟踪单':
            alert('导出跟踪单')
            break;
          case '手工同步订单':
            this.SynchroOrderDal.Dal=true;
            break;
          case '在途':

            break;
          case 'SKU':

            break;
        }
      },
      DalRowData:function (row, state) {
        switch(state){
          case '查看':

            break;
          case '打印':
            alert('打印')
            break;
        }
      },
      switchsFn:function () {//显示和隐藏
        if(this.switchs===true){
            this.switchs=false;
        }else {
          this.switchs=true;
        }
      },
      getchangeList:function () {//配件

        this.getinfoModel.isOpen = false;
      },
      LaunchReturnGoodsFn:function () {//重寄需退件物品选择
        this.LaunchReturnGoodsDal.Dal=true;
      },
      selsChange: function (sels) {//批量操作获取ID
        this.sels = sels;
        console.log(this.sels)
      },
      GiveScreen:function () {//筛选赋值给defaultData
        this.CopyObj(this.screenData,this.defaultData);
      },
      DeleteScreen:function () {//清除筛选条件
        this.tool.clearObjValue(this.screenData);
        this.CopyObj(this.defaultData,this.screenData);
        this.AttributeDatas=[];
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
      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.getOrderList();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.getOrderList();
      },
      closeData:function () {//清空数据
        this.EditorContent('');
      },
    }
  }

</script>

<style scoped>
  .simulation{
    border-bottom: 1px solid #dfe6ec;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 180px;
    position: relative;
  }
  .childDiv{
    position: relative;
    top:50%;
  }
  .tatestyle{
    display: block;
    line-height: 41px;
    /*text-align: center;*/
    padding-left: 20px;
    min-height: 41px;
    border-right: 1px solid #e4e4e4
  }
  .textLin{
    line-height: 45px;
  }
  .span_label1{
    width: 80px !important;
    display: inline-block;
  }
</style>
