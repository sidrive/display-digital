<template>
  <div>
    <video-background v-if="showJadwal" :src="bgVideo" style="max-height: 100%; height: 100vh">
      <div id="clock">
        <div id="jam">
          <span class="clsjam">{{ time }}</span>
          <div class="jam">{{ second }}</div>
        </div>
        <p class="date">{{ date }}</p>
        <!-- <p class="text">Zakanet</p> -->
      </div>
      <div id="left-container">
        <div id="jam"></div>
        <div id="jadwal" style="font-size: 2vw">Jadwal Shalat</div>
        <div id="jadwal" v-for="shalat in dataShalat" :key="shalat.id">
          <div
            class="row"
            :class="shalat.active ? 'active' : ''"
            style="display: flex; max-width: 15vw"
          >
            <div class="col-xs-5">{{ shalat.id }}</div>
            <div class="col-xs-7">{{ shalat.value }}</div>
          </div>
        </div>
      </div>

      <!-- <div id="clock">
        
      </div> -->
    </video-background>
    <div v-if="showCounter" id="count-down" class="full-screen">
      <video-background src="/bg-masjid.mp4" style="max-height: 100%; height: 100vh">
        <div class="counter">
          <vue-countdown
            v-if="beforeAdzan"
            ref="waitadzan"
            :time="5 * 60 * 1000"
            v-slot="{ minutes, seconds }"
            @end="endCountdown"
          >
            <div id="jam" style="text-transform: capitalize">
              {{ minutes }} <span class="count">menit</span> {{ seconds }}
              <span class="count">detik</span>
            </div>
            <div v-if="nextPrayerTime.id">
              Menuju waktu Adzan {{ nextPrayerTime.id.toUpperCase() }}
            </div>
          </vue-countdown>
          <vue-countdown
            v-if="showAdzan"
            ref="showadzan"
            :time="5 * 60 * 1000"
            v-slot="{ minutes, seconds }"
            @end="endCountAdzan"
          >
            <div id="jam" style="text-transform: capitalize">
              Waktu Adzan {{ nextPrayerTime.id.toUpperCase() }}
            </div>
            <div style="text-transform: capitalize">
              {{ minutes }} <span>menit</span> {{ seconds }} detik
            </div>
          </vue-countdown>
          <vue-countdown
            v-if="showIqomah"
            ref="waitiqomah"
            :time="5 * 60 * 1000"
            v-slot="{ minutes, seconds }"
            @end="endCountIqomah"
          >
            <div id="jam" style="text-transform: capitalize">
              {{ minutes }} <span class="count">menit</span> {{ seconds }}
              <span class="count">detik</span>
            </div>
            <div v-if="nextPrayerTime.id">
              Menuju waktu iqomah {{ nextPrayerTime.id.toUpperCase() }}
            </div>
          </vue-countdown>
        </div>
      </video-background>
    </div>
  </div>
</template>
<script>
import { listShalat, searchCity } from '@/api/jadwalsholat'
import moment from 'moment'
export default {
  data() {
    return {
      date: null,
      time: null,
      second: null,
      week: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      loading: false,
      dateNow: null,
      dataShalat: {},
      nextPrayerTime: {},
      bgVideo: '',
      showJadwal: true,
      showCounter: false,
      showIqomah: false,
      beforeAdzan: false,
      showAdzan: false,
    }
  },

  watch: {
    time: function (newTime, oldTime) {
      this.generateBackground(newTime)

      if (newTime === '00:00') {
        this.getListShalat()
        setTimeout(() => this.checkActiveShalat(), 5000)
      }

      if (this.nextPrayerTime.id) {
        if (['Imsak', 'Terbit'].includes(this.nextPrayerTime.id)) {
          if (newTime === String(this.nextPrayerTime.value)) {
            this.checkActiveShalat()
          }
        } else {
          if (newTime === String(this.nextPrayerTime.waitAdzan)) {
            console.log('adzan')
            this.showCounter = true
            this.showJadwal = false
            this.beforeAdzan = true
            this.checkActiveShalat()
            setTimeout(() => this.$refs.waitadzan.restart(), 2000)
          }
        }
      } else {
        this.checkActiveShalat()
        console.log(`It's time for ${this.nextPrayerTime.id} prayer!`)
      }

      // if (this.nextPrayerTime.id === undefined) {
      //   this.checkActiveShalat()
      //   console.log(`It's time for ${this.nextPrayerTime.id} prayer!`)
      // }

      // if (
      //   newTime === String(this.nextPrayerTime.value) &&
      //   ['Imsak', 'Terbit'].includes(this.nextPrayerTime.id)
      // ) {
      //   this.checkActiveShalat()
      // }

      // if (
      //   newTime === String(this.nextPrayerTime.waitAdzan) &&
      //   !['Imsak', 'Terbit'].includes(this.nextPrayerTime.id)
      // ) {
      //   console.log('adzan')
      //   this.showCounter = true
      //   this.showJadwal = false
      //   this.beforeAdzan = true
      //   this.checkActiveShalat()
      //   setTimeout(() => this.$refs.waitadzan.restart(), 2000)
      // }
    },
  },

  mounted() {
    // var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    // var timerID = setInterval(this.updateTime(), 1000)
    // this.updateTime()

    setInterval(() => {
      this.updateTime()
    }, 1000)

    this.getListShalat()
  },

  methods: {
    zeroPadding(num, digit) {
      var zero = ''
      for (var i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },

    updateTime() {
      var cd = new Date()
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2)
      this.second = this.zeroPadding(cd.getSeconds(), 2)
      this.date =
        this.week[cd.getDay()] +
        ' ' +
        this.zeroPadding(cd.getDate(), 2) +
        '-' +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        '-' +
        this.zeroPadding(cd.getFullYear(), 4)
    },

    async getListShalat() {
      this.loading = true
      var cd = new Date()
      const dateNow =
        this.zeroPadding(cd.getFullYear(), 4) +
        '-' +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        '-' +
        this.zeroPadding(cd.getDate(), 2)
      await listShalat(dateNow)
        .then((response) => {
          console.log('resp', response.data.data)
          this.dataShalat = Object.entries(response.data.data.jadwal)
            .map(([id, value]) => ({
              id:
                id !== 'tanggal' && id !== 'date' && id !== 'dhuha'
                  ? id.charAt(0).toUpperCase() + id.slice(1)
                  : null,
              value,
            }))
            .filter((item) => item.id !== null)
          this.loading = false
          this.dataShalat.map((i) => {
            const date = new Date()
            const [hours, minutes] = i.value.split(':')

            // Mengatur jam dan menit
            date.setHours(parseInt(hours, 10))
            date.setMinutes(parseInt(minutes, 10))
            date.setSeconds(0)

            const waitAdzan = moment(i.value, 'HH:mm').subtract(5, 'm')
            const iqomah = moment(i.value, 'HH:mm').add(10, 'm')
            i.time = date
            i.waitAdzan = waitAdzan.format('HH:mm')
            i.iqomah = iqomah.format('HH:mm')
          })
          // this.checkActiveShalat()
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response)
          }
          this.loading = false
        })
    },

    checkActiveShalat() {
      const currentTime = moment().format('HH:mm')
      // const timeString = '21:30'
      const targetTime = moment(currentTime, 'HH:mm')

      let closestShalat = null
      let closestShalatTime = null
      this.dataShalat.forEach((shalat, index) => {
        shalat.active = false
        const shalatTime = moment(shalat.time, 'HH:mm')
        console.log('timeA', targetTime.isBefore(shalatTime))
        if (
          targetTime.isBefore(shalatTime) &&
          (!closestShalatTime || shalatTime.diff(targetTime) < closestShalatTime.diff(targetTime))
        ) {
          closestShalat = shalat
          closestShalatTime = shalatTime
        }
      })
      if (closestShalat) {
        closestShalat.active = true
        this.nextPrayerTime = closestShalat
      }

      // const timeString = '00:15'

      // // Membuat objek Date dengan menambahkan tanggal saat ini
      // const currentTime = new Date()
      // const [hours, minutes] = timeString.split(':')

      // // Mengatur jam dan menit
      // currentTime.setHours(parseInt(hours, 10))
      // currentTime.setMinutes(parseInt(minutes, 10))
      // currentTime.setSeconds(0)

      // this.dataShalat.forEach((shalat, index) => {
      //   if (shalat.time < currentTime) {
      //     console.log('timeA', this.dataShalat.length)
      //     this.dataShalat.forEach((s) => (s.active = false))
      //     // shalat.active = true
      //     if (index === this.dataShalat.length - 1) {
      //       this.dataShalat[0].active = true
      //       this.nextPrayerTime = this.dataShalat[0]
      //     } else {
      //       this.dataShalat[index + 1].active = true
      //       this.nextPrayerTime = this.dataShalat[index + 1]
      //     }
      //   }
      // })
      // console.log('time', currentTime)
    },

    generateBackground(newTime) {
      if (newTime >= '16:00' && newTime <= '18:00') {
        console.log("It's between 16:00 and 18:00 bro")
        this.bgVideo = '/campfire-sore.mp4'
      } else if (newTime >= '06:00' && newTime <= '15:59') {
        this.bgVideo = '/landscape-siang.mp4'
      } else {
        this.bgVideo = '/campfire.mp4'
      }
    },

    endCountdown() {
      this.showAdzan = true
      this.beforeAdzan = false
      // this.checkActiveShalat()
      setTimeout(() => this.$refs.showadzan.restart(), 2000)
    },
    endCountAdzan() {
      this.showAdzan = false
      this.showIqomah = true
      setTimeout(() => this.$refs.waitiqomah.restart(), 2000)
    },
    endCountIqomah() {
      this.showIqomah = false
      this.showCounter = false
      this.showJadwal = true
      this.checkActiveShalat()
    },
  },
}
</script>
