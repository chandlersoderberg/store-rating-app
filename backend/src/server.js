const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Store Rating API running on http://localhost:${port}`);
});
