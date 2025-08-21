// File: api/sendNotification.js
const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  try {
    // Which post to send? (0=first/latest, 1=second, etc.)
    const index = parseInt(req.query.index || "0", 10);

    // 1. Fetch latest posts
    const response = await axios.get("https://myinewsworld.com/wp-json/wp/v2/posts?per_page=4");
    const posts = response.data;

    if (!posts || posts.length === 0) {
      return res.status(404).send("No posts found");
    }

    // Ensure index is in range
    const post = posts[index];
    if (!post) {
      return res.status(404).send("Post index out of range");
    }

    // Extract data
    const title = post.title?.rendered || "📰 New Article";
    const url = post.link;
    const image = post.jetpack_featured_media_url || "";

    // 2. Build OneSignal payload
    const payload = {
      app_id: "aa02bd83-a2b0-446b-9545-e56ee5411b76", // ✅ Your OneSignal App ID
      filters: [{ field: "tag", key: "platform", relation: "=", value: "android" }],
      headings: { en: "📰 Latest News" },
      contents: { en: title },
      url: url,
      big_picture: image,
      ios_attachments: {
        image: image
      }
    };

    const headers = {
      Authorization: "Basic os_v2_app_vibl3a5cwbcgxfkf4vxokqi3o2ptaut7gu5ek4nygkglunjy7ebbgfwqcpvih7po7t6w7vzzlggdnloqx3hiioqnp7qcq6cggaolkfa",
      "Content-Type": "application/json; charset=utf-8"
    };

    // 3. Send notification
    const notifRes = await axios.post("https://onesignal.com/api/v1/notifications", payload, { headers });

    console.log("✅ Notification sent:", notifRes.data);
    return res.status(200).json({ success: true, sent: post.title.rendered });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).send("Push failed: " + error.message);
  }
};
