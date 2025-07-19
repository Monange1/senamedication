const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mkmonange:qwKMgbTJloHpb6UI@cluster0.l1888jm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });