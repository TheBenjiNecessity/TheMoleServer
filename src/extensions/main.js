import arrayExtensions from './array';
import stringExtensions from './string';
import numberExtensions from './number';

export default function initExtensions() {
	arrayExtensions();
	stringExtensions();
	numberExtensions();
}
