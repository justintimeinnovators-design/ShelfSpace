import axios from "axios";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL?.trim() || "http://localhost:3001";
/**
 * Authenticate Token.
 * @param req - req value.
 * @param res - res value.
 * @param next - next value.
 */
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res
            .status(401)
            .json({ error: "Unauthorized: A token is required for authentication" });
        return;
    }
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/api/auth/verify`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...(req.headers["x-request-id"]
                    ? { "X-Request-ID": String(req.headers["x-request-id"]) }
                    : {}),
            },
            timeout: 5000,
        });
        const userId = response.data?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized: Invalid token" });
            return;
        }
        req.user = { id: userId };
        next();
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    res.status(401).json({
                        error: "Unauthorized: Invalid or expired token",
                    });
                    return;
                }
                res.status(status).json(err.response.data || { error: "Authentication failed" });
                return;
            }
            res.status(503).json({
                error: "User service unavailable",
            });
            return;
        }
        res.status(500).json({ error: "Authentication failed" });
        return;
    }
};
