const app = require('./app');

app.listen(process.env.PORT || 3000, 'localhost', () => {
    console.log(`Server started on port ${3000} localhost`);
});
