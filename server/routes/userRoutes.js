const {login,register, setAvatar, getAllUsers } = require("../controllers/usersController");
  
const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers)
module.exports = router;
