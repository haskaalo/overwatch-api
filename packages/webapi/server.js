const app = require('./app');

app.listen(process.env.PORT || 3000, process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost', () => {
    console.log(`Server started on port ${3000}`);
});
