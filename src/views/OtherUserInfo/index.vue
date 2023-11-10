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
    <IonContent>
      <div class="flex justify-center">
        <IonItem v-if="loading" lines="none" class="flex justify-center items-center">
          <IonSpinner name="circular"></IonSpinner>
        </IonItem>
      </div>
      <IonCard v-if="visible">
        <div class="flex justify-center">
          <IonAvatar class="flex justify-center items-center w-24 h-24">
            <IonImg :src="userStore.otherUserInfo?.avatar" />
          </IonAvatar>
        </div>
        <IonCardHeader>
          <IonCardTitle> {{ userStore.otherUserInfo?.username }} </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="3">UID</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.uid }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">昵称</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.nickname }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">用户组</IonCol>
              <IonCol> {{ groupName }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">阅读权限</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.readaccess }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">注册时间</IonCol>
              <IonCol> {{ regdate }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">CP</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.cpusername || '无' }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">主题数</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.threads }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">回复数</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.posts }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">威望</IonCol>
              <IonCol> {{ userStore.otherUserInfo?.credits }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">天使币</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits2
                    ? userStore.otherUserInfo.extcredits2.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">宣传</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits1
                    ? userStore.otherUserInfo.extcredits3.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">天然</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits1
                    ? userStore.otherUserInfo.extcredits4.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">腹黑</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits1
                    ? userStore.otherUserInfo.extcredits5.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">精灵</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits1
                    ? userStore.otherUserInfo.extcredits6.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">月光</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits1
                    ? userStore.otherUserInfo.extcredits7.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">星辉</IonCol>
              <IonCol>
                {{
                  userStore.otherUserInfo?.extcredits1
                    ? userStore.otherUserInfo.extcredits8.split(':')[1]
                    : ''
                }}
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
  import { useUserStore } from '@/stores/modules/user';
  import { toastController } from '@ionic/vue';

  const route = useRoute();
  const router = useRouter();
  const username = route.params.username as string;
  const userStore = useUserStore();
  const toast = ref<null | HTMLIonToastElement>(null);
  const loading = ref(false);
  const visible = ref(false);

  const groupName = computed(() => {
    const group = groupList.find((item) => item.id === userStore.otherUserInfo?.gid);
    return group?.name;
  });
  const regdate = computed(() => {
    if (!userStore.otherUserInfo) return '无';
    return format(new Date(userStore.otherUserInfo.regdate), 'PPP HH:mm', {
      locale: zhCN,
    });
  });

  defineOptions({
    name: 'OtherotherUserInfo',
  });

  onMounted(() => {
    getOtherotherUserInfo();
  });

  async function getOtherotherUserInfo() {
    visible.value = false;
    loading.value = true;
    const res = await otherUserInfo(username);
    if (res.data) {
      const data = JSON.parse(res.data);
      if (data.status === 0) {
        userStore.otherUserInfo = data;
      } else {
        notLoggedInToast();
      }
    }
    loading.value = false;
    visible.value = true;
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
