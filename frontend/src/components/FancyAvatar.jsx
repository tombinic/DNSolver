import React, {  useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import AuthContext from "../contexts/AuthContext.jsx";

function stringAvatar(name, surname) {
  return {
    sx: {
      bgcolor: '#13aa52',
    },
    children: `${name.split(' ')[0][0].toUpperCase()}${surname.split(' ')[0][0].toUpperCase()}`,
  };
}

export default function FancyAvatar() {
const { auth } = useContext(AuthContext);
  return (
    <Avatar {...stringAvatar(auth.name, auth.surname)} />
  );
}
