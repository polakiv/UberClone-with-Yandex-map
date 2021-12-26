import React, {useEffect, useRef, useState} from 'react';
//import {Image, Text, View, Alert} from 'react-native';
//import {useRoute, useNavigation} from '@react-navigation/native';
import * as axios from "axios";
import {
	YMaps,
	Map,
	Placemark,
	RouteButton,
	GeolocationControl,
	RoutePanel,
} from 'react-yandex-maps'; 
import UberTypes from './UberTypes';  

const options = {
	suppressMapOpenBlock: true,
};



navigator.geolocation.getCurrentPosition(function(position) {
	
	// Текущие координаты.
	let lat = position.coords.latitude;
	let lng = position.coords.longitude;
	let gps = lat + ', ' + lng;
	
	localStorage.setItem('lat', lat);
	localStorage.setItem('lng', lng);
	localStorage.setItem('gps', gps);
	let accuracy = position.coords.accuracy;
	localStorage.setItem('accuracy', accuracy);
	console.log('lat доступна '+lat);// Геолокация доступна
	console.log('lng доступна '+lng );// Геолокация доступна
	console.log('accuracy доступна '+accuracy );// Погрешность
	
	
});
let lati = localStorage.getItem('lat');
let lngi = localStorage.getItem('lng');
let gpsi = localStorage.getItem('gps');
const mapState = { center: [lati, lngi], zoom: 12 }; 

const DestinationSearch = (props) => {
//	debugger;
	console.log(props);
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
		try {
		//	const userInfo = await Auth.currentAuthenticatedUser();
			
			const date = new Date();
			const input = {
				createdAt: date.toISOString(),
				type,
				originLatitude: localStorage.getItem('distance'),
				oreiginLongitude: localStorage.getItem('distance'),
				
				destLatitude: localStorage.getItem('distance'),
				destLongitude: localStorage.getItem('distance'),
				
				userId: 1,
				carId: '1',
				status: 'NEW',
			};
			
		 
			
		 
			/*   Alert.alert(
				(title = 'Ура!'),
				(message = 'Вы заказали авто!'),
				(buttons = [
				{
				text: 'Перейти на главную',
				onPress: () => navigation.navigate('Home'),
				},
				]),
			);*/
			//  navigation.navigate('OrderPage', { id: response.data.createOrder.id });
			} catch (e) {
			console.error(e);
		}
	};
	if (localStorage.getItem("userName") === null) {
		localStorage.setItem( "userName", " залогиньтесь");
	}
	const [cars, setCars] = useState([]);
	const [carsfire, setCarsfire] = useState(props.users);
	console.log("carsfire", carsfire);
	console.log("cars", cars);
	console.log("props.users", props.users);
	//props.users
	const [orderRoute, setOrderRoute] = useState([]);
	
	useEffect(() => {
		const fetchCars = async (getCarr) => {
			try {
				const usersData = await axios
				.get(
					`https://taxi.bigdatamicrodata.pp.ua/index.php?route=api/searchcar&searchcar=${getCarr}`,
				)
				.then((response) => {
					
					setCars(response.data.items);
					console.log(response.data.items);
				})
				
				} catch (e) {
				console.log(e);
			} 
		} 
		fetchCars('');
	}, [])
	
	//  console.log('props 55555555');
	return (
		<div
		style={{
			flex: 1,
			paddingTop: 54,
			marginTop: 10,
		}}>
		<YMaps
        style={{flex: 1, width: '100%', height: '100%', margin: 100}}
        query={{apikey: '77344b8e-1d6e-4ba9-be6c-dfe62831be7a'}}>
        <Map
		options={options}
		modules={['templateLayoutFactory', 'layout.ImageWithContent']}
		state={mapState}
		width={'100%'}
		height={500}
        //  rotate="85deg"
		onApiAvaliable={(ymaps) => this.onApiAvaliable(ymaps)}>
		<RouteButton
		instanceRef={(ref) => {
			if (ref) {
                ref.routePanel.state.set({
					from: '',
					to: '',
					type: 'auto',
				});
                const obj = ref.routePanel.getRouteAsync();
                obj
				.then(function (multiRoute) {
                    multiRoute.model.events.add('requestsuccess', function () {
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
								var obje = '';
								segments.each(function (segment) {
									// Вывод информации о сегменте.
									console.log(
										' Маневр в конце сегмента: ' +
										segment.properties.get('action').text,
									);
									obje +=
									' Маневр в конце сегмента: ' +
									segment.properties.get('action').text;
									
									console.log(
										' Длина сегмента: ' +
										segment.properties.get('distance').text,
									);
									
									obje +=
									' Длина сегмента: ' +
									segment.properties.get('distance').text;
									
									console.log(
										' Время прохождения сегмента: ' +
										segment.properties.get('duration').text,
									);
									
									obje +=
									' Время прохождения сегмента: ' +
									segment.properties.get('duration').text;
									
									console.log(
										' По какой улице проходит сегмент: ' +
										segment.properties.get('street'),
									);
									
									obje +=
									' По какой улице проходит сегмент: ' +
									segment.properties.get('street');
								});
								console.log('obje', obje);
								localStorage.setItem('obje', obje);
							});
							
							const distance =
							activeRoute.properties.get('distance').text;
							console.log('Длина маршрута: ', distance);
							console.log(
								'Примерное время проезда: ' +
								activeRoute.properties.get('duration').text,
							);
							//  setOrderRoute(distance);
							localStorage.setItem(
								'distanceValue',
								activeRoute.properties.get('distance').value,
							);
							localStorage.setItem(
								'distance',
								'Расстояние: ' +
								activeRoute.properties.get('distance').text,
							);
							localStorage.setItem(
								'duration',
								'Примерное время проезда: ' +
								activeRoute.properties.get('duration').text,
							);
							console.log(distance);
							
							//   distance=distance;
							//   duration= activeRoute.properties.get("duration").text;
							//   db.collection('Trips').doc(id).set({
							//     distance: distance
							//   }, { merge: true })
						}
					});
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
			float: 'right',
			size: 'large',
			popupWidth: '210px',
			maxWidth: '210px',
		}}
		state={{
			expanded: 'true',
			popupWidth: '210px',
		}}
		/>
		
		<GeolocationControl options={{float: 'left'}} />
		{carsfire.map((car) => (
            <Placemark
			style={{
                width: 10,
                transform: [{rotate: '90deg'}],
			}}
			key={car.userID}
			geometry={{
                type: 'Point',
              //  coordinates: [47.988736, 37.7913344],
				coordinates: [car.latitude, car.longitude],
			}}
			properties={{
                hintContent: car.name+" "+car.about,
                balloonContent: car.name+" "+car.about,
                iconCaption: car.name +" "+car.about,
                iconImageRotation: 50,
			}}
			modules={['geoObject.addon.hint']}
			options={{
                iconLayout: 'default#image',
                iconImageHref: car.photoURL,
                iconImageSize: [74, 61],
                iconImageOffset: [-3, -42],
                iconImageRotation: 50,
			}}
			onClick={(e) => {
                localStorage.setItem('car.name ', car.name);
            //    navigation.navigate('Home');
			}}
            />
		))}
        </Map>
		</YMaps>
	 
		<UberTypes typeState={typeState} onSubmit={onSubmit} />
		</div>
	);
	// console.log('instance55555555', instanceRef);
//	console.log(distance); //  /routename
	// getRoute();
	// localStorage.setItem("lng", data);
};
export default DestinationSearch;
