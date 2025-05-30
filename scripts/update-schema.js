const axios = require('axios');

async function updateSchema() {
  try {
    const response = await axios.post('http://localhost:3000/api/update-schema');
    console.log('Schema update response:', response.data);
  } catch (error) {
    console.error('Error updating schema:', error.response?.data || error.message);
  }
}

updateSchema(); 