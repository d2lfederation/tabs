import '@polymer/polymer/polymer-legacy.js';
import 'd2l-button/d2l-button-subtle.js';
import '../d2l-tabs.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-demo-templated-tabs">
	<template strip-whitespace="">
		<style>
			d2l-tabs {
				--d2l-tab-first-child-margin: 1.8rem;
			}
		</style>
		<d2l-tabs>
			<template items="{{tabs}}" is="dom-repeat">
				<d2l-tab-panel text="{{item.text}}">{{item.content}} <a href="http://www.google.com">Google</a></d2l-tab-panel>
			</template>
			<d2l-button-subtle text="Change title" on-click="changeText"></d2l-button-subtle>
		</d2l-tabs>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-demo-templated-tabs',
	ready: function() {
		this.tabs = [
			{text: 'Winter 17', content: 'Content for winter 2017'},
			{text: 'Summer 18', content: 'Content for summer 2018'},
			{text: 'Fall 18', content: 'Content for fall 2018'},
			{text: 'All', content: 'Content for all'}
		];
	},
	changeText: function() {
		this.set(`tabs.${Math.floor(Math.random() * 4)}.text`, 'Tab Name Changed');
	}
});
