import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main, //qual componente vai ser reenderizado 
            navigationOptions:{ //opções especificas dessa tela
                title: 'Dev Radar'
            },
        },
        Profile: {
            screen: Profile,
            navigationOptions:{ //opções especificas dessa tela
                title: 'Perfil no GitHub'
            },
        },
    }, {
        defaultNavigationOptions:{ // opções de navegação para todas as telas
            headerTintColor: '#fff', //cor da fonte do cabeçalho
            headerBackTitleVisible: null,
            headerStyle:{ //estilização para o cabeçalho
                backgroundColor: '#7D40E7',
            }
        }
    })
);

export default Routes;