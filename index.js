const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

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





