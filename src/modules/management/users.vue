<template>
  <q-card bordered class="border-radius-10">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.user') }}</q-toolbar-title>
      <q-input v-model="payload.search" outlined dense class="q-mx-lg" :label="$t('fields.search')"/>
      <q-btn @click="createForm" flat class="bg-green-opacity" color="positive" icon="add" :label="$t('actions.create')"/>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-markup-table>
      <thead>
        <q-tr>
          <q-th>№</q-th>
          <q-th>{{ $t('fields.username') }}</q-th>
          <q-th>{{ $t('fields.f_i_o') }}</q-th>
          <q-th>{{ $t('fields.phone') }}</q-th>
          <q-th>{{ $t('fields.chat_id') }}</q-th>
          <q-th>{{ $t('fields.role') }}</q-th>
          <q-th>{{ $t('fields.status') }}</q-th>
          <q-th>{{ $t('actions.title') }}</q-th>
        </q-tr>
      </thead>
      <tbody>
        <q-tr v-for="(item, index) in list" :key="`item-${index}`">
          <q-td class="text-center">{{ paginate(index, payload.page, payload.limit) }}</q-td>
          <q-td class="text-center">{{ item.username }}</q-td>
          <q-td class="text-center">{{ item.lastName?item.lastName:'--------' }} {{ item.firstName?item.firstName:'--------' }} {{ item.parentName?item.parentName:'--------' }}</q-td>
          <q-td class="text-center">{{ item.phone }}</q-td>
          <q-td class="text-center">{{ item.chatId?item.chatId:'-----------' }}</q-td>
          <q-td class="text-center">{{ item.roleName?item.roleName:'-----------' }}</q-td>
          <q-td class="text-center">
            <q-badge :color="item.status==='ACTIVE'?'positive':'negative'">{{ item.status }}</q-badge>
          </q-td>
          <q-td class="text-center">
            <q-btn flat dense round icon="home" class="bg-green-opacity q-mr-sm" color="green"/>
            <q-btn @click="editForm(item)" flat dense round icon="edit" class="bg-blue-opacity q-mr-sm" color="primary"/>
            <q-btn flat dense round icon="delete" class="bg-red-opacity" color="negative">
              <q-popup-proxy>
                <q-banner>
                  <template v-slot:avatar>
                    <q-icon name="info" color="red"/>
                  </template>
                  {{ $t('delete_text') }}
                  <template v-slot:action>
                    <q-btn :label="$t('actions.no')" color="negative" push glossy size="sm" v-close-popup/>
                    <q-btn @click="deleteForm(item.id)" :label="$t('actions.yes')" color="positive" push glossy size="sm" v-close-popup/>
                  </template>
                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </q-td>
        </q-tr>
      </tbody>
    </q-markup-table>
    <hr>
    <div class="flex flex-center q-my-sm">
      <q-pagination v-model="payload.page" :max="methodPage" :max-pages="5" direction-links boundary-links size="sm" color="deep-purple"/>
    </div>

    <!--      Create or Update      -->
    <q-dialog v-model="modal">
      <q-card style="width: 100%">
        <q-toolbar>
          <q-toolbar-title>{{ create?$t('actions.create'):$t('actions.edit') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <hr class="q-ma-none">
        <q-form @submit="save" class="q-pa-md">
          <q-input v-model="form.username" dense outlined lazy-rules :rules="[required]" :label="$t('fields.username')"/>
          <q-input v-model="form.password" v-if="create" :label="$t('fields.password')" :rules="[required]" :type="isPwd?'password':'text'" lazy-rules outlined dense>
            <template #prepend>
              <q-icon class="cursor-pointer" name="lock"/>
            </template>
            <template #append>
              <q-icon class="cursor-pointer" @click="isPwd=!isPwd" :name="isPwd?'visibility_off':'visibility'"/>
            </template>
          </q-input>
          <q-select v-model="form.home" dense outlined lazy-rules :rules="[requiredBool]" :label="$t('fields.home')" :options="homes" option-label="name"/>
          <q-select v-model="form.role" dense outlined lazy-rules :rules="[requiredBool]" :label="$t('fields.role')" :options="roles" option-label="name"/>
          <hr class="q-mt-md">
          <div class="row">
            <div class="col text-left">
              <q-btn flat :label="$t('actions.cancel')" color="negative" class="bg-red-opacity" no-caps v-close-popup/>
            </div>
            <div class="col text-right">
              <q-btn :loading="loading" flat :label="$t('actions.save')" type="submit" color="positive" class="bg-green-opacity" no-caps/>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!--      Loading      -->
    <q-inner-loading color="deep-purple" :showing="loading"/>
  </q-card>
</template>

<script>
import UserService from "../../service/user.service";
import HomeService from "../../service/home.service";
import RoleService from "../../service/role.service";

export default {
  name: "users",
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      form: {},
      payload: {
        page: 1,
        limit: 20,
        search: ''
      },
      isPwd: true,
      create: true,
      modal: false,
      homes: [],
      roles: []
    }
  },
  watch: {
    'payload.page': {
      handler(p) {
        this.getList();
      }
    },
    'payload.search': {
      handler(s) {
        this.payload.page=1
        this.getList();
      }
    }
  },
  computed: {
    methodPage() {
      if (this.total<=this.payload.limit) {
        return 1;
      } else {
        return Math.ceil(this.total/this.payload.limit)
      }
    }
  },
  methods: {
    required (v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    requiredBool (v) {
      return v || this.$t('fields.required')
    },
    paginate(index, page_size, page_number) {
      --page_size;
      return (page_number * page_size) + index + 1;
    },
    async getHomes() {
      this.loading = true
      await HomeService.list().then(res => {
        this.homes = res.data
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
    async getRoles() {
      this.loading = true
      await RoleService.list().then(res => {
        this.roles = res.data.list
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
    async getList() {
      this.loading = true
      await UserService.list(this.payload).then(res => {
        this.list = res.data.list
        this.total = res.data.total
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
    createForm() {
      this.create = true
      this.form = {}
      this.modal = true
    },
    editForm(row) {
      this.create = false
      this.form = {...row}
      this.modal = true
    },
    async deleteForm(id) {
      this.loading = true
      await UserService.delete(id).then(res => {
        this.getList()
        this.$q.notify({
          message: this.$t('success_deleted'),
          progress: true,
          closeBtn: true,
          type: 'positive',
          position: 'top-right'
        })
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
    async save() {
      this.loading = true
      this.form.homeId = this.form.home.id
      this.form.roleIds = [this.form.role.id]
      this.form.status = 'ACTIVE'
      await UserService.save(this.form, this.create).then(res => {
        this.getList()
        this.modal = false
        this.$q.notify({
          message: this.$t(`${this.create?'success_created':'success_updated'}`),
          progress: true,
          closeBtn: true,
          type: 'positive',
          position: 'top-right'
        })
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
  },
  created() {
    this.getList();
    this.getHomes();
    this.getRoles();
  }
}
</script>

<style scoped>

</style>
