import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
const sideDrawer = (props) => {

    //.. Need to implement the conditional classes to show the animations.
    
    
    return(
            <div className={classes.SideDrawer}>
                <Logo/>
                <nav>
                    <NavigationItems/>
                </nav>
            </div>
    );
};

export default sideDrawer;