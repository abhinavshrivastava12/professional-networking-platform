const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const postRoutes = require('./post');
const connectionRoutes = require('./connection'); // ✅ important
const uploadRoutes = require('./upload');
const jobRoutes = require('./job');
const messageRoutes = require('./message');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/connections', connectionRoutes); // ✅ this one!
router.use('/upload', uploadRoutes);
router.use('/jobs', jobRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
