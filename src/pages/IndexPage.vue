<template>
  <q-page class="flex column index-page">
    <div class="authentication-card-list">
      <strong>Time remaining: {{ timeRemaining }} seconds</strong>
      <AuthCard
        v-for="authCard in authList"
        :key="authCard.code"
        :authCard="authCard"
        :timeRemaining="timeRemaining"
      />
    </div>
    <q-dialog
      v-model="dialog"
      filled
      @hide="name = ''"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add authentication</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="input-name">
            <q-input v-model="name" label="Name" />
            <q-btn @click="generateRandomName">Generate Random Name</q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn @click="addToAuthList" color="primary">Add</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-btn
      round
      color="primary"
      icon="add"
      class="add-button"
      size="lg"
      @click="openDialog"
    />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useAuthListStore } from "src/stores/auth-list";
import AuthCard from "src/components/AuthCard.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    AuthCard,
  },
  data() {
    return {
      authList: [],
      dialog: false,
      authListStore: useAuthListStore(),
      name: "",
      currentTime: new Date().getSeconds(),
    };
  },
  computed: {
    timeRemaining() {
      // compute the remaining time
      if (this.currentTime > 30) return 60 - this.currentTime;
      else return 30 - this.currentTime;
    },
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },

    async generateRandomName() {
      // get a random number from interval
      // Math.floor(Math.random() * (max - min + 1)) + min
      const randomNumber = Math.floor(Math.random() * (82 - 1 + 1) + 1);

      // get data about a person
      const person = await this.$axios.get(
        `https://swapi.dev/api/people/${randomNumber}`
      );

      // get the person's name
      this.name = person.data.name;
    },

    addToAuthList() {
      // generate a random 6-digit code
      const randomCode = Math.floor(100000 + Math.random() * 900000);

      // add the generated code to the store
      this.authListStore.addToAuthList({ name: this.name, code: randomCode });

      //close the dialog
      this.dialog = false;
    },

    regenerateCodes() {
      this.authListStore.regenerateCodes();
    },
  },
  mounted() {
    // get the authList from the store
    this.authList = this.authListStore.getAuthList;

    // update current time every second
    window.setInterval(() => {
      this.currentTime = new Date().getSeconds();
    }, 1000);
  },

  watch: {
    //trigger a function when a property changes
    currentTime(newValue, oldValue) {
      // watch for changes
      if (newValue === 0 || newValue === 30) {
        // regenerate expired codes
        this.regenerateCodes();
      }
    },
  },
});
</script>

<style scoped>
.add-button {
  position: absolute;
  bottom: 30px;
  right: 30px;
}
.input-name {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.authentication-card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
