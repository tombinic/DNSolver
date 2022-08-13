import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function FancyCheckbox(props) {
    return (
        <FormControlLabel style={{
            color: '#fff'
        }} control={<Checkbox checked={props.isChecked} onChange={props.onChange}  sx={{
            color: "#fff",'&.Mui-checked': {color: "#13aa52",},
        }} />} label={props.label} />
    );
}
