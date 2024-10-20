import {Realm} from '@realm/react';
import {ObjectSchema} from 'realm';

export class UsersData extends Realm.Object {
  static schema = {
    name: 'UsersData',
    primaryKey: 'id',
    properties: {
      id: 'string',
      pageNo: 'int',
      usersList: {type: 'list', objectType: 'Users'},
    },
  };
}

export class Users extends Realm.Object {
  static schema = {
    name: 'Users',
    primaryKey: 'id',
    properties: {
      cgId: 'int?',
      createdAt: 'string?',
      dialCode: 'string?',
      id: 'string',
      mobile: 'string?',
      name: 'string?',
      recordStatus: 'bool?',
      updatedAt: 'string?',
    },
  };
}
