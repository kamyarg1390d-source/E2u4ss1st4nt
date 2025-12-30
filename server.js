const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // اجازه می‌دهد سایت شما به این سرور وصل شود

// این بخش درخواست را از سایت شما می‌گیرد
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const apiKey = process.env.GEMINI_API_KEY; // کلید را از گاوصندوق برمی‌دارد

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'خطا در ارتباط با هوش مصنوعی' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
