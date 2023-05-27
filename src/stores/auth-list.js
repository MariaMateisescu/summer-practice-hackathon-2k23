import { defineStore } from "pinia";

export const useAuthListStore = defineStore("authList", {
  state: () => ({
    authList: [],
  }),
  getters: {
    getAuthList: (state) => state.authList,
  },
  actions: {
    addToAuthList(authInfo) {
      // push the authInfo in the authList array
      this.authList.push(authInfo);
    },
    removeFromAuthList(authInfo) {
      // find the index of authInfo
      let index = this.authList.indexOf(authInfo);

      // remove 1 element starting from the index
      if (index !== -1) {
        this.authList.splice(index, 1);
      }
    },
    regenerateCodes() {
      // generate new random codes for each element in the authList
      this.authList.forEach((authInfo) => {
        const randomCode = Math.floor(100000 + Math.random() * 900000);

        // set the code propery to the new generated code
        authInfo["code"] = randomCode;
      });
    },
  },
  persist: true,
});
