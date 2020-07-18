/**
 * Respresents a request response with success value and error array on failure or
 * response data on success
 * @property success (boolean) whether the object was a successfully request or not
 * @property obj (any) the value of the response (could be a list of errors if failure)
 */
export default class ResponseObject {
	constructor(success, obj) {
		this.success = success;

		if (this.success) {
			this.obj = obj;
		} else if (Array.isArray(obj)) {
			this.errors = obj;
		} else {
			this.errors = [ obj ];
		}
	}
}
