import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';

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
    const now = new Date();
    const pickupTime = new Date(ride.ride.pickupTime);
    const timeDiff = pickupTime.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <View>
      <TouchableOpacity style={styles.appointmentCard} onPress={() => setShowDetails(!showDetails)}>
        <View style={styles.dateSection}>
          <Text style={styles.dateNumber}>{Math.floor(Math.random() * 31) + 1} Mins</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.rideType}>Time Remaining: {getTimeRemaining()}</Text>
          <Text style={styles.driverName}>User: {ride.user.fullName}</Text>
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
          <Text>Price: ${ride.ride.price}</Text>
          <Text>Pickup Time: {new Date(ride.ride.pickupTime).toLocaleString()}</Text>
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
