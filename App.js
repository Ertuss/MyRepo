import React from "react";
import { View, Image,TouchableOpacity, ScrollView, 
  TextInput, Text, KeyboardAvoidingView, TouchableHighlight,
  StyleSheet, Button, Icon, AsyncStorage, BackHandler, ImageBackground  } from "react-native"; 
import { createStackNavigator, createAppContainer } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
const uuidv1 = require('uuid/v1');

class HomeScreen extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      toDo: "",
      chosenID: "",
      isEnableViews: [],
      items: [],
      idler: [],
    }
    this.deleteItem = this.deleteItem.bind(this);
    this.enableView = this.enableView.bind(this);
    this.importData = this.importData.bind(this);
  }

  async importData(isDone = false) 
  {
    this.setState({items: []});
    this.setState({isEnableViews: []});
    this.setState({idler: []});

    try {
      const value = await AsyncStorage.getAllKeys();

      for (let key of value) {

        var stringifyData = await AsyncStorage.getItem(key)
        var parseData = JSON.parse(stringifyData);

        if (parseData.ISDONE == isDone)
        {
          this.state.items.push(stringifyData)

          this.state.idler.push(parseData.ID);

        }
      }

      var bos = this.state.items;
      this.setState({items: bos})
    }
    catch (error) {
      alert(error + 'BUBİRERROR');
    }
    
  }

  doneToDo(index)
  {

    try
    {
      
      tamamlanacakId = this.state.idler[index];
      for(let item of this.state.items)
      {
        parseData = JSON.parse(item);
        if(tamamlanacakId == parseData.ID)
        {
          AsyncStorage.getItem(tamamlanacakId)
            .then( data => {

            data = JSON.parse( data );

            data.ISDONE = true;

            AsyncStorage.setItem(data.ID, JSON.stringify( data ) );

            }).done();
        }
        
      }
      this.importData();

    }
    catch(err)
    {
      alert('SİLME HATASI !\n'+ err);
    }

  }

  async deleteItem(index)
  {
    
    try{
      silinecekId = this.state.idler[index];
      for(let item of this.state.items)
      {
        parseData = JSON.parse(item);
        if(silinecekId == parseData.ID)
        {
          await AsyncStorage.removeItem(silinecekId);
          
        }
      }
      this.importData();
    }
    catch(err)
    {
      alert('SİLME HATASI !\n'+ err);
    }

  }  

  enableView(index)
  { 

    let a = this.state.isEnableViews.slice(); //creates the clone of the state

    if(a[index] == 'flex')
      a[index] = 'none';
    else
      a[index] = 'flex'

    this.setState({isEnableViews: a});

  }

  componentDidMount()
  {
    this.importData();
  }

  componentWillReceiveProps(nextProps) {
    this.importData();
  }


  renderNewItem(item, index)
  { 
    parseData= JSON.parse(item)
    return(
      <TouchableOpacity key={parseData.ID} onPress={() => this.enableView(this.state.items.indexOf(item))} style={{backgroundColor: 'grey',marginBottom: 10, borderRadius:10}}>
    <View style={{flexDirection: 'row', padding: 10, height: 'auto', borderRadius: 10,
     backgroundColor: '#004f85',}}>
                <View style={{flex:4, flexDirection:'column'}}>
                
                <View style={{flex:4}}>
                  <Text style={{fontSize:15, color: '#fff', fontWeight: 'bold', textAlign:'left'}}>                  
                      {
                        parseData.KONU
                      }
                  </Text>
                  <Text style={{fontSize:11, color: '#fff', marginBottom: 10, marginTop:10, textAlign:'left'}}>            
                      {
                        parseData.ACIKLAMA
                      }
                  </Text>
                  <Text style={{fontSize:11, color: '#fff', textAlign: 'left'}}>            
                      {
                        parseData.BTARIHI_GUN + '.' + parseData.BTARIHI_AY + '.' + parseData.BTARIHI_YIL
                      }
                  </Text>
                  </View>

                <View display={this.state.isEnableViews[index]}  style={{flexDirection:'row', flex:1 }}>              

                  <View style={{flex:1, height: 40, borderRadius:5, justifyContent:'center', marginTop:10, marginRight: 6,
                shadowColor: "#000",shadowOffset: {width: 0,height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22, elevation: 3,}}>

                    <TouchableOpacity onPress={() => this.doneToDo(index)} style={{borderRadius: 5, backgroundColor: '#5e838f',
                    color:"#5e838f", height:'100%', justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{alignContent: 'center', justifyContent: 'center', color: '#fff'}}>TAMAMLA</Text>
                    </TouchableOpacity>

                  </View>

                  <View style={{flex:1, borderRadius:5, justifyContent:'center', marginTop:10, marginRight: 3,marginLeft:3, shadowColor: "#000",
                    shadowOffset: {width: 0,height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22,elevation: 3,}}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddToDo', { users: this.state.idler[index] })  }  
                    style={{borderRadius: 5, backgroundColor: '#5e838f',
                    color:"#5e838f", height:'100%',shadowOffset:{  width: 10,  height: 10,  },
                    shadowColor: 'black',
                    shadowOpacity: 1.0, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{alignContent: 'center', justifyContent: 'center', color: '#fff'}}>DÜZENLE</Text>
                    </TouchableOpacity>

                  </View>

                  <View style={{flex:1, borderRadius:5, justifyContent:'center', marginTop:10, marginLeft: 6, shadowColor: "#000",
                    shadowOffset: {width: 0,height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22,elevation: 3,}}>

                    <TouchableOpacity onPress={() => this.deleteItem(index)} style={{borderRadius: 5, backgroundColor: '#5e838f',
                    color:"#5e838f", height:'100%', justifyContent: 'center', alignItems: 'center', marginLeft: 3}}>
                      <Text style={{alignContent: 'center', justifyContent: 'center', color: '#fff'}}>SİL</Text>
                    </TouchableOpacity>

                  </View>

                </View>

                </View>
            </View>
            </TouchableOpacity>
            )
  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My ToDos</Text>
          {/* <View style={{flex:4}}>
            <TextInput placeholder={this.error_msg} ref={this.myRef} value={this.state.toDo} 
            onChangeText={(v) => this.setState({toDo: v})} style={{height:'100%', backgroundColor:'#fff', 
             flexDirection: 'row'}} 
          multiline={true}/>
          </View>
          <View style={{flex:1, justifyContent:'center'}}>
            <Button onPress={this.addItem} color="#841584"  title="+"/>
          </View> */}
        </View>
        
        <View style={{flex:9, marginTop:10}}>
        <ScrollView>

            {
              this.state.items.map((item,index)=> 
                (this.state.isEnableViews.push('none'),
                this.renderNewItem(item, index)),
              )
            }

        </ScrollView>
        </View>


        <View style={styles.footer}>
          <View style={[styles.footerButtons, {marginRight:5}]}>
            <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('AddToDo')}>
              <Text style={styles.fullWidthButtonText}> EKLE</Text>
            </TouchableHighlight>
          </View>
          <View style={[styles.footerButtons, {marginLeft:5}]}> 
            <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('Done')}>
              <Text style={styles.fullWidthButtonText}>BİTMİŞ</Text>
            </TouchableHighlight>

          </View>
        </View>
      </View>
    );
  }
}

class AddToDoScreen extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      date: "",
      buttonText: "",
      jsonData: {
        ID:'',
        KONU: '',
        ACIKLAMA: '',
        BTARIHI_YIL:'',
        BTARIHI_AY:'',
        BTARIHI_GUN:'',
        ISDONE: false,
      },
    }; 
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.addToDoList = this.addToDoList.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate("Home", { users: '' })
    return true;
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  
  handleDatePicked = date => {

    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();

    theDate = day + '.' + month + '.' + year ;

    this.setState({ date: theDate });

    this.state.jsonData.BTARIHI_GUN = day;
    this.state.jsonData.BTARIHI_AY = month;
    this.state.jsonData.BTARIHI_YIL = year;

    this.hideDateTimePicker();

  };

  async addToDoList(){

    var o = this.state.jsonData;

    o.ID = uuidv1().toString();
    o.ISDONE = false;

    if (!(o.ID && o.KONU && o.ACIKLAMA && o.BTARIHI_GUN && o.BTARIHI_AY && o.BTARIHI_YIL && o.ISDONE != null))
    {
      alert('Lütfen (*) işaretli alanların tümünü doldurunuz.');
      //alert(o.ID + '\nKONU : ' +  o.KONU + '\nACIKLAMA : ' +   o.ACIKLAMA + '\nDate : ' +  o.BTARIHI_AY + '\nISDONE : ' +  o.ISDONE)
    } 
    else
    {
      try {
        await AsyncStorage.setItem(o.ID, JSON.stringify(o));
        alert('Yeni göreviniz başarıyla eklenmiştir.');

        this.refs["txtInput1"].setNativeProps({text:""});
        o.KONU = '';
        this.refs["txtInput2"].setNativeProps({text:""});
        o.ACIKLAMA = '';
        this.refs["txtInput3"].setNativeProps({text:""});
        this.state.date = '';

      } catch (error) {
        alert(error + ' | KAYIT ERROR');
      }
    }

  }
  
  async updateItem(itemId)
  {

    try
    {
      await AsyncStorage.getItem(itemId).then( data => {
              var o = this.state.jsonData;
              if (!(o.ID && o.KONU && o.ACIKLAMA && o.BTARIHI_GUN && o.BTARIHI_AY && o.BTARIHI_YIL && o.ISDONE))
              {
                AsyncStorage.setItem(itemId, JSON.stringify( o ) );
              }}).done();

      alert("Güncelleme işlemi tamamlandı.");
      this.props.navigation.navigate('Home', { user: '' });
    }
    catch(err)
    {
      alert('Güncellenmesi istenen item id bulunamadı !\n'+ err);
    }

  }

  componentDidMount()
  {
    this.fillWithUpdate();
  }

  async fillWithUpdate()
  {
      const { navigation } = this.props;
      const itemId = navigation.getParam('users');

      if(itemId)
      {
      this.setState({buttonText: "DÜZENLE"})
        
      var item = await AsyncStorage.getItem(itemId);
      item = JSON.parse(item);

      this.state.jsonData.ID = item.ID;

      this.refs["txtInput1"].setNativeProps({text:item.KONU});
      this.state.jsonData.KONU = item.KONU;
      this.refs["txtInput2"].setNativeProps({text:item.ACIKLAMA});
      this.state.jsonData.ACIKLAMA = item.ACIKLAMA;

      var date = item.BTARIHI_GUN + '.' + item.BTARIHI_AY + '.' + item.BTARIHI_YIL;
        
      this.state.jsonData.BTARIHI_GUN = item.BTARIHI_GUN;
      this.state.jsonData.BTARIHI_AY = item.BTARIHI_AY;
      this.state.jsonData.BTARIHI_YIL = item.BTARIHI_YIL;
      this.state.jsonData.ISDONE = item.ISDONE;

      this.setState({date: date});
      
      }
      else
      {
        this.setState({buttonText: "Ekle"})
      }
  }
  
  render()
  {
    const { navigate } = this.props.navigation;

    var o = this.state.jsonData;

    const { navigation } = this.props;
    const itemId = navigation.getParam('users');

    return(
      <KeyboardAvoidingView style={styles.container} >
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          minimumDate={new Date()}
        />

        <View style={styles.header}>
          <Text style={styles.title}>My ToDos | Görev Ekle </Text>
        </View>

         <View style={{flex:1}}>
          <ScrollView style={{flex:1}}>

          <View style={{borderRadius: 5}}>

                <TextInput ref="txtInput1" onChangeText={(v) => o.KONU = v} style={{backgroundColor:'transparent', 
                borderBottomColor:'#fff', color:'#fff',borderRadius:5, paddingRight:10, paddingLeft:10,
                backgroundColor:'#5e838f', marginTop:10, fontSize:15 }} 
                 placeholderTextColor="#f5f5f5" placeholder="(*) Konu">
                </TextInput>
                
                <TextInput ref="txtInput2" onChangeText={(k) => o.ACIKLAMA = k}  style={{backgroundColor:'transparent', 
                borderBottomColor:'#fff',height: 100,color:'#fff',borderRadius:5, paddingRight:10, paddingLeft:10,
                 backgroundColor:'#5e838f', marginTop:10, fontSize:15 }} 
                 placeholderTextColor="#f5f5f5" textAlignVertical={'top'} multiline={true} placeholder="(*) Açıklama">
                </TextInput>
                
                <TouchableOpacity onPress={this.showDateTimePicker} style={{flex:1,  marginTop:10, borderRadius:5,}}>
                  <TextInput ref="txtInput3" value={this.state.date} editable={false} style={{backgroundColor:'transparent', 
                  borderBottomColor:'#fff',color:'#fff',borderRadius:5, paddingRight:10, paddingLeft:10,
                  backgroundColor:'#5e838f', fontSize:15 }} 
                  placeholderTextColor="#f5f5f5" placeholder="(*) Tahmini bitiş tarihi">
                  </TextInput>
                </TouchableOpacity>
                {/*  { if(!itemId) { this.addToDoList() } else { alert("this.updateItem(itemId)") } } */}
                <TouchableOpacity onPress={() => { if(!itemId) { this.addToDoList() } else { this.updateItem(itemId) } }} style={{flex:1, height: 60, alignItems: 'center',  
                backgroundColor:'#0e72e0', marginTop:10, marginBottom:10, borderRadius:5, justifyContent:'center'}}>
                  <Text style={{color:'#fff', fontSize:15, paddingBottom:10, paddingTop:10}}>{this.state.buttonText}</Text>
                </TouchableOpacity>

          </View>

        </ScrollView>

        </View>
      </KeyboardAvoidingView>
    );
    
  }  
}

class DoneScreen extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      toDo: "",
      chosenID: "",
      isEnableViews: [],
      items: [],
      idler: [],
    }
    this.deleteItem = this.deleteItem.bind(this);
    this.enableView = this.enableView.bind(this);
    this.importData = this.importData.bind(this);
  }


  async importData(isDone = true) 
  {
    this.state.items = [];
    this.state.isEnableViews = [];
    this.state.idler = [];
    
    try {
      const value = await AsyncStorage.getAllKeys();

      if(value.length > 0)
      for (let key of value) {

        var stringifyData = await AsyncStorage.getItem(key)
        var parseData = JSON.parse(stringifyData);

        if(parseData.ISDONE == isDone)
        {
          this.state.items.push(stringifyData)

          this.state.idler.push(parseData.ID);

        }
      }

      let tempItems = this.state.items.slice();
      this.setState({items: tempItems})
    }
    catch (error) {
      alert(error + 'BUBİRERROR');
    }
    
  }

  async deleteItem(index)
  {
    
    try{
      silinecekId = this.state.idler[index];
      for(let item of this.state.items)
      {
        parseData = JSON.parse(item);
        if(silinecekId == parseData.ID)
        {
          await AsyncStorage.removeItem(silinecekId);
          
        }
      }
      this.importData();
    }
    catch(err)
    {
      alert('SİLME HATASI !\n'+ err);
    }

  }  

  enableView(index)
  { 

    let a = this.state.isEnableViews.slice(); //creates the clone of the state

    if(a[index] == 'flex')
      a[index] = 'none';
    else
      a[index] = 'flex'

    this.setState({isEnableViews: a});

  }

  componentDidMount()
  {
    this.importData();
  }

  componentWillReceiveProps(nextProps) {
    this.componentDidMount();
  }


  renderNewItem(item, index)
  { 
    
    parseData= JSON.parse(item)
    return(
      <TouchableOpacity key={parseData.ID} onPress={() => this.enableView(this.state.items.indexOf(item))} style={{backgroundColor: 'grey',marginBottom: 10, borderRadius:10}}>
    <View style={{flexDirection: 'row', padding: 10, height: 'auto', borderRadius: 10,
     backgroundColor: '#004f85',}}>
                <View style={{flex:4, flexDirection:'column'}}>
                
                <View style={{flex:4}}>
                  <Text style={{fontSize:15, color: '#fff', fontWeight: 'bold', textAlign:'left'}}>                  
                      {
                        parseData.KONU
                      }
                  </Text>
                  <Text style={{fontSize:13, color: '#fff', marginBottom: 10, marginTop:10, textAlign:'left'}}>            
                      {
                        parseData.ACIKLAMA
                      }
                  </Text>
                  <Text style={{fontSize:13, color: '#fff', textAlign: 'left'}}>            
                      {
                        parseData.BTARIHI_GUN + '.' + parseData.BTARIHI_AY + '.' + parseData.BTARIHI_YIL
                      }
                  </Text>
                  </View>

                <View display={this.state.isEnableViews[index]}  style={{flexDirection:'row', flex:1 }}>              

                  <View style={{flex:1, height: 40, borderRadius:5, justifyContent:'center', marginTop:10,
                shadowColor: "#000",shadowOffset: {width: 0,height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22, elevation: 3,}}>

                    <TouchableOpacity onPress={() => this.deleteItem(index)} style={{borderRadius: 5, backgroundColor: '#5e838f',
                    color:"#5e838f", height:'100%', justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{alignContent: 'center', justifyContent: 'center', color: '#fff'}}>SİL</Text>
                    </TouchableOpacity>

                  </View>

                </View>

                </View>
            </View>
            </TouchableOpacity>
            )
  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      
      <View style={styles.container}>
      
        <View style={styles.header}>
          <Text style={styles.title}>My ToDos | Bitmiş Görevler</Text>
        </View>
        
        <View style={{flex:9, marginTop:10}}>
        <ScrollView>

            {
              this.state.items.map((item,index)=> 
                (this.state.isEnableViews.push('none'),
                this.renderNewItem(item, index)),
              )
            }

        </ScrollView>
        </View>


        {/* <View style={styles.footer}>
          <View style={[styles.footerButtons, {marginRight:5}]}>
            <TouchableHighlight style={styles.fullWidthButton} onPress={() => navigate('AddToDo')}>
              <Text style={styles.fullWidthButtonText}>YENİ EKLE</Text>
            </TouchableHighlight>
          </View>
          <View style={[styles.footerButtons, {marginLeft:5}]}> 
            <TouchableHighlight style={styles.fullWidthButton} onPress={this.buttonPressed}>
              <Text style={styles.fullWidthButtonText}>BİTMİŞ GÖREVLER</Text>
            </TouchableHighlight>

          </View>
        </View> */}

      </View>
    );
  }
}

const AppContainer = createStackNavigator(
  {
  Home: { screen: HomeScreen },
  AddToDo: { screen: AddToDoScreen },
  Done: { screen: DoneScreen },
  }, 
  {
    navigationOptions: {},
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName : "Home"
  }
)

const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:'#ebebeb',
    paddingRight: 10,
    paddingLeft: 10,
  },
  textInput:{
    alignSelf: "stretch",
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  title:
  {
    fontSize: 18,
    color: '#fff',
    textAlign: "center",
    alignItems: "center"
  },
  header:{
    height: 60,  
    backgroundColor: '#555',
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center'
  },
  footer:
  {
    height: 80, 
    flexDirection:'row', 
    paddingTop:10, 
    paddingBottom:10
  },
  footerButtons:
  {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: "bold",
    borderRadius: 5,
  },
  fullWidthButton: {
    backgroundColor: '#0e72e0',
    shadowColor: "#000",shadowOffset: {width: 0,height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22, elevation: 3,
    width: '100%',
    height: '100%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullWidthButtonText: {
    fontSize:15,
    color: '#fff',
  },
  btn :{
    alignSelf: "stretch",
    backgroundColor: '#71D692',
    padding: 10,
    alignItems: 'center'
  }
});

export default createAppContainer(AppContainer);
