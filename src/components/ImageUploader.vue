<template>
  <div class="image-uploader">
    <!-- Preview the image if available -->
    <div v-if="modelValue || previewUrl" class="image-preview mb-3">
      <v-img
        :src="previewUrl || getValidImageUrl(modelValue)"
        :aspect-ratio="1"
        cover
        width="150"
        height="150"
        class="rounded-lg mx-auto"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>
        </template>
        <template v-slot:error>
          <div class="d-flex flex-column align-center justify-center fill-height">
            <v-icon icon="mdi-image-off" size="36" color="grey-lighten-1" class="mb-1"></v-icon>
            <span class="text-caption text-grey-lighten-1">Failed to load</span>
          </div>
        </template>
      </v-img>
      <div class="d-flex justify-center mt-2">
        <v-btn
          size="small"
          color="error"
          variant="flat"
          prepend-icon="mdi-delete"
          @click="removeImage"
          class="ml-2"
        >
          Remove
        </v-btn>
      </div>
    </div>

    <!-- Upload area when no image is selected -->
    <v-card
      v-if="!modelValue && !previewUrl"
      class="upload-area d-flex flex-column align-center justify-center pa-4"
      variant="outlined"
      height="150"
      width="100%"
      @click="triggerFileInput"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :color="isDragging ? 'primary' : undefined"
      :class="{ 'border-primary': isDragging }"
    >
      <v-icon size="large" color="grey" class="mb-2">mdi-camera-plus</v-icon>
      <span class="text-body-2 text-center">
        {{ isDragging ? 'Drop to upload' : 'Click or drag image here to upload' }}
      </span>
      <span v-if="errorMessage" class="text-caption text-error mt-1">{{ errorMessage }}</span>
      <span class="text-caption text-medium-emphasis mt-1">
        JPG, PNG or WebP (max 2MB)
      </span>
    </v-card>

    <!-- Button to trigger file selection when an image is already uploaded -->
    <div v-if="!modelValue && !previewUrl" class="d-flex justify-center mt-2">
      <v-btn
        size="small"
        color="primary"
        variant="flat"
        prepend-icon="mdi-upload"
        :loading="uploading"
        @click="triggerFileInput"
      >
        {{ buttonText }}
      </v-btn>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg, image/png, image/webp"
      class="d-none"
      @change="onFileSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { uploadImage, deleteImage, MAX_IMAGE_SIZE, SUPPORTED_IMAGE_TYPES } from '../services/storage'
import { getValidImageUrl, isFirebaseStorageUrl } from '../utils/imageUtils'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  storagePath: {
    type: String,
    required: true,
    default: 'units'
  },
  buttonText: {
    type: String,
    default: 'Upload Image'
  }
})

const emit = defineEmits(['update:modelValue', 'upload-start', 'upload-success', 'upload-error'])

// File input reference
const fileInput = ref<HTMLInputElement | null>(null)

// State
const uploading = ref(false)
const errorMessage = ref('')
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)

// Methods
const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files.length) {
    handleFile(event.dataTransfer.files[0])
  }
}

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    handleFile(input.files[0])
  }
}

const handleFile = async (file: File) => {
  // Reset state
  errorMessage.value = ''
  selectedFile.value = file

  // Validate file
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    errorMessage.value = 'Unsupported file type. Please upload JPEG, PNG, or WebP images.'
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errorMessage.value = `File size exceeds the maximum limit of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    return
  }

  // Create local preview
  previewUrl.value = URL.createObjectURL(file)

  // Start upload if auto-upload is enabled
  await uploadSelectedFile()
}

const uploadSelectedFile = async () => {
  if (!selectedFile.value) return

  try {
    uploading.value = true
    emit('upload-start')

    // Upload the image to Firebase Storage
    const downloadUrl = await uploadImage(selectedFile.value, props.storagePath)

    // Update model value
    emit('update:modelValue', downloadUrl)
    emit('upload-success', downloadUrl)

    // Clear local preview
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to upload image'
    emit('upload-error', error)
  } finally {
    uploading.value = false
    selectedFile.value = null
  }
}

const removeImage = async () => {
  if (uploading.value) return

  try {
    // If we have a modelValue (an actual uploaded image URL), delete it from storage
    // Only delete the image if it appears to be a Firebase Storage URL
    if (props.modelValue && isFirebaseStorageUrl(props.modelValue)) {
      await deleteImage(props.modelValue);
    }

    // Clear local preview if it exists
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }

    // Reset state
    selectedFile.value = null;
    emit('update:modelValue', '');
  } catch {
    errorMessage.value = 'Failed to remove image';
  }
}

// Clean up object URLs when component is unmounted
watch(() => previewUrl.value, (newValue, oldValue) => {
  if (oldValue && oldValue !== newValue) {
    URL.revokeObjectURL(oldValue)
  }
})
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-area {
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.upload-area:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.border-primary {
  border: 2px dashed rgb(var(--v-theme-primary));
}
</style>
