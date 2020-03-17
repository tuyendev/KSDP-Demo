import 'react-native-gesture-handler';
import React from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import DetailScreen from './src/DetailScreen';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'KSDP.db'});
const Stack = createStackNavigator();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        //setting default state
        this.state = {isLoading: true};
        this.arrayholder = [];

    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: 'Kháng sinh dự phòng',
                            headerStyle: {
                                backgroundColor: '#f4511e',
                            },
                            headerRight: () => (
                                <Button
                                    type="clear"
                                    icon={
                                        <Icon
                                            name="update"
                                            size={30}
                                            color="white"
                                        />
                                    }
                                    onPress={this.CreateOrUpdateDB}
                                />
                            ),
                        }}
                    />
                    <Stack.Screen name="Detail" component={DetailScreen}
                                  options={({route}) => ({title: route.params.title})}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    CreateOrUpdateDB() {


        //tao moi bang neu chua co
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists tbl_KSDP (id integer primary key not null, title text,detail text, updatetime text);',
            );
        });
        // lấy dữ liệu từ file json
        fetch('https://raw.githubusercontent.com/tungntdev/KSDP_Public_v1/master/KSDP_data.json')
            .then(response => response.json())
            .then(responseJson => {
                var string_cau_lenh;
                db.transaction(tx => {
                    for (var i = 0; i < responseJson.length; i++) {
                        tx.executeSql(
                            ' INSERT INTO tbl_KSDP (id,title,detail,updatetime) VALUES (?,?,?,?)', [responseJson[i].id, responseJson[i].title, responseJson[i].detail, responseJson[i].updatetime],
                        );
                    }
                    ;

                });


                // them moi du lieu

            })
            .catch(error => {
                console.error(error);
            });

        Alert.alert('Thông báo', 'Đã cập nhật thành công dữ liệu');
    }
}
