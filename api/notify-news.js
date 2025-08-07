const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { title, url, image } = req.body;

    const payload = {
      app_id: "aa02bd83-a2b0-446b-9545-e56ee5411b76",
      filters: [{ field: "tag", key: "platform", relation: "=", value: "android" }],
      headings: { en: "📰 New Article Published" },
      contents: { en: title },
      url: url,
      big_picture: image || "", // ✅ Use post image here
      ios_attachments: {
        image: image || "" // Optional: For iOS if supported
      }
    };

    const headers = {
      Authorization: "Basic os_v2_app_vibl3a5cwbcgxfkf4vxokqi3o2ptaut7gu5ek4nygkglunjy7ebbgfwqcpvih7po7t6w7vzzlggdnloqx3hiioqnp7qcq6cggaolkfa",
      "Content-Type": "application/json; charset=utf-8"
    };

    const response = await axios.post("https://onesignal.com/api/v1/notifications", payload, { headers });

    console.log("✅ Notification sent:", response.data);
    res.status(200).send("Notification sent");
  } catch (error) {
    console.error("❌ Error sending push:", error.message);
    res.status(500).send("Push failed");
  }
};
