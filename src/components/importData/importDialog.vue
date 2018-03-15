<template>
    <div class="">
      <!---------------批量导入弹出框-------------------------->
      <el-dialog title="批量导入" :visible.sync="open" size="tiny" @close="beforeCloseChange" :close-on-click-modal="false" >
        <el-upload class="upload-demo" :http-request="uploadFile"  :action="uploadExc" ref="upload" :auto-upload="false" :on-change="handExcChange" :on-remove="handleExcRemove" :file-list="excFile" accept='.xls,.xlsx,.xlsm'>
          <span>选择需要导入的文件</span>
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload><br/>
        <span class="remark" v-if="modalUrl!=''">请先下载Excel模板，录入相关数据之后再导入。</span><br/>
        <span class="remark" v-if="modalUrl==''" >请将导出的模板录入跟踪单号及运费再导入系统。</span><br/>
        <span class="modelDown" v-if="modalUrl!=''" @click="downDown()">excel模板下载</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="open = false;">取 消</el-button>
          <el-button type="primary" :loading="$store.state.loading" @click="submitUpload();">导 入</el-button>
        </div>
      </el-dialog>
      <!---------------批量导入导常弹出框-------------------------->
      <el-dialog title="提示" :visible.sync="isOpenErr" size="tiny" :close-on-click-modal="false">
        <div id="item_list">
          <el-table :data="errorData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="cellName" label="坐标" align="center"></el-table-column>
            <el-table-column prop="cellValue" label="错误信息" align="center"></el-table-column>
            <el-table-column prop="errorDesc" label="描述" align="center"></el-table-column>
            <el-table-column prop="errorType" label="错误类型" align="center"></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reflash()">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  export default{
    data(){
      return {
          isOpenErr:false,
          open:false,
          dialogTitle:"",
          errorData:[],
          excList:[],
          excFile:[],
      }
    },
    props:['isOpen','modalUrl','importUrl','placeValue','isDisabled','isMultiple',],
    mounted(){
       // this.getData();   // 通用导入组件
    },
    methods: {
      reflash:function(){
          this.isOpenErr = false;
          this.open = false;
          this.$emit('getData');
      },
      downDown:function(){
        var url = this.RmsUrl+this.modalUrl+'?Authorization='+sessionStorage.getItem('userSession');  //  下载导入模板地址
        window.open(url);
      },
      submitUpload:function() {
        if(this.excList.length<1){
          this.$message('还未选择导入文件！');
        }if(this.excList.length>=2){
          this.$message('只能导入一个文件，请把其它文件移除！')
        } else{
          this.$refs.upload.submit();
        }
      },
      handExcChange(file,fileList){
        this.excList = fileList;
      },
      beforeCloseChange(val){
        this.excFile = [];
        this.open = false;
      },
      //      自定义上传
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost(this.importUrl,data,'',99999999999).then(res => {
          if(res.data.result == true){
            this.$message(res.data.message);
            this.open = false;
            this.excFile=[];
            this.excList=[];
            this.$emit('getData');
          }else{
            if(res.data.params.errorList.length>0){
              this.errorData = res.data.params.errorList;
              this.isOpenErr = true;
            }else{
              this.$message(res.data.message);
            }
            this.excFile=[];
            this.excList=[];
          }
        })
      },
    },
    watch: {
      'isOpen':{
        handler(val){
          this.open = true;
          this.excFile=[];
        },
        deep:true
      },
      'open':{
        handler(val){

        }
      },
    }
  }
</script>

<style scoped>

</style>
