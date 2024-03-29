<template>
  <div>
    <ModalSidebar
      @closeModal="handleCloseCategoryModal"
      :is-visible="isVisible"
      :title="headerTitle"
    >
      <ValidationObserver
        ref="categoryObserver"
        tag="form"
        @submit.prevent="handleCategoryAction"
      >
        <FormInput
          v-model="newCategory.name"
          clearable
          input-name="Category Name"
          validation-rules="required"
        />

        <FormSelect
          v-if="!metaInfo.isForCategory && metaInfo.editMode"
          :show-delete-btn="false"
          class="mb-6"
          label="Category"
          :is-loading-list="isFetchingMinimalCategories"
          :list-items="minimalCategories || []"
          :initial-value="initialSubCategory"
          @selected="onCategorySelected"
        />

        <FormInput
          v-model="newCategory.description"
          input-name="Description"
          component-type="textarea"
          validation-rules="required"
        />

        <div class="mb-6 images-wrapper">
          <UploadImages
            :max="1"
            uploadMsg="Category Image"
            :initialFiles="
              metaInfo.editMode
                ? [...imagesData.map(x => ({ imageUrl: x }))]
                : null
            "
            @changed="handleImages"
          />
        </div>

        <BaseButton
          :isLoading="metaInfo.isProcessingApi"
          :disabled="metaInfo.isProcessingApi"
          htmlType="submit"
          type="primary"
          >{{ headerTitle }}</BaseButton
        >
      </ValidationObserver>
    </ModalSidebar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UploadImages from "@/components/Common/UploadImages.vue";
import { ValidationObserver } from "vee-validate";
import ModalSidebar from "@/components/Common/ModalSidebar";
import BaseButton from "@/components/UI/Button";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/Select";

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    metaInfo: {
      type: Object,
      required: false,
      default() {
        return {
          isForCategory: true,
          editMode: false,
          isProcessingApi: false,
          categoryData: null
        };
      }
    }
  },
  components: {
    UploadImages,
    ValidationObserver,
    ModalSidebar,
    BaseButton,
    FormInput,
    FormSelect
  },
  computed: {
    ...mapState("categories", ["minimalCategories"]),
    headerTitle() {
      if (this.metaInfo.isForCategory) {
        if (this.metaInfo.editMode) return `Edit Category`;
        else return `Add Category`;
      } else {
        if (this.metaInfo.editMode) return `Edit Subcategory`;
        else return `Add Subcategory`;
      }
    },
    initialSubCategory() {
      if (this.metaInfo.isForCategory) return null;
      return this.minimalCategories.find(
        m => m.slug === this.metaInfo.categoryData.parentSlug
      );
    }
  },
  data() {
    return {
      imagesData: [],
      isFetchingMinimalCategories: false,
      newCategory: {
        name: "",
        description: "",
        imageUrl: "https://wallpaperset.com/w/full/1/a/6/52649.jpg"
      }
    };
  },
  watch: {
    isVisible: {
      handler(val) {
        if (!this.metaInfo.editMode) {
          if (this.newCategory.name) {
            this.resetCategory();
          }
        } else {
          this.imagesData = [this.metaInfo.categoryData.imageUrl];

          this.newCategory = {
            ...this.metaInfo.categoryData
          };
        }

        if (!this.metaInfo.isForCategory && !this.minimalCategories) {
          this.fetchMinimalCategories();
        }
      },
      immediate: true
    }
  },
  methods: {
    onCategorySelected(selectedCategory) {
      if (!selectedCategory || selectedCategory.id === undefined) return;

      if (!this.metaInfo.isForCategory && this.metaInfo.editMode) {
        this.newCategory = {
          ...this.newCategory,
          parentSlug: selectedCategory.slug,
          parentName: selectedCategory.name,
          parentId: selectedCategory.id
        };
      }
    },
    async fetchMinimalCategories() {
      this.isFetchingMinimalCategories = true;
      await this.$store.dispatch("categories/fetchMinimalCategories");
      this.isFetchingMinimalCategories = false;
    },
    async handleCategoryAction() {
      this.isHandlingCategory = true;

      const valid = await this.$refs.categoryObserver.validate();
      if (!valid) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "Please fill in the required fields",
          type: "danger"
        });
        this.isHandlingCategory = false;
        return;
      }
      this.$emit("handleOkAction", this.newCategory, this.imagesData);
    },
    async handleImages(imagesToUpload) {
      this.imagesData = imagesToUpload;
    },
    resetCategory() {
      Object.keys(this.newCategory).forEach(x => (this.newCategory[x] = ""));
      this.imagesData = [];
    },
    handleCloseCategoryModal() {
      if (this.metaInfo.isProcessingApi) return;
      this.$emit("closeModal");
    }
  }
};
</script>
