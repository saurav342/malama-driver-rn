import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { router } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { images } from "@/constants";
import { useLocationStore } from "@/store";

type Ride = {
  id: string;
  user: {
    fullName: string;
    email: string;
  };
  ride: {
    status: string;
    registrationNumber?: string;
    pickupAddress: string;
    destinationAddress: string;
    price: number;
    pickupTime: string;
    carSeats: number;
  };
  payment: {
    status: string;
    amount: number;
  };
};

type ApiResponse = {
  results: Ride[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

const RideCard = ({ ride }: { ride: Ride }) => (
  <View style={styles.appointmentCard}>
    <View style={styles.dateSection}>
      {/* <Text style={styles.dateType}>Live Ride</Text> */}
      {/* <Text style={styles.dateNumber}>{new Date(ride.ride.pickupTime).getDate()}</Text> */}
      {/* <Text style={styles.dateMonth}>{new Date(ride.ride.pickupTime).toLocaleString('default', { month: 'short' })}</Text> */}
      <Text style={styles.dateNumber}>{Math.floor(Math.random() * 31) + 1} Mins</Text>

    </View>
    <View style={styles.detailsSection}>
      <Text style={styles.rideType}>Ride to {ride.ride.destinationAddress.split(',')[0]}</Text>
      <Text style={styles.driverName}>{ride.user.fullName}</Text>
      <Text style={styles.price}>Since {Math.floor(Math.random() * 100) + 1} Days</Text>
      <View style={styles.timeSection}>
        <Text style={styles.time}>{new Date(ride.ride.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <TouchableOpacity>
          <Text style={styles.appointmentLink}>Ride Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity style={styles.bellIcon}>
      <Ionicons name="notifications-outline" size={24} color="#999" />
    </TouchableOpacity>
  </View>
);

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [liveRides, setLiveRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>('http://13.48.149.128:3000/v1/rides');
      console.log('response.....', response.data.results);
      setAllRides(response.data.results);
      // Filter live rides
      const filteredLiveRides = response.data.results.filter(ride => ride.ride.status.toLowerCase() === 'live');
      setLiveRides(filteredLiveRides);
    } catch (err) {
      setError('Failed to fetch rides');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={liveRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  style={styles.noResultImage}
                  resizeMode="contain"
                />
                <Text style={styles.noResultText}>No live rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="large" color="#0066FF" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Welcome Suresh D{user?.firstName}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.signOutButton}
              >
                <Ionicons name="log-out-outline" size={24} color="#0066FF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Live Rides</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultImage: {
    width: 160,
    height: 160,
  },
  noResultText: {
    fontSize: 16,
    marginTop: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  signOutButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  dateSection: {
    backgroundColor: '#0066FF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  dateType: {
    color: 'white',
    fontSize: 12,
  },
  dateNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: 'white',
    fontSize: 14,
  },
  detailsSection: {
    flex: 1,
  },
  rideType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  driverName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timeSection: {
    marginTop: 10,
  },
  time: {
    fontSize: 12,
    color: '#0066FF',
  },
  appointmentLink: {
    color: '#0066FF',
    fontSize: 12,
    marginTop: 5,
  },
  bellIcon: {
    marginLeft: 'auto',
  },
});

export default Home;