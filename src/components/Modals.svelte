<script>
    import { onDestroy } from "svelte";
    import NodeActionsModal from "./Modals/NodeActionsModal.svelte";
    import GuidedModeModal from "./Modals/GuidedModeModal.svelte";
    import SettingsModal from "./Modals/SettingsModal.svelte";
    import HistoryModal from "./Modals/HistoryModal.svelte";
    import { modals } from "../stores/modals";

    const unsubscribe = modals.subscribe((value) => {});

    onDestroy(async () => {
        unsubscribe();
    });

    function beforeUnload(e) {
        unsubscribe();
        e.preventDefault();
        e.returnValue = "...";
        return "...";
    }
</script>

<svelte:window on:beforeunload={beforeUnload}/>
<GuidedModeModal/>
<NodeActionsModal/>
<SettingsModal/>
<HistoryModal/>

