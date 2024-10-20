import React, {useState, useEffect, useCallback} from 'react';
import {useRealm, Realm} from '@realm/react';
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {fetchCustomers} from '../api/services';
import {UsersData} from '../realm/models/Users';

type UsersDataType = {
  pageNo: number;
  usersList: Array<any>;
};

/**
 * This component fetches customers from the API and stores them in Realm.
 * It renders a list of customers and allows user to search them.
 *
 * @returns a JSX element representing the customers list
 */
const UsersListing = () => {
  const realm = useRealm();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState('');

  const realmUserData = realm.objects(UsersData)[0] as unknown as UsersDataType;

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const newCustomers = await fetchCustomers(pageNo);
      realm.write(() => {
        realm.create(
          'UsersData',
          {
            id: 'user_realm_id',
            pageNo: pageNo + 1,
            usersList:
              pageNo > 1
                ? [...realmUserData?.usersList, ...newCustomers]
                : newCustomers,
          },
          Realm.UpdateMode.Modified,
        );
      });
      setCustomers(prev => [...prev, ...newCustomers]);
      setPageNo(pageNo + 1);
    } catch (error) {
      console.error('Failed to load customers', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a debounced function that delays calling the input function until after the input delay in milliseconds.
   * @param {function} func - the function to debounce
   * @param {number} delay - the delay in milliseconds
   * @returns {function} the debounced function
   */
  function debounce(func: any, delay: number) {
    let timeout: any;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
   * Filters the customers list by the given text. If the text is empty,
   * the original list is restored.
   * @param {string} txt - the text to search for
   */
  const searching = (txt: string) => {
    let result = customers.filter(item =>
      item.name?.toLowerCase().includes(txt?.toLowerCase()),
    );

    if (!!txt) {
      setCustomers(result);
    } else {
      setCustomers(realmUserData?.usersList);
    }
  };

  const debounceSearch = useCallback(debounce(searching, 500), []);

  useEffect(() => {
    console.log(realmUserData);
    if (realmUserData && realmUserData?.usersList?.length > 0) {
      setCustomers(realmUserData?.usersList);
      setPageNo(realmUserData.pageNo);
    } else {
      loadCustomers();
    }
  }, []);

  /**
   * Render a single customer's details in a View.
   * @param {{item: {id: string, cgId: string, name: string, email: string, dialCode: string, mobile: string}}} props
   */
  const renderCustomer = ({item}) => (
    <View style={styles.itemContainer} key={item.id + item.cgId}>
      <Text style={styles.titleStyle}>{item?.name || 'NA'}</Text>
      <Text>Email: {item?.email || 'NA'}</Text>
      <Text>Mobile No: {item?.dialCode + item?.mobile || 'NA'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.searchContainer}>
        <Image
          source={require('../assets/search_icon.png')}
          style={{height: 20, width: 20, tintColor: 'black'}}
        />
        <TextInput
          value={search}
          placeholder="Search"
          onChangeText={(txt: string) => {
            setSearch(txt);
            debounceSearch(txt);
          }}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={customers}
        renderItem={renderCustomer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item, index) => item?.id + item?.cgId + index}
        onEndReached={() => customers.length > 0 && !search && loadCustomers()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  searchContainer: {
    gap: 10,
    borderRadius: 10,
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginVertical: 30,
    marginHorizontal: 10,
  },
  searchInput: {
    height: 40,
    width: 280,
    fontSize: 14,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
  listStyle: {
    flexGrow: 1,
    gap: 10,
  },
  itemContainer: {
    padding: 10,
    height: 100,
    width: '100%',
    gap: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
});

export default React.memo(UsersListing);
