import prisma from "../prisma.js";
/**
 * Is Admin.
 * @param req - req value.
 * @param res - res value.
 * @param next - next value.
 */
export const isAdmin = async (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });
        if (!user) {
            return res.status(403).json({ message: "Forbidden" });
        }
        // Only allow users whose email is in the ADMIN_EMAILS environment variable
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim()) || [];
        if (adminEmails.length === 0) {
            console.error("SECURITY WARNING: ADMIN_EMAILS environment variable is not set!");
            return res.status(500).json({ message: "Server configuration error" });
        }
        if (adminEmails.includes(user.email)) {
            next();
        }
        else {
            res.status(403).json({ message: "Forbidden - Admin access required" });
        }
    }
    catch (error) {
        console.error("Error in isAdmin middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
