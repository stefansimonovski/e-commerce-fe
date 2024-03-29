<template>
  <div class="relative w-full py-8 pb-32 bg-primary">
    <div
      v-if="!isLoadingSubcategory && !subCategory"
      class="flex items-center justify-center w-full h-32 mt-32 text-center"
    >
      <div class="flex flex-col items-center">
        <Icon name="category" />
        <p class="mt-2 text-lg text-primary">
          Sub Category with that name not found
        </p>
      </div>
    </div>

    <!-- subcategory header -->
    <div class="flex flex-col items-center w-full mt-4 mb-24 md:mt-32">
      <div v-if="isLoadingSubcategory" class="relative w-full h-32">
        <Spinner dark title="Fetching subcategory" />
      </div>

      <div v-if="subCategory" class="flex flex-col items-center ">
        <div class="w-full mb-8 overflow-hidden rounded-lg md:w-56 md:h-48">
          <img
            class="object-cover w-full h-full transition-all duration-300 transform cursor-pointer hover:scale-110"
            :src="subCategory.imageUrl"
            alt=""
          />
        </div>

        <h4 class="text-lg font-bold lg:text-3xl md:text-xl text-primary">
          {{ subCategory.name }}
        </h4>

        <p class="my-2 text-center text-secondary">
          {{ subCategory.description }}
        </p>

        <div class="flex items-center mt-2 space-x-2">
          <div class="flex items-center justify-center w-full">
            <h4 class="mr-2 font-semibold text-primary">
              {{ subCategory.totalProducts }}
            </h4>
            <p class=" text-secondary">products</p>
          </div>
        </div>
      </div>
    </div>

    <!-- main -->
    <div class="relative">
      <div class="flex w-full ">
        <aside v-if="subCategory" class="hidden md:block md:w-3/12">
          <div class="sticky left-0 z-50 top-20 ">
            <MultiRangeSlider class="mb-8" @changed="handlePriceChange" />

            <template v-if="subCategory">
              <SingleTextSelect
                class="mb-8"
                v-for="filter in subCategory.filters"
                :key="'filter-' + filter.id"
                :list-items="filter.filterOptions"
                :filter-name="filter.name"
                :extra-data="filter"
                @selected="handleSelectSubcategoryFilter"
              />
            </template>
          </div>
        </aside>

        <div v-if="subCategory" class="w-full md:px-8 lg:w-9/12">
          <!-- product sort dropdown -->
          <div class="sticky left-0 z-50 pb-4 top-20 bg-primary ">
            <div
              class="flex items-center justify-between w-full filters-header"
            >
              <div
                class="flex items-center w-full mt-4 space-x-2 md:mt-0 lg:w-1/2"
              >
                <p class="font-semibold text-primary">Sort By</p>
                <SelectDropdown
                  class="w-56"
                  :show-delete-btn="false"
                  :initial-value="productsSortFilters[0]"
                  :list-items="productsSortFilters"
                  @selected="handleSelectFilter"
                />
              </div>
            </div>
          </div>

          <div>
            <div v-if="isLoadingProducts" class="relative w-full h-32">
              <Spinner dark title="Fetching products" />
            </div>

            <!-- products list -->
            <div
              v-if="!isLoadingProducts && products"
              class="grid w-full grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-36"
            >
              <ProductCard
                v-for="(product, idx) in products"
                :key="'subcategory-product ' + product.uid"
                :idx="idx + 1"
                :product="product"
              />
            </div>

            <div class="flex items-center justify-center w-full h-16">
              <p
                class=" text-primary"
                v-if="!isLoadingProducts && products && products.length === 0"
              >
                No products found
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- mobile filters component -->
      <div
        v-if="!isMobileFiltersContentActive"
        class="fixed z-50 block bottom-8 right-8 md-hidden"
      >
        <button
          @click.stop="isMobileFiltersContentActive = true"
          aria-label="Filter Menu Toggle Button"
          class="px-2 py-2 ml-auto rounded md:hidden bg-tertiary"
        >
          <Icon name="filter" />
        </button>
      </div>

      <!-- filters content -->
      <div
        class="fixed top-0 left-0 z-50 w-full h-screen overscroll-auto bg-primary"
        v-if="isMobileFiltersContentActive"
      >
        <div class="flex flex-col h-full overflow-auto">
          <div class="h-full px-6 mt-32">
            <MultiRangeSlider class="mb-8" @changed="handlePriceChange" />

            <template v-if="subCategory">
              <SingleTextSelect
                class="mb-4 mb:mb-8"
                v-for="filter in subCategory.filters"
                :key="'filter-' + filter.id"
                :list-items="filter.filterOptions"
                :filter-name="filter.name"
                :minimized="true"
                :extra-data="filter"
                @selected="handleSelectSubcategoryFilter"
              />
            </template>
          </div>

          <button
            @click.stop="isMobileFiltersContentActive = false"
            aria-label="Filter Menu Toggle Button"
            class="absolute px-2 py-2 ml-auto rounded bg-tertiary bottom-8 right-8"
          >
            <Icon name="close" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const queryString = require("query-string");
import { mapState } from "vuex";
import Spinner from "@/components/Common/Spinner.vue";
import SelectDropdown from "@/components/UI/Select.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import SingleTextSelect from "@/components/UI/Filters/SingleTextSelect.vue";
import MultiRangeSlider from "@/components/UI/Filters/MultiRangeSlider.vue";
import Icon from "@/components/UI/Icon.vue";

export default {
  components: {
    Spinner,
    SelectDropdown,
    ProductCard,
    SingleTextSelect,
    MultiRangeSlider,
    Icon
  },
  computed: {
    ...mapState("categories", ["detailedCategories"])
  },
  data() {
    return {
      categoryName: "",
      subCategoryName: "",
      isLoadingProducts: false,
      isLoadingSubcategory: false,
      isMobileFiltersContentActive: false,
      categoryParams: null,
      sortParams: null,
      priceParams: {
        min: 0,
        max: 10000
      },
      subCategoryParams: null,
      products: null,
      subCategory: null,
      productsSortFilters: [
        {
          name: "Latest",
          filterName: "createdAt",
          sort: "desc"
        },
        {
          name: "Oldest",
          filterName: "createdAt",
          sort: "asc"
        }
      ]
    };
  },
  head() {
    return {
      title: `${
        this.subCategory ? this.subCategory.name : this.categoryName
      } | ECommerce`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${
            this.subCategory ? this.subCategory?.description : this.categoryName
          } | ECommerce`
        },
        {
          name: "twitter:image",
          content: `${this.subCategory && this.subCategory.imageUrl}`
        },
        {
          name: "og:image",
          content: `${this.subCategory && this.subCategory.imageUrl}`
        }
      ]
    };
  },
  async fetch() {
    try {
      this.categoryName = this.$route.params.category;
      this.subCategoryName = this.$route.params.subCategory;

      this.categoryParams = {
        categoryName: this.categoryName,
        subCategoryName: this.subCategoryName
      };

      const priceParams = {
        price: JSON.stringify({
          min: this.priceParams.min,
          max: this.priceParams.max
        })
      };

      this.priceParams = priceParams;

      if (!this.categoryName || !this.subCategoryName) return;

      if (!this.subCategory) {
        this.isLoadingSubcategory = true;
        const url = `categories/single/${this.subCategoryName}?includeProducts=false`;
        const res = await this.$axios.$get(url);
        this.subCategory = res.payload.category;
        this.isLoadingSubcategory = false;
      }

      const params = queryString.stringify({
        ...this.priceParams,
        ...this.categoryParams,
        ...(this.subCategoryParams && this.subCategoryParams),
        ...(this.sortParams && this.sortParams)
      });

      this.isLoadingProducts = true;
      const url = `products/filtered?${params}`;

      const res = await this.$axios.$get(url);

      this.products = res.payload.products;
      this.isLoadingProducts = false;
    } catch (error) {}
  },
  methods: {
    async fetchSingleCategory() {
      try {
        this.isLoadingProducts = true;
        const res = await this.$store.dispatch(
          "categories/fetchSingleCategory",
          {
            slug: this.subCategoryName,
            includeProducts: false
          }
        );
        this.subCategory = res.data.payload.category;
      } catch (error) {
      } finally {
        this.isLoadingProducts = false;
      }
    },
    async fetchProducts() {
      const params = queryString.stringify({
        ...this.priceParams,
        ...this.categoryParams,
        ...(this.subCategoryParams && this.subCategoryParams),
        ...(this.sortParams && this.sortParams)
      });

      try {
        this.isLoadingProducts = true;
        const res = await this.$store.dispatch(
          "products/fetchFilteredProducts",
          params
        );

        this.products = res.data.payload.products;
      } catch (error) {
      } finally {
        this.isLoadingProducts = false;
      }
    },
    handleSelectSubcategoryFilter(filter, extraData) {
      if (this.isLoadingProducts) return;

      if (
        !this.subCategoryParams ||
        (this.subCategoryParams &&
          this.subCategoryParams[extraData.name] === undefined)
      ) {
        this.subCategoryParams = {
          ...this.subCategoryParams,
          [extraData.name]: filter.name
        };
      } else {
        this.subCategoryParams && delete this.subCategoryParams[extraData.name];
      }

      this.isMobileFiltersContentActive = false;
      this.$fetch();
    },
    handleSelectFilter(filter) {
      if (this.isLoadingProducts) return;

      const sortParams = {
        sort: JSON.stringify({
          name: filter.filterName,
          sortBy: filter.sort
        })
      };
      this.sortParams = sortParams;
      this.$fetch();
    },
    handlePriceChange(value) {
      this.priceParams = {
        min: value[0],
        max: value[1] || 10000
      };
      this.isMobileFiltersContentActive = false;
      this.$fetch();
    }
  }
};
</script>
