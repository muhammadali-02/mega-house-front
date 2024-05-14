<template>
  <q-layout v-if="!$q.screen.xs&&!$q.screen.sm" view="hHh LpR fff">
    <!--         Header         -->
    <q-header class="shadow-5 header-border-radius" :class="$q.dark.isActive?'gradient-dark-left-1':'gradient-light-left-1 text-blue-grey-8'">
      <q-toolbar>
        <q-btn dense flat round icon="clear_all" size="18px" @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          <q-img v-if="$q.dark.isActive" src="../assets/header-logo-dark.png" alt="logo" :width="$q.screen.xs?'200px':'260px'" class="cursor-pointer" @click="$router.push('/')"/>
          <q-img v-else src="../assets/header-logo-light.png" alt="logo" :width="$q.screen.xs?'200px':'260px'" class="cursor-pointer" @click="$router.push('/')"/>
        </q-toolbar-title>
        <q-btn v-if="!$q.screen.xs" @click="dark=!dark" flat round dense :icon="$q.dark.isActive?'light_mode':'dark_mode'" :color="$q.dark.isActive?'warning':'blue-4'"/>
        <q-btn v-if="!$q.screen.xs" @click="$q.fullscreen.toggle()" flat round dense :icon="$q.fullscreen.isActive?'fullscreen_exit':'fullscreen'" class="q-mx-sm"/>
        <q-btn-dropdown flat rounded dense transition-show="jump-down" transition-hide="jump-up" :menu-offset="[8, 10]">
          <template #label>
            <q-avatar size="25px" class="q-mr-sm">
              <img src="https://cdn3.iconfinder.com/data/icons/business-vol-13/100/Artboard_1-512.png" alt="avatar">
            </q-avatar>
            {{ username }}
          </template>
          <template #default>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings <q-btn @click="$q.fullscreen.toggle()" flat dense round class="float-right" :icon="$q.fullscreen.isActive?'fullscreen_exit':'fullscreen'"/></div>
                <q-toggle v-model="dark" label="DarkMode"/>
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column items-center">
                <q-avatar size="72px" style="border: 1px solid black">
                  <img src="https://cdn3.iconfinder.com/data/icons/business-vol-13/100/Artboard_1-512.png" alt="profile">
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ username }}</div>
                <q-btn @click="logout" to="/auth/login" color="negative" :label="$t('actions.logout')" icon="logout" size="sm" v-close-popup/>
              </div>
            </div>
          </template>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <!--         Drawer         -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" :class="`no-shadow ${$q.dark.isActive?'':'drawer-light-bg'}`">
      <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" class="full-height">
        <q-list style="width: 299px" class="text-blue-grey-8">
          <template v-for="(item, index) in essentialLinks" :key="`menu-${index}`">
            <template v-if="item.header">
              <q-item-label header class="q-my-none q-pb-none">{{ $t(`${item.header}`) }}</q-item-label>
            </template>
            <template v-else>
              <q-expansion-item v-if="item.children" :icon="item.icon" :label="$t(`${item.title}`)" :class="`${index===0?'':'q-my-md'} q-mx-sm shadow-5 border-radius-15 ${$q.dark.isActive?$route.fullPath===item.link?'gradient-light-right-1 text-blue-grey-8 shadow-15 text-bold':'gradient-dark-left-1':$route.fullPath===item.link?'gradient-dark-right-1 text-white shadow-15 text-bold':'gradient-light-left-1'}`" :active-class="$q.dark.isActive?'gradient-light-left-1 text-blue-grey-8 shadow-15':'gradient-dark-left-1 text-white shadow-15'">
                <template v-for="(child, ind) in item.children" :key="`child-${ind}`">
                  <q-item :to="child.link" :active="$route.fullPath===child.link" :active-class="$q.dark.isActive?'gradient-light-left-1 text-blue-grey-8':'gradient-dark-left-1 text-white'" class="border-radius-15">
                    <q-item-section avatar class="q-pl-md">
                      <q-icon :name="child.icon"/>
                    </q-item-section>
                    <q-item-section class="q-pl-md">
                      <q-item-label>{{ $t(`${child.title}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-expansion-item>
              <q-item v-else :to="item.link" :active="$route.fullPath===item.link" :class="`${index===0?'':'q-my-md'} q-mx-sm shadow-5 border-radius-15 ${$q.dark.isActive?$route.fullPath===item.link?'gradient-light-right-1 text-blue-grey-8 shadow-15 text-bold':'gradient-dark-left-1':$route.fullPath===item.link?'gradient-dark-right-1 text-white shadow-15 text-bold':'gradient-light-left-1'}`" :active-class="$q.dark.isActive?'gradient-light-left-1 text-blue-grey-8 shadow-15':'gradient-dark-left-1 text-white shadow-15'">
                <q-item-section avatar>
                  <q-icon :name="item.icon"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t(`${item.title}`) }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <!--         RouterView         -->
    <q-page-container :class="$q.dark.isActive?'background-dark':'backgroud'">
      <q-page class="q-pa-md">
        <router-view/>
      </q-page>
    </q-page-container>
    <!--         Footer         -->
    <q-footer class="shadow-up-5 text-right q-pr-sm footer-border-radius"  :class="$q.dark.isActive?'gradient-dark-left-1':'gradient-light-left-1 text-blue-grey-8'">
      Design & Develop by MMA@maga_med
    </q-footer>
  </q-layout>
  <q-layout v-else view="hhh lpr fFf">
    <router-view/>
    <q-footer>
      <div class="navigation">
        <ul>
          <template v-for="(menu, index) in mobileMenus" :key="`menu-${index}`">
            <li class="list" :class="$route.path===menu.to?'active':''">
              <p @click="$router.push(menu.to)" class="cursor-pointer">
            <span class="icon">
              <q-icon :name="menu.icon"/>
            </span>
                <span class="text">{{ menu.title }}</span>
              </p>
            </li>
          </template>
          <div class="indicator"/>
        </ul>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Menu from "layouts/menu";
import StorageService from "src/service/storage.service";
import AuthService from "src/service/auth.service";

export default defineComponent({
  name: 'MainLayout',
  data() {
    return {
      dark: false,
      mobileMenus: [
        {
          title: 'Home',
          icon: 'holiday_village',
          to: '/qwe'
        },
        {
          title: 'Profile',
          icon: 'person',
          to: '/houses'
        },
        {
          title: 'Home',
          icon: 'home',
          to: '/'
        },
        {
          title: 'Photos',
          icon: 'camera',
          to: '/users'
        },
        {
          title: 'Settings',
          icon: 'settings',
          to: '/roles'
        }
      ]
    }
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const username = StorageService.getUsername();
    return {
      essentialLinks: Menu,
      leftDrawerOpen,
      username,
      thumbStyle: {
        borderRadius: '3px',
        backgroundColor: '#253364',
        width: '4px',
        opacity: 0.3
      },
      barStyle: {
        borderRadius: '1px',
        backgroundColor: '#027be3',
        width: '10px',
        opacity: 0
      },
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout() {
        AuthService.logout();
      }
    }
  },
  watch: {
    'dark': {
      handler(t) {
        this.$q.dark.set(t)
        StorageService.setTheme(t);
      }
    }
  },
  created() {
    const theme = StorageService.getTheme();
    this.dark = !(theme && theme === 'false');
    this.$q.dark.set(this.dark)
  }
});
</script>

<style>
.navigation {
  width: 100%;
  height: 70px;
  background: #3f68ad;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 10px;
}
.navigation ul {
  display: flex;
  padding: 0;
  //justify-content: space-around;
  //width: 100%;
}
.navigation ul li {
  position: relative;
  list-style: none;
  width: 70px;
  height: 70px;
  z-index: 1;
}
.navigation ul li p {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  text-align: center;
  align-items: center;
  font-weight: 500;
}
.navigation ul li p .icon {
  position: relative;
  display: block;
  line-height: 65px;
  font-size: 1.8em;
  text-align: center;
  transition: 0.5s;
  color: #fff;
}
.navigation ul li.active p .icon {
  transform: translateY(-32px);
}
.navigation ul li p .text {
  position: absolute;
  color: #fff;
  font-weight: 400;
  font-size: 0.8em;
  letter-spacing: 0.05em;
  transition: 0.5s;
  margin-top: 1.7em;
  opacity: 0;
  transform: translateY(20px);
}
.navigation ul li.active p .text {
  opacity: 1;
  transform: translateY(10px);
}
.indicator {
  position: absolute;
  top: -50%;
  width: 70px;
  height: 70px;
  background: #8927f3;
  border-radius: 50%;
  border: 6px solid #fff;
  transition: 0.5s;
}
.indicator::before {
  content: " ";
  position: absolute;
  top: 50%;
  left: -22px;
  width: 20px;
  height: 20px;
  background: transparent;
  border-top-right-radius: 20px;
  box-shadow: 1px -10px 0 0 #fff;
}
.indicator::after {
  content: " ";
  position: absolute;
  top: 50%;
  right: -22px;
  width: 20px;
  height: 20px;
  background: transparent;
  border-top-left-radius: 20px;
  box-shadow: -1px -10px 0 0 #fff;
}
.navigation ul li:nth-child(1).active ~ .indicator {
  transform: translateX(calc(70px * 0));
}
.navigation ul li:nth-child(2).active ~ .indicator {
  transform: translateX(calc(70px * 1));
}
.navigation ul li:nth-child(3).active ~ .indicator {
  transform: translateX(calc(70px * 2));
}
.navigation ul li:nth-child(4).active ~ .indicator {
  transform: translateX(calc(70px * 3));
}
.navigation ul li:nth-child(5).active ~ .indicator {
  transform: translateX(calc(70px * 4));
}
</style>
