import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";
import axios from "axios";
import { ModeContext } from "../../contexts/ModeContext";
import { UserContext } from "../../contexts/UserContext";
import Toast from "./Toast";

interface User {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

function Authentication() {
  const [, transite] = useContext(ModeContext);
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [toastLogin, setToastLogin] = useState(false);
  const [toastLogout, setToastLogout] = useState(false);
  const [error, setError] = useState({
    confirm: false,
    existingName: false,
    existingEmail: false,
    emptyName: false,
    emptyEmail: false,
    emptyPassword: false,
    noAccount: false,
    wrongPassword: false,
  });
  const [userMode, setUserMode] = useState<string>(
    user.name ? "Manage" : "Login"
  );
  const [state, setState] = useState<User>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCreate = () => {
    setUserMode("Create");
  };
  const handleClose = () => {
    setUserMode("Login");
    setOpen(false);
    setError({
      confirm: false,
      existingName: false,
      existingEmail: false,
      emptyName: false,
      emptyEmail: false,
      emptyPassword: false,
      noAccount: false,
      wrongPassword: false,
    });
    setState({
      name: "",
      email: "",
      password: "",
      confirm: "",
    });
  };

  useEffect(() => {
    if (!user.name) {
      setUserMode("Login");
    }
  }, [user]);

  const handleSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("/login", { email: state.email, password: state.password })
      .then((res) => {
        console.log(res);
        setUser({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
        });
        setState({
          name: "",
          email: "",
          password: "",
          confirm: "",
        });
        setOpen(false);
        setUserMode("Manage");
        setToastLogin(true);
      })
      .catch((err) => {
        if (err.response.data === "cannot find this account") {
          setError({ ...error, noAccount: true });
        } else if (err.response.data === "wrong password") {
          setError({ ...error, wrongPassword: true });
        }
      });
  };
  const handleSubmitCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError({ ...error, confirm: state.confirm ? false : true });
    if (state.confirm === state.password) {
      axios
        .post("/user", state)
        .then((res) => {
          console.log("success");
          setUser({
            id: res.data[0].id,
            name: res.data[0].name,
            email: res.data[0].email,
          });
          setOpen(false);
          setUserMode("Manage");
          setState({
            name: "",
            email: "",
            password: "",
            confirm: "",
          });
        })
        .catch((err) => {
          if (err.response.data.error === "name already exists") {
            setError({ ...error, existingName: true });
          } else if (err.response.data.error === "email already exists") {
            setError({ ...error, existingEmail: true });
          } else if (err.response.data.error === "empty name") {
            setError({ ...error, emptyName: true });
          } else if (err.response.data.error === "empty email") {
            setError({ ...error, emptyEmail: true });
          } else if (err.response.data.error === "empty password") {
            setError({ ...error, emptyPassword: true });
          }
        });
    }
  };

  const handleLogOut = () => {
    setOpen(false);
    setUserMode("Login");
    transite("HOME");
    setUser({ id: 0, name: "", email: "" });
    setToastLogout(true);
  };

  const errorMessage = () => {
    if (error.existingName) {
      return "Name already exists!";
    } else if (error.emptyName) {
      return "Please enter valid username!";
    } else if (error.emptyEmail) {
      return "Please enter valid email!";
    } else if (error.emptyPassword) {
      return "Please enter valid password!";
    } else {
      return "";
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClickOpen}
        sx={{ textTransform: "none", fontSize: 25, fontFamily: "Josefin Sans" }}
      >
        {user.name ? user.name : "Login"}
      </Button>

      {userMode === "Login" && (
        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmitLogin}>
            <DialogTitle>User Log In</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Getting Started to manage your kitchen smartly!
              </DialogContentText>
              <Button
                sx={{ border: 1, borderRadius: 2, mt: 2 }}
                onClick={handleCreate}
              >
                Create new account
              </Button>
              <TextField
                error={error.noAccount}
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                variant="standard"
                fullWidth
                value={state.email}
                onChange={(event) => {
                  setState({ ...state, email: event.target.value });
                }}
                helperText={
                  error.noAccount ? "This account does not exist" : ""
                }
              />
              <TextField
                error={error.wrongPassword}
                autoFocus
                margin="dense"
                label="Password"
                type="password"
                variant="standard"
                fullWidth
                value={state.password}
                onChange={(event) => {
                  setState({ ...state, password: event.target.value });
                }}
                helperText={
                  error.wrongPassword ? "Password entered is wrong" : ""
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Log In</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
      {toastLogin && (
        <Toast
          message={"You have successfully logged in!"}
          open={toastLogin}
          setOpen={setToastLogin}
        />
      )}

      {userMode === "Create" && (
        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmitCreate}>
            <DialogTitle>Create your SmartKitchen Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Getting Started to manage your kitchen smartly!
              </DialogContentText>
              <Grid
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: 500,
                }}
              >
                <TextField
                  error={error.existingName || error.emptyName}
                  autoFocus
                  margin="normal"
                  sx={{ mr: 2 }}
                  label="User name"
                  type="name"
                  variant="standard"
                  value={state.name}
                  onChange={(event) => {
                    setState({ ...state, name: event?.target.value });
                    setError({
                      ...error,
                      existingName: false,
                      emptyName: false,
                    });
                  }}
                  helperText={errorMessage()}
                />
                <TextField
                  error={error.existingEmail || error.emptyEmail}
                  autoFocus
                  margin="normal"
                  sx={{ mr: 2 }}
                  label="Email Address"
                  type="email"
                  variant="standard"
                  value={state.email}
                  onChange={(event) => {
                    setState({ ...state, email: event?.target.value });
                    setError({
                      ...error,
                      existingEmail: false,
                      emptyEmail: false,
                    });
                  }}
                  helperText={errorMessage()}
                />
                <TextField
                  error={error.emptyPassword}
                  margin="normal"
                  sx={{ mr: 2 }}
                  label="Password"
                  type="password"
                  variant="standard"
                  value={state.password}
                  onChange={(event) => {
                    setState({
                      ...state,
                      password: event?.target.value,
                      confirm: "",
                    });
                    setError({ ...error, emptyPassword: false });
                  }}
                />
                {
                  <TextField
                    error={error.confirm}
                    margin="normal"
                    sx={{ mr: 2 }}
                    label="Confirm your password"
                    type="password"
                    variant="standard"
                    value={state.confirm}
                    inputProps={{
                      onBlur: (event) => {
                        state.password === event?.target.value
                          ? setError({ ...error, confirm: false })
                          : setError({ ...error, confirm: true });
                      },
                    }}
                    onChange={(event) => {
                      setState({ ...state, confirm: event?.target.value });
                      setError({ ...error, confirm: false });
                    }}
                    helperText={
                      error.confirm ? "Please enter the same password!" : ""
                    }
                  />
                }
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Register</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
      {userMode === "Manage" && (
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          PaperProps={{ sx: { width: "32%" } }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
            Hi {user.name}
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DialogContentText>{user.email}</DialogContentText>
            <DialogContentText>You are now signed in!</DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </Button>
            <Button onClick={handleLogOut} autoFocus>
              Sign Out
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {toastLogout && (
        <Toast
          message={"You have successfully logged out!"}
          open={toastLogout}
          setOpen={setToastLogout}
        />
      )}
    </>
  );
}

export default Authentication;
