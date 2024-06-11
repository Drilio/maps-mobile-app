import {BarcodeScanningResult, CameraView, useCameraPermissions} from 'expo-camera';
import {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View} from 'react-native';
import { useDebounce } from "@uidotdev/usehooks";

interface ProductProps {
    brands: string;
}

interface BrandInformation{
    product:ProductProps

}


export default function App() {
    const [facing, setFacing] = useState<'front'|'back'>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [serialNumber, setSerialNumber] = useState<string>();
    const [productData, setProductData ]= useState<ProductProps | null>();
    const debouncedSerialNumber= useDebounce(serialNumber, 200);

    const fetchProductData = async (serial: string): Promise<ProductProps | null> => {
        try {
            const response = await fetch(`https://FRA.openfoodfacts.org/api/v0/product/${serial}.json`);
            const data:BrandInformation = await response.json();
            console.log(data.product)
            return data.product;
        } catch (error) {
            console.error('Error fetching product data:', error);
            return null;
        }
    };

    useEffect(() => {
            console.log('useEffect()', debouncedSerialNumber)
        const getProductName = async () => {
            if (debouncedSerialNumber) {
                const data = await fetchProductData(debouncedSerialNumber)
                        if (data) {
                            console.log(data.brands)
                            setProductData(data);
                        }
            }
        }
        getProductName();
    }, [debouncedSerialNumber]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View>
                <View style={styles.container}>
                    <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} title="grant permission" />
                </View>
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleScan = (e:BarcodeScanningResult)=>{
        console.log(e.data)
        setSerialNumber(e.data)
    }

    return (
        <View style={styles.container}>
            {
                productData &&(
                    <View style={{height:20}}>
                        <Text>{productData!.brands}</Text>
                    </View>
                )
            }

            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={(e)=>handleScan(e)}
            >

            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    productContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 5,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
