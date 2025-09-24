const express = require("express");
const router = express.Router();
const { 
    setCategoryGoal, 
    getCategoryGoals, 
    getBudgetTracking, 
    markAlertAsRead, 
    getBudgetAlerts 
} = require("../controllers/categoryBudgetController");
const authMiddleware = require("../middleware/auth");

router.post("/set", authMiddleware, setCategoryGoal);
router.get("/", authMiddleware, getCategoryGoals);
router.get("/tracking", authMiddleware, getBudgetTracking);
router.get("/alerts", authMiddleware, getBudgetAlerts);
router.put("/alerts/:alertId/read", authMiddleware, markAlertAsRead);

module.exports = router;
