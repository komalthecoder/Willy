import React from 'react';
import { StyleSheet, Text, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import BookTransactionScreen from './screens/BookTransactionScreen';
import SearchScreen from './screens/SearchScreen';

export default class App extends React.Component {

  render(){
    
    return(
      <AppContainer/>
    );
    
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction: {screen: BookTransactionScreen},
  Search: {screen: SearchScreen}
},

{
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({}) => {
      const routeName = navigation.state.routeName
      if(routeName === 'Transaction'){
        return(
          <Image
          source = {require('./assets/book.png')}
          style = {{ width:40, height:40 }}></Image>
        )
      }
      else if(routeName === 'Search'){
        return(
          <Image
          source = {require('./assets/search.png')}
          style = {{ width:40, height:40 }}></Image>
        )
      }
    }
  })
})

const AppContainer = createAppContainer(TabNavigator)