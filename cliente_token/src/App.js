import React, { Component } from 'react';
import firebase from 'firebase';
import axios from 'axios';

class App extends Component {

  state = {
    email:"",
    password:"",
    messageError:"",
    token:"",
    login:false
  }

  handleSubmit(event) {
    event.preventDefault();
    let {email,password} = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password).then((user)=>{

      let token_id =   firebase.auth().currentUser.getIdToken();
      debugger;
      console.log(token_id);
      var object = {
        correo:email
        }

        axios.post('https://us-central1-ditocodeexamples.cloudfunctions.net/createToken',
        object,{ headers: {'authorization': `${token_id}`}}
      ).then((response)=>{
        console.log(response.data);
      }).catch((error)=>{
        console.log(error);
      })
    }).catch((error)=>{

      var errorCode = error.code;
     
      if(errorCode === "auth/invalid-email"){
        this.setState({messageError:"Correo no válido."});
      }else if(errorCode === "auth/user-disabled"){
        this.setState({messageError:"Usuario inhabilitado."});
      }else if(errorCode === "auth/user-not-found"){
        this.setState({messageError:"Usuario no encontrado."});
      }else if(errorCode === "auth/wrong-password"){
        this.setState({messageError:"Password Incorrecto"});
      }


    });
    
  }

  handleChange(event) {
    let {name,value} = event.target;
    this.setState({[name]:value,messageError:""});
  }

  checkToken(event){
    event.preventDefault();
    let {token} = this.state;

    //Obtiene el id token por parte de google
    var token_id = firebase.auth().currentUser.getIdToken();

    console.log(token_id);

    

    alert(token);


  }


  renderForm(){
    if(!this.state.login){
      return (
        <div className="container-fluid">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                name="email" 
                value={this.state.email}
                onChange={this.handleChange.bind(this)}
                placeholder="Enter email" />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control"
                  name="password"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.password}
                 id="exampleInputPassword1" placeholder="Password" />
              </div>
              <div className="text-center">
                {this.state.messageError}
              </div>
              <input type="submit" value="Ingresar" className="btn btn-primary" />
          </form>
        </div>
      );
    }else{
      return(
      <div className="container-fluid">
            <form onSubmit={this.checkToken.bind(this)}>
              <div className="form-group">
                <label htmlFor="token">Token</label>
                <input type="text" className="form-control" id="token"
                name="token" 
                value={this.state.token}
                onChange={this.handleChange.bind(this)}
                placeholder="Ejemplo 123456" />
              </div>
              <div className="text-center">
                {this.state.messageError}
              </div>
              <input type="submit" value="Ingresar" className="btn btn-primary" />
          </form>
        </div>
      )
    }
  }

  render() {
    return(
      this.renderForm()
    )
  }
}

export default App;
