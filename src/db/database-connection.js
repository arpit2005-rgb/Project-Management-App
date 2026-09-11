import mongoose from "mongoose";

const connectionState =
  globalThis.__projectManagementMongoConnection || {
    promise: undefined,
  };

globalThis.__projectManagementMongoConnection = connectionState;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri?.trim()) {
    throw new Error("MONGO_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionState.promise) {
    connectionState.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log("✅ MongoDB connected");
      })
      .catch((error) => {
        connectionState.promise = undefined;
        console.error("❌ MongoDB connection failed", {
          name: error.name,
          message: error.message,
          readyState: mongoose.connection.readyState,
        });
        throw new Error("MongoDB connection failed");
      });
  }

  await connectionState.promise;
};

export default connectDB;
