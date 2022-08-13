import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from "axios";
import * as Constants from '../Constants';
import AuthContext from "../contexts/AuthContext.jsx";
import Divider from '@material-ui/core/Divider';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: #13aa52;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #13aa52;
    }
  }
`;

const FancyModal = ({handleClose, open, setOpen, setPreferences, preferences}) => {
  const { auth } = useContext(AuthContext);
  const [dns1, setDns1] = useState('');
  const [dns2, setDns2] = useState('');
  const [isFormInvalidDns1, setIsFormInvalidDns1] = useState(false);
  const [isFormInvalidDns2, setIsFormInvalidDns2] = useState(false);

  function checkIp(ipaddress) {
      return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
  }

  function handleApplyClick(){
      if(!checkIp(dns1)) setIsFormInvalidDns1(true);
      if(!checkIp(dns2)) setIsFormInvalidDns2(true);
      if(!checkIp(dns1) || !checkIp(dns2)) return;

      axios.post(Constants.BACKEND_URL + auth.username + Constants.GET_PREFERENCES, {
          username: auth.username,
          dns1: dns1,
          dns2: dns2,
      }).then(function (response) {
          axios.get(Constants.BACKEND_URL + auth.username + Constants.GET_PREFERENCES).then(function (res) {
            setPreferences(res.data.preferences);
            setOpen(false);
          });
      });
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" >
            Primay DNS: {preferences.primary_dns}
          </Typography>
          <Typography id="modal-modal-title" variant="h5" >
            Secondary DNS: {preferences.secondary_dns}
          </Typography>
          <Divider style={{marginBottom:'10px', marginTop: '10px'}}/>
          <WhiteBorderTextField
            margin="normal"
            fullWidth
            value = {dns1}
            error = { isFormInvalidDns1 }
            onChange={(e) => {setDns1(e.target.value); setIsFormInvalidDns1(false);}}
            helperText={isFormInvalidDns1 && "Invalid IP for Primary DNS!"}
            id="dns1"
            label="Primary DNS"
            name="dns1"
            autoFocus
          />
          <WhiteBorderTextField
            margin="normal"
            fullWidth
            value = {dns2}
            error = { isFormInvalidDns2 }
            helperText={isFormInvalidDns2 && "Invalid IP for Secondary DNS!"}
            onChange={(e) => {setDns2(e.target.value); setIsFormInvalidDns2(false);}}
            id="dns2"
            label="Secondary DNS"
            name="dns2"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{backgroundColor: '#13aa52', color: 'white'}}
            onClick={(e) => handleApplyClick()}
          >
            Apply changes
          </Button>
          <Typography sx={{ fontStyle: 'italic', fontSize: 12 }} style={{ color: '#222' }}>
              WARNING: Some DNS are not supported by the library, if you not receive responses
              set as Primary DNS 8.8.8.8, and as Secondary DNS 8.8.4.4.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default FancyModal;
