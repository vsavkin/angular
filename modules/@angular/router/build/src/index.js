"use strict";
var router_1 = require('./router');
exports.Router = router_1.Router;
var url_serializer_1 = require('./url_serializer');
exports.UrlSerializer = url_serializer_1.UrlSerializer;
exports.DefaultUrlSerializer = url_serializer_1.DefaultUrlSerializer;
var router_state_1 = require('./router_state');
exports.RouterState = router_state_1.RouterState;
exports.ActivatedRoute = router_state_1.ActivatedRoute;
var url_tree_1 = require('./url_tree');
exports.UrlTree = url_tree_1.UrlTree;
exports.UrlSegment = url_tree_1.UrlSegment;
var router_outlet_map_1 = require('./router_outlet_map');
exports.RouterOutletMap = router_outlet_map_1.RouterOutletMap;
var shared_1 = require('./shared');
exports.PRIMARY_OUTLET = shared_1.PRIMARY_OUTLET;
var router_outlet_1 = require('./directives/router_outlet');
var router_link_1 = require('./directives/router_link');
exports.ROUTER_DIRECTIVES = [router_outlet_1.RouterOutlet, router_link_1.RouterLink];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVCQUF1QixVQUFVLENBQUM7QUFBekIsaUNBQXlCO0FBQ2xDLCtCQUFvRCxrQkFBa0IsQ0FBQztBQUE5RCx1REFBYTtBQUFFLHFFQUErQztBQUN2RSw2QkFBNEMsZ0JBQWdCLENBQUM7QUFBcEQsaURBQVc7QUFBRSx1REFBdUM7QUFDN0QseUJBQW1DLFlBQVksQ0FBQztBQUF2QyxxQ0FBTztBQUFFLDJDQUE4QjtBQUNoRCxrQ0FBZ0MscUJBQXFCLENBQUM7QUFBN0MsOERBQTZDO0FBRXRELHVCQUF1QyxVQUFVLENBQUM7QUFBakMsaURBQWlDO0FBRWxELDhCQUE2Qiw0QkFBNEIsQ0FBQyxDQUFBO0FBQzFELDRCQUEyQiwwQkFBMEIsQ0FBQyxDQUFBO0FBRXpDLHlCQUFpQixHQUFHLENBQUMsNEJBQVksRUFBRSx3QkFBVSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBSb3V0ZXIgfSBmcm9tICcuL3JvdXRlcic7XG5leHBvcnQgeyBVcmxTZXJpYWxpemVyLCBEZWZhdWx0VXJsU2VyaWFsaXplciB9IGZyb20gJy4vdXJsX3NlcmlhbGl6ZXInO1xuZXhwb3J0IHsgUm91dGVyU3RhdGUsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnLi9yb3V0ZXJfc3RhdGUnO1xuZXhwb3J0IHsgVXJsVHJlZSwgVXJsU2VnbWVudH0gZnJvbSAnLi91cmxfdHJlZSc7XG5leHBvcnQgeyBSb3V0ZXJPdXRsZXRNYXAgfSBmcm9tICcuL3JvdXRlcl9vdXRsZXRfbWFwJztcbmV4cG9ydCB7IFJvdXRlckNvbmZpZywgUm91dGUgfSBmcm9tICcuL2NvbmZpZyc7XG5leHBvcnQgeyBQYXJhbXMsIFBSSU1BUllfT1VUTEVUIH0gZnJvbSAnLi9zaGFyZWQnO1xuXG5pbXBvcnQgeyBSb3V0ZXJPdXRsZXQgfSBmcm9tICcuL2RpcmVjdGl2ZXMvcm91dGVyX291dGxldCc7XG5pbXBvcnQgeyBSb3V0ZXJMaW5rIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3JvdXRlcl9saW5rJztcblxuZXhwb3J0IGNvbnN0IFJPVVRFUl9ESVJFQ1RJVkVTID0gW1JvdXRlck91dGxldCwgUm91dGVyTGlua107Il19