<template>
  <q-card bordered class="border-radius-10">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.role') }}</q-toolbar-title>
      <q-btn @click="createForm" flat class="bg-green-opacity" color="positive" icon="add" :label="$t('actions.create')"/>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-markup-table>
      <thead>
      <q-tr>
        <q-th>№</q-th>
        <q-th>{{ $t('fields.name') }}</q-th>
        <q-th>{{ $t('fields.code') }}</q-th>
        <q-th>{{ $t('actions.title') }}</q-th>
      </q-tr>
      </thead>
      <tbody>
      <q-tr v-for="(item, index) in list" :key="`item-${index}`">
        <q-td class="text-center">{{ index+1 }}</q-td>
        <q-td class="text-center">{{ item.name }}</q-td>
        <q-td class="text-center">{{ item.code }}</q-td>
        <q-td class="text-center">
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

    <!--      Create or Update      -->
    <q-dialog v-model="modal">
      <q-card style="width: 100%">
        <q-toolbar>
          <q-toolbar-title>{{ create?$t('actions.create'):$t('actions.edit') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <hr class="q-ma-none">
        <q-form @submit="save" class="q-pa-md">
          <q-input v-model="form.name" dense outlined lazy-rules :rules="[required]" :label="$t('fields.name')"/>
          <q-input v-model="form.code" dense outlined lazy-rules :rules="[required]" :label="$t('fields.code')"/>
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
import RoleService from "../../service/role.service";

export default {
  name: "role",
  data() {
    return {
      loading: false,
      list: [],
      form: {},
      create: true,
      modal: false
    }
  },
  methods: {
    required (v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    async getList() {
      this.loading = true
      await RoleService.list().then(res => {
        this.list = res.data.list
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
      await RoleService.delete(id).then(res => {
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
      await RoleService.save(this.form, this.create).then(res => {
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
  }
}
</script>

<style scoped>

</style>
