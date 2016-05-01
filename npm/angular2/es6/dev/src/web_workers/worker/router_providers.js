import { NgZone, APP_INITIALIZER } from 'angular2/core';
import { PlatformLocation } from 'angular2/platform/common';
import { WebWorkerPlatformLocation } from './platform_location';
import { ROUTER_PROVIDERS_COMMON } from 'angular2/src/router/router_providers_common';
export var WORKER_APP_ROUTER = [
    ROUTER_PROVIDERS_COMMON,
    /* @ts2dart_Provider */ { provide: PlatformLocation, useClass: WebWorkerPlatformLocation },
    {
        provide: APP_INITIALIZER,
        useFactory: (platformLocation, zone) => () => initRouter(platformLocation, zone),
        multi: true,
        deps: [PlatformLocation, NgZone]
    }
];
function initRouter(platformLocation, zone) {
    return zone.runGuarded(() => { return platformLocation.init(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtZ3RNN1FoRW4udG1wL2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy93b3JrZXIvcm91dGVyX3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUEyQixNQUFNLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZTtPQUN4RSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sMEJBQTBCO09BQ2xELEVBQUMseUJBQXlCLEVBQUMsTUFBTSxxQkFBcUI7T0FDdEQsRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDZDQUE2QztBQUVuRixPQUFPLElBQUksaUJBQWlCLEdBQUc7SUFDN0IsdUJBQXVCO0lBQ3ZCLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBQztJQUN4RjtRQUNFLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLFVBQVUsRUFBRSxDQUFDLGdCQUEyQyxFQUFFLElBQVksS0FBSyxNQUMzRCxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO1FBQ2xELEtBQUssRUFBRSxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDO0tBQ2pDO0NBQ0YsQ0FBQztBQUVGLG9CQUFvQixnQkFBMkMsRUFBRSxJQUFZO0lBQzNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXBwbGljYXRpb25SZWYsIFByb3ZpZGVyLCBOZ1pvbmUsIEFQUF9JTklUSUFMSVpFUn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtTG9jYXRpb259IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbic7XG5pbXBvcnQge1dlYldvcmtlclBsYXRmb3JtTG9jYXRpb259IGZyb20gJy4vcGxhdGZvcm1fbG9jYXRpb24nO1xuaW1wb3J0IHtST1VURVJfUFJPVklERVJTX0NPTU1PTn0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9yb3V0ZXJfcHJvdmlkZXJzX2NvbW1vbic7XG5cbmV4cG9ydCB2YXIgV09SS0VSX0FQUF9ST1VURVIgPSBbXG4gIFJPVVRFUl9QUk9WSURFUlNfQ09NTU9OLFxuICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogUGxhdGZvcm1Mb2NhdGlvbiwgdXNlQ2xhc3M6IFdlYldvcmtlclBsYXRmb3JtTG9jYXRpb259LFxuICB7XG4gICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgIHVzZUZhY3Rvcnk6IChwbGF0Zm9ybUxvY2F0aW9uOiBXZWJXb3JrZXJQbGF0Zm9ybUxvY2F0aW9uLCB6b25lOiBOZ1pvbmUpID0+ICgpID0+XG4gICAgICAgICAgICAgICAgICAgIGluaXRSb3V0ZXIocGxhdGZvcm1Mb2NhdGlvbiwgem9uZSksXG4gICAgbXVsdGk6IHRydWUsXG4gICAgZGVwczogW1BsYXRmb3JtTG9jYXRpb24sIE5nWm9uZV1cbiAgfVxuXTtcblxuZnVuY3Rpb24gaW5pdFJvdXRlcihwbGF0Zm9ybUxvY2F0aW9uOiBXZWJXb3JrZXJQbGF0Zm9ybUxvY2F0aW9uLCB6b25lOiBOZ1pvbmUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIHpvbmUucnVuR3VhcmRlZCgoKSA9PiB7IHJldHVybiBwbGF0Zm9ybUxvY2F0aW9uLmluaXQoKTsgfSk7XG59XG4iXX0=