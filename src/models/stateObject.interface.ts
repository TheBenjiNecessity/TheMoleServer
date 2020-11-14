export default abstract class StateObject {
	constructor(protected _state: string) {}

	abstract moveNext(): void;
}
