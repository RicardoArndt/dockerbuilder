import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import "./App.css";

const apiUrl = "http://localhost:3001";

const getAllApps = () => {
  return axios.get(`${apiUrl}/allApps`, { responseType: "application/json" });
}

const startApp = (name) => {
  return axios.post(`${apiUrl}/startApp`, { name }, { responseType: "text/plain" });
}

const saveApp = (app) => {
  return axios.post(`${apiUrl}/saveApp`, app, { responseType: "text/plain" });
}

function App(props) {
  const { socket } = props;
  const [state, setState] = React.useState({ apps: [], logs: [] });

  const handleClickRun = (name) => {
    setState({ ...state, logs: [] });
    return startApp(name).then();
  };

  const handleClickAdd = () => {
    const apps = [...state.apps];
    apps.push({ name: "", path: "", isNew: true });

    setState({ ...state, apps });
  }

  const updateTable = () => {
    getAllApps().then(res => setState({ ...state, apps: res.data }));
  }

  const handleClickSave = (row, index) => {
    saveApp(row).then(() => {
      const apps = [...state.apps];
      const app = apps[index];

      app.isNew = false;

      apps.splice(index, 1, app);

      setState({ ...state, apps });
    });
  }

  const onChangeName = (event, index) => {
    const { value } = event.target;

    const apps = [...state.apps];
    const app = apps[index];

    app.name = value;

    apps.splice(index, 1, app);

    setState({ ...state, apps });
  }

  const onChangePath = (event, index) => {
    const { value } = event.target;

    const apps = [...state.apps];
    const app = apps[index];

    app.path = value;

    apps.splice(index, 1, app);

    setState({ ...state, apps });
  }

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected on socket");
    });

    socket.on("message", (arrayBuffer) => {
      const data = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
      setState(old => ({ ...old, logs: [...old.logs, data] }));
    });

    getAllApps().then(res => setState({ ...state, apps: res.data }));

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <div className="App">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Path</TableCell>
              <TableCell align="left">Run</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.apps.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">
                  <TextField id="outlined-basic" label="Name" variant="outlined" value={row.name} onChange={(event) => onChangeName(event, index)} />
                </TableCell>
                <TableCell align="left">
                  <TextField id="outlined-basic" label="Path" sx={{ minWidth: "50vw" }} variant="outlined" value={row.path} onChange={(event) => onChangePath(event, index)} />
                </TableCell>
                <TableCell align="left">
                  {
                    !row.isNew
                    ? <IconButton edge="end" title="Run app" aria-label="comments" onClick={() => handleClickRun(row.name)}>
                        <PlayArrowIcon />
                      </IconButton>
                    : <IconButton edge="end" title="Save app" aria-label="comments" onClick={() => handleClickSave(row, index)}>
                        <SaveIcon />
                      </IconButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" style={{ margin: "20px" }} onClick={(_) => updateTable()}>Update Table</Button>
        <Button variant="outlined" style={{ margin: "20px" }} onClick={(_) => handleClickAdd()}>Add</Button>
      </div>

      { state.logs.length 
        ? <div className="logs">
              <ul>
                { state.logs.map((log, index) => {
                  return <li key={index}>{log}</li>
                }) }
              </ul>
          </div>
        : <></>  
      }
    </div>
  );
}

export default App;
