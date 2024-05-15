<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center" :class="$q.dark.isActive?'backgroud-dark-login':'backgroud-login'">
        <q-card bordered :class="$q.dark.isActive?'bg-blue-grey-8':'bg-blue-grey-3'" class="shadow-15 border-radius-10 q-pa-sm" style="width: 400px">
          <q-card-section class="text-center q-pa-md">
            <q-img v-if="$q.dark.isActive" src="../assets/header-logo-dark.png" alt="logo" :width="$q.screen.xs?'200px':'260px'" class="cursor-pointer"/>
            <q-img v-else src="../assets/header-logo-light.png" alt="logo" :width="$q.screen.xs?'200px':'260px'" class="cursor-pointer"/>
          </q-card-section>
          <hr class="q-ma-none">
          <q-card-section class="q-pb-xs">
            <div class="text-center">
              <q-btn v-if="$route.query.isRegister&&$route.query.code" to="/auth/login" icon="arrow_back" round dense flat class="float-left"/>
              <b v-if="$route.query.isRegister&&$route.query.code" style="font-size: 20px">Ro'yxatdan o'tish</b>
              <b v-else style="font-size: 20px">Tizimga kirish</b>
            </div>
          </q-card-section>
          <q-card-section v-if="$route.query.isRegister&&$route.query.code">
            <q-form>
              <q-input v-model="form.firstName" :label="$t('fields.first_name')" :rules="[required]" type="text" lazy-rules outlined dense/>
              <q-input v-model="form.lastName" :label="$t('fields.last_name')" :rules="[required]" type="text" lazy-rules outlined dense/>
              <q-input v-model="form.parentName" :label="$t('fields.parent_name')" :rules="[required]" type="text" lazy-rules outlined dense/>
              <q-input v-model="form.phone" :label="$t('fields.phone')" :rules="[required]" type="text" mask="+### ## ###-##-##" lazy-rules outlined dense/>
              <q-input v-model="form.password" :label="$t('fields.password')" :rules="[required]" :type="'number'" clearable lazy-rules outlined dense>
                <template #append>
                  <q-icon class="cursor-pointer" @click="isPwd=!isPwd" :name="isPwd?'visibility_off':'visibility'"/>
                </template>
              </q-input>
              <q-btn @click="register" class="full-width bg-gradient-opacity-l text-white q-mt-sm" :label="$t('actions.send')" :loading="loading" flat dense/>
            </q-form>
          </q-card-section>
          <q-card-section v-else-if="$route.query.code" class="text-center">
            <q-form class="q-mb-sm">
              <q-input v-model="form.password" :label="$t('fields.password')" :rules="[required]" @keydown.enter="login" :type="isPwd?'password':'text'" clearable lazy-rules outlined dense>
                <template #append>
                  <q-icon class="cursor-pointer" @click="isPwd=!isPwd" :name="isPwd?'visibility_off':'visibility'"/>
                </template>
              </q-input>
              <div class="row q-mb-md">
                <div class="col">
                  <q-btn @click="form.password?form.password+=`1`:form.password='1'" class="full-width" style="font-size: 20px" color="deep-purple">1</q-btn>
                </div>
                <div class="col q-px-lg">
                  <q-btn @click="form.password?form.password+=`2`:form.password='2'" class="full-width" style="font-size: 20px" color="deep-purple">2</q-btn>
                </div>
                <div class="col">
                  <q-btn @click="form.password?form.password+=`3`:form.password='3'" class="full-width" style="font-size: 20px" color="deep-purple">3</q-btn>
                </div>
              </div>
              <div class="row q-mb-md">
                <div class="col">
                  <q-btn @click="form.password?form.password+=`4`:form.password='4'" class="full-width" style="font-size: 20px" color="deep-purple">4</q-btn>
                </div>
                <div class="col q-px-lg">
                  <q-btn @click="form.password?form.password+=`5`:form.password='5'" class="full-width" style="font-size: 20px" color="deep-purple">5</q-btn>
                </div>
                <div class="col">
                  <q-btn @click="form.password?form.password+=`6`:form.password='6'" class="full-width" style="font-size: 20px" color="deep-purple">6</q-btn>
                </div>
              </div>
              <div class="row q-mb-md">
                <div class="col">
                  <q-btn @click="form.password?form.password+=`7`:form.password='7'" class="full-width" style="font-size: 20px" color="deep-purple">7</q-btn>
                </div>
                <div class="col q-px-lg">
                  <q-btn @click="form.password?form.password+=`8`:form.password='8'" class="full-width" style="font-size: 20px" color="deep-purple">8</q-btn>
                </div>
                <div class="col">
                  <q-btn @click="form.password?form.password+=`9`:form.password='9'" class="full-width" style="font-size: 20px" color="deep-purple">9</q-btn>
                </div>
              </div>
              <div class="row q-mb-md">
                <div class="col">
                  <q-btn @click="form.password.length?form.password=form.password.substring(0, form.password.length-1):''" class="full-width" style="font-size: 20px" color="negative" icon="backspace"></q-btn>
                </div>
                <div class="col q-px-lg">
                  <q-btn @click="form.password?form.password+=`0`:form.password='0'" class="full-width" style="font-size: 20px" color="deep-purple">0</q-btn>
                </div>
                <div class="col">
                  <q-btn @click="login" :loading="loading" class="full-width" style="font-size: 20px" color="positive" icon="check"></q-btn>
                </div>
              </div>
            </q-form>
          </q-card-section>
          <q-card-section v-else class="text-center">
            <q-form class="q-mb-sm">
              <q-input v-model="form.username" :label="$t('fields.username')" :rules="[required]" type="text" lazy-rules outlined dense/>
              <q-input v-model="form.password" :label="$t('fields.password')" :rules="[required]" @keydown.enter="login" :type="isPwd?'password':'text'" lazy-rules outlined dense>
                <template #append>
                  <q-icon class="cursor-pointer" @click="isPwd=!isPwd" :name="isPwd?'visibility_off':'visibility'"/>
                </template>
              </q-input>
              <q-btn @click="login" class="full-width bg-gradient-opacity-l text-white q-mt-sm" :label="$t('actions.login')" :loading="loading" flat dense/>
            </q-form>
            <q-btn @click="toRegister" class="full-width bg-gradient-opacity-r text-white q-mt-sm" icon="telegram" :label="$t('actions.register')" flat dense/>
          </q-card-section>
        </q-card>

        <!--      Loading      -->
        <q-inner-loading color="deep-purple" :showing="loading"/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import AuthService from "../service/auth.service";
import StorageService from "../service/storage.service";
import ApiService from "../service/api.service";

export default {
  name: "login",
  data() {
    return {
      loading: false,
      isPwd: true,
      form: {}
    }
  },
  methods: {
    required(v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    toRegister() {
      window.open('https://t.me/mega_house_bot', '_self');
    },
    sendMessageTelegram(msg, chatId) {
      const url = `https://api.telegram.org/bot7091504581:AAHJBiaS85VDTNGWIVyZSixi_4RLe-cCHFM/sendMessage?chat_id=${chatId}&text=${msg}`; // The url to request
      const xht = new XMLHttpRequest();
      xht.open("GET", url);
      xht.send();
    },
    async login() {
      this.loading = true
      if (this.$route.query.code)
        this.form.username = this.$route.query.code
      await AuthService.login(this.form).then(res => {
        StorageService.setToken(res.data.token)
        StorageService.setUsername(res.data.username)
        StorageService.setRoles(JSON.stringify(res.data.role))
        StorageService.setPermissions(JSON.stringify(res.data.permissions))
        ApiService.setHeader();
        this.$router.push('/')
      }).catch(e => {
        this.$q.notify({
          message: (e.response&&e.response.data&&e.response.data.message)?e.response.data.message:e.message,
          progress: true,
          closeBtn: true,
          type: 'negative',
          position: 'top-right'
        })
      }).finally(f => {
        this.loading = false
      })
    },
    async register() {
      this.loading = true
      this.form.username = this.$route.query.code
      this.form.chatId = this.$route.query.code
      await AuthService.register(this.form).then(res => {
        this.sendMessageTelegram(`Xurmatli ${this.form.lastName} ${this.form.firstName} ${this.form.parentName} Mega-House ilovamizga xush kelibsiz!`, this.form.chatId)
        this.$q.dialog({
          title: this.$t("actions.confirm"),
          message: 'Ma\'lumotlaringiz muvaffaqiyatli saqlandi, login parolingizni @mega_house_bot orqali telegramingizga yubordik.',
          ok: {
            label: this.$t("Ok"),
            dense: true,
            color: "positive",
          },
          cancel: {
            label: this.$t("actions.view"),
            dense: true,
            color: "secondary",
          },
          persistent: true,
        }).onOk(() => {
          this.$router.push(`/auth/login?code=${this.$route.query.code}`)
        }).onCancel(() => {
          this.$router.push(`/auth/login?code=${this.$route.query.code}`)
          this.toRegister()
        });
      }).catch(e => {
        this.$q.notify({
          message: (e.response&&e.response.data&&e.response.data.message)?e.response.data.message:e.message,
          progress: true,
          closeBtn: true,
          type: 'negative',
          position: 'top-right'
        })
      }).finally(f => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
