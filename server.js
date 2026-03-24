const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/bookmyvilla');

const Booking = mongoose.model('Booking', {
  villa: String,
  name: String,
  email: String,
  phone: String,
  checkin: String,
  checkout: String,
  guests: String,
  total: String
});

app.post('/booking', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on 5000"));