<template>
  <div>
    <el-form v-model="imagesparentForm" :label-width="financeFormLabelWidth"  >
      <el-form-item label="上传主图" :class="{preview:!dis}">
        <el-upload :http-request="uploadFilePic3" :action="uploadPic" list-type="picture-card"
                   drag :file-list="MinpicList" :on-remove="handleRemove" accept=".jpg,.jpeg,.png" :before-upload="beforeAvatarUpload">
          <el-button size="small" type="primary" v-if="dis == true">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品相册" :class="{preview:!dis}">
        <el-upload  :http-request="uploadFilePic" :action="uploadPic" multiple list-type="picture-card"
                   drag :file-list="picList" :on-remove="handleRemove1" accept=".jpg,.jpeg,.png">
          <el-button size="small" type="primary"  v-if="dis == true">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品设计图"   :class="{preview:!dis}">
        <el-upload :http-request="uploadFilePic2" :action="uploadPic" multiple  list-type="picture-card"
                                drag :file-list="picList2" :on-remove="handleRemove2" accept=".jpg,.jpeg,.png">
        <el-button size="small" type="primary"  v-if="dis == true">点击上传</el-button>
      </el-upload>
      </el-form-item>
    </el-form>
    <!--<el-dialog v-model="dialogVisible" size="tiny" class="updateImg">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>-->
  </div>
</template>
<script>
  export default{
    data(){
      return {
        financeFormLabelWidth: '120px',
        imagesparentForm:this.imagesparentinfoDetail,
        picSrc:[],
        picList:[],     // 导入文件
        picList2:[],     // 导入文件
        MinpicList:[],     //主图
        dis:this.disState,
        msg:[],
        uploadPic:this.RmsUrl+'productDevInfo/postProductImage='+this.sessuserid,   //  上传图片地址
        listFrom:[
          {
            productId:'',
            imageUrl:'',
            imageId:'',
            attachId:'',
            goupName:'',
            state:'0'
          }
        ],
        dialogImageUrl: '',
        dialogVisible: false,
        imgstate:'',
        goupName:'',
        red:'red',
        docmentNulll:this.docmentNull,
        SelectedImgUrl:'',
      }
    },
    props:['disState','Selected','docmentNull','isOpen'],
    watch: {
      'isOpen':{
        handler(val,oldVal){
          this.picList = [];
          this.picList2 = [];
          this.MinpicList = [];
          this.getImg();
        },
      },
      'picList':{
        handler(val,oldVal){
          this.$emit('assignment',val)
        },
        deep: true
      },
      'picList2':{
        handler(val,oldVal){
          this.$emit('assignment3',val)
        },
        deep: true
      },
      'MinpicList':{
        handler(val,oldVal){
          this.$emit('assignment4',val)
        },
        deep: true
      },
      'imgstate':{
        handler(val){
          this.$emit('assignment2',val)
        },
        deep: true
      },
      'Selected':{
        handler(val,oldVal){
          this.picList = [];
          this.picList2 = [];
          this.MinpicList = [];
          //this.getImg();
        },
        deep: true
      },
      'disState':{
        handler(val){
          this.dis = val;
        }
      },
      'docmentNull':{
        handler(val){
          this.docmentNulll = val;
        }
      }
    },
    mounted () {

     this.getImg();

    },
    created: function () {
      // `this` 指向 vm 实例
    },
    methods: {
      getImg(){
        //alert(123123123);
      	if(this.docmentNull==true){
          this.picList = [];
          this.picList2 = [];
          this.MinpicList = [];
          this.getImageResource();
        }else{

        }

      },
      getImageResource(){
        this.picList = [];
        this.picList2 = [];
        this.MinpicList = [];
       // alert('this.Selected.productId==='+this.Selected.productId)
          this.httpPost('productDevInfo/getProductImage?productId='+this.Selected.productId).then(res =>{
            this.msg=res.data;
            let imgMsg=res.data;
            for( let i=0; i<imgMsg.length; i++){
              if(imgMsg[i].goupName==='产品相册'){
//                this.picList = [];
                let imgUrlObj={url:this.RmsUrl+imgMsg[i].imageUrl,attachId:imgMsg[i].attachId,productId:this.Selected.productId, goupName:'产品相册'};
                this.picList.push(imgUrlObj)
              }else if (imgMsg[i].goupName==='产品设计图'){
//                this.picList2 = [];
                let imgUrlObj={url:this.RmsUrl+imgMsg[i].imageUrl, attachId:imgMsg[i].attachId,productId:this.Selected.productId,goupName:'产品设计图'};

                this.picList2.push(imgUrlObj)
              }else if(imgMsg[i].goupName==='主图'){
//                this.MinpicList=[];
                let imgUrlObj={url:this.RmsUrl+imgMsg[i].imageUrl, attachId:imgMsg[i].attachId,productId:this.Selected.productId, goupName:'主图'};
                this.MinpicList.push(imgUrlObj);
                console.log(11111111111111111111111111111111111111)
                console.log(this.MinpicList);
//                alert(966666)
//                for(let k=0; k<this.MinpicList.length ; k++){
//                    alert(111)
//                  this.$set(this.MinpicList[k],imgUrlObj)
//                }
//                alert(this.MinpicList.length)
//                this.imgstate=imgMsg[i].attachId;
              }
              if(imgMsg[i].state==='1'){
                this.SelectedImgUrl=this.RmsUrl+imgMsg[i].imageUrl;
              }
            }
          })
      },
      handleRemove(file) {
        console.log(file);
        for(var i=0;i<this.MinpicList.length;i++){
          if(this.MinpicList[i].attachId == file.attachId){
            this.MinpicList.splice(i,1);
          }
        }
        console.log(this.MinpicList)
      },
      handleRemove1(file) {
        for(var i=0;i<this.picList.length;i++) {
          if (this.picList[i].attachId === file.attachId) {
            this.picList.splice(i, 1);
          }
        }
        console.log(this.picList)
      },
      handleRemove2(file) {
        for(var i=0;i<this.picList2.length;i++) {
          if (this.picList2[i].attachId === file.attachId) {
            this.picList2.splice(i, 1);
          }
        }
        console.log(this.picList2)
      },
      uploadFilePic(options){
        console.log(options);
        this.goupName='产品相册';
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          console.log(res);
          if(res.data.result == true){
            this.picList.push(res.data.params.attach);
            console.log(res.data.params.attach);
            console.log(this.picList);
            console.log(9999778);
            for(let i=0; i<this.picList.length; i++){
              this.picList[i].productId=this.Selected.productId;
              this.picList[i].goupName=this.goupName;
            }
            console.log(this.picList)
          }
        })
      },
      uploadFilePic2(options){
        console.log(options);
        this.goupName='产品设计图';
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          console.log(res);
          if(res.data.result == true){
            this.picList2.push(res.data.params.attach);
            console.log(res.data.params.attach)
            console.log(this.picList2)
            console.log(9999778)
            for(let i=0; i<this.picList2.length; i++){
              this.picList2[i].productId=this.Selected.productId;
              this.picList2[i].goupName=this.goupName;
            }
            console.log(this.picList2)
//            this.addForm.imageId.push(res.data.params.attach.attachId);
          }else {
//            this.$message()
          }
        })
      },
      uploadFilePic3(options){
        console.log(options);
        this.goupName='主图';
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          console.log(res);
          if(res.data.result == true){
            this.MinpicList.push(res.data.params.attach);
            for(let i=0; i<this.MinpicList.length; i++){
              this.MinpicList[i].productId=this.Selected.productId;
              this.MinpicList[i].goupName=this.goupName;
              this.imgstate=this.MinpicList[i].attachId;
            }
            console.log(this.MinpicList)
//            this.addForm.imageId.push(res.data.params.attach.attachId);
          }else {
//            this.$message()
          }
        })
      },
      beforeAvatarUpload(file){
        const isNumber = this.MinpicList.length<=0;
        if(!isNumber){
            this.$message('只允许上传一张主图')
        }
        return isNumber
      },
      preview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

    }
  }
</script>

<style scoped>
  .red{
    background: red;
  }
  .picDetail{
    width:150px;
    height:150px;
    background: yellowgreen;
  }

</style>
