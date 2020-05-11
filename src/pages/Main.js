import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'; 

import api from '../services/api';

function Main({ navigation }){
    //estado que armazena os devs
    const [devs, setDevs] = useState([]);
    //estado de declaração para pegar a localização do usuario
    const [currentRegion, setCurrentRegion] = useState(null);
    //armazena os dados do input
    const [techs, setTechs] = useState('');
    
    useEffect(() => {
        //função que vai carregar a posição inicial do mapa
        async function loadInitialPosition(){       
        //pergunta pro usuario se ele permite pegar a localização dele se sim então adciona a mesma na variavel location
        const { granted } = await requestPermissionsAsync();
            if (granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true, //pega a localização pelo GPS ativado
                });            
            //pega da localização do usuario atraves da função coords a latitude e a longitude
        const { latitude, longitude } = coords;
            
            setCurrentRegion({
               latitude,
               longitude,
               latitudeDelta: 0.04, //para calculo do zoom no mapa
               longitudeDelta: 0.04, 
            });
          }
        }
        loadInitialPosition(); //chama a função logo a baixo da execução dela para logo executar
        
    }, []);

    //carrega dos desenvolvedores da api
    async function loadDevs() {
        const{ latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
           params:{
               latitude,
               longitude,
               techs
           },
        }); 
    
    setDevs(response.data.devs);        
    }

    //Preenche o estado da regiao toda vez que o usuario mexer no mapa
    function handleRegionChanged(region){
        setCurrentRegion(region);
    }

    //só vai carregar alguma coisa quando for possivel pegar a localização do usuario
    if(!currentRegion){
        return null;
    }

    return (
    <>
        <MapView 
            onRegionChangeComplete={handleRegionChanged} // reenderiza quando o usuario muda de lugar
            initialRegion={currentRegion} 
            style={styles.map}
        >
            {devs.map(dev =>(
               console.log(dev),
               <Marker 
                    key={dev._id} //sempre que usa map tem que usar no primeiro elemento logo depois do map com identificador unico
                    coordinate={{ 
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1]
                    }}
                >       
                <Image 
                    style={styles.avatar} 
                    source={{ uri: dev.avatar_url}} 
                />   

                <Callout onPress={() => {
                    //navegação para a pasta de perfil do usuario
                    navigation.navigate('Profile', {github_username: dev.github_username});
                }}>
                    <View style={styles.callout}>
                        <Text style={styles.devName}>{dev.name}</Text>
                        <Text style={styles.devBio}>{dev.bio}</Text>
                        <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                    </View>
                </Callout>
                </Marker>
            ))} 
        </MapView> 

   <View style={styles.searchForm}>
        <TextInput style={styles.searchInput}
                   placeholder="Buscar devs por techs..."
                   placeholderTextColor="#999"
                   autoCapitalize = "words" //Primeira letra de cada palavra em caixa alta
                   autoCorrect={false}
                   value={techs}
                   onChangeText={setTechs}
        />  
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
            <MaterialIcons name="my-location" size={20} color="#FFF"/>
        </TouchableOpacity>      
   </View>  
   </>
   );
}

const styles = StyleSheet.create({
    map:{
        flex: 1
    },
    avatar:{
      width:54,
      height:54,  
      borderRadius:4,
      borderWidth:4,
      borderColor: '#fff'
    },
    callout:{
        width:260,
    },
    devName:{
        fontWeight: 'bold',
        fontSize:16,
    },
    devBio:{
        color: '#666',
        marginTop: 5,
    },
    devTechs:{
        marginTop: 5,
    },
    searchForm:{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
   },
    searchInput:{
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000', //sombra ios
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,  //sombra android
            
    },
    loadButton:{
        width:50,
        height:50,
        backgroundColor:'#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
});

export default Main;