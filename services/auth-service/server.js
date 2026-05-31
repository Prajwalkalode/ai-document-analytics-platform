import app from './app.js';
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`);
});