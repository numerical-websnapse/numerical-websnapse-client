<script>
	import Notifications from "svelte-notifications";

	import Toolbars from './components/Toolbars.svelte';
	import Controls from "./components/Controls.svelte";
	import Canvas from './components/Canvas.svelte';
  	import Modals from './components/Modals.svelte';
	import Alert from "./components/Alert.svelte";

	// function beforeUnload(e) {
	// 	e.preventDefault();
	// 	e.returnValue = '';
	// 	document.documentElement.innerHTML = '';
	// 	return 'Are you sure you want to leave?';
	// }
</script>

<!-- <svelte:window on:beforeunload={beforeUnload}/> -->
<Notifications item={Alert}>
	<main>
		<Canvas/>
		<Modals/>
		<Toolbars/>
		<Controls/>
	</main>
</Notifications>

<style lang='postcss'>
	main {
		@apply w-full h-full overflow-hidden;
	} 
</style>