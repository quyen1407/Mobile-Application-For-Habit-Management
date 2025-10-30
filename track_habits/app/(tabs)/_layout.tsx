import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Tabs } from "expo-router";
export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerStyle:{backgroundColor: "#f5f5f5"}, // Thiết lập màu nền cho header
    headerShadowVisible: false, // Ẩn bóng đổ dưới header
    tabBarStyle: {
        backgroundColor: "#f5f5f5", // Thiết lập màu nền cho thanh tab
        borderTopWidth: 0, // Ẩn đường viền trên cùng của thanh
        elevation: 0, // Ẩn bóng đổ của thanh tab
        shadowOpacity: 0, // Ẩn bóng đổ của thanh tab
    },
      tabBarActiveTintColor: "#6200ee", // Màu sắc của tab đang được chọn
      tabBarInactiveTintColor: "#666666", // Màu sắc của tab không được
     }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Hằng Ngày",
          tabBarIcon: ({ color , size }) => <MaterialCommunityIcons name='calendar-today' 
          size={size} color={color} />,
      
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          title: "Chuỗi Ngày",
          tabBarIcon: ({ color , size }) => <MaterialCommunityIcons name='chart-line' 
          size={size} color={color} />,
      
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: "Thêm Thói Quen",
          tabBarIcon: ({ color , size }) => <MaterialCommunityIcons name='plus-circle' 
          size={size} color={color} />,
      
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
}