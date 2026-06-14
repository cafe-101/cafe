import { Show, useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Show when="signed-out">
        <Text style={styles.title}>Welcome to Cafe Customer Portal</Text>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </Show>

      <Show when="signed-in">
        <Text style={styles.title}>You are Signed In!</Text>
        <Text style={styles.subtitle}>Welcome back to Cafe.</Text>
        <TouchableOpacity style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </Show>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  secondaryButtonText: {
    color: "#4F46E5",
  },
});
