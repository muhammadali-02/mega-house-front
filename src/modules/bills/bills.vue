<template>
  <q-card bordered class="border-radius-10">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.bills') }} - {{ $t(`sidebar.${$route.params.id}`) }}</q-toolbar-title>
      <q-btn v-if="homeId" @click="createForm" flat class="bg-green-opacity" color="positive" icon="add" :label="$t('actions.create')"/>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-splitter v-model="splitter" :horizontal="$q.screen.xs">
      <template #before>
        <q-list v-if="homes&&homes.length>0" separator>
          <q-item v-for="(item, index) in homes" :key="`home-${index}`" @click="homeId=item.id" :active="homeId===item.id" active-class="bg-gradient-opacity-l text-white" clickable>
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
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
        <q-markup-table v-if="homeId" flat>
          <thead>
            <q-tr>
              <q-th>№</q-th>
              <q-th>{{ $t('fields.date') }}</q-th>
              <q-th>{{ $t('fields.file') }}</q-th>
              <q-th>{{ $t('fields.meter') }}</q-th>
              <q-th>{{ $t('actions.title') }}</q-th>
            </q-tr>
          </thead>
          <tbody>
            <q-tr v-if="list&&list.length>0" v-for="(item, index) in list" :key="`item-${index}`">
              <q-td class="text-center">{{ paginate(index, payload.page, payload.limit) }}</q-td>
              <q-td class="text-center">{{ item.date }}</q-td>
              <q-td class="text-center">{{ item.file }}</q-td>
              <q-td class="text-center">{{ item.meter }}</q-td>
              <q-td class="text-center">
                <q-btn flat dense round icon="description" class="text-deep-purple"/>
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
              <q-td colspan="5" class="text-center">
                <img src="https://img.freepik.com/premium-vector/no-data-empty-data-concept-illustration-vector_610956-1400.jpg" alt="not_found" style="border-radius: 50px; width: 400px">
              </q-td>
            </q-tr>
          </tbody>
        </q-markup-table>
        <div v-if="homeId" class="flex flex-center q-my-sm">
          <q-pagination v-model="payload.page" :max="methodPage" :max-pages="5" direction-links boundary-links size="sm" color="deep-purple"/>
        </div>
        <div v-else class="q-pa-md text-center">
          <img src="https://img.freepik.com/premium-vector/no-data-empty-data-concept-illustration-vector_610956-1400.jpg" alt="not_found" style="border-radius: 50px; width: 400px">
        </div>
      </template>
    </q-splitter>

    <!--      Create or Update      -->
    <q-dialog v-model="modal">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>{{ create?$t('actions.create'):$t('actions.edit') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
        <hr class="q-ma-none">
        <q-form @submit="save" class="q-pa-md">
          <div class="q-pa-sm">
            <q-input v-model="form.date" dense outlined lazy-rules :rules="[required]" :label="$t('fields.date')+' (dd-mm-yyyy)'" mask="##-##-####"/>
          </div>
          <div class="row">
            <div class="col-6 col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-sm">
              <q-input v-model="form.meter1" dense outlined lazy-rules :rules="[required]" :label="$t('fields.meter')+' - 1'"/>
              <q-uploader :label="$t('fields.photo_meter')+' - 1'" color="deep-purple" hide-upload-btn style="width: 250px"/>
            </div>
            <div class="col-6 col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pa-sm">
              <q-input v-model="form.meter2" dense outlined lazy-rules :rules="[required]" :label="$t('fields.meter')+' - 2'"/>
              <q-uploader :label="$t('fields.photo_meter')+' - 2'" color="deep-purple" hide-upload-btn style="width: 250px"/>
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
import VueEasyLightbox from "vue-easy-lightbox";
import BillsService from "../../service/bills.service";

export default {
  name: "bills",
  components: {VueEasyLightbox},
  data() {
    return {
      splitter: 25,
      loading: false,
      payload: {
        page: 1,
        limit: 20
      },
      list: [],
      total: 0,
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
    'homeId': {
      handler(h) {
        if (h)
          this.getList()
      }
    },
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
    },
    rootUrl() {
      return process.env.BASE_URL+'images/'
    }
  },
  methods: {
    paginate(index, page_size, page_number) {
      --page_size;
      return (page_number * page_size) + index + 1;
    },
    required(v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    requiredBool(v) {
      return v || this.$t('fields.required')
    },
    async getList() {
      this.loading = true
      await BillsService.list(this.homeId, this.$route.params.id, this.payload).then(res => {
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
      await BillsService.delete(id).then(res => {
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
      this.form.homeId = this.homeId
      this.form.code = this.$route.params.id
      await BillsService.save(this.form, this.create).then(res => {
        this.modal = false
        this.getList();
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
    this.getHomes();
  }
}
</script>

<style scoped>

</style>
