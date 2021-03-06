
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


import Profile from './pages/Profile';
import Camera from './pages/Camera';


export default (signedIn = false) => createAppContainer(
  createSwitchNavigator(
    {
    Sign: createSwitchNavigator({
      SignIn,
      SignUp,
      
      
      
    }),
    App: createBottomTabNavigator(
    {
      
      Profile,
      Camera
      
    },
    
   
    {
      tabBarOptions: {
        KeyboardHidesTabBar: true,
        activeTintColor: '#FFF',
        inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        style: {
          backgroundColor: '#8d41a8',
        },
      },
    }
    ),
  }, {
    initialRouteName: signedIn ?  'App' : 'Sign' 
  }),
);