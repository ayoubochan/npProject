import React, {Component} from 'react'
import './index.scss'
import deconnexionLogo from '../../assets/deconnexion.png'
import {Link} from 'react-router-dom'

class Pannel extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmation: '',
      status: '',
      avatar: '',
      type: ''
    }
  }

  componentDidMount() {
    fetch('/status')
    .then(res => res.json())
    .then(data => {
      if(data !== 'false') {
        this.setState({
          firstName: data.firstName,
          lastName: data.lastName,
          status: 'connected',
          avatar: data.avatar,
          type: data.type
        })
      } else {
        this.setState({
          status: 'not connected'
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.status !== this.state.status) {
      if(this.refs.firstname) {
        console.log(this.refs.lastname)
        this.refs.firstname.value = ''
        this.refs.lastname.value = ''
      }
      if(this.refs.email) {
        this.refs.email.value = ''
        this.refs.password.value = ''
      }
    }
  }

  register(e) {
    e.preventDefault()
    if(this.state.password === this.state.confirmation && this.state.password != '') {
      fetch('http://www.localhost:8080/register',
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(
          this.state
          ),
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('Compte ajouté avec succes')
        } else {
          console.log('Cette adresse Email est déjà utilisée')
        }
      });
    }
    
  }

  connect(e) {
    e.preventDefault()
    fetch('http://www.localhost:8080/connect',
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(
        this.state
        ),
    })
    .then((res) => {
      if (res.status === 200) {
        console.log('Connecté avec succes', res)
        return res.json()
      } else {
        console.log('Email ou mot de passe incorrect')
        return null
      }
    })
    .then(data => {
      if(data !== null && data !== undefined) {
        console.log(data)
        this.setState({
          firstName: data.firstName,
          lastName: data.lastName,
          status: 'connected',
          avatar: data.avatar,
          type: data.type
        })
      }
    })
  }

  deconnect() {
    fetch('/deconnect',
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(
        this.state
        ),
    })
    .then(res => {
      if(res.status === 200) {
        this.setState({
          email: '',
          password: '',
          status: 'not connected'
        })
      }
    })
  }

  toRegistration(e) {
    e.preventDefault()
    this.setState({
      status: 'not registered'
    })
    this.emptyState()
  }

  toConnexion(e) {
    e.preventDefault()
    this.setState({
      status: 'not connected'
    })
    this.emptyState()
  }

  emptyState() {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmation: ''
    })
  }

  render() {

    console.log(this.state)

    const registration = () => (
      <form className="form">
        <input placeholder="First Name" ref="firstname" type="text" onChange={(e) => this.setState({firstName: e.target.value})} required/>
        <input placeholder="Last Name" ref="lastname" type="text" onChange={(e) => this.setState({lastName: e.target.value})} required/>
        <input placeholder="Email" name="email" type="email" onChange={(e) => this.setState({email: e.target.value})} required/>
        <input placeholder="Password" name="password" type="password" onChange={(e) => this.setState({password: e.target.value})} required/>
        <input placeholder="Confirmation" name="confirmation" type="password" onChange={(e) => this.setState({confirmation: e.target.value})} required/>
        <div className="bottom-side">
          <input className="register-btn" type="submit" value="Validate" onClick={(e) => this.register(e)}/>
          <button onClick={(e) => this.toConnexion(e)}>Already member ?</button>
        </div>
      </form>
    )

    const connexion = () => (
      <form className="form">
        <input placeholder="Email" ref="email" type="email" onChange={(e) => this.setState({email: e.target.value})} required/>
        <input placeholder="Password" ref="password" type="password" onChange={(e) => this.setState({password: e.target.value})} required/>
        <div className="bottom-side">
          <input className="register-btn" type="submit" value="Validate" onClick={(e) => this.connect(e)}/>
          <button onClick={(e) => this.toRegistration(e)}>Not a member yet ?</button>
        </div>
      </form>
    )

    const dashBoard = () => (
      <div className="pannel">
        <div id="back"></div>
        <div className="left-side">
          <img className="avatar" src={this.state.avatar} />
          <button onClick={() => this.deconnect()}><img src={deconnexionLogo} /></button>
        </div>
        <div className="right-side">
          <p>{`${this.state.firstName} ${this.state.lastName}`}</p>
          <p>{this.state.type}</p>
          <div className="link-container">
            <Link to="/profile" className="link">Profile</Link>
            <button className="link">Your articles</button>
            <button className="link">New article</button>
          </div>
        </div>
      </div>
    )

    switch(true) {
      case this.state.status == 'not registered':
        return registration()
        break;
      case this.state.status == 'not connected':
        return connexion()
        break;
      case this.state.status == 'connected':
        return dashBoard()
        break;
      default:
        return <div className="pannel"></div>
    }
  }
}

export default Pannel