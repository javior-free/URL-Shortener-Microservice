require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = [];

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  try{
    const urlObj = new URL(originalUrl);
    const hostname = urlObj.hostname;

    dns.lookup(hostname, (err) =>{
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      const shortUrl = urlDatabase.length + 1;
      urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (err) {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
