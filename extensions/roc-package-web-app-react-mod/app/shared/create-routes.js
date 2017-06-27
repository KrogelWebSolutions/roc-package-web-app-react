import React from 'react';
// import Route from 'react-router/lib/Route';
import {Route, Switch} from 'react-router-dom';

import Application from './application';

/**
 * Route creator
 *
 * @param {!function} routes - A function that takes a reference to potential store and returns a React Router route
 * @returns {function} A function that takes a reference to a potential store, runs the `routes` function and wrapps the
 * result in a _Application component_ wrapper. See the README.md for more information on what it does.
 */
// export default function createRoutes(routes) {
//     return store => {
//         const appRoutes = routes(store);
//
//         return (
//             <Route path="/" component={Application}>
//                 {appRoutes}
//             </Route>
//         );
//     };
// }
export const createRoutes = (routes) => {
  // render components that are inside Switch (main view)
  let routesRendered = routes.map((a, i) => {
    // get tag for Route. is it RouteAuth `protected route` or Route?
    let {path, exact, strict, component} = a;
    // select only props that we need
    let b = {path, exact, strict, component};
    // return <Route key={i} {...b} />;
    // return (
    //   <DefaultLayout footer={<TempFooter/>} header={<HorizontalNavBar/>}>
    //     <Route key={i} {...b} />
    //   </DefaultLayout>
    // );
    // return (<Route key={i} {...b} />);
    return (
      <Application>
        <Route key={i} {...b} />
      </Application>
    );
})

  return (
    <Switch>
      {routesRendered}
    </Switch>
  );
};

export default createRoutes;
