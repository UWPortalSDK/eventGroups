angular
    .module('portalApp')
	.factory('API', function createAPI(portalHelpers) {
        return new Proxy({}, {
            get(cache, property) {
                if (! cache[property]) {
                    cache[property] = portalHelpers.invokeServerFunction.bind(portalHelpers, property);
                }
                return cache[property];
            }
        });
    });