import React, { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon, CogIcon, ArrowRightCircleIcon, } from "react-native-heroicons/outline";
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherforecast } from "../../api/weather";
import { useTheme } from '../context/ThemeContext'
import { useTemperature } from "../context/TemperatureContext";

export default function HomeScreen({ navigation }) {
    const { isCelsius } = useTemperature();
    const [toggleSearch, setToggleSearch] = useState(false);
    const [locations, setLocations] = useState([1, 2, 3]);
    const [weather, setWeather] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLocation = (loc) => {
        console.log('location: ', loc);
        setLocations([]);
        setToggleSearch(false);
        fetchWeatherforecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
            console.log('forecast data retrieved', data);
        });
    };

    const { isLightTheme } = useTheme();

    const { current, location } = weather;

    const handleSearch = (val) => {
        if (val.length > 2) {
            fetchLocations({ cityName: val }).then(data => {
                console.log('locations retrieved: ', data);
                setLocations(data);
            });
        }
    };

    useEffect(() => {
        fetchWeatherData()}
        , []);
    const fetchWeatherData = async () => {
        fetchWeatherforecast({
            cityName: 'Calgary',
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
        });
    };

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            {loading ? (
                <View style={[styles.container, { backgroundColor: isLightTheme ? '#fff' : '#1f1f1f' }]}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <SafeAreaView style={[styles.safeArea, { backgroundColor: isLightTheme ? '#fff' : '#1f1f1f' }]}>
                        <TouchableOpacity 
                        style={styles.cogIcon}
                        onPress={() => {navigation.navigate('Settings')}}>
                                <CogIcon size={44} color={isLightTheme ? '#000' : '#fff'} />
                        </ TouchableOpacity>
                        <View style={styles.searchContainer}>
                            <View style={[styles.searchInputContainer, { backgroundColor: toggleSearch ? 
                                'rgba(255,255,255, 0.2)' : 'transparent' }]}>
                                {toggleSearch && (
                                    <TextInput
                                        onChangeText={handleTextDebounce}
                                        placeholder="Search city"
                                        placeholderTextColor={'lightgray'}
                                        style={[styles.searchInput, {color : isLightTheme ? '#000' : '#fff'}]}
                                    />
                                )}
                                <TouchableOpacity
                                    onPress={() => setToggleSearch(!toggleSearch)}
                                    style={styles.searchButton}
                                >
                                    <MagnifyingGlassIcon size="25" color="white" />
                                </TouchableOpacity>
                            </View>
                           
                        {locations.length > 0 && toggleSearch && (
                            <View style={styles.locationList}>
                                {locations.map((loc, index) => {
                                    let showBorder = index + 1 !== locations.length;
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleLocation(loc)}
                                            key={index}
                                            style={[styles.locationItem, showBorder && styles.locationItemBorder]}
                                        >
                                            <MapPinIcon size="20" color="gray" />
                                           
                                            <Text style={[styles.locationText, {color : isLightTheme ? '#000' : '#fff'}]}>{loc.name}, {loc.country}</Text>
   
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                    <View style={[styles.weatherInfoContainer, { backgroundColor: isLightTheme ? '#fff' : '#1f1f1f' }]}>
                        <Text style={[styles.locationName , {color: isLightTheme ? '#000' : '#fff' }]}>{location?.name}</Text>
                        <Text style={[styles.countryName , {color: isLightTheme ? '#000' : '#fff' }]}>{location?.country}</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: 'https:' + current?.condition?.icon }}
                                style={styles.weatherImage}
                            />
                        </View>
                        <View style={styles.temperatureContainer}>
                            <Text style={[styles.temperatureText , {color: isLightTheme ? '#000' : '#fff' }]}>{isCelsius ? current?.temp_c : current?.temp_f}&#176;</Text>
                            <Text style={styles.conditionText}>{current?.condition?.text}</Text>
                        </View>
                        <View style={styles.additionalInfoContainer}>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoText , {color: isLightTheme ? '#000' : '#fff' }]}>Wind:</Text>
                                <Text style={[styles.infoText , {color: isLightTheme ? '#000' : '#fff' }]}>{current?.wind_kph}km</Text>
                            </View>
                        <View style={styles.infoItem}>
                                <Text style={[styles.infoText , {color: isLightTheme ? '#000' : '#fff' }]}>Humidity:</Text>
                                <Text style={[styles.infoText , {color: isLightTheme ? '#000' : '#fff' }]}>{current?.humidity}%</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoText , {color: isLightTheme ? '#000' : '#fff' }]}>Sunrise:</Text>
                                <Text style={[styles.infoText , {color: isLightTheme ? '#000' : '#fff' }]}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                            </View>
                        </View>
                    </View>

                    {/* forecast for next days */}
                    <View style={styles.forecastContainer}>
                        <View style={styles.forecastHeader}>
                            <CalendarDaysIcon size="22" color='white' />
                            <Text style={[styles.forecastText , {color: isLightTheme ? '#000' : '#fff' }]}>Daily forecast</Text>
                            <ScrollView
                                horizontal
                                contentContainerStyle={styles.forecastScroll}
                            >
                                {weather?.forecast?.forecastday?.map((item, index) => {
                                    let date = new Date(item.date);
                                    let options = { weekday: 'long' };
                                    let dayName = date.toLocaleDateString('en-US', options).split(',')[0];
                                    return (
                                        <View
                                            key={index}
                                            style={styles.forecastItem}
                                        >
                                            <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={styles.forecastImage} />
                                            <Text style={styles.forecastDay}>{dayName}</Text>
                                            <Text style={styles.forecastTemp}>{isCelsius ? item?.day?.avgtemp_c : item?.day?.avgtemp_f}&#176;</Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',       
    },
    loadingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 32,
    },
    safeArea: {
        flex: 1,
    },
    searchContainer: {
        height: '7%',
        marginHorizontal: 16,
        position: 'relative',
        zIndex: 50,
        borderColor: 'black',
    },
    searchInputContainer: {
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 50,
        textAlign: 'center',
    },
    cogIcon :{
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 23,
        marginBottom: 20,
    },
    searchInput: {
        paddingLeft: 24,
        height: 40,
        fontSize: 16,
        color: 'white',
    },
    searchButton: {
        backgroundColor: 'black',
        padding: 8,
        margin: 4,
        borderRadius: 50,
    },
    locationList: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'gray',
        top: 64,
        borderRadius: 20,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    locationItemBorder: {
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
    },
    locationText: {
        color: 'black',
        fontSize: 18,
        marginLeft: 8,
    },
    weatherInfoContainer: {
        marginHorizontal: 16,
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    countryName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
    },
    imageContainer: {
        justifyContent: 'center',
    },
    weatherImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 130,
        
    },
    temperatureContainer: {
        marginVertical: 8,
        alignItems: 'center',
    },
    temperatureText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    conditionText: {
        fontSize: 20,
        color: 'white',
        letterSpacing: 1,
    },
    additionalInfoContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: 4,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        height: 24,
        width: 24,
    },
    infoText : {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginLeft: 4,
    },
    forecastContainer: {
        marginBottom: 8,
    },
    forecastHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 4,
    },
    forecastText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 4,
    },
    forecastScroll: {
        paddingHorizontal: 12,
    },
    forecastItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 120,
        borderRadius: 20,
        backgroundColor: 'gray',
        marginRight: 12,
    },
    forecastImage: {
        width: 40,
        height: 40,
    },
    forecastDay: {
        fontSize: 14,
        color: 'white',
        marginTop: 4,
    },
    forecastTemp: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});