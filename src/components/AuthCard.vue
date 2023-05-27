<template>
  <div class="auth-card">
    <div @click="openQR">
      <div class="auth-card__code">{{ authCard.code }}</div>
      <div class="auth-card__name">{{ authCard.name }}</div>
    </div>
    <div>
      <div :class="{ warning: timeRemaining < 6 }">
        {{ timeRemaining }}s remaining
      </div>
      <q-btn icon="delete" color="negative" @click="deleteFromAuthList"
        >Delete</q-btn
      >
    </div>
    <q-dialog
      v-model="qrDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">QR Code</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <img
            class="code-img"
            :src="`http://bwipjs-api.metafloor.com/?bcid=qrcode&text=${authCard.code}`"
            alt=""
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useAuthListStore } from "src/stores/auth-list";

export default defineComponent({
  name: "AuthCard",
  props: ["authCard", "timeRemaining"],
  data() {
    return {
      authListStore: useAuthListStore(),
      qrDialog: false,
    };
  },
  methods: {
    deleteFromAuthList() {
      this.authListStore.removeFromAuthList(this.authCard);
    },
    openQR() {
      this.qrDialog = true;
    },
  },
});
</script>

<style scoped lang="scss">
.auth-card {
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.auth-card__code {
  color: $primary;
  font-size: 20px;
  font-weight: 900;
}
.code-img {
  width: 200px;
  height: 200px;
  margin: 20px;
}
.warning {
  color: $negative;
}
</style>
