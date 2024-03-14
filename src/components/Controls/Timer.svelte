<script>
    import { system } from '../../stores/system';
</script>

<div class="fixed flex flex-row items-center space-x-2 rounded-lg bg-neutral-500/[0.1] py-1 px-2 top-[2.5vh] left-[2.5vw]">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 {$system.guided ? 'text-gray-100 dark:text-gray-100' : ''}">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">:</span>
    <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">{$system.time}</span>
</div>