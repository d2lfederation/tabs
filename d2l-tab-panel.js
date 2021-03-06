/**
`d2l-tab-panel`
Polymer-based web components for tab

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-tab-panel">
	<template strip-whitespace="">
		<style>

			:host {
				box-sizing: border-box;
				display: none;
				margin: 1.2rem 0;
			}

			:host([no-padding]) {
				margin: 0;
			}

			:host([selected]) {
				display: block;
			}

		</style>
		<slot></slot>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-tab-panel',

	hostAttributes: {
		'role': 'tabpanel'
	},

	properties: {

		/**
		 * Whether to exclude default padding from the panel.
		 */
		noPadding: {
			type: Boolean,
			reflectToAttribute: true
		},

		/**
		 * Indicates the selected tab.
		 */
		selected: {
			type: Boolean,
			observer: '_handleSelected',
			reflectToAttribute: true
		},

		/**
		 * Text for the tab.
		 */
		text: {
			type: String,
			observer: '_updateText'
		}

	},

	attached: function() {
		if (this.selected) {
			requestAnimationFrame(function() {
				this._dispatchSelected();
			}.bind(this));
		}
	},

	_dispatchSelected: function() {
		this.dispatchEvent(new CustomEvent(
			'd2l-tab-panel-selected', { bubbles: true, composed: true }
		));
	},

	_handleSelected: function(newValue) {
		if (newValue) {
			this._dispatchSelected();
		}
	},

	_updateText: function() {
		this.setAttribute('aria-label', this.text);
		this.dispatchEvent(new CustomEvent(
			'd2l-tab-panel-text-changed', { bubbles: true, composed: true, detail: { text: this.text } }
		));
	}

});
