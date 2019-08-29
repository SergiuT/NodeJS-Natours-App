const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Running on ${port}..`);
});
