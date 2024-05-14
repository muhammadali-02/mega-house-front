<template>
  <template v-if="$q.screen.xs||$q.screen.sm">
    <div class="absolute" style="height: 400px; width: 100%; background-image: linear-gradient(to bottom, rgb(128,182,255), rgb(129,53,255), rgb(181,140,255), #fff)"/>
    <q-toolbar>
      <q-btn dense flat round icon="clear_all" color="white" size="18px"/>
      <q-toolbar-title>
        <q-img v-if="$q.dark.isActive" src="../../assets/header-logo-dark.png" alt="logo" :width="$q.screen.xs?'200px':'260px'" class="cursor-pointer" @click="$router.push('/')"/>
        <q-img v-else src="../../assets/header-logo-light.png" alt="logo" :width="$q.screen.xs?'200px':'260px'" class="cursor-pointer" @click="$router.push('/')"/>
      </q-toolbar-title>
    </q-toolbar>
    <q-drawer>
    </q-drawer>
    <q-page-container>
      <q-page class="q-pa-md">
      </q-page>
    </q-page-container>
  </template>
  <template v-else>
    <div class="text-center">
      <pre>{{money}}</pre>
      <div class="row">
        <q-intersection v-for="(card, index) in headerCards" :key="`card-${index}`" once transition="jump-right" class="col-3 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <q-card class="border-radius-10 shadow-10 relative-position q-pt-sm q-mx-xs q-my-sm" bordered>
            <div :class="`header-cards-line-${index}`"/>
            <q-item class="text-left">
              <q-item-section avatar>
                <q-icon :name="card.icon" size="35px"/>
              </q-item-section>
              <q-item-section>
                <q-item-label style="font-size: 15px; font-weight: bold">{{ card.count }}</q-item-label>
                <q-item-label style="font-size: 15px; font-weight: bold" caption>{{ card.title }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-item-label style="font-size: 30px" class="text-bold">{{ index===1?'%':'$' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </q-intersection>
      </div>
      <div class="row flex justify-around">
        <div class="col-4 col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pr-xs" bordered>
            <div id="spark1"/>
          </q-card>
        </div>
        <div class="col-4 col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pr-xs" bordered>
            <div id="spark2"/>
          </q-card>
        </div>
        <div class="col-4 col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pr-xs" bordered>
            <div id="spark3"/>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="col-6 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pt-md q-px-sm" bordered>
            <div id="bar"/>
          </q-card>
        </div>
        <div class="col-6 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pt-md q-px-sm" bordered>
            <div id="donut"/>
          </q-card>
        </div>
        <div class="col-6 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pt-md q-px-sm" bordered>
            <div id="line"/>
          </q-card>
        </div>
        <div class="col-6 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <q-card class="shadow-10 border-radius-10 q-ma-sm q-pt-md q-px-sm" bordered>
            <div id="area"/>
          </q-card>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ApexCharts from "apexcharts";
import axios from "axios";

export default defineComponent({
  name: 'IndexPage',
  props: ['dark'],
  data() {
    return {
      money: null,
      headerCards: [
        {
          title: 'Name',
          icon: 'dashboard',
          count: '123'
        },
        {
          title: 'Name',
          icon: 'dashboard',
          count: '123'
        },
        {
          title: 'Name',
          icon: 'dashboard',
          count: '123'
        },
        {
          title: 'Name',
          icon: 'dashboard',
          count: '123'
        }
      ]
    }
  },
  methods: {
    sparkCharts() {
      var randomizeArray = function (arg :any) {
        var array = arg.slice();
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
      var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];
      var spark1 = {
        chart: {
          id: 'sparkline1',
          group: 'sparklines',
          type: 'area',
          height: 160,
          sparkline: {enabled: true}
        },
        tooltip: {
          theme: this.$q.dark.isActive?'dark':'light'
        },
        stroke: {
          curve: 'straight'
        },
        fill: {
          opacity: 1,
        },
        series: [{
          name: 'Sales',
          data: randomizeArray(sparklineData)
        }],
        labels: [...Array(24).keys()].map(n => `2018-09-0${n+1}`),
        yaxis: {
          min: 0
        },
        xaxis: {
          type: 'datetime',
        },
        colors: ['#05c271'],
        title: {
          text: '$424,652',
          offsetX: 30,
          style: {
            color: this.$q.dark.isActive?'#fff':'',
            fontSize: '24px',
            cssClass: 'apexcharts-yaxis-title'
          }
        },
        subtitle: {
          text: 'Sales',
          offsetX: 30,
          style: {
            color: this.$q.dark.isActive?'#fff':'',
            fontSize: '14px',
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      }
      var spark2 = {
        chart: {
          id: 'sparkline2',
          group: 'sparklines',
          type: 'area',
          height: 160,
          sparkline: {
            enabled: true
          },
        },
        tooltip: {
          theme: this.$q.dark.isActive?'dark':'light'
        },
        stroke: {
          curve: 'straight'
        },
        fill: {
          opacity: 1,
        },
        series: [{
          name: 'Expenses',
          data: randomizeArray(sparklineData)
        }],
        labels: [...Array(24).keys()].map(n => `2018-09-0${n+1}`),
        yaxis: {
          min: 0
        },
        xaxis: {
          type: 'datetime',
        },
        colors: ['#008FFB'],
        title: {
          text: '$235,312',
          offsetX: 30,
          style: {
            color: this.$q.dark.isActive?'#fff':'',
            fontSize: '24px',
            cssClass: 'apexcharts-yaxis-title'
          }
        },
        subtitle: {
          text: 'Expenses',
          offsetX: 30,
          style: {
            color: this.$q.dark.isActive?'#fff':'',
            fontSize: '14px',
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      }
      var spark3 = {
        chart: {
          id: 'sparkline3',
          group: 'sparklines',
          type: 'area',
          height: 160,
          sparkline: {
            enabled: true
          },
        },
        tooltip: {
          theme: this.$q.dark.isActive?'dark':'light'
        },
        stroke: {
          curve: 'straight'
        },
        fill: {
          opacity: 1,
        },
        series: [{
          name: 'Profits',
          data: randomizeArray(sparklineData)
        }],
        labels: [...Array(24).keys()].map(n => `2018-09-0${n+1}`),
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          min: 0
        },
        colors: ['#5564BE'],
        title: {
          text: '$135,965',
          offsetX: 30,
          style: {
            color: this.$q.dark.isActive?'#fff':'',
            fontSize: '24px',
            cssClass: 'apexcharts-yaxis-title'
          }
        },
        subtitle: {
          text: 'Profits',
          offsetX: 30,
          style: {
            color: this.$q.dark.isActive?'#fff':'',
            fontSize: '14px',
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      }
      new ApexCharts(document.querySelector("#spark1"), spark1).render();
      new ApexCharts(document.querySelector("#spark2"), spark2).render();
      new ApexCharts(document.querySelector("#spark3"), spark3).render();
    }
  },
  watch: {
    'dark': {
      handler(d) {
        this.sparkCharts();
      }
    }
  },
  mounted() {
    axios.get(`https://cbu.uz/uz/arkhiv-kursov-valyut/json`).then(res => {
      console.log(res.data)
      console.log(res)
      this.money = res.data
    })
    this.sparkCharts();
    var colorPalette = ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0']
    var optionsArea = {
      chart: {
        height: 340,
        type: 'area',
        zoom: {
          enabled: false
        },
      },
      stroke: {
        curve: 'straight'
      },
      colors: colorPalette,
      series: [
        {
          name: "Blog",
          data: [{
            x: 0,
            y: 0
          }, {
            x: 4,
            y: 5
          }, {
            x: 5,
            y: 3
          }, {
            x: 9,
            y: 8
          }, {
            x: 14,
            y: 4
          }, {
            x: 18,
            y: 5
          }, {
            x: 25,
            y: 0
          }]
        },
        {
          name: "Social Media",
          data: [{
            x: 0,
            y: 0
          }, {
            x: 4,
            y: 6
          }, {
            x: 5,
            y: 4
          }, {
            x: 14,
            y: 8
          }, {
            x: 18,
            y: 5.5
          }, {
            x: 21,
            y: 6
          }, {
            x: 25,
            y: 0
          }]
        },
        {
          name: "External",
          data: [{
            x: 0,
            y: 0
          }, {
            x: 2,
            y: 5
          }, {
            x: 5,
            y: 4
          }, {
            x: 10,
            y: 11
          }, {
            x: 14,
            y: 4
          }, {
            x: 18,
            y: 8
          }, {
            x: 25,
            y: 0
          }]
        }
      ],
      fill: {
        opacity: 1,
      },
      title: {
        text: 'Daily Visits Insights',
        align: 'left',
        style: {
          fontSize: '18px'
        }
      },
      markers: {
        size: 0,
        style: 'hollow',
        hover: {
          opacity: 5,
        }
      },
      tooltip: {
        intersect: true,
        shared: false,
      },
      xaxis: {
        tooltip: {
          enabled: false
        },
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        tickAmount: 4,
        max: 12,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#78909c'
          }
        }
      },
      legend: {
        show: false
      }
    }
    var chartArea = new ApexCharts(document.querySelector('#area'), optionsArea);
    chartArea.render();
    var optionsBar = {
      chart: {
        type: 'bar',
        height: 380,
        width: '100%',
        stacked: true,
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
        }
      },
      colors: colorPalette,
      series: [{
        name: "Clothing",
        data: [42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51, 42, 56],
      }, {
        name: "Food Products",
        data: [6, 12, 4, 7, 5, 3, 6, 4, 3, 3, 5, 6, 7, 4],
      }],
      labels: [10,11,12,13,14,15,16,17,18,19,20,21,22,23],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#78909c'
          }
        }
      },
      title: {
        text: 'Monthly Sales',
        align: 'left',
        style: {
          fontSize: '18px'
        }
      }
    }
    var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBar);
    chartBar.render();
    var optionDonut = {
      chart: {
        type: 'donut',
        width: '100%',
        height: 400
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          customScale: 0.8,
          donut: {
            size: '75%',
          },
          offsetY: 20,
        },
        stroke: {
          colors: undefined
        }
      },
      colors: colorPalette,
      title: {
        text: 'Department Sales',
        style: {
          fontSize: '18px'
        }
      },
      series: [21, 23, 19, 14, 6],
      labels: ['Clothing', 'Food Products', 'Electronics', 'Kitchen Utility', 'Gardening'],
      legend: {
        position: 'left',
        offsetY: 80
      }
    }
    var donut = new ApexCharts(document.querySelector("#donut"), optionDonut)
    donut.render();
    function trigoSeries(cnt :any, strength :any) {
      var data = [];
      for (var i = 0; i < cnt; i++) {
        data.push((Math.sin(i / strength) * (i / strength) + i / strength+1) * (strength*2));
      }
      return data;
    }
    var optionsLine = {
      chart: {
        height: 340,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      plotOptions: {
        stroke: {
          width: 4,
          curve: 'smooth'
        },
      },
      colors: colorPalette,
      series: [
        {
          name: "Day Time",
          data: trigoSeries(52, 20)
        },
        {
          name: "Night Time",
          data: trigoSeries(52, 27)
        },
      ],
      title: {
        floating: false,
        text: 'Customers',
        align: 'left',
        style: {
          fontSize: '18px'
        }
      },
      subtitle: {
        text: '168,215',
        align: 'center',
        margin: 30,
        offsetY: 40,
        style: {
          color: '#222',
          fontSize: '24px',
        }
      },
      markers: {
        size: 0
      },

      grid: {

      },
      xaxis: {
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        tickAmount: 2,
        labels: {
          show: false
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false
        },
        min: 0,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetY: -20,
        offsetX: -30
      }
    }
    var chartLine = new ApexCharts(document.querySelector('#line'), optionsLine);
    chartLine.render().then(function () {
      var ifr :any = document.querySelector("#wrapper");
      if (ifr.contentDocument) {
        ifr.style.height = ifr.contentDocument.body.scrollHeight + 20 + 'px';
      }
    });
    var mobileDonut = function() {
      if(window.innerWidth < 768) {
        donut.updateOptions({
          plotOptions: {
            pie: {
              offsetY: -15,
            }
          },
          legend: {
            position: 'bottom'
          }
        }, false, false)
      }
      else {
        donut.updateOptions({
          plotOptions: {
            pie: {
              offsetY: 20,
            }
          },
          legend: {
            position: 'left'
          }
        }, false, false)
      }
    }
  }
});
</script>

<style scoped>
h1, h2, h3, h4, h5, h6, strong {
  font-weight: 600;
}
#spark1, #spark2, #spark3 {
  position: relative;
  padding-top: 15px;
}
</style>

<style>
.header-cards-line-0 {
  position: absolute;
  width: 100%;
  height: 6px;
  top: 0;
  background: linear-gradient(to right, rgb(0, 144, 222), rgb(183, 6, 185));
}
.header-cards-line-1 {
  position: absolute;
  width: 100%;
  height: 6px;
  top: 0;
  background: linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157));
}
.header-cards-line-2 {
  position: absolute;
  width: 100%;
  height: 6px;
  top: 0;
  background: linear-gradient(to right, rgb(204, 43, 94), rgb(117, 58, 136));
}
.header-cards-line-3 {
  position: absolute;
  width: 100%;
  height: 6px;
  top: 0;
  background: linear-gradient(to right, rgb(2, 170, 176), rgb(1, 101, 196));
}
</style>
