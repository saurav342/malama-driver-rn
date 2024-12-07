import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";
import SwipeButton from 'rn-swipe-button';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  completeRideButton: {
    backgroundColor: '#0066FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 40,
    width: 200,
  },
  completeRideText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  navigateText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  ridePreviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  ridePreviewText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

const RideCard = ({ ride }: { ride: any }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [swipeStatusMessage, setSwipeStatusMessage] = useState('');
  const [isRideCompleted, setIsRideCompleted] = useState(false);

  const handleNavigateToPickup = () => {
    const pickup = `${ride.ride.userLatitude},${ride.ride.userLongitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pickup}`;
    Linking.openURL(url);
  };

  const handleNavigateToDestination = () => {
    const destination = `${ride.ride.destinationLatitude},${ride.ride.destinationLongitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    Linking.openURL(url);
  };

  const handleRidePreview = () => {
    const origin = `${ride.ride.userLatitude},${ride.ride.userLongitude}`;
    const destination = `${ride.ride.destinationLatitude},${ride.ride.destinationLongitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    Linking.openURL(url);
  };

  const getTimeRemaining = () => {
    const now = moment();

    // Ensure ride and ride.ride.finalDateTime exist
    if (!ride || !ride.ride.finalDateTime) {
      console.error("Invalid ride or finalDateTime");
      return "Invalid data";
    }

    try {
      // Assuming finalDateTime is like "10th December 2024 06:07 AM"
      const finalDateTime = moment(ride.ride.finalDateTime, "Do MMMM YYYY hh:mm A", true);

      // Check if the date is valid
      if (!finalDateTime.isValid()) {
        console.error("Invalid date format in finalDateTime");
        return "Invalid date";
      }

      // Calculate the difference in milliseconds
      const timeDiff = finalDateTime.diff(now);

      // Check if the time is in the past
      if (timeDiff <= 0) {
        return "Time has passed";
      }

      // Get the duration
      const duration = moment.duration(timeDiff);
      const days = Math.floor(duration.asDays());
      const hours = Math.floor(duration.asHours()) % 24;
      const minutes = duration.minutes();

      return `${days}d ${hours}h ${minutes}m`;
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Error occurred";
    }
  };

  const updateSwipeStatusMessage = (message: string) => {
    // setSwipeStatusMessage(message);
    Alert.alert(message);
  };

  const completeRide = async () => {
    console.log('.....ride.......', ride);
    const rideId = ride._id; // Assuming ride ID is available in the ride object
    const token = await AsyncStorage.getItem('authToken');
    const url = `http://13.48.149.128:3000/v1/rides/complete/ride/${rideId}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('response..ok...', response);
      if (response.ok) {
        Alert.alert('Ride completed successfully!');
        setIsRideCompleted(true);
      } else {
        Alert.alert('Failed to complete ride');
      }
    } catch (error) {
      Alert.alert('An error occurred while completing the ride');
    }
  };

  return (
    <View>
      {!isRideCompleted && (
        <TouchableOpacity style={styles.appointmentCard} onPress={() => setShowDetails(!showDetails)}>
          <View style={styles.dateSection}>
            <Text style={styles.dateNumber}>{getTimeRemaining()}</Text>
          </View>
          <View style={styles.detailsSection}>
            <Text style={styles.rideType}>Time Remaining: {getTimeRemaining()}</Text>
            <Text style={styles.driverName}>Name : {ride.user.name}</Text>
            <Text style={styles.driverName}>Phone number : {ride.user.phoneNumber}</Text>
            <Text style={styles.price}>Pickup: {ride.ride.pickupAddress}</Text>
            <Text style={styles.price}>Destination: {ride.ride.destinationAddress}</Text>
            <View style={styles.timeSection}>
              <Text style={styles.time}>{ride.ride.finalDateTime}</Text>
              <TouchableOpacity>
                <Text style={styles.appointmentLink}>Ride Details →</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications-outline" size={24} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      {showDetails && !isRideCompleted && (
        <View style={styles.detailsContainer}>
          <Text>Pickup Address: {ride.ride.pickupAddress}</Text>
          <Text>Destination Address: {ride.ride.destinationAddress}</Text>
          <Text>Final Date & Time: {ride.ride.finalDateTime}</Text>
          <TouchableOpacity style={styles.navigateButton} onPress={() => Linking.openURL(`tel:${ride.user.phoneNumber}`)}>
            <Ionicons name="call-outline" size={24} color="#0066FF" />
            <Text style={styles.navigateText}>Call User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToPickup}>
            <Ionicons name="navigate-outline" size={24} color="#0066FF" />
            <Text style={styles.navigateText}>Navigate to Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToDestination}>
            <Ionicons name="navigate-outline" size={24} color="#0066FF" />
            <Text style={styles.navigateText}>Navigate to Destination</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ridePreviewButton} onPress={handleRidePreview}>
            <Ionicons name="car-outline" size={24} color="#0066FF" />
            <Text style={styles.ridePreviewText}>Ride Preview</Text>
          </TouchableOpacity>
          <SwipeButton
            onSwipeSuccess={completeRide}
            railBackgroundColor="#0066FF"
            thumbIconBackgroundColor="#FFFFFF"
            title="Complete Ride"
            titleColor="#FFFFFF"
          />
        </View>
      )}
    </View>
  );
};

export default RideCard;
