import React from 'react';
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
        overflowX: "hidden",
        height: 'calc(100vh - 48px)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
        marginLeft: 240,
        },
}));

const LoadingPage = ({children}) => {
  var classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <div className={classes.content}>
          <CircularProgress />
        </div>
      </div>
    </>
  );
};

export default LoadingPage;