// 1. Import the specific v2 function type you need (onRequest)
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

const getZoomAccessToken = async () => {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    if (!accountId || !clientId || !clientSecret) {
        throw new Error("Zoom API credentials are not configured.");
    }
    const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await axios.post(tokenUrl, {}, {
        headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data.access_token;
};

// 2. Export the function using the new v2 syntax
// The secrets and other options are passed as the first argument.
exports.generateMeetingLink = onRequest(
    { secrets: ["ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET"] },
    (req, res) => {
        // 3. Wrap the function body with the cors handler
        cors(req, res, async () => {
            try {
                const idToken = req.headers.authorization?.split("Bearer ")[1];
                if (!idToken) {
                    res.status(403).send("Unauthorized");
                    return;
                }
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                const uid = decodedToken.uid;
                const { sessionId } = req.body.data;
                if (!sessionId) {
                    res.status(400).send({ data: { error: "Session ID is required." } });
                    return;
                }
                const sessionRef = db.collection("sessions").doc(sessionId);
                const sessionDoc = await sessionRef.get();
                if (!sessionDoc.exists || sessionDoc.data().mentorId !== uid) {
                     res.status(403).send({ data: { error: "Permission denied." } });
                     return;
                }
                const accessToken = await getZoomAccessToken();
                const zoomApiUrl = "https://api.zoom.us/v2/users/me/meetings";
                const meetingDetails = { topic: `Mentorship Session: ${sessionDoc.data().skillName}`, type: 2, settings: { join_before_host: true } };
                const response = await axios.post(zoomApiUrl, meetingDetails, {
                    headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
                });
                const meetingLink = response.data.join_url;
                await sessionRef.update({ meetingLink: meetingLink });
                res.status(200).json({ data: { success: true, meetingLink: meetingLink } });
            } catch (error) {
                console.error("Error in generateMeetingLink:", error);
                res.status(500).json({ data: { error: "An internal error occurred." } });
            }
        });
    }
);

