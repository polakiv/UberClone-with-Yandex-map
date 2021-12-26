import React, { useState } from "react";
//import TooltipCustom from '../shared/TooltipCustom';
// import db from '../firebase';
import Button from "@material-ui/core/Button";
// import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
//import ChatIcon from '@material-ui/icons/Chat';
import Tablet from "../src/tablets.png";

function YourRole() {
  const [open, setOpen] = useState(
    !localStorage.getItem("role") ? true : false
  );
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleYourRoleOpen = () => {
    setOpen(true);
  };

  const handleYourRoleClose = () => {
    setOpen(false);
    //  setRoomName("");
  };

  const createYourRoleRider = (e) => {
    e.preventDefault();
    localStorage.setItem("role", "Пассажир");
    localStorage.setItem("searchrole", "Водитель");
    setOpen(false);
    setRole("Пассажир");
  };

  const createYourRoleDriver = (e) => {
    e.preventDefault();
    localStorage.setItem("role", "Водитель");
    localStorage.setItem("searchrole", "Пассажир");
    setOpen(false);
    setRole("Водитель");
  };

  return (
    <div>
      {/*}  <TooltipCustom 
                name="New YourRole" 
                onClick={() => handleYourRoleOpen()} 
                icon={<ChatIcon />}
            />*/}
      <span style={{ cursor: "pointer" }} onClick={() => handleYourRoleOpen()}>
        <img
          src={Tablet}
          alt="YouLrole"
          style={{ maxWidth: 40, paddingTop: 20, cursor: "pointer" }}
          onClick={() => handleYourRoleOpen()}
        />
        {role}
      </span>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Выберите кто вы сегодня:{" "}
        </DialogTitle>
        <DialogContent>
          {/* <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Room Name"
                        type="text"
                        fullWidth
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                   />*/}
          <img src={Tablet} alt="YouLrole" style={{ maxWidth: "100%" }} />
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-around" }}>
          <Button onClick={createYourRoleDriver} color="primary">
            Водитель
          </Button>
          <Button onClick={createYourRoleRider} color="primary">
            Пассажир
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default YourRole;
