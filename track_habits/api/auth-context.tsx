import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

// Hàm dịch lỗi từ Appwrite sang tiếng Việt
const translateError = (message: string): string => {
    if (message.includes("Invalid email or password")) {
        return "Email hoặc mật khẩu không đúng";
    }
    if (message.includes("User already exists") || message.includes("already registered")) {
        return "Email này đã được đăng ký";
    }
    if (message.includes("Invalid email")) {
        return "Địa chỉ email không hợp lệ";
    }
    if (message.includes("Password must be at least")) {
        return "Mật khẩu quá ngắn, vui lòng nhập đủ ký tự";
    }
    if (message.includes("Rate limit")) {
        return "Bạn thao tác quá nhanh, vui lòng thử lại sau";
    }
    return "Có lỗi xảy ra, vui lòng thử lại"; // fallback
}

// Định nghĩa kiểu AuthContext
type AuthContextType = {
    user: Models.User<Models.Preferences> | null; // Thông tin người dùng, có thể là null nếu chưa đăng nhập
    isLoadingUser: boolean; // Trạng thái đang tải thông tin người dùng
    singUp:(email: string, password: string) => Promise<string | null>; // Hàm đăng ký người dùng
    signIn:(email: string, password: string) => Promise<string | null>; // Hàm đăng nhập người dùng
    signOut:() => Promise<void>; // Hàm đăng xuất người dùng
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Tạo context cho Auth

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null); // Lưu thông tin người dùng
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true); // Trạng thái đang tải thông tin người dùng

    useEffect(() => {
        getUser(); // Lấy thông tin người dùng khi component được gắn
    }, []); // Chỉ chạy một lần khi component được gắn

    // Hàm lấy thông tin người dùng từ Appwrite
    const getUser = async () => {
        try {
            const session = await account.get(); // Lấy thông tin người dùng từ Appwrite
            setUser(session); // Cập nhật thông tin người dùng
        }catch (error) {
            setUser(null); // Nếu có lỗi, đặt user là null
        }finally {
            setIsLoadingUser(false); // Đặt trạng thái đang tải là false sau khi hoàn thành
        }
    }
    
    const singUp = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email, password); // Tạo tài khoản mới
            // await signIn(email, password); // Đăng nhập ngay sau khi đăng ký
            return null; // Trả về null nếu thành công
        }catch (error) {
            if(error instanceof Error) {
                return translateError(error.message); // ✅ Dịch lỗi sang tiếng Việt
            }
            return "Đăng ký không thành công"; // Thông báo lỗi chung nếu không phải Error
        }
    } // Hàm đăng ký người dùng

    const signIn = async (email: string, password: string) => {
         try {
            await account.createEmailPasswordSession(email, password); // Đăng nhập người dùng
            const session = await account.get(); // Lấy thông tin phiên đăng nhập
            setUser(session); // Cập nhật thông tin người dùng
            return null; // Trả về null nếu thành công
        }catch (error) {
            if(error instanceof Error) {
                return translateError(error.message); // ✅ Dịch lỗi sang tiếng Việt
            }
            return "Đăng nhập không thành công"; // Thông báo lỗi chung nếu không phải Error
        }
    }

    const signOut = async () => {
        try {
            await account.deleteSession("current"); // Xóa phiên đăng nhập hiện tại
            setUser(null); // Đặt user là null sau khi đăng xuất
        } catch (error) {
            console.error("Đăng xuất không thành công:", error); // In lỗi nếu có
        }
    }

    return (
        // Cung cấp context cho các component con
        <AuthContext.Provider value={{user,isLoadingUser ,singUp, signIn , signOut}}>
            {children}
        </AuthContext.Provider> 
    );
}

export function useAuth() {
    const context = useContext(AuthContext); // Lấy context
    if (context === undefined) {
        throw new Error("useAuth phải được sử dụng trong AuthProvider"); // Kiểm tra nếu context không được cung cấp
    }
    return context; // Trả về context
}
