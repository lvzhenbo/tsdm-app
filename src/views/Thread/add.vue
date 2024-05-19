<template>
  <IonPage>
    <IonHeader>
      <IonToolbar
        :color="settingStore.isDark ? undefined : 'primary'"
        class="!pt-[var(--safe-area-inset-top)]"
      >
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle> 发表帖子 </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <IonList :inset="true" class="!mb-12">
        <IonItem>
          <IonSelect
            :value="selectType"
            label="分类"
            placeholder="请选择分类"
            cancel-text="取消"
            ok-text="确认"
            @ion-change="selectType = $event.detail.value"
          >
            <IonSelectOption v-for="item in threadTypeList" :key="item.typeid" :value="item.typeid">
              {{ item.name }}
            </IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonInput label="标题" placeholder="请输入标题"></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>
            正文
            <Editor :editor="editor" />
          </IonLabel>
        </IonItem>
      </IonList>
      <CommendTab slot="fixed" :editor="editor" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { htmlToBBCode } from '@/utils/html2bbcode';
  import { useSettingStore } from '@/stores/modules/setting';
  import { newThreadType } from '@/api/forum';
  import { useMyEditor } from '@/composables/useMyEditor';

  interface ThreadType {
    typeid: number;
    name: string;
  }

  defineOptions({
    name: 'ThreadAdd',
  });

  const route = useRoute();
  const { editor, content } = useMyEditor();
  const settingStore = useSettingStore();
  const fid = ref('');
  const threadTypeList = ref<ThreadType[]>([]);
  const selectType = ref(0);

  onMounted(() => {
    if (route.query.fid) {
      fid.value = route.query.fid as string;
      getNewThreadType();
    }
  });

  watch(content, (value) => {
    console.log(value);
    console.log(htmlToBBCode(value));
  });

  const getNewThreadType = async () => {
    try {
      const res = await newThreadType(fid.value);
      if (res.data) {
        const data = JSON.parse(res.data);
        threadTypeList.value = data.typeids;
        selectType.value = data.typeids[0].typeid;
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>

<style scoped></style>
