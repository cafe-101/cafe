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
  const [error, setError] = React.useState("");
  const [loadingSignUp, setLoadingSignUp] = React.useState(false);
  const [loadingVerify, setLoadingVerify] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoadingSignUp(true);
    setError("");
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || err?.message || "Failed to sign up.");
    } finally {
      setLoadingSignUp(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoadingVerify(true);
    setError("");
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || err?.message || "Failed to verify email.");
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <View style={styles.container} nativeID="clerk-captcha">
      {!pendingVerification && (
        <View>
          <Text style={styles.title}>Create Account</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
            accessibilityRole="keyboardkey"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            placeholderTextColor="#9CA3AF"
            onChangeText={(email) => setEmailAddress(email)}
            style={styles.input}
          />
          <TextInput
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password"
            accessibilityRole="keyboardkey"
            value={password}
            placeholder="Password..."
            placeholderTextColor="#9CA3AF"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            style={styles.input}
          />
          <TouchableOpacity 
            accessibilityLabel="Sign up button"
            accessibilityHint="Submits your information to create an account"
            accessibilityRole="button"
            style={styles.button} 
            onPress={onSignUpPress}
            disabled={loadingSignUp}
          >
            <Text style={styles.buttonText}>{loadingSignUp ? "Creating Account..." : "Sign Up"}</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text>Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity
                accessibilityLabel="Navigate to sign in"
                accessibilityHint="Goes to the sign in screen"
                accessibilityRole="button"
              >
                <Text style={styles.linkText}> Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      )}
      {pendingVerification && (
        <View>
          <Text style={styles.title}>Verify Email</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            accessibilityLabel="Verification code input"
            accessibilityHint="Enter the verification code sent to your email"
            accessibilityRole="keyboardkey"
            value={code}
            placeholder="Verification Code..."
            placeholderTextColor="#9CA3AF"
            onChangeText={(code) => setCode(code)}
            style={styles.input}
          />
          <TouchableOpacity 
            accessibilityLabel="Verify button"
            accessibilityHint="Submits your verification code"
            accessibilityRole="button"
            style={styles.button} 
            onPress={onPressVerify}
            disabled={loadingVerify}
          >
            <Text style={styles.buttonText}>{loadingVerify ? "Verifying..." : "Verify"}</Text>
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
  errorText: {
    color: "#EF4444",
    marginBottom: 15,
    textAlign: "center",
  },
});
