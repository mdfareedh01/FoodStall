import 'dotenv/config';
import app from '../api/index.js'

const port = 3000;
app.listen(port, () => {
    console.log(`Local development server running on http://localhost:${port}`)
});
