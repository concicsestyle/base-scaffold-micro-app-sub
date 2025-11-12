<template>
        <el-dialog
        v-model="states.dialogVisible"
        :title="states.title"
        :close-on-click-modal="false"
        draggable
        width="60%"
        @close="handleClose"
    >
    <el-form
                   ref="formRef"
                   :model="states.formData"
                   label-width="80px"
                   label-position="top"
                   class="ml-4 standard-form"
                   :disabled="states.updateType == 'read'"
               >
                   <el-row :gutter="32">
                       <el-col :span="6">
                           <el-form-item
                               label="工作中心编码"
                               prop="workCenterCode"
                               :rules="e_rule('required', '工作中心编码不能为空')"
                           >
                               <el-input
                                   v-model.trim="states.formData.workCenterCode"
                                   :disabled="states.typeCodeStatus || states.updateType == 'edit'"
                                   clearable
                                   maxlength="60"
                                   @input="value => states.formData.workCenterCode= value.replace(/[^\w\.\/]/ig,'')"
                                   :placeholder="states.updateType != 'read' ? '请输入' : ' '"
                               ></el-input>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="工作中心名称"
                               prop="workCenterName"
                               :rules="e_rule('required', '工作中心名称不能为空')"
                           >
                               <el-input
                                   v-model.trim="states.formData.workCenterName"
                                   clearable
                                   maxlength="60"
                                   placeholder="请输入"
                               ></el-input>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="路线点"
                               prop="noprocessNodes"

                           >
                             <el-tree-select
                             ref="noprocessNodesRef"
                             v-model="states.formData.noprocessNodes"
                             @change="handleCheckChange"
                             :data="states.Nodes"
                             value-key="id"
                             :props="{ label: 'routeNode', children: 'children' }"
                             clearable
                             filterable
                             default-expand-all
                             check-strictly
                             :render-after-expand="false"
                         >
                           <template #default="{ data }">
                             <span v-if="data.nodeName"> {{ data.nodeName }}({{ data.nodeName }})</span>
                             <span v-else>{{ data.nodeName }}</span>
                           </template>
                         </el-tree-select>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="能力类型"
                               prop="workCenterType"
                           >
                               <el-input
                                 value="粗能力"
                                 readonly
                                 disabled
                                   v-model.trim="states.formData.workCenterType"
                                   clearable
                                   maxlength="60"
                                   placeholder="请输入"
                               ></el-input>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="所属制造厂"
                               prop="factoryId"
                               :rules="e_rule('required', '所属制造厂不能为空')"
                           >
                                 <el-input
                                 readonly
                                 disabled
                                   v-model.trim="states.formData.factoryName"
                                   clearable
                                   maxlength="60"
                                   placeholder="请输入"
                               ></el-input>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="状态"
                               prop="state"
                               :rules="e_rule('required', '状态不能为空')"
                           >
                                <el-select
                                    v-model="states.formData.state"
                                    placeholder="请选择"
                                    style="width: 240px"
                                >
                                    <el-option
                                    v-for="item in states.statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    />
                                </el-select>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="能力单位"
                               prop="abilityUnitsId"
                               :rules="e_rule('required', '能力单位不能为空')"
                           >
                             <el-select
                               v-model="states.formData.abilityUnitsId"
                               placeholder="请选择"
                               style="width: 240px"
                             >
                               <el-option
                                 v-for="item in basic_ability_units"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"
                               />
                             </el-select>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="能力值"
                               prop="abilityData"
                               :rules="e_rule('required', '能力值不能为空')"
                           >
                               <el-input
                                   v-model.trim="states.formData.abilityData"
                                   clearable
                                   maxlength="60"
                                   placeholder="请输入"
                               ></el-input>
                           </el-form-item>
                       </el-col>
                       <el-col :span="6">
                         <el-form-item
                           label="责任人"
                           prop="responsiblePersonId"
                         >
                         <el-tree-select
                             ref="responsNodesRef"
                             v-model="states.formData.responsiblePersonId"

                             :data="states.responsiblePerson"
                             value-key="id"
                             :props="{ label: 'name', children: 'children' }"
                             clearable
                             filterable
                             default-expand-all
                             check-strictly
                             :render-after-expand="false"
                         >
                         </el-tree-select>
                         </el-form-item>
                       </el-col>
                       <el-col :span="6">
                           <el-form-item
                               label="是否为外协"
                               prop="isOutsourced"
                               :rules="e_rule('required', '是否为外协不能为空')"
                           >
                                <el-radio-group v-model.number="states.formData.isOutsourced" class="ml-4">
                                    <el-radio :label=1 size="large">是</el-radio>
                                    <el-radio :label=0 size="large">否</el-radio>
                                </el-radio-group>
                           </el-form-item>
                       </el-col>
                     <el-col :span="6">
                       <el-form-item
                         label="是否为关键资源"
                         prop="isKeyResources"
                         :rules="e_rule('required', '是否为关键资源不能为空')"
                       >
                         <el-radio-group v-model.number="states.formData.isKeyResources" class="ml-4">
                           <el-radio :label=1 size="large">是</el-radio>
                           <el-radio :label=0 size="large">否</el-radio>
                         </el-radio-group>
                       </el-form-item>
                     </el-col>
                       <el-col :span="24">
                           <el-form-item
                               label="备注"
                               prop="remark"
                           >
                           <el-input
                                   v-model.trim="states.formData.remark"
                                   clearable
                                   maxlength="255"
                                   type="textarea"
                                   show-word-limit
                                   placeholder="请输入"
                               ></el-input>
                           </el-form-item>
                       </el-col>
                   </el-row>
               </el-form>
        <template v-if="states.updateType != 'read'" #footer>
            <el-button @click="handleClose">取&nbsp;消</el-button>
            <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
        </template>
    </el-dialog>

   </template>

   <script setup lang="ts">
   import { e_rule } from '@/utils/require-rule/index'
   import { E_Msg } from '@/utils/message/index'
   import { reactive, ref, nextTick, watch, onMounted } from 'vue'
  //  import craftInfoTable from './craft-info-table.vue'
  //  import operationBase from './operation-base.vue'
  //  import operationResources from './operation-resources.vue'
   import {save ,update} from '@/api/basic/work-center-api'
   import routeApi from '@/api/ips/basicData/route-api'
   import userApi from '@/api/infra/admin/adminUser/index'
   import { getUserProfile } from '@/api/infra/admin/adminUser';
import { data } from 'autoprefixer'
// import { log } from 'vxe-table'
   const { proxy } = getCurrentInstance() as ComponentInternalInstance;
   const { basic_ability_units } = toRefs<any>(proxy?.useDict('basic_ability_units'));
   const emits = defineEmits(['succeed'])
   const props = defineProps({
       strategy: String,
       groupOptions: Array,
   })
   const user = ref(JSON.parse(sessionStorage.getItem('userInfo')))
   // 共享型时使用组织置为 -
   watch(
       () => props.strategy,
       val => {
           if (val == 'share') {
               // states.formData.useBranchCompanyName = '-'
               states.formData.useBranchCompanyName = '全部组织'
           }
       },
   )
   const states = reactive({
       Nodes:[],
       dialogVisible: false,
       title: '',
       formData: {} as any,
       typeCodeStatus:false,
       qualificationsCode: false, // 标识是否有单位编码规则
       securityLevelStatus: false, // 标识公司是否启用密级
       updateType: '', // 区分新增、修改
       saveLoading: false,
       confidentialityLevelList:[], // 密级选项
       courseratingList: [], // 难度系数选项
       treeData: [{label:"1",value:"1"}], // 工种组选项
       factoryList:[{label:"1",value:"1"},{label:"2",value:"2"}],//制造厂下拉框
       statusList:[{label:"启用",value:"1"},{label:"停用",value:"0"}],//状态下拉框
       // abilityUnitList:toRefs<any>(proxy?.useDict('basic_ability_units')),//能力下拉框
     responsiblePerson:[],//部门下责任人
     tabActive:undefined,
     selectProcessList:[]as any,//选中所以数据
     selectNameList:[] as any,//选中名字
     selectIdList:[] as any,//选中id
     selectSection:[] as any,//选中工段

   })
   const formRef = ref()
   const noprocessNodesRef=ref()

   onMounted(async() => {

       // 只保留未停用的数据
       // states.courseratingList =[]
       getUser()
   })
//    /ips-ycw/erzhongprocess/route-point/list
   //人员查询
   const getUser=()=>{
    userApi.DeptAndUserTree([]).then(res=>{
      if(res.code===200){
      states.responsiblePerson=res.data
      }
    })
   }
   const onLoadProcess= async()=>{
    // 根据当前登录人获取路线点
    await routeApi.getAll({}).then(res=>{
        states.Nodes=res.data.map(item=>{
            return{
                ...item,
                disabled:false
            }
        });
      //states.selectProcessList=res.data;//缓存表
     })
   }
   const getRouteByUsers= async()=>{
     // 根据当前登录人获取路线点
     const companyId = user.value?.companyId || '';
     await routeApi.getRouteByUser(companyId).then(res=>{
       states.Nodes=res.data.map(item=>{
         return{
           ...item,
           disabled:false
         }
       });
       //states.selectProcessList=res.data;//缓存表
     })
   }
  //  const selectedNodes = ref([]); // 存储选中的节点（第二层）按顺序
   const handleCheckChange = (node, isChecked) => {
     let list = []//缓存数组
     let nameList = []
     let idList = []
     let sectionList=[]
     if (states.Nodes.length > 0) {
       states.Nodes.forEach(child => {
        if(child.id === states.formData.noprocessNodes){
            list.push(child)
             nameList.push(child.departmentName)
             idList.push(child.departmentId)
             sectionList.push(child.sectionId)
        }

       })
       states.formData.processNodes = list
         .map(n => n.nodeName)
         .join(';')
        console.log("list",list)
       // 更新节点ID字符串（分号分隔）
       states.formData.nodeIds = list
         .map(n => n.id)
         .join(';')
      states.formData.factoryId=list.map(n=>n.departmentName).join(",")
      states.formData.factoryName = list.map(n=>n.departmentName).join(",")
     } else {
       states.formData.processNodes = ''
       states.formData.nodeIds = ''
     }

    states.selectProcessList=list
    states.selectNameList=nameList
    states.selectIdList=idList
    states.selectSection=sectionList
   }

   // 新增数据
   const startAddData = () => {
      // onLoadProcess()
     getRouteByUsers()
      getLoginUser()
      states.formData = {}
       nextTick(()=>{
           states.title = '工作中心新增'
           states.dialogVisible = true
           states.updateType = 'add'
           states.formData.id = undefined
           states.formData.isOutsourced = 0
           states.formData.isKeyResources = 0
           states.formData.state='1'
         formRef.value?.resetFields()
       })
   }

   // 修改数据
   const startEditData = ( editData) => {
     onLoadProcess()
      states.formData = {}
     nextTick(()=>{
       states.title = '工作中心修改'
       states.updateType = 'edit'
       states.dialogVisible = true
       Object.assign(states.formData, editData);
       states.formData.isOutsourced = Number(editData.isOutsourced)
       states.formData.isKeyResources = Number(editData.isKeyResources)
       states.formData.responsiblePersonId = Number(editData.responsiblePersonId)
       states.formData.noprocessNodes = Number(editData.nodeIds)
     })
   }
   const getLoginUser = async () => {
    const res = await getUserProfile();
     };
  //  获取人员名称
   const findUserName = (tree, id) => {
  for (let node of tree) {
    if (node.id === id) {
      return node.name;
    } else if (node.children) {
      const result = findUserName(node.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
   // 保存方法
   const saveData = () => {
       formRef.value.validate(valid => {
          if (valid){
            states.saveLoading = true

            states.formData.responsiblePersonName = findUserName(states.responsiblePerson, states.formData.responsiblePersonId)
            const params: any = {
              ...states.formData,
              factoryName: states.selectNameList[0],
              factoryId:states.selectIdList[0],
              machiningSection:states.selectSection[0]
            }
            const method = states.updateType == 'edit' ? update : save
            method(params)
              .then(() => {
                E_Msg.newMessage('保存成功');
                states.dialogVisible = false
                emits('succeed')
                handleClose();
                states.saveLoading = false
              })
              .catch(() => {
                states.saveLoading = false
              })
          }
       })
   }

   const handleClose = () => {
       // states.isQualificationsNameCheckd = 0
     states.formData.abilityData=undefined
     formRef.value?.resetFields()
     states.dialogVisible = false
   }
   defineExpose({ startAddData, startEditData })
   </script>
   <style scoped lang="scss">
   .unit-convert-box {
       display: flex;
       .unit-convert-box_input_column {
           width: 150px;
           padding: 0 10px;
       }
       .unit-convert-box_star_column {
           width: 20px;
           padding: 0 10px;
       }
   }
   .collapse-style {
       height: calc(100vh - 370px);
       overflow-y: hidden;
       overflow-x: hidden;
   }
   </style>
