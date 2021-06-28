import React from "react";
import { Route, Switch, Redirect, withRouter, } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Menu from "./../Sidebar/Sidebar";
// pages
import CurrentDisciplines from './../../pages/CurrentDisciplines/CurrentDisciplines';
import DisciplineGroupLayout from './../DisciplineLayout/DisciplineGroupLayout';
import Groups from './../../pages/Groups/index';
import Users from './../../pages/Users/index';
import MyDisciplines from './../../pages/MyDisciplines/index';
import DisciplineConfigLayout from "../../pages/DisciplineConfig/DisciplineConfigLayout";
import Profile from './../../pages/Profile/index';
import AllDisciplines from "../../pages/AllDisciplines";

function Layout(props) {
  var classes = useStyles();
  return (<>
    <div className={classes.root}>
      <Menu history={props.history} />
      <div className={classnames(classes.content)}>
        <Switch>
          <Route exact path="/teacher/profile" component={Profile} />
          <Route exact path="/teacher" render={() => <Redirect to="/teacher/current" />} />
          <Route exact path="/teacher/current" component={CurrentDisciplines} />
          <Route exact path="/teacher/my_disciplines" component={MyDisciplines} />
          <Route exact path="/teacher/discipline/:id_discipline" component={DisciplineConfigLayout} />
          <Route exact path="/teacher/discipline/:id_discipline/group/:id_group" component={DisciplineGroupLayout} />
          <Route exact path="/teacher/groups" component={Groups} />
          <Route exact path="/teacher/users" component={Users} />
          <Route exact path="/teacher/all_disciplines" component={AllDisciplines} />
        </Switch>
      </div>
    </div>
  </>);
}

export default withRouter(Layout);
