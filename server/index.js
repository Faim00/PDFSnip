const express = require('express');
const cors = require('cors');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// All /pdf routes
app.use('/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
