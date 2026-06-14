import { Show, useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Show when="signed-out">
        <Text style={styles.title}>Branch Staff Portal</Text>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Staff Login</Text>
          </TouchableOpacity>
        </Link>
      </Show>

      <Show when="signed-in">
        <Text style={styles.title}>Staff Dashboard</Text>
        <Text style={styles.subtitle}>Manage orders, inventory, and menu.</Text>
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
    maxWidth: 400,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
