<script>
	/** https://codepen.io/cl0udc0ntr0l/pen/xhBtF */
	export let id, toggle, setField;

	const toggleBtn = () => {
		toggle = !toggle;
		setField(`location.${id}`, toggle);
	};
</script>

<style>
	.toggle {
		position: relative;
		width: 75px;
		height: 40px;
		border-radius: 20px;
		-webkit-transition: border-color 0.6s ease-out;
		transition: border-color 0.6s ease-out;
		box-sizing: border-box;
		background: transparent;
		outline: none;
	}

	.toggle.toggle-on {
		border-color: rgba(137, 194, 217, 0.4);
		-webkit-transition: border-color 0.5s 0.15s ease-out;
		transition: border-color 0.5s 0.15s ease-out;
	}

	.toggle.toggle-on:focus {
		border-color: transparent;
		transition: none;
	}

	.toggle-button {
		position: absolute;
		top: 4px;
		width: 28px;
		bottom: 4px;
		right: 39px;
		border-radius: 19px;
		cursor: pointer;
		-webkit-transition: all 0.3s 0.1s, width 0.1s, top 0.1s, bottom 0.1s;
		transition: all 0.3s 0.1s, width 0.1s, top 0.1s, bottom 0.1s;
	}

	.toggle-on .toggle-button {
		top: 3px;
		width: 65px;
		bottom: 3px;
		right: 3px;
		border-radius: 23px;
		background-color: #89c2da;
		box-shadow: 0 0 16px #4b7a8d;
		-webkit-transition: all 0.2s 0.1s, right 0.1s;
		transition: all 0.2s 0.1s, right 0.1s;
	}

	.toggle-text-on {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		line-height: 36px;
		text-align: center;
		font-family: "Quicksand", sans-serif;
		font-size: 18px;
		font-weight: normal;
		-webkit-user-select: none; /* Chrome/Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+ */
		text-transform: uppercase;

		color: rgba(0, 0, 0, 0);
	}

	.toggle-on .toggle-text-on {
		color: #3b6a7d;
		-webkit-transition: color 0.3s 0.15s;
		transition: color 0.3s 0.15s;
	}

	.toggle-text-off {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 39px;
		line-height: 36px;
		text-align: center;
		font-family: "Quicksand", sans-serif;
		font-size: 14px;
		font-weight: bold;
		-webkit-user-select: none; /* Chrome/Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+ */

		text-transform: uppercase;
	}

	.toggle-on .toggle-text-off {
		color: rgba(0, 0, 0, 0);
	}

	/* used for streak effect */
	.glow-comp {
		position: absolute;
		opacity: 0;
		top: 10px;
		bottom: 10px;
		left: 10px;
		right: 10px;
		border-radius: 6px;
		background-color: rgba(75, 122, 141, 0.1);
		box-shadow: 0 0 12px rgba(75, 122, 141, 0.2);
		-webkit-transition: opacity 4.5s 1s;
		transition: opacity 4.5s 1s;
	}

	.toggle-on .glow-comp {
		opacity: 1;
		-webkit-transition: opacity 1s;
		transition: opacity 1s;
	}
</style>

<button
	id="{id}"
	class="{`toggle border-2 border-gray-700 focus:ring-4 focus:ring-offset-0 focus:ring-indigo-500 transform scale-75 ${
		toggle ? 'toggle-on' : ''
	}`}"
	on:click|preventDefault="{toggleBtn}">
	<div class="text-gray-700 toggle-text-off">NO</div>
	<div class="glow-comp"></div>
	<div class="bg-gray-700 toggle-button"></div>
	<div class="toggle-text-on">YES</div>
</button>
