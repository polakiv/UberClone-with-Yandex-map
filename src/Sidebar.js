import { useEffect, useState, memo, useRef } from "react";
import SidebarChat from "./SidebarChat";
import { Avatar, IconButton } from "@material-ui/core";

import YourRole from "./YourRole";
import {
  Message,
  PeopleAlt,
  Home,
  ExitToApp as LogOut,
  SearchOutlined,
  GetAppRounded,
  Add,
  DriveEta,
} from "@material-ui/icons";
import { useStateValue } from "./StateProvider";
import { NavLink, Route, useHistory, Switch } from "react-router-dom";
//import algoliasearch from "algoliasearch";
import "./App.css";
import audio from "./notification.mp3";
import DrawerLeft from "./DrawerLeft";
import db, {
  auth,
  storage1,
  provider,
  createTimestamp,
  messaging,
} from "./firebase";
import firebase from "firebase/app";

/*
const index = algoliasearch(
  "3NMH9UCFLC",
  "deb2bbef10859ca91461463cd6730232"
).initIndex("muizzchats");
*/
function Sidebar({
  chats,
  pwa,
  rooms,
  fetchRooms,
  users,
  fetchUsers,
  usersSearch,
  fetchUsersSearch,
}) {
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState(null);

  const [searchList, setSearchList] = useState(null);
  const [searchListy, setSearchListy] = useState(null);
  const [searchRole, setSearchRole] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [menu, setMenu] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [{ user, page, pathID }] = useStateValue();
  let history = useHistory();
  const notification = new Audio(audio);
  const prevUnreadMessages = useRef(
    (() => {
      const data = {};
      chats.forEach((cur) =>
        cur.unreadMessages || cur.unreadMessages === 0
          ? (data[cur.id] = cur.unreadMessages)
          : null
      );
      return data;
    })()
  );

  var Nav;
  if (page.width > 160) {
    Nav = (props) => (
      <div
        className={`${props.classSelected ? "sidebar__menu--selected" : ""}`}
        onClick={props.click}
      >
        {props.children}
      </div>
    );
  } else {
    Nav = NavLink;
  }

  var filtered;
  async function search(e) {
    if (e) {
      document.querySelector(".sidebar__search input").blur();
      e.preventDefault();
    }
    if (page.width <= 160) {
      history.push("/search?" + searchInput);
    }
    setSearchList(null);
    if (menu !== 4) {
      setMenu(4);
    }
    // console.log(searchInput);
    //   console.log(users);
    // console.log(fetchUsers);

    /*   const result = (await index.search(searchInput)).hits.map((cur) =>
      cur.objectID !== user.uid
        ? {
            ...cur,
            id: cur.photoURL
              ? cur.objectID > user.uid
                ? cur.objectID + user.uid
                : user.uid + cur.objectID
              : cur.objectID,
            userID: cur.photoURL ? cur.objectID : null,
          }
        : null
    );
    console.log(result);
    setSearchList(result);*/

    var filtered = users.filter(function (element, index, array) {
      return element.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1;
    });
    // console.log(filtered);

    setSearchListy(filtered);

    /*  const findMessage = function (users) { 
          return users; 
      };
      const result = (users.filter(findMessage(searchInput)).map((user) => 
        user.photoURL,
        user.uid
        ))
      setSearchList(result);*/

    //const count = 65;
  }

  //  debugger;
  const createChat = () => {
    const roomName = prompt("Type the name of your room");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        timestamp: createTimestamp(),
        lastMessage: "",
      });
    }
  };

  // Открытие левого бара
  const handleDrawerLeftOpen = () => {
    //   setMenuSidebar(null);
    setDrawerLeft(true);
  };
  useEffect(() => {
    const data = {};
    chats.forEach((cur) => {
      if (cur.unreadMessages || cur.unreadMessages === 0) {
        if (
          (cur.unreadMessages > prevUnreadMessages.current[cur.id] ||
            (!prevUnreadMessages.current[cur.id] &&
              prevUnreadMessages.current[cur.id] !== 0)) &&
          pathID !== cur.id
        ) {
          notification.play();
        }
        data[cur.id] = cur.unreadMessages;
      }
    });
    prevUnreadMessages.current = data;
  }, [chats, pathID]);

  useEffect(() => {
    if (page.width <= 160 && chats && !mounted) {
      setMounted(true);
      setTimeout(() => {
        document.querySelector(".sidebar").classList.add("side");
      }, 10);
    }
  }, [chats, mounted]);

  async function searchDr() {
    if (menu !== 3) {
      setMenu(3);
    }

    var filteredRole = users.filter(function (element, index, array) {
      return (
        element.searchrole
          .toLowerCase()
         // .indexOf(localStorage.getItem("role").toLowerCase()) > -1
          .indexOf("Пассажир".toLowerCase()) > -1
      );
    });

   // console.log(filteredRole);

    setSearchRole(filteredRole);
  }

  async function searchPas() {
    if (menu !== 2) {
      setMenu(2);
    }

    var filteredRole = users.filter(function (element, index, array) {
      return (
        element.searchrole
          .toLowerCase()
          .indexOf("Водитель".toLowerCase()) > -1
      );
    });

    //console.log(filteredRole);

    setSearchRole(filteredRole);
  }
  async function searchHome() {
    if (menu !== 1) {
      setMenu(1);
    } 
    history.push("/");
  }
  return (
    <div
      className="sidebar"
      style={{
     //   minHeight: page.width <= 760 ? page.height : "auto",
      }}
    >
      {/*<p>Sidebar.js</p>*/}
      <div className="sidebar__header">
        <div className="sidebar__header--left">
          <Avatar src={user?.photoURL} onClick={() => handleDrawerLeftOpen()} />
          <h4>{user?.displayName} </h4>
        </div>

        <DrawerLeft
          drawerLeft={drawerLeft}
          setDrawerLeft={setDrawerLeft}
          db={db}
          auth={auth}
          storage={storage1}
        />
        <div className="sidebar__header--right">
          <IconButton
            onClick={() => {
              if (pwa) {
                console.log("prompting the pwa event");
                pwa.prompt();
              } else {
                console.log("pwa event is undefined");
              }
            }}
          >
            <GetAppRounded />
          </IconButton>
          <YourRole uid={user.uid} />
          {/* <IconButton
            onClick={() => {
              auth.signOut();
              db.doc("/users/" + user.uid).set(
                { state: "offline" },
                { merge: true }
              );
              history.replace("/chats");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
          >
            <LogOut />
          </IconButton>*/}
        </div>
      </div>

      <div className="sidebar__search">
        <form className="sidebar__search--container">
          <SearchOutlined />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск"
            type="text"
          />
          <button
            style={{ display: "none" }}
            type="submit"
            onClick={search}
          ></button>
        </form>
      </div>

      <div className="sidebar__menu">
        <Nav
          classSelected={menu === 1 ? true : false}
          to="/"
          click={() => setMenu(1), searchHome}
          activeClassName="sidebar__menu--selected"
        >
          <div className="sidebar__menu--users">
            <Home />
            <div className="sidebar__menu--line"></div>
          </div>
        </Nav>
        <Nav
          classSelected={menu === 2 ? true : false}
          to="/users"
          click={() => setMenu(2), searchPas}
          activeClassName="sidebar__menu--selected"
        >
          <div className="sidebar__menu--users">
            <PeopleAlt />
            <div className="sidebar__menu--line"></div>
          </div>
        </Nav>
        <Nav
          classSelected={menu === 3 ? true : false}
          to="/users"
          click={() => setMenu(3), searchDr}
          activeClassName="sidebar__menu--selected"
        >
          <div className="sidebar__menu--users">
            <DriveEta />
            <div className="sidebar__menu--line"></div>
          </div>
        </Nav>
      </div>

      {page.width <= 160 ? (
        <>
          <Switch>
            <Route path="/users">
              <SidebarChat
                key="users"
                fetchList={fetchUsers}
                dataList={users}
                title="Users"
                path="/users"
              />
            </Route>
            <Route path="/rooms">
              <SidebarChat
                key="rooms"
                fetchList={fetchRooms}
                dataList={rooms}
                title="Rooms"
                path="/rooms"
              />
            </Route>
            <Route path="/search">
              <SidebarChat
                key="search"
                fetchList={fetchUsers}
                dataList={searchListy}
                title="Search Result"
                path="/search"
              />
            </Route>
            <Route path="/chats">
              <SidebarChat
                key="chats"
                dataList={chats}
                title="Chats1"
                path="/chats"
              />
            </Route>
          </Switch>
        </>
      ) : menu === 1 ? (
        <SidebarChat
        key="users"
        fetchList={fetchUsers}
        dataList={users}
   //   title="Все"
      />
      ) : menu === 2 ? (
        <SidebarChat
          key="usersPas"
          fetchList={fetchUsers}
          dataList={searchRole}
          title="Пассажиры"
        />
      ) : menu === 3 ? (
        <SidebarChat
          key="usersDr"
          fetchList={fetchUsers}
          dataList={searchRole}
          title="Водители"
        />
      ) : menu === 4 ? (
        <SidebarChat
          key="search"
          fetchList={fetchUsers}
          dataList={searchListy}
          title="Поиск"
          //   key="search"
          // dataList={searchList}
          // title="Результат поиска"
        />
      ) : null}
    </div>
  );
}

export default memo(Sidebar);