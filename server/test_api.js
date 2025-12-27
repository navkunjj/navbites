const axios = require('axios');

async function testApi() {
    try {
        console.log('1. Registering User...');
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'API Test User',
            email: 'apitest_' + Date.now() + '@test.com',
            password: 'password123'
        });
        const token = regRes.data.token;
        console.log('   Success! Token received.');

        console.log('2. Adding Item to Cart...');
        const item = {
            title: 'Test Dish',
            price: '99',
            image: 'http://example.com/img.jpg',
            description: 'Delicious test',
            rating: '5.0'
        };
        const addRes = await axios.post('http://localhost:5000/api/cart', item, {
            headers: { 'x-auth-token': token }
        });
        console.log('   Success! Cart items count:', addRes.data.length);

        console.log('3. Fetching Cart...');
        const getRes = await axios.get('http://localhost:5000/api/cart', {
            headers: { 'x-auth-token': token }
        });

        if (getRes.data.length > 0 && getRes.data[0].title === 'Test Dish') {
            console.log('   Success! Item verified in cart.');
        } else {
            console.log('   Failed! Item not found.');
        }

    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
}

testApi();
