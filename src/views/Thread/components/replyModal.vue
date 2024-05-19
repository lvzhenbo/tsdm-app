<template>
  <IonModal :is-open="isOpen" @did-dismiss="isOpen = false">
    <IonHeader>
      <IonToolbar
        :color="settingStore.isDark ? undefined : 'primary'"
        class="!pt-[var(--safe-area-inset-top)]"
      >
        <IonButtons slot="start">
          <IonButton @click="closeFunc(false)">
            <IonIcon slot="icon-only" :icon="close" />
          </IonButton>
        </IonButtons>
        <IonTitle>回复</IonTitle>
        <IonButtons slot="end">
          <!-- 确认按钮 -->
          <IonButton @click="handleReply">
            <IonIcon slot="icon-only" :icon="checkmark" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <IonList :inset="true">
        <IonItem>
          <IonLabel>
            <Editor :editor="editor" class="max-h-[calc(100dvh-12rem)]" />
          </IonLabel>
        </IonItem>
      </IonList>
      <CommendTab slot="fixed" :editor="editor" mode="reply" />
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/stores/modules/setting';
  import { close, checkmark } from 'ionicons/icons';
  import { htmlToBBCode } from '@/utils/html2bbcode';
  import { replyInfo, reply } from '@/api/forum';
  import ClientHash from '@/utils/clientHashPlugin';
  import { useMyEditor } from '@/composables/useMyEditor';
  import { alertController, loadingController } from '@ionic/vue';

  const isOpen = defineModel('isOpen', { type: Boolean, default: false });
  const props = defineProps({
    replyPid: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const route = useRoute();
  const settingStore = useSettingStore();
  const { editor, content } = useMyEditor();
  const info = reactive({
    noticetrimstr: '',
    formhash: '',
    noticeauthor: '',
  });

  watch(isOpen, (val) => {
    if (val) {
      getReplyInfo();
    }
  });

  const closeFunc = (val: boolean) => {
    emits('close', val);
  };

  const getReplyInfo = async () => {
    const loading = await loadingController.create({
      message: '获取信息中...',
    });
    await loading.present();
    try {
      const res = await replyInfo({ repquote: props.replyPid, tid: route.params.tid as string });
      if (res.data) {
        const data = JSON.parse(
          res.data
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            // eslint-disable-next-line no-control-regex
            .replace(/\u0000/g, '')
            // eslint-disable-next-line no-control-regex
            .replace(/\u0014/g, '\\u0014'),
        );
        if (data.status === 0) {
          info.noticetrimstr = data.noticetrimstr;
          info.formhash = data.formhash;
          info.noticeauthor = data.noticeauthor;
        } else {
          throw new Error(data);
        }
      }
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const alert = await alertController.create({
        header: '提示',
        message: '获取信息失败，请重试！',
        buttons: [
          {
            text: '确定',
            role: 'cancel',
            handler: () => {
              closeFunc(false);
            },
          },
        ],
      });
      await alert.present();
      console.error(error);
    }
  };

  const handleReply = async () => {
    const loading = await loadingController.create({
      message: '回复发送中...',
    });
    await loading.present();
    try {
      const { value: clienthash } = await ClientHash.getClientHash({
        value: `TSDM_APP_${info.formhash}`,
      });
      const res = await reply({
        ...info,
        reppid: props.replyPid,
        clienthash,
        message: htmlToBBCode(content.value),
        tid: route.params.tid as string,
      });
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          await loading.dismiss();
          const alert = await alertController.create({
            header: '提示',
            message: '回复成功！',
            buttons: [
              {
                text: '确定',
                role: 'cancel',
                handler: () => {
                  closeFunc(true);
                  content.value = '';
                },
              },
            ],
          });
          await alert.present();
        } else {
          throw new Error(data);
        }
      }
    } catch (error) {
      await loading.dismiss();
      const alert = await alertController.create({
        header: '提示',
        message: '回复失败，请重试！',
        buttons: [
          {
            text: '确定',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
      console.error(error);
    }
  };
</script>

<style scoped></style>
