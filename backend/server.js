require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const { connectRedis } = require("./src/config/redis");

const startServer = async () => {
    try {

        await connectDB();
        await connectRedis();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
};

startServer();