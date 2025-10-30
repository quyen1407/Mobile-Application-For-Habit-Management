import { Models } from "react-native-appwrite";


export interface Habit extends Models.Document{
    user_id: string; // ID của người dùng
    title: string; // Tiêu đề của thói quen
    description: string; // Mô tả của thói quen
    frequency: string; // Tần suất của thói quen
    streak_count: number; // Số ngày liên tiếp đã hoàn thành thói quen
    last_completed: string; // Ngày hoàn thành cuối cùng
    created_at: string; // Ngày tạo thói quen
}


export interface HabitCompletion extends Models.Document {
    habit_id: string; // ID của thói quen
    user_id: string; // ID của người dùng
    completed_at: string; // Thời gian hoàn thành
}
