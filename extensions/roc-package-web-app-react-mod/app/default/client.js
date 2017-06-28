import { createClient } from '../client';

import getRoutesAndStore from './get-routes-and-store';

const { store, routes, routerMiddlewareConfig } = getRoutesAndStore();

createClient({
    routes,
    createStore: store,
    mountNode: 'application',
    routerMiddlewareConfig,
});
