<!-- Base for all the modals -->
<script setup lang="ts">
const props = defineProps<{
	name: string
	closeOnBackdrop?: boolean
	bodyClasses?: string
}>()

// Store modal as a ref
const modal = useState(props.name, () => ref<HTMLDialogElement | null>(null))
</script>

<template>
    <dialog class="modal" ref="modal">
		<!-- Modal content -->
		<form method="dialog" class="modal-box" :class="bodyClasses">
			<slot />
		</form>
		<!-- Modal content -->

		<!-- Close on backdrop -->
        <form method="dialog" class="modal-backdrop" >
            <button v-if="closeOnBackdrop">close</button>
        </form>
		<!-- Close on backdrop -->
    </dialog>
</template>

<style scoped lang="scss">
@import '@/assets/scss/utilities/helpers.scss';

.modal-box {
    @apply gradient-border-top gradient-secondary prose max-w-[600px] rounded-lg px-8 py-10;
}

.modal-backdrop {
    @apply backdrop-blur-[6px];
}
</style>
