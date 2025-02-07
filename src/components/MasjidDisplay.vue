<template>
  <div>
    <div id="preloader">
      <div id="status">&nbsp;</div>
    </div>

    <div id="full-screen-clock" v-show="isClockVisible"></div>
    <div id="count-down" class="full-screen" v-show="isCountDownVisible">
      <div class="counter">
        <h1>COUNTER</h1>
        <div class="hh">{{ counter.hours }}<span>JAM</span></div>
        <div class="ii">{{ counter.minutes }}<span>MENIT</span></div>
        <div class="ss">{{ counter.seconds }}<span>DETIK</span></div>
      </div>
    </div>

    <div
      class="carousel fade-carousel slide"
      :data-ride="'carousel'"
      :data-interval="wallpaperTimer"
    >
      <div class="overlay"></div>
      <div class="carousel-inner" v-html="wallpaper"></div>
    </div>

    <div id="left-container">
      <div id="jam">{{ currentTime }}</div>
      <div id="tgl">{{ currentDate }}</div>
      <div id="jadwal" v-html="schedule"></div>
    </div>

    <div id="right-counter" v-show="isRightCounterVisible">
      <div class="counter">
        <h1>COUNTER</h1>
        <div class="hh">{{ rightCounter.hours }}<span>JAM</span></div>
        <div class="ii">{{ rightCounter.minutes }}<span>MENIT</span></div>
        <div class="ss">{{ rightCounter.seconds }}<span>DETIK</span></div>
      </div>
    </div>

    <div id="logo" :style="{ backgroundImage: 'url(logo/' + logo + ')' }"></div>
    <div id="running-text">
      <!-- <marquee>
       <span v-for="(text, index) in runningTexts" :key="index">
         <i class="fa fa-square-o" aria-hidden="true"></i> {{ text }}
       </span>
     </marquee> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wallpaper: '',
      wallpaperTimer: 0,
      currentTime: '',
      currentDate: '',
      schedule: '',
      isClockVisible: false,
      isCountDownVisible: false,
      isRightCounterVisible: false,
      rightCounter: { hours: 0, minutes: 0, seconds: 0 },
      counter: { hours: 0, minutes: 0, seconds: 0 },
      logo: '',
      runningTexts: [],
    }
  },
  methods: {
    initialize() {
      // Load data from JSON and set up timers
      this.loadData()
      this.setupTimers()
    },
    loadData() {
      // Load your JSON data here and set the relevant data properties
    },
    setupTimers() {
      // Set up your timers for the countdown and other functionalities
    },
    updateClock() {
      // Update the current time and date
    },
    // Other methods for handling countdowns, displaying schedules, etc.
  },
  mounted() {
    this.initialize()
  },
}
</script>

<style scoped>
/* Add your styles here */
</style>
