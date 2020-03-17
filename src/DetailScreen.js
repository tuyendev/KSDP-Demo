import React from 'react';
import {ScrollView} from 'react-native';
import HTMLView from 'react-native-htmlview';

function DetailScreen({route, navigation}) {
    var {_item} = route.params;
    navigation.setOptions({title: _item.title});
    const htmlContent = _item.detail;
    return (
        <ScrollView>
            <HTMLView value={htmlContent} renderNode={renderNode}/>
        </ScrollView>
    );
}

function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == 'iframe') {
        return null;
    }
}


export default DetailScreen;
