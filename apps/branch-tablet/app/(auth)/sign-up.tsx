import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign up error:", err?.message || err);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error("Verification failed with status:", completeSignUp.status);
      }
    } catch (err: any) {
      console.error("Verification error:", err?.message || err);
    }
  };

  return (
    <View style={styles.container}>
      {!pendingVerification && (
        <View>
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            placeholderTextColor="#9CA3AF"
            onChangeText={(email) => setEmailAddress(email)}
            style={styles.input}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            placeholderTextColor="#9CA3AF"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text>Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}> Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      )}
      {pendingVerification && (
        <View>
          <Text style={styles.title}>Verify Email</Text>
          <TextInput
            value={code}
            placeholder="Verification Code..."
            placeholderTextColor="#9CA3AF"
            onChangeText={(code) => setCode(code)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={onPressVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
});
