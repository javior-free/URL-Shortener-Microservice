require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = [];

// POST /api/shorturl
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validar formato con una expresión regular simple
  const urlPattern = /^https?:\/\/(.*)/i;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Extraer el hostname (sin usar try/catch)
  const hostname = originalUrl.replace(/^https?:\/\//, '').split('/')[0];

  // Verificar dominio con dns.lookup
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Crear short_url
    const shortUrl = urlDatabase.length + 1;

    urlDatabase.push({
      original_url: originalUrl,
      short_url: shortUrl
    });

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});

// GET /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', (req, res) => {
  const short = Number(req.params.short_url);
  const entry = urlDatabase.find(obj => obj.short_url === short);

  if (entry) {
    res.redirect(entry.original_url);
  } else {
    res.json({ error: 'No short URL found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
