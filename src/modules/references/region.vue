<template>
  <q-card bordered class="border-radius-10 q-pb-md">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.region') }}</q-toolbar-title>
      <q-btn @click="createForm(null)" flat class="bg-green-opacity" color="positive" icon="add" :label="$t('actions.create')"/>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-splitter v-model="splitter" :horizontal="$q.screen.xs">
      <template #before>
        <q-list v-if="list&&list.length>0" separator bordered>
          <q-item v-for="(item, index) in list" :key="`region-${index}`" @click="region=item" :active="region&&region.id===item.id" active-class="bg-gradient-opacity-l text-white" clickable>
            <q-item-section side>
              <q-icon name="location_on" color="info"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.nameUz }}</q-item-label>
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
        <q-toolbar v-if="region">
          <q-toolbar-title>{{ region.nameUz }} / {{ region.nameRu }} - {{ region.soato }}</q-toolbar-title>
          <q-btn @click="createForm(region?region.id:null)" :label="$t('actions.create')" icon="add" flat class="bg-green-opacity q-mx-sm" color="positive"/>
          <q-btn @click="editForm(region)" :label="$t('actions.edit')" icon="edit" flat class="bg-blue-opacity q-mx-sm" color="primary"/>
          <q-btn v-if="regions.length===0" :label="$t('actions.delete')" icon="delete" flat class="bg-red-opacity q-mx-sm" color="negative">
            <q-popup-proxy>
              <q-banner>
                <template v-slot:avatar>
                  <q-icon name="info" color="red"/>
                </template>
                {{ $t('delete_text') }}
                <template v-slot:action>
                  <q-btn :label="$t('actions.no')" color="negative" push glossy size="sm" v-close-popup/>
                  <q-btn @click="deleteForm(region?region.id:null)" :label="$t('actions.yes')" color="positive" push glossy size="sm" v-close-popup/>
                </template>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </q-toolbar>
        <hr class="q-ma-none">
        <q-markup-table v-if="region">
          <thead>
            <q-tr>
              <q-th>№</q-th>
              <q-th>{{ $t('fields.name_uz') }}</q-th>
              <q-th>{{ $t('fields.name_ru') }}</q-th>
              <q-th>{{ $t('Soato') }}</q-th>
              <q-th>{{ $t('actions.title') }}</q-th>
            </q-tr>
          </thead>
          <tbody>
            <q-tr v-if="regions&&regions.length>0" v-for="(item, index) in regions" :key="`item-${index}`">
              <q-td class="text-center">{{ index+1 }}</q-td>
              <q-td class="text-center">{{ item.nameUz }}</q-td>
              <q-td class="text-center">{{ item.nameRu }}</q-td>
              <q-td class="text-center">{{ item.soato }}</q-td>
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
          <q-input v-model="form.nameUz" dense outlined lazy-rules :rules="[required]" :label="$t('fields.name_uz')" class="q-mx-sm"/>
          <q-input v-model="form.nameRu" dense outlined lazy-rules :rules="[required]" :label="$t('fields.name_ru')" class="q-mx-sm"/>
          <q-input v-model="form.nameEn" dense outlined lazy-rules :rules="[required]" :label="$t('fields.name_ru')" class="q-mx-sm"/>
          <q-input v-model="form.soato" dense outlined lazy-rules :rules="[required]" :label="$t('Soato')" class="q-mx-sm"/>
          <q-input v-model="form.order" dense outlined lazy-rules :rules="[required]" :label="$t('fields.order')" type="number" class="q-mx-sm"/>
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
import VueEasyLightbox from "vue-easy-lightbox";
import RegionService from "src/service/region.service";

export default {
  name: "region",
  components: {VueEasyLightbox},
  data() {
    return {
      splitter: 25,
      loading: false,
      list: [],
      regions: [],
      create: true,
      modal: false,
      form: {},
      region: null
    }
  },
  watch: {
    'region': {
      handler(h) {
        if (h)
          this.getListByParent()
      }
    }
  },
  methods: {
    required(v) {
      return v && v.length > 0 || this.$t('fields.required')
    },
    async getList() {
      this.loading = true
      await RegionService.list().then(res => {
        this.list = res.data
      }).catch(e => {
        this.$q.notify({
          message: (e.response && e.response.data && e.response.data.message) ? e.response.data.message : e.message,
          progress: true,
          closeBtn: true,
          type: 'negative',
          position: 'top-right'
        })
      }).finally(f => {
        this.loading = false
      })
    },
    async getListByParent() {
      if (this.region) {
        this.loading = true
        await RegionService.listByParent(this.region.id).then(res => {
          this.regions = res.data
        }).catch(e => {
          this.$q.notify({
            message: (e.response && e.response.data && e.response.data.message) ? e.response.data.message : e.message,
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
    createForm(id) {
      this.create = true
      this.form = {}
      if (id)
        this.form.parentId = id
      this.modal = true
    },
    editForm(row) {
      this.create = false
      this.form = {...row}
      this.modal = true
    },
    async deleteForm(id) {
      this.loading = true
      await RegionService.delete(id).then(res => {
        this.getList();
        this.getListByParent();
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
      await RegionService.save(this.form, this.create).then(res => {
        this.modal = false
        this.getList();
        this.getListByParent();
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
