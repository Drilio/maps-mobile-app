import React, { useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaComponent } from "@/components/SafeArea";
import Maps from "@/components/Maps";
import { useDebounceCallback } from 'usehooks-ts';

interface IMapsProps {
    latitude:number,
    longitude:number,
}

interface FeatureCollection {
    type: string;
    version: string;
    features: Feature[];
}

interface Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
}

interface Geometry {
    type: string;
    coordinates: number[];
}

interface Properties {
    label: string;
    score: number;
    housenumber: string;
    id: string;
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    type: string;
    importance: number;
    street: string;
}

export default function HomeScreen() {
    const [text, setText] = useState('');
    const [apiResponse, setApiResponse] = useState<Feature[]>([]);
    const [suggestions, setSuggestions] = useState<Feature[]>([]);
    const [adress, setAdress] = useState<IMapsProps>(
        {
            latitude: 0,
            longitude: 0,
        }
    )
    const fetchAddressData = async (value: string) => {
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}`);
            const data: FeatureCollection = await response.json();
            if(data.features){
                setSuggestions(data.features);
            }
        } catch (error) {
            console.error('Error fetching address data:', error);
        }
    };

    const debouncedFetch = useDebounceCallback((value: string) => {
        fetchAddressData(value);
    }, 500);

    const handleChangeText = (value: string) => {
        setText(value);
        if(value.length > 3){
            debouncedFetch(value);
        }
    };

    const handleSuggestionPress = (suggestion: string) => {
        const mySugestion = suggestions.find(selectedSuggestions => {
            return selectedSuggestions.properties.label === suggestion
        })
        let coordinate={
            latitude: 0,
            longitude: 0,

        };
        if(mySugestion){
            coordinate ={
                latitude:mySugestion.geometry.coordinates[1],
                longitude:mySugestion.geometry.coordinates[0],
            }
            console.log('coordinate : ',coordinate)
        }

        setText(suggestion);
        setAdress(coordinate);
        setSuggestions([]);
    };


    return (
        <SafeAreaComponent children={
            <View style={styles.container}>
                <View>
                    <Text>Entrez une adresse :</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleChangeText}
                        value={text}
                    />
                </View>
                {suggestions.length > 0 && (
                    <ScrollView style={styles.suggestionsContainer}>
                        {suggestions.map((suggestion, index) => (
                            <Pressable key={index} onPress={() => handleSuggestionPress(suggestion.properties.label)}>
                                <Text style={styles.suggestionItem}>{suggestion.properties.label}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
                <View style={styles.mapContainer}>
                    <Maps latitude={adress.latitude} longitude={adress.longitude} />
                </View>
            </View>
        } />
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%',
    },
    mapContainer: {
        height: '80%',
        width: '100%',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    suggestionsContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 70,
        width: '100%',
        zIndex: 1,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
