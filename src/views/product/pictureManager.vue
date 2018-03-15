<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="2">
          <el-select v-model="selectParams.optionTitle" filterable  @change="selectParams.optionValue=''" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="" id="" size="small" @click="selectFilter">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.isPirates" @change="page.currentPage=1;getPictureList();" size="small">
              <el-radio-button  v-for="item in piratesOptions" :label="item.value"  v-if="ButtonInfo[item.label]!='0'" >{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button type="" size="small" class="el-icon-plus" @click="isShow = true;dialogFlag.infoDetail = true;dialogFlag.title='添加图片'">上传图片</el-button>
        <el-button type="" size="small" @click="pageFilter.isPirates = isPirates;dialogFlag.isOpen=true;">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.isPirates != ''">
        <el-button type="primary" size="small"  @click="batchInfoDialog('daotu')" v-if="pageFilter.isPirates != '1' && ButtonInfo['标记盗图']!='0'">标记盗图</el-button>
        <el-button type="primary" size="small" @click="batchInfoDialog('feidoatu')" v-show="pageFilter.isPirates != '0' && ButtonInfo['取消盗图']!='0'">取消盗图</el-button>
      </el-row>
      <div id="item_list" >
        <el-table :data="picListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作"  width="120px" align="center">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'" >
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,'chakan');dialogFlag.title='图片详情'" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="拷贝链接" placement="top-start"  v-if="ButtonInfo['拷贝链接']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,'kaobei')">&#xe607;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.isPirates == 1 ? '取消盗图' : '标记盗图' " placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,'')">&#xe614;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
          <el-table-column sortable prop="imageType" label="类型" align="center"></el-table-column>
          <el-table-column sortable  label="地址"  align="center">
            <template scope="scope">
              <input class="readonly" type="text" v-model="scope.row.imageUrl" :id="scope.row.imageUrl" readonly>
            </template>
          </el-table-column>
          <el-table-column sortable prop="imageSize" label="大小"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="上传时间" width="180px" :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="上传者" align="center"></el-table-column>
          <el-table-column sortable prop="isPirates" label="盗图"  :formatter="formatPirates" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="">
        <div class="data_body">
          <title-header></title-header>
          <el-row class="row">
            <el-col class="col" :span="4">SKU</el-col>
            <el-col class="col_input" :span="4">
              <selector-options :select-value="pageFilter.skuType"  :options-data="optionsData" select-type="skuType" @child-change-Val="childChangeVal"></selector-options>
            </el-col>
            <el-col class="col_input" :span="16">
              <el-input v-model="pageFilter.skuNo"></el-input>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">盗图</el-col>
            <el-col class="col_input" :span="4">
              <el-select v-model="val"><el-option label="等于" value="0"></el-option></el-select>
            </el-col>
            <el-col class="col_input" :span="16">
              <selector-options :select-value="isPirates"  :options-data="piratesOptions" select-type="isPirates" @child-change-Val="childChangeVal"></selector-options>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">上传者</el-col>
            <el-col class="col_input" :span="4">
              <selector-options :select-value="pageFilter.userType"  :options-data="optionsData" select-type="userType" @child-change-Val="childChangeVal"></selector-options>
            </el-col>
            <el-col class="col_input" :span="16">
              <selector-item :select-value="pageFilter.addUser" :option-data="userOptions" place-value="请选择" @on-child-change-Val="onChildChangeVal"></selector-item>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">上传日期</el-col>
            <el-col class="col_input" :span="4">
              <el-select v-model="val"><el-option label="等于" value="0"></el-option></el-select>
            </el-col>
            <el-col class="col_input" :span="16">
              <el-row class="block">
                <el-col :span="12">
                  <el-date-picker v-model="pageFilter.initialTime" size="small" format="yyyy-MM-dd" type="datetime" placeholder="选择开始时间"></el-date-picker>
                </el-col>
                <el-col :span="12">
                  <el-date-picker v-model="pageFilter.overTime" size="small" format="yyyy-MM-dd" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">清除条件</el-button>
          <el-button @click="filterData()">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.infoDetail" size="tiny" @close="picList=[]">
      <img :src="picSrc" class="picDetail"   v-show="isShow == false">
      <el-upload :http-request="uploadFilePic" :action="uploadPic" multiple list-type="picture-card" drag :file-list="picList" :on-remove="handleRemove" accept=".jpg,.jpeg,.png" v-if="isShow == true">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;" v-show="isShow == false">关 闭</el-button>
        <el-button @click="dialogFlag.infoDetail = false;" v-show="isShow == true">取 消</el-button>
        <el-button type="primary" @click="savePic();" v-show="isShow == true" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import selectorOptions from '../../components/selector_item_with_key.vue';
  import titleHeader from "../../components/ScreenModular/title.vue"
  export default{
    components: {selectorOptions,titleHeader},
    data(){
      return {
        isPirates:'',
        piratesOptions:[{value: '', label: '全部'},{value: '0', label: '非盗图'}, {value: '1', label: '盗图'}],
        userOptions:[],
        val:'等于',
        picList:[],     // 导入文件
        isShow:'',
        options: [{value: 0, label: 'SKU'}, {value: 1, label: '上传者'}],
        optionsData: [{value: '0', label: '等于'}, {value: '1', label: '包含'}],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          skuNo:'',
          skuType:'0',
          isPirates:'',
          overTime:'',
          initialTime:'',
          addUser:'',
          userType:'0',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        picListData:[],   // 供应商列表
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          isOpenLead:false,     // 批量导入框
          isOpenLeadError:false,     // 批量导入异常框
          openResetPass:false,  // 重置密码框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          isOpenMsg:'',      // 弹出框 的msg
          otherInputDisabled:false,  //用户邮箱是否可编辑  在添加与编辑中区分
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        sels:[],    //批量删除已选的条目数
        uploadPic:this.RmsUrl+'saveAttachmentMultipartFile?Authorization='+this.sessuserid,   //  上传图片地址
        picSrc:'http://img5.duitang.com/uploads/item/201602/11/20160211121720_astJR.jpeg',
        image_Ids:[],
        picId:'',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入SKU' : this.selectParams.optionTitle == 1 ? '请输入上传者':'';
      },
    },
    mounted () {
      this.getauthorityList();
      this.getUserNameList();
      this.getPictureList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getUserNameList(){
        this.httpPost('imageManage/selectAddUser').then(res => {
          if(res.data.result == true){
            this.userOptions = res.data.params.strList;
          }
        })
      },
      selectFilter:function(){
        var selectVal = this.selectParams.optionValue;
        var selectTittle = this.selectParams.optionTitle;
        var vm = this;
        switch(selectTittle){
          case 0:
            vm.pageFilter.skuNo = selectVal ;
            vm.pageFilter.addUser = '' ;
            this.getPictureList();
            break;
          case 1:
            vm.pageFilter.addUser = selectVal ;
            vm.pageFilter.skuNo = '' ;
            this.getPictureList();
            break;
        }
      },
      getPictureList:function(){
        this.httpPost('imageManage/select',this.pageFilter).then(res => {
          if(res.data.result == true){
            this.dialogFlag.isOpen = false;
            const pageData = res.data.params.docsDataList;
            this.page = pageData;
            this.picListData = pageData.listData;
          }else{
            this.picListData = [];
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      batchInfoDialog:function(val){
        var vm = this;
        vm.image_Ids = vm.sels.map(item => item.imageId);
        if(vm.image_Ids == '' ){
          vm.tips();
        }else{
          var msg,isPirates;
          msg = val == 'daotu' ? '确定将以下数据标记为盗图?' :'确定将以下数据取消盗图？';
          isPirates = val == 'daotu' ? '1' :'0';
          vm.doItem(msg,'imageManage/updateStatus',{isPirates:isPirates,imageId: vm.image_Ids },vm.getPictureList);
        }
      },
      showInfoDialog:function(row,val){
        var vm = this,msg='',isPirates='';
        vm.image_Ids = [];
        vm.image_Ids.push(row.imageId);
        if(val == 'chakan'){
          vm.dialogFlag.infoDetail = true;
          vm.isShow = false;
          this.picSrc = row.imageUrl
        }else if(val == ''){
          isPirates = row.isPirates == 1 ?  '0' : '1';
          msg = row.isPirates == 1 ? '确定取消盗图？' : '确定标记为盗图？';
          vm.doItem(msg,'imageManage/updateStatus',{isPirates:isPirates,imageId: vm.image_Ids },vm.getPictureList);
        }else{
            vm.copyLink(row.imageUrl);
        }
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getPictureList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getPictureList();
      },
      handleRemove(file,fileList) {
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
              for(var i=0;i<this.picList.length;i++){
                  if(this.picList[i].attachId == file.attachId){
                      this.picList.splice(i,1);
                  }
              }
          }else{
            this.$message(res.data.message);
          }
        })
      },
      uploadFilePic(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          if(res.data.result == true){
            this.picList.push(res.data.params.attach);
          }
        })
      },
      savePic(){
          var picIdList = this.picList.map(item => item.attachId);
          if(picIdList.length<1){
              this.$message('请先选择图片！');
          }else{
            this.httpPost('imageManage/save',picIdList).then(res =>{
              if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.infoDetail = false;
                this.getPictureList();
              }
            })
          }
      },
      copyLink(val) {
        if(val){
          var url = document.getElementById(val);
          url.select();
          document.execCommand("copy");
          this.$message('复制地址成功')
        }else{
          this.$message('地址为空复制不了哦')
        }
      },
      childChangeVal(val){
        var vf = this.pageFilter;
        val.type == 'skuType' ? vf.skuType = val.value : val.type == 'userType' ? vf.userType = val.value : val.type == 'isPirates' ? this.isPirates = val.value : '';
      },
      onChildChangeVal(val){
        this.pageFilter.addUser = val.value;
      },
      formatPirates(row){
          return row.isPirates == false ? '非盗图' : row.isPirates == true ? '盗图' : ''
      },
      closeDialog(){
        this.pageFilter.initialTime='';
        this.pageFilter.overTime='';
        this.pageFilter.addUser='';
        this.pageFilter.skuNo='';
        this.isPirates='';
      },
      filterData(){
          this.pageFilter.isPirates = this.isPirates;
          this.getPictureList();
      }
    }
  }
</script>
<style scoped>
  .picDetail{
    width:150px;
    height:150px;
  }
.cell input{
  width:100%;
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
</style>
