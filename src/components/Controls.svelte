<script>
  import SimulationControl from "./Controls/SimulationControl.svelte";
  import Timer from "./Controls/Timer.svelte";
  import { onDestroy } from "svelte";
  import { system } from "../stores/system";
  import { graph } from "../stores/graph";
  import { ExtGraph } from "../graph/render";

  const unsubscribe = system.subscribe((value) => {
    if ($graph instanceof ExtGraph) {
      const spec = $graph.getSpecification();
      delete spec.nodeState;
      delete spec.edgeState;
      $graph.updateSpecification(spec);
    }
  });

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

<svelte:window on:beforeunload={beforeUnload} />
<SimulationControl />
<Timer />

