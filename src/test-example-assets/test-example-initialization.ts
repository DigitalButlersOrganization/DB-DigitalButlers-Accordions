import { Accordions } from '../index';

const component = document.querySelector('.component');
// eslint-disable-next-line no-unused-vars
const accordions = new Accordions({
	parentElement: component,
	isSingle: true,
	devMode: true,
	isKeyboardTriggerAllowed: true,
	on: {
		detailsTransitionEnd: () => {
			console.log('transitionend');
		},
	},
});

// eslint-disable-next-line no-console
console.log(accordions);
