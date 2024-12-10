import { Accordions } from '../index';

const component = document.querySelector('.component');
// eslint-disable-next-line no-unused-vars
const accordions = new Accordions({
	parentElement: component,
	isSingle: true,
});

// eslint-disable-next-line no-console
console.log(accordions);
