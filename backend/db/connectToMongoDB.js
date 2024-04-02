import mongoose from "mongoose";

const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("ket noi thanh cong");

    } catch (error) {
        console.log("Loi khong ket noi", error.message);
    }
};
export default connectToMongoDB;