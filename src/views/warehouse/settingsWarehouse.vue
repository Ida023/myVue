<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row id='filer' >
        <el-collapse  v-model="activeNames" class="marginBottom">
          <el-collapse-item name="1" >
            <el-col class="marginBottom">
              <span class="span_label">仓库类型</span>
              <el-radio-group v-model="whRefId" size="small"  @change="defaultExpandedKey=[];requestemStart($event);"  >
                <el-radio-button label="01"     v-if="ButtonInfo['本地仓']!='0'">本地仓</el-radio-button>
                <el-radio-button label="02"     v-if="ButtonInfo['海外仓']!='0'">海外仓</el-radio-button>
           <!--     <el-radio-button label="03"     v-if="ButtonInfo['第三方仓']!='0'">第三方仓</el-radio-button>-->
                <el-radio-button label="04"     v-if="ButtonInfo['FBA']!='0'">FBA</el-radio-button>
              </el-radio-group>
              <span style="float: right">
                   <el-button size="small" @click="dialogFlag.houseisopen = true" >仓库类型介绍</el-button>
                   <el-button size="small" v-if="ButtonInfo['新建仓库']!='0'" @click="dialogFlag.buildHouse = true;getAmazonoptions();addHouseList();" >新建仓库</el-button>
              </span>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row  id="item_list" style="border-top:1px solid #eef1f6">
        <el-col class="listLeft">
          <el-row :span="24" style="line-height: 45px;text-align: center;">
            <el-col :span="12">仓库总数：<span style="color: red;">{{whCount}}</span>个</el-col>
            <el-col :span="12">启用总数：<span style="color: red;">{{isUseCount}}</span>个</el-col>
          </el-row>
          <el-row style="padding: 10px 0;border-bottom: 1px solid #eef1f6">
            <el-col  :span="15" style="padding-left: 27px;">名称</el-col>
            <el-col  :span="4" style="text-align: right">操作</el-col>
            <el-col  :span="4" style="text-align: right">状态</el-col>
          </el-row>
          <el-tree class="tree-data" :current-node-key="defaultExpandedKey" :data="whList" accordion  :highlight-current="true" :props="defaultProps" node-key="whId" :expand-on-click-node="false" @node-click="getHouseData" :render-content="renderContent">
          </el-tree>
        </el-col>
        <el-col class="listRight">
          <el-row style="flex: 1">
            <el-row v-if="ThirdWarehouse == false">
              <el-col :span="24" v-if='Warehouse == false || FBAlist == true '  style="height: 40px;line-height: 40px;margin-top:4px;">
                <el-col v-if="Warehouseedit == true">
                  <span>{{houseName}}</span>
                  <el-tooltip v-if="houseName!=''" class="item" effect="dark" content="编辑" placement="top-start">
                    <i class="iconfontyyy" @click="Warehouseedit = false;">&#xe6e5;</i>
                  </el-tooltip>
                </el-col>
                <el-col>
                  <el-form v-if="Warehouseedit == false" :inline="true"  class="demo-form-inline borderForm "
                           style="line-height: 22px">
                    <el-form-item label="仓库名称">
                      <el-input v-model="houseName" type="text" placeholder="请输入仓库名称！"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="edithouseName('1');" size="small" :loading="$store.state.loading">保 存</el-button>
                      <el-button type="primary" @click="Warehouseedit = true;" size="small" >取 消</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-col>
              <el-col :span="24" v-if='Warehouse == true'  style="height: 40px;line-height: 40px;margin-top:4px;">
                <el-col v-if="overseasedit == true">
                  <span>{{houseName}}&nbsp;&nbsp;</span>
                  <span><em>所属国家：</em>{{countryName}}</span>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <i class="iconfontyyy" @click="overseasedit = false;">&#xe6e5;</i>
                  </el-tooltip>
                </el-col>
                <el-col>
                  <el-form v-if="overseasedit == false" :inline="true"  class="demo-form-inline borderForm"
                           style="line-height: 22px">
                    <el-form-item label="仓库名称">
                      <el-input v-model="houseName" type="text"  placeholder="请输入仓库名称！"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <CountryList :selectValue="country" @child-change-val="changeCountry"></CountryList>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="edithouseName('2'); " size="small">保 存</el-button>
                      <el-button type="primary" @click="overseasedit = true;"  size="small">取 消</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="border-left:1px solid #eef1f6" v-if="ThirdWarehouse == true">
              <el-col style="width:100%" class="marginBottom ThirdWarehouse  el-collapse-item__header"></el-col>
              <el-col :span="12" >
                <el-form class="demo-ruleForm"  label-width="110px">
                  <el-form-item label="物流接口用户名" prop="">
                    <el-input  auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Key" prop="">
                    <el-input   auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Token" prop="">
                    <el-input ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-col class="marginBottom">
              <el-col style="width:100%" class="el-collapse-item__header" :class="FBAlist == true ? 'Amazon' : 'logistics' "></el-col>
              <el-button type="primary" v-if="FBAlist != true" class="marginBottom  el-button--small " style="margin: 5px 0;" @click="dialogFlag.logisticsedit = true;editLogisticsMethod();">编   辑</el-button>
              <el-button  v-if="FBAlist == true" class="marginBottom  el-button--small " style="float:right;margin: 5px 0;" @click="tool.goToPage('accountManagement')">添加账号</el-button>
              <el-col class="tableBorder">
                <el-col v-if="FBAlist == true">
                  <el-table  :data="FBAData" height="250" border style="width: 100%">
                         <el-table-column prop="" width="80" label="操作" align="center">
                   <template scope="scope"  >
                    <!-- <el-tooltip content="查看"  effect="dark" placement="bottom">
                       <i  class="iconfontyyy"  @click="dialogFlag.logisticsisOpen =true;getLogisticsMode(scope.row);" content="Bottom center">&#xe600;</i>
                     </el-tooltip>-->
                   </template>
                 </el-table-column>
                    <el-table-column prop="accountNo" label="账号" align="center"></el-table-column>
                    <el-table-column prop="prefixCode" label="简称" align="center"></el-table-column>
                    <!--
                                      <el-table-column prop="address" label="区域" align="center"></el-table-column>
                    -->
                    <el-table-column prop="countryName" label="站点" align="center"></el-table-column>
                    <el-table-column prop="address" label="站点别称" align="center">
                      <template scope="scope" class="operation" style="" >
                        <span>{{scope.row.countryName}}-{{scope.row.prefixCode}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="isUse" label="状态" align="center">
                      <template scope="scope" class="operation" style="" >
                        <span>{{scope.row.isUse==true?'启用':'停用'}}</span>
                      </template>
                    </el-table-column>

                  </el-table>
                </el-col>
                <el-col v-if="FBAlist != true" >
                  <el-table :data="LogisticsMethod" height="250" border  >
                    <el-table-column prop="" width="80" label="操作" align="center">
                      <template scope="scope"  >
                        <el-tooltip content="查看"  effect="dark" placement="bottom">
                          <i  class="iconfontyyy"  @click="dialogFlag.logisticsisOpen =true;getLogisticsMode(scope.row);" content="Bottom center">&#xe600;</i>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cnName" label="物流方式（中文）" align="center"></el-table-column>
                    <el-table-column prop="enName" label="物流方式（英文）" align="center"></el-table-column>
                    <el-table-column prop="refValue" label="所属物流类型" align="center"></el-table-column>
                    <el-table-column v-if="ThirdWarehouse == false" prop="" label="尺寸规则" align="center">
                      <template scope="scope">
                        {{'l' + '<' +scope.row.maxLength }}; {{'w' + '<' + scope.row.maxWidth }} ;{{'h'+ '<' + scope.row.maxHeight}}
                      </template>
                    </el-table-column>
                    <el-table-column v-if="ThirdWarehouse == true" prop="address" label="启用" align="center">
                    </el-table-column>
                    <el-table-column prop="isNeedTrackingNo" label="需要跟踪号？" align="center">
                      <template scope="scope">
                        {{scope.row.isNeedTrackingNo == true ? '是' : '否'}}
                      </template>
                    </el-table-column>

                  </el-table>
               <!--   <el-table :data="LogisticsMethod" height="250" border  >
                    <el-table-column prop="" width="80" label="操作" align="center">
                      <template scope="scope" class="operation" style="" >
                        <el-tooltip content="查看"  effect="dark" placement="bottom">
                          <i  class="iconfontyyy"  @click="dialogFlag.logisticsisOpen =true;getLogisticsMode(scope.row);" content="Bottom center">&#xe600;</i>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cnName" label="物流方式（中文）" align="center"></el-table-column>
                    <el-table-column prop="enName" label="物流方式（英文）" align="center"></el-table-column>
                    <el-table-column prop="refValue" label="所属物流类型" align="center"></el-table-column>
                    <el-table-column v-if="ThirdWarehouse == false" prop="" label="尺寸规则" align="center">
                      <template scope="scope">
                        {{'l' + '<' +scope.row.maxLength }}; {{'w' + '<' + scope.row.maxWidth }} ;{{'h'+ '<' + scope.row.maxHeight}}
                      </template>
                    </el-table-column>
                    <el-table-column v-if="ThirdWarehouse == true" prop="address" label="启用" align="center">
                    </el-table-column>
                    <el-table-column prop="isNeedTrackingNo" label="需要跟踪号？" align="center">
                      <template scope="scope">
                        {{scope.row.isNeedTrackingNo == true ? '是' : '否'}}
                      </template>
                    </el-table-column>
                  </el-table>-->
                </el-col>
              </el-col>
            </el-col>
            <el-col class="marginBottom">
              <el-col style="width:100%" class="Authorized el-collapse-item__header marginBottom"></el-col>
              <el-col class="marginBottom"  v-if="listUser!=[]">
                <span style="margin:20px 20px 20px 0;font-size: 14px;" v-for="item in listUser" :key="item.userId">{{item.userName +'('+ item.userNo+')'}}</span>
              </el-col>
            </el-col>
            <el-col class="marginBottom" v-if="WarehouseMsg == true">
              <el-col style="width:100%" class="house Authorized el-collapse-item__header marginBottom"></el-col>
              <el-col :span="15">
                <el-form :model="HouseMsg"  ref="HouseMsg" label-width="100px" class="demo-ruleForm borderForm">
                  <el-form-item :label="Warehouse == false ? '地址' : 'Area'">
                    <v-distpicker  @selected="ChangeonSelected" v-if="Warehouse == false" :province="HouseMsg.province" :city="HouseMsg.city" :area="HouseMsg.district"></v-distpicker>
                    <el-row v-if="Warehouse == true">
                      <el-col :span="5">
                        <el-input type="text" v-model="HouseMsg.province"></el-input>
                      </el-col>
                      <el-col :span="3" style="padding-left: 5px">
                       {{'province'}}
                      </el-col>
                      <el-col :span="5" >
                        <el-input type="text" v-model="HouseMsg.city"></el-input>
                      </el-col>
                      <el-col :span="2" style="padding-left: 5px">
                       {{ 'city'}}
                      </el-col>
                      <el-col :span="5">
                        <el-input type="text" v-model="HouseMsg.district"></el-input>
                      </el-col>
                      <el-col :span="3" style="padding-left: 5px">
                        {{'district'}}
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="Warehouse == false ? '详细地址' : 'Adress'"  prop="address">
                    <el-input type="textarea"  v-model="HouseMsg.address"></el-input>
                  </el-form-item>
                  <el-form-item :label="Warehouse == false ? '邮编' : 'Post No'" prop="postCode">
                    <el-input type="text" v-model="HouseMsg.postCode" ></el-input>
                  </el-form-item>
                  <el-form-item :label="Warehouse == false ? '联系人' : 'Full Name'" prop="contactUser">
                    <el-input type="text" v-model="HouseMsg.contactUser" ></el-input>
                  </el-form-item>
                  <el-form-item :label="Warehouse == false ? '联系邮箱' : 'Email'" prop="contactEmail">
                    <el-input type="text" v-model="HouseMsg.contactEmail" ></el-input>
                  </el-form-item>
                  <el-form-item :label="Warehouse == false ? '联系电话' : 'Phone No'" prop="contactPhone">
                    <el-input type="text" v-model="HouseMsg.contactPhone" ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="edithouseName('3')" :loading="$store.state.loading">保 存</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--仓库介绍查看-->
      <el-dialog title="仓库介绍" :visible.sync="dialogFlag.houseisopen" size="small">
        <el-row>
          <h4>本地仓库</h4>
          <p>
            如果您使用的仓库是自己在运营，并且仓库的工作人员是直接登录通途系统进行包裹的打印、拣货、包装、发货等，我们称此类仓库为“本地仓库”。如果该仓库并非自己运营，包裹是由第三方员工直接登录通途系统帮您处理，此种情况的仓库我们也称之为"本地仓库"。
          </p>
        </el-row>
        <el-row>
          <h4>海外仓库</h4>
          <p>
            如果您有自营仓库在海外，并且同样需要在通途系统中进行管理。可以在这里建立一个海外仓库,除了能使用采购建议向海外仓进行补货功能以外,它还提供了中转仓与海外仓间的货物采购,调拨,装卸箱,收发货等管理功能。对于此类仓库,我们称之为"海外仓库"。
          </p>
        </el-row>
        <el-row>
          <h4>第三方仓库</h4>
          <p>
            如果您使用的仓库是由第三方公司运营，如出口易，递四方等。只需要在列表中选择对应的第三方仓库并启用。系统会通过第三方公司提供的API接口或支持导入的Excel文件完成订单的传递及通知。对方会根据传递的订单完成打印、拣货、包装、发货等工作。对于此类仓库我们称之为“第三方仓库”。
          </p>
        </el-row>
        <el-row>
          <h4>FBA</h4>
          <p>
            Amazon FBA仓库，您可以设置FBA的仓库名称，一般情况下，一个FBA仓库对应一个Amazon账号（但一个Amazon账号可能对应多个FBA）
          </p>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="dialogFlag.houseisopen = false">关 闭</el-button>
        </div>
      </el-dialog>
      <!--仓库货位号查看-->
      <el-dialog title="查看所有库位号" :visible.sync="dialogFlag.LocationisOpen" size="small" @close="batchList = [];">
        <el-col class="marginBottom">
          <el-button type="primary" class="marginBottom" @click="deleteLocation">批量删除库位号</el-button><el-button type="primary" class="marginBottom" @click="deleteNone">删除空库位号</el-button>
        </el-col>
        <div id="item_list">
          <el-table :data="LocationData" border class="" @selection-change="batchChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column
              type="index"
              width="70"
              label="序号"
              align="center">
            </el-table-column>
            <el-table-column prop="locationNo" label="货位号"   sortable align="center"></el-table-column>
            <el-table-column prop="skuNoCount" label="SKU种数"   sortable align="center"></el-table-column>
            <el-table-column property="" label="操作" align="center">
              <template scope="scope" >
                <el-tooltip content="打印"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy"  content="Bottom center">&#xe638;</i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="dialogFlag.LocationisOpen = false">关 闭</el-button>
        </div>
      </el-dialog>
      <!--物流方式查看-->
      <el-dialog title="物流方式详情" :visible.sync="dialogFlag.logisticsisOpen"  size="tiny">
        <el-form :model="LogisticsMode"  :label-width="formLabelWidth">
          <el-form-item label="物流方式名称：" prop="cnName">
            {{LogisticsMode.cnName}}
          </el-form-item>
          <el-form-item label="物流方式名称（英文）：" prop="enName">
            {{LogisticsMode.enName}}
          </el-form-item>
          <el-form-item label="所属物流类型：" prop="refValue">
            {{LogisticsMode.refValue}}
          </el-form-item>
          <el-form-item label="平台物流代码：" prop="platformCode">
            {{LogisticsMode.platformCode}}
          </el-form-item>
          <el-form-item label="国家区域：" prop="receiveCountryArea">
            {{LogisticsMode.receiveCountryArea}}
          </el-form-item>
          <el-form-item label="币种：" prop="currencyName">
            {{LogisticsMode.currencyName}}
          </el-form-item>
          <el-form-item label="首重费用：" prop="firstHeavyCost">
            {{LogisticsMode.firstHeavyCost}}
          </el-form-item>
          <el-form-item label="挂号费：" prop="registrationCost">
            {{LogisticsMode.registrationCost}}
          </el-form-item>
          <el-form-item label="操作费：" prop="handlingCost">
            {{LogisticsMode.handlingCost}}
          </el-form-item>
          <el-form-item label="物流费用规则：" prop="">
            {{'阶梯制'}}
            <p v-for="item in LogisticsMode.costRules" :key="item.maxHeavy">{{item.maxHeavy + '以下,' + item.costAmount}}</p>
          </el-form-item>
          <el-form-item label="尺寸规则：" prop="">
            {{'l' + '<' +LogisticsMode.maxLength }}, {{'w' + '<' + LogisticsMode.maxWidth }} ,{{'h'+ '<' + LogisticsMode.maxHeight}}
          </el-form-item>
          <el-form-item label="跟踪单号：" prop="isNeedTrackingNo">
            {{LogisticsMode.isNeedTrackingNo == true ? '需要' : '不需要'}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFlag.logisticsisOpen = false">关 闭</el-button>
        </div>
      </el-dialog>
      <!--编辑物流方式-->
      <el-dialog title="物流方式" :visible.sync="dialogFlag.logisticsedit" size="tiny" @close="LogisticscheckList=[];">
        <el-row>
          <el-col>请勾选仓库对应物流方式</el-col>
        </el-row>
        <el-row >
          <el-checkbox-group v-model="LogisticscheckList"  @change="handleCheckedCitiesChange">
            <el-checkbox  :label="item.methodId" v-for="item in LogisticsMethodAll" :key="item.methodId" >{{item.cnName}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="dialogFlag.logisticsedit = false">取 消</el-button>
          <el-button type="primary" @click="subMitlogistics();" :loading="$store.state.loading" >确 定</el-button>
        </div>
      </el-dialog>
      <!--新增仓库-->
      <el-dialog title="新建仓库" :visible.sync="dialogFlag.buildHouse" @close=" resetForm('addwarehouse')" >
        <el-col :span="24">
          <el-form :model="addwarehouse"  ref="addwarehouse" :rules="rules" label-width="100px" class="demo-ruleForm" >
          <el-form-item label="仓库名称" prop="whName" :rules="[{required: true, message: '仓库名称不能为空', trigger: 'blur'},{ min: 1, max: 20, message: '名称长度不能超过12个字符', trigger: 'blur' }]">
            <el-input v-model="addwarehouse.whName"></el-input>
          </el-form-item>
          <el-form-item label="仓库属性" prop="whRefId" required>
            <el-radio-group  v-model="addwarehouse.whRefId"  @change="handleClick">
              <el-radio label="01">本地仓库</el-radio>
              <el-radio label="02">海外仓库</el-radio>
              <!--<el-radio label="03">其他第三方仓库</el-radio>-->
              <el-radio label="04">FBA</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-form-item label="" v-if="addwarehouse.whRefId == '04' && FBAflag==true" >
                    <span class="Astyel" @click="addAmazon">您还没有添加任何Amazon账号，请前往设置>></span>
            </el-form-item>
            <el-form-item label="所在国家" prop="countryNo" v-if="addwarehouse.whRefId == '02'" required :rules="{required:true,message:'请选择国家！',trigger:'change' }">
              <CountryList :selectValue="addwarehouse.countryNo" @child-change-val="addchangeCountry" selectType="海外仓" ></CountryList>
            </el-form-item>
            <el-form-item label="第三方仓库" prop="countryNo" v-if="addwarehouse.whRefId == '03'" required >
              <el-select  v-model="optionVal" class="input-Maginbottom">
                <el-option v-for="item in options" :label="item.label" :key="item.label" :value="item.value"></el-option>
              </el-select>
              <el-row v-if="optionVal=='出口易澳洲仓'">
                <el-form-item label="物流接口用户名">
                  <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item label="Key" class="input-Maginbottom">
                  <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item label="Token">
                  <el-input type="text"></el-input>
                </el-form-item>
              </el-row>
              <el-row v-if="optionVal=='通途德国仓'">
                <el-form-item label="appKey" class="input-Maginbottom">
                  <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item label="appToken">
                  <el-input type="text"></el-input>
                </el-form-item>
              </el-row>
            </el-form-item>

            <el-form-item label="Amazon账号" prop="shopAccountId" label-width="110px" v-if="FBAflag==false && addwarehouse.whRefId == '04'" :rules="{required: true, message: '请选择Amazon账号！', trigger: 'blur'}">
              <el-select  v-model="addwarehouse.shopAccountId" class="input-Maginbottom">
                <el-option v-for="item in Amazonoptions" :label="item.accountNoNickname" :key="item.shopAccountId" :value="item.shopAccountId"></el-option>
              </el-select>
            </el-form-item>
         <!--    <el-form-item label="站点" prop="countryNo" v-if="FBAflag==false && addwarehouse.whRefId == '04'"  :rules="{required: true, message: '请选择站点！', trigger: 'blur'}">
               <el-select  v-model="addwarehouse.countryNo" class="input-Maginbottom">
                 <el-option v-for="item in countryNoOptions" :label="item.countryName" :key="item.countryNo" :value="item.countryNo"></el-option>
               </el-select>
             </el-form-item>-->
          <!--  <el-form-item label="国家" prop="countryNo" v-if="FBAflag==false && addwarehouse.whRefId == '04'"  :rules="{required: true, message: '请选择国家！', trigger: 'blur'}">
              <CountryList :selectValue="addwarehouse.countryNo" @child-change-val="addchangeCountry" selectType="FBA" ></CountryList>

            &lt;!&ndash;  <el-select  v-model="addwarehouse.countryNo" class="input-Maginbottom">
                <el-option v-for="item in countryNoOptions" :label="item.countryName" :key="item.countryNo" :value="item.countryNo"></el-option>
              </el-select>&ndash;&gt;
            </el-form-item>-->
            <el-form-item label="授权用户" prop="" required   v-if="FBAflag==false || addwarehouse.whRefId!='04'">
              <el-row :span='24' style="height: 200px;overflow-y: auto;border: 1px solid #ccc;">
                <el-checkbox-group v-model="UsercheckList"  @change="handleCheckedUserChange">
                  <el-checkbox  :label="item.userId" v-for="item in listUserAll" :key="item.userId" >{{item.userName + '('+item.userNo+')'}}</el-checkbox>
                </el-checkbox-group>
              </el-row>
            </el-form-item>
            <el-form-item label="仓库信息" v-if="addwarehouse.whRefId == '01' || addwarehouse.whRefId == '02' ">
              <el-row :span="10" style="border:1px solid #ccc;padding: 5px;text-align: left" class="form-bottom marginLabel" >
                <el-form-item  prop="" :label="addwarehouse.whRefId == '02' ? 'Area' : '所在地区'" style="margin-bottom: 10px" >
                  <v-distpicker :province="addwarehouse.province" v-if="addwarehouse.whRefId == '01'"  @selected="addSelected"  :city="addwarehouse.city" :area="addwarehouse.district"></v-distpicker>
                  <el-row  v-if="addwarehouse.whRefId == '02'">
                    <el-col :span="5">
                      <el-input type="text" v-model="addwarehouse.province"></el-input>
                    </el-col>
                    <el-col :span="3" style="padding-left: 5px">
                      {{'province'}}
                    </el-col>
                    <el-col :span="5" >
                      <el-input type="text" v-model="addwarehouse.city"></el-input>
                    </el-col>
                    <el-col :span="2" style="padding-left: 5px">
                      {{ 'city'}}
                    </el-col>
                    <el-col :span="5">
                      <el-input type="text" v-model="addwarehouse.district"></el-input>
                    </el-col>
                    <el-col :span="3" style="padding-left: 5px">
                      {{'district'}}
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item :label="addwarehouse.whRefId == '02' ? 'Adress' : '详细地址'" prop="address" >
                  <el-input type="text" v-model="addwarehouse.address"></el-input>
                </el-form-item>
                <el-form-item :label="addwarehouse.whRefId == '02' ? 'Full Name' : '联系人'" prop="contactUser"  >
                  <el-input v-model="addwarehouse.contactUser"></el-input>
                </el-form-item>
                <el-form-item :label="addwarehouse.whRefId == '02' ? 'Phone No.' : '联系电话'" prop="contactPhone" >
                  <el-input  v-model.number="addwarehouse.contactPhone" ></el-input>
                </el-form-item>
              </el-row>
            </el-form-item>
        </el-form>
        </el-col>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.buildHouse=false">取消</el-button>
          <el-button type="primary" @click="subMitNewhouse();" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import CountryList from '../../components/listData/getCountryList.vue'
  import VDistpicker from 'v-distpicker'
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  export default {
    components: {
      ElForm,
      ElButton,
      ElFormItem,
      VDistpicker,
      CountryList
    },
    data() {
      const phoneType = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入手机号'));
        } else if(!/1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/.test(value)){
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      };
      return {
        FBAflag:false,
        countryNoOptions:[],
        Amazonoptions:[],
        countryName:'',
        options:[
          {
          	label:'出口易澳洲仓',
            value:'出口易澳洲仓'
          },{
            label:'通途德国仓',
            value:'通途德国仓'
          }
        ],
        rules: {
        /*  contactPhone:[
            {validator: phoneType, trigger: 'blur'}
          ]*/
        },
        FBAData:[],
        listUserAll:[],
      	addwarehouse:{
          whRefId:'01',
          whName:'',
          countryNo:'',
          isUse:true,
          province:'',
          city:'',
          district:'',
          address:'',
          contactUser:'',
          contactPhone:'',
          userIds:'',
          shopAccountId:''
        },

        UsercheckList:[],
        batchList:[],
        country:'',
        Warehouseedit:true,
        overseasedit:true,
        LogisticsMode:{},
        houseName:'',
        whId:'',
        LogisticsMethod:[],
        LogisticsMethodAll:[],
        LogisticscheckList:[],
        listUser:[],
        formLabelWidth:'170px',
      	HouseMsg:{
          whId:'',
          whName:'',
          countryNo:'',
          isUse:'',
          province:'',
          city:'',
          district:'',
          address:'',
          contactUser:'',
          contactPhone:'',
          contactEmail:'',
          postCode:''

        },
        isUseCount:'',
        whCount:'',
        defaultExpandedKey:[],//树形默认选中
        LocationData:[],
        whRefId:'01',
        whList: [],
        defaultProps:{
          children: 'sysDeptDataList',
          label: 'whName'
        },
        logisticsedit:false,
        buildHouse:false,
        ThirdWarehouse: false,
        Warehouse:false,
        FBAhouse:false,
        FBAlist:false,
        WarehouseMsg:true,
        OverseasWarehouse:false,
        houseVisible:false,
        LocationVisible:false,
        logisticsVisible:false,
        citys:[],
        regions:[],
        checked:true,
        vendorInfoModel: {             // 城市区三级联动
          vendorName: '',
          companyNature:'',
          telNo: '',
          additionData:'',
          websiteUrl:'',
          province:'',
          city:'',
          street:'',
          region:''
        },
        house:true,
        msg: '',
        //select选择器默认当前项
        activeNames: '1',//默认展开
        activeName:'',//新建FBA tab选项
        num1: 1,
        num2: 1,
        //筛选
        screenData:[
          {
            label:'666'
          }
        ],
        //查看+编辑弹窗
        dialogFlag:{
          logisticsedit:false,
          logisticsisOpen:false,
          buildHouse:false,
          houseisopen:false,
          LocationisOpen:false,
          infoDetail:false,
          screenDetail:false,
          dialogTitle:"",
          isOpenMsg:'',
          inputDisabled:false,   //区分编辑他查看
        },
        //弹窗数据源
        form: [{
          img: '../../assets/email.png',
          number: '编号',
          Name: '名称',
          Result: '质检结果',
          Storage: '已入库',
          Location: '货位',
          quality : '质检',
          Defective: '故障品'
        }],
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted: function(){
      this.getauthorityList();
    	this.getwhList('0');

    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      addAmazon(){this.$message('暂未开发！')},
      handleClick(){
      	if(this.addwarehouse.whRefId=='04'){
          this.activeName='1';
        }else{
          this.activeName='';
        }
      },
      getAmazonoptions(){
      	this.httpGet('accountManage/amazonList?whId='+'').then(res=>{
      		if(res.data!=[]){
            this.Amazonoptions=res.data;
            this.countryNoOptions=res.data;
            this.FBAflag=false;
          }else{
            this.FBAflag=true;
          }
        })
      },
      resetForm(formName) {
        this.UsercheckList=[];this.addwarehouse.province='';this.addwarehouse.city='';this.addwarehouse.district='';this.addwarehouse.countryNo='';this.addwarehouse.shopAccountId='';
        this.$refs[formName].resetFields();
      },
      addchangeCountry(val){
      	val.type=='海外仓'?this.addwarehouse.countryNo=val.value:val.type=='FBA'?'':'';
      	//this.addwarehouse.countryNo=val.value;

      },
      subMitNewhouse(){
      	var obj={},vm=this;
        obj=JSON.parse(JSON.stringify(vm.addwarehouse));
        obj.userIds = vm.UsercheckList;
        this.$refs['addwarehouse'].validate((valid) => {
          if (valid) {
          	  if(this.UsercheckList.length <=0 ){
          	  	this.$message('请选择授权用户！')
              }
              else{
                this.httpPost('warehouseSetting/addWh',obj).then(res=>{
                  if(res.data.result==true){
                    this.$message(res.data.message);
                    this.dialogFlag.buildHouse=false;
                    this.getwhList('1');
                  }else{
                    this.$message(res.data.message)
                  }
                })

              }
          }})
      },
      addHouseList(){
        //this.whId='';
        this.getUserList('2');
      },
      subMitlogistics(){
      	var obj={};
          obj.whId=this.whId;
          obj.methodIds=this.LogisticscheckList;
       	  this.httpPost('warehouseSetting/editWhLogisticsMethod',obj).then(res=>{
          this.$message(res.data.message);
       		if(res.data.result == true){
            this.dialogFlag.logisticsedit = false;
            this.getwhList('1');
          }
        })
      },
      handleCheckedCitiesChange(val){
      	this.LogisticscheckList = val ;
      },
      handleCheckedUserChange(val){
      	this.UsercheckList = val;
      },
      addSelected(data){
        this.addwarehouse.province=data.province.value;
        this.addwarehouse.city=data.city.value;
        this.addwarehouse.district=data.area.value;
      },
      editLogisticsMethod(){
      	var vm=this;
        this.httpPost('warehouseSetting/queryAllLogisticsMethod').then(res=>{
          vm.LogisticsMethodAll = res.data;
          console.log('vm.LogisticsMethodAll % 0===',vm.LogisticsMethodAll)
        });
      	this.httpPost('warehouseSetting/checkedLogisticsMethod?whId='+this.whId).then(res=>{
          this.LogisticscheckList = res.data;
        });
      },
      batchChange(val){
      	var vm=this;
      	var a=[];
        val.forEach(function(i,index){
          a.push(i.locationNo)
        })
        vm.batchList=a;
        console.log(vm.batchList)

      },
      deleteLocation(){
      	var vm=this;
        var obj={};
        obj.locationNos=vm.batchList;
        obj.whId=vm.whId;
        obj.locationNos.length < 1 ? vm.tips() : vm.doItem('确定删除选中的库位号吗？','warehouseSetting/deleteStorageLocation',obj,vm.deleteLocationData);
        // this.deleteLocationData();
      },
      deleteLocationData(){
      	var vm=this;
      	var allarr=vm.LocationData.map(item=>item.locationNo);
      	for(var i=0;i<vm.LocationData.length;i++){
           if(vm.batchList.indexOf(allarr[i])>-1){
             console.log('allarr % 0===',vm.LocationData[i])
             vm.LocationData.splice(i,1);
           }
        }
      },
      deleteNone(){
      	if(this.LocationData.length<=0){
      		this.$message('无空库位号！')
        }else{
          this.httpPost('warehouseSetting/deleteEmptyStorageLocation?whId='+this.whId).then(res=>{
            this.$message(res.data.message);
          })
        }
      },
      ChangeonSelected(data){
       // alert(data.province.value + ' | ' + data.city.value+ ' | ' + data.area.value)
      	this.HouseMsg.province=data.province.value;
        this.HouseMsg.city=data.city.value;
        this.HouseMsg.district=data.area.value;
      },
      changeCountry(val){
      	this.country=val.value;
        this.countryName=val.cnname;
      },
      edithouseName(val){
          var obj={};
          obj.whId=this.whId;
          obj.whName=this.houseName;
      	if(val == '1' || val == '2' ){
          if(this.houseName == ''){
            this.$message('仓库名字不能为空！')
          }if(val == '2'&& this.country == ''){
              this.$message('所属国家不能为空！')
          }else{
            val ==='2' ? obj.countryNo = this.country : '';
            this.httpPost('warehouseSetting/editWh',obj).then(res=>{
              if(res.data.result == true){
                val === '2' ? this.overseasedit = true: val === '1' ? this.Warehouseedit = true:'';
                this.$message(res.data.message);
                this.getwhList('1');
                this.defaultExpandedKey=this.whId;
              }else{
                this.$message(res.data.message);
              }
            })
          }
        }else if(val === '3'){
      		var obj={};
          console.log('this.HouseMsg % 0==',this.HouseMsg)
      		obj.province=this.HouseMsg.province;
          obj.district=this.HouseMsg.district;
          obj.address=this.HouseMsg.address;
          obj.whName=this.HouseMsg.whName;
          obj.whId=this.whId;
          obj.city=this.HouseMsg.city;
          obj.contactUser=this.HouseMsg.contactUser;
          obj.contactPhone=this.HouseMsg.contactPhone;
          obj.contactEmail=this.HouseMsg.contactEmail;
          obj.postCode=this.HouseMsg.postCode;
          console.log('this.HouseMsg % 0==',this.HouseMsg)
          this.httpPost('warehouseSetting/editWh',obj).then(res=>{
            this.$message(res.data.message);
            if(res.data.result == true){
              //this.getwhList();
            }
          })
        }
      },
    	getLogisticsMode(val){
      	var url='';
      	url=this.
    		this.methodId = val.methodId;
    		this.httpPost('warehouseSetting/queryOneLogisticsMode?methodId='+this.methodId).then(res=>{
            this.LogisticsMode = res.data;
        })
      },

      getHouseData(val,node,data){
      	this.whId=val.whId;
        this.getHouseMsg(val.whId,'2');
        this.getUserList('1');
        this.getLogisticsMethod();
        console.log('obj ^6% 0',node)
        console.log('obj ^6% 0',data)

      },
      getwhList(val){
            this.httpPost('warehouseSetting/loadWh?whRefId='+this.whRefId).then(res=>{
            	if(res.data.whs !=[] && res.data.whs.length>0){
                this.whList = res.data.whs;
                if(val=='0'){
                  this.whId =res.data.whs[0].whId;
                  this.defaultExpandedKey=res.data.whs[0].whId;
                }
                this.getUserList('1');
                this.getLogisticsMethod();
                this.getHouseMsg(this.whId,val);
              }else{
                this.whList=[];
                this.houseName='';
                this.listUser=[];
              }
              this.isUseCount =res.data.isUseCount;
              this.whCount=res.data.whCount;
              //this.houseName =res.data.whs[0].whName;
              var arr=document.getElementsByClassName('el-tree-node');
              console.log('arr % 0===',arr)
              console.log('888 % 0==',this.whId)

            })
      },
      getHouseMsg(id,val){
        this.httpPost('warehouseSetting/list?whId='+id).then(res=>{
        	if(res.data !='' && res.data !=null){
        		if(val=='0' || val=='2'){
              this.houseName = res.data.whName;
              this.country=res.data.countryNo;
              this.countryName=res.data.countryName;
            }else{

            }
            this.HouseMsg = res.data;


          }
        })
      },
      getUserList(val){
      	//val === '2' ? this.whId = '' : '';
      	var aa='';
      	aa = val === '1' ? this.whId :'';
      	this.httpPost('warehouseSetting/listUser?whId='+aa).then(res=>{
      		if(res.data!=[] && res.data.length>0){
            if(val === '1'){this.listUser = res.data;}else{this.listUserAll=res.data};
          }else{
            this.listUser=[];
            this.listUserAll=[];
          }

        })
      },
      getLogisticsMethod(){
      	var url='';
        url=this.FBAlist==false?'warehouseSetting/queryWhLogisticsMethod':'accountManage/amazonList';
      	this.httpGet(url+'?whId='+this.whId).then(res=>{
      		if(res.data!=[] && res.data.length>0){
            if(this.FBAlist==false){
              this.LogisticsMethod = res.data;
            }else{
            	this.FBAData=res.data;
            }

          }else{
            if(this.FBAlist==false){
              this.LogisticsMethod = [];
            }else{
              this.FBAData=[];
            }
          }
        })
      },
      renderContent(createElement, {node, data, store}){
      	console.log('55555 % 0==',createElement)
        console.log('66666% 0====',{node, data, store})
        var vm = this;
        var icon = document.getElementsByName(data.whId);
        //if(vm.ButtonInfo['编辑']!='0'){}
        if(vm.ButtonInfo['查看']!='0'){

        }
        if(vm.ButtonInfo['停用']!='0' || vm.ButtonInfo['启用']!='0'){

        }
        setTimeout(function(){
          if(data.whId == icon[1].id && (vm.ButtonInfo['停用']!='0' || vm.ButtonInfo['启用']!='0')){
            icon[1].className = data.isUse == true ? 'iconfontyyy icon-tingyongg' : 'iconfontyyy icon-qiyongg';
          }
          if(data.whId == icon[0].id && vm.ButtonInfo['查看']!='0' ){
          	if(vm.whRefId!='04'){
              icon[0].className = 'iconfontyyy icon-chakan';
            }
          }
        },10);
        var toggleStatus = function(){
          vm.dept_id = data.whId;
          var msg = data.isUse == false ? '您确定启用此仓库？' : '您确定停用此仓库？';
          vm.HouseMsg.whId = data.whId;
          vm.HouseMsg.isUse = !data.isUse;
          vm.HouseMsg.whName=data.whName;
          vm.doItem(msg,'warehouseSetting/editWh',vm.HouseMsg,vm.getwhList);
          //vm.defaultExpandedKey = vm.defaultKeys;
        }
        return createElement('span',
          [
          createElement('span',{attrs:{style:"padding-right: 82px;"}}, node.label),
          createElement('span', {attrs: {style: "position:absolute;right:0;margin-right: 12px", class: 'btnGroup'}},
           [
            createElement('el-tooltip', {
              attrs: {
                style:"padding-right: 18px;",
                class: "item", effect: "dark", content: "查看", placement: "top-start"
              }
            }, [
              createElement('i', {
                attrs: {
                  id:data.whId,name:data.whId,class: "",
                }, on: {
                  click: function () {
                    vm.dialogFlag.LocationisOpen = true;
                    vm.dept_id = data.whId;
                    vm.httpGet('warehouseSetting/queryStorageLocation?whId='+data.whId).then(res =>{
                        vm.LocationData = res.data;
                    });
                  }
                }
              }, '')]),
            createElement('el-tooltip', {
              attrs: {

                class: "item", effect: "dark",content: data.isUse == false ? '启用仓库' : '停用仓库', placement: "top-start"
              }
            }, [
              createElement('i', {
                attrs: {
                  id:data.whId,name:data.whId, class: "",
                }, on: {
                  click: function () {
                    toggleStatus();
                  }
                }
              },)]),
            /*createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark", content: "添加", placement: "top-start"
              }
            }, [
              createElement('el-button', {
                attrs: {
                  size: "mini", icon: "plus",
                }, on: {
                  click: function () {
                    vm.dept_id = data.whId;
                    vm.dialogFlag.dialogTitle = '添加子级部门';
                    vm.dialogFlag.isOpen = true;
                  }
                }
              }, '')])*/
          ]),
        ])
      },
      //状态切换
      requestemStart(value){
        if(value == '01'){
          this.Warehouse = false;
          this.FBAlist = false;
        }
        if(value == '02'){
          this.Warehouse = true;
          this.FBAlist = false;
        }
        if(value == '03'){
            this.ThirdWarehouse = true;
            this.WarehouseMsg = false;
        }else{
          this.ThirdWarehouse = false;
          this.WarehouseMsg = true;
        }
        if(value == '04'){
        	  this.Warehouse = false;
            this.FBAhouse = true;
            this.WarehouseMsg = false;
            this.FBAlist = true;
        }else{
             this.FBAhouse = false;
             this.FBAlist = false;
        }
        this.getwhList('0');
      },
      changeValue(val){
      },

    }
  }

</script>

<style scoped>
  .tableBorder .el-table{
       border:none!important;
  }
  .tableBorder .el-table table{
    border: 1px solid #eef1f6!important;
  }
  .el-form-item.input-Maginbottom,.el-select.input-Maginbottom{
    margin-bottom:10px;
  }
  .FbaTabs .el-tabs__header{
    border: none;
  }
  .form-bottom .el-form-item{
    margin-bottom: 20px;
  }

  .borderForm input{
    border:1px solid #bfcbd9!important;
  }
  em {font-style: normal;}
  .el-select{
   width:100%;
  }
  #item_list{
    display: flex;
  }
  .listLeft{
    flex:0 0 240px;
    //min-width:240px;
    border-right:1px solid #eef1f6;
  }
  .listLeft .tree-data{
    position: relative;

  }
  .listLeft .tree-data .el-tree-node{
    border-bottom: 1px solid #eef1f6;
  }
  .listLeft .tree-data.el-tree{
    border:none;
  }
  .listRight{
    margin-left:10px;
    flex:1;
    display: flex;
    flex-direction:column;
    overflow: auto;
    box-sizing: border-box;
  }
  .el-collapse-item__header{
    padding-left: 5px;
    height:30px;
    line-height: 30px;
    background: rgb(129, 201, 249);
  }
  .logistics.el-collapse-item__header:before{
    content:'物流方式';
    color:#fff;
  }
  .Amazon.el-collapse-item__header:before{
    content:'Amazon账号';
    color:#fff;
  }
  .Authorized.el-collapse-item__header:before{
    content:'授权用户';
    color:#fff;
  }
  .house.el-collapse-item__header:before{
    content:'仓库信息';
    color:#fff;
  }
  .ThirdWarehouse.el-collapse-item__header:before{
    content:'对接方式API';
    color:#fff;
  }
  i.iconfontyyy.small{
    font-size:18px;
  }
  .tree_data .tree_title{
    border-bottom:1px solid #d1dbe5;
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;
  }
  .el-checkbox-group label{
    padding:10px 20px!important;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
</style>
