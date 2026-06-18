const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

// 1. مسار طلب الصداقة (كما هو)
app.post("/send-friend-request", async (req, res) => {
  try {
    const { oneSignalId, senderName } = req.body;

    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        include_subscription_ids: [oneSignalId],
        headings: { en: "طلب صداقة جديد" },
        contents: { en: `${senderName} أرسل إليك طلب صداقة` },
      },
      {
        headers: {
          Authorization: `Bearer ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ error: "failed" });
  }
});

// 2. مسار قبول الصداقة (كما هو)
app.post("/send-follow-accepted", async (req, res) => {
  try {
    const { oneSignalId, accepterName } = req.body;

    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        include_subscription_ids: [oneSignalId],
        headings: { en: "تم قبول طلب الصداقة" },
        contents: { en: `${accepterName} وافق على طلب الصداقة الخاص بك` },
      },
      {
        headers: {
          Authorization: `Bearer ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ error: "failed" });
  }
});

// 3. المسار الجديد المخصص لرسائل الدردشة (مع حل مشكلة الظهور في الأعلى)
app.post("/send-chat-message", async (req, res) => {
  try {
    // نحتاج معرفة الـ chatId لنقل المستخدم إليه عند الضغط، ونص الرسالة واسم المرسل
    const { oneSignalId, senderName, messageText, chatId } = req.body;

    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        include_subscription_ids: [oneSignalId],
        
        headings: { en: senderName }, // اسم المرسل يظهر كعنوان رئيسي
        contents: { en: messageText }, // نص الرسالة يظهر كمحتوى
        
        // --- الخصائص اللازمة لظهور الإشعار في أعلى الشاشة (Heads-up) ---
        android_accent_color: "FF0000FF", // اختياري: لون الأيقونة
        priority: 10,                      // الأولوية القصوى في OneSignal (تساوي High/Max)
        android_visibility: 1,            // إظهار المحتوى بالكامل على شاشة القفل
        
        // لتجميع الإشعارات من نفس الشخص بدل تكرارها
        android_group: `chat_${chatId}`, 
        
        // أهم جزء لآي أو إس وأندرويد لتفعيل الصوت والظهور العلوي
        

        // بيانات إضافية يقرأها كود الفلاتر (Flutter) لتوجيه المستخدم لصفحة الشات المحددة
        data: {
          type: "NEW_MESSAGE",
          chatId: chatId,
          senderName: senderName
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ error: "failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});