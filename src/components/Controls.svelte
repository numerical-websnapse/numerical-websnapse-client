<script>
  import SimulationControl from "./Controls/SimulationControl.svelte";
  import Timer from "./Controls/Timer.svelte";
  import { onDestroy } from "svelte";
  import { system } from "../stores/system";

  const unsubscribe = system.subscribe((value) => {});

  onDestroy(async () => {
    unsubscribe();
  });
</script>

<SimulationControl />
<Timer />

