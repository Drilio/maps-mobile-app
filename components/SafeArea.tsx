import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ReactNode} from "react";

interface ISafeAreaProps {
    children: ReactNode;
}
export const SafeAreaComponent = ({ children }:ISafeAreaProps) => {
    const insets = useSafeAreaInsets();

    return(
        <View
            style={{
                flex: 1,
                // Paddings to handle safe area
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
        >
            {children}
        </View>
    )
}
