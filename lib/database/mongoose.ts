import mongoose, {Mongoose} from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// tricky due to the serverless nature of Next.js..
// we need to cache the connection because we need a new connection everytime
let cached: MongooseConnection = (global as any).mongoose
if (!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise:null
    }
}

export const connectToDatabase = async() => {
    if (cached.conn) return cached.conn;
    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');
    cached.promise = cached.promise || mongoose.connect(
        MONGODB_URL, {dbName: 'imaginifyTest1', bufferCommands: false}
    )

    cached.conn = await cached.promise;
    return cached.conn;
}