<template>
  <div>
    <div class="app-content">
      <client-only>
        <vue-range-slider
          v-model="value"
          tooltip="hover"
          :min="min"
          :max="max"
          :enable-cross="enableCross"
        ></vue-range-slider>
      </client-only>

      <div class="flex items-center mt-8 space-x-4">
        <FormInput
          class=""
          input-name="Min"
          :showLabel="false"
          :placeholder="`Min-${min}`"
          type="number"
          v-model="value[0]"
        />
        <FormInput
          class=""
          input-name="Max"
          :showLabel="false"
          :placeholder="`Max-${max}`"
          type="number"
          v-model="value[1]"
        />
      </div>

      <div class="flex items-center justify-between">
        <button
          @click="handleEmitValue"
          class="py-1 mt-2 text-sm rounded-lg text-primary"
        >
          Apply
        </button>

        <p>
          <strong>{{ constants.CURRENCY }}{{ value[0] }}</strong>
          <span>-</span>
          <strong>{{ constants.CURRENCY }}{{ value[1] || 0 }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import "vue-range-component/dist/vue-range-slider.css";
import constants from "@/utils/constants";
import FormInput from "@/components/UI/FormInput.vue";

export default {
  props: {
    initialValue: {
      type: Array,
      required: false
    }
  },
  components: {
    FormInput
  },
  data() {
    this.constants = constants;
    return {
      value: [0, 5000],
      enableCross: true,
      min: 0,
      max: 5000
    };
  },
  methods: {
    handleEmitValue() {
      const validatedValue = [
        this.value[0] || 0,
        this.value[1] || this.max || 10000
      ];
      this.$emit("changed", validatedValue);
    }
  }
};
</script>
