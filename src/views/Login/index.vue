<template>
  <IonPage>
    <IonContent>
      <div class="px-5 py-2.5">
        <div>
          <IonInput
            ref="usernameInput"
            label="用户名"
            label-placement="floating"
            mode="md"
            fill="solid"
            error-text="请输入用户名"
            :value="fromData.username"
            @ion-input="
              (e) => {
                fromData.username = e.detail.value!;
                usernameInput?.$el.classList.remove('ion-invalid');
              }
            "
            @ion-blur="usernameInput?.$el.classList.add('ion-touched')"
          />
        </div>
        <div class="my-1">
          <IonInput
            ref="passwordInput"
            label="密码"
            label-placement="floating"
            mode="md"
            fill="solid"
            type="password"
            error-text="请输入密码"
            :value="fromData.password"
            @ion-input="
              (e) => {
                fromData.password = e.detail.value!;
                passwordInput?.$el.classList.remove('ion-invalid');
              }
            "
            @ion-blur="passwordInput?.$el.classList.add('ion-touched')"
          />
        </div>
        <div class="mb-1">
          <IonInput
            ref="verifyInput"
            label="验证码"
            label-placement="floating"
            mode="md"
            fill="solid"
            error-text="请输入验证码"
            :value="fromData.verify"
            @ion-input="
              (e) => {
                fromData.verify = e.detail.value!;
                verifyInput?.$el.classList.remove('ion-invalid');
              }
            "
            @ion-blur="verifyInput?.$el.classList.add('ion-touched')"
          />
        </div>
        <div class="flex justify-center w-full h-[calc(((100vw-2.5rem)/4*3)/32*15)]">
          <div v-if="codeLoading" class="w-full h-full flex justify-center items-center">
            <IonSpinner color="primary" />
          </div>
          <IonImg v-else class="w-3/4 h-auto" :src="codeImg" alt="验证码" @click="getCode" />
        </div>
        <IonButton expand="block" @click="handleLogin">登录</IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { alertController, loadingController, IonInput } from '@ionic/vue';
  import { setCookie } from '@/utils/cookie';
  import { captcha, login, userInfo } from '@/api/user';
  import { useUserStore } from '@/stores/modules/user';

  defineOptions({
    name: 'LoginIndex',
  });

  const router = useRouter();
  const userStore = useUserStore();
  const codeImg = ref('');
  const codeLoading = ref(false);
  const fromData = ref({
    username: '',
    password: '',
    verify: '',
  });
  const usernameInput = ref<InstanceType<typeof IonInput> | null>(null);
  const passwordInput = ref<InstanceType<typeof IonInput> | null>(null);
  const verifyInput = ref<InstanceType<typeof IonInput> | null>(null);

  onMounted(() => {
    usernameInput.value?.$el.classList.add('ion-touched');
    passwordInput.value?.$el.classList.add('ion-touched');
    verifyInput.value?.$el.classList.add('ion-touched');
    getCode();
  });

  async function getCode() {
    try {
      fromData.value.verify = '';
      codeLoading.value = true;
      const res = await captcha();
      if (res.data) {
        codeImg.value = 'data:image/png;base64,' + res.data;
      }
      codeLoading.value = false;
    } catch (error) {
      console.error(error);
      codeLoading.value = false;
    }
  }

  const handleLogin = async () => {
    const loading = await loadingController.create({
      message: '登录中...',
    });
    try {
      if (!vaildForm()) {
        return;
      }
      await loading.present();
      const res = await login({
        username: fromData.value.username,
        password: fromData.value.password,
        tsdm_verify: fromData.value.verify,
      });
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          const cookies = res.headers['Set-Cookie'].replace(/secure,/g, 'secure;');
          await setCookie(cookies);
          await getUserInfo(data.values.uid);
          await loading.dismiss();
          const alert = await alertController.create({
            header: '提示',
            message: '登录成功',
            buttons: [
              {
                text: '确定',
                role: 'cancel',
                handler: () => {
                  router.back();
                },
              },
            ],
          });
          await alert.present();
        } else {
          console.error(data);
          getCode();
          await loading.dismiss();
          if (data.message === 'err_login_captcha_invalid') {
            const alert = await alertController.create({
              header: '错误',
              message: '验证码错误',
              buttons: [
                {
                  text: '确定',
                  role: 'cancel',
                },
              ],
            });
            await alert.present();
          } else if (data.message === 'login_invalid') {
            const alert = await alertController.create({
              header: '错误',
              message: '用户名或密码错误',
              buttons: [
                {
                  text: '确定',
                  role: 'cancel',
                },
              ],
            });
            await alert.present();
          } else {
            const alert = await alertController.create({
              header: '错误',
              message: data.message,
              buttons: [
                {
                  text: '确定',
                  role: 'cancel',
                },
              ],
            });
            await alert.present();
          }
        }
      }
    } catch (error) {
      await loading.dismiss();
      console.error(error);
    }
  };

  function vaildForm() {
    if (!fromData.value.username || !fromData.value.password || !fromData.value.verify) {
      if (!fromData.value.username) {
        usernameInput.value?.$el.classList.add('ion-invalid');
      }
      if (!fromData.value.password) {
        passwordInput.value?.$el.classList.add('ion-invalid');
      }
      if (!fromData.value.verify) {
        verifyInput.value?.$el.classList.add('ion-invalid');
      }
      return false;
    }
    return true;
  }

  async function getUserInfo(uid: string) {
    try {
      const res = await userInfo(uid);
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          userStore.setUserInfo(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>
