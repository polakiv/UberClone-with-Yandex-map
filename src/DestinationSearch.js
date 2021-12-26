import React, { useEffect, useRef, useState } from "react";

import Button from "@material-ui/core/Button";
//import {Image, Text, View, Alert} from 'react-native';
//import {useRoute, useNavigation} from '@react-navigation/native';
import { NavLink, Route, useHistory, Switch } from "react-router-dom";
import * as axios from "axios";
import {
  YMaps,
  Map,
  Placemark,
  RouteButton,
  GeolocationControl,
  RoutePanel,
} from "react-yandex-maps";

import DrawerLeft from "./DrawerLeft";
import "./App.css";
import db, {
  auth,
  storage1,
  provider,
  createTimestamp,
  messaging,
} from "./firebase";
import firebase from "firebase/app";

import UberTypes from "./UberTypes";

const options = {
  suppressMapOpenBlock: true,
};

navigator.geolocation.getCurrentPosition(function (position) {
  // Текущие координаты.
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  let gps = lat + ", " + lng;

  localStorage.setItem("lat", lat);
  localStorage.setItem("lng", lng);
  localStorage.setItem("gps", gps);
  let accuracy = position.coords.accuracy;
  localStorage.setItem("accuracy", accuracy);
  // console.log("lat доступна " + lat); // Геолокация доступна
  // console.log("lng доступна " + lng); // Геолокация доступна
  // console.log("accuracy доступна " + accuracy); // Погрешность
});
let lati = localStorage.getItem("lat");
let lngi = localStorage.getItem("lng");
var gpsi = localStorage.getItem("gps");
const mapState = { center: [lati, lngi], zoom: 12 };
console.log("gps DestinationSearch " + gpsi);

const DestinationSearch = (props) => {
  let history = useHistory();
  console.log("props", props);
  //	debugger;

  const navigatorGeolocation = () => {
    console.log('geo');
    navigator.geolocation.getCurrentPosition(function (position) {
      // Текущие координаты.
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      let gps = lat + ", " + lng;

      localStorage.setItem("lat", lat);
      localStorage.setItem("lng", lng);
      localStorage.setItem("gps", gps);
      let accuracy = position.coords.accuracy;
      localStorage.setItem("accuracy", accuracy);
     // npm i -g androidjs-builder
      // console.log("lat доступна " + lat); // Геолокация доступна
      // console.log("lng доступна " + lng); // Геолокация доступна
      // console.log("accuracy доступна " + accuracy); // Погрешность
    });
  };

  const [drawerLeft, setDrawerLeft] = useState(false);
  const [setMap, setMapOpen] = useState("0.5");
  const [setMapf, setMapOpenf] = useState("invert(1)");
  const [open, setOpen] = React.useState(false);
  console.log(setMap);
  const handleDrawerLeftOpen = () => {
    //   setMenuSidebar(null);
    setDrawerLeft(true);
  };

  const handleMapOpen = () => {
    //   setMenuSidebar(null);
    setMapOpen("1");
    setMapOpenf("hue-rotate(45deg)");
  };
  // console.log(props);
  const typeState = useState(null);

  //const route = useRoute();
  //const navigation = useNavigation();

  const onSubmit = async () => {
    const [type] = typeState;
    if (!type) {
      return;
    }

    //console.log('onSubmit 55555555');
    // submit to server
    /*  try {
      //	const userInfo = await Auth.currentAuthenticatedUser();

      const date = new Date();
      const input = {
        createdAt: "",
        type,
        originLatitude: localStorage.getItem("distance"),
        oreiginLongitude: localStorage.getItem("distance"),

        destLatitude: localStorage.getItem("distance"),
        destLongitude: localStorage.getItem("distance"),

        userId: 1,
        carId: "1",
        status: "NEW",
      };

          Alert.alert(
				(title = 'Ура!'),
				(message = 'Вы заказали авто!'),
				(buttons = [
				{
				text: 'Перейти на главную',
				onPress: () => navigation.navigate('Home'),
				},
				]),
			); 
      //  navigation.navigate('OrderPage', { id: response.data.createOrder.id });
    } catch (e) {
      console.error(e);
    }
    */
  };
  if (localStorage.getItem("userName") === null) {
    localStorage.setItem("userName", " залогиньтесь");
  }
  const [cars, setCars] = useState([]);
  const [carsfire, setCarsfire] = useState(props.users);
  //console.log("carsfire", carsfire);
  //console.log("cars", cars);
  console.log("props.users", props.users);
  //props.users
  const [orderRoute, setOrderRoute] = useState([]);

  /*
  useEffect(() => {
    const fetchCars = async (getCarr) => {
      try {
        const usersData = await axios
          .get(
            `https://taxi.bigdatamicrodata.pp.ua/index.php?route=api/searchcar&searchcar=${getCarr}`
          )
          .then((response) => {
            setCars(response.data.items);
            console.log(response.data.items);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchCars("");
  }, []);
  */

  //  console.log('props 55555555');
  return (
    <div className="dest">
      <div
        className="destb"
        style={{
          opacity: setMap,
          filter: setMapf,
        }}
      >
        <DrawerLeft
          drawerLeft={drawerLeft}
          setDrawerLeft={setDrawerLeft}
          db={db}
          auth={auth}
          storage={storage1}
        />
        <YMaps
          className="destYMaps"
          // style={{ flex: 1, width: "100%", height: "100%", margin: 100 }}
          query={{ apikey: "77344b8e-1d6e-4ba9-be6c-dfe62831be7a" }}
          //  setMap={setMap}
          //  setMapOpen={setMapOpen}

          //  style={{ display: "none" }}
        >
          <Map
            className="destMap"
            options={options}
            modules={["templateLayoutFactory", "layout.ImageWithContent"]}
            state={mapState}
            //    width={"100%"}
            //     height={"70vh"}
            //  rotate="85deg"
            onApiAvaliable={(ymaps) => this.onApiAvaliable(ymaps)}
          >
            <RouteButton
              instanceRef={(ref) => {
                if (ref) {
                  ref.routePanel.state.set({
                    from: "",
                    to: "",
                    type: "auto",
                  });
                  const obj = ref.routePanel.getRouteAsync();
                  obj
                    .then(function (multiRoute) {
                      multiRoute.model.events.add(
                        "requestsuccess",
                        function () {
                          const activeRoute = multiRoute.getActiveRoute();

                          if (activeRoute) {
                            var activeRoutePaths = activeRoute.getPaths();
                            activeRoutePaths.each(function (path) {
                              // Путь автомобильного маршрута - это
                              // объект multiRouter.driving.Path.
                              // Получение коллекции сегментов в пути.
                              var segments = path.getSegments();
                              // Проход по коллекции сегментов и вывод
                              // информации о каждом сегменте.
                              console.log(segments);
                              var obje = "";
                              segments.each(function (segment) {
                                // Вывод информации о сегменте.
                                console.log(
                                  " Маневр в конце сегмента: " +
                                    segment.properties.get("action").text
                                );
                                obje +=
                                  " Маневр в конце сегмента: " +
                                  segment.properties.get("action").text;

                                console.log(
                                  " Длина сегмента: " +
                                    segment.properties.get("distance").text
                                );

                                obje +=
                                  " Длина сегмента: " +
                                  segment.properties.get("distance").text;

                                console.log(
                                  " Время прохождения сегмента: " +
                                    segment.properties.get("duration").text
                                );

                                obje +=
                                  " Время прохождения сегмента: " +
                                  segment.properties.get("duration").text;

                                console.log(
                                  " По какой улице проходит сегмент: " +
                                    segment.properties.get("street")
                                );

                                obje +=
                                  " По какой улице проходит сегмент: " +
                                  segment.properties.get("street");
                              });
                              console.log("obje", obje);
                              localStorage.setItem("obje", obje);
                            });

                            const distance =
                              activeRoute.properties.get("distance").text;
                            console.log("Длина маршрута: ", distance);
                            console.log(
                              "Примерное время проезда: " +
                                activeRoute.properties.get("duration").text
                            );
                            //  setOrderRoute(distance);
                            localStorage.setItem(
                              "distanceValue",
                              activeRoute.properties.get("distance").value
                            );
                            localStorage.setItem(
                              "distance",
                              "Расстояние: " +
                                activeRoute.properties.get("distance").text
                            );
                            localStorage.setItem(
                              "duration",
                              "Примерное время проезда: " +
                                activeRoute.properties.get("duration").text
                            );
                            console.log(distance);

                            //   distance=distance;
                            //   duration= activeRoute.properties.get("duration").text;
                            //   db.collection('Trips').doc(id).set({
                            //     distance: distance
                            //   }, { merge: true })
                          }
                        }
                      );
                      return multiRoute;
                    })
                    .then(function () {
                      return obj;
                    })
                    // простое и полезное окончание цепочки промисов:
                    .catch(console.log.bind(console));
                }
              }}
              options={{
                float: "right",
                size: "large",
                popupWidth: "210px",
                maxWidth: "210px",
              }}
              state={{
                //    expanded: "true", раскрытие блока по умолчанию
                popupWidth: "210px",
              }}
            />

            <GeolocationControl options={{ float: "left" }} />

            <Placemark
              style={{
                width: 10,
                transform: [{ rotate: "90deg" }],
              }}
              key="fdsdfsdfhghf654gfd"
              geometry={{
                type: "Point",
                //    coordinates: [47.988736, 37.7913344],
                coordinates: [lati, lngi],
              }}
              properties={{
                hintContent: "я",
                balloonContent: "я",
                iconCaption: "я",
                iconImageRotation: 50,
              }}
              modules={["geoObject.addon.hint"]}
              /*   options={{
            //    iconLayout: "default#image",
           //     iconImageHref: car.photoURL,
            //    iconImageSize: [74, 61],
            //    iconImageOffset: [-3, -42],
            //    iconImageRotation: 50,
              }}
              onClick={(e) => {
                localStorage.setItem("car.name ", car.name);
                //    navigation.navigate('Home');
              }}*/
            />
            {carsfire?.map((car) => (
              <Placemark
                style={{
                  width: 10,
                  transform: [{ rotate: "90deg" }],
                }}
                key={car.userID}
                geometry={{
                  type: "Point",
                  //  coordinates: [47.988736, 37.7913344],
                  coordinates: [car.latitude, car.longitude],
                }}
                properties={{
                  hintContent: car.name + " " + car.about,
                  balloonContent: car.name + " " + car.about,
                  iconCaption: car.name + " " + car.about,
                  iconImageRotation: 50,
                }}
                modules={["geoObject.addon.hint"]}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: car.photoURL,
                  iconImageSize: [74, 61],
                  iconImageOffset: [-3, -42],
                  iconImageRotation: 50,
                }}
                onClick={(e) => {
                  localStorage.setItem("car.name ", car.name);
                  localStorage.setItem("car.id ", car.userID);
                  history.push("/room/" + car.userID);
                  //    navigation.navigate('Home');
                }}
              />
            ))}
          </Map>
        </YMaps>
      </div>

      {/*<UberTypes typeState={typeState} onSubmit={onSubmit} />*/}
      <Button
        style={{
          backgroundColor: "grey",
          color: "white",
          padding: 10,
          margin: 10,
          alignItems: "center",
          cursor: "pointer",
        }}
        disabled={open}
        variant="outlined"
        onClick={() => {
          navigatorGeolocation();
        }}
      >
       Включите геолокацию для максимально точного поиска
      </Button>
      <Button
        style={{
          backgroundColor: "black",
          color: "white",
          padding: 10,
          margin: 10,
          alignItems: "center",
          cursor: "pointer",
        }}
        disabled={open}
        variant="outlined"
        onClick={() => {
          handleDrawerLeftOpen();
        }}
      >
        Оставить заявку для всех
      </Button>
      <Button
        style={{
          backgroundColor: "rgb(85 255 42)",
          color: "black",
          padding: 10,
          margin: 10,
          alignItems: "center",
          cursor: "pointer",
        }}
        disabled={open}
        variant="outlined"
        onClick={() => {
          handleMapOpen();
        }}
      >
        Показать на карте
      </Button>
    </div>
  );
  // console.log('instance55555555', instanceRef);
  //	console.log(distance); //  /routename
  // getRoute();
  // localStorage.setItem("lng", data);
};
export default DestinationSearch;
