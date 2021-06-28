/* eslint-disable array-callback-return */
import React, { useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import API from "../../services/API";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import MuiTable from "../../components/MuiTable";

const convertData = (data) => {
  let newData = [];
  if (data !== null)
    // console.log(data);
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      newData.push([
        el.login,
        el.role === 91
          ? "Студента " + el.id_group
          : el.role === 92
          ? "Преподавателя"
          : el.role === 93
          ? "Администратора"
          : "Не определено",
      ]);
    }
  return newData;
};

const CreateGroupModal = ({ setRerender }) => {
  const [invitationModal, setInvitationModal] = useState(false);
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [group, setGroup] = useState("");
  const [admissionYear, setAdmissionYear] = useState(new Date().getFullYear());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();

  const createGroup = async () => {
    setIsLoading(true);
    if (
      admissionYear > new Date().getFullYear() ||
      admissionYear < new Date().getFullYear() - 6
    ) {
      setError("Недопустимый год");
      return false;
    }
    setError(false);
    await API.call({
      method: "create_group",
      invitationsCount: invitationsCount,
      admissionYear: admissionYear,
      group: group,
    }).then((result) => {
      setIsLoading(false);
      if (result.success) {
        console.log(result.data);
        setData(result.data);
        if (invitationsCount === 0) {
          setInvitationModal(false);
          setRerender(true);
          setData(false);
        }
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <>
      <Tooltip title="Создать группу" placement="top" arrow>
        <Fab color="primary" onClick={() => setInvitationModal(true)}>
          <Add />
        </Fab>
      </Tooltip>
      {invitationModal && (
        <Dialog
          open={invitationModal}
          fullWidth={true}
          maxWidth={!data ? "xs" : "sm"}
        >
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{" Создание группы "}</Typography>
            {!isLoading && (
              <IconButton
                className={classes.closeButton}
                onClick={() => {
                  setInvitationModal(false);
                  setRerender(true);
                  setData(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          {isLoading ? (
            <DialogContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: 200,
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" size={40} />
              </div>
            </DialogContent>
          ) : data ? (
            <MuiTable
              title={[
                "Пожалуйста распечатайте или при печати сохраните как PDF",
              ]}
              data={convertData(data)}
              columns={["Приглашение", "В качестве"]}
              filter={true}
              print={true}
              noMatch="Приглашений нет"
            />
          ) : (
            <DialogContent style={{ display: "flex", flexDirection: "column" }}>
              {error ? (
                <Typography color="error" className={classes.errorMessage}>
                  {error}
                </Typography>
              ) : null}
              <TextField
                label="Название группы (номер)"
                type="text"
                variant="outlined"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
              <TextField
                label="Год поступления"
                type="number"
                variant="outlined"
                value={admissionYear}
                onChange={(e) => setAdmissionYear(e.target.value)}
                style={{
                  marginTop: 15,
                }}
                error={
                  admissionYear > new Date().getFullYear() ||
                  admissionYear < new Date().getFullYear() - 6
                    ? true
                    : false
                }
                helperText={
                  admissionYear > new Date().getFullYear()
                    ? "Некорректно: год поступления превышает настоящий"
                    : admissionYear < new Date().getFullYear() - 6 &&
                      "Некорректно: более 6 лет назад"
                }
              />
              <TextField
                label="Создать приглашений для студентов"
                type="number"
                variant="outlined"
                style={{
                  marginTop: 15,
                }}
                value={invitationsCount}
                onChange={(e) => setInvitationsCount(e.target.value)}
              />
              <Button
                onClick={() => createGroup()}
                color="primary"
                variant="contained"
                fullWidth
                style={{ margin: "15px 0px" }}
              >
                Создать
              </Button>
            </DialogContent>
          )}
        </Dialog>
      )}
    </>
  );
};

export default CreateGroupModal;
