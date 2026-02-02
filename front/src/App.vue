<script setup lang="ts">
import Cursor from "./components/Cursor.vue";
import GlobalMenu from "./components/GlobalMenu.vue";
import PopupInformation from "./components/PopupInformation.vue";

const popupInformation = ref<string>("");
const popupState = ref<boolean>(false);

function activatePopup(data: string) {
  popupInformation.value = data;
  popupState.value = true;
}

function disablePopup() {
  popupInformation.value = "";
  popupState.value = false;
}
</script>

<template>
  <Cursor />

  <PopupInformation
    class="popupInformation"
    :isActive="popupState"
    :content="popupInformation"
  />

  <div class="page_container">
    <GlobalMenu @activatePopup="activatePopup" @disablePopup="disablePopup" />

    <main>
      <RouterView @activatePopup="activatePopup" @disablePopup="disablePopup" />
    </main>
  </div>
</template>

<style lang="scss">
body {
  cursor: none !important;
}
.page_container {
}
</style>
