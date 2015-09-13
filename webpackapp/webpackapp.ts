import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
	selector: 'my-component'
})
@View({template: 'Field: {{field}}'})
class MyComponent {
	field = "secret2";
}

bootstrap(MyComponent);