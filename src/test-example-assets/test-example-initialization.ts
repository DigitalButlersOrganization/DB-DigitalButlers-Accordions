import { Accordions } from '../index';

const component = document.querySelector('.component');
// eslint-disable-next-line no-unused-vars
const accordions = new Accordions({
	parentElement: component,
	isSingle: true,
	devMode: true,
	isKeyboardTriggerAllowed: true,
	breakpoint: window.matchMedia('(max-width: 991px)'),
	on: {
		detailsTransitionEnd: () => {
			console.log('transitionend');
		},
		afterDestroy: () => {
			console.log('afterDestroy');
		},
	},
});

// eslint-disable-next-line no-console
console.log(accordions);
