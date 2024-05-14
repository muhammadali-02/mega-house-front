<template>
  <q-card bordered class="border-radius-10">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.account_number') }}</q-toolbar-title>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-markup-table>
      <thead>
        <q-tr>
          <q-th>№</q-th>
          <q-th>{{ $t('fields.home') }}</q-th>
          <q-th>{{ $t('sidebar.hot') }}</q-th>
          <q-th>{{ $t('sidebar.cold') }}</q-th>
          <q-th>{{ $t('sidebar.gaz') }}</q-th>
          <q-th>{{ $t('sidebar.electronic') }}</q-th>
          <q-th>{{ $t('sidebar.garbage') }}</q-th>
          <q-th>{{ $t('sidebar.communal') }}</q-th>
          <q-th>{{ $t('sidebar.tax') }}</q-th>
          <q-th>{{ $t('actions.title') }}</q-th>
        </q-tr>
      </thead>
      <tbody>
        <q-tr v-if="list&&list.length>0" v-for="(item, index) in list" :key="`item-${index}`">
          <q-td class="text-center">{{ index+1 }}</q-td>
          <q-td class="text-center">{{ item.name }}</q-td>
          <q-td class="text-center">{{ item.hot?item.hot:'-' }}</q-td>
          <q-td class="text-center">{{ item.cold?item.cold:'-' }}</q-td>
          <q-td class="text-center">{{ item.gaz?item.gaz:'-' }}</q-td>
          <q-td class="text-center">{{ item.electronic?item.electronic:'-' }}</q-td>
          <q-td class="text-center">{{ item.garbage?item.garbage:'-' }}</q-td>
          <q-td class="text-center">{{ item.communal?item.communal:'-' }}</q-td>
          <q-td class="text-center">{{ item.tax?item.tax:'-' }}</q-td>
          <q-td class="text-center">
            <q-btn @click="editForm(item, index)" flat dense round icon="edit" class="text-primary"/>
          </q-td>
        </q-tr>
        <q-tr v-else>
          <q-td colspan="10" class="text-center">
            <img src="https://img.freepik.com/premium-vector/no-data-empty-data-concept-illustration-vector_610956-1400.jpg" alt="not_found" style="border-radius: 50px; width: 400px">
          </q-td>
        </q-tr>
      </tbody>
    </q-markup-table>

    <!--      Create or Update      -->
    <q-dialog v-model="modal">
      <q-card style="width: 100%">
        <q-toolbar>
          <q-toolbar-title>{{ form.name }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <hr class="q-ma-none">
        <q-form @submit="save" class="q-pa-md">
          <q-input v-model="form.hot" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.hot')"/>
          <q-input v-model="form.cold" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.cold')"/>
          <q-input v-model="form.gaz" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.gaz')"/>
          <q-input v-model="form.electronic" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.electronic')"/>
          <q-input v-model="form.garbage" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.garbage')"/>
          <q-input v-model="form.communal" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.communal')"/>
          <q-input v-model="form.tax" dense outlined lazy-rules :rules="[required]" :label="$t('sidebar.tax')"/>
          <hr>
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
import HomeService from "../../service/home.service";

export default {
  name: "account-number",
  data() {
    return {
      loading: false,
      list: [],
      form: {},
      index: null,
      modal: false
    }
  },
  methods: {
    required(v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    async getList() {
      this.loading = true
      await HomeService.list().then(res => {
        this.list = res.data
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
    editForm(row) {
      this.form = {...row}
      this.modal = true
    },
    async save() {
      this.loading = true
      await HomeService.save(this.form, false).then(res => {
        this.getList()
        this.modal = false
        this.$q.notify({
          message: this.$t(`success_updated`),
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
