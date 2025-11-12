<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-collapse v-model="activeNames" :expand-icon-position="'left'">
            <el-collapse-item name="defaultSearch" :icon="CaretRight">
              <template #title="{ isActive }">
                <div :class="['title-wrapper', { 'is-active': isActive }]">搜索条件</div>
              </template>
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="分类" label-width="50px" prop="categoryCode">
                  <el-tree-select
                    v-model="queryParams.categoryCode"
                    :data="commonContentCategoryTreeList"
                    :props="{ value: 'code', label: 'name', children: 'children' }"
                    value-key="code"
                    placeholder="请选择分类"
                    check-strictly
                    clearable
                  />
                </el-form-item>
                <el-form-item label="标题" prop="title">
                  <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="内容类型" prop="contentType">
                  <el-select v-model="queryParams.contentType" placeholder="请选择内容类型" clearable>
                    <el-option v-for="dict in common_content_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <!--                <el-form-item label="来源" prop="source">-->
                <!--                  <el-input v-model="queryParams.source" placeholder="请输入来源" label-width="50px" clearable @keyup.enter="handleQuery" />-->
                <!--                </el-form-item>-->
                <!--            <el-form-item label="关键字、标签" prop="keywordTag" label-width="100px">-->
                <!--              <el-input v-model="queryParams.keywordTag" placeholder="请输入关键字、标签" clearable @keyup.enter="handleQuery" />-->
                <!--            </el-form-item>-->
                <el-form-item label="跳转类型" prop="redirectType">
                  <el-select v-model="queryParams.redirectType" placeholder="请选择跳转类型" clearable>
                    <el-option v-for="dict in redirect_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="置顶标识" prop="topFlag">
                  <el-select v-model="queryParams.topFlag" placeholder="请选择置顶标识" clearable>
                    <el-option v-for="dict in common_flag" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                    <el-option v-for="dict in common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:content:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:content:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['adminCommon:content:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              >删除</el-button
            >
          </el-col>
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['adminCommon:content:export']">导出</el-button>-->
          <!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="commonContentList" @selection-change="handleSelectionChange" border height="550" i>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-if="true" label="id" align="center" width="280" prop="id" />
        <!--        <el-table-column label="分类编码" align="center" prop="categoryCode" />-->
        <el-table-column label="标题" align="center" prop="title">
          <template #default="scope">
            <el-tag v-if="scope.row.title" type="info">{{ scope.row.title }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center" prop="categoryName">
          <template #default="scope">
            <el-tag v-if="scope.row.categoryName" type="warning">{{ scope.row.categoryName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容类型" align="center" prop="contentType">
          <template #default="scope">
            <dict-tag :options="common_content_type" :value="scope.row.contentType" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="简要描述" align="center" prop="briefDesc" />-->
        <el-table-column label="封面图片" align="center" prop="coverPictures" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.coverPictures" :width="80" :height="80" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="详细介绍描述" align="center" prop="detailIntroDesc" />-->
        <!--        <el-table-column label="视频地址" align="center" prop="videoUrls" />-->
        <!--        <el-table-column label="文件、附件地址" align="center" prop="fileUrls" />-->
        <el-table-column label="跳转类型" align="center" prop="redirectType">
          <template #default="scope">
            <dict-tag :options="redirect_type" :value="scope.row.redirectType" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="跳转值、路径、链接" align="center" prop="redirectValue" />-->
        <!--        <el-table-column label="跳转参数" align="center" prop="redirectParam" />-->
        <!--        <el-table-column label="来源" align="center" prop="source" />-->
        <!--        <el-table-column label="关键字、标签" align="center" prop="keywordTag" />-->
        <!--        <el-table-column label="作者名称" align="center" prop="authorName" />-->
        <el-table-column label="置顶" align="center" prop="topFlag" width="80">
          <template #default="scope">
            <dict-tag :options="common_flag" :value="scope.row.topFlag" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="额外信息" align="center" prop="extInfo" />-->
        <el-table-column label="排序" align="center" prop="sort" width="80" />
        <!--        <el-table-column label="发布时间" align="center" prop="publicTime" width="180">-->
        <!--          <template #default="scope">-->
        <!--            <span>{{ proxy.parseTime(scope.row.publicTime) }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="访问数" align="center" prop="accessNum" width="80" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="common_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="开始时间" align="center" prop="startTime" width="180">-->
        <!--          <template #default="scope">-->
        <!--            <span>{{ proxy.parseTime(scope.row.startTime) }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="结束时间" align="center" prop="endTime" width="180">-->
        <!--          <template #default="scope">-->
        <!--            <span>{{ proxy.parseTime(scope.row.endTime) }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button v-hasPermi="['adminCommon:content:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['adminCommon:content:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
    <!-- 添加或修改通用内容对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" center width="1200px" draggable append-to-body>
      <el-form ref="commonContentFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="分类" prop="categoryCode">
              <el-tree-select
                v-model="form.categoryCode"
                :data="commonContentCategoryTreeList"
                :props="{ value: 'code', label: 'name', children: 'children' }"
                value-key="code"
                placeholder="请选择分类"
                check-strictly
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="2"> </el-col>
          <el-col :span="10">
            <el-form-item label="内容类型" prop="contentType">
              <el-select v-model="form.contentType" placeholder="请选择内容类型">
                <el-option v-for="dict in common_content_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="简要描述" prop="briefDesc">
              <el-input v-model="form.briefDesc" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="form.startTime" clearable type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="form.endTime" clearable type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-text style="line-height: 30px; color: red; margin-left: 5px"> 设置结束时间后，在到达时间后，自动停用 </el-text>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="跳转类型" prop="redirectType">
              <el-select v-model="form.redirectType" placeholder="请选择跳转类型">
                <el-option v-for="dict in redirect_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="跳转链接" prop="redirectValue">
              <el-input v-model="form.redirectValue" placeholder="请输入跳转值、路径、链接" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="跳转参数" prop="redirectParam">
              <el-input v-model="form.redirectParam" placeholder="请输入跳转参数" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="来源" prop="source">
              <el-input v-model="form.source" placeholder="请输入来源" />
            </el-form-item>
          </el-col>
          <el-col :span="2"> </el-col>
          <el-col :span="10">
            <el-form-item label="关键字、标签" prop="keywordTag">
              <el-input v-model="form.keywordTag" placeholder="请输入关键字、标签" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="作者名称" prop="authorName">
              <el-input v-model="form.authorName" placeholder="请输入作者名称" />
            </el-form-item>
          </el-col>
          <el-col :span="2"> </el-col>
          <el-col :span="10">
            <el-form-item label="发布时间" prop="publicTime">
              <el-date-picker v-model="form.publicTime" clearable type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择发布时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="置顶标识" prop="topFlag">
              <el-select v-model="form.topFlag" placeholder="请选择置顶标识">
                <el-option v-for="dict in common_flag" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"> </el-col>
          <el-col :span="10">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" placeholder="请输入排序" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in common_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverPictures">
          <image-upload v-model="form.coverPictures" :limit="5" />
        </el-form-item>
        <!--        <el-form-item label="视频" prop="videoUrls">-->
        <!--          <file-upload v-model="form.videoUrls" />-->
        <!--        </el-form-item>-->
        <el-form-item label="文件、附件" prop="fileUrls">
          <file-upload v-model="form.fileUrls" />
        </el-form-item>
        <el-form-item label="详细介绍描述">
          <editor v-model="form.detailIntroDesc" :min-height="192" />
        </el-form-item>
        <el-form-item label="额外信息" prop="extInfo">
          <json-editor v-model:text="form.extInfo" style="width: 800px" height="400" mode="text" />
        </el-form-item>
        <el-form-item label="访问量" prop="accessNum">
          <el-input-number v-model="form.accessNum" placeholder="请输入访问量" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CommonContent" lang="ts">
import { listCommonContent, getCommonContent, delCommonContent, addCommonContent, updateCommonContent } from '@/api/infra/common/commonContent';
import { CommonContentVO, CommonContentQuery, CommonContentForm } from '@/api/infra/common/commonContent/types';
import {
  treeListCommonContentCategory,
  listCommonContentCategory,
  getCommonContentCategory,
  delCommonContentCategory,
  addCommonContentCategory,
  updateCommonContentCategory
} from '@/api/infra/common/commonContentCategory';
import { CommonContentCategoryVO, CommonContentCategoryQuery, CommonContentCategoryForm } from '@/api/infra/common/commonContentCategory/types';
import JsonEditor from 'vue3-ts-jsoneditor';
import { CaretRight } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { redirect_type, common_content_type, common_flag, common_status } = toRefs<any>(
  proxy?.useDict('redirect_type', 'common_content_type', 'common_flag', 'common_status')
);

const commonContentCategoryTreeList = ref<CommonContentCategoryVO[]>([]);
const commonContentList = ref<CommonContentVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const commonContentFormRef = ref<ElFormInstance>();
const activeNames = ref(['defaultSearch']);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CommonContentForm = {
  id: undefined,
  categoryCode: undefined,
  title: undefined,
  contentType: undefined,
  briefDesc: undefined,
  coverPictures: undefined,
  detailIntroDesc: undefined,
  videoUrls: undefined,
  fileUrls: undefined,
  startTime: undefined,
  endTime: undefined,
  redirectType: undefined,
  redirectValue: undefined,
  redirectParam: undefined,
  source: undefined,
  keywordTag: undefined,
  authorName: undefined,
  publicTime: undefined,
  accessNum: 0,
  topFlag: 0,
  extInfo: undefined,
  sort: 100,
  status: '1'
};
const data = reactive<PageData<CommonContentForm, CommonContentQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    categoryCode: undefined,
    title: undefined,
    contentType: undefined,
    briefDesc: undefined,
    coverPictures: undefined,
    detailIntroDesc: undefined,
    videoUrls: undefined,
    fileUrls: undefined,
    startTime: undefined,
    endTime: undefined,
    redirectType: undefined,
    redirectValue: undefined,
    redirectParam: undefined,
    source: undefined,
    keywordTag: undefined,
    authorName: undefined,
    publicTime: undefined,
    accessNum: undefined,
    topFlag: undefined,
    extInfo: undefined,
    sort: undefined,
    status: undefined
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    categoryCode: [{ required: true, message: '分类编码不能为空', trigger: 'change' }],
    title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    contentType: [{ required: true, message: '内容类型不能为空', trigger: 'change' }],
    redirectType: [{ required: true, message: '跳转类型不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通用内容分类树列表 */
const getCommonContentCategoryTreeList = async () => {
  const res = await treeListCommonContentCategory();
  commonContentCategoryTreeList.value = res.data;
};

/** 查询通用内容列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCommonContent(queryParams.value);
  commonContentList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  commonContentFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: CommonContentVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加通用内容';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CommonContentVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCommonContent(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改通用内容';
};

/** 提交按钮 */
const submitForm = () => {
  commonContentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCommonContent(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCommonContent(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CommonContentVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除通用内容编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delCommonContent(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'infra/admin/common/content/export',
    {
      ...queryParams.value
    },
    `commonContent_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  getCommonContentCategoryTreeList();
});
</script>
