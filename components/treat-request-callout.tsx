import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TreatRequestCalloutProps = {
  visible: boolean;
  title: string;
  isActive: boolean;
  onClose: () => void;
  onTreat: () => void;
  onTrick: () => void;
};

export function TreatRequestCallout({ 
  visible,
  title, 
  isActive, 
  onClose, 
  onTreat,
  onTrick 
}: TreatRequestCalloutProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Pressable style={styles.modalBackground} onPress={onClose}>
          <Pressable style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.title}>{title}</Text>
            
            {!isActive ? (
              <Text style={styles.inactiveText}>This house is not giving treats right now</Text>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.treatButton]} 
                  onPress={onTreat}
                >
                  <Ionicons name="gift-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Treat</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.trickButton]} 
                  onPress={onTrick}
                >
                  <Ionicons name="star-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Trick</Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 300,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    paddingRight: 24,
  },
  inactiveText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  treatButton: {
    backgroundColor: '#FF7A1C',
  },
  trickButton: {
    backgroundColor: '#6B4EFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});