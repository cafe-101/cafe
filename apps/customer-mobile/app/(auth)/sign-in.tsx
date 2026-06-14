import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || err?.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} nativeID="clerk-captcha">
      <Text style={styles.title}>Welcome Back</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        accessibilityLabel="Email address"
        accessibilityHint="Enter your email address"
        accessibilityRole="keyboardkey"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        placeholderTextColor="#9CA3AF"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={styles.input}
      />
      <TextInput
        accessibilityLabel="Password"
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
        style={styles.button} 
        onPress={onSignInPress}
        disabled={loading}
        accessibilityLabel="Sign in button"
        accessibilityHint="Submits your credentials"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity
            accessibilityLabel="Sign up link"
            accessibilityHint="Goes to the sign up page"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}> Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
