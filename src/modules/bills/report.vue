<template>
  <q-card bordered class="border-radius-10">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.bills_report') }} - {{ $t(`sidebar.${$route.params.id}`) }}</q-toolbar-title>
      <q-btn v-if="homeId" @click="createForm" flat class="bg-green-opacity" color="positive" icon="add" :label="$t('actions.create')"/>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-splitter v-model="splitter" :horizontal="$q.screen.xs">
      <template #before>
        <q-list v-if="homes&&homes.length>0" separator>
          <q-item v-for="(item, index) in homes" :key="`home-${index}`" @click="homeId=item.name" :active="homeId&&homeId===item.name" active-class="bg-gradient-opacity-l text-white" clickable>
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label overline :class="homeId&&homeId===item.name?'text-white':''">{{ item[`${$route.params.id}`]?item[`${$route.params.id}`]:'----------------' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item v-else>
          <q-item-section>
            <q-item-label class="text-center">{{ $t('fields.not_found') }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template #after>
        <q-markup-table v-if="homeId">
          <thead>
            <q-tr>
              <q-th>№</q-th>
              <q-th>{{ $t('fields.file') }}</q-th>
              <q-th>{{ $t('fields.date') }}</q-th>
              <q-th>{{ $t('fields.to_count') }}</q-th>
              <q-th>{{ $t('fields.price') }}</q-th>
              <q-th>{{ $t('actions.title') }}</q-th>
            </q-tr>
          </thead>
          <tbody>
            <q-tr v-if="list&&list.length>0" v-for="(item, index) in list" :key="`item-${index}`">
              <q-td class="text-center">{{ index+1 }}</q-td>
              <q-td class="text-center">
              </q-td>
              <q-td class="text-center">{{ item.date }}</q-td>
              <q-td class="text-center">{{ item.count }}<br v-if="item.countAtop">{{ item.countAtop }}</q-td>
              <q-td class="text-center">{{ item.price }}</q-td>
              <q-td class="text-center">
                <q-btn @click="editForm(item)" flat dense round icon="edit" class="text-primary"/>
                <q-btn flat dense round icon="delete" class="text-negative">
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
            <q-tr v-else>
              <q-td colspan="6" class="text-center">
                <img src="https://img.freepik.com/premium-vector/no-data-empty-data-concept-illustration-vector_610956-1400.jpg" alt="not_found" style="border-radius: 50px; width: 400px">
              </q-td>
            </q-tr>
          </tbody>
        </q-markup-table>
        <div v-else class="q-pa-md text-center">
          <img src="https://img.freepik.com/premium-vector/no-data-empty-data-concept-illustration-vector_610956-1400.jpg" alt="not_found" style="border-radius: 50px; width: 400px">
        </div>
      </template>
    </q-splitter>

    <!--      Create or Update      -->
    <q-dialog v-model="modal">
      <q-card style="width: 100%">
        <q-toolbar>
          <q-toolbar-title>{{ create?$t('actions.create'):$t('actions.edit') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <hr class="q-ma-none">
        <q-form @submit="save" class="q-pa-md">
          <q-input v-model="form.f_i_o" dense outlined lazy-rules :rules="[required]" :label="$t('fields.f_i_o')" class="q-mx-sm"/>
          <div class="row">
            <div class="col">
              <q-input v-model="form.passport" dense outlined lazy-rules :rules="[required]" :label="$t('fields.passport')" mask="AA #######" class="q-mx-sm"/>
            </div>
            <div class="col">
              <q-input v-model="form.pin_fl" dense outlined lazy-rules :rules="[required]" :label="$t('fields.pin_fl')" mask="##############" class="q-mx-sm"/>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="form.phone" dense outlined lazy-rules :rules="[required]" :label="$t('fields.phone')" mask="(##) ###-##-##" class="q-mx-sm"/>
            </div>
            <div class="col">
              <q-input v-model="form.work" dense outlined lazy-rules :rules="[required]" :label="$t('fields.work')" class="q-mx-sm"/>
            </div>
          </div>
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

    <!--      Lightbox      -->
    <vue-easy-lightbox :visible="singleImage" :imgs="`${rootUrl}/${uploadPath}`" @hide="singleImage = false"/>

    <!--      Loading      -->
    <q-inner-loading color="deep-purple" :showing="loading"/>
  </q-card>
</template>

<script>
import HomeService from "../../service/home.service";
import PersonService from "../../service/person.service";
import VueEasyLightbox from "vue-easy-lightbox";
import ReportService from "../../service/report.service";

export default {
  name: "report",
  components: {VueEasyLightbox},
  data() {
    return {
      splitter: 25,
      loading: false,
      list: [],
      create: true,
      index: 0,
      modal: false,
      form: {},
      photoModal: false,
      singleImage: false,
      uploadPath: '',
      photos: [],
      homeId: null,
      homes: []
    }
  },
  watch: {
    '$route.params.id': {
      handler(id) {
        this.homeId = null
      }
    },
    'homeId': {
      handler(h) {
        if (h)
          this.getList()
      }
    }
  },
  computed: {
    rootUrl() {
      return process.env.BASE_URL+'images/'
    }
  },
  methods: {
    required(v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    requiredBool(v) {
      return v || this.$t('fields.required')
    },
    getList() {
      this.loading = true
      const h = ReportService.list()
      let list = []
      if (h&&h.length>0) {
        h.forEach(p => {
          if (this.homeId===p.homeId) {
            list.push(p)
          }
        })
      }
      this.list = list
      this.loading = false
    },
    async getHomes() {
      this.loading = true
      await HomeService.list().then(res => {
        this.homes = res.data
      })
      this.loading = false
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
    deleteForm(id) {
    },
    save() {
    }
  },
  created() {
    this.getHomes();
  }
}
</script>

<style scoped>

</style>
