import { getRandomId } from './utils';
import { KEYS } from './constants';

import {
	PARAMS_KEY,
	PARAMS,
	AccordionElement,
	AccordionProperties,
	AccordionCallbacks,
	AccordionCallback,
} from './interfaces';
import './style.scss';

const DESTROYED_TYPES = {
	MANUAL: 'manual',
	BREAKPOINT: 'breakpoint',
};

const ATTRIBUTES_PREFIX = 'data-accordion-';
const ATTRIBUTES = {
	IS_SINGLE: `${ATTRIBUTES_PREFIX}is-single`,
};
const DEFAULTS = {
	openClass: 'js--open',
	parentElement: document,
	accordionSelector: '[data-role="accordion"]',
	itemSelector: '[data-role="accordion-item"]',
	summarySelector: '[data-role="accordion-summary"]',
	detailsSelector: '[data-role="accordion-details"]',
	breakpoint: window.matchMedia('screen'),
	isSingle: false,
	devMode: false,
	isKeyboardTriggerAllowed: false,
	on: {},
};

export class Accordions {
	instanceId: string | undefined;
	openClass: string;
	accordionSelector: string;
	itemSelector: string;
	summarySelector: string;
	detailsSelector: string;
	isSingle: boolean;
	isKeyboardTriggerAllowed: boolean;
	breakpoint: MediaQueryList;
	parentElement: HTMLElement | Document;
	elements: AccordionElement[];
	itemElements: AccordionElement[];
	isDestroyed: boolean;
	destroyedBy: string | undefined;
	devMode: boolean;
	on: AccordionCallbacks;

	constructor(customParameters = {}) {
		const parameters = {
			...DEFAULTS,
			...customParameters,
		};

		this.instanceId = undefined;
		this.openClass = parameters.openClass;

		this.accordionSelector = parameters.accordionSelector;
		this.itemSelector = parameters.itemSelector;
		this.summarySelector = parameters.summarySelector;
		this.detailsSelector = parameters.detailsSelector;

		this.isSingle = parameters.isSingle;
		this.isKeyboardTriggerAllowed = parameters.isKeyboardTriggerAllowed;
		this.breakpoint = parameters.breakpoint;

		this.parentElement = parameters.parentElement;
		this.elements = [];
		this.itemElements = [];

		this.isDestroyed = true;
		this.destroyedBy = undefined;
		this.devMode = parameters.devMode;
		this.on = parameters.on;

		this.init();
	}

	// Instance id
	updateInstanceId = () => {
		this.instanceId = Accordions.generateInstanceId();
	};

	static generateInstanceId = (): string => {
		const instanceId = getRandomId();

		return this.isInstanceIdUnique(instanceId) ? instanceId : this.generateInstanceId();
	};

	static isInstanceIdUnique = (instanceId: string): boolean =>
		!document.querySelector(`[id^="accordion-${instanceId}]"`);

	// Elements ids
	generateAccordionId = (accordionId: string | number) => `accordion-${this.instanceId}-${accordionId}`;

	generateItemId = (itemId: string | number) => `accordion-item-${this.instanceId}-${itemId}`;

	generateSummaryId = (itemId: string | number) => `accordion-summary-${this.instanceId}-${itemId}`;

	generateDetailsId = (itemId: string | number) => `accordion-details-${this.instanceId}-${itemId}`;

	getItemById = (itemId: string) =>
		this.itemElements.find((itemElement) => itemElement[PARAMS_KEY]?.[PARAMS.ITEM_ID] === itemId);

	getAccordionById = (accordionId: string) =>
		this.elements.find((accordionElement) => accordionElement[PARAMS_KEY]?.[PARAMS.ACCORDION_ID] === accordionId);

	// Initialisation
	initAccordions = () => {
		if (this.devMode && !this.parentElement) {
			throw new Error('Parent element is not defined | Родительский элемент не определен');
		}

		this.elements = Array.from(this.parentElement.querySelectorAll(this.accordionSelector));

		if (this.elements.length === 0 && this.devMode) {
			throw new Error(
				`Accordions not found. Check the selector ${this.accordionSelector} | Аккордионы не найдены. Проверьте селектор ${this.accordionSelector}`,
			);
		}

		this.elements.forEach((accordionElement, accordionIndex) => {
			this.initAccordion(accordionElement, accordionIndex);
		});
	};

	initAccordion = (accordionElement: AccordionElement, accordionId: number) => {
		if (accordionElement[PARAMS_KEY]) {
			return;
		}
		const parentItemElement = (accordionElement.closest(this.itemSelector) as AccordionElement) ?? undefined;

		if (parentItemElement && !parentItemElement[PARAMS_KEY]) {
			parentItemElement[PARAMS_KEY] = {};
		}
		const parentItemId = parentItemElement && (parentItemElement[PARAMS_KEY] as AccordionProperties)[PARAMS.ITEM_ID];
		const isSingle = accordionElement.hasAttribute(ATTRIBUTES.IS_SINGLE)
			? accordionElement.getAttribute(ATTRIBUTES.IS_SINGLE) === 'true'
			: this.isSingle;

		accordionElement[PARAMS_KEY] = {};
		accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
		accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS] = [];
		accordionElement[PARAMS_KEY][PARAMS.IS_SINGLE] = isSingle;

		accordionElement.id = this.generateAccordionId(accordionId);
		accordionElement.dataset.accordionState = 'initialized';
		accordionElement.dataset.accordionRole = 'parent';

		const accordionChildren = Array.from(accordionElement.children) as AccordionElement[];

		const itemElements = accordionChildren.filter((element) => element.matches(this.itemSelector));

		if (itemElements.length === 0 && this.devMode) {
			throw new Error(
				`Accordion items not found. Check the selector ${this.itemSelector} | Элементы аккордиона не найдены. Проверьте селектор ${this.itemSelector}`,
			);
		}

		itemElements.forEach((itemElement, itemIndex) => {
			const itemId = `${accordionId}-${itemIndex}`;
			if (this.on.detailsTransitionEnd) {
				itemElement.addEventListener('transitionend', () => {
					(this.on.detailsTransitionEnd as AccordionCallback)(this);
				});
			}

			this.initItem({
				itemElement,
				itemId,
				accordionId,
				parentItemId,
			});
			((accordionElement[PARAMS_KEY] as AccordionProperties)[PARAMS.ITEMS_IDS] as string[]).push(itemId);
		});
	};

	initItem = ({
		itemElement,
		itemId,
		accordionId,
		// parentItemId,
	}: {
		itemElement: AccordionElement;
		itemId: string;
		accordionId: number;
		parentItemId?: string;
	}) => {
		if (itemElement[PARAMS_KEY]) {
			return;
		}

		const summaryElement = (itemElement.querySelector(this.summarySelector) as AccordionElement) ?? undefined;

		if (!summaryElement && this.devMode) {
			throw new Error(
				`Accordion summary not found. Check the selector ${this.summarySelector} | Саммари аккордиона не найден. Проверьте селектор ${this.summarySelector}`,
			);
		}
		const detailsElement = (itemElement.querySelector(this.detailsSelector) as AccordionElement) ?? undefined;

		if (!detailsElement && this.devMode) {
			throw new Error(
				`Accordion details not found. Check the selector ${this.detailsSelector} | Контент аккордиона не найден. Проверьте селектор ${this.detailsSelector}`,
			);
		}

		const summaryId = this.generateSummaryId(itemId);
		const detailsId = this.generateDetailsId(itemId);

		itemElement.id = this.generateItemId(itemId);
		itemElement[PARAMS_KEY] = {};
		itemElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
		itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
		itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT] = summaryElement;
		itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT] = detailsElement;
		itemElement.dataset.accordionRole = 'item';

		this.itemElements.push(itemElement);

		summaryElement.dataset.accordionRole = 'summary';
		summaryElement.dataset.test = 'summary';
		summaryElement.setAttribute('tabindex', '0');
		summaryElement.setAttribute('id', summaryId);
		summaryElement.setAttribute('aria-controls', detailsId);
		summaryElement[PARAMS_KEY] = {};
		summaryElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;

		detailsElement.dataset.accordionRole = 'details';
		detailsElement.setAttribute('inert', '');
		detailsElement.setAttribute('id', detailsId);
		detailsElement.setAttribute('aria-labelledby', summaryId);
		detailsElement[PARAMS_KEY] = {};
		detailsElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;

		summaryElement.addEventListener('click', this.onSummaryClick);
		if (this.isKeyboardTriggerAllowed) {
			const allowedKeys = new Set([KEYS.ENTER, KEYS.SPACE]);
			summaryElement.addEventListener('keydown', (event: KeyboardEvent) => {
				if (!allowedKeys.has(event.key)) return;
				event.preventDefault();
				event.stopImmediatePropagation();
				this.onSummaryClick(event);
			});
		}
	};

	// Destroying
	destroyAccordion = (accordion: AccordionElement | string) => {
		const accordionElement = typeof accordion === 'string' ? this.getAccordionById(accordion) : accordion;

		if (!accordionElement || !accordionElement[PARAMS_KEY]) {
			return;
		}

		const accordionItemsElements = this.itemElements.filter((itemElement) => {
			if (!itemElement[PARAMS_KEY] || !accordionElement[PARAMS_KEY]) {
				return false;
			}
			return itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] === accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID];
		});

		accordionItemsElements.forEach((accordionItemElement) => {
			this.destroyItem(accordionItemElement);
		});

		this.elements = this.elements.filter((element) => {
			if (!element[PARAMS_KEY] || !accordionElement[PARAMS_KEY]) {
				return false;
			}
			return element[PARAMS_KEY][PARAMS.ACCORDION_ID] !== accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID];
		});
		delete accordionElement[PARAMS_KEY];
		accordionElement.removeAttribute('id');
		accordionElement.dataset.accordionState = 'destroyed';
	};

	destroyItem = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (!itemElement || !itemElement[PARAMS_KEY]) {
			return;
		}

		const summaryElement = (itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT] as AccordionElement) ?? undefined;
		const detailsElement = (itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT] as AccordionElement) ?? undefined;

		this.itemElements = this.itemElements.filter((itemElement_) => {
			if (!itemElement_[PARAMS_KEY] || !itemElement[PARAMS_KEY]) {
				return false;
			}
			return itemElement_[PARAMS_KEY][PARAMS.ITEM_ID] !== itemElement[PARAMS_KEY][PARAMS.ITEM_ID];
		});
		delete itemElement[PARAMS_KEY];
		itemElement.removeAttribute('id');

		if (summaryElement) {
			if (summaryElement[PARAMS_KEY]) {
				delete summaryElement[PARAMS_KEY];
			}
			summaryElement.removeAttribute('id');
			summaryElement.removeAttribute('aria-controls');
			summaryElement.removeAttribute('aria-expanded');
		}

		delete detailsElement[PARAMS_KEY];
		detailsElement.removeAttribute('id');
		detailsElement.removeAttribute('aria-labelledby');
		detailsElement.removeAttribute('inert');

		summaryElement.removeEventListener('click', this.onSummaryClick);
	};

	// Event handlers
	onSummaryClick = (event: MouseEvent | KeyboardEvent) => {
		if (!this.breakpoint.matches) {
			return;
		}
		const itemId = (event.currentTarget as AccordionElement)[PARAMS_KEY]?.[PARAMS.ITEM_ID];
		if (itemId) {
			this.toggle(itemId);
		}
	};

	onBreakpointChange = () => {
		if (this.breakpoint.matches) {
			if (this.isDestroyed && this.destroyedBy === DESTROYED_TYPES.BREAKPOINT) {
				this.init();
			}
		} else if (!this.isDestroyed) {
			this.destroy(DESTROYED_TYPES.BREAKPOINT);
		}
	};

	// Public methods
	init = () => {
		if (this.on.beforeInit) {
			this.on.beforeInit(this);
		}

		if (this.devMode) {
			console.log(
				'Accordions mode is enabled. Read the Docs https://www.npmjs.com/package/@digital-butlers/accordions',
			);
		}

		this.updateInstanceId();
		this.initAccordions();

		this.isDestroyed = false;
		this.destroyedBy = undefined;

		this.breakpoint.addEventListener('change', this.onBreakpointChange);
		this.onBreakpointChange();

		this.closeAll();

		if (this.on.afterInit) {
			this.on.afterInit(this);
		}
	};

	destroy = (destroyedBy = DESTROYED_TYPES.MANUAL) => {
		if (this.on.beforeDestroy) {
			this.on.beforeDestroy(this);
		}

		this.elements.forEach((accordionElement) => {
			this.destroyAccordion(accordionElement);
		});

		this.isDestroyed = true;
		this.destroyedBy = destroyedBy;

		if (this.on.afterDestroy) {
			this.on.afterDestroy(this);
		}
	};

	open = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (!itemElement || !itemElement[PARAMS_KEY]) {
			return;
		}

		const idClosed = !itemElement ? false : !itemElement.classList.contains(this.openClass);

		if (idClosed) {
			const accordionElement = this.getAccordionById(itemElement[PARAMS_KEY]?.[PARAMS.ACCORDION_ID] ?? '');
			const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT];
			const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT];

			if (accordionElement?.[PARAMS_KEY]?.[PARAMS.IS_SINGLE]) {
				this.closeAccordion(accordionElement);
			}

			itemElement[PARAMS_KEY][PARAMS.IS_OPEN] = true;
			itemElement.classList.add(this.openClass);
			summaryElement?.setAttribute('aria-expanded', 'true');
			detailsElement?.removeAttribute('inert');
			if (this.on.open) {
				this.on.open(this);
			}
			if (this.on.toggle) {
				this.on.toggle(this);
			}
		}
	};

	close = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (itemElement && !itemElement[PARAMS_KEY]) {
			itemElement[PARAMS_KEY] = {};
		}

		const isOpened = itemElement?.classList.contains(this.openClass);

		if (isOpened) {
			const detailsElement = itemElement?.[PARAMS_KEY]?.[PARAMS.DETAILS_ELEMENT];
			const summaryElement = itemElement?.[PARAMS_KEY]?.[PARAMS.SUMMARY_ELEMENT];

			if (!detailsElement) {
				return;
			}

			(itemElement[PARAMS_KEY] as AccordionProperties)[PARAMS.IS_OPEN] = false;
			itemElement.classList.remove(this.openClass);
			summaryElement?.setAttribute('aria-expanded', 'false');
			detailsElement.setAttribute('inert', '');
			if (this.on.close) {
				this.on.close(this);
			}
			if (this.on.toggle) {
				this.on.toggle(this);
			}
		}
	};

	toggle = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (itemElement && !itemElement[PARAMS_KEY]) {
			itemElement[PARAMS_KEY] = {};
		}

		if (!itemElement) {
			return;
		}

		if ((itemElement[PARAMS_KEY] as AccordionProperties)[PARAMS.IS_OPEN]) {
			this.close(itemElement);
		} else {
			this.open(itemElement);
		}
	};

	closeAccordion = (accordion: AccordionElement | string) => {
		const accordionElement = typeof accordion === 'string' ? this.getAccordionById(accordion) : accordion;

		if (!accordionElement) {
			return;
		}

		if (!accordionElement[PARAMS_KEY]) {
			accordionElement[PARAMS_KEY] = {};
		}

		const itemsIds = accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS] ?? [];

		itemsIds.forEach((itemId) => {
			this.close(itemId);
		});
	};

	closeAll = () => {
		this.elements.forEach((accordion) => {
			this.closeAccordion(accordion);
		});
	};
}
