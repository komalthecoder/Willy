import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config.js';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal',
        transactionMessage : ''
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
      
    }

    handleTransaction = () => {
      var transactionMessage = null;
      db.collection('Books').doc(this.state.scannedBookId).get()
        .then((doc)=>
        {
          var book = doc.data()

          if(Books.bookAvailability){
              this.initiateBookIssue();
              transactionMessage = "Book Issued"
          }
          else{
            this.initiateBookReturn();
            transactionMessgae = "Book Returned"
          }
         })  
         
         this.setState({
           transactionMessage : transactionMessage
         })
      
    }


initiateBookReturn = async ()=>{
//adding the document to the transaction collection
db.collection("Transaction").add({
  'studentID' : this.state.scannedStudentId,
  'bookID' : this.state.scannedBookId,
  'date' : firebase.firestore.TimeStamp.now.toDate(),
  'transactionType': "return"
})

//changes in Books collection to set availability to false
db.collection('Books').doc(this.state.scannedBookId).update({
'bookAvailability': true
})

//incrementing the number of books issued for the student
db.collection('Students').doc(this.state.scannedStudentId).update({
'booksIssued' : firebase.firestore.FieldValue.increment(-1) 
})

this.setState ({
scannedStudentId : '',
scannedBookId : ''
})
}

initiateBookIssue = async ()=>{
  //adding the document to the transaction collection
  db.collection("Transaction").add({
    'studentID' : this.state.scannedStudentId,
    'bookID' : this.state.scannedBookId,
    'date' : firebase.firestore.TimeStamp.now.toDate(),
    'transactionType': "issue"
  })

  //changes in Books collection to set availability to false
db.collection('Books').doc(this.state.scannedBookId).update({
  'bookAvailability': false
})

//incrementing the number of books issued for the student
db.collection('Students').doc(this.state.scannedStudentId).update({
  'booksIssued' : firebase.firestore.FieldValue.increment(1) 
})

this.setState ({
  scannedStudentId : '',
  scannedBookId : ''
})
}

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(

          <KeyboardAvoidingView style = {styles.container} behavior = "padding" enabled>

            <View>
              <Image
                source={require("../assets/book.png")}
                style={{width:200, height: 200}}/>
              <Text style={{textAlign: 'center', fontSize: 30}}>Wily</Text>
            </View>

            <View style={styles.inputView}>
            <TextInput 
              style = {styles.inputBox}
              placeholder = "Book Id"
              onChangeText = {text => this.setState({scannedBookId: text})}
              value = {this.state.scannedBookId}/>
            <TouchableOpacity 
              style = {styles.scanButton}
              onPress = {() => {
                this.getCameraPermissions("BookId")
              }}>
              <Text style = {styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.inputView}>
            <TextInput 
              style = {styles.inputBox}
              placeholder="Student Id"
              onChangeText = {text => this.setState({scannedStudentId: text})}
              value = {this.state.scannedStudentId}/>
            <TouchableOpacity 
              style = {styles.scanButton}
              onPress = {() => {
                this.getCameraPermissions("StudentId")
              }}>
              <Text style = {styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity style = {styles.submitButton} 
              onPress = {async()=>{this.handleTransaction}}>
                <Text style = {styles.submitButtonText}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
            
          </KeyboardAvoidingView>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    submitButton:{
      backgroundColor: "blue",
      width: 100,
      height: 50
    },
    submitButtonText:{
      padding: 10,
      textAlign: 'center',
      fontSize: 20,
      color: 'yellow'
    }
  });