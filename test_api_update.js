const axios = require('axios');

async function testUpdate() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@navbites.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log('Login successful, token received.');

        // 2. Create a test dish
        console.log('Creating test dish...');
        const dishRes = await axios.post('http://localhost:5000/api/admin/dishes', {
            title: 'Temp Dish',
            description: 'To be updated',
            price: 50,
            category: 'Appetizers',
            image: 'http://example.com/img.jpg',
            rating: 3
        }, {
            headers: { 'x-auth-token': token }
        });
        const dishId = dishRes.data._id;
        console.log('Dish created, ID:', dishId);

        // 3. Update the dish
        console.log('Updating dish...');
        const updateRes = await axios.put(`http://localhost:5000/api/admin/dishes/${dishId}`, {
            title: 'Updated Dish Title',
            price: 75
        }, {
            headers: { 'x-auth-token': token }
        });

        console.log('Update response:', updateRes.data);

        if (updateRes.data.title === 'Updated Dish Title' && updateRes.data.price === 75) {
            console.log('✅ Update Verified Successfully!');
        } else {
            console.log('❌ Update Failed, data mismatch.');
        }

        // 4. Cleanup
        await axios.delete(`http://localhost:5000/api/admin/dishes/${dishId}`, {
            headers: { 'x-auth-token': token }
        });
        console.log('Dish deleted.');

    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
}

testUpdate();
