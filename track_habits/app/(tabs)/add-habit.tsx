// import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
// import { useAuth } from "@/lib/auth-context";
// import { useRouter } from "expo-router";

// import { useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { ID } from "react-native-appwrite";
// import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";

// const FREQUENCY = ["Hằng Ngày", "Hằng Tuần", "Hằng Tháng"];
// type Frequency = (typeof FREQUENCY)[number]; // Định nghĩa kiểu cho tần suất
// export default function AddHabitScreen() {
//   // Hàm này sẽ được gọi khi người dùng nhấn nút "Thêm Thói Quen"
//   const [title, setTitle] = useState<String>("");// Trạng thái để lưu tiêu đề thói quen
//   const [description, setDescription] = useState<String>("");// Trạng thái để lưu mô tả thói quen
//   const [frequency, setFrequency] = useState<Frequency>("Hằng Ngày");// Trạng thái để lưu tần suất thói quen 
//   const {user} = useAuth(); // Lấy thông tin người dùng từ context
//   const router = useRouter(); // Sử dụng router để điều hướng
//   const [error, setError] = useState<string | null>(null); // Trạng thái để lưu lỗi nếu có
//   const theme = useTheme(); // Lấy theme hiện tại từ PaperProvider
//   const handleSubmit = async () => {
//       if (!user) return; // Kiểm tra xem người dùng đã đăng nhập hay chưa
//       try {
//       await databases.createDocument(
//         DATABASE_ID, // ID của cơ sở dữ liệu
//         HABITS_COLLECTION_ID, // ID của bộ sưu tập
//         ID.unique(), // Tạo ID duy nhất cho tài liệu
//         {
//           user_id: user.$id, // ID của người dùng
//           title, // Tiêu đề của thói quen
//           description, // Mô tả của thói quen
//           frequency,  // Tần suất của thói quen
//           streak_count: 0, // Số ngày liên tiếp đã hoàn thành thói quen
//           last_completed: new Date().toISOString(), // Ngày hoàn thành cuối cùng
//           create_at: new Date().toISOString(), // Ngày tạo thói quen
//         }
//       );
//      router.back(); // Quay lại trang trước đó sau khi thêm thói quen thành công
//     } catch (error) {
//       if(error instanceof Error) {
//         setError(error.message); // Lưu thông báo lỗi nếu có
//         return; // Dừng thực hiện nếu có lỗi
//       }
//       setError("Đã xảy ra lỗi khi thêm thói quen. Vui lòng thử lại sau."); // Thông báo lỗi chung nếu không phải là Error
//     }
//   } // Hàm này sẽ được gọi khi người dùng nhấn nút "Thêm Thói Quen"
//   return (
//    <View style={styles.container}>
//    <TextInput 
//    label="Tiêu Đề" 
//    mode="outlined" 
//    onChangeText={setTitle} 
//    style={styles.input}/> 

//    <TextInput 
//    label="Mô Tả" 
//    mode="outlined"
//    onChangeText={setDescription}
//    style={styles.input}/>  
//    <View style={styles.frequencyContainer}>
//     <SegmentedButtons 
//     value={frequency} // Giá trị hiện tại của tần suất
//     onValueChange={(value) => setFrequency(value as Frequency)} // Chuyển đổi giá trị sang kiểu Frequency
//     buttons={FREQUENCY.map((freq) => ({
//       value: freq,
//       label: freq,
//     }))}/>
   
//     </View>
//     <Button mode="contained" 
//     onPress={handleSubmit} // Hàm này sẽ được gọi khi người dùng nhấn nút "Thêm Thói Quen"
//     disabled={!title || !description} // Vô hiệu hóa nút nếu tiêu đề hoặc mô tả rỗng
//     > 
//       Thêm Thói Quen
//     </Button>
//     {error && <Text style={{ color: theme.colors.error }}> {error}</Text>}
//    </View> 
//   );
// }
// const styles = StyleSheet.create({
//   container: { 
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//   },
//   input: {
//     marginBottom: 16,
//   },
//   frequencyContainer: {
//     marginBottom: 24,
//   },
//   segmentedButtons: {
//     marginBottom: 16,
//   },
//   button: {
//     marginTop: 8,
    
//   },
// });
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/api/appwrite";
import { useAuth } from "@/api/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native"; // Thêm import
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";

const FREQUENCY = ["Hằng Ngày", "Hằng Tuần", "Hằng Tháng"];
type Frequency = (typeof FREQUENCY)[number]; // Định nghĩa kiểu cho tần suất
export default function AddHabitScreen() {
  // Hàm này sẽ được gọi khi người dùng nhấn nút "Thêm Thói Quen"
  const [title, setTitle] = useState<String>(""); // Trạng thái để lưu tiêu đề thói quen
  const [description, setDescription] = useState<String>(""); // Trạng thái để lưu mô tả thói quen
  const [frequency, setFrequency] = useState<Frequency>("Hằng Ngày"); // Trạng thái để lưu tần suất thói quen
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const router = useRouter(); // Sử dụng router để điều hướng
  const [error, setError] = useState<string | null>(null); // Trạng thái để lưu lỗi nếu có
  const theme = useTheme(); // Lấy theme hiện tại từ PaperProvider
  const handleSubmit = async () => {
    if (!user) return; // Kiểm tra xem người dùng đã đăng nhập hay chưa
    try {
      await databases.createDocument(
        DATABASE_ID, // ID của cơ sở dữ liệu
        HABITS_COLLECTION_ID, // ID của bộ sưu tập
        ID.unique(), // Tạo ID duy nhất cho tài liệu
        {
          user_id: user.$id, // ID của người dùng
          title, // Tiêu đề của thói quen
          description, // Mô tả của thói quen
          frequency, // Tần suất của thói quen
          streak_count: 0, // Số ngày liên tiếp đã hoàn thành thói quen
          last_completed: new Date().toISOString(), // Ngày hoàn thành cuối cùng
          create_at: new Date().toISOString(), // Ngày tạo thói quen
        }
      );
      DeviceEventEmitter.emit("habitAdded"); // Gửi sự kiện để thông báo cập nhật danh sách
      router.back(); // Quay lại trang trước đó sau khi thêm thói quen thành công
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Lưu thông báo lỗi nếu có
        return; // Dừng thực hiện nếu có lỗi
      }
      setError("Đã xảy ra lỗi khi thêm thói quen. Vui lòng thử lại sau."); // Thông báo lỗi chung nếu không phải là Error
    }
  }; // Hàm này sẽ được gọi khi người dùng nhấn nút "Thêm Thói Quen"
  return (
    <View style={styles.container}>
      <TextInput
        label="Tiêu Đề"
        mode="outlined"
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Mô Tả"
        mode="outlined"
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          value={frequency} // Giá trị hiện tại của tần suất
          onValueChange={(value) => setFrequency(value as Frequency)} // Chuyển đổi giá trị sang kiểu Frequency
          buttons={FREQUENCY.map((freq) => ({
            value: freq,
            label: freq,
          }))}
        />
      </View>
      <Button
        mode="contained"
        onPress={handleSubmit} // Hàm này sẽ được gọi khi người dùng nhấn nút "Thêm Thói Quen"
        disabled={!title || !description} // Vô hiệu hóa nút nếu tiêu đề hoặc mô tả rỗng
      >
        Thêm Thói Quen
      </Button>
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});