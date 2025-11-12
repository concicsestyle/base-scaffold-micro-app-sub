<template>
  <el-card class="bt-view__card--layout-full tree-card" :body-style="{ flex: '1' }">
    <el-tabs v-model="states.activeName" stretch @tab-change="handleChange">
      <el-tab-pane label="设备类别" name="type"></el-tab-pane>
      <el-tab-pane label="部门" name="useOrgId"></el-tab-pane>
      <el-tab-pane label="位置" name="plantLocationId"></el-tab-pane>
    </el-tabs>
    <el-input v-model.trim="states.name" placeholder="请输入" clearable @clear="init" @keyup.enter="search">
      <template #suffix>
        <el-icon style="cursor: pointer" color="#A5B3CF" @click="search">
          <Search></Search>
        </el-icon>
      </template>
    </el-input>
    <el-scrollbar class="scrollbar">
      <el-tree
        ref="elTreeRef"
        v-show="states.activeName != 'useOrgId'"
        :data="states.treeData"
        highlight-current
        :node-key="states.activeName == 'useOrgId' ? 'dictCode' : 'id'"
        :expand-on-click-node="false"
        :props="{ label: states.activeName == 'useOrgId' ? 'label' : 'typeName', children: 'children' }"
        default-expand-all
        class="tree-class standard-tree"
        :filter-node-method="filterNode"
        @current-change="onCurrentChange"
      >
        <template #default="{ node, data }">
          <div class="ever-page-button-register__tree--item">
            <span class="ever-page-button-register__tree--title">
              <el-tooltip class="box-item" effect="dark" :content="getContent(data)" placement="top-start">
                <span v-if="data.id == null && (states.activeName == 'plantLocationId' || states.activeName == 'type')">{{ data.name }}</span>
                <span v-else-if="data.name && states.activeName == 'useOrgId'">{{ data.label }}</span>
                <span v-else-if="states.activeName == 'type'">
                  <span>
                    <img v-if="data.isEqpType == '否'" :src="equipmentIcon" alt="图标" class="menu-icon" />
                    <span>{{ data.typeCode }}</span>
                    <span>({{ data.typeName }})</span>
                  </span>
                </span>
                <span v-else-if="states.activeName == 'useOrgId'">{{ data.label }}</span>
                <span v-else-if="states.activeName == 'plantLocationId'"> {{ data.plantCode }}({{ data.plantName }}) </span>
              </el-tooltip>
            </span>
            <!-- <div v-show="node.level == 2" class="ever-page-button-register__tree--btn">
                            <span  @click.stop="startEdit(data)"><EditPen></EditPen></span>
                            <span 
                                  @click.stop="deleteGroup(data)"
                            ><Delete></Delete
                            ></span>
                        </div> -->
            <div class="ever-page-button-register__tree--btn">
              <span v-if="states.activeName === 'type'" v-hasPermi="['equipment:tree:add']" @click.stop="add(data)">
                <Plus />
              </span>
              <span v-if="states.activeName === 'type'" v-hasPermi="['equipment:tree:edit']" @click.stop="startEdit(data)">
                <EditPen></EditPen>
              </span>
              <span v-if="states.activeName === 'type'" v-hasPermi="['equipment:tree:del']" @click.stop="deleteGroup(data)">
                <Delete></Delete>
              </span>
            </div>
          </div>
        </template>
      </el-tree>

      <el-tree
        ref="elTreeRef_dep"
        v-show="states.activeName == 'useOrgId'"
        :data="states.treeData"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        :props="{ label: 'label', children: 'children' }"
        class="tree-class standard-tree"
        :filter-node-method="filterNode"
        default-expand-all
        @current-change="onCurrentChange"
      >
        <template #default="{ node, data }">
          <div class="ever-page-button-register__tree--item">
            <span class="ever-page-button-register__tree--title">
              <el-tooltip class="box-item" effect="dark" :content="getContent(data)" placement="top-start">
                <span>{{ data.label }}</span>
              </el-tooltip>
            </span>
            <!-- <div v-show="node.level == 2" class="ever-page-button-register__tree--btn">
                            <span  @click.stop="startEdit(data)"><EditPen></EditPen></span>
                            <span 
                                  @click.stop="deleteGroup(data)"
                            ><Delete></Delete
                            ></span>
                        </div> -->
            <div class="ever-page-button-register__tree--btn">
              <span v-if="states.activeName === 'type'" @click.stop="add(data)">
                <Plus />
              </span>
              <span v-if="states.activeName === 'type'" @click.stop="startEdit(data)">
                <EditPen></EditPen>
              </span>
              <span v-if="states.activeName === 'type'" @click.stop="deleteGroup(data)">
                <Delete></Delete>
              </span>
            </div>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </el-card>
  <!-- 左侧新增/修改弹窗 -->
  <groupOperationDialog ref="groupOperationDialogRef" :tree-data="states.treeData" @succeed="init"></groupOperationDialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search, EditPen, Delete } from '@element-plus/icons-vue';
import equipmentIcon from './equipment.svg?url';
import { E_Msg } from '@/utils/message/index';
import PlantLocationApi from '@/api/basic/plant-location-api';
import EqpTypeApi from '@/api/basic/eqp-type-api';
import CompanyApi from '@/api/system/company-api';
import groupOperationDialog from './group-operation-dialog.vue';
import { deptTreeSelect } from '@/api/infra/admin/adminUser';
const emits = defineEmits(['groupClick', 'groupChange']);

const elTreeRef = ref();
const elTreeRef_dep = ref();
const groupOperationDialogRef = ref();

const states = reactive({
  activeName: 'type',
  name: '',
  treeData: [
    {
      name: '全部',
      isEqpType: '是',
      id: null,
      children: []
    }
  ]
});
const handleChange = () => {
  states.name = '';
  emits('groupClick', states.activeName, '');
  init();
};
// 获取树
const init = () => {
  states.treeData[0].children = [];
  switch (states.activeName) {
    case 'type':
      states.treeData = [{ isEqpType: '是', id: null, name: '设备类别', children: [] }];
      EqpTypeApi.eqpTypeAndModel({ typeName: states.name }).then((res) => {
        states.treeData[0].children = res.data;
      });
      break;
    case 'useOrgId':
      states.treeData = [{ isEqpType: '否', id: null, label: '部门', children: [] }];
      // CompanyApi.listOrgTree({
      //     deptName: states.name,
      //     // companyId: BtUserTokenInfo.getCompany().companyId,
      //     includeChildrenData: 'true',
      //     includeUserData: 'false',
      //     //过滤掉已经停用的部门
      //     needCloseDept: 0,
      // }).then((res: any) => {
      //     states.treeData[0].children = res.data
      // })
      deptTreeSelect().then((res) => {
        states.treeData[0].children = res.data;
        console.log('%c [ states.treeData ]-175', 'font-size:13px; background:pink; color:#bf2c9f;', states.treeData);
      });
      break;
    case 'plantLocationId':
      states.treeData = [{ isEqpType: '否', id: null, name: '厂房位置', children: [] }];
      PlantLocationApi.allPlantLocation({}).then((res) => {
        states.treeData[0].children = res.data;
      });
      break;
    default:
      break;
  }
};
init();
const onCurrentChange = (data) => {
  console.log('data', data);
  if (states.activeName == 'type') {
    emits('groupClick', data.isEqpType == '是' ? 'eqpTypeId' : 'eqpModelId', data.id);
  } else if (states.activeName == 'useOrgId') {
    console.log('%c [  ]-180', 'font-size:13px; background:pink; color:#bf2c9f;');
    emits('groupClick', states.activeName, data.id);
  } else {
    emits('groupClick', states.activeName, data.id);
  }
};
const getContent = (data) => {
  if (states.activeName == 'useOrgId') {
    // if (data.label) {
    //     return data.label
    // }
    return data.label;
  }
  if (data.id == null) {
    return data.name;
  }
  if (states.activeName == 'type') {
    return `${data.typeCode}(${data.typeName})`;
  }
  if (states.activeName == 'plantLocationId') {
    return `${data.plantCode}(${data.plantName})`;
  }
};

const search = () => {
  elTreeRef.value!.filter(states.name);
  elTreeRef_dep.value!.filter(states.name);
};
const filterNode = (value, data) => {
  if (!value || data.id == -1) return true;
  if (states.activeName == 'type') {
    return (data.typeName || data.name).includes(value) || (data.typeCode || '').includes(value);
  } else if (states.activeName == 'useOrgId') {
    return (data.label).includes(value);
  } else {
    return (data.plantName || data.name).includes(value) || (data.plantCode || '').includes(value);
  }
};
// 左侧树新增
const add = (data) => {
  groupOperationDialogRef.value.startAddData(data);
};

// 左侧树编辑
const startEdit = (data) => {
  groupOperationDialogRef.value.startEditData(data);
};
// 删除数据
const deleteGroup = (data) => {
  E_Msg.confirm('删除确认', '删除后的数据无法恢复，请谨慎操作！').then(() => {
    let ids = [];
    ids.push(data.id);
    EqpTypeApi.del({ id: data.id }).then(() => {
      E_Msg.newMessage('删除成功');
      init();
      emits('groupClick', '');
    });
  });
};

defineExpose({
  init
});
</script>
<style scoped lang="scss">
.scrollbar {
  height: calc(100vh - 220px);
}
</style>
