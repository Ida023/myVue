<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      当前位置：<span>仓库管理</span> > <span>入库处理</span> > <span>其他入库</span>
    </div>
    <div id="content_wrap">
      <el-row class="select marginBottom">
        <span>请选择仓库</span>
        <el-select v-model="value8" filterable placeholder="请选择" @change="changeHouse">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-collapse  class=" marginBottom" v-model="activeNames"  accordion>
        <el-collapse-item title="" name="1" >
          <el-row class="marginBottom">
            <el-col :span="24">
              <span style="display:inline-block; width:55px; text-align:right">出库状态</span>
              <el-button size="small" @click="requestemStart('')" :class="{active:aIsActive} ">全部 </el-button>
              <el-button size="small" @click="requestemStart('1')" :class="{active:oIsActive} ">未确认</el-button>
              <el-button size="small" @click="requestemStart('0')" :class="{active:cIsActive} ">已确认</el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-col class="operation marginBottom">
        <el-button size="small"  type="primary" @click="screenChange()" ><i class="el-icon-plus"></i>&nbsp;新建其他入库</el-button>
      </el-col>
      <el-table  id="item_list"  border  tooltip-effect="dark" :data="options" @selection-change="selsChange">
        <el-table-column type="selection" width="55" align="center" :disabled= true  ></el-table-column>
        <el-table-column prop="label" width="120" label="操作" show-overflow-tooltip align="center" >
          <template scope="scope" >
            <el-tooltip content="查看"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" @click="showhouseData(dialogFlag.inputDisabled=true);dialogFlag.isOpen=true" content="Bottom center">&#xe600;</i>
            </el-tooltip>
            <el-tooltip content="编辑"  effect="dark" placement="bottom" >
              <i  class="iconfontyyy"  @click="showhouseData(dialogFlag.inputDisabled=false);dialogFlag.isOpen=true ">&#xe6e5;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="售后单编号"   prop="label" align="center" ></el-table-column>
        <el-table-column label="相关订单"  prop="label" align="left" ></el-table-column>
        <el-table-column label="买家ID"  header-align="center"  prop="label" align="center"></el-table-column>
        <el-table-column label="收货仓库"  prop="label" width="80" align="center" ></el-table-column>
        <el-table-column label="跟踪单号"  prop="label" align="center" ></el-table-column>
        <el-table-column label="商品"  prop="label" width="80" align="center" ></el-table-column>
        <el-table-column label="完成日期"  prop="label"  width="100" align="center" ></el-table-column>
        <el-table-column label="操作人员"  prop="label" width="110" align="center" ></el-table-column>
      </el-table>
      <!--查看+编辑弹窗-->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen"  size="small">
        <el-table border :data="form" >
          <el-table-column  label="采购单编号" align="center" >
            <template scope="scope">
              <div class=""  style="width: 70px;height: 70px;margin: 0 auto;padding: 5px 0;">
                <img src="../../assets/email.png" alt="商品图" width="100%" height="100%" style="vertical-align: middle;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="Name" label="SKU/商品名称"  align="center"></el-table-column>
          <el-table-column property="Result" label="质检结果(良品/次品)" align="center" ></el-table-column>
          <el-table-column property="Storage" label="已入库(良品/次品)" align="center" ></el-table-column>
          <el-table-column property="Location" label="货位" align="center" >
            <template scope="scope" >
              <el-select v-model="value7" :disabled="dialogFlag.inputDisabled"  filterable placeholder="请选择" align="center">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  label="入库(按质检结果入库)" align="center">
            <template scope="scope" >
              <el-input-number :disabled="dialogFlag.inputDisabled" class="number-size" size="small" v-model="num1" :min="1" :max="10"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column  label="入库(故障品不入库)" align="center"  >
            <template scope="scope" class="number-size">
              <el-input-number size="small" class="number-size" :disabled="dialogFlag.inputDisabled" v-model="num2" :min="1" :max="10"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpen= false">取 消</el-button>
          <el-button type="primary" @click="dialogFlag.isOpen = false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--批量入库-->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail"  size="small">
        <el-table border :data="sels" >
          <el-table-column  label="采购单编号" align="center" >
            <template scope="scope">
              <div class=""  style="width: 70px;height: 70px;margin: 0 auto;padding: 5px 0;">
                <img src="../../assets/email.png" alt="商品图" width="100%" height="100%" style="vertical-align: middle;"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="label" label="SKU/商品名称"  align="center"></el-table-column>
          <el-table-column property="label" label="质检结果(良品/次品)" align="center" ></el-table-column>
          <el-table-column property="label" label="已入库(良品/次品)" align="center" ></el-table-column>
          <el-table-column property="label" label="货位" align="center" >
            <template scope="scope" >
              <el-select v-model="value7" :disabled="dialogFlag.inputDisabled"  filterable placeholder="请选择" align="center">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  label="入库(按质检结果入库)" align="center">
            <template scope="scope" >
              <el-input-number :disabled="dialogFlag.inputDisabled" class="number-size" size="small" v-model="num1" :min="1" :max="10"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column  label="入库(故障品不入库)" align="center"  >
            <template scope="scope" class="number-size">
              <el-input-number size="small" class="number-size" :disabled="dialogFlag.inputDisabled" v-model="num2" :min="1" :max="10"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.infoDetail= false">取 消</el-button>
          <el-button type="primary" @click="dialogFlag.infoDetail = false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--筛选-->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.screenDetail" size="small">
        <el-table :data="screenData">
          <el-table-column  label="条件" width="150">
             <td></td>
          </el-table-column>
          <el-table-column property="label" label="比较方式" width="200"></el-table-column>
          <el-table-column property="label" label="输入">
            <template scope="scope" >

            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.screenDetail= false">取 消</el-button>
          <el-button type="primary" @click="dialogFlag.screenDetail = false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="page" class="block page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50,100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '美国仓'
        }, {
          value: '选项2',
          label: '德国仓'
        }, {
          value: '选项3',
          label: '英国仓'
        }, {
          value: '选项4',
          label: '中国仓中国仓'
        }, {
          value: '选项5',
          label: '泰国仓'
        }],
        //批量入库
        sels:[],
        //状态样式
        aIsActive: true,
        oIsActive: false,
        cIsActive: false,
        //select选择器默认当前项
        value7: '泰国仓',
        value8: '',
        activeNames: '1',//默认展开
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
          isOpen:false,
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
        //分页得到的数据集合
        page:{
          currentPage:1, //当前页数
          pageSize:10, //每页条数
          totalCount:0, //总共条数
          totalPage:0, //总共页数
          listData:[]
        },
        //分页过滤
        pagefilters:{
          currentPage:'1',
          pageSize:'10',
          isUse:''
        },
      }
    },
    methods: {
      //列表渲染
      requestem(){

      },
      //仓库选择
      changeHouse(val){
         alert(val)
      },
      //状态切换
      requestemStart(value){
        this.showTypeItem(value);
        this.pagefilters.currentPage=1;
        this.pagefilters.isUse=value;
        this.requestem();

      },
      //状态按钮样式切换
      showTypeItem: function (value) {
        var _this = this;
        switch (value) {
          case '':
            _this.aIsActive = true;
            _this.oIsActive = _this.cIsActive = !_this.aIsActive;
            break;
          case '1':
            _this.oIsActive = true;
            _this.aIsActive = _this.cIsActive = !_this.oIsActive;
            break;
          case '0':
            _this.cIsActive = true;
            _this.aIsActive = _this.oIsActive = !_this.cIsActive;
            break;
        }
      },
      //查看+编辑
      showhouseData: function(val) {
        var _this=this;
        _this.dialogFlag.dialogTitle = val ? '查看' : '编辑';

      },
      //多选
      selsChange(value){
        this.sels=value;
        console.log(this.sels)
      },
      batchEnter(){
            this.dialogFlag.infoDetail = true
            this.dialogFlag.dialogTitle='批量入库';

      },
      //删选
      screenChange(){
       this.dialogFlag.screenDetail=true;
        this.dialogFlag.dialogTitle='筛选';
      },
      //分页
      handleSizeChange(val) {
        this.pagefilters.pageSize=val;
        this.requestem();
      },
      handleCurrentChange(val) {
        this.pagefilters.currentPage=val;
        this.requestem();
      },
    }
  }

</script>

<style scoped>
  .select input.el-input__inner{
    height:28px!important;
  }
  .operation i{
    font-size: 16px;
  }
   .el-input-number--small{
  width:100px!important;
  }
</style>
