import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTemperature } from '../context/TemperatureContext';

const SettingsScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { isCelsius, toggleTemperatureUnit } = useTemperature();
  const { isLightTheme, toggleTheme } = useTheme();


  return (
        <View style={[styles.container, { backgroundColor: isLightTheme ? '#fff' : '#1f1f1f' }]}>   
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isLightTheme ? '#000' : '#d1d5db' }]}>Temperature Units</Text>
            <View style={styles.optionRow}>
            <Text style={[styles.optionText, { color: isLightTheme ? '#000' : '#d1d5db' }]}>{isCelsius ? 'Celsius' : 'Fahrenheit'}</Text>
            <Switch
                value={isCelsius}
                onValueChange={toggleTemperatureUnit}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isLightTheme ? '#f4f3f4' : '#f4f3f4'}
              />
          </View>
    
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isLightTheme ? '#000' : '#d1d5db' }]}>Theme</Text>
            <View style={styles.themeRow}>
              <Text style={[styles.optionText, { color: isLightTheme ? '#000' : '#d1d5db' }]}>{isLightTheme ? 'Light' : 'Dark'}</Text>
              <Switch
                value={isLightTheme}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isLightTheme ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
        </View>
      );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f', 
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#d1d5db',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  checkboxSelected: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SettingsScreen;
