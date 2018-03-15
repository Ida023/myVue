<template>
  <div id="">
    <el-row class="supplier_btn" style="margin: 10px 0 10px 0">
      <el-button type="primary" size="small" @click="BatchOperation('草稿','0')" v-if="SonScreenData.stateName==='草稿'">批量提交</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('草稿','1')" v-if="SonScreenData.stateName==='草稿'">批量删除</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('待主管审核','0')" v-if="SonScreenData.stateName==='待主管审核'">批量同意</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('待主管审核','1')" v-if="SonScreenData.stateName==='待主管审核'">批量不同意</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('待提交采购')" v-if="SonScreenData.stateName==='待提交采购'">提交采购</el-button>
      <span v-if="SonScreenData.stateName==='待提交采购'"><span>装箱共计:<span style="color: red">25.1234</span>m</span></span>
      <span style="margin-left: 20px" v-if="SonScreenData.stateName==='待提交采购'"><span>重量共计:<span style="color: red">25.1234</span>KG</span></span>
    </el-row>
    <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column width="150" id="space" label="操作" align="center" >
        <template scope="scope">
          <el-tooltip content="查看"  effect="dark" placement="bottom" >
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '查看')">&#xe600;</i>
          </el-tooltip>
          <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='草稿'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '编辑')">&#xe6e5;</i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" v-if="ScreenData.stateName==='草稿'">
            <i class="iconfontyyy" @click="RowData(scope.row, '删除')">&#xe6f7;</i>
          </el-tooltip>
          <el-tooltip content="提交"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='草稿'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '提交')">&#xe63e;</i>
          </el-tooltip>
          <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待主管审核'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '同意')">&#xe67e;</i>
          </el-tooltip>
          <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待主管审核'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '不同意')">&#xe665;</i>
          </el-tooltip>
          <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '同意2')">&#xe67e;</i>
          </el-tooltip>
          <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '不同意2')">&#xe665;</i>
          </el-tooltip>
          <el-tooltip content="回退"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='第三方审核不通过'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '回退')">&#xe666;</i>
          </el-tooltip>
          <el-tooltip content="提交"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待提交采购'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '提交2')">&#xe63e;</i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column sortable label="备货单编号" align="center" prop="stockNo"></el-table-column>
      <el-table-column sortable label="SKU个数" align="center" prop="skuCount"></el-table-column>
      <el-table-column sortable label="备货目的" align="center" prop="stockType"></el-table-column>
      <el-table-column sortable label="备货部门" align="center" prop="stockDepart"></el-table-column>
      <el-table-column sortable label="备货人" align="center" prop="stockUser"></el-table-column>
      <el-table-column sortable label="状态" align="center" prop="state"></el-table-column>
      <el-table-column sortable label="创建时间" align="center" prop="addTime"></el-table-column>
    </el-table>

    <!--备注弹窗-->
    <el-dialog title="添加备注" :visible.sync="RemarksDialog" size="tiny" :close-on-click-modal="false" @open="dilRemarks" >
      <el-input type="textarea" v-model="RemarksData.val"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addRemarks(RemarksState);" :loading="$store.state.loading">保 存</el-button>
          <el-button @click="RemarksDialog = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import ObjectiveWarehouse from '../BasicsModula/ObjectiveWarehouse';
  import transportType from '../BasicsModula/transportType';
  export default{
    components:{
      ObjectiveWarehouse,
      transportType
    },
    /*
     ScreenData:父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     TableListData：父组件 条件过滤后拿到的 list，用于table；
     */
    props:['ScreenData','TableListData'],
    data() {
      return {
        ButtonInfo:{},//按钮权限列表20171227
        TableData:[],
        sels:[],    //批量删除已选的条目数
        GrandsonID:'',//给孙子的 ID，根据具体要什么ID是什么ID，进行填值
        SonScreenData:this.ScreenData, //watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        SonTableListData:this.TableListData,//watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        ButtonState:true,
        transport:[
          {label:'空运',value:'01'},
          {label:'海运',value:'02'}
        ],
        WarehouseList:[],
        RemarksDialog:false,
        SeeDialog:{
          dis:false,
          SeeDialogTitle:'',
          SeeDialogSize:'small'
        },
        editDialog:{
          dis:false,
          editDialogTitle:''
        },
        RemarksState:'',
        RemarksData:{
          val:'',
          stockId:[],
        }
      }
    },
    mounted(){
      //      this.HandleData();
      this.getauthorityList();
      this.getListData();
      this.ObjectiveWarehouseData();
    },

    methods:{
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getListData:function () {
        this.$http.get('static/Table2.json').then(res=>{
          this.TableData=res.data.table;
        })
      },
      selsChange: function (sels) {//批量操作获取SKU
        this.sels = [];
        for(let i=0; i<sels.length;i++){
          this.sels.push(sels[i].stockId)
        }
        console.log(this.sels)
      },
      RowData:function (row, state) {
        let _this=this;
        if(state==='查看'){
          alert('查看')
        }else if(state==='编辑'){
          alert('编辑')
        }else if(state==='删除'){
          _this.doItem('您确定删除此备货计划？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
        }else if(state==='提交'){
          _this.doItem('您确定提交此备货计划给主管审核？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
        }else if(state==='同意'){
          _this.doItem('您确定同意此备货计划？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
        }else if(state==='不同意'){
          _this.doItem('您确定不同意此备货计划？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
        }else if(state==='同意2'){
          this.RemarksState='同意';
          this.RemarksDialog=true;
        }else if(state==='不同意2'){
          this.RemarksState='不同意';
          this.RemarksDialog=true;
        }else if(state==='回退'){
          _this.doItem('您确定回退此备货计划？（备货计划将重新提交第三方审核）','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
        }else if(state==='提交2'){
          _this.doItem('您确定提交此备货计划给采购？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
        }
      },
      BatchOperation:function (val,state) {//批量操作，状态区分做操作。
        let _this=this;
        if(_this.sels.length<1){
          _this.tips();
        }else{
          let msg,isPirates;
          console.log('批量提交的Sku长度',_this.sels.length);
          if(val==='草稿'){
            if(state==='0'){
              _this.doItem('您确定提交此备货计划给主管审核？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
            }else if (state==='1'){
              _this.doItem('您确定删除此备货计划？','stockProductPlan/getInfoByItem',_this.RemarksData.stockId,_this.$emit('GetListObj'));
            }
          }else if(val==='待主管审核'){
            if(state==='0'){
              _this.doItem('您确定同意此备货计划？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
            }else if (state==='1'){
              _this.doItem('您确定不同意此备货计划？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
            }
          }else if(val==='待提交采购'){
            _this.doItem('您确定提交此备货计划给采购？','productDevInfo/auditCaogao',_this.RemarksData.stockId,_this.$emit('GetListObj'));
          }
        }
      },
      addRemarks:function (state) {//添加备注保存
        console.log(this.RemarksData);
        if(this.RemarksState==='同意'){
          alert('同意提交')
          this.RemarksDialog=false;
        }else if(this.RemarksState==='不同意'){
          alert('不同意提交')
          this.RemarksDialog=false;
        }
      },
      dilRemarks:function () {//添加备注清空
        setTimeout(()=>{//神经病 和保存事件走的异步，先后混乱；
          this.RemarksData.val='';
        },10)
      },
      combination:function (val) {//符合第一阶段返回true
        let stateName=val.stateName;
        if(stateName==='草稿' || stateName==='待主管审核'|| stateName==='主管审核不通过'|| stateName==='待供应链处理'|| stateName==='待第三方审核'||
          stateName==='第三方审核不通过'|| stateName==='待提交采购'){
          this.ButtonState=true;
        }else {
          this.ButtonState=false;
        }
      },
      SonData:function (val) {
        let SonData=val.value;
        let SonSign=val.sign;
        if(SonSign==='transportType'){
          console.log(SonData)
        }else if(SonSign==='ObjectiveWarehouse'){
          console.log(SonData)
        }else if(SonSign==='StockingType'){
          this.defaultData.stockTransportType=SonData;
        }else if(SonSign==='user'){
          this.defaultData.stockProductUser=SonData;
        }
      },
      ObjectiveWarehouseData(){
//        this.httpGet('stockProductPlan/getStockType','','Scm').then(res => {
        this.$http.get('static/select.json').then(res => {
//          console.log(res)
          let GetDataList = res.data.select;
          this.WarehouseList=this.tool.replaceObjKey(GetDataList,'shabiId','shabiName')
        })
      },
    },
    watch:{
      'ScreenData':{
        handler(val){
          this.SonScreenData=val;
          this.combination(val)
        },
        deep: true
      },
      'TableListData':{
        handler(val){
          this.SonTableListData=val;
        },
        deep: true
      },
    },

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
</style>
