import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/api/appwrite";
import { useAuth } from "@/api/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

export default function StreakScreen() {
    const [habits, setHabits] = useState<Habit[]>([]); // Trạng thái để lưu danh sách thói quen
    const [completedHabits, setcompletedHabits] = useState<HabitCompletion[]> ([]); 
    const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`; // Kênh để đăng ký nhận thông báo
     const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
      const {user} = useAuth();
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
                      fetcCompletions();
                    }
                  });
          
                  // Lắng nghe sự kiện thêm mới habit từ AddHabitScreen
                  const habitAddedListener = DeviceEventEmitter.addListener("habitAdded", () => {
                    fetcCompletions();
                  });
          // Fetch ban đầu khi mount
          fetchHabits();
          fetcCompletions();  
          return () => {
            habitsSubscription()
            completionsSubscription() 
          }
        }
      }, [user]);


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
        const fetcCompletions = async () => { 
          try {
           
            const response = await databases.listDocuments(
              DATABASE_ID, 
              COMPLETIONS_COLLECTION_ID,
              [Query.equal("user_id", user?.$id ?? ""),
                
              ]
            ); 
            const completions = response.documents as unknown as HabitCompletion[]
            setcompletedHabits(completions);  
          } catch (error) {
            console.error("Lỗi khi lấy thói quen:", error); 
          }
        };

        interface StreakData {
          streak: number;
          bestStreak: number;
          total: number;
        }
        const getStreakData  = (habitId: string) : StreakData=>{ 
          const habitCompletions = completedHabits.filter((c) => 
        c.habit_id === habitId
        ).sort((a,b) => new Date(a.completed_at).getTime()- new Date(b.completed_at).getTime());
        if(habitCompletions?.length === 0) {
          return {streak: 0, bestStreak: 0, total: 0}
        };
        // Dữ liệu Buil Streak
        let streak = 0;
        let bestStreak = 0;
        let total = habitCompletions?.length;
        let lastDate: Date | null = null;
        let currentStreak = 0;
        habitCompletions?.forEach((c) => {
          const date = new Date(c.completed_at)
          if (lastDate) {
            const diff  = (date.getTime() - lastDate.getTime() / (1000 * 60* 60 *24));
            if(diff <= 1) {
              currentStreak += 1
            } else {
              currentStreak = 1
            }
          } else {
            currentStreak = 1;
          }
            if(currentStreak > bestStreak) bestStreak = currentStreak;
            streak = currentStreak;
            lastDate = date;
          
        })
        return {streak, bestStreak, total}
        };
        const habitStreaks = habits.map((habit) =>{
          const { streak,bestStreak, total} = getStreakData(habit.$id);
          return {habit,bestStreak, streak, total}
         })
         const rankedHabits = habitStreaks.sort((a,b) => b.bestStreak - a.bestStreak);
         const badgeStyles = [styles.badge1,styles.badge2,styles.badge3]
        
  return (
   <View  style = {styles.containel}>
    <Text  style = {styles.title} >Chuỗi Ngày Duy Trì Thói Quen</Text> 
      {rankedHabits.length > 0 && (
        <View style = {styles.rankingContainer}>
          <Text style = {styles.rankingTitle}>🏅 Chuỗi Ngày Kỷ Lục</Text>
          {rankedHabits.slice(0,3).map((item,key)=> (
            <View key={key} style = {styles.rankingRow}>
              <View style= {[styles.rankingBadge, badgeStyles[key]]}>
                <Text style = {styles.rankingBadgeText}>
                  {key + 1}
                </Text>
              </View>
              <Text style = {styles.rankingHabit}>{item.habit.title}</Text>
              <Text style = {styles.rankingStreak}>{item.bestStreak}</Text>
            </View>
          ))}
        </View>
      )}
      {habits.length === 0 ?(
        <View >
          <Text >Chưa có thói quen nào. Thêm thói quen đầu tiên của bạn</Text>
        </View>
      ) : (
         <ScrollView  showsVerticalScrollIndicator={false} >
        {rankedHabits.map(({habit,streak,bestStreak,total},key) => (
        <Card key={key} style = {[styles.card, key === 0 && styles.firsCard]}>
          <Card.Content >
            <Text variant="titleMedium" style = {styles.habitTitle}>{habit.title}</Text>
            <Text style = {styles.habitDescription}>{habit.description}</Text>
            <View style = {styles.statsRow}>
              <View style = {styles.statBadge}>
                <Text style = {styles.statBadgeText}>🔥 {streak}</Text>
                <Text style = {styles.statLabel}>Số Ngày </Text>
              </View>
              <View style = {styles.statBadgeGold}>
                <Text style = {styles.statBadgeText}>🏆 {bestStreak}</Text>
                <Text style = {styles.statLabel}>Chuỗi Ngày </Text>
              </View>
              <View style = {styles.statBadgeGreen}>
                <Text style = {styles.statBadgeText}>✅ {total}</Text>
                <Text style = {styles.statLabel}>Hoàn Thành</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
       </ScrollView>
      )}
     
   </View>
  );
}

const styles = StyleSheet.create({
containel: {
  flex: 1,
  backgroundColor: "#f5f5f5",
  padding : 14
  },
habitTitle: {
  fontWeight: "bold",
  fontSize: 18,
  marginBottom: 2
},
habitDescription: {
  color: "#6c6c80",
  marginBottom: 8
},
title:{
  fontWeight: "bold",
  marginBottom: 16
  
},
card: {
  marginBottom: 18,
  borderRadius: 18,
  backgroundColor: "#fff",
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: {width : 0, height : 2},
  shadowOpacity: 0.08,
  shadowRadius: 8,
  borderWidth: 1,
  borderColor: "#f0f0f0"
  },
  firsCard: {
    borderWidth: 2,
    borderColor: "#7c4dff"
  },
statsRow:{
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12,
  marginTop: 8
  },
statBadge: {
  backgroundColor: "#ffe0b2",
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 8,
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  marginRight: 2,

},
statBadgeText:{
  fontWeight: "bold",
  fontSize: 15,
  color: "#22223b"
},
statLabel:{
  fontSize: 11,
  color: "#888",
  marginTop: 2,
  fontWeight: "500"
},
statBadgeGold: {
  backgroundColor: "#fffde7",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  marginRight: 2,
  
  
},
statBadgeGreen:{
  backgroundColor: "#e8f5e9",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  marginRight: 4,
 
},
rankingContainer: {
  marginBottom: 24,
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 16,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: {width : 0, height : 2},
  shadowOpacity: 0.08,
  shadowRadius: 8,
  borderWidth: 1,
  borderColor: "#f0f0f0"
},
rankingTitle: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 12,
  color: "#7c4dff",
  letterSpacing: 0.5
},
rankingRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
  paddingBottom: 8,

},
rankingBadge:{
  width: 28,
  height: 28,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 10,
  backgroundColor: "#e0e0e0"
},
rankingBadgeText: {
  fontWeight: "bold",
  color: "#fff",
  fontSize: 15
},
rankingHabit: {
  flex: 1,
  fontSize: 15,
  color: "#333",
  fontWeight: "600"
},
rankingStreak:{
  fontSize: 14,
  color: " #7c4dff",
  fontWeight: "bold"
},
badge1: {
  backgroundColor: "#ffd700"
},
badge2: {
  backgroundColor: "#c0c0c0"
},
badge3: {
  backgroundColor: "#cd7f32"
}
})