import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";
import AuthContext from "../contexts/AuthContext.jsx";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import FancyBar from "./FancyBar";
import * as Constants from '../Constants';
import FancyCheckbox from './FancyCheckbox.jsx';
import FancyButton from './FancyButton.jsx';
import Stack from '@mui/material/Stack';
import FancyTable from './FancyTable.jsx';
import FancyModal from './FancyModal.jsx';
import Typography from '@mui/material/Typography';

const formatResult = (item) => {
  return (
    <div className="result-wrapper">
        <Typography sx={{ fontWeight: 'bold', m: 1 }} component="span">{item.type}:</Typography>
        <Typography className="result-span"  style= {{backgroundColor: 'rgb(107, 218, 255,0.5)'}} component="span">
        {item.request}</Typography>
    </div>
  );
};

const Dashboard = () => {
    const { auth } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [results, setResults] = useState({});
    const [preferences, setPreferences] = useState({});
    const [checked, setChecked] = useState({
        'A': false,
        'AAAA': false,
        'SOA': false,
        'IP': false,
        'CAA': false,
        'SERVICE': false,
        'LOOKUP': false,
        'CNAME': false,
        'MX': false,
        'NS': false,
        'SRV': false,
        'PTR': false,
        'TXT': false,
        'ANY': false
    });
    const [searchString, setSearchString] = useState("");
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      axios.get(Constants.BACKEND_URL + auth.username + Constants.GET_PREFERENCES).then(function (res) {
        setPreferences(res.data.preferences);
      });
      setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleOnSearch = (string, results) => {
        setSearchString(string);
    };

    const handleOnSelect = (item) => {
        setSearchString(item.request);
        for (const [key, value] of Object.entries(checked)) {
            checked[key] = false;
        }
        checked[item.type] = true;
    };

    const handleOnClear = () => {
    };

    function handleCheckOnClick(id) {
        var tmp = {};
        Object.assign(tmp, checked);
        if(tmp[id]) {
            tmp[id] = false;
        }
        else if(!tmp[id]) {
            tmp[id] = true;
        }
        setChecked(tmp);
    }

    async function getResults(queries){
        var results = {};
        var errors = "";
        var isError = false;
        for (const key of Object.keys(queries)) {
            var res = await axios.get(queries[key].query).catch(function (error) {
              errors += key + " ";
            });
            if (res === undefined) {
              isError = true;
              continue;
            }
            if(key === 'ANY') {
                for (const [mapKey, value] of Object.entries(res.data)) {
                  results[mapKey] = {host: queries[key].host, payload: value};
                }
            } else {
                results[key] = {host: queries[key].host, payload: res.data};
            }
        };
        if(isError) {
            alert("Problems occurred with " + errors);
            isError = false;
        }
        return results;
    }

    async function getHistory(queries) {
        var results = [];
        var res = [];
        for (const key of Object.keys(queries)){
            res = await axios.put(Constants.BACKEND_URL + auth.username + '/history', {
            entry: { type: key, request: queries[key].host }
        });
        };
        results = res.data;

        return results;
    }

    function updateHistory(){
        setItems([]);
    }

    function handleQuery() {
        setResults(new Object());
        var queries = {};

        Object.keys(checked).forEach(key => {
            var query = Constants.BACKEND_URL + auth.username;
            if(checked[key]) {
                if(key === "MX") {query += (Constants.MX + searchString);}
                else if(key === "A") {query += (Constants.A + searchString);}
                else if(key === "ANY") {query += (Constants.ANY + searchString);}
                else if(key === "AAAA") {query += (Constants.AAAA + searchString);}
                else if(key === "SOA") {query += (Constants.SOA + searchString);}
                else if(key === "IP") {query += (Constants.IP + searchString);}
                else if(key === "CAA") {query += (Constants.CAA + searchString);}
                else if(key === "LOOKUP") {query += (Constants.SERVICE + searchString);}
                else if(key === "CNAME") {query += (Constants.CNAME + searchString);}
                else if(key === "MX") {query += (Constants.MX + searchString);}
                else if(key === "NS") {query += (Constants.NS + searchString);}
                else if(key === "SRV") {query += (Constants.SRV + searchString);}
                else if(key === "PTR") {query += (Constants.PTR + searchString);}
                else if(key === "TXT") {query += (Constants.TXT + searchString);}

                queries[key] = {host: searchString, query: query};
            }
        });

        getResults(queries).then(res => {
            setResults(res);
        });
        getHistory(queries).then(res => {
            setItems(res);
        });
    }

    useEffect(() => {
        document.title = "DNSolver - Dashboard";
        axios.get(Constants.BACKEND_URL + auth.username + '/history/').then(function (res) {
            setItems(res.data.history);
        });
    }, [auth])

    return (
        <>
            <FancyBar updateHistory = {updateHistory} handleOpen = {handleOpen}/>
            <FancyModal handleClose = {handleClose} open = {open}
                        setOpen = {setOpen} setPreferences= {setPreferences} preferences = {preferences}/>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '25vh'}}>
                <Stack direction = "column" style={{justifyContent: 'center'}}>
                <Stack direction="row" style={{justifyContent: 'center'}}>
                    <FancyCheckbox label = 'MX' isChecked={checked['MX']} onChange = {() => handleCheckOnClick('MX')} />
                    <FancyCheckbox label = 'AAAA'  isChecked={checked['AAAA']} onChange = {() => handleCheckOnClick('AAAA')}/>
                    <FancyCheckbox label = 'IP'  isChecked={checked['IP']} onChange = {() => handleCheckOnClick('IP')}/>
                    <FancyCheckbox label = 'SOA'  isChecked={checked['SOA']} onChange = {() => handleCheckOnClick('SOA')}/>
                    <FancyCheckbox label = 'CAA'  isChecked={checked['CAA']} onChange = {() => handleCheckOnClick('CAA')}/>
                    <FancyCheckbox label = 'LOOKUP' isChecked={checked['LOOKUP']}  onChange = {() => handleCheckOnClick('LOOKUP')}/>
                    <FancyCheckbox label = 'CNAME' isChecked={checked['CNAME']} onChange = {() => handleCheckOnClick('CNAME')}/>
                    <FancyCheckbox label = 'A'  isChecked={checked['A']} onChange = {() => handleCheckOnClick('A')}/>
                    <FancyCheckbox label = 'NS' isChecked={checked['NS']}  onChange = {() => handleCheckOnClick('NS')}/>
                    <FancyCheckbox label = 'SRV'  isChecked={checked['SRV']} onChange = {() => handleCheckOnClick('SRV')}/>
                    <FancyCheckbox label = 'PTR' isChecked={checked['PTR']}  onChange = {() => handleCheckOnClick('PTR')}/>
                    <FancyCheckbox label = 'TXT'  isChecked={checked['TXT']} onChange = {() => handleCheckOnClick('TXT')}/>
                    <FancyCheckbox label = 'ANY'  isChecked={checked['ANY']} onChange = {() => handleCheckOnClick('ANY')}/>
                </Stack>
                <Stack direction='row'>
                    <div style={{width: '75vw', zIndex: '2'}}>
                      <ReactSearchAutocomplete
                        onSelect = {handleOnSelect}
                        items={items}
                        onSearch={handleOnSearch}
                        onClear={handleOnClear}
                        showClear={false}
                        inputSearchString={searchString}
                        inputDebounce={500}
                        autoFocus
                        styling={{hoverBackgroundColor: "#eee"}}
                        formatResult={formatResult}
                        fuseOptions={{keys: ['type', 'request']}}
                      />
                    </div>
                    <FancyButton onClick={handleQuery}/>
                </Stack>
                </Stack>
            </div>
            <FancyTable results={results}/>
        </>
    );
  }

export default Dashboard;
