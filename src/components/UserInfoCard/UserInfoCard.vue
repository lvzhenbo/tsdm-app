<template>
  <IonCard>
    <div class="flex justify-center">
      <IonAvatar class="flex justify-center items-center w-24 h-24">
        <IonImg :src="userInfo?.avatar" />
      </IonAvatar>
    </div>
    <IonCardHeader>
      <IonCardTitle> {{ userInfo?.username }} </IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <IonGrid>
        <IonRow>
          <IonCol size="3">UID</IonCol>
          <IonCol> {{ userInfo?.uid }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">昵称</IonCol>
          <IonCol> {{ userInfo?.nickname }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">用户组</IonCol>
          <IonCol> {{ groupName }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">阅读权限</IonCol>
          <IonCol> {{ userInfo?.readaccess }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">注册时间</IonCol>
          <IonCol> {{ regdate }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">CP</IonCol>
          <IonCol> {{ userInfo?.cpusername || '无' }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">主题数</IonCol>
          <IonCol> {{ userInfo?.threads }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">回复数</IonCol>
          <IonCol> {{ userInfo?.posts }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">威望</IonCol>
          <IonCol> {{ userInfo?.credits }} </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">天使币</IonCol>
          <IonCol>
            {{ userInfo?.extcredits2 ? userInfo.extcredits2.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">宣传</IonCol>
          <IonCol>
            {{ userInfo?.extcredits1 ? userInfo.extcredits3.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">天然</IonCol>
          <IonCol>
            {{ userInfo?.extcredits1 ? userInfo.extcredits4.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">腹黑</IonCol>
          <IonCol>
            {{ userInfo?.extcredits1 ? userInfo.extcredits5.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">精灵</IonCol>
          <IonCol>
            {{ userInfo?.extcredits1 ? userInfo.extcredits6.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">月光</IonCol>
          <IonCol>
            {{ userInfo?.extcredits1 ? userInfo.extcredits7.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="3">星辉</IonCol>
          <IonCol>
            {{ userInfo?.extcredits1 ? userInfo.extcredits8.split(':')[1] : '' }}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCardContent>
  </IonCard>
</template>

<script setup lang="ts">
  import { type PropType } from 'vue';
  import { type UserInfo } from '@/stores/modules/user';
  import groupList from './groupList.json';
  import { format } from 'date-fns';
  import { zhCN } from 'date-fns/locale';

  const props = defineProps({
    userInfo: {
      type: Object as PropType<UserInfo>,
      required: true,
    },
  });

  const groupName = computed(() => {
    const group = groupList.find((item) => item.id === props.userInfo?.gid);
    return group?.name;
  });
  const regdate = computed(() => {
    if (!props.userInfo) return '无';
    return format(new Date(props.userInfo.regdate), 'PPP HH:mm', {
      locale: zhCN,
    });
  });
</script>

<style scoped></style>
