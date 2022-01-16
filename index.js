const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/artist', (req, res) => {
    res.send(this);
});

app.post('/api/artist', (req, res) => {
    res.send(req.body);
});

app.get('/api/artistsEvents', (req, res) => {

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));