import * as React from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {Button, SearchBar} from 'react-native-elements';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'KSDP.db'});


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        //setting default state
        this.state = {isLoading: true, search: '', dataKSDP: []};

    }

    async componentDidMount() {
        const {search} = this.state;
        await this.fetchData(search);
    }

    async handleSearch(val) {
        this.setState({search: val});
        await this.fetchData(val);
    }

    fetchData(search) {
        search = search.toUpperCase();
        var query = 'SELECT * FROM tbl_KSDP WHERE title LIKE \'%' + search + '%\'';
        var params = [];
        db.transaction((tx) => {
            tx.executeSql(query, params, (tx, results) => {
                var temp = [];
                console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    console.log(temp);
                }

                this.setState({
                    dataKSDP: temp,
                });
            });

        });

        // db.transaction((tx) => {
        //   tx.executeSql("SELECT * FROM tbl_KSDP WHERE title LIKE '%" + search + "%'", [], (tx, results) => {
        //       console.log("Query completed");

        //     });
        // });

    }

    deleteData(id) {
        var query = 'DELETE FROM tbl_KSDP WHERE id = ?';
        var params = [id];
        db.transaction((tx) => {
            tx.executeSql(query, params, (tx, results) => {
                Alert.alert('Success', 'Thành công xoá dữ liệu');

            }, function (tx, err) {
                Alert.alert('Warning', 'Chưa xoá được dữ liệu' + err);
            });
        });
    }


    async handleDelete(id) {
        const {search} = this.state;
        await this.deleteData(id);
        this.fetchData(search);
    }

    handleAdd() {
        this.props.navigation.navigate('Add');
    }

    handleDetail(item) {
        //this.props.navigation.setParams('Detail', { id });
        this.props.navigation.navigate('Detail', {_item: item});
    }

    render() {
        // if (this.state.isLoading) {
        //   return (
        //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //       <Spinner color="green" />
        //     </View>
        //   );
        // }

        return (

            <View style={styles.viewStyle}>
                <SearchBar
                    round
                    searchIcon={{size: 24}}
                    onChangeText={(val) => this.handleSearch(val)}
                    onClear={(val) => this.handleSearch(val)}
                    placeholder="Nhập từ khoá cần tìm kiếm"
                    value={this.state.search}
                />
                <FlatList
                    data={this.state.dataKSDP}
                    ItemSeparatorComponent={this.ListViewItemSeparator}
                    //Item Separator View
                    renderItem={({item}) => (
                        // Single Comes here which will be repeatative for the FlatListItems
                        //<Text style={styles.textStyle}>{item.title}</Text>
                        <Button
                            style={styles.buttonitem}
                            title={item.title}
                            onPress={() => this.handleDetail(item)}
                        />
                    )}
                    enableEmptySections={true}
                    style={{marginTop: 10}}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>


        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white',
        marginTop: Platform.OS == 'ios' ? 0 : 0,
    },
    textStyle: {
        padding: 10,
    },
    buttonitem: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
});
