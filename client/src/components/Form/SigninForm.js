import React, { Fragment } from 'react'
import axios from 'axios';
import { Redirect, withRouter, Link } from 'react-router-dom'
import { authenticate, isAuth } from '../../auth/helpers'
import { ToastContainer, toast } from 'react-toastify';
import GoogleLogInBtn from '../../auth/GoogleLogInBtn'
require('dotenv').config();

class SigninForm extends React.Component {
    constructor(props) {
        super(props);
        const { history } = this.props;
        this.state = {
            email: 'alokacstu@gmail.com',
            password: 'oca123',
            btnTxt: 'Submit'
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.informParent = this.informParent.bind(this)
    }
  
    handleChange = input =>  event => {
        //
        this.setState( { ...this.state, [input]:event.target.value } )
    }

    informParent(response){
        console.log("satte", this.state)
        console.log("historyyy", this.history)
        authenticate( response, () => {
            ( isAuth() && isAuth().role === 'admin' ) ? this.history.pushState('admin') : this.history.pushState('/')
        } )
    }
  
    handleSubmit(event) {
        //
        event.preventDefault();
        this.setState({ ...this.state, "btnTxt":"Submitting" })
        let email = this.state.email
        let password = this.state.password
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email, password }   
        })
            .then( response => {
                console.log("SIGN IN SUCCESS:", response)
                // save the response ( user, token ) in localStorage / cookie
                authenticate( response, () => {
                    this.setState({ ...this.state, name: '', email: '', password: '', btnTxt: 'Submit' })
                    toast.success(`Hey ${response.data.user.name}, Welcome back!`);
                } )
                if( this.history ){
                    console.log("history:", this.historyhistory,"???")
                }else{
                    console.log("no hsitory")
                }
                ( isAuth() && isAuth().role === 'admin' ) ? this.history.pushState('admin') : this.history.pushState('/')
            } )
            .catch( err => {
                console.log("ERROR ON POST:", err)
                // console.log("Response:", err.response.data)
                this.setState({ ...this.state, btnTxt: 'Submit' })
                // toast.error(err.data.error)
                toast.error(err)
            } )
    }
    render() {
    const { history } = this.props;
      return (
            <div className="container col-md-6">
                <ToastContainer/>
                <h3>Sign in with your apps</h3>
                {console.log("History in signinForm", this.history)}
                {console.log("History in signinForm", history)}
                <GoogleLogInBtn history={history} informParent={this.informParent}/>
                
                <form onSubmit={this.handleSubmit}>
                    {isAuth() ? <Redirect to="/" /> : null} 
                    <div className="form-group">
                        <label className="">Email</label>
                        <input className="form-control"
                        onChange={this.handleChange('email')}
                        value={this.state.email}
                        type="email" />
                    </div>
                    <div className="form-group">
                        <label className="">Password</label>
                        <input className="form-control"
                        onChange={this.handleChange('password')}
                        value={this.state.password} />
                    </div>
                    <input className="btn btn-primary"
                    type="submit"
                    value={this.state.btnTxt} />
                </form>
                <br/>
                <Link to="/auth/password/forgot" classname="">
                    Forgot password?
                </Link>
            </div>
      );
    }
  }

export default withRouter( SigninForm )