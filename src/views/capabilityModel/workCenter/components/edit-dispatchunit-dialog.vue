<template>
  <el-dialog v-model="dialogVisible" :title="title" width="80%" top="5vh" destroy-on-close @closed="resetForm">
    <div v-loading="states.loading">
      <!-- 上半部分：基本信息表单区 -->
      <div class="top-section">
        <div class="section-title">基本</div>

        <el-form ref="formRef" :model="formData" label-width="80px" label-position="top" class="standard-form">
          <!-- <div class="form-grid"> -->
          <el-row :gutter="32">
            <el-col :span="6">
              <el-form-item label="派工单元编码" prop="dispatchUnitCode" :rules="e_rule('required', '派工单元编码不能为空')" required>
                <el-input style="width: 100%" v-model="formData.dispatchUnitCode" placeholder="请输入编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="派工单元名称" prop="dispatchUnitName" :rules="e_rule('required', '派工单元名称不能为空')" required>
                <el-input style="width: 100%" v-model="formData.dispatchUnitName" placeholder="请输入名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产类型" prop="productionType" :rules="e_rule('required', '生产类型不能为空')" required>
                <el-select style="width: 100%" v-model="formData.productionType" placeholder="请选择" class="full-width">
                  <!--              <el-option label="机加" value="machining" />-->
                  <!--              <el-option label="装配" value="assembly" />-->
                  <!--              <el-option label="热处理" value="heat" />-->
                  <el-option v-for="item in production_type" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属工作中心" prop="workCenterName" :rules="e_rule('required', '所属工作中心不能为空')" required>
                <el-input style="width: 100%" v-model="formData.workCenterName" :placeholder="'请输入名称'" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属制造厂" prop="factoryName" :rules="e_rule('required', '所属制造厂不能为空')" required>
                <el-input style="width: 100%" disabled v-model="formData.factoryName" :placeholder="'请输入名称'" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="所属工段" prop="sectionName" >
              <el-input disabled v-model="formData.sectionName" :placeholder="'请输入名称'" clearable />
              <!-- <el-select style="width: 100%;" v-model="formData.sectionName" multiple disabled clearable placeholder="请选择"
                filterable>
                <el-option v-for="item in ips_belonging_section" :key="item.value" :value="item.value"
                  :label="item.label"></el-option>
              </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联工序" prop="relatedProcessesIds" :rules="e_rule('required', '关联工序不能为空')">
                <!-- <el-input disabled v-model="formData.machiningSection" :placeholder="'请输入名称'" clearable /> -->
                <el-select
                  style="width: 100%"
                  v-model="formData.relatedProcessesIds"
                  multiple
                  clearable
                  placeholder="请选择"
                  filterable
                  @change="handleProcessesChange"
                >
                  <el-option v-for="item in basic_related_processes" :key="item.id" :value="item.id" :label="item.processName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="班制" prop="shifts" :rules="e_rule('required', '班制不能为空')" required>
                <el-select style="width: 100%" v-model="formData.shifts" placeholder="请选择" class="full-width">
                  <!--              <el-option label="0001班制1-1" value="shift1" />-->
                  <!--              <el-option label="0002班制1-2" value="shift2" />-->
                  <el-option v-for="item in shiftSystemList" :key="item.id" :label="item.shiftSystemName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
                            <el-form-item label="班次" prop="shift" :rules="e_rule('required', '班次不能为空')" required>
                                <el-select style="width: 100%;" v-model="formData.shift" placeholder="请选择"
                                    class="full-width">
                                    <el-option v-for="item in rotationCodeList" :key="item.id" :label="item.rotationName"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col> -->
            <el-col :span="6">
              <el-form-item label="是否为外协" prop="isOutsourced" :rules="e_rule('required', '是否为外协不能为空')" required>
                <el-radio-group v-model="formData.isOutsourced">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否为关键资源" prop="isKeyResources" :rules="e_rule('required', '是否为关键资源不能为空')" required>
                <el-radio-group v-model="formData.isKeyResources">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="能力单位" prop="abilityUnitsId" :rules="e_rule('required', '能力单位不能为空')" required>
                <el-select v-model="formData.abilityUnitsId" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in basic_ability_units" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <!--            <el-input v-model="formData.abilityUnitsId" placeholder="请输入" />-->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="能力值" prop="abilityData" :rules="e_rule('required', '能力值不能为空')" required>
                <el-input style="width: 100%" v-model="formData.abilityData" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="负责人" prop="responsiblePersonName">
                <el-input style="width: 100%" v-model="formData.responsiblePersonName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="能力类型" prop="abilityType">
                <el-input style="width: 100%" v-model="formData.abilityType" readonly disabled placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="20">
              <el-form-item label="备注" prop="remark" class="full-row">
                <el-input style="width: 100%" v-model="formData.remark" type="textarea" :rows="1" placeholder="请输入备注信息" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- </div> -->
        </el-form>
      </div>

      <!-- 下半部分：左右分区子信息区 -->
      <div class="bottom-section">
        <div class="section-title">派工单元信息</div>
        <div class="sub-info-container">
          <!-- 左侧主表区域 -->
          <div class="master-table-area">
            <div class="table-header">
              <div class="hint-container">
                <!--              <div class="hint-text">点击左侧主表行，右侧子表展示下挂资源</div>-->
                <!--              <div class="hint-text">可多选，多选后右侧子表显示所选项下挂资源</div>-->
                <!--              <div class="hint-text">不选时，子表显示所有下挂资源</div>-->
              </div>
              <div class="action-buttons">
                <el-button type="primary" size="small" @click="addMainResource">新增</el-button>
                <el-button type="danger" size="small" plain @click="deleteMainResource" :disabled="selectedMainRows.length === 0">删除</el-button>
              </div>
            </div>

            <el-table
              ref="masterTableRef"
              @selection-change="handleMainSelectionChange"
              @row-click="handleMainRowClick"
              :data="mainResources"
              highlight-current-row
              border
              height="300px"
              size="small"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="resourceCategory" label="资源类别" min-width="120">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>资源类别</template>
                <template #default="{ row }">
                  <el-select v-model="row.resourceCategory" placeholder="请选择" class="full-width">
                    <el-option v-for="item in resource_category" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="isPrimaryResource" label="是否主资源" min-width="100">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>是否主资源</template>
                <template #default="{ row }">
                  <el-select v-model="row.isPrimaryResource" placeholder="请选择">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="isScheduling" label="是否参与排程" min-width="120">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>是否参与排程</template>
                <template #default="{ row }">
                  <el-select v-model="row.isScheduling" placeholder="请选择">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="usedQuantity" label="使用数量" min-width="100" align="center">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>使用数量</template>
                <template #default="{ row }">
                  <el-input-number v-model="row.usedQuantity" :min="1" controls-position="right" style="width: 80px" />
                </template>
              </el-table-column>
              <el-table-column prop="usedUnits" label="使用单位" min-width="100">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>使用单位</template>
                <template #default="{ row }">
                  <el-select v-model="row.usedUnits" placeholder="请选择">
                    <el-option v-for="item in use_units" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="efficiency" label="效率" min-width="80" align="center">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>效率</template>
                <template #default="{ row }">
                  <el-input-number v-model="row.efficiency" :min="0" :precision="0" controls-position="right" style="width: 70px" />
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="140">
                <template #default="{ row }">
                  <el-input v-model="row.remark" placeholder="请输入" />
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 右侧子表区域 -->
          <div class="detail-table-area">
            <div class="table-header">
              <div class="hint-container">
                <!--              <div class="hint-text">当前显示资源数量: {{ subResources.length }}</div>-->
                <!--              <div class="hint-text">来自 {{ selectedMainRowsCount }} 个主表资源</div>-->
              </div>
              <div class="action-buttons">
                <el-button type="primary" size="small" :disabled="!currentClickedRow && selectedMainRows.length === 0" @click="addSubResource"
                  >新增</el-button
                >
                <el-button type="danger" size="small" plain @click="deleteSubResource" :disabled="selectedSubRows.length === 0">删除</el-button>
              </div>
            </div>

            <el-table :data="subResources" @selection-change="handleSubRowSelectionChange" border height="300px" size="small">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="resourceCategory" label="资源类别" width="110">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>资源类别</template>
                <template #default="{ row }">
                  <el-select
                    v-model="row.resourceCategory"
                    placeholder="请选择"
                    class="full-width"
                    @change="
                      (val) => {
                        changeCategory(val, row);
                      }
                    "
                  >
                    <el-option v-for="item in resource_category" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="resourceCode" label="类别/机型编码">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>类别/机型编码</template>
                <template #default="{ row }">
                  <el-tree-select
                    v-if="row.resourceCategory === 'personnel'"
                    ref="responsNodesRef"
                    @change="(val) => handleTree(val, row, 'resourceCode')"
                    v-model="row.resourceCode"
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
                  <el-tree-select
                    v-else
                    ref="responsNodesRef"
                    @change="(val) => handleTree(val, row, 'resourceCode')"
                    v-model="row.resourceCode"
                    :data="states.treeData"
                    value-key="typeCode"
                    :props="{ label: 'typeCode', children: 'children' }"
                    clearable
                    filterable
                    default-expand-all
                    check-strictly
                    :render-after-expand="false"
                  >
                  </el-tree-select>
                </template>
              </el-table-column>
              <el-table-column prop="resourceCategorySubsetCode" label="资源编码">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>资源编码</template>
                <template #default="{ row }">
                  <el-select
                    v-model="row.resourceCategorySubsetCode"
                    filterable
                    placeholder="请选择"
                    class="full-width"
                    :disabled="row.resourceCategory === 'personnel'"
                    @visible-change="val=>{visibleResourceCategory(val,row)}"
                    @change="
                      (val) => {
                        handleCodeChange(val, 'resourceCategorySubsetCode', row);
                      }
                    "
                  >
                    <el-option v-for="item in row.accountList" :key="item.accountCode" :label="item.accountName" :value="item.accountCode" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="dispatchUnitResourceConfigDTOS" label="能力">
                <template #default="{ row }">
                  <el-button type="primary" @click="handleConfiguration(row)">配置</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template #default="{ row }">
                  <el-input v-model="row.remark" placeholder="请输入" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="saveData">保存</el-button>
    </template>
  </el-dialog>

  <editConfigurationDialog ref="editConfigurationRef" @success="assignment"></editConfigurationDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue';
import type { ElTable } from 'element-plus';
import { e_rule } from '@/utils/require-rule/index';
import { addDispatchunit, addGetSpecs, getOneByWorkCenterId, getUnitResouceListBySonId, updateUnit } from '@/api/basic/work-center-api';
import { E_Msg } from '@/utils/message';
import RotationDescApi from '@/api/basic/rotation-desc-api';
import routeApi from '@/api/ips/basicData/route-api';
import shiftSystemApi from '@/api/basic/shift-system-api';
import { config } from 'vue-types';
import editConfigurationDialog from './edit-configuration-dialog.vue';
import EqpAccountApi from '@/api/basic/eqp-account-api';
import userApi from '@/api/infra/admin/adminUser/index';
import EqpTypeApi from '@/api/basic/eqp-type-api';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { basic_ability_units } = toRefs<any>(proxy?.useDict('basic_ability_units')); //能力单位
const { production_type } = toRefs<any>(proxy?.useDict('production_type')); //生产类型
const { resource_category } = toRefs<any>(proxy?.useDict('resource_category')); //资源类别
const { use_units, ips_belonging_section } = toRefs<any>(proxy?.useDict('use_units', 'ips_belonging_section')); //使用单位
const emits = defineEmits(['successUnit']);
const editConfigurationRef = ref();
const saveLoading = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const masterTableRef = ref<InstanceType<typeof ElTable>>();
const formData = reactive({
  id: undefined,
  dispatchUnitCode: undefined,
  dispatchUnitName: undefined,
  productionType: undefined,
  machiningSection: undefined,
  sectionName: undefined,
  shifts: undefined,
  shift: undefined,
  abilityData: undefined,
  responsiblePersonName: undefined,
  remark: undefined,
  abilityType: undefined,
  abilityUnitsId: undefined,
  isOutsourced: undefined,
  isKeyResources: undefined,
  workCenterName: undefined,
  factoryName: undefined,
  factoryId: undefined,
  workCenterId: undefined,
  relatedProcessesIds: undefined
});
const states = reactive({
  depList: [],
  accountList: [],
  responsiblePerson: [],
  loading: false,
  treeData: []
});
const processNameList = ref([]);
const basic_related_processes = ref([]);
// 资源类型选项
const resourceTypes = [
  { label: '设备', value: 'equipment' },
  { label: '人员', value: 'personnel' },
  { label: '工装', value: 'fixture' },
  { label: '工具', value: 'tool' },
  { label: '厂房位置', value: 'location' },
  { label: '刀具', value: 'cutter' }
];

// 主表数据
const mainResources = ref<any[]>([]);
// 选中的主表行
const selectedMainRows = ref<any[]>([]);
// 当前点击的主表行
const currentClickedRow = ref<any>(null);
// 所有子表数据集合
const allGrandsonResources = ref<any[]>([]);
// 当前显示的子表数据
const subResources = ref<any[]>([]);
// 选中的子表行
const selectedSubRows = ref<any[]>([]);
const pid = ref();

// 计算选中的主表行数量
const selectedMainRowsCount = computed(() => selectedMainRows.value.length);

// 弹窗标题
const title = computed(() => (formData.id ? '编辑派工单元' : '新建派工单元'));

const handleConfiguration = (row) => {
  editConfigurationRef.value.startAddData(row);
  // if(formData.id){
  //   editConfigurationRef.value.startEditData(row,'edit')
  // }else{
  //   editConfigurationRef.value.startAddData(row)
  // }
};
const assignment = (row, id) => {
  subResources.value.forEach((element) => {
    if (element.id === id) {
      element.dispatchUnitResourceConfigDTOS = row;
    }
  });
};

const handleProcessesChange = (value: any) => {
  let nameList = [];
  value.forEach((one) => {
    let fdata = basic_related_processes.value.find((f) => f.id === one);
    if (fdata) {
      nameList.push(fdata.processName);
    }
  });
  processNameList.value = nameList;
};
const refreshData = () => {
  formData.id = undefined;
  formData.dispatchUnitCode = undefined;
  formData.dispatchUnitName = undefined;
  formData.productionType = undefined;
  formData.machiningSection = undefined;
  formData.shifts = undefined;
  formData.shift = undefined;
  formData.abilityData = undefined;
  formData.responsiblePersonName = undefined;
  formData.remark = undefined;
  formData.abilityType = undefined;
  formData.abilityUnitsId = undefined;
  formData.isOutsourced = undefined;
  formData.isKeyResources = undefined;
  formData.workCenterName = undefined;
  formData.factoryName = undefined;
  formData.factoryId = undefined;
  formData.workCenterId = undefined;
  formData.relatedProcessesIds = undefined;
};
// 暴露打开弹窗的方法
const openDialog = (data: any) => {
  refreshData();
  dialogVisible.value = true;
  pid.value = data.pid;
  formData.abilityType = '细能力';
  eqpTypeAndModel();
  //   getAccount()

  // 先加载人员数据，然后再处理其他逻辑
  getUser().then(() => {
    if (data) {
      Object.assign(formData, data);
      if (data.id) {
        states.loading = true;
        getOneByWorkCenterId(data)
          .then((res) => {
            //回显派工单元数据
            Object.assign(formData, res.data.basicDispatchUnitMainVo);
            formData.isOutsourced = Number(res.data.basicDispatchUnitMainVo.isOutsourced);
            formData.isKeyResources = Number(res.data.basicDispatchUnitMainVo.isKeyResources);
            //回显工作中心数据
            formData.workCenterName = res.data.basicWorkCenterVo.workCenterName;
            formData.factoryName = res.data.basicWorkCenterVo.factoryName;
            formData.sectionName = res.data.basicWorkCenterVo.sectionName;
            formData.factoryId = res.data.basicWorkCenterVo.factoryId;
            mainResources.value = res.data.basicDispatchUnitResourceMainVos || [];
            basic_related_processes.value = res.data.basicWorkCenterVo.processInformationListResultList || [];
            // 收集所有左下角数据中的basicDispatchUnitResourceSonVoList
            allGrandsonResources.value = [];
            mainResources.value.forEach((mainRow) => {
              // 将basicDispatchUnitResourceSonVoList数据挂载到主表行的children属性上
              mainRow.children = mainRow.basicDispatchUnitResourceSonVoList || [];
              // 收集所有子表数据到allGrandsonResources
              if (mainRow.basicDispatchUnitResourceSonVoList && mainRow.basicDispatchUnitResourceSonVoList.length > 0) {
                allGrandsonResources.value.push(
                  ...mainRow.basicDispatchUnitResourceSonVoList.map((item) => {
                    const mappedItem = {
                      ...item,
                      dispatchUnitSonId: mainRow.id, // 设置关联的主表ID
                      resourceCode: item.resourceCategory == 'personnel' ? Number(item.resourceCode) : item.resourceCode,
                      accountList: [
                        {
                          accountCode:
                            item.resourceCategory == 'personnel' ? Number(item.resourceCategorySubsetCode) : item.resourceCategorySubsetCode,
                          accountName: item.resourceCategorySubsetName
                        }
                      ]
                    };
                    return mappedItem;
                  })
                );
              }
            });

            // 页面初始化时右下角展示所有左下角数据中的basicDispatchUnitResourceSonVoList
            subResources.value = [...allGrandsonResources.value];
          })
          .finally(() => {
            states.loading = false;
          });
      } else {
        let fromData = { id: data.pid };
        addGetSpecs(fromData).then((res) => {
          basic_related_processes.value = res.data || [];
        });
        // 新建模式初始化
        mainResources.value = [];
        allGrandsonResources.value = [];
        subResources.value = [];
        formData.isOutsourced = Number(0);
        formData.isKeyResources = Number(0);
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  mainResources.value = [];
  allGrandsonResources.value = [];
  subResources.value = [];
  selectedMainRows.value = [];
  selectedSubRows.value = [];
  currentClickedRow.value = null;
};
//班次
const rotationCodeList = ref([]);
const shiftSystemList = ref([]);
onMounted(() => {
  RotationDescApi.list({}).then((res) => {
    if (res.code == 0) {
      rotationCodeList.value = res.data;
    }
  });
  shiftSystemApi.list({}).then((res) => {
    if (res.code == 0) {
      shiftSystemList.value = res.data;
    }
  });
});
/**
 * 获取设备
 */
const eqpTypeAndModel = () => {
  // states.treeData = [{ isEqpType: '是', id: null, name: '设备类别', children: [] }]
  EqpTypeApi.eqpTypeAndModel({ typeName: '' }).then((res) => {
    // 移除 disabled 属性后再赋值
    const cleanData = removeDisabledProperty(res.data);
    states.treeData = cleanData;
  });
};
/**
 * 移除树形数据中的 disabled 属性
 */
const removeDisabledProperty = (treeData) => {
  return treeData.map((node) => {
    const newNode = { ...node };
    // 删除 disabled 属性
    delete newNode.disabled;

    // 递归处理子节点
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = removeDisabledProperty(newNode.children);
    }

    return newNode;
  });
};
const getAccount = (val, row) => {
  EqpAccountApi.listPage({
    pageNumber: -1,
    pageSize: -1,
    eqpTypeId: val
  }).then((res) => {
    row.accountList = res.data.records.map((item) => {
      if(item.accountCode){
        let itmes = {...item,accountCode: item.id}
        return itmes;
      }
    });
  });
};
const visibleResourceCategory = (val, row) => {
  if (val) {
    // 从设备树中查找选中的节点信息
    const selectedNode = findNodeById(states.treeData, row.resourceCode);
    if (selectedNode) {
      row.resourceName = selectedNode.typeName || selectedNode.typeCode;
      // 获取对应的设备台账数据
      getAccount(selectedNode.id, row);
    }
  }
};
/**
 * 资源类别切换
 */
const changeCategory = (val, row) => {
  // 清空相关字段
  row.resourceCategorySubsetCode = '';
  row.categoryName = '';
  row.resourceName = '';
  row.resourceCode = '';
  row.accountList = [];

  // 如果选择的是设备类别，需要重新加载设备树数据
  if (val === 'equipment') {
    // 设备类别已经在组件初始化时加载了设备树数据
    // 这里不需要额外操作，用户可以在资源编码下拉框中选择
  } else if (val === 'personnel') {
    // 人员类别已经在组件初始化时加载了人员树数据
    // 这里不需要额外操作
  }
};

//人员查询
const getUser = () => {
  return new Promise((resolve, reject) => {
    userApi
      .DeptAndUserTree([])
      .then((res) => {
        if (res.code === 200) {
          states.responsiblePerson = res.data;
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * 处理选择的值
 */
const handleCodeChange = (val, code, row) => {
  if (val) {
    if (code === 'resourceCategorySubsetCode') {
      row.resourceCategorySubsetCode = val; // 设置选中的代码值
      row.categoryName = row.accountList.find((item) => item.accountCode === val)?.accountName || '';
      row.resourceCategorySubsetName = row.accountList.find((item) => item.accountCode === val)?.accountName || '';
    } else if (code === 'resourceCode') {
      row.resourceCode = val; // 设置选中的代码值
      row.resourceName = row.accountList.find((item) => item.assetCode === val)?.assetName || '';
    }
  } else {
    if (code === 'resourceCategorySubsetCode') {
      row.resourceCategorySubsetCode = '';
      row.categoryName = '';
      row.resourceCategorySubsetName = '';
    } else if (code === 'resourceCode') {
      row.resourceCode = '';
      row.resourceName = '';
    }
  }

  // 同步数据到主表的basicDispatchUnitResourceSonVoList中
  syncSubResourceToMainResource(row);
};
/**
 * 树结构处理
 */
const handleTree = (val, row, code) => {
  if (val) {
    if (code === 'resourceCode') {
      row.resourceCode = val; // 设置选中的代码值
      if (row.resourceCategory === 'personnel') {
        // 尝试将val转换为字符串或数字进行匹配
        const convertedVal = isNaN(val) ? val : Number(val);
        row.resourceName =
          findNameById(states.responsiblePerson, convertedVal, 'name') || findNameById(states.responsiblePerson, String(val), 'name');
      } else {
        // 从设备树中查找选中的节点信息
        const selectedNode = findNodeById(states.treeData, val);
        if (selectedNode) {
          row.resourceName = selectedNode.typeName || selectedNode.typeCode;
          // 清空之前的设备台账数据
          row.resourceCategorySubsetCode = '';
          row.categoryName = '';
          row.accountList = [];
          // 获取对应的设备台账数据
          getAccount(selectedNode.id, row);
        }
      }
    }
  } else {
    if (code === 'resourceCode') {
      row.resourceCode = '';
      row.resourceName = '';
      row.resourceCategorySubsetCode = '';
      row.categoryName = '';
      row.accountList = [];
    }
  }

  // 同步数据到主表的basicDispatchUnitResourceSonVoList中
  syncSubResourceToMainResource(row);
};
const findNameById = (tree, id, key) => {
  for (let node of tree) {
    // 支持不同类型的ID比较（字符串和数字）
    if (node.id === id || node.id == id || String(node.id) === String(id) || Number(node.id) === Number(id)) {
      return node[key]; // 找到匹配的id，返回name
    } else if (node.children && node.children.length > 0) {
      // 如果有子节点，递归查找
      const result = findNameById(node.children, id, key);
      if (result) {
        return result; // 在子节点中找到，返回name
      }
    }
  }
  return null; // 未找到，返回null或抛出错误等，根据需要处理
};

/**
 * 根据typeCode查找树节点
 */
const findNodeById = (tree, typeCode) => {
  for (let node of tree) {
    if (node.typeCode === typeCode) {
      return node; // 找到匹配的typeCode，返回整个节点
    } else if (node.children && node.children.length > 0) {
      const result = findNodeById(node.children, typeCode);
      if (result) {
        return result; // 在子节点中找到，返回节点
      }
    }
  }
  return null; // 未找到，返回null
};

// 同步子表数据到主表的basicDispatchUnitResourceSonVoList中
const syncSubResourceToMainResource = (subRow) => {
  // 找到当前点击的主表行或选中的主表行
  let targetMainRow = currentClickedRow.value;
  if (!targetMainRow && selectedMainRows.value.length === 1) {
    targetMainRow = selectedMainRows.value[0];
  }

  if (targetMainRow && targetMainRow.basicDispatchUnitResourceSonVoList) {
    // 查找当前编辑的子表行在subResources中的索引
    const subRowIndex = subResources.value.findIndex((row) => row === subRow);

    if (subRowIndex !== -1 && targetMainRow.basicDispatchUnitResourceSonVoList[subRowIndex]) {
      // 同步数据到主表的basicDispatchUnitResourceSonVoList中
      const targetSubRow = targetMainRow.basicDispatchUnitResourceSonVoList[subRowIndex];
      targetSubRow.resourceCategory = subRow.resourceCategory;
      targetSubRow.resourceCategorySubsetCode = subRow.resourceCategorySubsetCode;
      targetSubRow.categoryName = subRow.categoryName;
      targetSubRow.resourceCategorySubsetName = subRow.resourceCategorySubsetName;
      targetSubRow.resourceCode = subRow.resourceCode;
      targetSubRow.resourceName = subRow.resourceName;
      targetSubRow.remark = subRow.remark;
      targetSubRow.accountList = subRow.accountList;

      // 同步到allGrandsonResources中
      const allIndex = allGrandsonResources.value.findIndex((row) => row.dispatchUnitSonId === targetSubRow.dispatchUnitSonId);
      if (allIndex !== -1) {
        Object.assign(allGrandsonResources.value[allIndex], targetSubRow);
      }
    }
  }
};
// 处理主表行选择变化
const handleMainSelectionChange = (selection: any[]) => {
  selectedMainRows.value = selection;
  updateSubResources();
};

// 处理主表行点击
const handleMainRowClick = (row: any) => {
  // 设置当前点击的行
  currentClickedRow.value = row;
  // 直接展示该行的子表数据
  updateSubResourcesForClickedRow(row);
};

// 更新右侧子表数据（点击行时）
const updateSubResourcesForClickedRow = (row: any) => {
  if (row && row.basicDispatchUnitResourceSonVoList && row.basicDispatchUnitResourceSonVoList.length > 0) {
    subResources.value = row.basicDispatchUnitResourceSonVoList.map((item) => ({
      ...item,
      dispatchUnitSonId: row.id, // 设置关联的主表ID
      // 保持原有的 accountList，如果不存在则初始化
      accountList: item.accountList || [
        {
          accountCode: item.resourceCategory == 'personnel' ? Number(item.resourceCategorySubsetCode) : item.resourceCategorySubsetCode,
          accountName: item.resourceCategorySubsetName
        }
      ]
    }));
  } else {
    subResources.value = [];
  }
};

// 更新右侧子表数据
const updateSubResources = () => {
  if (selectedMainRows.value.length === 0) {
    // 没有选中任何主表行，显示所有子表数据
    subResources.value = [...allGrandsonResources.value];
  } else {
    // 合并所有选中主表行的basicDispatchUnitResourceSonVoList数据
    const selectedGrandsonResources: any[] = [];
    selectedMainRows.value.forEach((mainRow) => {
      if (mainRow.basicDispatchUnitResourceSonVoList && mainRow.basicDispatchUnitResourceSonVoList.length) {
        selectedGrandsonResources.push(
          ...mainRow.basicDispatchUnitResourceSonVoList.map((item) => {
            const mappedItem = {
              ...item,
              dispatchUnitSonId: mainRow.id, // 设置关联的主表ID
              // 保持原有的 accountList，如果不存在则初始化
              accountList: item.accountList || [
                {
                  accountCode: item.resourceCategory == 'personnel' ? Number(item.resourceCategorySubsetCode) : item.resourceCategorySubsetCode,
                  accountName: item.resourceCategorySubsetName
                }
              ]
            };

            // 如果是人员类型且resourceName为空，尝试从responsiblePerson中获取名称
            if (item.resourceCategory === 'personnel' && !item.resourceName && item.resourceCode) {
              const foundName = findNameById(states.responsiblePerson, item.resourceCode, 'name');
              mappedItem.resourceName = foundName;
            }

            return mappedItem;
          })
        );
      }
    });

    subResources.value = selectedGrandsonResources;
  }
};

// 处理子表行选择变化
const handleSubRowSelectionChange = (selection: any[]) => {
  selectedSubRows.value = selection;
};

// 生成安全的随机整数（在Integer范围内）
function getSafeRandomId() {
  const MIN = 100000;
  const MAX = 2147483647;
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

// 添加主表资源
const addMainResource = () => {
  const newMainResource = {
    id: getSafeRandomId(),
    resourceCategory: '',
    isPrimaryResource: '1',
    isScheduling: '1',
    usedQuantity: 1,
    usedUnits: '',
    efficiency: null,
    remark: '',
    children: [], // 初始化子表数据
    basicDispatchUnitResourceSonVoList: [] // 初始化子表数据列表
  };

  mainResources.value.push(newMainResource);

  // 选中新添加的行
  nextTick(() => {
    masterTableRef.value?.toggleRowSelection(newMainResource, true);
  });
};

// 删除主表资源
const deleteMainResource = () => {
  if (selectedMainRows.value.length === 0) return;
  E_Msg.confirm('删除确认', `确定要删除选中的 ${selectedMainRows.value.length} 个资源吗?`).then(() => {
    // 获取选中资源的ID集合
    const selectedIds = selectedMainRows.value.map((r) => r.id);

    // 从所有子表数据中删除关联项
    allGrandsonResources.value = allGrandsonResources.value.filter((sub) => !selectedIds.includes(sub.dispatchUnitSonId));

    // 过滤掉选中的主表行
    mainResources.value = mainResources.value.filter((resource) => !selectedIds.includes(resource.id));

    // 清空选择
    selectedMainRows.value = [];

    // 更新消息
    E_Msg.newMessage(`已成功删除 ${selectedIds.length} 个资源`);

    // 更新子表显示
    updateSubResources();
  });
};

// 添加子表资源
const addSubResource = () => {
  // 优先使用当前点击的行，如果没有则使用选中的行
  let targetRow = currentClickedRow.value;
  if (!targetRow && selectedMainRows.value.length === 1) {
    targetRow = selectedMainRows.value[0];
  }
  if (!targetRow) return;

  targetRow.serialNumber = targetRow.id;
  const newSubResource = {
    id: getSafeRandomId(),
    dispatchUnitSonId: targetRow.id, // 关联主表ID
    resourceCategory: '',
    resourceCategorySubsetCode: '',
    categoryName: '',
    resourceCode: '',
    resourceName: '',
    remark: '',
    dispatchUnitResourceConfigDTOS: [], // 确保每个对象都有独立的数组
    accountList: [] // 确保每个对象都有独立的数组
  };

  // 添加到主表行的basicDispatchUnitResourceSonVoList中
  if (!targetRow.basicDispatchUnitResourceSonVoList) {
    targetRow.basicDispatchUnitResourceSonVoList = [];
  }
  targetRow.basicDispatchUnitResourceSonVoList.push(newSubResource);

  // 更新children引用
  targetRow.children = targetRow.basicDispatchUnitResourceSonVoList;

  // 添加到所有子表数据集合
  allGrandsonResources.value.push(newSubResource);

  // 如果当前有点击的行，直接将新数据添加到右侧显示
  if (currentClickedRow.value) {
    // 直接添加到当前显示的子表数据中，避免重新构建导致数据丢失
    subResources.value.push({
      ...newSubResource,
      dispatchUnitSonId: currentClickedRow.value.id
    });
  } else {
    // 否则使用原有逻辑
    updateSubResources();
  }
};

// 删除子表资源
const deleteSubResource = () => {
  if (selectedSubRows.value.length === 0) return;
  E_Msg.confirm('删除确认', `确定要删除选中的 ${selectedSubRows.value.length} 个资源吗?`).then(() => {
    // 获取选中资源的ID集合
    const selectedIds = selectedSubRows.value.map((r) => r.id);

    // 从所有主表行的basicDispatchUnitResourceSonVoList中删除
    mainResources.value.forEach((mainRow) => {
      if (mainRow.basicDispatchUnitResourceSonVoList) {
        mainRow.basicDispatchUnitResourceSonVoList = mainRow.basicDispatchUnitResourceSonVoList.filter((sub) => !selectedIds.includes(sub.id));
        // 更新children引用
        mainRow.children = mainRow.basicDispatchUnitResourceSonVoList;
      }
    });

    // 从所有子表数据集合中删除
    allGrandsonResources.value = allGrandsonResources.value.filter((sub) => !selectedIds.includes(sub.id));

    // 从当前显示的子表中删除
    subResources.value = subResources.value.filter((sub) => !selectedIds.includes(sub.id));

    // 清空选择
    selectedSubRows.value = [];

    // 更新消息
    E_Msg.newMessage(`已成功删除 ${selectedIds.length} 个资源`);

    // 如果当前有点击的行，直接更新该行的子表显示
    if (currentClickedRow.value) {
      updateSubResourcesForClickedRow(currentClickedRow.value);
    } else {
      // 否则使用原有逻辑
      updateSubResources();
    }
  });
};

// 保存数据
const saveData = async () => {
  if (!formRef.value) return;

  try {
    // 验证表单
    await formRef.value?.validate();

    saveLoading.value = true;
    
    // 在保存前同步右侧子表数据到主资源数据中
    if (currentClickedRow.value) {
      // 将当前右侧显示的子表数据同步到对应主资源的basicDispatchUnitResourceSonVoList中
      const clickedRowIndex = mainResources.value.findIndex(item => item.id === currentClickedRow.value.id);
      if (clickedRowIndex !== -1) {
        // 创建新的子资源数组副本
        const updatedSonList = subResources.value.map(item => ({ ...item }));
        mainResources.value[clickedRowIndex].basicDispatchUnitResourceSonVoList = updatedSonList;
      }
    }
    // 新增：同步所有主表行的子表数据，确保数据一致性
    else if (selectedMainRows.value.length > 0) {
      selectedMainRows.value.forEach(selectedRow => {
        const selectedIndex = mainResources.value.findIndex(item => item.id === selectedRow.id);
        if (selectedIndex !== -1) {
          const subResourceForThisRow = subResources.value.filter(
            subItem => subItem.dispatchUnitSonId === selectedRow.id
          );
          mainResources.value[selectedIndex].basicDispatchUnitResourceSonVoList = [...subResourceForThisRow];
        }
      });
    }
    // 新增：如果没有选中任何行但仍存在子资源数据，需要同步所有数据
    else {
      // 遍历所有主表行，同步其对应的子表数据
      mainResources.value.forEach(mainRow => {
        const subResourceForThisRow = subResources.value.filter(
          subItem => subItem.dispatchUnitSonId === mainRow.id
        );
        if (subResourceForThisRow.length > 0) {
          mainRow.basicDispatchUnitResourceSonVoList = [...subResourceForThisRow];
        }
      });
    }

    if (formData.id) {
      // 深拷贝数据，避免影响原始数据
      const saveFormData = { ...formData, relatedProcessesNames: processNameList.value };
      const saveMainResources = mainResources.value.map((item) => {
        const mainItem = { ...item };
        // 将子表数据放在主表对象的basicDispatchUnitResourceSonDTOs字段中
        if (mainItem.basicDispatchUnitResourceSonVoList) {
          mainItem.basicDispatchUnitResourceSonDTOs = mainItem.basicDispatchUnitResourceSonVoList.map((subItem) => {
            const sonItem = { ...subItem };
            delete sonItem.id;
            return sonItem;
          });
          // 删除原来的字段
          delete mainItem.basicDispatchUnitResourceSonVoList;
          delete mainItem.children;
        }
        delete mainItem.id;
        return mainItem;
      });

      // 准备保存数据
      const updateData = {
        basicDispatchUnitMainDTO: saveFormData,
        basicDispatchUnitResourceMainDTOs: saveMainResources
      };
      
      await addDispatchunit(updateData);
    } else {
      formData.workCenterId = pid.value;
      // 深拷贝数据，避免影响原始数据
      const saveFormData = { ...formData, relatedProcessesNames: processNameList.value };
      const saveMainResources = mainResources.value.map((item) => {
        const mainItem = { ...item };
        // 将子表数据放在主表对象的basicDispatchUnitResourceSonDTOs字段中
        if (mainItem.basicDispatchUnitResourceSonVoList) {
          mainItem.basicDispatchUnitResourceSonDTOs = mainItem.basicDispatchUnitResourceSonVoList.map((subItem) => {
            const sonItem = { ...subItem };
            delete sonItem.id;
            return sonItem;
          });
          // 删除原来的字段
          delete mainItem.basicDispatchUnitResourceSonVoList;
          delete mainItem.children;
        }
        delete mainItem.id;
        return mainItem;
      });

      // 清空所有id
      delete saveFormData.id; // 删除主表DTO的id

      // 准备保存数据
      const saveData = {
        basicDispatchUnitMainDTO: saveFormData,
        basicDispatchUnitResourceMainDTOs: saveMainResources
      };

      // 调用API保存
      await addDispatchunit(saveData);
    }
    E_Msg.newMessage('保存成功');
    dialogVisible.value = false;
    emits('successUnit');
  } catch (error) {
    console.error('保存失败:', error);
    E_Msg.confirm(error instanceof Error ? error.message : '保存失败，请检查数据');
  } finally {
    saveLoading.value = false;
  }
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 暴露给父组件的方法
defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>
.top-section {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.bottom-section {
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #1d2c4f;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.full-row {
  grid-column: 1 / -1;
}

.status-container {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.sub-info-container {
  display: flex;
  gap: 20px;
  height: 400px;
}

.master-table-area,
.detail-table-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 50%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hint-container {
  display: flex;
  flex-direction: column;
}

.hint-text {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 0px;
}

.el-table {
  flex: 1;
}

.full-width {
  width: 100%;
}
</style>
