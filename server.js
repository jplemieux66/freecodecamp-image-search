const express = require('express');
const port = process.env.port || 3000;

const app = express();

app.get('/imagesearch/*', () => {
  
});

app.get('/latest', () => {

});

app.listen(port);
console.log(`Server is listening on port ${port}`);