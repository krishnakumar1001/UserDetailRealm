import React from 'react';
import {RealmProvider} from '@realm/react';
import UsersListing from './src/usersListing';
import {APP_SCHEMAS, REALM_PATH} from './src/realm/realm';

/**
 * Main App component that provides Realm context to UsersListing component.
 */
const App = () => {
  return (
    <RealmProvider
      path={REALM_PATH}
      schema={APP_SCHEMAS}
      closeOnUnmount={false}
      deleteRealmIfMigrationNeeded={true}>
      <UsersListing />
    </RealmProvider>
  );
};

export default App;
