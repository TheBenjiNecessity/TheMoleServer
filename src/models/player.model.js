export default class Player {
	constructor(name) {
		this.name = name;
		this.objects = {
			exemption: 0,
			joker: 0,
			'black-exemption': 0
		};
	}

	setObjects(object, quantity = 1) {
		this.objects[object] += quantity;
	}

	removeObjects(object, quantity = 1) {
		this.objects[object] -= quantity;

		if (this.objects[object] < 0) {
			this.objects[object] = 0;
		}
	}
}
