const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// ==========================================
// DEMO USER
// ==========================================

const DEMO_USER = {
  email: "demo@example.com",
  password: "Demo@123",
};


// ==========================================
// LOGIN API
// ==========================================

app.post("/api/login", (req, res) => {

  const { email, password } = req.body;


  // Check empty fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }


  // Check credentials
  if (
    email === DEMO_USER.email &&
    password === DEMO_USER.password
  ) {

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        email: DEMO_USER.email,
      },
    });

  }


  // Invalid credentials
  return res.status(401).json({
    success: false,
    message: "Invalid email or password.",
  });

});


// ==========================================
// SERVER TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "StreamBox backend is running.",
  });

});


// ==========================================
// TEST API
// ==========================================

app.get("/api/test", (req, res) => {

  res.json({
    success: true,
    message: "API connection successful.",
  });

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

  console.log(
    `Server running at http://localhost:${PORT}`
  );

});