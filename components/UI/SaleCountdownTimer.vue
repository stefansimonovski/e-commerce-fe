<template>
  <client-only>
    <div>
      <p>
        {{ formattedDateTime }}
      </p>
    </div>
  </client-only>
</template>

<script>
import { calculateCountdown } from "@/utils/dateFns";

export default {
  props: {
    sale: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tempDate: Date.now(),
      formattedDateTime: "",
      timerInterval: null
    };
  },
  methods: {
    onInterval() {
      this.formattedDateTime = calculateCountdown(
        this.tempDate,
        this.sale.validUntil
      );
    }
  },
  mounted() {
    this.countdownTimerInterval = setInterval(() => {
      this.tempDate = Date.now();
      this.onInterval();
    }, this.interval * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  }
};
</script>

<style></style>
