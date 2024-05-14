<template>
  <q-card bordered class="border-radius-10">
    <q-toolbar>
      <q-toolbar-title>{{ $t('sidebar.home') }}</q-toolbar-title>
      <q-btn @click="createForm" flat class="bg-green-opacity" color="positive" icon="add" :label="$t('actions.create')"/>
    </q-toolbar>
    <hr class="q-ma-none">
    <q-markup-table>
      <thead>
        <q-tr>
          <q-th>№</q-th>
          <q-th>{{ $t('fields.name') }}</q-th>
          <q-th>{{ $t('fields.price') }}</q-th>
          <q-th>{{ $t('fields.date') }}</q-th>
          <q-th>{{ $t('fields.address') }}</q-th>
          <q-th>{{ $t('actions.title') }}</q-th>
        </q-tr>
      </thead>
      <tbody>
        <q-tr v-if="list&&list.length>0" v-for="(item, index) in list" :key="`item-${index}`" :class="item.own?'bg-blue-opacity':(item.status==='ACTIVE'?'bg-green-opacity':'bg-red-opacity')">
          <q-td class="text-center">{{ index+1 }}</q-td>
          <q-td class="text-center">{{ item.name }}</q-td>
          <q-td class="text-center">{{ item.price }}</q-td>
          <q-td class="text-center">{{ item.date }}</q-td>
          <q-td class="text-center">{{ item.address }}</q-td>
          <q-td class="text-center">
            <q-btn @click="openMap(true, item)" flat dense round icon="place" class="text-purple"/>
            <q-btn flat dense round icon="image" class="text-positive"/>
            <q-btn flat dense round icon="description" class="text-deep-purple"/>
            <q-btn @click="editForm(item, index)" flat dense round icon="edit" class="text-primary"/>
            <q-btn flat dense round icon="delete" class="text-negative">
              <q-popup-proxy>
                <q-banner>
                  <template v-slot:avatar>
                    <q-icon name="info" color="red"/>
                  </template>
                  {{ $t('delete_text') }}
                  <template v-slot:action>
                    <q-btn :label="$t('actions.no')" color="negative" push glossy size="sm" v-close-popup/>
                    <q-btn @click="deleteForm(item)" :label="$t('actions.yes')" color="positive" push glossy size="sm" v-close-popup/>
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
          <div class="row">
            <div class="col q-pr-sm">
              <q-input v-model="form.price" dense outlined lazy-rules :rules="[required]" :label="$t('fields.price')"/>
            </div>
            <div class="col">
              <q-input v-model="form.date" dense outlined lazy-rules :rules="[required]" :label="$t('fields.date')+' (dd-mm-yyyy)'" mask="##-##-####"/>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="form.address" dense outlined autogrow lazy-rules :rules="[required]" :label="$t('fields.address')"/>
            </div>
            <div class="col-3 text-center q-px-sm">
              <q-toggle v-model="form.own" :label="$t('fields.own')" left-label/>
            </div>
          </div>
          <div class="row">
            <div class="col q-pr-sm">
              <q-input v-model="form.latitude" dense outlined label="Latitude"/>
            </div>
            <div class="col">
              <q-input v-model="form.longitude" dense outlined label="Longitude">
                <template #after>
                  <q-btn @click="openMap" flat round dense icon="place" color="primary"/>
                </template>
              </q-input>
            </div>
          </div>
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

    <!--      Location Map      -->
    <q-dialog v-model="map" @hide="viewMap=false">
      <q-card style="width: 500px">
        <l-map ref="mapDrag" :zoom="zoom" :center="center" style="width: 100%; height: 400px">
          <l-tile-layer :url="url" :attribution="attribution"/>
          <l-marker :lat-lng="center" @update:lat-lng="changeMap" :draggable="!viewMap"/>
        </l-map>
        <hr v-if="!viewMap" style="margin: 0">
        <q-btn v-if="!viewMap" :label="$t('actions.cancel')" color="negative" class="q-ma-sm" push glossy v-close-popup/>
        <q-btn v-if="!viewMap" :label="$t('actions.save')" @click="saveMap" :loading="loading" type="submit" color="positive" class="float-right q-ma-sm" push glossy/>
      </q-card>
    </q-dialog>

    <!--      Lightbox      -->
    <vue-easy-lightbox :visible="singleImage" :imgs="`${rootUrl}/${uploadPath}`" @hide="singleImage = false"/>

    <!--      Loading      -->
    <q-inner-loading color="deep-purple" :showing="loading"/>
  </q-card>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import VueEasyLightbox from "vue-easy-lightbox";
import HomeService from "../../service/home.service";
import axios from "axios";

export default {
  name: "homes",
  components: {LMap, LTileLayer, LMarker, VueEasyLightbox},
  data() {
    return {
      loading: false,
      list: [],
      create: true,
      index: 0,
      modal: false,
      form: {},
      zoom: 10,
      center: L.latLng(41.31030813152166, 69.2687988408655),
      centerView: L.latLng(41.31030813152166, 69.2687988408655),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://mmadev.000webhostapp.com">MMA</a>',
      lat: '',
      lang: '',
      map: false,
      viewMap: false,
      photoModal: false,
      singleImage: false,
      uploadPath: '',
      photos: []
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
    createForm() {
      this.create = true
      this.form = {}
      this.modal = true
    },
    editForm(row) {
      this.create = false
      this.form = Object.assign({}, row)
      this.modal = true
    },
    async deleteForm(row) {
      this.loading = true
      await HomeService.deleteHome(row.id).then(res => {
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
      await HomeService.save(this.form, this.create).then(res => {
        this.getList()
        this.modal = false
        this.loading = false
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
    },
    openMap(view, row) {
      if (view&&row) {
        this.zoom = 15
        this.center = L.latLng(row.latitude, row.longitude)
        this.viewMap = true
        this.map = true
      } else {
        if (this.form.latitude && this.form.latitude !== '') {
          if (this.form.longitude && this.form.longitude !== '') {
            this.zoom = 14
            this.center = L.latLng(this.form.latitude, this.form.longitude)
            this.map = true
            return true;
          }
        }
        this.zoom = 10
        this.center = L.latLng(41.31030813152166, 69.2687988408655)
        this.map = true
      }
    },
    changeMap($event) {
      this.lat = $event.lat
      this.lng = $event.lng
    },
    saveMap() {
      this.form.latitude = this.lat
      this.form.longitude = this.lng
      this.map = false
    }
  },
  created() {
    this.getList();
  }
}
</script>

<style scoped>

</style>
