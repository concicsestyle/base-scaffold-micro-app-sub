<template>
  <el-dialog v-model="states.dialogVisible" :title="states.title" width="80%" :close-on-click-modal="false" draggable :before-close="handleClose">
    <el-form
      ref="formRef"
      :model="states.formData"
      label-width="80px"
      :disabled="states.updateType == 'read'"
      label-position="top"
      class="standard-form"
    >
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="资产编号" prop="assetCode">
            <el-input v-model.trim="states.formData.assetCode" disabled clearable placeholder="根据编码规则自动生成"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备编号" prop="accountCode" :rules="rules.accountCode">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.accountCode"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备名称" prop="accountName" :rules="rules.accountName">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.accountName"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="资产类别" prop="assetType" :rules="rules.assetType">
            <el-select v-model="states.formData.assetType" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_asset_type" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="资质权属" prop="assetOwnership" :rules="rules.assetOwnership">
            <el-select v-model="states.formData.assetOwnership" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_asset_ownership" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <div class="title">
          <el-divider direction="vertical" class="direction" />
          <sapn>基础信息</sapn>
        </div>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="设备类别" prop="eqpTypeId">
            <el-tree-select
              ref="deptRef"
              v-model="states.formData.eqpTypeId"
              :data="states.eqpTypeTree"
              value-key="id"
              :props="{ value: 'id', label: 'typeName', children: 'children' ,disabled:'isDis'}"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              default-expand-all
              check-strictly
              :render-after-expand="false"
            ></el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备机型" prop="modelName">
            <el-select v-model="states.formData.eqpModelId" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_eqp_model" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="型号" prop="model">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.model"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="规格" prop="specs">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.specs"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="单位" prop="unitName">
            <el-select v-model="states.formData.unit" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_eqp_untis" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="设备属性" prop="eqpNature">
            <el-select v-model="states.formData.eqpNature" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_eqp_attribute" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="原值（元）" prop="originalValue" :rules="rules.originalValue">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.originalValue"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="转固日期" prop="transferDate">
            <el-date-picker v-model="states.formData.transferDate" value-format="YYYY-MM-DD" type="date" placeholder="年/月/日" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="成本中心" prop="costCenter">
            <!-- <el-select v-model="states.formData.costCenter" clearable placeholder="请选择" filterable>
              <el-option v-for="item in route_attribute_type" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select> -->
            <el-tree-select
              ref="deptRef"
              v-model="states.formData.costCenter"
              :data="states.branchCompanyIdList"
              @change="val=>{changeName(val,'costCenter')}"
              @clear="val=>{clearName('costCenter')}"
              value-key="id"
              filterable
              :props="{ label: 'label', children: 'children' }"
              clearable
              check-strictly
              :render-after-expand="false"
            >
              <template #default="{ data }">
                <span>{{ data.label }}</span>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="环保设备" prop="isEpEqp">
            <el-radio-group v-model="states.formData.isEpEqp" class="ml-4">
              <el-radio v-for="item in eam_yes_no" :label="Number(item.value)" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="数控设备" prop="isCncEqp">
            <el-radio-group v-model="states.formData.isCncEqp" class="ml-4">
              <el-radio v-for="item in eam_yes_no" :label="Number(item.value)" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="联网设备" prop="isNetEqp" :rules="rules.isNetEqp">
            <el-radio-group v-model="states.formData.isNetEqp" class="ml-4">
              <el-radio v-for="item in eam_yes_no" :label="Number(item.value)" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="生产设备" prop="isProdEqp" :rules="rules.isProdEqp">
            <el-radio-group v-model="states.formData.isProdEqp" class="ml-4">
              <el-radio v-for="item in eam_yes_no" :label="Number(item.value)" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model.trim="states.formData.remark"
              :rows="1"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              type="textarea"
              show-word-limit
              maxlength="500"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <div class="title">
          <el-divider direction="vertical" class="direction" />
          <sapn>使用情况</sapn>
        </div>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="使用部门" prop="useOrgId" :rules="rules.useOrgId">
            <el-tree-select
              ref="deptRef"
              v-model="states.formData.useOrgId"
              :data="states.branchCompanyIdList"
              value-key="id"
              filterable
              :props="{ label: 'label', children: 'children' }"
              @change="val=>{changeName(val,'useOrgId')}"
              @clear="val=>{clearName('useOrgId')}"
              clearable
              check-strictly
              :render-after-expand="false"
            >
              <template #default="{ data }">
                <span >{{ data.label }}</span>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="责任人" prop="dutyId">
            <!-- <el-select v-model="states.formData.dutyId" clearable placeholder="请选择" filterable>
                            <el-option v-for="item in route_attribute_type" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>
                        </el-select> -->
            <el-input
              v-if="states.updateType == 'read'"
              :value="states.formData.dutyId ? `${states.formData.dutyCode}(${states.formData.dutyName})` : ''"
            ></el-input>
            <el-tooltip
              :disabled="states.updateType != 'read' || !states.formData.dutyId"
              :content="getPersonCodeAndName(states.formData.dutyId, states.personList)"
              effect="dark"
              placement="top"
              v-else
            >
              <el-tree-select
                :ref="refAll.eamSelectDutyRef"
                :placeholder="states.updateType == 'read' ? '' : '请选择'"
                v-model="states.formData.dutyId"
                @change="val=>{changeName(val,'dutyId')}"
              @clear="val=>{clearName('dutyId')}"
                :data="states.userList"
                value-key="id"
                :props="{ label: 'name', children: 'children' }"
                clearable
                filterable
                default-expand-all
                check-strictly
                :render-after-expand="false"
              >
              </el-tree-select>
              <!-- <el-select
                v-model="states.formData.dutyId"
                clearable
                filterable
                :placeholder="states.updateType == 'read' ? '' : '请选择'"
                popper-class="eam-select-popper-style"
                :ref="refAll.eamSelectDutyRef"
                name="eamSelectDutyRef"
              >
                <el-option
                  v-for="item of states.personList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.personnelCode + '(' + item.personnelName + ')'"
                  :disabled="item.disabled"
                ></el-option>
              </el-select> -->
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="厂房位置" prop="plantLocationId" :rules="rules.plantLocationId">
            <el-tree-select
              ref="deptRef"
              v-model="states.formData.plantLocationId"
              :data="states.plantLocationList"
              value-key="id"
              filterable
              :props="{ label: 'plantName', children: 'children' }"
              @change="val=>{changeName(val,'plantLocationId')}"
              @clear="val=>{clearName('plantLocationId')}"
              clearable
              default-expand-all
              check-strictly
              :render-after-expand="false"
            >
              <template #default="{ data }">
                <span v-if="data.plantCode">{{ data.plantCode }}({{ data.plantName }})</span>
                <span v-else>{{ data.plantName }}</span>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="摆放位置" prop="displayLocation">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.displayLocation"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="运维组织" prop="omOrgId" :rules="rules.omOrgId">
            <el-tree-select
              ref="deptRef"
              v-model="states.formData.omOrgId"
              :data="states.branchCompanyIdList"
              value-key="id"
              :props="{ label: 'label', children: 'children', disabled: 'disabled' }"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              default-expand-all
              check-strictly
              :render-after-expand="false"
            ></el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="运维部门" prop="omDeptId" :rules="rules.omDeptId">
            <el-tooltip
              :disabled="states.updateType != 'read' || !states.formData.omDeptId"
              effect="dark"
              :content="getTypeName(states.formData.omDeptId, states.omDeptIdList, 'name')"
              placement="top"
            >
              <el-tree-select
                v-model="states.formData.omDeptId"
                :data="states.omDeptIdList"
                value-key="id"
                :props="{
                  label: 'name',
                  children: 'children',
                  disabled: 'disabled'
                }"
                clearable
                filterable
                check-strictly
                collapse-tags
                default-expand-all
                @change="changeomPersonList"
                :render-after-expand="false"
                popper-class="eam-select-popper-style"
                :ref="refAll.eamSelectOmDeptRef"
                name="eamSelectOmDeptRef"
              ></el-tree-select>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="寿命状态" prop="lifeStatus" :rules="rules.lifeStatus">
            <el-select v-model="states.formData.lifeStatus" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_eqp_life_state" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="ABC类" prop="abctype">
            <el-select v-model="states.formData.abctype" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_eqp_abc_type" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="投产日期" prop="operationDate">
            <el-date-picker
              v-model="states.formData.operationDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="年/月/日"
              :disabled-date="transferDateDisabledDate"
              popper-class="eam-select-popper-style"
              :ref="refAll.eamSelectOperationDateRef"
              name="eamSelectOperationDateRef"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <div class="title">
          <el-divider direction="vertical" class="direction" />
          <sapn>厂商信息</sapn>
        </div>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="生产厂商" prop="produceFirm">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.produceFirm"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="出厂编号" prop="leaveFactoryCode">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.leaveFactoryCode"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="出厂日期" prop="leaveFactoryDate">
            <el-date-picker
              v-model="states.formData.leaveFactoryDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="年/月/日"
              :disabled-date="leaveFactoryDateDisabled"
              popper-class="eam-select-popper-style"
              :ref="refAll.eamSelectLeaveFactoryDateRef"
              name="eamSelectLeaveFactoryDateRef"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="品牌" prop="brand">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.brand"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="供应商" prop="supplierId">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.supplierId"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="4">
          <el-form-item label="产地" prop="producingArea">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.producingArea"
              :placeholder="states.updateType != 'read' ? '请输入' : ' '"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <div class="title">
          <el-divider direction="vertical" class="direction" />
          <sapn>参数</sapn>
        </div>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="14">
          <div class="mb-2 mt-2" v-if="states.updateType != 'read'">
            <el-button type="primary" @click="addColumn">添&nbsp;加</el-button>
            <el-button type="danger" plain @click="deleteColumn">删&nbsp;除</el-button>
            <span v-if="states.formData.warningTextShow" class="warning-text">
              <el-icon>
                <WarningFilled color="red"></WarningFilled>
              </el-icon>
              以下必填信息不能为空
            </span>
          </div>
          <el-form ref="eqpParamRef" :model="states.formData" label-width="80px" label-position="top" :disabled="states.updateType == 'read'">
            <el-table
              ref="eamTableRef"
              class="table-form"
              :data="states.formData.eqpParamList"
              @selection-change="handleSelectionChange"
              height="22vh"
              :header-row-style="{ height: '48px', color: '#3e4a6b' }"
            >
              <el-table-column type="selection" width="55" v-if="states.updateType != 'read'"></el-table-column>
              <el-table-column label="序号" width="55" type="index"></el-table-column>
              <el-table-column label="参数">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>参数 </template>
                <template #default="{ row, $index }">
                  <el-form-item :prop="`eqpParamList[${$index}].paramName`" style="margin-bottom: 10px" :rules="e_rule('required', '')">
                    <el-tooltip :disabled="states.updateType != 'read'" effect="dark" :content="row.paramName" placement="top">
                      <el-input
                        v-model.trim="row.paramName"
                        maxlength="60"
                        style="margin-top: 10px"
                        :show-word-limit="false"
                        placeholder="请输入"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="值">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>值 </template>
                <template #default="{ row, $index }">
                  <el-form-item :prop="`eqpParamList[${$index}].value`" style="margin-bottom: 10px" :rules="e_rule('required', '')">
                    <el-tooltip :disabled="states.updateType != 'read'" effect="dark" :content="row.value" placement="top">
                      <el-input
                        v-model.trim="row.value"
                        maxlength="60"
                        :show-word-limit="false"
                        style="margin-top: 10px"
                        placeholder="请输入"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="条码信息中是否包含">
                <template #header> <span class="require-star">*&nbsp;&nbsp;</span>条码信息中是否包含 </template>
                <template #default="{ row, $index }">
                  <el-form-item :prop="`eqpParamList[${$index}].showInQrCode`" style="margin-bottom: 10px" :rules="e_rule('required', '')">
                    <el-select
                      v-model="row.showInQrCode"
                      clearable
                      style="margin-top: 10px"
                      popper-class="eam-select-popper-style"
                      :ref="(el) => setRef(el, 'eamSelectShowInQrCodeRef', $index)"
                      :name="'eamSelectShowInQrCodeRef' + $index"
                    >
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #header>备注</template>
                <template #default="{ row, $index }">
                  <el-form-item :prop="`eqpParamList[${$index}].remark`" style="margin-bottom: 10px">
                    <el-tooltip :disabled="states.updateType != 'read' || !row.remark" effect="dark" :content="row.remark" placement="top">
                      <el-input
                        v-model.trim="row.remark"
                        maxlength="500"
                        :show-word-limit="false"
                        style="margin-top: 10px"
                        :placeholder="states.updateType == 'read' ? '' : '请输入'"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <div class="title" style="margin-top: 15px">
          <el-divider direction="vertical" class="direction" />
          <sapn>特种设备信息</sapn>
        </div>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="特种设备" prop="isSpecial" :rules="rules.isSpecial">
            <el-radio-group v-model.trim="states.formData.isSpecial" @change="isSpecialChange" readonly>
              <el-radio v-for="item in eam_yes_no" :label="item.value" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" ref="specialColRef" v-if="states.formData.isSpecial == '1'">
        <el-col :span="4">
          <el-form-item label="特种设备类别" prop="specialEqpType">
            <el-select v-model="states.formData.specialEqpType" clearable placeholder="请选择" filterable>
              <el-option v-for="item in eam_special_eqp_type" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="登记机关" prop="registerOffice">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.registerOffice"
              clearable
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备注册代码" prop="registrationCode">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.registrationCode"
              clearable
              placeholder="请输入设备注册代码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="使用登记证编号" prop="registrationCertificateNo">
            <el-input
              v-model.trim="states.formData.registrationCertificateNo"
              clearable
              maxlength="60"
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="检验周期" prop="checkoutCycle">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.checkoutCycle"
              clearable
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
              @change="getPlanCheckOutDate"
            >
              <template #append>
                <el-select
                  v-model="states.formData.cycleType"
                  placeholder="Select"
                  style="width: 65px"
                  @change="getPlanCheckOutDate"
                  popper-class="eam-select-popper-style"
                  :ref="refAll.eamSelectCycleTypeRef"
                  name="eamSelectCycleTypeRef"
                >
                  <el-option v-for="item of eam_yymmdd" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" ref="specialColRef" v-if="states.formData.isSpecial == '1'">
        <el-col :span="4">
          <el-form-item label="检验机构" prop="checkoutOrg">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.checkoutOrg"
              clearable
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="上次检验合格日期" prop="lastCheckOutPassDate">
            <el-date-picker
              v-model="states.formData.lastCheckOutPassDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="年/月/日"
              :disabled-date="disabledDate"
              @change="getPlanCheckOutDate"
              popper-class="eam-select-popper-style"
              :ref="refAll.eamSelectLastCheckOutPassDateRef"
              name="eamSelectLastCheckOutPassDateRef"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="计划检验日期" prop="planCheckOutDate">
            <el-input maxlength="60" v-model.trim="states.formData.planCheckOutDate" clearable disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <!-- :rules="e_rule(['required', 'intNotZero'], '检验提醒不能为空')" -->
          <el-form-item label="检验提醒（天）" prop="remindDay">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.remindDay"
              clearable
              placeholder="请输入检验提醒（天）"
              @change="checkRemindDay"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备代号" prop="deviceMark">
            <el-input
              maxlength="60"
              :show-word-limit="false"
              v-model.trim="states.formData.deviceMark"
              clearable
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" ref="specialColRef" v-if="states.formData.isSpecial == '1'">
        <el-col :span="4">
          <el-form-item label="救援应急电话" prop="emergencyTelephone" :rules="e_rule('phone')">
            <el-input
              v-model.trim="states.formData.emergencyTelephone"
              clearable
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="监督检验报告编号" prop="inspectionReportNo">
            <el-input
              v-model.trim="states.formData.inspectionReportNo"
              clearable
              :placeholder="states.updateType == 'read' ? '' : '请输入'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="安全员" prop="safetyOfficerId">
            <el-select
              v-model="states.formData.safetyOfficerId"
              clearable
              filterable
              collapse-tags
              placeholder="请选择"
              popper-class="eam-select-popper-style"
              name="eamSelectUnitRef"
            >
              <el-option
                v-for="item of states.allPersonList"
                :key="item.id"
                :label="item.personnelCode + '(' + item.personnelName + ')'"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="安全总监" prop="safetyDirectorId">
            <el-select
              v-model="states.formData.safetyDirectorId"
              clearable
              filterable
              collapse-tags
              placeholder="请选择"
              popper-class="eam-select-popper-style"
              name="eamSelectUnitRef"
            >
              <el-option
                v-for="item of states.allPersonList"
                :key="item.id"
                :label="item.personnelCode + '(' + item.personnelName + ')'"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse v-model="states.tabActive">
        <el-collapse-item name="file" id="file">
          <template #title>
            <el-icon class="header-icon">
              <CaretBottom v-if="isTabsAcitve('file')"></CaretBottom>
              <CaretRight v-else></CaretRight>
            </el-icon>
            <span>附件</span>
          </template>
          <everUploadTable ref="everUploadTableRef"></everUploadTable>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <template v-if="states.updateType != 'read'" #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取&nbsp;消</el-button>
        <el-button type="primary" :loading="states.saveLoading" @click="saveData">保&nbsp;存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { e_rule } from '@/utils/require-rule/index';
import { E_Msg } from '@/utils/message/index';
import { reactive, ref, nextTick, watch, onMounted } from 'vue';
import PlantLocationApi from '@/api/basic/plant-location-api';
import EqpTypeApi from '@/api/basic/eqp-type-api';
import EqpAccountApi from '@/api/basic/eqp-account-api';
import everUploadTable from '@/components/ever-upload-table/index.vue';
import dayjs, { ManipulateType } from 'dayjs';
import CompanyApi from '@/api/system/company-api';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { route_attribute_type, eam_eqp_attribute, eam_eqp_untis, eam_eqp_life_state, eam_eqp_abc_type } = toRefs<any>(
  proxy?.useDict('route_attribute_type', 'eam_eqp_attribute', 'eam_eqp_untis', 'eam_eqp_life_state', 'eam_eqp_abc_type')
);
const { eam_asset_type, eam_asset_ownership, eam_special_eqp_type } = toRefs<any>(
  proxy?.useDict('eam_asset_type', 'eam_asset_ownership', 'eam_special_eqp_type')
);
const { eam_eqp_model, eam_yes_no } = toRefs<any>(proxy?.useDict('eam_eqp_model', 'eam_yes_no'));
const { eam_yymmdd } = toRefs<any>(proxy?.useDict('eam_yymmdd'));
import { ElMessage } from 'element-plus';
import { id } from 'element-plus/es/locale/index.mjs';
import { DeptAndUserTree,deptTreeSelect,newDeptTree } from '@/api/infra/admin/adminUser';
const emits = defineEmits(['success']);
const states = reactive({
  dialogVisible: false,
  title: '',
  form: {
    plantCode: '', // 编码
    plantName: '', // 名称
    parentId: '', // 上级位置
    remark: '', // 备注
    id: '', //
    branchCompanyIdList: [] as any //所属组织
  },
  branchCompanyIdList: [] as any,
  plantCodeStatus: false, // 标识是否有单位编码规则
  saveLoading: false,
  updateType: 'add',
  deptList: [] as any,
  //表单
  formData: {
    securityLevel: '0', // 密级
    assetCode: undefined, // 资产编号
    accountCode: undefined, // 编码
    accountName: '', // 名称
    branchCompanyId: undefined, // 创建组织
    useBranchCompanyId: undefined, // 使用组织默认创建组织
    branchCompanyName: undefined, // 创建组织
    useBranchCompanyName: undefined, // 使用组织
    id: '',
    logo: '', // 图片id
    assetType: 'ItemAssetTypeEq', //资产类别
    assetOwnership: '0',
    inspectionReportNo: '',
    safetyOfficerId: '',
    safetyDirectorId: '',
    purchasingAgents: [],
    purchasingAgent: '',
    omUserIds: '',
    omUserId: [],
    conservatorId: '',
    durableYears: '', // 使用年限
    deprectionYears: '', // 折旧年限
    warrantyPeriodStart: '', // 质保开始日期
    warrantyPeriodEnd: '', // 质保结束日期
    cycleType: 'year' as ManipulateType,
    abctype: 'A',
    eqpTypeId: '', // 设备类别id
    eqpModelId: '', // 设备机型ID
    model: undefined, // 型号
    specs: undefined, // 规格
    unit: undefined, // 单位
    unitName: undefined, // 单位名称
    eqpNature: '', // 设备属性
    produceFirm: '', // 生产厂商
    producingArea: '', // 产地
    leaveFactoryCode: '', // 出厂编号
    leaveFactoryDate: '', // 出厂日期
    useOrgId: undefined, // 使用部门id
    dutyId: '', // 责任人
    dutyCode: '', // 责任人code
    dutyName: '', // 责任人名称
    plantLocationId: '', // 厂房位置ID
    lifeStatus: 'Using', // 寿命状态
    brand: undefined, // 品牌
    supplierId: '', // 供应商id
    isSpecial: '0', // 特种设备
    deviceMark: '', // 设备代号
    registerOffice: '', // 登记机关
    registrationCode: '', // 设备代码
    registrationCertificateNo: '', // 登记证编号
    emergencyTelephone: undefined, // 救援应急电话
    originalValue: undefined,
    parentEqpAccountId: undefined,
    parentEqpAccountIdName: undefined,
    transferDate: '',
    isReportWork: 1,
    isMainFlag: 1,
    isEpEqp: 1,
    isCncEqp: 1,
    isNetEqp: 1,
    isProdEqp: 1,
    remark: '',
    omOrgId: undefined,
    omDeptId: undefined,
    operationDate: '',
    specialEqpType: undefined,
    checkoutCycle: 1,
    checkoutOrg: '',
    lastCheckOutPassDate: '',
    planCheckOutDate: '',
    warningTextShow: false,
    remindDay: undefined,
    eqpParamList: [],
    displayLocation: '', // 摆放位置
    useOrgName: undefined, // 使用部门名称
    costCenterCode: undefined, // 成本中心code
    costCenter: undefined // 成本中心名称
  },
  multipleSelection: [],
  allPersonList: [],
  specialEqpTypeList: [], //字典数据
  yymmddList: [], //字典数据
  tabActive: ['file'], //'file'
  visible: false,
  buttonLoading: false,
  eqpTypeTree: [],
  personList: [],
  locationList: [],
  branchCompanyList: [],
  omDeptIdList: [],
  operationsPersonnelList: [],
  eqpLifeList: [],
  abctypeList: [],
  userList: [],
  plantLocationList:[]
});
const rules = ref({
  useBranchCompanyName: [{ required: false, message: '使用组织不能为空', trigger: 'blur' }],
  accountCode: { required: true, message: '设备编号不能为空', trigger: 'blur' },
  accountName: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
  assetType: [{ required: false, message: '资产类别不能为空', trigger: 'blur' }],
  assetOwnership: [{ required: false, message: '资质权属不能为空', trigger: 'blur' }],
  eqpTypeId: [{ required: false, message: '设备类别不能为空', trigger: 'blur' }],
  // modelName: [{ required: false, message: '设备机型不能为空', trigger: 'blur' }],
  originalValue: [{ required: false, message: '原值不能为空', trigger: 'blur' }],
  isNetEqp: [{ required: false, message: '联网设备不能为空', trigger: 'blur' }],
  isProdEqp: [{ required: false, message: '生产设备不能为空', trigger: 'blur' }],
  useOrgId: [{ required: false, message: '使用部门不能为空', trigger: 'blur' }],
  plantLocationId: [{ required: false, message: '厂房位置不能为空', trigger: 'blur' }],
  omOrgId: [{ required: false, message: '运维组织不能为空', trigger: 'blur' }],
  omDeptId: [{ required: false, message: '运维部门不能为空', trigger: 'blur' }],
  lifeStatus: [{ required: false, message: '寿命状态不能为空', trigger: 'blur' }],
  isSpecial: [{ required: false, message: '特种设备不能为空', trigger: 'blur' }]
});
const formRef = ref();
const eamTableRef = ref();
const refAll = {
  eamSelectrRef: ref(), // 设备类别
  eamSelectEqpModeRef: ref(), // 设备机型
  eamSelectUnitRef: ref(), // 单位
  eamSelectEqpNatureRef: ref(), // 设备属性
  eamSelectTransferDateRef: ref(), // 转固日期
  eamSelectUseOrgRef: ref(), // 使用部门
  eamSelectDutyRef: ref(), // 责任人
  eamSelectPlantLocationRef: ref(), // 厂房位置
  eamSelectOmOrgRef: ref(), // 运维组织
  eamSelectOmDeptRef: ref(), // 运维部门
  eamSelectLifeStatusRef: ref(), // 寿命状态
  eamSelectABCTypeRef: ref(), // ABC类
  eamSelectOperationDateRef: ref(), // 投产日期
  eamSelectLeaveFactoryDateRef: ref(), // 出厂日期
  eamSelectShowInQrCodeRef: ref([]), // 条码信息中是否包含
  eamSelectSpecialEqpTypeRef: ref(), // 特种设备类别
  eamSelectCycleTypeRef: ref(), // 检验周期
  eamSelectLastCheckOutPassDateRef: ref() //上次检验合格日期
};

const isSpecialChange = () => {
  states.formData.specialEqpType = undefined;
  states.formData.deviceMark = '';
  states.formData.registerOffice = '';
  states.formData.registrationCode = '';
  states.formData.registrationCertificateNo = '';
  states.formData.checkoutOrg = '';
  states.formData.checkoutCycle = 1;
  states.formData.lastCheckOutPassDate = '';
  states.formData.remindDay = undefined;
  states.formData.planCheckOutDate = '';
  states.formData.emergencyTelephone = undefined;
  states.formData.cycleType = 'year';
  states.formData.safetyDirectorId = '';
  states.formData.safetyOfficerId = '';
  states.formData.inspectionReportNo = '';
};
onMounted(() => {
  dept();
  eqpType();
});

const eqpType = () => {
  // states.eqpTypeTree = [{ isEqpType: '是', id: null, name: '设备类别', children: [] }]
  EqpTypeApi.eqpTypeAndModel({ typeName: '' }).then((res) => {
    states.eqpTypeTree = res.data;
  });
};
//组织查询
const dept = async () => {
  const resdept = await newDeptTree();
  states.branchCompanyIdList = resdept.data;
};
//获取部门
const listOrgTree = () => {
  CompanyApi.listOrgTree({
    includeChildrenData: 'true',
    includeUserData: 'false',
    //过滤掉已经停用的部门
    needCloseDept: 0
  }).then((res: any) => {
    states.parentList = res.data;
  });
};
// 用户列表
const getDeptAndUserTree = async() => {
  DeptAndUserTree([]).then((res) => {
    if (res.code === 200) {
      states.userList = res.data;
    }
  });
//   const treeRes = await deptTreeSelect();
//     states.deptList = treeRes.data
};
// 出厂日期校验
const leaveFactoryDateDisabled = (d) => {
  let maxDate = states.formData.transferDate;
  // 如果投产日期在转固日期之前，则出厂日期最大值为投产日期
  if (maxDate && states.formData.operationDate && dayjs(maxDate).isAfter(dayjs(states.formData.operationDate))) {
    maxDate = states.formData.operationDate;
  }
  // 当转固日期不存在的时候，且投产日期存在的时候，最大值为投产日期
  if (!maxDate && states.formData.operationDate) {
    maxDate = states.formData.operationDate;
  }
  // 转固日期和投产日期在当前日期之前的时候，默认不能大于转固日期或投产日期
  if (maxDate && dayjs(d).isAfter(dayjs(maxDate))) {
    return dayjs(d).isAfter(dayjs(maxDate));
  } else {
    return dayjs(d).isAfter(dayjs());
  }
};

// 转固日期、投产日期限制
const transferDateDisabledDate = (d) => {
  if (!states.formData.leaveFactoryDate) {
    return;
  }
  return dayjs(d).isBefore(dayjs(states.formData.leaveFactoryDate));
};

const changeomPersonList = (e) => {
  states.operationsPersonnelList = [];
  states.formData.omUserId = [];
  // PersonnelDescApi.list({ deptId: e }).then(res => {
  //     states.operationsPersonnelList = res.data
  //     if (props.updateType != 'add') {
  //         setTimeout(() => {
  //             states.formData.omUserId = states.formData.omUserIds.split(',')
  //         }, 500)
  //     }
  // })
};
const changeomDeptIdList = (e) => {
  states.formData.omDeptId = undefined;
  // DeptApi.getListByBranchCompanyId({ branchCompanyId: e }).then((res: any) => {
  //     if (res.code == 0) {
  //         states.omDeptIdList = filterOrg(res.data)
  //     }
  // })
};

// 获取人员code和姓名
const getPersonCodeAndName = (id, list) => {
  const info = list.find((item) => item.id == id);
  return `${info?.personnelCode}(${info?.personnelName})`;
};
// 设备类别变更
const typeChange = (val) => {
  if (!val) {
    return;
  }
  states.formData.eqpModelId = '';
  states.formData.model = undefined;
  states.formData.specs = undefined;
  states.formData.unitName = undefined;
  states.formData.unit = undefined;
  states.formData.brand = undefined;
  clearModel();
};
const clearModel = () => {
  modelToText();
  isSpecialChange();
};
// 设备机型修改时 给其他字段赋值
const modelToText = (data: any = {}) => {
  states.formData.model = data.model;
  states.formData.specs = data.specs;
  states.formData.unitName = data.unitName;
  states.formData.unit = data.unit;
  states.formData.brand = data.brand;
  states.formData.isSpecial = data.isSpecial ? String(data.isSpecial) : '0';
};
// 获取对应的名称
const getTypeName = (id, list, label) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i][label];
    } else {
      if (list[i].children && list[i].children.length > 0) {
        let res = getTypeName(id, list[i].children, label);
        if (res) {
          return res;
        }
      }
    }
  }
};

//校验tabs显示关闭
const isTabsAcitve = (key) => {
  return states.tabActive.find((e) => e == key);
};
const disabledDate = (d) => {
  return dayjs(d).isAfter(dayjs());
};

/**
 * 根据typeCode查找树节点
 */
 const findNodeById = (tree, val,key) => {
  for (let node of tree) {
    if (node[key] === val) {
        return node; // 找到匹配的typeCode，返回整个节点
    } else if (node.children && node.children.length > 0) {
      const result = findNodeById(node.children, val,key);
      if (result) {
        return result; // 在子节点中找到，返回节点
      }
    }
  }
  return null; // 未找到，返回null
};
const changeName = (val,type)=>{
    if(val){
        if(type === 'useOrgId'){
            states.formData.useOrgName = findNodeById(states.branchCompanyIdList, val,'id')?.label
          
        }else if(type === 'costCenter'){
            states.formData.costCenterName = findNodeById(states.branchCompanyIdList, val,'id')?.label
        }else if(type === 'plantLocationId'){
            states.formData.plantName = findNodeById(states.plantLocationList, val,'id')?.label
            states.formData.plantLocationName =states.formData.plantName
        }else if(type ==='dutyId'){
            states.formData.dutyName = findNodeById(states.userList, val,'id')?.name
        }
    }
}
const clearName = (type)=>{
    if(type === 'useOrgId'){
            states.formData.useOrgName =''
        }else if(type === 'costCenter'){
            states.formData.costCenterName =''
        }else if(type === 'plantName'){
            states.formData.costCenterName = ''
        }else if(type ==='dutyId'){
            states.formData.dutyName = ''
        }
}
// 校验
const checkRemindDay = () => {
  let num: number;
  if (states.formData.cycleType == 'year') {
    num = states.formData.checkoutCycle * 366;
  } else if (states.formData.cycleType == 'month') {
    num = states.formData.checkoutCycle * 31;
  } else {
    num = states.formData.checkoutCycle;
  }
  if (states.formData.remindDay > num) {
    states.formData.remindDay = undefined;
    E_Msg.newMessage('检验提醒时间超过检验周期，请重新输入，请确认后重新操作！', 'warning');
  }
};
// 计算计划检验日期
const getPlanCheckOutDate = () => {
  if (states.formData.lastCheckOutPassDate && states.formData.checkoutCycle) {
    states.formData.planCheckOutDate = dayjs(states.formData.lastCheckOutPassDate)
      .add(states.formData.checkoutCycle, states.formData.cycleType)
      .format('YYYY-MM-DD');
  }
};

// 将添加的行元素的ref数据push到数组中
const setRef = (el: any, type: string, index: number) => {
  // 当是查看或者不可操作的时候
  if (states.updateType == 'read') {
    return;
  }
  if (el) {
    let filterElement = refAll[type].value.find((element) => element.name == el.name);
    // 如果当前元素不存在，则添加
    if (!filterElement) {
      refAll[type].value.push(el);
    } else {
      refAll[type].value[index] = el;
    }
  }
};
const handleSelectionChange = (val) => {
  states.multipleSelection = val;
};

// 新增行
const addColumn = () => {
  const templateDefaultList = {
    paramId: dayjs().valueOf(),
    paramName: '',
    value: '',
    showInQrCode: '0'
  };
  // 只有当勾选了一条数据才能在当前数据下添加，否则在最后添加数据
  if (states.multipleSelection.length == 1) {
    const selectionIndex = states.formData.eqpParamList.reduce((rowIndex, item: any, index) => {
      if (states.multipleSelection[0].paramId == item.paramId) {
        rowIndex = index;
      }
      return rowIndex;
    }, 0);
    states.formData.eqpParamList.splice(selectionIndex + 1, 0, templateDefaultList);
    setTableScrollTop(selectionIndex);
    return;
  }
  states.formData.eqpParamList.push(templateDefaultList);
  setTableScrollTop(states.formData.eqpParamList.length);
};
// 设备table滚动高度
const setTableScrollTop = (length: number) => {
  nextTick(() => {
    eamTableRef.value.setScrollTop(49 * length);
  });
};
// 删除行
const deleteColumn = () => {
  if (!states.multipleSelection.length) {
    E_Msg.newMessage('未选择要删除的数据，请确认后重新操作！', 'warning');
    return;
  }
  const deleteList = states.multipleSelection.map((x: any) => x.paramId);
  states.formData.eqpParamList = states.formData.eqpParamList.filter((x: any) => !deleteList.includes(x.paramId));
};

// 新增数据
const startAddData = (parentId) => {
  states.title = '设备新增';
  states.updateType = 'add';
  states.dialogVisible = true;
  states.formData.eqpTypeId = parentId;
    getParentTree();
//   listOrgTree();
  getDeptAndUserTree();
};
// 修改数据
const startEditData = (editData, type) => {
    getParentTree();
//   listOrgTree();
  getDeptAndUserTree();
  states.title = type == 'edit' ? '设备修改' : '设备查看';
  states.updateType = type;
  states.dialogVisible = true;
  // states.formData.eqpTypeId = editData.eqpTypeId
  //类型转换
  editData.isCncEqp = Number(editData.isCncEqp);
  editData.isEpEqp = Number(editData.isEpEqp);
  editData.isNetEqp = Number(editData.isNetEqp);
  editData.isProdEqp = Number(editData.isProdEqp);
  //使用部门
  editData.useOrgId = editData.useOrgId?Number(editData.useOrgId):undefined;
  //使用成本中心
  editData.costCenter = editData.costCenter?Number(editData.costCenter):undefined;
    //责任人
    editData.dutyId = editData.dutyId?Number(editData.dutyId):undefined;
     //运维组织
     editData.omOrgId = editData.omOrgId?Number(editData.omOrgId):undefined;

  states.formData = editData;
  // nextTick(() => {
  //     states.form = {
  //         plantCode: editData.plantCode, // 编码
  //         plantName: editData.plantName, // 名称
  //         parentId: editData.parentId, // 上级位置
  //         remark: editData.remark, // 备注
  //         id: editData.id, //
  //         branchCompanyIdList: editData.branchCompanyIdList.map(t => t.branchCompanyId),
  //     }
  //     if (type != 'edit') {
  //         // 查看其他组织创建的数据时，避免出现组织显示id的情况
  //         // 获取到组织id和名称
  //         const branchCompanyNameList = editData.branchCompanyName.split(',')
  //         states.formData.branchCompanyIdList.forEach((id, index) => {
  //             if (!states.branchCompanyIdList.find(e => e.id == id)) {
  //                 states.branchCompanyIdList.push({
  //                     name: branchCompanyNameList[index],
  //                     id,
  //                 })
  //             }
  //         })
  //     }
  // })
};
// 根据厂房id获取到其子级的所有id
const getAllChildId = (list) => {
  let ids = [];
  for (let i = 0; i < list.length; i++) {
    // 当前层级的id
    ids.push(list[i].id);
    if (Array.isArray(list[i].children) && list[i].children.length > 0) {
      // 下一层级的id
      ids = ids.concat(getAllChildId(list[i].children));
    }
  }
  return ids;
};
// 根据id获取到其子级数据
const findNode = (tree, func) => {
  for (const node of tree) {
    if (func(node)) return node;
    if (node.children) {
      const res = findNode(node.children, func);
      if (res) return res;
    }
  }
  return null;
};
// 保存方法
const saveData = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('states.form', states.formData);
      const params: any = {
        ...states.formData
      };
      states.saveLoading = true;
      const method = states.updateType == 'edit' ? 'update' : 'save';
      EqpAccountApi[method](params)
        .then(() => {
          E_Msg.newMessage('操作成功');
          handleClose();
          emits('success');
        })
        .catch(() => {
          states.saveLoading = false;
        })
        .finally(() => {
          states.saveLoading = false;
        });
      // if (states.updateType == 'edit') {
      //     if (states.form.parentId == states.formData.id) {
      //         ElMessage({ message: '厂房上级位置不能设置为当前编辑数据', type: 'warning' })
      //         return
      //     }
      //     // 获取当前厂房的子级
      //     const findNodeList = findNode(states.parentList, node => {
      //         return node.id === states.form.id
      //     })
      //     const ids = getAllChildId(findNodeList?.children)
      //     if (ids.includes(states.form.parentId)) {
      //         ElMessage({ message: '上级类别不可选择子类别', type: 'warning' })
      //         return
      //     }
      // }

      // const params: any = {
      //     ...states.form,
      // }
      // states.saveLoading = true
      // const method = states.updateType == 'edit' ? 'update' : 'save'
      // PlantLocationApi[method](params)
      //     .then(() => {
      //         ElMessage({ message: '操作成功', type: 'success' })
      //         handleClose()
      //         emits('success')

      //         states.saveLoading = false
      //     })
      //     .catch(err => {
      //         ElMessage({ message: err.msg || err, type: 'error' })
      //         states.saveLoading = false
      //     })
    }
  });
};
// 获取树
const getParentTree = () => {
  PlantLocationApi.allPlantLocation({}).then((res) => {
    states.plantLocationList = res.data;
  });
};
const handleClose = () => {
  formRef.value.resetFields();
  states.dialogVisible = false;
};

defineExpose({ startAddData, startEditData });
</script>
<style scoped lang="scss">
.direction {
  //top: 1px;
  display: inline-block;
  width: 4px;
  height: 16px;
  margin-right: 8px;
  background-color: #5c84f2;
}
.title {
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  margin-bottom: 16px;
}
.require-star {
  padding-right: 1px;
  color: red;
}
</style>
