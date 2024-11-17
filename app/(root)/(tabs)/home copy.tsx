import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";

// Updated types
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
  <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
    <Text className="font-bold text-lg">{ride.user.fullName}</Text>
    <Text>Price: ₹{ride.ride.price}</Text>
    <Text>Status: {ride.ride.status}</Text>
    <Text>Pickup Address: {ride.ride.pickupAddress}</Text>
    <Text>Destination Address: {ride.ride.destinationAddress}</Text>
    <Text>Pickup Time: {ride.ride.pickupTime}</Text>
    <Text>Car Seats: {ride.ride.carSeats}</Text>
  </View>
);

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>('https://luru.onrender.com/v1/rides');
      console.log('response.....', response.data.results);
      setAllRides(response.data.results);
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
    <SafeAreaView className="bg-general-500 flex-1">
      <FlatList
        data={allRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.id}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {user?.firstName}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Your next tasks
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;