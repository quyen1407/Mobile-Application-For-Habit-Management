//   import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
// import { useAuth } from "@/lib/auth-context";
// import { Habit } from "@/types/database.type";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { Query } from "react-native-appwrite";
// import { Button, Surface, Text } from "react-native-paper";

//   export default function Index() {
//     const {signOut, user} = useAuth(); // Lấy hàm đăng xuất từ context
//     const [habits, setHabits] = useState<Habit[]>([]); // Trạng thái để lưu danh sách thói quen

    
//     const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`; // Kênh để đăng ký nhận thông báo
//     useEffect(() => {
//       if(user){
//       const habitsSubscription = client.subscribe(channel,
//         (response: RealTimeResponse) => {
//           if(response.events.includes("databases.*.collections.*.documents.*.create") ) 
//             {
//                fetchHabits(); // Gọi lại hàm để cập nhật danh sách thói quen khi có sự kiện tạo hoặc cập nhật
//             } // Kiểm tra sự kiện tạo
//           else if(response.events.includes("databases.*.collections.*.documents.*.update") )
//             {
//               fetchHabits(); // Gọi lại hàm để cập nhật danh sách thói quen khi có sự kiện cập nhật
//             } // Kiểm tra sự kiện cập nhật
//           else if(response.events.includes("databases.*.collections.*.documents.*.delete") )
//             {
//               fetchHabits(); // Gọi lại hàm để cập nhật danh sách thói quen khi có sự kiện xóa
//             } // Kiểm tra sự kiện xóa
            
            
//         }
//       );
//       fetchHabits(); // Gọi hàm để lấy danh sách thói quen khi component được mount
//       return () => {
//         habitsSubscription(); // Hủy đăng ký khi component bị unmount
//       }
//     }
//     }, [user]); // Hiệu ứng để lấy danh sách thói quen khi người dùng thay đổi
//     const fetchHabits = async () => { // Hàm này sẽ được gọi để lấy danh sách thói quen

//       try{
//         const response = await databases.listDocuments(
//           DATABASE_ID, // ID của cơ sở dữ liệu
//           HABITS_COLLECTION_ID, // ID của bộ sưu tập
//           [Query.equal("user_id", user?.$id ?? "") ] // Lọc theo ID người dùng
//         ) // Gọi API để lấy danh sách tài liệu
//         setHabits(response.documents as unknown as Habit[]); // Lưu danh sách thói quen vào trạng thái
//       } catch (error) {
//         console.error("Lỗi khi lấy thói quen:", error); // In ra lỗi nếu có
//       }
//     }
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text variant="headlineSmall" style={styles.title}>Thói Quen Hằng Ngày</Text>
//           <Button mode = "text" onPress={signOut} icon="logout" >
//           Đăng xuất
//         </Button>
//         </View >
//         {habits?.length === 0 ? (
//           <View style={styles.emtyState}> 
//             <Text style={styles.emtyStateText}>Chưa có thói quen nào. Thêm thói quen đầu tiên của bạn </Text> 
//           </View>
//         ) : (
//           habits?.map((habit,key) =>
//             <Surface key={habit.$id} style={styles.card} >
//             <View key={key} style={styles.cardContent}> 
//               <Text style={styles.cardTitle}> {habit.title} </Text>
//               <Text style={styles.cardDescription}> {habit.description} </Text>
//             <View style={styles.cardFooter}>
//                 <View style={styles.streakBadge}> 
//                   <MaterialCommunityIcons name="fire" size={18} color={"#ff9800"} />
//                   <Text style={styles.streakText}>
//                     {habit.streak_count} Ngày Liên Tiếp
//                   </Text>
//                 </View>
//                 <View style={styles.frequencyBadge}>
//                   <Text style={styles.frequencyText}>
//                     {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             </Surface>
//            )
//         )}
//       </View>
//     );
    
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 16,
//       backgroundColor: "#f5f5f5",
      
//     },
//     header:{
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 24,
//     },
//     title: {
//       fontSize: 20,
//       fontWeight: "bold",
     
//     },
//     card: {
//       marginBottom: 18,
//       borderRadius: 18,
//       backgroundColor: "#f7f2fa",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.08,
//       shadowRadius: 8,
//       elevation: 4,
//     },
//     cardContent:{
//       padding: 20,
//     },
//     cardTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginBottom: 4,
//       color: "#22223b"
//     },
//     cardDescription: {
//       fontSize: 18,
//       marginBottom: 16,
//       color: "#6c6c80"
//     },
//     cardFooter: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//     },
//     streakBadge: {
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "#fff3e0",
//       borderRadius: 12,
//       paddingVertical: 4,
//       paddingHorizontal: 10,
//     },
//     streakText: {
//       marginLeft: 6,
//       color: "#ff9800",
//       fontWeight: "bold",
//       fontSize: 14,
//     },
//     frequencyBadge: {
//       backgroundColor: "#ede7f6",
//       borderRadius: 12,
//       paddingVertical: 4,
//       paddingHorizontal: 12,
//     },
//     frequencyText: {
//       color: "#7c4dff",
//       fontWeight: "bold",
//       fontSize: 14,
//     },
//     emtyState: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
      
//     },
//     emtyStateText: {
//       color: "#666666",
//     },
//   });
import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/api/appwrite";
import { useAuth } from "@/api/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, ScrollView, StyleSheet, View } from "react-native"; // Thêm DeviceEventEmitter
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth(); // Lấy hàm đăng xuất từ context
  const [habits, setHabits] = useState<Habit[]>([]); // Trạng thái để lưu danh sách thói quen
  const [completedHabits, setcompletedHabits] = useState<string[]> ([]); 
  const swipeableRef = useRef<{[key: string]: Swipeable | null}>({}); // Tham chiếu đến các thành phần Swipeable
  const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`; // Kênh để đăng ký nhận thông báo
  const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
  const fetchHabits = async () => { // Hàm này sẽ được gọi để lấy danh sách thói quen
    try {
      const response = await databases.listDocuments(
        DATABASE_ID, // ID của cơ sở dữ liệu
        HABITS_COLLECTION_ID, // ID của bộ sưu tập
        [Query.equal("user_id", user?.$id ?? "")] // Lọc theo ID người dùng
      ); // Gọi API để lấy danh sách tài liệu
      setHabits(response.documents as unknown as Habit[]); // Lưu danh sách thói quen vào trạng thái
    } catch (error) {
      console.error("Lỗi khi lấy thói quen:", error); // In ra lỗi nếu có
    }
  };
    // lấy ngày hiện tại 
  const fetchTodayCompletions = async () => { 
    try {
      const today = new Date(); 
      today.setHours(0,0,0,0); // ngày giờ... hiện tại
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? ""),
          Query.greaterThanEqual("completed_at", today.toISOString()),
        ]
      ); 
      const completions = response.documents as unknown as HabitCompletion[]
      setcompletedHabits(completions.map((c) => c.habit_id ));  
    } catch (error) {
      console.error("Lỗi khi lấy thói quen:", error); 
    }
  };
    useEffect(() => {
      if (user) {
        // Lắng nghe realtime cho Habits
        const habitsSubscription = client.subscribe(habitsChannel, (response: RealTimeResponse) => {
          if (
            response.events.includes("databases.*.collections.*.documents.*.create") ||
            response.events.includes("databases.*.collections.*.documents.*.update") ||
            response.events.includes("databases.*.collections.*.documents.*.delete")
          ) {
            fetchHabits();
          }
        });

        // Lắng nghe realtime cho Completions
        const completionsSubscription = client.subscribe(completionsChannel, (response: RealTimeResponse) => {
          if (
            response.events.includes("databases.*.collections.*.documents.*.create")
          
          ) {
            fetchTodayCompletions();
          }
        });

        // Lắng nghe sự kiện thêm mới habit từ AddHabitScreen
        const habitAddedListener = DeviceEventEmitter.addListener("habitAdded", () => {
          fetchHabits();
        });

        // Fetch ban đầu khi mount
        fetchHabits();
        fetchTodayCompletions();

        return () => {
          habitsSubscription();        // Hủy lắng nghe Habits
          completionsSubscription();   //  Hủy lắng nghe Completions
          habitAddedListener.remove(); // Hủy lắng nghe sự kiện thêm habit
        };
      }
    }, [user]);

  // Hàm để xoá thói quen
 const handleDeleteHabit = async (id: string) => {
  try {
    // Xoá ngay trong state trước
    setHabits((prev) => prev.filter((h) => h.$id !== id));

    // Gọi API xoá document
    await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
  } catch (error) {
    console.error("Lỗi khi xóa thói quen:", error);
    // Nếu xoá thất bại thì fetch lại để sync chính xác
    fetchHabits();
  }
};
// Hàm để đánh dấu thói quen đã hoàn thành (chưa sử dụng trong UI)
  const handleCompleteHabit = async (id: string) => {
    if(!user  || completedHabits?.includes(id)) return; // Kiểm tra nếu không có user thì không làm gì
    try{
      await databases.createDocument(DATABASE_ID, COMPLETIONS_COLLECTION_ID, ID.unique(), {
        // Giả sử bạn có một collection riêng để lưu thói quen đã hoàn thành
        // Bạn cần thay đổi COLLECTION_ID_COMPLETED_HABITS thành ID thực tế của bạn
        // Thêm các trường cần thiết để đánh dấu thói quen đã hoàn thành
        habit_id: id, // ID của thói quen đã hoàn thành
        user_id: user?.$id, // ID của người dùng
        completed_at: new Date().toISOString(), // Thời gian hoàn thành 
      });
       const habit = habits.find((h) => h.$id === id)
       if(!habit) return;  

       await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, 
        {
          streak_count: habit.streak_count + 1,
          last_completed: new Date().toISOString(), 
        }
       ) 
    } catch (error) {

    }
  }
  //state (mảng) chứa danh sách id của các habit đã hoàn thành hôm nay. 
  const isHabitCompleted = (habitId: string) => completedHabits?.includes(habitId); 

  const renderRightActions = (habitId: string) => (
    <View style = {styles.swipeableActionRight}>
      { isHabitCompleted(habitId) ?  (<Text>Hoàn Thành</Text>) :
      (<MaterialCommunityIcons 
      name="check-circle-outline" // Biểu tượng dấu tích
      size={32} 
      color={"#fff"}
      alignItems = {"center"} 
      
      />
      
      )}
    </View>
    
  ); // Chưa có hành động khi kéo sang trái
  
  
  const renderLeftActions = () => (
     <View style = {styles.swipeableActionLeft}>
      <MaterialCommunityIcons 
      name="trash-can-outline" // Biểu tượng thùng rác
      size={32} 
      color={"#fff"} 
      alignItems = {"center"} 
       />
    </View>
  ) // Chưa có hành động khi kéo sang phải

 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Thói Quen Hằng Ngày</Text>
        <Button mode="text" onPress={signOut} icon="logout">
          Đăng xuất
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}> 
      {habits?.length === 0 ? (
        <View style={styles.emtyState}>
          <Text style={styles.emtyStateText}>Chưa có thói quen nào. Thêm thói quen đầu tiên của bạn</Text>
        </View>
      ) : (
        habits?.map((habit, key) => (
          <Swipeable ref={(ref) => {
            swipeableRef.current[habit.$id] = ref; // Lưu tham chiếu đến thành phần Swipeable
            
          }} 
          key={key} // Đặt key cho Swipeable thay vì Surface
          overshootLeft={false} // Tắt hiệu ứng overshoot khi kéo sang trái
          overshootRight={false} // Tắt hiệu ứng overshoot khi kéo sang phải
          renderLeftActions={renderLeftActions} // Chưa có hành động khi kéo sang trái
          renderRightActions={() =>renderRightActions(habit.$id)} // Chưa có hành động khi kéo sang phải
          onSwipeableOpen={(direction) => {
              if(direction === "left") {
                handleDeleteHabit(habit.$id); // Gọi hàm xóa thói quen khi kéo sang trái
                } else if(direction === "right") {
                    handleCompleteHabit(habit.$id)
                }
                 swipeableRef.current[habit.$id]?.close(); // Đóng thẻ Swipeable sau khi xóa
              }
          } // Chưa có hành động khi mở Swipeable
          >
          <Surface key={habit.$id} style={[styles.card , isHabitCompleted(habit.$id) && styles.carCompleted]} >
            <View  style={styles.cardContent}>
              <Text style={styles.cardTitle}>{habit.title}</Text>
              <Text style={styles.cardDescription}>{habit.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons name="fire" size={18} color={"#ff9800"} />
                  <Text style={styles.streakText}>
                    {habit.streak_count} Ngày Liên Tiếp
                  </Text>
                </View>
                <View style={styles.frequencyBadge}>
                  <Text style={styles.frequencyText}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
          </Swipeable>
        ))
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 18,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emtyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emtyStateText: {
    color: "#666666",
  },
  swipeableActionRight:{
    justifyContent: "center",
    alignItems: "flex-end" ,
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
  swipeableActionLeft:{
    justifyContent: "center",
    alignItems: "flex-start" ,
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  carCompleted : {
    opacity: 0.6
  }
});