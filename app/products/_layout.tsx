import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import FiltersDrawer from '@/components/FIltersDrawer';

export default function ProductsLayout() {
    
    return (<Drawer
        screenOptions={{
            drawerPosition: 'right',
            headerLeft: ({tintColor, canGoBack}) => (<Ionicons onPress={() => canGoBack ? router.back() : router.navigate('/')} color={tintColor} size={24} style={{
                paddingHorizontal: 16,
            }} name="arrow-back" />)
        }}
        drawerContent={() => {
            return <FiltersDrawer />
        }}>
            <Drawer.Screen
                name="index"
                options={{
                    title: 'Prodotti',
                }} />
        </Drawer>);
}
