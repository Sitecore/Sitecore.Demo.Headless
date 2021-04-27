import React from "react";
import { boxeverGet } from "../../services/GenericService";
import { getGuestRef } from "../../services/BoxeverService";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName:"",guestRef:"" }
  }

  componentDidMount() {
    let user = localStorage.getItem("userName");
    if (user && !user.includes("undefined")) {
      user = JSON.parse(user);
      this.setState({ userName: user });
    } else {
      getGuestRef()
      .then(response => {
        return boxeverGet(
          "/getguestByRef?guestRef="+ response.guestRef
        );
      })
      .then(boxeverResponse => {
        var username = boxeverResponse.data.firstname + " " + boxeverResponse.data.lastname;
        console.log(boxeverResponse.data.firstName + " " + boxeverResponse.data.lastName);
        this.setState({userName:username, guestRef:boxeverResponse.data.ref});
        localStorage.setItem("userName",username);
      })
      .catch(e => {
        console.log(e);
      });
    }
  }

  createMarkup() {
    return {__html: this.state.userName};
  }

  render() {
    return (
     <div dangerouslySetInnerHTML={this.createMarkup()} />
    );
  }
}

export default Profile;
