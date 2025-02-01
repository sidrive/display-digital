<template>
  <div>
    <video-background
      src="../../public/campfire.mp4"
      style="max-height: 100%; height: 100vh"
    >
      <div id="clock">
        <p class="date">{{ date }}</p>
        <p class="time">{{ time }}</p>
        <!-- <p class="text">Zakanet</p> -->
      </div>
    </video-background>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date: null,
      time: null,
      week: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    };
  },

  mounted() {
    // var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    // var timerID = setInterval(this.updateTime(), 1000)
    // this.updateTime()
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  methods: {
    zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },

    updateTime() {
      var cd = new Date();
      this.time =
        this.zeroPadding(cd.getHours(), 2) +
        ":" +
        this.zeroPadding(cd.getMinutes(), 2) +
        ":" +
        this.zeroPadding(cd.getSeconds(), 2);
      this.date =
        this.zeroPadding(cd.getFullYear(), 4) +
        "-" +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        "-" +
        this.zeroPadding(cd.getDate(), 2) +
        " " +
        this.week[cd.getDay()];
    },
  },
};
</script>
