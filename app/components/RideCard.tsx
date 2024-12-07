import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";

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
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  navigateText: {
    marginLeft: 5,
    color: '#0066FF',
  },
  ridePreviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  ridePreviewText: {
    marginLeft: 5,
    color: '#0066FF',
  },
});

const RideCard = ({ ride }: { ride: any }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleNavigate = () => {
    const destination = encodeURIComponent(ride.ride.destinationAddress);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    Linking.openURL(url);
  };

  const handleRidePreview = () => {
    const origin = encodeURIComponent(ride.ride.pickupAddress);
    const destination = encodeURIComponent(ride.ride.destinationAddress);
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

  return (
    <View>
      <TouchableOpacity style={styles.appointmentCard} onPress={() => setShowDetails(!showDetails)}>
        <View style={styles.dateSection}>
          <Text style={styles.dateNumber}>{getTimeRemaining()}</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.rideType}>Time Remaining: {getTimeRemaining()}</Text>
          <Text style={styles.driverName}>Phone number : {ride.user.phoneNumber}</Text>
          <Text style={styles.price}>Pickup: {ride.ride.pickupAddress}</Text>
          <Text style={styles.price}>Destination: {ride.ride.destinationAddress}</Text>
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
      </TouchableOpacity>
      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text>Pickup Address: {ride.ride.pickupAddress}</Text>
          <Text>Destination Address: {ride.ride.destinationAddress}</Text>
          <Text>Final Date & Time: {ride.ride.finalDateTime}</Text>
          <TouchableOpacity style={styles.navigateButton} onPress={() => Linking.openURL(`tel:${ride.user.phoneNumber}`)}>
            <Ionicons name="call-outline" size={24} color="#0066FF" />
            <Text style={styles.navigateText}>Call User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
            <Ionicons name="navigate-outline" size={24} color="#0066FF" />
            <Text style={styles.navigateText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ridePreviewButton} onPress={handleRidePreview}>
            <Ionicons name="car-outline" size={24} color="#0066FF" />
            <Text style={styles.ridePreviewText}>Ride Preview</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RideCard;
