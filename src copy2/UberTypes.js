import React, {useState, useEffect} from 'react';
  
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import * as axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
   // height: Dimensions.get('window').height - 400
  },
  
}));

const UberTypes = (props) => { 
  const classes = useStyles();
  const [cart, setCart] = React.useState(false);
  const [carterr, setCarterr] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [dist, setOpendist] = React.useState();

  const putCart = async () => {
    try {
      const cartData = await axios
        .get(  
          //&=${getCarr} в конец след строки вставить, если нужны
          //  cartreact&searchcar=${getCarr}
          `https://taxi.bigdatamicrodata.pp.ua/index.php?route=api/cartreact/add`,
        )
        .then((response) => {
          setCart(true);
          console.log(response);
        });
    } catch (e) {
      setCarterr(true);
      console.log(e);
    }
  };
  // putCart();

  return (
    <div className={classes.root} >  
     <Collapse
        in={carterr}
        style={{
          cursor: 'pointer',
          backgroundColor: 'red',
        }}>
        <Alert
          style={{
            cursor: 'pointer',
            backgroundColor: 'red',
            color:"inherit"
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setCarterr(false);
              }}>
              <CloseIcon   />
            </IconButton>
          }>
          Возможно что-то с интернетом, ваша заявка не проходит, попробуйте еще
          раз 
        </Alert>
      </Collapse>
       <Collapse
        in={cart}
        style={{
          cursor: 'pointer',
          backgroundColor: 'blue',
        }}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setCart(false);
              }}>
              <CloseIcon />
            </IconButton>
          }>
          Ваша заявка подана и будет висеть на доске обьявлений в течении часа.
          <IconButton
              aria-label="menu"
              color="inherit"
              size="small"
              onClick={(e) => {
           //     navigation.navigate('OrderPage');
              }}> 
               Нажмите чтобы отслеживать.
            </IconButton>
        </Alert>
      </Collapse>
      <Collapse
        in={open}
        style={{
          cursor: 'pointer',
        }}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}>
              <CloseIcon  />
            </IconButton>
          }>
          {dist} {' '}
          <IconButton
            onClick={() => {
              putCart();
            }}>
            Подтвердить
          </IconButton>
        </Alert>
      </Collapse> 
      {/* {typesData.map((type) => (
        <UberTypeRow type={type} key={type.id}  
        onClick={(e) => {
          localStorage.setItem('UberTypeRow', type.id) 
          navigation.navigate('Home')
        }}  
         
        />
      ))} 
      <Button
        style={{
          flex: 1,
          backgroundColor: 'black',
          color: 'white',
          padding: 10,
          margin: 10,
          alignItems: 'center',
          cursor: 'pointer',
        }}
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true);
          setOpendist(localStorage.getItem('distance'));
        }}>
        Оставить заявку для всех
      </Button>*/}
    </div>
  );
};
export default UberTypes;
