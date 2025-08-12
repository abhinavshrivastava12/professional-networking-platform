const User = require("../models/User");

// Send connection request
const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.body.toUserId;

    if (fromUserId === toUserId) {
      return res.status(400).json({ msg: "You cannot connect with yourself" });
    }

    const [toUser, fromUser] = await Promise.all([
      User.findById(toUserId),
      User.findById(fromUserId),
    ]);

    if (!toUser || !fromUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if request or connection already exists
    if (toUser.connectionRequests.includes(fromUserId) || toUser.connections.includes(fromUserId)) {
      return res.status(400).json({ msg: "Already requested or connected" });
    }

    toUser.connectionRequests.push(fromUserId);
    await toUser.save();

    res.json({ msg: "Request sent" });
  } catch (err) {
    console.error("Error sending request:", err.message);
    res.status(500).json({ msg: "Failed to send request" });
  }
};

// Accept connection request
const acceptRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const senderId = req.body.senderId;

    const [currentUser, sender] = await Promise.all([
      User.findById(currentUserId),
      User.findById(senderId),
    ]);

    if (!currentUser || !sender) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!currentUser.connectionRequests.includes(senderId)) {
      return res.status(400).json({ msg: "No such request" });
    }

    // Add connections mutually
    currentUser.connections.push(senderId);
    sender.connections.push(currentUserId);

    // Remove senderId from currentUser's connectionRequests
    currentUser.connectionRequests = currentUser.connectionRequests.filter(
      (id) => id.toString() !== senderId
    );

    await Promise.all([currentUser.save(), sender.save()]);

    res.json({ msg: "Request accepted" });
  } catch (err) {
    console.error("Accept Request Error:", err.message);
    res.status(500).json({ msg: "Failed to accept request" });
  }
};

// Get all accepted connections
const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "connections",
      "_id name email profilePic"
    );
    res.json(user.connections);
  } catch (err) {
    console.error("Fetch Connections Error:", err.message);
    res.status(500).json({ msg: "Failed to fetch connections" });
  }
};

// Get pending requests received
const getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "connectionRequests",
      "_id name email profilePic"
    );
    res.json(user.connectionRequests);
  } catch (err) {
    console.error("Fetch Pending Requests Error:", err.message);
    res.status(500).json({ msg: "Failed to fetch pending requests" });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  getConnections,
  getPendingRequests,
};
