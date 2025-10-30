import { useAuth } from "@/api/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Snackbar, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Theo dõi trạng thái đăng ký
  const [email, setEmail] = useState<string>(""); // Lưu email
  const [password, setPassword] = useState<string>(""); // Lưu mật khẩu
  const [message, setMessage] = useState<string | null>(null); // Thông báo (lỗi hoặc thành công)
  const theme = useTheme(); 
  const router = useRouter(); 
const [snackbarVisible, setSnackbarVisible] = useState(false); 
// snackbarVisible: biến trạng thái (true/false) → cho biết Snackbar đang hiển thị hay không
// setSnackbarVisible: hàm để thay đổi giá trị của snackbarVisible
// useState(false): ban đầu gán giá trị mặc định = false (tức là Snackbar ẩn đi)
  const { singUp, signIn } = useAuth(); 
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const handleAuth = async () => {
    if (!email || !password) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (!gmailRegex.test(email)) {
        setMessage("Email không hợp lệ");
        return;
    }   
    
    setMessage(null);

    if (isSignUp) {
      const error = await singUp(email, password);
      if (error) {
        setMessage(error);
        return;
      }
      // Đăng ký thành công → chuyển sang đăng nhập
      setIsSignUp(false);
      setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
      setPassword(""); // reset mật khẩu cho an toàn
    } else {
      const error = await signIn(email, password); 
      console.log("Error khi đăng nhập:", error);
      // Gọi hàm đăng nhập (signIn) với email và password → nếu có lỗi sẽ trả về chuỗi thông báo (string),
      // còn nếu thành công thì error sẽ = null hoặc undefined
        if (error) {
          if (error.includes("password")) {
            setMessage("Mật khẩu không chính xác");
          } else {
            setMessage(error);
          }
          return;
        }
       console.log("Đăng nhập thành công → hiện Snackbar");
      setSnackbarVisible(true)
      // router.replace("/"); 
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
    setMessage(null); // reset thông báo khi chuyển form
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.container}
    >
      <View style={style.content}>
        <Text style={style.title}>
          {isSignUp ? "Tạo Tài Khoản!" : "Chào Mừng Trở Lại!"}
        </Text>

        <TextInput
          label="Email"
          placeholder="Email của bạn"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={style.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="Mật khẩu"
          placeholder="Mật khẩu của bạn..."
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={style.input}
          value={password}
          onChangeText={setPassword}
        />

        {message && (
          <Text
            style={{
              color: message.includes("thành công")
                ? theme.colors.primary
                : theme.colors.error,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {message}
          </Text>
        )}

        <Button style={style.button} mode="contained" onPress={handleAuth}>
          {isSignUp ? "Đăng Ký" : "Đăng Nhập"}
        </Button>

        <Button
          style={style.switchModeButton}
          mode="text"
          onPress={handleSwitchMode}
        >
          {isSignUp
            ? "Đã Có Tài Khoản? Đăng Nhập Ngay"
            : "Chưa Có Tài Khoản? Đăng Ký Ngay"}
        </Button>
      </View>
      {/* Snackbar thông báo */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "OK",
          onPress: () => {
            setSnackbarVisible(false);
            router.replace("/");
          },
        }}
      >
        Đăng nhập thành công!
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
