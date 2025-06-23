const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
// Configure CORS to allow requests from your GitHub Pages frontend
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origin === 'https://kp2340.github.io/Decorom-ecommerce/') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
};
app.use(cors(corsOptions));
// const corsOptions = {
//     origin: 'https://kp2340.github.io/Decorom-ecommerce/', // Replace with your actual GitHub Pages URL
//     methods: 'GET,POST', // Allow only necessary methods
//     allowedHeaders: 'Content-Type', // Allow only necessary headers
// };
// app.use(cors(corsOptions)); // Apply CORS with options
// app.use(express.json()); // Allows requests from your React app (e.g., http://localhost:5173)

// const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

const spreadsheetId =   process.env.SPREADSHEET_ID; // Replace with your Spreadsheet ID
const range = 'Sheet1!A:E'; // Adjust range as needed

app.post('/api/submit-inquiry', async (req, res) => {
    const { name, mobile, design, message } = req.body;
    console.log(`${name} - ${mobile} - ${design} - ${message}`);
    if (!name || !mobile || !/^[0-9]{10}$/.test(mobile)) {
        return res.status(400).json({ error: 'Name and a valid 10-digit mobile number are required.' });
    }

    // Find material based on design
    const designs = [
        { id: 1, material: 'ACP' }, { id: 2, material: 'Acrylic' }, { id: 3, material: 'Acrylic' },
        { id: 4, material: 'Acrylic' }, { id: 5, material: 'Acrylic' }, { id: 6, material: 'ACP' },
        { id: 7, material: 'Acrylic' }, { id: 8, material: 'Acrylic' }, { id: 9, material: 'Acrylic' },
        { id: 10, material: 'Acrylic' }, { id: 11, material: 'Acrylic' }, { id: 12, material: 'Acrylic' },
        { id: 13, material: 'Metal' }, { id: 14, material: 'Metal' }, { id: 15, material: 'Acrylic' },
        { id: 16, material: 'Acrylic' }, { id: 17, material: 'ACP' }, { id: 18, material: 'Acrylic' },
        { id: 19, material: 'Acrylic' }, { id: 20, material: 'Acrylic' }, { id: 21, material: 'Metal' },
        { id: 22, material: 'Metal' }, { id: 23, material: 'Acrylic' }, { id: 24, material: 'ACP' },
        { id: 25, material: 'Metal' }, { id: 26, material: 'ACP' }, { id: 27, material: 'ACP' },
        { id: 28, material: 'Acrylic' }, { id: 29, material: 'Acrylic' }, { id: 30, material: 'Acrylic' },
        { id: 31, material: 'Acrylic' }, { id: 32, material: 'Acrylic' }, { id: 33, material: 'Acrylic' },
        { id: 34, material: 'Acrylic' }, { id: 35, material: 'ACP' }, { id: 36, material: 'Acrylic' },
        { id: 37, material: 'Acrylic' }, { id: 38, material: 'Acrylic' }, { id: 39, material: 'Acrylic' },
        { id: 40, material: 'Acrylic' }, { id: 41, material: 'Acrylic' }, { id: 42, material: 'Acrylic' },
        { id: 43, material: 'Acrylic' }, { id: 44, material: 'ACP' }, { id: 45, material: 'Acrylic' },
        { id: 46, material: 'Metal' }, { id: 47, material: 'Acrylic' }, { id: 48, material: 'ACP' },
        { id: 49, material: 'ACP' }, { id: 50, material: 'Acrylic' },
    ];
    const selectedDesign = designs.find(d => d.id.toString() === design);
    const material = selectedDesign ? selectedDesign.material : '';

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const values = [[now, name, mobile, design, material]];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values },
        });
        res.status(200).json({ message: 'Inquiry submitted successfully' });
    } catch (error) {
        console.error('Error appending to Google Sheets:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});