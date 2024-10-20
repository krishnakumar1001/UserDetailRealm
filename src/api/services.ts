// api.js
import axios from 'axios';
import {Alert} from 'react-native';

// API configuration
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDAwOGQzNS01OTlhLTQ4YzAtYWQ2My03NmY4N2UyZGIwYzMiLCJlbnRpdHlUeXBlIjoidXNlciIsInYiOiIwLjEiLCJpYXQiOjE3MDE3OTk1NzgsImV4cCI6MTczMzM1NzE3OH0.aolRFer6LQ9JboZT7pDqb3Eq2SGOcUwGRRTzG2mfPJ4';
// Function to fetch customers
export const fetchCustomers = async (
  pageNo = 1,
  pageSize = 20,
  filters = {},
) => {
  console.log(pageNo);
  try {
    const response = await axios.get(
      `https://cgv2.creativegalileo.com/api/V1/customer/filter?paginated=true&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response?.data?.success) {
      const customers = response?.data?.data?.customers;
      return customers;
    } else {
      Alert.alert('Something wents wrong');
    }
    // Save customers to Realm
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};
