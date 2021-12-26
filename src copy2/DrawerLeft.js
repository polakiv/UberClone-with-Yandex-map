import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
//importing components
import DropdownMenu from "./DropdownMenu";
import { toastInfo } from "./toastInfo";
import DialogCustom from "./DialogCustom";
//importing material-ui
import Zoom from "@material-ui/core/Zoom";
import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
//importing material-ui-icons
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
//importing styles
import "./DrawerLeft.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    position: "absolute",
  },
}));

function DrawerLeft({ drawerLeft, setDrawerLeft, db, auth, storage }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [showEditName, setShowEditName] = useState(false);
  const [showEditAbout, setShowEditAbout] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [uploadPhotoLink, setUploadPhotoLink] = useState(null);
  const [showDialogUpload, setShowDialogUpload] = useState(false);
  const [menuProfile, setMenuProfile] = useState(null);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    setName(user.displayName);

    db.collection("users")
      .doc(user.uid)
      .onSnapshot(function (doc) {
        setPhoto(doc.data()?.photoURL);
        setAbout(doc.data()?.about);
        setPhone(doc.data()?.phone);
      });
  }, [user.uid, user.displayName, db]);

  const updateName = (e) => {
    e.preventDefault();

    if (user.uid) {
      db.collection("users")
        .doc(user.uid)
        .update({
          name: name,
        })
        .then(function () {
          console.log("Обновлено!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Не удалось обновить: ", error);
        });

      auth.currentUser.updateProfile({
        displayName: name,
      });
    }
    setShowEditName(false);
  };

  const updateAbout = (e) => {
    e.preventDefault();

    if (user.uid) {
      db.collection("users") 
        .doc(user.uid)
        .update({
          about: about,
        })
        .then(function () {
          console.log("Обновлено!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Не получилось обновить: ", error);
        });
    }
    setShowEditAbout(false);
  };

  const updatePhone = (e) => {
    e.preventDefault();

    if (user.uid) {
      db.collection("users") 
        .doc(user.uid)
        .update({
          phone: phone,
        })
        .then(function () {
          console.log("Обновлено phone!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Не получилось обновить phone: ", error);
        });
    }
    setShowEditPhone(false);
  };

  const editName = () => {
    setShowEditName(true);
  };

  const editAbout = () => {
    setShowEditAbout(true);
  };

  const editPhone = () => {
    setShowEditPhone(true);
  };

  const handleDrawerClose = () => {
    setDrawerLeft(false);
    setShowEditName(false);
    setShowEditAbout(false);
    setShowEditPhone(false);
  };

  const viewPhoto = () => {
    const viewPhoto = "viewPhoto";

    if (user) {
      setShowProfilePhoto(true);
    } else {
      toastInfo("Нет фото!", viewPhoto, "top-center");
    }
    setMenuProfile(null);
  };

  const viewPhotoClose = () => {
    setShowProfilePhoto(false);
  };

  const takePhoto = () => {
    const takePhoto = "takePhoto";
    toastInfo("Выбранное фото больше недоступно!", takePhoto, "top-center");
  };

  const removedPhoto = () => {
    const removedPhoto = "removedPhoto";
    toastInfo(
      "Удаленное фото больше не доступно!",
      removedPhoto,
      "top-center"
    );
  };

  const onFileChangeImage = async (e) => {
    const imageFileSizeToastId = "imageFileSizeToastId";
    const file = e.target.files[0];

    if (file.size > 3 * 1024 * 1024) {
      toastInfo(
        "Фотка не должна быть больше 3Mb",
        imageFileSizeToastId,
        "top-center"
      );
    } else {
      const storageRef = storage.ref();
      if (user.isAnonymous === true) {
        const imagesRef = storageRef.child(`user/anonymous/${user.uid}`);
        const fileRef = imagesRef.child(file.name);
        await fileRef.put(file);
        setUploadPhotoLink(await fileRef.getDownloadURL());
        console.log("uploading image", uploadPhotoLink);
      } else {
        const imagesRef = storageRef.child(`user/regular/${user.uid}`);
        const fileRef = imagesRef.child(file.name);
        await fileRef.put(file);
        setUploadPhotoLink(await fileRef.getDownloadURL());
        console.log("uploading image", uploadPhotoLink);
      }
    }
    setMenuProfile(null);
    setShowDialogUpload(true);
  };

  const uploadPhoto = () => {
    return (
      <div className="profileMenu_uploadPhoto">

    {/*    <span style={{fontSize:'10px'}}> uploadPhoto.js</span>*/}
        <label htmlFor="file-input">Загрузить фото</label>
        <input
          id="file-input"
          type="file"
          onChange={onFileChangeImage}
          accept="image/*"
        />
      </div>
    );
  };

  const handleUploadPhoto = () => {
    const uploadPhotoError = "uploadPhotoError";

    if (uploadPhotoLink) {
      auth.currentUser.updateProfile({
        photoURL: uploadPhotoLink,
      });
      db.collection("rooms").doc(user.uid).set(
        {
          photoURL: uploadPhotoLink,
        },
        { merge: true }
      );
      setShowDialogUpload(false);
    } else {
      toastInfo("Select photo to upload!", uploadPhotoError, "top-center");
    }
  };

  const handleDialogUploadClose = () => {
    setShowDialogUpload(false);
  };

  const handleProfileMenu = (event) => {
    setMenuProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setMenuProfile(null);
  };

  const menuLists = [
    {
      title: "Увеличить",
      onClick: () => viewPhoto(),
      id: Math.random() * 100000,
    },
   // {
     // title: "Take photo",
     // onClick: () => takePhoto(),
      //id: Math.random() * 100000,
    //},
    {
      title: uploadPhoto(),
      onClick: () => handleUploadPhoto(),
      id: Math.random() * 100000,
    },
   /* {
      title: "Removed photo",
      onClick: () => removedPhoto(),
      id: Math.random() * 100000,
    },*/
  ];

  return ( 
    <div>
      {/*<span style={{fontSize:'10px'}}> Drawer-DrawerLeft.js</span>*/}
      <Drawer
        anchor="left"
        variant="persistent"
        open={drawerLeft}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className="drawerLeft__header">
          <div className="drawerLeft__header_container">
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIcon />
            </IconButton>
            <p>Ваш профиль и ваша заявка</p>
          </div>
        </div>

        <div className="drawerLeft__content">
          <div className="drawerLeft__content_photo">
            <div className="profilePhoto">
              <Zoom
                in={drawerLeft}
                style={{ transitionDelay: drawerLeft ? "300ms" : "0ms" }}
              >
                {photo ? (
                  <Avatar src={photo} className="profilePhoto__layer_bottom" />
                ) : (
                  <Avatar />
                )}
              </Zoom>
              <div
                className="profilePhoto__layer_top"
                onClick={handleProfileMenu}
              >
                <div className="profilePhoto__text">
                  <PhotoCameraIcon />
                  <p>Изменить</p>
                  <p>Фото</p>
                </div>
              </div>
            </div> 

            <DropdownMenu
              menuLists={menuLists}
              menu={menuProfile}
              handleMenuClose={handleProfileMenuClose}
            />

            <DialogCustom
              open={showProfilePhoto}
              close={viewPhotoClose}
              photo={photo}
              user={user} 
            />
          </div>

          <div className="profileMenu__diaglog">
            <Dialog
              open={showDialogUpload}
              onClose={handleDialogUploadClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title-drawerLeft">
                Загрузить фото(если вы водитель, то можно фото машины)
              </DialogTitle>
              <DialogContent id="form-dialog-content">
                <div className="profileMenu__uploadPhoto_dialog">
                  <img src={uploadPhotoLink} alt="" />
                </div>
              </DialogContent>
              <DialogActions>
                <div className="profileMenu_uploadPhoto_iconButton">
                  <IconButton onClick={handleUploadPhoto}>
                    <CheckIcon />
                  </IconButton>
                </div>
              </DialogActions>
            </Dialog>
          </div>

          <div className="drawerLeft__content_name">
            <p>Ваше имя и предложение
            {  localStorage.getItem("role") == 'Водитель' ? (
                 <span className="span_namer">Например Вася, езжу каждый день в Макеевку, в 10 утра</span> 
            ):(
              <span className="span_namer">Например Аня, пассажир, езжу каждый день в центр Донецка с Текстильщика в 8 утра, кто подвезет?</span> 
            )

            }
            </p> 
            <form>
              {showEditName ? (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    styles={{ borderBottom: "1px solid green !important" }}
                    
                  />
                  <CheckIcon onClick={updateName} />
                </>
              ) : (
                <>
                  <span>{name}</span>
                  <EditIcon onClick={editName} />
                </>
              )}
            </form>
          </div>

          <div className="drawerLeft__note">
            <span>
             Напишите имя и оставьте свое предложение
            </span>
          </div>

          <div className="drawerLeft__content_name">
            <p>Телефон</p>
            <form>
              {showEditPhone ? (
                <>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                  />
                  <CheckIcon onClick={updatePhone} />
                </>
              ) : (
                <>
                  <span>{phone}</span>
                  <EditIcon onClick={editPhone} />
                </>
              )}
            </form>
          </div>
          <div className="drawerLeft__content_name">
            <p>Обо мне</p>
            <form>
              {showEditAbout ? (
                <>
                  <input
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    type="text"
                  />
                  <CheckIcon onClick={updateAbout} />
                </>
              ) : (
                <>
                  <span>{about}</span>
                  <EditIcon onClick={editAbout} />
                </>
              )}
            </form>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default DrawerLeft;
