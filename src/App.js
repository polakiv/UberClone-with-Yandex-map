import React, { useState, useEffect, memo, useRef, Suspense } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import setOnlineStatus from "./setOnlineStatus";
import { Route, useLocation, Redirect } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import db, { auth, provider, createTimestamp, messaging } from "./firebase";
import {
  TransitionGroup,
  Transition,
  CSSTransition,
} from "react-transition-group";
import "./App.css";
import useRoomsData from "./useRoomsData";
import scalePage from "./scalePage";
import useFetchData from "./useFetchData.js";
import DestinationSearch from "./DestinationSearch";
//const DestinationSearch = React.lazy(() => import("./DestinationSearch"));
localStorage.setItem("gps", "47.6758555, 38.0625965");
localStorage.setItem("gps_sum", "85.6");
localStorage.setItem("lng", "38.0625965");
localStorage.setItem("lat", "47.6758555");

navigator.geolocation.getCurrentPosition(function (position) {
  // Текущие координаты.
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var gpska = lat + ", " + lng;
  var gps_suma = lat + lng;

  localStorage.setItem("lat", lat);
  localStorage.setItem("lng", lng);
  localStorage.setItem("gps", gpska);
  localStorage.setItem("gps_sum", gps_suma);
  let accuracy = position.coords.accuracy;
  localStorage.setItem("accuracy", accuracy);
  //console.log("lat доступна " + lat); // Геолокация доступна
  //console.log("lng доступна " + lng); // Геолокация доступна
  //console.log("accuracy доступна " + accuracy); // Погрешность
  // console.log("Cумма координат " + gps_suma); // Погрешность
  //	  setGps_sum(gps_suma);
  //  setGps_ka(gpska);
});

const configureNotif = (docID) => {
  messaging
    .requestPermission()
    .then(() => {
      //console.log('permission granted');
      return messaging.getToken();
    })
    .then((token) => {
      //console.log(token);
      db.collection("users").doc(docID).set(
        {
          token: token,
        },
        { merge: true }
      );
    })
    .catch((e) => {
      //console.log(e.message);
      db.collection("users").doc(docID).set(
        {
          token: "",
        },
        { merge: true }
      );
    });
};

function App() {
  const [{ user, path, pathID, roomsData, page }, dispatch, actionTypes] =
    useStateValue();
  const [loader, setLoader] = useState(true);
  const [pwaEvent, setPwaEvent] = useState(undefined);
  const [updating, setUpdating] = useState(false);
  const [checkingVersion, setCheckingVerison] = useState(true); 

  const [openMap, setOpenMap] = useState(false); 

  const [chats, setChats] = useState(null);
  const [chatsFetched, setChatsFetched] = useState();
  const location = useLocation();
  const [setRoomsData] = useRoomsData();
  const b = useRef([]);
  const menus = ["/rooms", "/search", "/users", "/chats"];

  const [rooms, fetchRooms] = useFetchData(
    30,
    db.collection("rooms").orderBy("timestamp", "desc"),
    true,
    (snap) => {
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    "rooms"
  );

  const [users, fetchUsers] = useFetchData(
    30,
    db
      .collection("users")
      // .orderBy("coord_sum", "desc")
      //.find({coord_sum: "85.7360078"})
   //   .where('coord_sum', '==',  localStorage.getItem("gps_sum").substring(4, -4))
       .where('state', '==',  'online')
      ,
    /*  .where({
        coord_sum: localStorage.getItem("gps_sum").substring(4, -4),
        state: 'online'
      }),*/
    // .orderBy("timestamp", "desc")
    //.where('coord_sum',
    //  .isEqualTo("85.7360078")
    //.where('role', '==', 'Пассажир')
    // db.collection("users").orderBy("timestamp", "desc").where('role', '==', 'Пассажир'),
    true,
    (snap) => {
      const data = [];
      if (snap.docs.length > 0) {
        snap.docs.forEach((doc) => {
          const id = doc.id > user.uid ? doc.id + user.uid : user.uid + doc.id;
          if (doc.id !== user.uid) {
            data.push({
              ...doc.data(),
              id,
              userID: doc.id,
            });
            setRoomsData(doc.id, id);
          }
        });
      }
      return data;
    },
    "users"
  );
  console.log(users);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      //console.log("user change: ", authUser)
      if (authUser) {
        dispatch({ type: actionTypes.SET_USER, user: authUser });
        setLoader(false);
        if ("serviceWorker" in navigator && "PushManager" in window) {
          //console.log("This browser supports notifications and service workers")
          configureNotif(authUser.uid);
        }
        //console.log(authUser);
        /*    db.collection("version").doc("version").get().then(doc => {
          const version = doc.data().version;
          const previousVersion = localStorage.getItem("version");
          if (previousVersion) {
            //console.log("previous version exists in local storage")
            if (version !== +previousVersion) {
              //console.log("new version is not equal to previous version")
              localStorage.setItem("version", version);
              setUpdating(true);
              auth.signOut();
              auth.signInWithRedirect(provider).catch(e => alert(e.message))
            } else {
              setCheckingVerison(false)
            }
          } else {
            //console.log("previous version doesn't exists in local storage")
            localStorage.setItem("version", version);
            setCheckingVerison(false)
          }
        });*/
        const ref = db.collection("users").doc(authUser.uid);
        ref.get().then((doc) => {
          const data = doc.data();
          if (data) {
            if (data.timestamp) {
              //console.log("updating user")
              return ref.set(
                {
                  name: authUser.displayName,
                  photoURL: authUser.photoURL,
               //   about: "",
               //   phone: "",
                  role: localStorage.getItem("role"),
                  searchrole: localStorage.getItem("searchrole"),
                },
                { merge: true }
              );
            }
          }
          //console.log("setting user")
          return ref.set(
            {
              name: authUser.displayName,
              photoURL: authUser.photoURL,
              timestamp: createTimestamp(),
           //   about: "",
            //  phone: "",
              role: localStorage.getItem("role"),
              searchrole: localStorage.getItem("searchrole"),
            },
            { merge: true }
          );
        });
      } else {
        dispatch({ type: actionTypes.SET_USER, user: null });
        //console.log(user);
        /*  setLoader(false);
        db.collection("version").doc("version").get().then(doc => {
          const version = doc.data().version;
          const previousVersion = localStorage.getItem("version");
          if (previousVersion) {
            //console.log("previous version exists in local storage")
            if (version !== +previousVersion) {
              //console.log("new version is not equal to previous version")
              localStorage.setItem("version", version);
              setCheckingVerison(false)
            } else {
              setCheckingVerison(false)
            }
          } else {
            //console.log("previous version doesn't exists in local storage")
            localStorage.setItem("version", version);
            setCheckingVerison(false)
          }
        })*/
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      //console.log("pwa event executed");
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setPwaEvent(e);
      // Update UI notify the user they can install the PWA
    });
    window.addEventListener("resize", () => {
      dispatch({ type: "set_scale_page", page: scalePage() });
    });
  }, []);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("chats")
        .orderBy("timestamp", "desc")
        .onSnapshot({ includeMetadataChanges: true }, (snap) => {
          if (snap.docs?.length > 0) {
            snap.docChanges().forEach((change) => {
              if (change.type === "added") {
                setRoomsData(change.doc.data().userID, change.doc.id);
              }
            });
            if (
              !snap.metadata.fromCache ||
              (!window.navigator.onLine && snap.metadata.fromCache)
            ) {
              setChats(
                snap.docs.map((cur) => ({
                  ...cur.data(),
                  id: cur.id,
                }))
              );
            }
          } else {
            setChats([]);
          }
        });
      fetchRooms(() => null);
      fetchUsers(() => null);
    }
  }, [user]);

  useEffect(() => {
    if (chats?.length > 0) {
      if (chats.every((cur) => roomsData[cur.id]?.lastMessage)) {
        setChatsFetched(true);
      }
    } else if (chats?.length === 0) {
      setChatsFetched(true);
    }
  }, [chats, roomsData]);

  useEffect(() => {
    var s;
    if (user) {
      setOnlineStatus(user.uid);
    }
    return () => {
      if (s) {
        s();
      }
    };
  }, [user]);

  useEffect(() => {
    var id = location.pathname.replace("/room/", "");
    menus.forEach((cur) => (id = id.replace(cur, "")));
    dispatch({ type: "set_path_id", id });
  }, [location.pathname]);

  return (
    <div className="app">
      {page.width <= 160 ? <Redirect to="/chats" /> : <Redirect to="/" />}
      {!user && loader && !updating ? (
        <Login />
      ) : user && !updating && chatsFetched ? (
        <div className="app__body">
          <Sidebar
            chats={chats}
            pwa={pwaEvent}
            rooms={rooms}
            fetchRooms={fetchRooms}
            users={users}
            fetchUsers={fetchUsers}
          />
        

          <TransitionGroup component={null}> 
          
        
            <DestinationSearch open={openMap}  users={users} fetchUsers={fetchUsers} />
          


            {page.width <= 760 ? (
              <Transition
                key={location.pathname.replace("/image", "")}
                timeout={260}
              >
                {(state) => (
                  <Route location={location} path={`${path}/room/:roomID`}> 
                    <Chat
                      b={b}
                      unreadMessages={
                        chats?.length > 0
                          ? chats.find((cur) => cur.id === pathID)
                              ?.unreadMessages
                          : 0
                      }
                      animState={state}
                    />
                  </Route>
                )}
              </Transition>
            ) : (
              <CSSTransition
                key={location.pathname.replace("/image", "")}
                timeout={1010}
                classNames="page"
              >
                {(state) => (
                  <Route location={location} path={`${path}/room/:roomID`}>
                    <Chat
                      b={b}
                      unreadMessages={
                        chats?.length > 0
                          ? chats.find((cur) => cur.id === pathID)
                              ?.unreadMessages
                          : 0
                      }
                      animState={state}
                    />
                  </Route>
                )}
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
      ) : (
        <div className="loader__container">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default memo(App);
