import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const ColorButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textAlign: 'Right',
  top: '-0.5px',
  left: '-20px',
  minWidth: '120px',
  backgroundColor: '#13aa52',
  borderBottomRightRadius: '24px',
  borderTopRightRadius: '24px',
  border: '1px solid white',
  minHeight:'40px',
  zIndex:'1',
  '&:hover': {
    backgroundColor: 'rgb(2,52,48)',
  },
}));

export default function FancyButton(props) {
  return (
    <ColorButton onClick={props.onClick} variant="contained">QUERY</ColorButton>
  );
}
