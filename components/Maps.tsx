import React, {useEffect, useState} from 'react';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

interface IMapsProps {
        latitude:number,
        longitude:number,
}
const coordinates = [
    {
        latitude:45.186106,
        longitude:5.755217,
    },
    {
        latitude:45.186792,
        longitude:5.753253,
    },
    {
        latitude:45.187256,
        longitude:5.753752,
    },
    {
        latitude:45.186860,
        longitude:5.755617,
    },
    {
        latitude:45.187030,
        longitude:5.754781,
    },
    {
        latitude:45.186576,
        longitude:5.754298,
    }
]

const polygonCoordinate = [
    {
        latitude:45.185017,
        longitude:5.750183,
    },
    {
        latitude:45.185928,
        longitude:5.750719,
    },
    {
        latitude:45.185569,
        longitude:5.752028,
    },
    {
        latitude:45.184521,
        longitude:5.752033,
    }
]

const bottomRCoordinate = [
    {
        latitude:45.184521,
        longitude:5.752033,
    },
    {
        latitude: 45.183924,
        longitude: 5.754163,
    }
]

const diagRCoordinate = [
    {
        latitude:45.184521,
        longitude:5.752033,
    },
    {
        latitude:45.184846,
        longitude:5.754592,
    }
]

export default function Maps({latitude,longitude}:IMapsProps) {
const [placeToBe,setPlateToBe] = useState<any>({
    latitude:latitude ? latitude:0,
    longitude:longitude ? longitude : 0,
})
    useEffect(()=>{
        console.log(placeToBe)
        setPlateToBe({
            latitude,
            longitude
        })
},[latitude,longitude])

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: coordinates[0].latitude,
                    longitude: coordinates[0].longitude,
                    latitudeDelta:0.0622,
                    longitudeDelta:0.0121,
                }}
                region={{
                    latitude: placeToBe.latitude,
                    longitude: placeToBe.longitude,
                    latitudeDelta:0.0622,
                    longitudeDelta:0.0121,
                }}
            >
                <Polyline
                    coordinates={coordinates}
                    strokeColor="#000"
                    strokeColors={['#7F0000']}
                    strokeWidth={6}
                />
                <Polygon
                    coordinates={polygonCoordinate}
                    strokeColor="#000"
                    strokeWidth={6}
                    fillColor='#ff0000'
                />
                <Polyline
                    coordinates={bottomRCoordinate}
                    strokeColor="#000"
                    strokeColors={['#7F0000']}
                    strokeWidth={6}
                />
                <Polyline
                    coordinates={diagRCoordinate}
                    strokeColor="#000"
                    strokeColors={['#7F0000']}
                    strokeWidth={6}
                />
                {
                    latitude !== 0 && longitude !== 0 &&(
                <Marker coordinate={{...placeToBe}} />
                    )
                }
            </MapView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
