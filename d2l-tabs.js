/**
`d2l-tabs`
Polymer-based web components for tabs

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-colors/d2l-colors.js';
import 'fastdom/fastdom.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-polymer-behaviors/d2l-id.js';
import 'd2l-polymer-behaviors/d2l-dom.js';
import 'd2l-polymer-behaviors/d2l-dom-focus.js';
import 'd2l-polymer-behaviors/d2l-focusable-arrowkeys-behavior.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import './d2l-tab.js';
import './d2l-tab-panel.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-tabs">
	<template strip-whitespace="">
		<style>

			:host {
				--d2l-tabs-background-color: white;
				box-sizing: border-box;
				display: block;
			}

			.d2l-tabs-layout {
				border-bottom: 1px solid var(--d2l-color-gypsum);
				display: flex;
				width: 100%;
				@apply --d2l-body-compact-text;
			}

			.d2l-tabs-container {
				box-sizing: border-box;
				flex: auto;
				overflow: hidden;
				overflow-x: hidden;
				margin-left: -3px;
				padding-left: 3px;
				position: relative;
				white-space: nowrap;
				-webkit-transition: max-width 200ms ease-in;
				transition: max-width 200ms ease-in;
			}

			.d2l-tabs-container-ext {
				flex: none;
			}

			.d2l-tabs-container-list {
				display: block;
				white-space: nowrap;
				-webkit-transition: transform 200ms ease-out;
				transition: transform 200ms ease-out;
			}

			.d2l-tabs-focus-start,
			.d2l-tabs-focus-end {
					position: absolute;
					left: 0;
			}

			.d2l-tabs-scroll-previous-container,
			.d2l-tabs-scroll-next-container {
				background-color: var(--d2l-tabs-background-color);
				box-shadow: 0 0 12px 18px var(--d2l-tabs-background-color);
				display: none;
				height: 100%;
				position: absolute;
				top: 0;
				z-index: 1;
			}

			.d2l-tabs-scroll-previous-container {
				left: 0;
				margin-left: 4px;
			}

			:host(:dir(rtl)) .d2l-tabs-scroll-previous-container {
				left: auto;
				margin-left: 0;
				margin-right: 4px;
				right: 0;
			}

			.d2l-tabs-container[allow-scroll-previous] > .d2l-tabs-scroll-previous-container {
				display: inline-block;
			}

			.d2l-tabs-scroll-next-container {
				margin-right: 4px;
				right: 0;
			}

			:host(:dir(rtl)) .d2l-tabs-scroll-next-container {
				left: 0;
				margin-left: 4px;
				margin-right: 0;
				right: auto;
			}

			.d2l-tabs-container[allow-scroll-next] > .d2l-tabs-scroll-next-container {
				display: inline-block;
			}

			.d2l-tabs-scroll-button {
				background-color: transparent;
				border: 1px solid transparent;
				border-radius: 15px;
				box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
				box-sizing: border-box;
				cursor: pointer;
				display: inline-block;
				height: 30px;
				margin: 0;
				outline: none;
				padding: 0;
				transform: translateY(10px);
				-webkit-transition: box-shadow 0.2s;
				transition: box-shadow 0.2s;
				width: 30px;
			}

			.d2l-tabs-scroll-button[disabled] {
				cursor: default;
				opacity: 0.5;
			}

			.d2l-tabs-scroll-button::-moz-focus-inner {
				border: 0;
			}

			.d2l-tabs-scroll-button[disabled]:hover,
			.d2l-tabs-scroll-button[disabled]:focus {
				background-color: transparent;
			}

			.d2l-tabs-scroll-button:hover,
			.d2l-tabs-scroll-button:focus {
				background-color: var(--d2l-color-gypsum);
			}

			.d2l-tabs-scroll-button:focus {
				border-color: rgba(0, 111, 191, 0.4);
				box-shadow: 0 0 0 4px rgba(0, 111, 191, 0.3);
			}

			.d2l-tabs-container-ext {
				padding-left: 4px;
			}

			:host(:dir(rtl)) .d2l-tabs-container-ext {
				padding-left: 0;
				padding-right: 4px;
			}

		</style>
		<div class="d2l-tabs-layout">
			<div class="d2l-tabs-container">
				<div class="d2l-tabs-scroll-previous-container">
					<button class="d2l-tabs-scroll-button" title="[[localize('scroll.previous')]]"><d2l-icon icon="d2l-tier1:chevron-left"></d2l-icon></button>
				</div>
				<span class="d2l-tabs-focus-start" tabindex="0"></span>
				<div class="d2l-tabs-container-list"></div>
				<span class="d2l-tabs-focus-end" tabindex="0"></span>
				<div class="d2l-tabs-scroll-next-container">
					<button class="d2l-tabs-scroll-button" title="[[localize('scroll.next')]]"><d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon></button>
				</div>
			</div>
			<div class="d2l-tabs-container-ext"><slot name="ext"></slot></div>
		</div>
		<div>
			<slot></slot>
		</div>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-tabs',

	hostAttributes: {
		'role': 'tablist'
	},

	properties: {

		/**
		 * Maximum number of tabs to show before overflowing.
		 */
		maxToShow: {
			type: Number,
			reflectToAttribute: true
		},

		/**
		 * Indicates that tabs are automatically activated on focus.
		 */
		autoSelect: {
			type: Boolean
		},

		_translationValue: {
			type: Number,
			value: 0
		}

	},

	_SCROLL_BUTTON_WIDTH: 56,

	listeners: {
		'd2l-tab-selected': '_handleTabSelected',
		'd2l-tab-panel-selected': '_handleTabPanelSelected'
	},

	behaviors: [
		D2L.PolymerBehaviors.FocusableArrowKeysBehavior,
		D2L.PolymerBehaviors.Tabs.LocalizeBehavior
	],

	ready: function() {
		this._handleDomChanges = this._handleDomChanges.bind(this);
		this._handleTabFocus = this._handleTabFocus.bind(this);
		this._handleFocusTrapStart = this._handleFocusTrapStart.bind(this);
		this._handleFocusTrapEnd = this._handleFocusTrapEnd.bind(this);
		this._handleResize = this._handleResize.bind(this);
		this._handleScrollPrevious = this._handleScrollPrevious.bind(this);
		this._handleScrollNext = this._handleScrollNext.bind(this);
		this._handleTabTextUpdate = this._handleTabTextUpdate.bind(this);
	},

	_handleOnBeforeFocus: function(tab) {
		var tabsContainer = this._getTabsContainer();
		if (!tabsContainer.hasAttribute('scroll-collapsed')) {

			return this._updateScrollPosition(tab);

		} else {

			return this._getMeasures().then(function(measures) {

				var newTranslationValue = this._calculateScrollPosition(tab, measures);
				if (!measures.isRTL) {
					if (newTranslationValue >= 0) return;
				} else {
					if (newTranslationValue <= 0) return;
				}

				return this._tryExpandTabsContainer(measures).then(function(expanded) {
					if (expanded) {
						return;
					} else {
						return this._updateScrollPosition(tab);
					}
				}.bind(this));

			}.bind(this));

		}
	},

	attached: function() {
		afterNextRender(this, function() {

			var bgColor = this._getComputedBackgroundColor();
			if (bgColor && bgColor !== 'rgb(255, 255, 255)' && bgColor !== 'rgba(255, 255, 255, 1)') {
				this.updateStyles({'--d2l-tabs-background-color': bgColor});
			}

			var tabsList = this._getTabsContainerList();

			this._slotObserver = dom(this).observeNodes(this._handleDomChanges);
			this.addEventListener('d2l-tab-panel-text-changed', this._handleTabTextUpdate);

			this.arrowKeyFocusablesContainer = tabsList;
			this.arrowKeyFocusablesOnBeforeFocus = this._handleOnBeforeFocus;
			this.arrowKeyFocusablesProvider = function() {
				return this._getFocusableTabs(this._tabs);
			}.bind(this);

			tabsList.addEventListener('focus', this._handleTabFocus, true);
			dom(this.root).querySelector('.d2l-tabs-focus-start').addEventListener('focus', this._handleFocusTrapStart);
			dom(this.root).querySelector('.d2l-tabs-focus-end').addEventListener('focus', this._handleFocusTrapEnd);
			dom(this.root).querySelector('.d2l-tabs-scroll-next-container button').addEventListener('click', this._handleScrollNext);
			dom(this.root).querySelector('.d2l-tabs-scroll-previous-container button').addEventListener('click', this._handleScrollPrevious);

			this._resizeObserver = new ResizeObserver(this._handleResize);
			this._resizeObserver.observe(tabsList);

		}.bind(this));
	},

	detached: function() {
		var tabsList = this._getTabsContainerList();
		tabsList.removeEventListener('focus', this._handleTabFocus, true);

		dom(this.root).querySelector('.d2l-tabs-focus-start').removeEventListener('focus', this._handleFocusTrapStart);
		dom(this.root).querySelector('.d2l-tabs-focus-end').removeEventListener('focus', this._handleFocusTrapEnd);
		dom(this.root).querySelector('.d2l-tabs-scroll-next-container button').removeEventListener('click', this._handleScrollNext);
		dom(this.root).querySelector('.d2l-tabs-scroll-previous-container button').removeEventListener('click', this._handleScrollPrevious);

		if (this._slotObserver) {
			dom(this).unobserveNodes(this._slotObserver);
		}

		this.removeEventListener('d2l-tab-panel-text-changed', this._handleTabTextUpdate);

		if (this._resizeObserver) this._resizeObserver.unobserve(tabsList);
	},

	resize: function() {
		return this._handleResize();
	},

	_calculateScrollPosition: function(selectedTab, measures) {

		var selectedTabIndex = this._tabs.indexOf(selectedTab);
		var selectedTabMeasures = measures.tabRects[selectedTabIndex];

		var isOverflowingLeft = (selectedTabMeasures.offsetLeft + this._translationValue < 0);
		var isOverflowingRight = (selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + this._translationValue > measures.tabsContainerRect.width);

		var getNewTranslationValue;
		if (!measures.isRTL) {
			getNewTranslationValue = function() {
				if (selectedTabIndex === 0) {
					// position selected tab at beginning
					return 0;
				} else if (selectedTabIndex === (this._tabs.length - 1)) {
					// position selected tab at end
					return -1 * (selectedTabMeasures.offsetLeft - measures.tabsContainerRect.width + selectedTabMeasures.rect.width);
				} else {
					// position selected tab in middle
					return -1 * (selectedTabMeasures.offsetLeft - (measures.tabsContainerRect.width / 2) + (selectedTabMeasures.rect.width / 2));
				}
			}.bind(this);
		} else {
			getNewTranslationValue = function() {
				if (selectedTabIndex === 0) {
					// position selected tab at beginning
					return 0;
				} else if (selectedTabIndex === (this._tabs.length - 1)) {
					// position selected tab at end
					return -1 * selectedTabMeasures.offsetLeft;
				} else {
					// position selected tab in middle
					return (measures.tabsContainerRect.width / 2) - (selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width / 2) + (selectedTabMeasures.rect.width / 2);
				}
			}.bind(this);
		}

		var newTranslationValue = this._translationValue;
		if (isOverflowingLeft || isOverflowingRight) {
			newTranslationValue = getNewTranslationValue();
		}

		var expectedPosition;

		// make sure the new position will not place selected tab behind left scroll button
		if (!measures.isRTL) {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if (newTranslationValue < 0 && this._isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if (newTranslationValue > 0 && this._isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		if (!measures.isRTL) {
			// make sure there will not be any empty space between left side of container and first tab
			if (newTranslationValue > 0) newTranslationValue = 0;
		} else {
			// make sure there will not be any empty space between right side of container and first tab
			if (newTranslationValue < 0) newTranslationValue = 0;
		}

		// make sure the new position will not place selected tab behind the right scroll button
		if (!measures.isRTL) {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if ((selectedTabIndex < this._tabs.length - 1) && this._isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if ((selectedTabIndex < this._tabs.length - 1) && this._isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		return newTranslationValue;

	},

	_focusSelected: function() {
		var selectedTab = dom(this.root).querySelector('d2l-tab[aria-selected="true"]');
		if (selectedTab) {
			this._updateScrollPosition(selectedTab).then(function() {
				fastdom.mutate(function() {
					selectedTab.focus();
				});
			});
		}
	},

	/* can be moved to PolymerBehaviors, keeping here for now since this is first time ever needed */
	_getComputedBackgroundColor: function() {
		var bgColor = null;
		D2L.Dom.findComposedAncestor(this, function(node) {
			if (!node || node.nodeType !== 1) return false;
			var nodeColor = getComputedStyle(node, null)['backgroundColor'];
			if (nodeColor === 'rgba(0, 0, 0, 0)' || nodeColor === 'transparent') return false;
			bgColor = nodeColor;
			return true;
		});
		return bgColor;
	},

	_getFocusableTabs: function(tabs) {
		if (!tabs || tabs.length === 0) {
			return Promise.resolve([]);
		}
		return new Promise(function(resolve) {
			fastdom.measure(function() {
				var focusableTabs = [];
				for (var i = 0; i < tabs.length; i++) {
					if (window.getComputedStyle(tabs[i], null).getPropertyValue('display') !== 'none') {
						focusableTabs.push(tabs[i]);
					}
				}
				resolve(focusableTabs);
			});
		});
	},

	_getMeasures: function() {
		var isRTL, totalTabsWidth = 0;
		return Promise.all([
			this._measures ? Promise.resolve(this._measures) : this._updateMeasures(),
			new Promise(function(resolve) {

				fastdom.mutate(function() {
					fastdom.measure(function() {
						isRTL = (getComputedStyle(this).direction === 'rtl');
						var tabsMeasures = [];
						for (var i = 0; i < this._tabs.length; i++) {
							var tabMeasures = this._tabs[i]._getMeasures();
							tabsMeasures.push(tabMeasures);
							totalTabsWidth += tabsMeasures[i].rect.width;
						}
						resolve(tabsMeasures);
					}.bind(this));
				}.bind(this));

			}.bind(this))
		]).then(function(all) {
			return {
				isRTL: isRTL,
				tabsContainerRect: all[0].rect,
				tabsContainerListRect: all[0].listRect,
				tabRects: all[1],
				totalTabsWidth: totalTabsWidth
			};
		});
	},

	_getTabsContainer: function() {
		return dom(this.root).querySelector('.d2l-tabs-container');
	},

	_getTabsContainerList: function() {
		return dom(this.root).querySelector('.d2l-tabs-container-list');
	},

	_handleDomChanges: function(info) {

		var panels = this.getEffectiveChildren();

		fastdom.mutate(function() {

			for (var i = 0; i < info.removedNodes.length; i++) {
				var removedNode = info.removedNodes[i];
				if (removedNode.tagName === 'D2L-TAB-PANEL' && removedNode.id.length > 0) {
					var tabToRemove = dom(this.root).querySelector('[aria-controls="' + removedNode.id + '"]');
					tabToRemove.parentNode.removeChild(tabToRemove);
				}
			}

			var tabsList = this._getTabsContainerList();
			var selectedTab;

			for (var j = 0; j < info.addedNodes.length; j++) {
				if (info.addedNodes[j].tagName === 'D2L-TAB-PANEL') {

					var panel = info.addedNodes[j];
					if (panel.id.length === 0) {
						panel.id = D2L.Id.getUniqueId();
					}

					var panelIndex = panels.indexOf(panel);

					var tab = document.createElement('d2l-tab');
					tab.setAttribute('aria-controls', panel.id);
					tab.selected = panel.selected;
					tab.text = panel.text;
					if (tab.selected) selectedTab = tab;

					if (panelIndex >= tabsList.children.length) {
						tabsList.appendChild(tab);
					} else {
						tabsList.insertBefore(tab, tabsList.children[panelIndex]);
					}

				}
			}

			this._tabs = Array.prototype.slice.call(tabsList.querySelectorAll('[tabindex]'));

			this._initializeSelectedTab(selectedTab).then(function() {
				this.dispatchEvent(new CustomEvent(
					'd2l-tabs-initialized', { bubbles: true, composed: true }
				));
			}.bind(this));

		}.bind(this));

	},

	_handleFocusTrapEnd: function(e) {
		if (e.relatedTarget && e.relatedTarget.tagName !== 'D2L-TAB') {
			this._focusSelected();
		} else {
			var nextFocusable = D2L.Dom.Focus.getNextFocusable(e.target, false);
			if (nextFocusable) fastdom.mutate(function() { nextFocusable.focus(); });
		}
	},

	_handleFocusTrapStart: function(e) {
		if (e.relatedTarget && e.relatedTarget.tagName === 'D2L-TAB') {
			var previousFocusable = D2L.Dom.Focus.getPreviousFocusable(e.target, false);
			if (previousFocusable) fastdom.mutate(function() { previousFocusable.focus(); });
		} else {
			this._focusSelected();
		}
	},

	_handleResize: function() {
		return this._updateMeasures().then(function() {
			return this._getMeasures();
		}.bind(this)).then(function(measures) {
			return this._updateScrollVisibility(measures);
		}.bind(this));
	},

	_handleScrollPrevious: function() {
		this._getMeasures().then(function(measures) {

			this._tryExpandTabsContainer(measures).then(function(expanded) {

				if (expanded) {
					return this._getMeasures();
				} else {
					return Promise.resolve(measures);
				}

			}.bind(this)).then(function(newMeasures) {

				var newTranslationValue;
				var isOverflowingPrevious;

				if (!newMeasures.isRTL) {

					newTranslationValue = (this._translationValue + measures.tabsContainerRect.width - this._SCROLL_BUTTON_WIDTH);
					isOverflowingPrevious = (newTranslationValue < 0);
					if (!isOverflowingPrevious) {
						newTranslationValue = 0;
					}

				} else {

					newTranslationValue = (this._translationValue - measures.tabsContainerRect.width + this._SCROLL_BUTTON_WIDTH);
					isOverflowingPrevious = (newTranslationValue > 0);
					if (!isOverflowingPrevious) {
						newTranslationValue = 0;
					}

				}

				var positionPromise = this._scrollToPosition(newTranslationValue).then(function() {
					return this._updateScrollVisibility(newMeasures);
				}.bind(this));

				if (!isOverflowingPrevious) {
					positionPromise.then(function() {
						fastdom.mutate(function() {
							dom(this.root).querySelector('.d2l-tabs-scroll-next-container button').focus();
						}.bind(this));
					}.bind(this));
				}

			}.bind(this));

		}.bind(this));
	},

	_handleScrollNext: function() {
		this._getMeasures().then(function(measures) {

			this._tryExpandTabsContainer(measures).then(function(expanded) {

				if (expanded) {
					return this._getMeasures();
				} else {
					return Promise.resolve(measures);
				}

			}.bind(this)).then(function(newMeasures) {

				var newTranslationValue;
				var lastTabMeasures = measures.tabRects[measures.tabRects.length - 1];
				var isOverflowingNext;

				if (!newMeasures.isRTL) {

					newTranslationValue = (this._translationValue - measures.tabsContainerRect.width + this._SCROLL_BUTTON_WIDTH);
					if (newTranslationValue < 0) newTranslationValue += this._SCROLL_BUTTON_WIDTH;

					isOverflowingNext = (lastTabMeasures.offsetLeft + lastTabMeasures.rect.width + newTranslationValue >= newMeasures.tabsContainerRect.width);
					if (!isOverflowingNext) {
						newTranslationValue = -1 * (lastTabMeasures.offsetLeft - newMeasures.tabsContainerRect.width + lastTabMeasures.rect.width);
						if (newTranslationValue > 0) {
							newTranslationValue = 0;
						}
					}

				} else {

					newTranslationValue = (this._translationValue + measures.tabsContainerRect.width - this._SCROLL_BUTTON_WIDTH);
					if (newTranslationValue > 0) newTranslationValue -= this._SCROLL_BUTTON_WIDTH;

					isOverflowingNext = (lastTabMeasures.offsetLeft + newTranslationValue < 0);
					if (!isOverflowingNext) {
						newTranslationValue = -1 * lastTabMeasures.offsetLeft;
						if (newTranslationValue < 0) {
							newTranslationValue = 0;
						}
					}

				}

				var positionPromise = this._scrollToPosition(newTranslationValue).then(function() {
					return this._updateScrollVisibility(newMeasures);
				}.bind(this));

				if (!isOverflowingNext) {
					positionPromise.then(function() {
						fastdom.mutate(function() {
							dom(this.root).querySelector('.d2l-tabs-scroll-previous-container button').focus();
						}.bind(this));
					}.bind(this));
				}

			}.bind(this));

		}.bind(this));
	},

	_handleTabFocus: function(e) {
		if (e.target.tagName !== 'D2L-TAB') {
			return;
		}
		if (this.autoSelect && !e.target.selected) {
			e.target.selected = true;
		}
	},

	_handleTabPanelSelected: function(e) {
		var panel = dom(e).rootTarget;
		var tab = dom(this.root).querySelector('[aria-controls="' + panel.id + '"]');
		if (tab) {
			tab.selected = true;
		}
	},

	_handleTabSelected: function(e) {

		e.stopPropagation();

		var selectedTab = dom(e).rootTarget;
		var selectedPanel = this.querySelector('#' + selectedTab.getAttribute('aria-controls'));

		this._updateScrollPosition(selectedTab);

		fastdom.mutate(function() {
			selectedPanel.selected = true;
			for (var i = 0; i < this._tabs.length; i++) {
				var tab = this._tabs[i];
				if (tab.selected && tab !== selectedTab) {
					tab.selected = false;
					this.querySelector('#' + tab.getAttribute('aria-controls')).selected = false;
				}
			}
		}.bind(this));

	},

	_handleTabTextUpdate: function(e) {
		var panel = dom(e).rootTarget;
		var tab = dom(this.root).querySelector(`[aria-controls='${panel.id}']`);

		fastdom.mutate(function() {
			tab.text = e.detail.text;
		}.bind(this));
	},

	_initializeSelectedTab: function(selectedTab) {

		if (this._initialized || this._tabs.length === 0) {
			return Promise.resolve();
		}

		this._initialized = true;

		if (!selectedTab) {
			this._tabs[0].selected = true;
			selectedTab = this._tabs[0];
		}

		return this._updateTabsContainerWidth(selectedTab).then(function() {
			return this._updateScrollPosition(selectedTab);
		}.bind(this));

	},

	_isPositionInLeftScrollArea: function(position) {
		return position > 0 && position < this._SCROLL_BUTTON_WIDTH;
	},

	_isPositionInRightScrollArea: function(position, measures) {
		return (position > measures.tabsContainerRect.width - this._SCROLL_BUTTON_WIDTH) && (position < measures.tabsContainerRect.width);
	},

	_scrollToPosition: function(translationValue) {
		return new Promise(function(resolve) {
			if (translationValue !== this._translationValue) {
				this._translationValue = translationValue;
				fastdom.mutate(function() {
					var tabList = this._getTabsContainerList();
					var handleTransitionEnd = function(e) {
						if (e.propertyName !== 'transform') {
							return;
						}
						tabList.removeEventListener('transitionend', handleTransitionEnd);
						resolve();
					};
					tabList.addEventListener('transitionend', handleTransitionEnd);
					tabList.style.transform = 'translateX(' + this._translationValue + 'px)';
				}.bind(this));
			} else {
				resolve();
			}
		}.bind(this));
	},

	_tryExpandTabsContainer: function(measures) {

		var tabsContainer = this._getTabsContainer();
		if (!tabsContainer.hasAttribute('scroll-collapsed')) {
			return Promise.resolve(false);
		}

		return new Promise(function(resolve) {

			this.maxToShow = null;

			fastdom.mutate(function() {

				var handleTransitionEnd = function(e) {
					if (e.propertyName !== 'max-width') {
						return;
					}
					tabsContainer.removeEventListener('transitionend', handleTransitionEnd);
					this._measures = null;
					this._getMeasures().then(function(m) {
						this._updateScrollVisibility(m).then(function() {
							fastdom.mutate(function() {
								tabsContainer.style.maxWidth = null;
							});
							if (!tabsContainer.hasAttribute('allow-scroll-next')) {
								if (!tabsContainer.hasAttribute('allow-scroll-previous')) {
									this._focusSelected();
								} else {
									dom(this.root).querySelector('.d2l-tabs-scroll-previous-container button').focus();
								}
							}
							resolve(true);
						}.bind(this));
					}.bind(this));
				}.bind(this);

				tabsContainer.removeAttribute('scroll-collapsed');
				tabsContainer.addEventListener('transitionend', handleTransitionEnd);
				tabsContainer.style.maxWidth = (measures.totalTabsWidth + 50) + 'px';

			}.bind(this));

		}.bind(this));
	},

	_updateMeasures: function() {
		return new Promise(function(resolve) {
			fastdom.measure(function() {
				this._measures = {
					rect: this._getTabsContainer().getBoundingClientRect(),
					listRect: this._getTabsContainerList().getBoundingClientRect()
				};
				resolve(this._measures);
			}.bind(this));
		}.bind(this));
	},

	_updateScrollPosition: function(selectedTab) {
		return this._getMeasures().then(function(measures) {

			var newTranslationValue = this._calculateScrollPosition(selectedTab, measures);
			var transitionPromise = this._scrollToPosition(newTranslationValue);
			var scrollVisibilityPromise = this._updateScrollVisibility(measures);

			return Promise.all([
				scrollVisibilityPromise,
				transitionPromise
			]);

		}.bind(this));
	},

	_updateScrollVisibility: function(measures) {
		return new Promise(function(resolve) {
			fastdom.mutate(function() {

				var tabsContainer = this._getTabsContainer();

				var lastTabMeasures = measures.tabRects[measures.tabRects.length - 1];
				if (!lastTabMeasures) {
					resolve();
					return;
				}

				if (!measures.isRTL) {

					// show/hide previous/left scroll button
					if (this._translationValue < 0 && !tabsContainer.hasAttribute('allow-scroll-previous')) {
						tabsContainer.setAttribute('allow-scroll-previous', 'allow-scroll-previous');
					} else if (this._translationValue >= 0 && tabsContainer.hasAttribute('allow-scroll-previous')) {
						tabsContainer.removeAttribute('allow-scroll-previous');
					}

					// show/hide next/right scroll button
					if (lastTabMeasures.offsetLeft + lastTabMeasures.rect.width + this._translationValue > measures.tabsContainerRect.width) {
						tabsContainer.setAttribute('allow-scroll-next', 'allow-scroll-next');
					} else {
						tabsContainer.removeAttribute('allow-scroll-next');
					}

				} else {

					// show/hide previous/left scroll button (rtl)
					if (this._translationValue > 0 && !tabsContainer.hasAttribute('allow-scroll-previous')) {
						tabsContainer.setAttribute('allow-scroll-previous', 'allow-scroll-previous');
					} else if (this._translationValue <= 0 && tabsContainer.hasAttribute('allow-scroll-previous')) {
						tabsContainer.removeAttribute('allow-scroll-previous');
					}

					// show/hide next/right scroll button (rtl)
					if (lastTabMeasures.offsetLeft + this._translationValue < 0) {
						tabsContainer.setAttribute('allow-scroll-next', 'allow-scroll-next');
					} else {
						tabsContainer.removeAttribute('allow-scroll-next');
					}

				}

				resolve();

			}.bind(this));
		}.bind(this));
	},

	_updateTabsContainerWidth: function(selectedTab) {

		if (!this.maxToShow || this.maxToShow <= 0 || this.maxToShow >= this._tabs.length) {
			return Promise.resolve();
		}

		return this._getMeasures().then(function(measures) {
			return new Promise(function(resolve) {

				var selectedTabIndex = this._tabs.indexOf(selectedTab);
				if (selectedTabIndex > this.maxToShow - 1) {
					resolve();
					return;
				}

				var maxWidth = 4; // initial value to allow for padding hack
				for (var i = 0; i < this.maxToShow; i++) {
					maxWidth += measures.tabRects[i].rect.width;
				}

				if (measures.tabsContainerListRect.width > maxWidth) {
					maxWidth += this._SCROLL_BUTTON_WIDTH;
				}

				if (maxWidth >= measures.tabsContainerRect.width) {
					resolve();
					return;
				}

				fastdom.mutate(function() {
					var tabsContainer = this._getTabsContainer();
					tabsContainer.style.maxWidth = maxWidth + 'px';
					tabsContainer.setAttribute('scroll-collapsed', 'scroll-collapsed');
					this._measures = null;
					resolve();
				}.bind(this));

			}.bind(this));
		}.bind(this));

	}

});
