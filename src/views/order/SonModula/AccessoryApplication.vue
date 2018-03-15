<template>
  <div>
    <el-dialog  :title="title" :visible.sync="isOpen" size="small" :close-on-click-modal="false" @close="resetForm">
      <el-form :model="delivery" :rules="infoDelivery" ref="delivery"  class="demo-ruleForm" >
        <el-form-item label="订单编号"  prop="orderNo" :label-width="financeFormLabelWidth" >
          <el-col :span="8">
          <el-input :disabled="inputDisabled" type="text" v-model="delivery.orderNo"  ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="SKU"  prop="skuNo" :label-width="financeFormLabelWidth" >
          <el-col :span="8">
            <SkuList :isDisabled="inputDisabled" :selectValue="delivery.skuNo" @child-change-val="getChildren" @child-list="getid" select-type="skuNo"></SkuList>
          </el-col>
        </el-form-item>
        <el-form-item label="申请数量"  prop="reqQty" :label-width="financeFormLabelWidth" >
          <el-col :span="8">
            <el-input type="number"  v-model.number="delivery.reqQty" :disabled="inputDisabled"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="仓库"  prop="reqWareHouse" :label-width="financeFormLabelWidth"   required>
          <OwnWarehouseList :isDisabled="inputDisabled" :selectValue="delivery.reqWareHouse" @child-change-val="getChildren"  select-type="whName"></OwnWarehouseList>
        </el-form-item>
        <el-form-item label="添加图片" :class="{preview:ispreview}"  prop="imageList" :label-width="financeFormLabelWidth"  >
          <el-upload  :http-request="uploadFilePic"
                      :on-remove="handleRemove"
                      :action="uploadPic"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      drag
                      :file-list="imageList"
                      accept=".jpg,.jpeg,.png" >
            <el-button size="small" type="primary" v-if="inputDisabled == false">添加图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="申请备注"  prop="reqMemo" :label-width="financeFormLabelWidth"  >
          <el-input type="textarea"  :disabled="inputDisabled" v-model="delivery.reqMemo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">关 闭</el-button>
        <el-button @click="submitForm('delivery');" v-if="inputDisabled == false" type="primary" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" size="tiny" class="ImgEnlarge">
      <img width="100%" :src="dialogImageUrl" alt="放大">
    </el-dialog>
  </div>
</template>
<script>
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import SkuList from 'components/listData/getSkuList.vue'
  export default{
    name:'AccessoryForm',
    components: {
      OwnWarehouseList,SkuList},
    data(){
      let name2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[A-Za-z0-9]{1,30}$/.test(value)){
          callback(new Error('请输入正确格式且长度不能超过30个字符'));
        } else {
          callback();
        }
      };
      const regean = (rule, value, callback) => {
        if (!/^\d{1,20}$/.test(value)) {
          callback(new Error('请输入数字格式且长度不能超过20个字符'));
        }else{
          callback();
        }
      };
      return {
        iconIndex:'',
        ispreview:false,
        uploadPic:this.RmsUrl+'productDevInfo/postProductImage='+this.sessuserid,   //  上传图片地址
        dialogImageUrl:'',
        dialogVisible:false,
        delivery:{
            reqId:'',
            orderId:'',
            orderNo:'',
            skuNo:'',
            productId:'',
            reqQty:'',
            reqWareHouse:'',
            reqMemo:'',
        },
        imageList:[],
        infoDelivery:{
          orderNo:[
            { validator: name2, trigger: 'change', required: true }
          ],
          skuNo:[
            { required: true,  message: '请选择SKU！', trigger: 'change'},
          ],
          reqQty:[
            { required: true, type: 'number', message: '请输入数量！'},
            { validator: regean, trigger: 'change',required: true,}
          ],
          reqWareHouse:[
            { required: true,  message: '请选择仓库！', trigger: 'change'},
          ],
          reqMemo:[
            { required: true, message: '请输入备注!', trigger: 'change' },
            { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'change' },
          ]
        },
        mainAttachId:'',
        ImgList:[],
        isOpen:this.infoisOpen,
        title:this.DialogTitle,
        listId:this.getpoId,
        inputDisabled:false,
        financeFormLabelWidth: '100px',
        changeget:this.getdata

      }
    },
    props:['getpoId','infoisOpen','DialogTitle','getdata'],
    methods: {
      getid(val){
        this.delivery.productId = val;
      },
      resetForm() {
        this.ImgList=[];
        this.imageList=[];
        this.closeDialog();
        this.$refs['delivery'].resetFields();
      },
      handleRemove(file, fileList) {
      	this.imageList = fileList;
      	this.iconIndex='';
        this.addPrimaryIcon();
        console.log(file, fileList);
      },
      handleChange(file, fileList) {
      	/*console.log('fileList % 0===',fileList)
      	this.ImgList.push(fileList);
        console.log(file, fileList);*/
      },
      getList(){
    		this.httpPost('partsApply/query?reqId='+this.getpoId).then(res=>{
    			this.delivery= res.data.accessory;
    			if(res.data.imageList){
            var arrImg = res.data.imageList;
            var newImg = [];
            for(let i=0;i<arrImg.length;i++){
              newImg.push({url:arrImg[i].imageUrl,id:arrImg[i].attachId});
            }
            this.imageList = newImg;
            this.addPrimaryIcon();
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      closeDialog(){
      	this.changeget = false;
        this.$emit('Change-list',{
        	open:this.isOpen,
          get:this.changeget
        });

      },
      uploadFilePic(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        console.log('data % 0===',data);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          if(res.data.result == true){
            this.imageList.push(res.data.params.attach);
            this.$message(res.data.message);
            this.addPrimaryIcon();
          }else{
            this.$message(res.data.message)
          }
        })
      },
      addPrimaryIcon(){
        var vm = this;
        var iconArr = document.getElementsByClassName('el-upload-list__item-actions');
        var succArr = document.getElementsByClassName('el-upload-list__item-status-label');
        setTimeout(function(){
          for(var i=0;i<iconArr.length;i++) {
            var spanChild = iconArr[i].lastChild;
            if (spanChild.className != 'primaryIcon') {
              var newSpan = document.createElement("span");
              iconArr[i].appendChild(newSpan);
              var newChild = iconArr[i].lastChild;
              newChild.setAttribute('id', i);
              newChild.setAttribute('class', 'primaryIcon');
              //newChild.className='el-icon-star-on';
              newChild.innerHTML = '★';

              for (var a = 0; a < succArr.length; a++) {
                succArr[a].style.display = 'block';
              }
              if(i === vm.iconIndex){
                vm.setIcon(vm.iconIndex)
              }
              if(vm.inputDisabled == true){
                newChild.style.display = 'none';
              }
              newChild.onclick = function ($event) {
                vm.setIcon($event.target.id)
              }
            }
          }
        },100)
      },
      setIcon:function(index){
        var succArr = document.getElementsByClassName('el-upload-list__item-status-label');
        for (var j = 0; j < succArr.length; j++) {
          if (j == index) {
            this.iconIndex = j;
            //alert('当前设置第' + j + '张为主图');
            this.mainId(this.iconIndex);
            succArr[j].style.background = 'red';
          } else {
            succArr[j].style.background = '#13ce66';
          }
        }
      },
      mainId(value){
      	var vm=this;
      	//alert('88==='+index)
      	//console.log('	this.imageList % 0==',	this.imageList)
      	this.imageList.forEach(function(item,index,data){
      		if(value == index){
            vm.mainAttachId = data[value].attachId;
          }
        })
      },
      getChildren(val){
        val.type === 'whName' ? this.delivery.reqWareHouse= val.value : val.type==='skuNo' ? this.delivery.skuNo = val.value : '';
      },

      submitForm(formName){
        var obj={};
        var imgList= this.imageList.map(item=>item.attachId);
        obj.reqId=null;
        obj.orderId=this.getpoId;
        obj.orderNo=this.delivery.orderNo;
        obj.skuNo=this.delivery.productId;
        obj.productId=this.delivery.skuNo;
        obj.reqQty=this.delivery.reqQty;
        obj.reqWareHouse=this.delivery.reqWareHouse;
        obj. mainAttachId  = this.mainAttachId;
        obj.attachIds = imgList;
        obj.reqMemo=this.delivery.reqMemo;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('9999999 % 0====',obj.attachIds)
          	if(obj.attachIds.length == 0){
          		this.$message('请上传图片！')
            }else {
              this.httpPost('partsApply/add',obj).then(res=>{
                if(res.data.result == true){
                  this.$message(res.data.message);
                  this.isOpen = false;
                }else{
                  this.$message(res.data.message);
                }
              })
            }
          }else {
            return false;
          }
        })
      },
    },
    mounted () {
    	//this.getList();
    },
    watch: {
      'getdata':{
        handler(val){
        	this.changeget = val;
        	if(val == true){
            this.getList();
            this.addPrimaryIcon();
          }else{

          }
        },
      },
      'getpoId':{
        handler(val){
          this.listId = val;
        },
        deep: true,
      },
      'DialogTitle':{
        handler(val){
          val == '查看' ? this.inputDisabled = true:this.inputDisabled = false;
          val == '查看' ? this.ispreview = true:this.ispreview = false;
          this.title = val;
          if(val == '查看' || val == '编辑' ){

          }
        },
        deep: true,
      },

      'infoisOpen': {
        handler: function (val) {
        	this.isOpen = val;
        },
      },
    },
  }

</script>

<style scoped>


</style>
