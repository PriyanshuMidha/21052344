const express = require('express');
const axios = require('axios');
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const app = express();
const PORT = process.env.PORT || 9876;

const WINDOW_SIZE = 10;
let numbers = [];

// Function to fetch numbers from the third-party server
const fetchNumbers = async () => {
  const url = 'http://20.244.56.144/test/p'; // Example URL, replace with the actual endpoint
  const token = ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTQ2MTg1LCJpYXQiOjE3MTUxNDU4ODUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImNkYzBlM2MxLWM5ZTQtNDE1NS1hZjM3LTY5OGRhYzhmYzExMiIsInN1YiI6IjIxMDUyMzQ0QGtpaXQuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJBZmZvcmQiLCJjbGllbnRJRCI6ImNkYzBlM2MxLWM5ZTQtNDE1NS1hZjM3LTY5OGRhYzhmYzExMiIsImNsaWVudFNlY3JldCI6InZGbUhSTmJBa01MWWNJQ2EiLCJvd25lck5hbWUiOiJQcml5YW5zaHUgTWlkaGEiLCJvd25lckVtYWlsIjoiMjEwNTIzNDRAa2lpdC5hYy5pbiIsInJvbGxObyI6IjIxMDUyMzQ0In0.PNt_5U4oJ5VkoSF2Y6Qg6J4su-acXfhkudOA8b-1xb8'; // Example JWT token
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: Bearer ${token}
      }
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error(Error fetching numbers from the third-party server: ${error.message});
    throw error; // Rethrow the error to retry the request
  }
};

// Function to calculate average
const calculateAverage = (nums) => {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((acc, num) => acc + num, 0);
  return sum / nums.length;
};

// Fetch numbers and update state periodically
const updateNumbers = async () => {
  try {
    const newNumbers = await fetchNumbers();
    if (newNumbers.length > 0) {
      // Update numbers with new fetched numbers
      numbers = numbers.concat(newNumbers).filter((num, index, arr) => arr.indexOf(num) === index).slice(-WINDOW_SIZE);
    }
  } catch (error) {
    // Log the error
    console.error(Error fetching numbers from the third-party server: ${error.message});
  }
};

// Periodically update numbers every 500 ms
const interval = setIntervalAsync(updateNumbers, 500);

// Handle incoming requests
app.get('/numbers/:numberid', async (req, res) => {
  // Calculate average
  const avg = calculateAverage(numbers);

  // Prepare response data
  const responseData = {
    windowPrevState: numbers.slice(0, -1),
    windowCurrState: numbers,
    numbers,
    avg: avg.toFixed(2)
  };

  // Respond with the data
  res.json(responseData);
});

// Start the server
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});