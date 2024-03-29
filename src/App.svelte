<script>
	import { onMount } from "svelte";

	import tippy from "sveltejs-tippy";
	import { createForm } from "felte";
	import { validator } from "@felte/validator-yup";
	import reporter from "@felte/reporter-tippy";
	import * as yup from "yup";

	import addCustomMethodsToYup from "@utils/yup-defs";

	addCustomMethodsToYup();

	import marked from "marked";

	import SlimSelect from "slim-select";
	import currencyToSymbolMap from "currency-symbol-map/map";
	import getSymbolFromCurrency from "currency-symbol-map";
	import { countries, flag, name } from "country-emoji";

	import { ToggleBtn } from "@components";
	import {
		commonTippyConfig,
		categories,
		types,
		flairs,
		markdownExample,
		status,
	} from "@constants";

	import { pickBy } from "@utils";

	const currencyCodes = Object.keys(currencyToSymbolMap);
	const countryCodes = Object.keys(countries);

	let currencySelector,
		countriesSelector,
		citiesSelector,
		tagsSelector,
		categorySelector,
		typeSelector,
		flairSelector;

	let countriesSlimSelector, citiesSlimSelector, tagsSlimSelector;

	onMount(() => {
		new SlimSelect({
			select: currencySelector,
		});
		countriesSlimSelector = new SlimSelect({
			select: countriesSelector,
			limit: 5,
			closeOnSelect: false,
			placeholder: "Select Countries",
		});
		citiesSlimSelector = new SlimSelect({
			select: citiesSelector,
			limit: 5,
			closeOnSelect: false,
			placeholder: "Select Cities",
			addable: (value) => {
				return value;
			},
			searchingText: "Searching...",
			ajax: (search, callback) => {
				if (search.length < 3) {
					callback("Need 3 Characters");
					return;
				}
				const data = [
					{ text: "New York" },
					{ text: "New Delhi" },
					{ text: "New Hampshire" },
				];
				setTimeout(() => {
					callback(data);
				}, 1000);
			},
		});
		tagsSlimSelector = new SlimSelect({
			select: tagsSelector,
			limit: 5,
			placeholder: "Select Tags",
			closeOnSelect: false,
			addable: (value) => {
				return {
					text: value,
					value: value,
				};
			},
			searchingText: "Searching...",
			ajax: (search, callback) => {
				if (search.length < 3) {
					callback("Need 3 Characters");
					return;
				}
				const data = [
					{ text: "Java" },
					{ text: "JavaScript" },
					{ text: "Java Script" },
				];
				setTimeout(() => {
					callback(data);
				}, 1000);
			},
		});
		new SlimSelect({
			select: categorySelector,
			placeholder: "Select Category",
		});
		new SlimSelect({
			select: typeSelector,
			placeholder: "Select Job Type",
		});
		new SlimSelect({
			select: flairSelector,
			placeholder: "Select Flair",
			allowDeselect: true,
		});
	});

	const validateSchema = yup.object().shape({
		title: yup
			.string()
			.trim()
			.min(3, "Min 3 Characters")
			.max(25, "Maximum 25 Characters")
			.required("Required"),
		url: yup.string().url("Must be a URL").required("Required"),
		salary: yup.object({
			min: yup.number().truncate().positive("Must be more than Zero"),
			max: yup
				.number()
				.truncate()
				.moreThan(yup.ref("min"), "Must be more than Minimum"),
			currency: yup.string(),
		}),
		location: yup.object({
			remote: yup.boolean(),
			worldwide: yup.boolean().when("remote", {
				is: true,
				then: yup.boolean(),
				otherwise: yup.boolean().strip(),
			}),
			countries: yup.array().when(["remote", "worldwide"], {
				is: (remote, worldwide) => remote && worldwide,
				then: yup.array().strip(),
				otherwise: yup.array().min(1, "Required").max(5, "At max 5"),
			}),
			cities: yup.array().when(["remote", "worldwide"], {
				is: (remote, worldwide) => remote && worldwide,
				then: yup.array().strip(),
				otherwise: yup.array().min(1, "Required").max(5, "At max 5"),
			}),
			timezone: yup.object().when(["remote", "worldwide", "countries"], {
				is: (remote, worldwide, countries) =>
					remote && !worldwide && countries?.length > 1,
				then: yup.object({
					min: yup
						.number()
						.truncate()
						.min(-12, "Must be more than -12")
						.lessThan(yup.ref("max"), "Must be less than Max"),
					max: yup
						.number()
						.truncate()
						.moreThan(yup.ref("min"), "Must be more than Min")
						.max(14, "Must be less than 14"),
				}),
				otherwise: yup.object().strip(),
			}),
		}),
		tags: yup.array().min(1, "Required").max(5, "At max 5"),
		category: yup.string().required("Required"),
		type: yup.string().required("Required"),
		flair: yup.string().nullable().notRequired(),
		description: yup
			.string()
			.wordLimit(1000, "Keep it Short")
			.required("Required"),
	});

	const { form, data, errors, setField, reset } = createForm({
		initialValues: {
			title: "",
			url: "",
			salary: {
				min: "",
				max: "",
				currency: "USD",
			},
			location: {
				remote: true,
				worldwide: true,
				countries: [],
				cities: [],
				timezone: {},
			},
			tags: [],
			category: "",
			type: "",
			flair: null,
			description: "",
		},
		extend: [validator, reporter()],
		validateSchema,
		onSubmit: (values) => {
			const payload = validateSchema.cast(pickBy(values));

			payload.created = new Date().toISOString();
			payload.status = status.Active;

			console.log(payload);
		},
	});

	let isEditMode = true;

	const showExample = () => {
		setField("description", markdownExample);
	};
</script>

<style>
	textarea {
		resize: none;
	}

	.shadow-selected {
		box-shadow: 0 4px 5px rgb(0 0 0 / 50%);
	}

	.markdown-btn:focus {
		box-shadow: inset 0 1px 0 rgb(255 204 0 / 50%),
			0 1px 5px rgb(0 0 0 / 50%);
	}
</style>

<div class="flex flex-col items-center w-full py-10">
	<header>
		<h1 class="text-4xl font-bold text-white">
			<a
				href="https://svelte.dev/"
				class="text-white"
				target="_blank"
				rel="noopener">
				Svelte
			</a>
			+
			<a
				href="https://felte.dev/"
				class="text-white"
				target="_blank"
				rel="noopener">
				Felte
			</a>
			= <span class="text-red-500">❤️</span>
		</h1>
	</header>
	<main
		class="flex flex-col w-11/12 m-10 text-left items-left sm:w-10/12 md:w-9/12 lg:w-8/12">
		<form
			use:form
			class="relative flex flex-col px-4 py-5 space-y-6 text-white transition-shadow duration-300 ease-in-out bg-gray-900 rounded-lg hover:shadow-lg ribbon-container">
			<span class="ribbon left"> Job Post </span>

			<div
				class="grid grid-flow-row grid-cols-2 grid-rows-1 gap-x-4 gap-y-6">
				<div>
					<label
						for="title"
						class="inline-flex items-center text-sm font-medium text-gray-300 cursor-pointer focus:outline-none"
						use:tippy="{{
							...commonTippyConfig,
							content: `
						<b>Title (Required)</b>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Keep it short & simple.</li>
							<li>Create multiple job posts for multiple roles.</li>
							<li>A job post is limited to a single job.</li>
							<li>Must be a real job.</li>
							<li><b>DO NOT WRITE IN FULL CAPS</b>.</li>
						</ul>`,
						}}">
						Title
						<svg
							width="15"
							height="15"
							class="text-[#fc0] ml-1 -mt-0.5">
							<use xlink:href="#information-circle"></use>
						</svg>
					</label>
					<input
						id="title"
						type="text"
						name="title"
						autocomplete="title"
						placeholder="Job Title"
						class="{`block w-full mt-1 bg-gray-800 rounded-md shadow-sm sm:text-sm
					${
						$errors.title
							? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
					}`}" />
				</div>

				<div id="parent">
					<label
						for="url"
						class="inline-flex items-center text-sm font-medium text-gray-300 cursor-pointer focus:outline-none"
						use:tippy="{{
							...commonTippyConfig,
							content: `
						<center><b>Link (Required)</b></center>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>A link to your job application site.</li>
							<li>If you don't have one, make it with <a class="inline font-bold" target="_blank" rel="noopener" href="https://www.lever.co/">Lever.co</a>.</li>
						</ul>`,
							interactive: true,
							appendTo: 'parent',
						}}">
						Link
						<svg
							width="15"
							height="15"
							class="text-[#fc0] ml-1 -mt-0.5">
							<use xlink:href="#information-circle"></use>
						</svg>
					</label>
					<input
						id="url"
						type="url"
						inputmode="url"
						name="url"
						autocomplete="url"
						class="{`block w-full mt-1 bg-gray-800 rounded-md shadow-sm sm:text-sm
					${
						$errors.url
							? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
					}`}"
						placeholder="https://example.com/job-post" />
				</div>
			</div>
			<div></div>
			<fieldset
				name="salary"
				class="relative flex flex-col p-3 pt-6 border border-gray-700 rounded-lg">
				<div
					for="currency"
					class="absolute inline-flex items-center pl-4 pr-3 text-sm bg-gray-800 border border-gray-700 cursor-pointer focus:outline-none -top-3 left-5 rounded-xl"
					data-felte-reporter-tippy-trigger-for="currency"
					id="currency-label"
					use:tippy="{{
						...commonTippyConfig,
						content: `
					<b>Salary (Required)</b>
					<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
					<ul class="text-left hex">
						<li>Google doesn't index jobs without salary.</li>
						<li>Must be in yearly format.</li>
					</ul>`,
					}}">
					Salary
					<svg
						width="15"
						height="15"
						class="text-[#fc0] ml-1.5 -mt-0.5">
						<use xlink:href="#information-circle"></use>
					</svg>
				</div>
				<div
					class="grid grid-flow-col gap-2"
					data-felte-reporter-tippy-for="currency"
					aria-labelledby="currency-label">
					<select
						id="currency"
						name="currency"
						bind:this="{currencySelector}"
						bind:value="{$data.salary.currency}"
						class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
						{#each currencyCodes as currencyCode}
							<option class="bg-gray-800" value="{currencyCode}">
								{currencyCode}
							</option>
						{/each}
					</select>
					<div class="flex rounded-md shadow-sm">
						<div
							class="flex items-center px-3 bg-gray-700 border border-r-0 border-gray-700 pointer-events-none rounded-l-md">
							<span class="text-gray-500 sm:text-sm">
								{getSymbolFromCurrency($data.salary.currency)}
							</span>
						</div>
						<input
							type="text"
							inputmode="numeric"
							name="min"
							bind:value="{$data.salary.min}"
							class="{`block w-full bg-gray-800 border-l-0 rounded-r-md shadow-sm sm:text-sm
						${
							$errors.salary.min
								? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
								: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
						}`}"
							placeholder="0.00" />
					</div>
					<div class="flex rounded-md shadow-sm">
						<div
							class="flex items-center px-3 bg-gray-700 border border-r-0 border-gray-700 pointer-events-none rounded-l-md">
							<span class="text-gray-500 sm:text-sm"
								>{getSymbolFromCurrency(
									$data.salary.currency
								)}</span>
						</div>
						<input
							type="text"
							inputmode="numeric"
							name="max"
							bind:value="{$data.salary.max}"
							class="{`block w-full bg-gray-800 border-l-0 rounded-r-md shadow-sm sm:text-sm
						${
							$errors.salary.max
								? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
								: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
						}`}"
							placeholder="0.00" />
					</div>
				</div>
			</fieldset>
			<div></div>
			<fieldset
				name="location"
				class="relative flex flex-col p-3 pt-0 space-y-6 border border-gray-700 rounded-lg">
				<div
					for="currency"
					class="absolute inline-flex items-center pl-4 pr-3 text-sm bg-gray-800 border border-gray-700 cursor-pointer focus:outline-none -top-3 left-5 rounded-xl"
					use:tippy="{{
						...commonTippyConfig,
						content: `
					<b>Location (Required)</b>
					<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
					<ul class="text-left hex">
						<li>Jobs will be presented to candidates based on location.</li>
						<li>Worldwide positions will get widest exposure.</li>
					</ul>`,
					}}">
					Location
					<svg
						width="15"
						height="15"
						class="text-[#fc0] ml-1.5 -mt-0.5">
						<use xlink:href="#information-circle"></use>
					</svg>
				</div>
				<div class="grid grid-flow-row gap-2">
					<div class="flex items-center justify-between p-2 pr-0">
						<label
							for="remote"
							class="block mb-1 text-sm font-medium text-gray-300">
							Is this a Remote Position?
						</label>
						<ToggleBtn
							id="remote"
							toggle="{$data.location.remote}"
							setField="{setField}" />
					</div>
					{#if $data.location.remote}
						<div class="flex items-center justify-between p-2 pr-0">
							<label
								for="worldwide"
								class="block mb-1 text-sm font-medium text-gray-300">
								Is this Worldwide?
							</label>
							<ToggleBtn
								id="worldwide"
								toggle="{$data.location.worldwide}"
								setField="{setField}" />
						</div>
					{/if}
				</div>

				<div
					class="{`grid-flow-row grid-cols-1 grid-rows-2 gap-6
			${$data.location.remote && $data.location.worldwide ? 'hidden' : 'grid'}`}">
					<div>
						<label
							for="countries"
							id="countries-label"
							data-felte-reporter-tippy-trigger-for="countries"
							class="flex items-center mb-1 text-sm font-medium text-gray-300 cursor-pointer grid-col-2">
							Countries
						</label>
						<div
							data-felte-reporter-tippy-for="countries"
							aria-labelledby="countries-label"
							class="{`pointer-events-auto rounded-md shadow-sm mt-1 sm:text-sm
						${
							$errors.location.countries
								? 'border-red-500 ring-2 ring-red-500 focus:ring-red-500 focus:border-red-500'
								: ''
						}`}">
							<!-- svelte-ignore a11y-no-onchange -->
							<select
								id="countries"
								name="countries"
								bind:this="{countriesSelector}"
								on:change="{() =>
									($data.location.countries = countriesSlimSelector.selected())}"
								multiple
								data-felte-reporter-tippy-ignore
								class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md">
								{#each countryCodes as countryCode}
									<option
										class="bg-gray-800"
										value="{countryCode}">
										{flag(countryCode)}
										{name(countryCode)}
									</option>
								{/each}
							</select>
						</div>
					</div>
					<div>
						<label
							id="cities-label"
							for="cities"
							data-felte-reporter-tippy-trigger-for="cities"
							class="flex items-center mb-1 text-sm font-medium text-gray-300 cursor-pointer grid-col-2">
							Cities
						</label>
						<div
							data-felte-reporter-tippy-for="cities"
							aria-labelledby="cities-label"
							class="{`pointer-events-auto rounded-md shadow-sm mt-1 sm:text-sm
					${
						$errors.location.cities
							? 'border-red-500 ring-2 ring-red-500 focus:ring-red-500 focus:border-red-500'
							: ''
					}`}">
							<!-- svelte-ignore a11y-no-onchange -->
							<select
								id="cities"
								name="cities"
								bind:this="{citiesSelector}"
								on:change="{() =>
									($data.location.cities = citiesSlimSelector.selected())}"
								multiple
								data-felte-reporter-tippy-ignore
								class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md">
							</select>
						</div>
					</div>
				</div>

				<div></div>

				{#if $data.location.remote && !$data.location.worldwide && $data.location.countries?.length > 1}
					<fieldset
						name="timezone"
						class="relative flex flex-col p-3 pt-6 border border-gray-700 rounded-lg">
						<div
							for="timezone"
							class="absolute inline-flex items-center px-4 text-sm bg-gray-800 border border-gray-700 cursor-pointer focus:outline-none -top-3 left-5 rounded-xl">
							Time Zone
						</div>
						<div class="grid grid-flow-col gap-2">
							<div class="flex rounded-md shadow-sm">
								<div
									class="flex items-center px-3 bg-gray-700 border border-r-0 border-gray-700 pointer-events-none rounded-l-md">
									<span class="text-gray-500 sm:text-sm">
										UTC
									</span>
								</div>
								<input
									id="timezone"
									type="text"
									name="min"
									bind:value="{$data.location.timezone.min}"
									class="{`block w-full bg-gray-800 border-l-0 rounded-r-md shadow-sm sm:text-sm
							${
								$errors.location.timezone.min
									? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
									: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
							}`}"
									placeholder="-0" />
							</div>
							<div class="flex rounded-md shadow-sm">
								<div
									class="flex items-center px-3 pl-3 bg-gray-700 border border-r-0 border-gray-700 pointer-events-none rounded-l-md">
									<span class="text-gray-500 sm:text-sm">
										UTC
									</span>
								</div>
								<input
									type="text"
									name="max"
									bind:value="{$data.location.timezone.max}"
									class="{`block w-full bg-gray-800 border-l-0 rounded-r-md shadow-sm sm:text-sm
							${
								$errors.location.timezone.max
									? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
									: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
							}`}"
									placeholder="+0" />
							</div>
						</div>
					</fieldset>
				{/if}
			</fieldset>

			<div
				class="grid grid-flow-row grid-cols-3 grid-rows-2 gap-x-4 gap-y-6">
				<div class="col-span-3">
					<label
						for="tags"
						id="tags-label"
						data-felte-reporter-tippy-trigger-for="tags"
						class="inline-flex items-center text-sm font-medium text-gray-300 cursor-pointer focus:outline-none"
						use:tippy="{{
							...commonTippyConfig,
							content: `
						<b>Tags (Required)</b>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Tag the job with your Tech Stack.</li>
							<li>Upto 5 tags are allowed.</li>
							<li>Search and use existing Tags.</li>
							<li>Carefully create new Tag.</li>
							<li>Jobs can be searched with Tags.</li>
						</ul>`,
						}}">
						Tags
						<svg
							width="15"
							height="15"
							class="text-[#fc0] ml-1 -mt-0.5">
							<use xlink:href="#information-circle"></use>
						</svg>
					</label>
					<div
						data-felte-reporter-tippy-for="tags"
						aria-labelledby="tags-label"
						class="{`pointer-events-auto rounded-md shadow-sm mt-1 sm:text-sm
				${
					$errors.tags
						? 'border-red-500 ring-2 ring-red-500 focus:ring-red-500 focus:border-red-500'
						: ''
				}`}">
						<!-- svelte-ignore a11y-no-onchange -->
						<select
							id="tags"
							name="tags"
							bind:this="{tagsSelector}"
							on:change="{() =>
								($data.tags = tagsSlimSelector.selected())}"
							multiple
							data-felte-reporter-tippy-ignore
							class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
						</select>
					</div>
				</div>

				<div>
					<label
						for="category"
						id="category-label"
						data-felte-reporter-tippy-trigger-for="category"
						class="inline-flex items-center text-sm font-medium text-gray-300 cursor-pointer focus:outline-none"
						use:tippy="{{
							...commonTippyConfig,
							content: `
						<b>Category (Required)</b>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Broad Category, the Job belongs to.</li>
							<li>Reach out to us, if we don't conver a Category.</li>
							<li>Job will show up in the selected Category.</li>
						</ul>`,
						}}">
						Category
						<svg
							width="15"
							height="15"
							class="text-[#fc0] ml-1 -mt-0.5">
							<use xlink:href="#information-circle"></use>
						</svg>
					</label>
					<div
						aria-labelledby="category-label"
						data-felte-reporter-tippy-for="category"
						class="{`pointer-events-auto rounded-md shadow-sm mt-1 sm:text-sm
				${
					$errors.category
						? 'border-red-500 ring-2 ring-red-500 focus:ring-red-500 focus:border-red-500'
						: ''
				}`}">
						<select
							id="category"
							aria-labelledby="category-label"
							name="category"
							bind:this="{categorySelector}"
							bind:value="{$data.category}"
							data-felte-reporter-tippy-ignore
							class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
							<option data-placeholder="true"></option>
							{#each categories as category}
								<option>{category}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label
						for="type"
						id="type-label"
						data-felte-reporter-tippy-trigger-for="type"
						class="inline-flex items-center text-sm font-medium text-gray-300 truncate cursor-pointer focus:outline-none"
						use:tippy="{{
							...commonTippyConfig,
							content: `
						<b>Job Type (Required)</b>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Depicts the Duration & Severity of the Job.</li>
							<li>It will be color coded.</li>
						</ul>`,
						}}">
						Job Type
						<svg
							width="15"
							height="15"
							class="text-[#fc0] ml-1 -mt-0.5">
							<use xlink:href="#information-circle"></use>
						</svg>
					</label>
					<div
						aria-labelledby="type-label"
						data-felte-reporter-tippy-for="type"
						class="{`pointer-events-auto rounded-md shadow-sm mt-1 sm:text-sm
				${
					$errors.type
						? 'border-red-500 ring-2 ring-red-500 focus:ring-red-500 focus:border-red-500'
						: ''
				}`}">
						<select
							id="type"
							name="type"
							bind:this="{typeSelector}"
							bind:value="{$data.type}"
							data-felte-reporter-tippy-ignore
							class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
							<option data-placeholder="true"></option>
							{#each types as type}
								<option value="{type.value}"
									>{type.text}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label
						for="flair"
						id="flair-label"
						data-felte-reporter-tippy-trigger-for="flair"
						class="inline-flex items-center text-sm font-medium text-gray-300 cursor-pointer focus:outline-none"
						use:tippy="{{
							...commonTippyConfig,
							content: `
						<b>Flair</b>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Add flair to stand out of the other job posts.</li>
							<li>Costs money to add a flair.</li>
						</ul>`,
						}}">
						Flair
						<svg
							width="15"
							height="15"
							class="text-[#fc0] ml-1 -mt-0.5">
							<use xlink:href="#annotation"></use>
						</svg>
						<i class="ml-1 text-gray-400">
							- Optional
						</i>
					</label>
					<div
						data-felte-reporter-tippy-for="flair"
						aria-labelledby="flair-label"
						class="mt-1">
						<select
							id="flair"
							name="flair"
							bind:this="{flairSelector}"
							bind:value="{$data.flair}"
							class="text-sm text-gray-300 bg-gray-800 border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
							<option data-placeholder="true"></option>
							{#each flairs as flair}
								<option value="{flair.value}"
									>{flair.text}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
			<div class="relative" id="parent">
				<label
					for="description"
					class="inline-flex items-center text-sm font-medium text-gray-300 cursor-pointer focus:outline-none"
					use:tippy="{{
						...commonTippyConfig,
						content: `
						<center><b>Description (Required)</b><center>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Describe the responsibilities of the Job.</li>
							<li>Keep it to 1000 letters.</li>
							<li>Use Markdown. See <a class="inline font-bold" target="_blank" rel="noopener" href="https://simplemde.com/markdown-guide">Basic</a> & <a class="inline font-bold" target="_blank" rel="noopener" href="https://www.markdownguide.org/basic-syntax/">Comprehensive</a> guide.</li>
							<li>Click on Markdown Icon to see an Example.</li>
						</ul>`,
						interactive: true,
						appendTo: 'parent',
					}}">
					Description
					<svg
						width="15"
						height="15"
						class="text-[#fc0] ml-1 -mt-0.5">
						<use xlink:href="#information-circle"></use>
					</svg>
				</label>
				<div class="mt-1">
					<textarea
						id="description"
						name="description"
						rows="12"
						spellcheck="true"
						bind:value="{$data.description}"
						class="{`w-full bg-gray-800 rounded-md shadow-sm sm:text-sm text-gray-200
				${
					$errors.description
						? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
						: 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
				}
				${isEditMode ? 'rounded-bl-none block' : 'hidden'}`}"
						placeholder="Describe the Job Eloquently."></textarea>
					<article
						class="{`mdv h-[258px] overflow-auto prose px-3 py-2 min-w-full border bg-gray-800 rounded-md shadow-sm sm:text-sm border-gray-700 focus:ring-indigo-500 focus:border-indigo-500
					${!isEditMode ? 'block' : 'hidden'}`}">
						{@html !isEditMode ? marked($data.description) : ""}
					</article>
				</div>
				<div
					class="flex items-center justify-between text-xs text-gray-500 border-gray-700 rounded-b-md">
					<div class="absolute left-0 flex bottom-[-32px] z-1">
						<button
							on:click|preventDefault="{() => {
								isEditMode = true;
							}}"
							class="{`flex items-center p-2 focus:outline-none rounded-b-md bottom-up-shadow focus:text-gray-300
					${
						isEditMode
							? 'text-gray-300 bg-gray-800 border border-t-0 border-gray-700 shadow-selected'
							: ''
					}`}">
							<svg class="mr-1" width="15" height="15">
								<use xlink:href="#pencil"></use>
							</svg>
							Edit
						</button>
						<button
							on:click|preventDefault="{() => {
								isEditMode = false;
							}}"
							class="{`flex items-center p-2 focus:outline-none rounded-b-md focus:text-gray-300
					${
						!isEditMode
							? 'text-gray-300 bg-gray-800 border border-t-0 border-gray-700 shadow-selected'
							: ''
					}`}">
							<svg class="mr-1" width="15" height="15">
								<use xlink:href="#eye"></use>
							</svg>
							Preview
						</button>
					</div>
					<div class="absolute right-0 flex p-2 bottom-[-32px]">
						<div
							class="{`font-medium flex items-center ${
								$data.description?.match(/\w+/g)?.length > 1000
									? 'text-red-500'
									: 'text-gray-400'
							}`}">
							{$data.description?.match(/\w+/g)?.length || 0} / 1000
						</div>
						<button
							class="ml-2 focus:outline-none markdown-btn"
							on:click|preventDefault="{showExample}"
							use:tippy="{{
								...commonTippyConfig,
								content: `
						<b>Markdown</b>
						<hr class="my-2 -mx-2 border-yellow-500 border-opacity-50" />
						<ul class="text-left hex">
							<li>Click to see a Markdown example.</li>
							<li>It will replace any existing text.</li>
						</ul>`,
							}}">
							<svg class="text-[#fc0]" width="20" height="20">
								<use xlink:href="#markdown"></use>
							</svg>
						</button>
					</div>
				</div>
			</div>
			<div></div>
			<div class="py-3 text-right">
				<button
					on:click|preventDefault="{reset}"
					class="inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
					Reset
				</button>
				<button
					class="inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
					Cancel
				</button>
				<button
					type="submit"
					class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
					Post
				</button>
			</div>
		</form>
	</main>
	<footer>
		<p class="text-white">
			Made with <span class="text-red-500">❤️</span> by
			<a
				target="_blank"
				rel="noopener"
				class="font-semibold text-purple-400"
				href="https://www.derpycoder.com">
				DerpyCoder
			</a>
			for
			<a
				target="_blank"
				rel="noopener"
				class="font-semibold text-yellow-400"
				href="https://www.quillerbee.com">
				QuillerBee
			</a>
			<svg class="inline w-10 h-10 py-2">
				<use xlink:href="#logo"></use>
			</svg>
		</p>
	</footer>
</div>
