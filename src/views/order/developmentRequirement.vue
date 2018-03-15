<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
            <el-row  id="filer">
                <el-collapse v-model="activeNames" >
                    <el-collapse-item name="1">
                        <el-col class="marginBottom">
                            <span class="span_label">类型</span>
                            <el-radio-group size="small" @change="getRequirementList();" v-model="pagefilters.isUse">
                              <el-radio-button label="">全部</el-radio-button>
                              <el-radio-button label="true">已查看</el-radio-button>
                              <el-radio-button label="false">未查看</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
            <el-row class="supplier_btn">
                <el-button size="small" @click="dialogFlag.title='新增开发需求';openDialog('');" type="primary">添加开发需求</el-button>
            </el-row>
            <div id="item_list">
                <el-table :data="Data" ref="Data" border tooltip-effect="dark" @selection-change="batchChange"
                          style="width:100%;">
                    <el-table-column id="space" label="操作" align="center">
                        <template scope="scope">
                            <el-tooltip content="查看" effect="dark" placement="bottom">
                                <i class="iconfontyyy" @click="dialogFlag.title='查看开发需求';openDialog(scope.row);" content="Bottom center">&#xe600;</i>
                            </el-tooltip>
                          <el-tooltip content="编辑" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="dialogFlag.title='编辑开发需求';openDialog(scope.row);" content="Bottom center">&#xe6e5;</i>
                          </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="productName" align="center" sortable></el-table-column>
                  <el-table-column label="描述" prop="docs" align="center" sortable></el-table-column>
                  <el-table-column label="链接" prop="productUrl" align="center" sortable></el-table-column>
                  <el-table-column label="创建人" prop="addUser" align="center" sortable></el-table-column>
                  <el-table-column label="创建时间" prop="addTime" width="180" :formatter="tool.formatDate" align="center" sortable>
                    </el-table-column>
                </el-table>
            </div>
          <!------------------------------------查看/编辑/新增--------------------------------------->
             <el-dialog  :title="dialogFlag.title"  :visible.sync="dialogFlag.isopen" size="small" @close="resetForm" :close-on-click-modal="false">
                <el-form labelWidth="120px" :model="requirementForm" ref="requirementForm">
                    <el-form-item label="商品名称" prop="productName" :rules="[{ required: true, message: '请输入商品名称！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                        <span v-if="dialogFlag.title=='查看开发需求'">{{requirementForm.productName}}</span>
                        <el-input v-if="dialogFlag.title!='查看开发需求'" type="text" v-model="requirementForm.productName"></el-input>
                    </el-form-item>
                  <el-form-item label="商品描述" prop="docs" :rules="[{ required: true, message: '请输入商品描述！', trigger: 'blur'},{ min: 1, max: 300, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                    <span v-if="dialogFlag.title=='查看开发需求'">{{requirementForm.docs}}</span>
                    <el-input v-if="dialogFlag.title!='查看开发需求'"  type="textarea" v-model="requirementForm.docs"></el-input>
                  </el-form-item>
                  <el-form-item label="商品链接" prop="productUrl" :rules="[{ required: true, message: '请输入商品链接！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                    <span v-if="dialogFlag.title=='查看开发需求'">{{requirementForm.productUrl}}</span>
                    <el-input v-if="dialogFlag.title!='查看开发需求'"  type="textarea" v-model="requirementForm.productUrl"></el-input>
                  </el-form-item>
                  <el-form-item label="产品图片" prop=""  :class="dialogFlag.title=='查看开发需求'?'preview':''">
                    <el-upload :http-request="uploadFilePic"  :on-remove="handleRemove" :action="uploadPic" list-type="picture-card" drag multiple :file-list="attachList"  accept=".jpg,.jpeg,.png">
                      <el-button size="small" type="primary"  v-if="dialogFlag.title !='查看开发需求'">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-col v-if="dialogFlag.title=='查看开发需求'">
                    <el-form-item label="添加人" prop="addUser" :rules="[{ required: true, message: '请输入字符！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                    {{requirementForm.addUser}}
                    </el-form-item>
                    <el-form-item label="添加时间" prop="addTime" :rules="[{ required: true, message: '请输入字符！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                      {{tool.formatDate('','',requirementForm.addTime)}}
                    </el-form-item>
                  </el-col>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFlag.isopen=false;"  v-if="dialogFlag.title=='查看开发需求'">关 闭</el-button>
                  <el-button @click="dialogFlag.isopen=false;"  v-if="dialogFlag.title!=='查看开发需求'">取 消</el-button>
                  <el-button type="primary" @click="submitForm();" v-if="dialogFlag.title !=='查看开发需求'" :loading="$store.state.loading">保 存</el-button>
                </div>
            </el-dialog>
        </div>
        <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
    </div>
</template>
<script>
	export default{
		data(){
			return {
        attachList:[],
        strList:[],
        uploadPic:this.RmsUrl+'productDevInfo/postProductImage='+this.sessuserid,   //  上传图片地址
        activeNames: ['1'],    //  过滤条件栏的折叠面板
				Data: [],
        requirementForm:{
          productId:'',
          productName:'',
          docs:'',
          productUrl:'',
          isQuery:'',
          addUser:'',
          addTime:''
        },
				Options: [
					{label: '1', value: '1'},
					{label: '1', value: '1'},
					{label: '1', value: '1'},
				],
        dialogFlag:{
          isopen:false,
          title:'',
        },
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
				pagefilters: {
          isUse:'',
					currentPage: 1,
					pageSize: 10,
				},
			}
		},
		mounted: function () {
			this.getRequirementList();
		},
		methods: {
      resetForm() {
        this.$refs['requirementForm'].resetFields();
        this.attachList=[];
        this.strList=[];
      },
      submitForm(){
      	var url='',obj2={},obj={};
        obj.productName=this.requirementForm.productName;
        obj.docs=this.requirementForm.docs;
        obj.productUrl=this.requirementForm.productUrl;
        obj.productId=this.requirementForm.productId;
        obj2.productDevSuggest=JSON.parse(JSON.stringify(obj));
        obj2.strList=[];
        if(this.attachList!=[]){
          this.attachList.forEach(item=>{
            obj2.strList.push(item.attachId)
          })
        }else{
          obj2.strList=[]
        }
        this.dialogFlag.title=='新增开发需求'? (url='productDevSuggest/save',obj2.productDevSuggest.productId=''):url='productDevSuggest/update';
        this.$refs['requirementForm'].validate((valid) => {
        	if(valid){
            this.httpPost(url,obj2).then(res=>{
              this.$message(res.data.message)
              if(res.data.result==true){
                this.dialogFlag.isopen=false;
                this.getRequirementList();
              }
            })
          }
        })
      },
      openDialog(val){
      	this.productId=val.productId;
        val==''? this.dialogFlag.isopen=true:this.getDialogList(val);
      },
      getDialogList(val){
      	this.httpGet('productDevSuggest/select?productId='+val.productId).then(res=>{
      		this.requirementForm=res.data;
          this.dialogFlag.isopen=true;
        })
        this.httpPost('productDevSuggestAttach/selectPicture',{productId:val.productId}).then(res=>{
          if(res.data.params.list!=[]){
            res.data.params.list.forEach(item=>{
              this.attachList.push(item)
            })
            this.attachList.forEach(item=>{
             item.url=	item.picture;
             delete item.picture;
            })

          }
        })
      },
			//添加图片
      beforeAvatarUpload(file){
      },

      uploadFilePic(options){
       // console.log('3333 % 0',options);
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          if(res.data.result == true){
            this.attachList.push(res.data.params.attach);
          //  this.strList = this.attachList.map(item =>item.attachId);

          }
        })
      },
      handleRemove(file,fileList) {
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
            for(let i=0;i< this.attachList.length;i++){
              if( this.attachList[i].attachId == file.attachId){
                this.attachList.splice(i,1);
              }
            }
          }
        })

       // console.log(fileList);
        console.log('55 % 0', this.strList);
        console.log('666 % 0',this.attachList);
      },
			getRequirementList(){
        this.httpGet('productDevSuggest/selectAll?isUse='+this.pagefilters.isUse+'&currentPage='+this.pagefilters.currentPage+'&pageSize='+this.pagefilters.pageSize).then(res=>{
        	this.page=res.data;
          this.Data=res.data.listData;
        })
			},
			batchChange(){

			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
				this.getRequirementList();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
				this.getRequirementList();
			},

		}
	}

</script>

<style scoped>


</style>
