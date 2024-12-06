import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
});

const RideCard = ({ ride }: { ride: any }) => (
  <View style={styles.appointmentCard}>
    <View style={styles.dateSection}>
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



export default RideCard;
