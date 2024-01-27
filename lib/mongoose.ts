import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_URL) {
        return console.log('MONGO_URL не найдено');
    }

    if(isConnected) {
        return console.log('Уже підключено MongoDB');
    }

    try {
        await mongoose.connect(process.env.MONGO_URL);

        isConnected = true;
        console.log('Підключено до MongoDB');
    } catch (error) {
        console.log(error)
    }
}