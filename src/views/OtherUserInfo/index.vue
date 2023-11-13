<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle> 个人资料 </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <div v-if="loading" class="flex justify-center h-full items-center">
        <IonSpinner name="circular"></IonSpinner>
      </div>
      <IonCard v-if="!loading">
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
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { otherUserInfo } from '@/api/user';
  import groupList from '@/views/UserInfo/groupList.json';
  import { format } from 'date-fns';
  import { zhCN } from 'date-fns/locale';
  import { type UserInfo } from '@/stores/modules/user';
  import { toastController } from '@ionic/vue';

  const route = useRoute();
  const router = useRouter();
  const username = route.params.username as string;
  const userInfo = ref<UserInfo | null>(null);
  const toast = ref<null | HTMLIonToastElement>(null);
  const loading = ref(false);

  const groupName = computed(() => {
    if (!userInfo.value?.gid) {
      return '无';
    } else {
      const group = groupList.find((item) => item.id === userInfo.value?.gid);
      return group?.name;
    }
  });
  const regdate = computed(() => {
    if (!userInfo.value?.regdate) {
      return '无';
    } else {
      return format(new Date(userInfo.value.regdate), 'PPP HH:mm', {
        locale: zhCN,
      });
    }
  });

  defineOptions({
    name: 'OtherotherUserInfo',
  });

  onMounted(() => {
    getOtherotherUserInfo();
  });

  async function getOtherotherUserInfo() {
    loading.value = true;
    const res = await otherUserInfo(username);
    if (res.data) {
      const data = JSON.parse(res.data);
      if (data.status === 0) {
        userInfo.value = data;
      } else {
        notLoggedInToast();
      }
    }
    loading.value = false;
  }

  async function notLoggedInToast() {
    toast.value = await toastController.create({
      message: '您没有权限查看该板块',
      duration: 5000,
      position: 'bottom',
      buttons: [
        {
          text: '刷新',
          role: 'refresh',
          handler: () => {
            handleToLogin();
          },
        },
      ],
    });
    await toast.value.present();
  }

  const handleToLogin = () => {
    router.push({
      name: 'Login',
    });
  };
</script>

<style scoped></style>
