import { AuthProvider, useAuth } from "@/api/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Theo dõi trạng thái gắn
  const {user, isLoadingUser} = useAuth(); // Lấy thông tin người dùng từ context
  const segments = useSegments(); // Lấy các segment của route hiện tại
  useEffect(() => {
    // Đánh dấu rằng component đã được gắn
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth"; // Kiểm tra xem có trong nhóm auth không
    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth"); // Chỉ điều hướng khi component đã gắn
    }else if(user && inAuthGroup && !isLoadingUser){
          router.replace("/"); // Nếu đã đăng nhập và đang ở trang auth, điều hướng về trang chính
    }
  }, [user, segments]); // Chạy lại khi user hoặc segments thay đổi

  return <>{children}</>;
}

export default function RootLayout() { 
  return (
    // Bọc toàn bộ ứng dụng trong GestureHandlerRootView để hỗ trợ gestures
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <AuthProvider>
        <PaperProvider>
        {/* Bọc toàn bộ ứng dụng trong PaperProvider để sử dụng các component của React Native*/}
        <SafeAreaProvider>
        <RouteGuard>
        <Stack
          screenOptions={{
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ title: "Authentication" }} />
        </Stack>
      </RouteGuard>
      </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}