import {SafeAreaComponent} from "@/components/SafeArea";
import {View} from "react-native";
import Scanner from "@/components/Scanner";

export default function Scan(){
    return(
        <SafeAreaComponent children={
            <>
                <Scanner/>
            </>
        }/>
    )
}
