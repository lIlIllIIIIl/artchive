<script setup lang="ts">
import Cursor from './components/Cursor.vue';
import GlobalMenu from './components/GlobalMenu.vue';
import PopupInformation from './components/PopupInformation.vue';
import WelcomeIntroModal from './components/WelcomeIntroModal.vue';

const popupInformation = ref<string>('');
const popupState = ref<boolean>(false);

function activatePopup(data: string) {
  popupInformation.value = data;
  popupState.value = true;
}

function disablePopup() {
  popupInformation.value = '';
  popupState.value = false;
}
</script>

<template>
  <Cursor />

  <WelcomeIntroModal />

  <PopupInformation
    class="popupInformation"
    :isActive="popupState"
    :content="popupInformation"
  />

  <div class="page_container">
    <GlobalMenu @activatePopup="activatePopup" @disablePopup="disablePopup" />

    <main>
      <RouterView v-slot="{ Component, route }">
        <Transition name="page-fade" mode="out-in">
          <div :key="route.fullPath" class="page_route-view">
            <component
              :is="Component"
              @activatePopup="activatePopup"
              @disablePopup="disablePopup"
            />
          </div>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style lang="scss">
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.page_route-view {
  width: 100%;
}
</style>
