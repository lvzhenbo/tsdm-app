<template>
  <IonPage>
    <IonContent>
      <IonCard>
        <div class="flex justify-center">
          <IonAvatar class="flex justify-center items-center w-24 h-24">
            <IonImg :src="userStore.userInfo?.avatar" />
          </IonAvatar>
        </div>
        <!-- <IonImg :src="userStore.userInfo?.avatar" class="h-32 w-full" /> -->
        <IonCardHeader>
          <IonCardTitle> {{ userStore.userInfo?.username }} </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="3">UID</IonCol>
              <IonCol> {{ userStore.userInfo?.uid }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">昵称</IonCol>
              <IonCol> {{ userStore.userInfo?.nickname }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">用户组</IonCol>
              <IonCol> {{ groupName }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">阅读权限</IonCol>
              <IonCol> {{ userStore.userInfo?.readaccess }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">注册时间</IonCol>
              <IonCol> {{ regdate }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">CP</IonCol>
              <IonCol> {{ userStore.userInfo?.cpusername || '无' }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">主题数</IonCol>
              <IonCol> {{ userStore.userInfo?.threads }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">回复数</IonCol>
              <IonCol> {{ userStore.userInfo?.posts }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">威望</IonCol>
              <IonCol> {{ userStore.userInfo?.credits }} </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">天使币</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits2
                    ? userStore.userInfo.extcredits2.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">宣传</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits1
                    ? userStore.userInfo.extcredits3.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">天然</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits1
                    ? userStore.userInfo.extcredits4.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">腹黑</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits1
                    ? userStore.userInfo.extcredits5.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">精灵</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits1
                    ? userStore.userInfo.extcredits6.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">月光</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits1
                    ? userStore.userInfo.extcredits7.split(':')[1]
                    : ''
                }}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3">星辉</IonCol>
              <IonCol>
                {{
                  userStore.userInfo?.extcredits1
                    ? userStore.userInfo.extcredits8.split(':')[1]
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
  import { useUserStore } from '@/stores/modules/user';
  import groupList from './groupList.json';
  import { format } from 'date-fns';
  import { zhCN } from 'date-fns/locale';
  import { permissionUserInfo } from '@/api/user';

  defineOptions({
    name: 'UserInfo',
  });

  onMounted(() => {
    getUserInfo();
  });

  const userStore = useUserStore();
  const groupName = computed(() => {
    const group = groupList.find((item) => item.id === userStore.userInfo?.gid);
    return group?.name;
  });
  const regdate = computed(() => {
    if (!userStore.userInfo) return '无';
    return format(new Date(userStore.userInfo.regdate), 'PPP HH:mm', {
      locale: zhCN,
    });
  });

  async function getUserInfo() {
    const res = await permissionUserInfo();
    if (res.data) {
      const data = JSON.parse(res.data);
      console.log(data);
      if (data.status === 0) {
        useUserStore().setUserInfo(data);
      }
    }
  }
</script>

<style scoped></style>
