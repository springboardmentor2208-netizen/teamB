const dotenv = require("dotenv");
const connectingTODB = require("./config/db.js");
const app = require("./app.js");

dotenv.config();

connectingTODB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
