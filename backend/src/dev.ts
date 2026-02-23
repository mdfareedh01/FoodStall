import app from './index.js'

const port = 3000;
app.listen(port, () => {
    console.log(`Local development server running on http://localhost:${port}`)
});
