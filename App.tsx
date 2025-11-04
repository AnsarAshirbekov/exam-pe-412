import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function App() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getWeatherData = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=dee663a7adac8de1ba18e93c1cbc30cc&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherData("Astana");
  }, []);

  if (loading || !weather) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: "white", marginTop: 10 }}>Loading weather...</Text>
      </View>
    );
  }

  const date = new Date();
  const today = date.toLocaleString("en-US", { month: "short" }) + ", " + date.getDate();

  const myWeather = {
    city: weather.name,
    temp: weather.main?.temp ?? 0,
    descp: weather.weather?.[0]?.main ?? "Unknown",
    max: weather.main?.temp_max ?? 0,
    min: weather.main?.temp_min ?? 0,
    humidity: weather.main?.humidity ?? 0,
    wind: weather.wind?.speed ?? 0,
    rain: weather.rain?.["1h"] ?? 0,
    today,
    forecast: [
      { hour: "15:00", temp: -5, icon: "cloud-outline" },
      { hour: "16:00", temp: -6, icon: "cloudy-outline" },
      { hour: "17:00", temp: -7, icon: "snow-outline" },
      { hour: "18:00", temp: -8, icon: "snow-outline" },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="white" />
          <Text style={styles.city}>{myWeather.city}</Text>
        </View>
        <Ionicons name="notifications-outline" size={20} color="white" />
      </View>

      <View style={styles.mainTemp}>
        <Text style={styles.temp}>{myWeather.temp}º</Text>
        <Text style={styles.subtitle}>{myWeather.descp}</Text>
        <Text style={styles.minmax}>
          Max: {myWeather.max}º  Min: {myWeather.min}º
        </Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Ionicons name="water-outline" size={18} color="white" />
          <Text style={styles.infoText}>{myWeather.rain}%</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="thermometer-outline" size={18} color="white" />
          <Text style={styles.infoText}>{myWeather.humidity}%</Text>
        </View>
        <View style={styles.infoBox}>
          <FontAwesome5 name="wind" size={18} color="white" />
          <Text style={styles.infoText}>{myWeather.wind} km/h</Text>
        </View>
      </View>

      <View style={styles.todayInfo}>
        <View style={styles.today}>
          <Text style={styles.subtitle}>Today</Text>
          <Text style={styles.subtitle}>{myWeather.today}</Text>
        </View>
        <FlatList
          data={myWeather.forecast}
          keyExtractor={(item) => item.hour}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.hourBox}>
              <Text style={styles.hourTemp}>{item.temp}ºC</Text>
              <Ionicons name={item.icon as any} size={22} color="white" />
              <Text style={styles.hour}>{item.hour}</Text>
            </View>
          )}
        />
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#134CB5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#134CB5",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  city: {
    color: "white",
    fontSize: 16,
  },
  mainTemp: {
    alignItems: "center",
    marginVertical: 40,
  },
  temp: {
    color: "white",
    fontSize: 70,
    fontWeight: "300",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
  },
  minmax: {
    color: "white",
    opacity: 0.8,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    backgroundColor: "#0B42AB",
    borderRadius: 20,
    padding: 10,
  },
  infoBox: {
    alignItems: "center",
    flexDirection: "row",
  },
  infoText: {
    color: "white",
    marginLeft: 5,
  },
  hourBox: {
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
    width: 67,
    height: 110,
    justifyContent: "space-between",
  },
  hourTemp: {
    color: "white",
    fontSize: 16,
  },
  hour: {
    color: "white",
    marginTop: 4,
  },
  today: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  todayInfo: {
    backgroundColor: "#0B42AB",
    borderRadius: 20,
    padding: 10,
  },
});
