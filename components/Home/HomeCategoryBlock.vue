<template>
  <div>
    <BlockHeaderUI>
      <template #left>
        {{ categoryName }}
      </template>

      <template #right>
        <button
          @click="$router.push('/latestProducts')"
          class="flex items-center text-secondary "
        >
          <span>Explore More {{ categoryName }}</span>
          <Icon name="arrow-right" />
        </button>
      </template>
    </BlockHeaderUI>

    <div v-if="isLoadingProducts && !products" class="relative w-full h-32">
      <Spinner dark title="Fetching products" />
    </div>
    <div class="products-grid" v-if="products">
      <ProductCard
        @click="handleSelectProduct(product)"
        v-for="(product, idx) in products"
        :key="product.categoryName + '-products-' + product.uid"
        :idx="idx + 1"
        :product="product"
      />
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/Common/ProductCard.vue";
import Spinner from "@/components/Common/Spinner.vue";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";
import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";
import { generateUrl } from "@/utils";

export default {
  props: {
    categorySlug: {
      type: String,
      required: true
    },
    products: {
      type: Array,
      required: true
    }
  },
  components: {
    ProductCard,
    Spinner,
    BlockHeaderUI,
    Icon,
    BaseButton
  },
  computed: {
    categoryName() {
      return this.categorySlug
        ? this.categorySlug.substring(0, 1).toUpperCase() +
            this.categorySlug.substring(1, this.categorySlug.length)
        : "";
    }
  },
  data() {
    return {
      isLoadingProducts: false
    };
  },
  methods: {}
};
</script>
