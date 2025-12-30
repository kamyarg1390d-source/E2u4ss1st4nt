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
        const { message, fileData, mimeType } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        // ساختار پیام برای جمینای
        const promptParts = [{ text: message }];
        
        // اگر تصویری فرستاده شده بود، آن را به لیست اضافه کن
        if (fileData && mimeType) {
            promptParts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: fileData // کدهای تصویر
                }
            });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: promptParts }]
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'خطا در پردازش درخواست' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
