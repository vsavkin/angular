'use strict';"use strict";
var application_tokens_1 = require('./application_tokens');
var application_ref_1 = require('./application_ref');
var change_detection_1 = require('./change_detection/change_detection');
var view_utils_1 = require("./linker/view_utils");
var component_resolver_1 = require('./linker/component_resolver');
var dynamic_component_loader_1 = require('./linker/dynamic_component_loader');
var __unused; // avoid unused import when Type union types are erased
/**
 * A default set of providers which should be included in any Angular
 * application, regardless of the platform it runs onto.
 */
exports.APPLICATION_COMMON_PROVIDERS = 
/*@ts2dart_const*/ [
    application_ref_1.APPLICATION_CORE_PROVIDERS,
    /* @ts2dart_Provider */ { provide: component_resolver_1.ComponentResolver, useClass: component_resolver_1.ReflectorComponentResolver },
    application_tokens_1.APP_ID_RANDOM_PROVIDER,
    view_utils_1.ViewUtils,
    /* @ts2dart_Provider */ { provide: change_detection_1.IterableDiffers, useValue: change_detection_1.defaultIterableDiffers },
    /* @ts2dart_Provider */ { provide: change_detection_1.KeyValueDiffers, useValue: change_detection_1.defaultKeyValueDiffers },
    /* @ts2dart_Provider */ { provide: dynamic_component_loader_1.DynamicComponentLoader, useClass: dynamic_component_loader_1.DynamicComponentLoader_ }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fY29tbW9uX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtcjVQckpLOWgudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2FwcGxpY2F0aW9uX2NvbW1vbl9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLG1DQUFxQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQzVELGdDQUF5QyxtQkFBbUIsQ0FBQyxDQUFBO0FBQzdELGlDQUtPLHFDQUFxQyxDQUFDLENBQUE7QUFDN0MsMkJBQXdCLHFCQUFxQixDQUFDLENBQUE7QUFDOUMsbUNBQTRELDZCQUE2QixDQUFDLENBQUE7QUFDMUYseUNBQThELG1DQUFtQyxDQUFDLENBQUE7QUFFbEcsSUFBSSxRQUFjLENBQUMsQ0FBRSx1REFBdUQ7QUFFNUU7OztHQUdHO0FBQ1Usb0NBQTRCO0FBQ3JDLGtCQUFrQixDQUFBO0lBQ2hCLDRDQUEwQjtJQUMxQix1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQ0FBaUIsRUFBRSxRQUFRLEVBQUUsK0NBQTBCLEVBQUM7SUFDMUYsMkNBQXNCO0lBQ3RCLHNCQUFTO0lBQ1QsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsa0NBQWUsRUFBRSxRQUFRLEVBQUUseUNBQXNCLEVBQUM7SUFDcEYsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsa0NBQWUsRUFBRSxRQUFRLEVBQUUseUNBQXNCLEVBQUM7SUFDcEYsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsaURBQXNCLEVBQUUsUUFBUSxFQUFFLGtEQUF1QixFQUFDO0NBQzdGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0FQUF9JRF9SQU5ET01fUFJPVklERVJ9IGZyb20gJy4vYXBwbGljYXRpb25fdG9rZW5zJztcbmltcG9ydCB7QVBQTElDQVRJT05fQ09SRV9QUk9WSURFUlN9IGZyb20gJy4vYXBwbGljYXRpb25fcmVmJztcbmltcG9ydCB7XG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgZGVmYXVsdEl0ZXJhYmxlRGlmZmVycyxcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBkZWZhdWx0S2V5VmFsdWVEaWZmZXJzXG59IGZyb20gJy4vY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7Vmlld1V0aWxzfSBmcm9tIFwiLi9saW5rZXIvdmlld191dGlsc1wiO1xuaW1wb3J0IHtDb21wb25lbnRSZXNvbHZlciwgUmVmbGVjdG9yQ29tcG9uZW50UmVzb2x2ZXJ9IGZyb20gJy4vbGlua2VyL2NvbXBvbmVudF9yZXNvbHZlcic7XG5pbXBvcnQge0R5bmFtaWNDb21wb25lbnRMb2FkZXIsIER5bmFtaWNDb21wb25lbnRMb2FkZXJffSBmcm9tICcuL2xpbmtlci9keW5hbWljX2NvbXBvbmVudF9sb2FkZXInO1xuXG5sZXQgX191bnVzZWQ6IFR5cGU7ICAvLyBhdm9pZCB1bnVzZWQgaW1wb3J0IHdoZW4gVHlwZSB1bmlvbiB0eXBlcyBhcmUgZXJhc2VkXG5cbi8qKlxuICogQSBkZWZhdWx0IHNldCBvZiBwcm92aWRlcnMgd2hpY2ggc2hvdWxkIGJlIGluY2x1ZGVkIGluIGFueSBBbmd1bGFyXG4gKiBhcHBsaWNhdGlvbiwgcmVnYXJkbGVzcyBvZiB0aGUgcGxhdGZvcm0gaXQgcnVucyBvbnRvLlxuICovXG5leHBvcnQgY29uc3QgQVBQTElDQVRJT05fQ09NTU9OX1BST1ZJREVSUzogQXJyYXk8VHlwZSB8IHtbazogc3RyaW5nXTogYW55fSB8IGFueVtdPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW1xuICAgICAgQVBQTElDQVRJT05fQ09SRV9QUk9WSURFUlMsXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogQ29tcG9uZW50UmVzb2x2ZXIsIHVzZUNsYXNzOiBSZWZsZWN0b3JDb21wb25lbnRSZXNvbHZlcn0sXG4gICAgICBBUFBfSURfUkFORE9NX1BST1ZJREVSLFxuICAgICAgVmlld1V0aWxzLFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IEl0ZXJhYmxlRGlmZmVycywgdXNlVmFsdWU6IGRlZmF1bHRJdGVyYWJsZURpZmZlcnN9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IEtleVZhbHVlRGlmZmVycywgdXNlVmFsdWU6IGRlZmF1bHRLZXlWYWx1ZURpZmZlcnN9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IER5bmFtaWNDb21wb25lbnRMb2FkZXIsIHVzZUNsYXNzOiBEeW5hbWljQ29tcG9uZW50TG9hZGVyX31cbiAgICBdO1xuIl19