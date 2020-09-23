import arrayExtensions from './array';
import stringExtensions from './string';
import numberExtensions from './number';
import dateExtensions from './date';

export default function initExtensions() {
	arrayExtensions();
	stringExtensions();
	numberExtensions();
	dateExtensions();
}
