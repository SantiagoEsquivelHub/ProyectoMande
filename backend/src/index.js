const express = require("express");
const v1WorkoutRouter = require("./routes/workoutRoutes");
const  auth  = require('./routes/auth')

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use("/api/auth/", auth);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
