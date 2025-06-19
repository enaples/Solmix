import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3030;
const SLITHER_CONTAINER_NAME = process.env.SLITHER_CONTAINER_NAME || "slither";
const SLITHER_SC_PATH = process.env.SLITHER_SC_PATH || "/share/Solmix/contracts";

export { PORT, SLITHER_CONTAINER_NAME, SLITHER_SC_PATH };
