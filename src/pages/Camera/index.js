import React, { Component } from 'react';

import moment from "moment";
import tz from "moment-timezone"

import { StatusBar, Modal,StyleSheet,PermissionsAndroid,Alert,View,AsyncStorage } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';

import Geolocation from 'react-native-geolocation-service';

import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
 

 Geocoder.init("AIzaSyALsNIMzE2PQqjA6qbC-UZjbij6RamyONs", {language : "en"}); // set the language

import api from '../../services/api';

import {
  Container,
  AnnotationContainer,
  AnnotationText,
  NewButtonContainer,
  ButtonsWrapper,
  CancelButtonContainer,
  SelectButtonContainer,
  ButtonText,
  ModalContainer,
  ModalImagesListContainer,
  ModalImagesList,
  ModalImageItem,
  ModalButtons,
  CameraButtonContainer,
  CancelButtonText,
  ContinueButtonText,
  TakePictureButtonContainer,
  TakePictureButtonLabel,
  DataButtonsWrapper,
  MarkerContainer,
  MarkerLabel,
  Form,
  Input,

} from './styles';



export default class Camera extends Component {


  static navigationOptions = {
    header: null,
  };
  
  state = {

    newRealty: false,
    positionmodalOpened: false,
    cameraModalOpened: false,
    dataModalOpened: false,
   
   
    realtyData: {
      location:{
        latitude: -22.884987,
          longitude: -48.444139,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421},
      end:"",
      entrada:null,
      saida:null,
     
      
    },
  };
  
  

  handleNewRealtyPress = () => this.setState({ newRealty: !this.state.newRealty })

  handleNewPositionModalOpen = () => this.setState({ positionModalOpened: !this.state.positionModalOpened })



  handleNewCameraModalOpen = () => this.setState({ cameraModalOpened: !this.state.cameraModalOpened })

  handleCameraModalClose = () => this.setState({ cameraModalOpened: !this.state.cameraModalOpened })

  handleDataModalClose = () => this.setState({
    dataModalOpened: false,
    cameraModalOpened: false,
    positionmodalOpened:false,
    newRealty:false,
  
    realtyData:{
      end:"",
     entrada:null,
     saida:null
      
    }
  })

  
 TakeLocalization= async () => {
  
  const {realtyData} = this.state
  
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permissão de Localização',
              message: 'A aplicação precisa da permissão de localização.',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          
            Geolocation.getCurrentPosition(
              
              pos => {
                this.setState ({
                  positionmodalOpened:true,
                  realtyData:{
                  ... realtyData,
                  location:{
                    ... realtyData.locations,
                latitude:pos.coords.latitude,
                longitude: pos.coords.longitude,
                latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
                  } 
               } })
            
               },
               
              error => {
                console.log(error);
               
                Alert.alert('Houve um erro ao pegar a latitude e longitude.');
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge:10000 }
            )
          } else {
            Alert.alert('Permissão de localização não concedida');
          }
          
          //console.log(realtyData,this.state)
        } catch (err) {
          console.log(err);
         
        }     
       
        
}

  
 
      
     localEndereco = async () => {
      const {realtyData:{location}} = this.state
     
      const {realtyData} = this.state
      Geocoder.from(location)
      .then(json => {
         var address = json.results[0].formatted_address;
         this.setState({
          cameraModalOpened: true, 
          realtyData:{
          ...realtyData,
         end:"",
         ... realtyData.end,
         end:address
        }, 
        });
        
        console.log(realtyData)
     
      }) 
    .catch(error => console.warn(error));
    }     

  handleEntrada = async () => {
    const {realtyData} = this.state;
    const currentDate= new Date();
    //markedDate:moment.tz(new Date(),"America/Sao_Paulo").format("YYYY-MM-, h:mm:ss z");
    const today =currentDate
    const atual = moment.tz(today,"America/Sao_Paulo").format("YYYY-MM-DD, h:mm:ss A")
    //atual.tz('America/Sao_Paulo').format('ha z');
    if(realtyData.entrada == null){
    this.setState({
    
      realtyData:{
      ...realtyData,
     entrada:"",
     ... realtyData.entrada,
     entrada:atual 
    }, 
    });
    Alert.alert('Entrada anotada com sucesso')
  }else{
    Alert.alert('Voce ja anotou a entrada neste local,por favor anote sua saida')
  }
  console.log(this.state,today,atual)
  }
    handleSaida = async () => {
      const {realtyData} = this.state;
      
      const currentDate= new Date();
      const today = currentDate;
      const atual = moment.tz(today,"America/Sao_Paulo").format('YYYY-MM-DD, h:mm:ss  A ')
      //atual.tz('America/Sao_Paulo').format('ha z');
      if(realtyData.entrada != null){
      this.setState({
        dataModalOpened: true,
        realtyData:{
        ...realtyData,
       saida:"",
       ... realtyData.saida,
       saida:atual
      }, 
      
      });
      console.log(this.state.realtyData)
    }else{Alert.alert('Nao foi dada entrada em nenhum local')}
  }
  handleVoltar = async () => {
 const {realtyData} = this.state;   
 if(realtyData.entrada!= null){
   Alert.alert("Apos dar entrada nao e possivel cancelar os dados")
 }else{
   this.setState({
    dataModalOpened: false,
    cameraModalOpened: false,
    positionmodalOpened:false,
    newRealty:false,
   
    realtyData:{
      end:"",
     
      
    }
  })
 }
  };
  saveRealty = async () => {
    
    try {
      const {
        realtyData: {
          
          end,
          entrada,
          saida,
          
        }
      } = this.state;
      const response = await api.put('users')
    
     const newRealtyResponse = await api.post('/dados', {
        end,
        entrada,
        saida,
        user_id:response.data.id
      })
      console.log(response.data)
      this.setState({ newRealty: false });
      this.handleDataModalClose()
     
     
    } catch (err) {
      console.tron.log(err);
      
    }
  }
    
    renderConditionalsButtons = () => (
    
      !this.state.newRealty ? (
        <NewButtonContainer onPress={this.handleNewRealtyPress}>
          <ButtonText>Nova entrada/saida</ButtonText>
        </NewButtonContainer>
      ) : (
        <ButtonsWrapper>
          <SelectButtonContainer onPress={this.TakeLocalization}>
            <ButtonText>Selecionar localização</ButtonText>
          </SelectButtonContainer>
          <CancelButtonContainer onPress={this.handleNewRealtyPress}>
            <ButtonText>Cancelar</ButtonText>
          </CancelButtonContainer>
        </ButtonsWrapper>
      )
      
      
    )
    
  renderLocations = () => (
      <Modal
        visible={this.state.positionmodalOpened}
        transparent={false}
        animationType="slide"
        onRequestClose={this.cameraModalOpened}
      >
      <ModalContainer> 
       <MapView
      style={styles.map}
      region={{latitude: -22.884987,
        longitude: -48.444139,latitudeDelta: 0.0922,
      longitudeDelta: 0.0421}}
      >
     
    </MapView>
    </ModalContainer>

        
        <ModalContainer>
          <DataButtonsWrapper>
            <SelectButtonContainer onPress={this.handleNewCameraModalOpen}>
              <ButtonText>Enviar dados</ButtonText>
            </SelectButtonContainer>
            <CancelButtonContainer onPress={this.handleVoltar}>
              <ButtonText>Cancelar</ButtonText>
            </CancelButtonContainer>
             
            
          </DataButtonsWrapper>
      </ModalContainer>
      </Modal>
    )

    renderEntSaida = () => (
      <Modal
        visible={this.state.cameraModalOpened}
        transparent={false}
        animationType="slide"
        onRequestClose={this.dataModalOpened}
      >
      <ModalContainer>  
        <MapView
      style={styles.map}
      region={{latitude: -22.884987,
        longitude: -48.444139,latitudeDelta: 0.0922,
      longitudeDelta: 0.0421}}
      >
     
    </MapView>
    </ModalContainer>
        
       <ModalContainer> 
       <DataButtonsWrapper>
         <SelectButtonContainer onPress={this.handleEntrada}>
           <ButtonText>ENTRADA</ButtonText>
         </SelectButtonContainer>
         <CancelButtonContainer onPress={this.handleSaida}>
           <ButtonText>SAIDA</ButtonText>
         </CancelButtonContainer>
         
         <CancelButtonContainer onPress={this.handleVoltar}>
           <ButtonText>Cancelar</ButtonText>
         </CancelButtonContainer>
       </DataButtonsWrapper>
     </ModalContainer>
   </Modal>
       
      
    )


 

  renderDataModal = () => (
    <Modal
      visible={this.state.dataModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleDataModalClose}
    >
    
    <ModalContainer>
     <MapView
      style={styles.map}
      region={{latitude: -22.884987,
        longitude: -48.444139,latitudeDelta: 0.0922,
      longitudeDelta: 0.0421}}
      >
        </MapView>
        </ModalContainer>
     <ModalContainer>
        <DataButtonsWrapper>
          <SelectButtonContainer onPress={this.saveRealty}>
            <ButtonText>Enviar Dados</ButtonText>
          </SelectButtonContainer>
         
        </DataButtonsWrapper>
        
      </ModalContainer>
    </Modal>
    
  )

  render() {
    return (
      <Container>
       <StatusBar barStyle="light-content" /> 
       <MapView
      style={styles.map}
      region={{latitude: -22.884987,
        longitude: -48.444139,latitudeDelta: 0.0922,
      longitudeDelta: 0.0421}}
      >
     
    </MapView>
        {this.renderConditionalsButtons()}
        {this.renderLocations()}  
        { this.renderEntSaida() }
        { this.renderDataModal() }
      </Container>
    );
  }
}

Camera.navigationOptions = {
  tabBarLabel: 'ENVIAR DADOS',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="photo" size={20} color={tintColor} />
  ),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    
    height: '100%',
    width: '100%',
  },
  locationButton1: {
    backgroundColor: '#e74c3c',
    borderRadius: 150,
    marginTop: -50,
    marginRight: 20,
    width: 50,
    height: 50,
    alignSelf: "flex-end",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 8,
  },
});

