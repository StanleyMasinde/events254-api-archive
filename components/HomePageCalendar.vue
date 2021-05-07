<template>
  <div class="calendar-container">
    <router-link :to="`/calendar?date=${today.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ today.date() }}
      </div>
      <div class="day">
        {{ days[today.day()] }}
      </div>
    </router-link>

    <router-link :to="`/calendar?date=${todayPlusOne.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ todayPlusOne.date() }}
      </div>
      <div class="day">
        {{ days[todayPlusOne.day()] }}
      </div>
    </router-link>

    <router-link :to="`/calendar?date=${todayPlusTwo.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ todayPlusTwo.date() }}
      </div>
      <div class="day">
        {{ days[todayPlusTwo.day()] }}
      </div>
    </router-link>

    <router-link :to="`/calendar?date=${todayPlusThree.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ todayPlusThree.date() }}
      </div>
      <div class="day">
        {{ days[todayPlusThree.day()] }}
      </div>
    </router-link>

    <router-link :to="`/calendar?date=${todayPlusFour.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ todayPlusFour.date() }}
      </div>
      <div class="day">
        {{ days[todayPlusFour.day()] }}
      </div>
    </router-link>

    <router-link :to="`/calendar?date=${todayPlusFive.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ todayPlusFive.date() }}
      </div>
      <div class="day">
        {{ days[todayPlusFive.day()] }}
      </div>
    </router-link>

    <router-link :to="`/calendar?date=${todayPlusSix.toISOString().substr(0, 10)}`" tag="div" class="date-container">
      <div class="date">
        {{ todayPlusSix.date() }}
      </div>
      <div class="day">
        {{ days[todayPlusSix.day()] }}
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    today () {
      return this.$moment()
    },
    todayPlusOne () {
      return this.$moment().add(1, 'day')
    },
    todayPlusTwo () {
      return this.$moment().add(2, 'days')
    },
    todayPlusThree () {
      return this.$moment().add(3, 'days')
    },
    todayPlusFour () {
      return this.$moment().add(4, 'days')
    },
    todayPlusFive () {
      return this.$moment().add(5, 'days')
    },
    todayPlusSix () {
      return this.$moment().add(6, 'days')
    }
  }
}
</script>
<style lang="scss" scoped>
div {
  .calendar-container {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: scroll;
  }

  &.date-container {
    width: 100vw;
    text-align: center;
    cursor: pointer;
    padding: 0.3rem;
    border-radius: 5rem;

    &:hover, &:active {
        color: #ffffff;
        background-color: teal;
    }
  }
}
</style>
