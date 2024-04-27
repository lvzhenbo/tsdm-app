<template>
  <IonMenu menu-id="main-menu" content-id="main-page">
    <IonHeader>
      <IonToolbar
        :color="settingStore.isDark ? undefined : 'primary'"
        class="!pt-[var(--safe-area-inset-top)]"
      >
        <div slot="start" class="p-2">
          <IonAvatar class="flex justify-center items-center">
            <IonIcon v-if="!userStore.userInfo" :icon="personCircle" class="text-6xl"></IonIcon>
            <IonImg v-else :src="userStore.userInfo.avatar" />
          </IonAvatar>
        </div>
        <IonTitle v-if="!userStore.userInfo" @click="handleToLogin">请登录</IonTitle>
        <IonTitle v-else>{{ userStore.userInfo!.username }}</IonTitle>
        <IonButtons v-if="userStore.userInfo" slot="primary" class="mr-4">
          <IonButton fill="outline" shape="round" :disabled="signInLoading" @click="handleSignin">
            {{ signInTitle }}
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList lines="none">
        <IonMenuToggle>
          <IonItem button @click="handleTo('/home')">
            <IonIcon slot="start" aria-hidden="true" :icon="home"></IonIcon>
            <IonLabel>首页</IonLabel>
          </IonItem>
          <IonItem button @click="handleTo('/notification')">
            <IonIcon slot="start" aria-hidden="true" :icon="notifications"></IonIcon>
            <IonLabel>通知</IonLabel>
          </IonItem>
          <IonItem button @click="handleTo('/userInfo', true)">
            <IonIcon slot="start" aria-hidden="true" :icon="person"></IonIcon>
            <IonLabel>我的资料</IonLabel>
          </IonItem>
          <IonItem button @click="openUrl({ url: baseUrl })">
            <IonIcon slot="start" aria-hidden="true" :icon="globe"></IonIcon>
            <IonLabel>网页论坛</IonLabel>
          </IonItem>
          <IonItem button @click="handleTo('/settings')">
            <IonIcon slot="start" aria-hidden="true" :icon="settings"></IonIcon>
            <IonLabel>设置</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonList>
    </IonContent>
  </IonMenu>
</template>

<script setup lang="ts">
  import { menuController, alertController } from '@ionic/vue';
  import { personCircle, home, person, globe, settings, notifications } from 'ionicons/icons';
  import { useUserStore } from '@/stores/modules/user';
  import { getStorage, openUrl, setStorage } from '@/utils';
  import { useSettingStore } from '@/stores/modules/setting';
  import { signIn } from '@/api/user';
  import { autoSignInKey, type AutoSignInValue } from '@/utils/provideInjectType';
  import ClientHash from '@/utils/clientHashPlugin';
  import { formatISO } from 'date-fns';
  import { baseUrl } from '@/utils/config';

  defineOptions({
    name: 'MenuLayout',
  });

  const router = useRouter();
  const userStore = useUserStore();
  const signInLoading = ref(false);
  const settingStore = useSettingStore();
  const localConfig = settingStore.config;
  const { autoSignIn } = inject(autoSignInKey) as AutoSignInValue;
  const signInTitle = computed(() => {
    if (signInLoading.value) {
      return '签到中';
    } else if (
      userStore.signInDate === formatISO(new Date(), { representation: 'date' }) ||
      isSignIn.value
    ) {
      return '已签到';
    }
    return '签到';
  });
  const isSignIn = ref(false);

  onMounted(() => {
    getUserInfo();
  });

  watch(
    () => autoSignIn.value,
    (val) => {
      if (val) {
        handleSignin();
      }
    },
  );

  const handleToLogin = async () => {
    await menuController.close('main-menu');
    router.push('/login');
  };

  const handleTo = async (path: string, auth = false) => {
    if (auth && !userStore.userInfo) {
      const alert = await alertController.create({
        header: '提示',
        message: '请先登录',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
          },
          {
            text: '确定',
            role: 'confirm',
            handler: () => {
              router.push('/login');
            },
          },
        ],
      });
      await alert.present();
      return;
    }
    router.push(path);
  };

  const getUserInfo = async () => {
    const res = await getStorage('userInfo');
    if (res) {
      userStore.setUserInfo(res);
    }
  };

  const handleSignin = async () => {
    const { value } = await ClientHash.getClientHash({
      value: `${userStore.userInfo?.uid}_${userStore.userInfo?.username}`,
    });
    console.log('Response from native:', value);
    try {
      signInLoading.value = true;
      const res = await signIn({
        client_hash: value,
        emotion: localConfig?.emotion ?? '1',
        comment: localConfig?.comment ?? 'Android客户端签到',
      });
      if (res.data) {
        if (res.data.status === -1) {
          let message = '签到失败，请稍后重试';
          if (res.data.message === 'already_signed') {
            message = '您今天已经签到过了，明天再来吧~';
            isSignIn.value = true;
          }
          if (!autoSignIn.value) {
            const alert = await alertController.create({
              header: '每日签到',
              message,
              buttons: ['确定'],
            });
            await alert.present();
          }
        } else {
          const alert = await alertController.create({
            header: '每日签到',
            message: `签到成功，获得${res.data.reward_value}天使币`,
            buttons: ['确定'],
          });
          await alert.present();
          const tempTime = Date.now();
          setStorage('storedStamp', tempTime);
          setStorage('storedDate', formatISO(new Date(tempTime), { representation: 'date' }));
          isSignIn.value = true;
        }
      }
      signInLoading.value = false;
    } catch (error) {
      const alert = await alertController.create({
        header: '错误',
        message: '签到失败，请稍后重试',
        buttons: ['确定'],
      });
      await alert.present();
      signInLoading.value = false;
    }
  };
</script>

<style scoped></style>
