import { Router } from "express";
import authMeRoutes from "./routes/authMe.routes";
import authRefreshRoutes from "./routes/authRefresh.routes";
import emailVerificationRoutes from "./routes/emailVerification.routes";
import loginRoutes from "./routes/login.routes";
import logoutRoutes from "./routes/logout.routes";
import resendOtpRoutes from "./routes/resendOTP.routes";

const router: Router = Router();

router.use("/email-verifications", emailVerificationRoutes);
router.use("/login", loginRoutes);
router.use("/me", authMeRoutes);
router.use("/otp-resends", resendOtpRoutes);
router.use("/refresh", authRefreshRoutes);
router.use("/logout", logoutRoutes);

export default router;
