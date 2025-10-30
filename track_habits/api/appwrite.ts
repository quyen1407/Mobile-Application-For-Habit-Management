import { Account, Client, Databases } from 'react-native-appwrite';


export const client = new Client()
.setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

export const account = new Account(client); // Khởi tạo Account với client Appwrite
export const databases = new Databases(client); // Khởi tạo Databases với client Appwrite

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!; // ID của cơ sở dữ liệu
export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID!; // ID của bộ sưu tập
export const COMPLETIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID!; // ID của bộ sưu tập hoàn thành



export interface RealTimeResponse {
    events: string []; // Sự kiện xảy ra
    payload: any; // Dữ liệu trả về từ sự kiện
}