import {Component, View} from 'angular2/angular2';

@Component({selector: 'my-component'})
@View({template: 'Field: {{field}}, Method: {{method()}}'})
export class MyComponent {
	field = "fi2el4d";

	method() {
		return "method";
	}
}
