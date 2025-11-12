<template>
  <div class="p-8">
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" :disabled="!auth.hasPermi('common:commonConfig:edit')">
      <el-row>
        <el-col :span="12">
          <el-form-item label="网站名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入网站名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="网站logo" prop="logo">
            <image-upload-custom v-model="form.logo" :limit="1" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="默认头像" prop="defaultAvatar">
            <image-upload-custom v-model="form.defaultAvatar" :limit="1" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="网站favicon" prop="favicon">
            <image-upload-custom v-model="form.favicon" :limit="1" :file-type="['ico']" :file-size="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-col :span="8">-->
      <!--          <el-form-item label="slogan图片" prop="sloganImg">-->
      <!--            <image-upload-custom v-model="form.sloganImg" :limit="1" />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--        <el-col :span="8">-->
      <!--          <el-form-item label="底部slogan图片" prop="bottomSloganImg" label-width="120px">-->
      <!--            <image-upload-custom v-model="form.bottomSloganImg" :limit="1" />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row>-->
      <!--        <el-col :span="16">-->
      <!--          <el-form-item label="网站slogan" prop="slogan">-->
      <!--            <el-input v-model="form.slogan" placeholder="请输入网站slogan，即网站宣传口号、标语" maxlength="100" show-word-limit />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row>
        <el-col :span="16">
          <el-form-item label="网站版权" prop="copyright">
            <el-input v-model="form.copyright" placeholder="请输入网站版权，例如：Copyright © 2025 xxx公司 All Rights Reserved." maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="网站备案" prop="icp">
            <el-input v-model="form.icp" placeholder="请输入网站版权，例如：蜀ICP备xxx号" maxlength="200" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-col :span="12">-->
      <!--          <el-form-item label="联系方式" prop="contact">-->
      <!--            <el-input v-model="form.contact" placeholder="请输入联系方式" maxlength="500" />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
    </el-form>
    <div v-hasPermi="['common:commonConfig:edit']" class="pl-8 pt-5">
      <el-button type="primary" size="large" class="w-40" @click="submitForm">更 新 修 改</el-button>
    </div>
  </div>
</template>

<script setup name="BaseConfig" lang="ts">
import { addCommonConfig, updateCommonConfig, getCommonConfigByCode } from '@/api/infra/common/commonConfig';
import { CommonConfigVO } from '@/api/infra/common/commonConfig/types';
import auth from '@/plugins/auth';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const commonConfig = ref<CommonConfigVO>();
const formRef = ref<ElFormInstance>();
const form = ref({
  name: undefined,
  logo: undefined,
  favicon: undefined,
  defaultAvatar: undefined,
  slogan: undefined,
  sloganImg: undefined,
  bottomSloganImg: undefined,
  copyright: undefined,
  icp: undefined
  // contact: undefined
});
const formRules = ref({
  name: [{ required: false, message: '名称不能为空', trigger: 'blur' }],
  logo: [{ required: false, message: 'logo不能为空', trigger: 'blur' }],
  favicon: [{ required: false, message: '网站favicon不能为空', trigger: 'blur' }],
  defaultAvatar: [{ required: false, message: '默认头像不能为空', trigger: 'blur' }],
  // slogan: [{ required: false, message: '标语不能为空', trigger: 'blur' }],
  // sloganImg: [{ required: false, message: '标语图片不能为空', trigger: 'blur' }],
  // bottomSloganImg: [{ required: false, message: '底部标语图片不能为空', trigger: 'blur' }],
  copyright: [{ required: false, message: '版权不能为空', trigger: 'blur' }],
  icp: [{ required: false, message: '备案不能为空', trigger: 'blur' }]
  // contact: [{ required: false, message: '联系方式不能为空', trigger: 'blur' }]
});

/** 查询数据 */
const getData = async () => {
  let res = await getCommonConfigByCode('GLOBAL_SITE_INFO');
  if (!res?.data) {
    await addCommonConfig({
      name: '全局网站信息',
      code: 'GLOBAL_SITE_INFO',
      type: 'json',
      detail: JSON.stringify({})
    });
    res = await getCommonConfigByCode('GLOBAL_SITE_INFO');
  }
  commonConfig.value = res.data;
  if (commonConfig.value?.detail) {
    form.value = JSON.parse(commonConfig.value?.detail);
  }
};

/** 提交更新 */
const submitForm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      commonConfig.value.detail = JSON.stringify(form.value);
      await updateCommonConfig(commonConfig.value).finally(() => ({}));
      proxy?.$modal.msgSuccess('更新成功');
      await getData();
    }
  });
};

onMounted(() => {
  getData();
});
</script>
