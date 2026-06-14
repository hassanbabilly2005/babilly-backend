const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const ONESIGNAL_APP_ID = "8c929fdb-4b30-4e36-b0e3-fbffd9d208b5";

const ONESIGNAL_API_KEY = "os_v2_app_rsjj7w2lgbhdnmhd7p75tuqiwuse3jyjnfbe6fmqoofp6wze6simxxhya5e4ts4tmbhv623c2mdj7jcfrpeqrx6atyujticwfesqvbq";

app.post("/send-friend-request", async (req, res) => {
  try {
    const { oneSignalId, senderName } = req.body;

    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        include_subscription_ids: [oneSignalId],

        headings: {
          en: "طلب صداقة جديد",
        },

        contents: {
          en: `${senderName} أرسل إليك طلب صداقة`,
        },
      },
      {
        headers: {
          Authorization: `Key ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({
      error: "failed",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});





curl -X POST http://localhost:3000/send-friend-request ^
-H "Content-Type: application/json" ^
-d "{\"oneSignalId\":\"f8c7d432-77ab-4188-a151-948542c2aed7"
(string)


\",\"senderName\":\"Hassan\"}"