import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import {SideBarData} from '../router'
import { makeStyles } from "@mui/styles"
import {Link} from "react-router-dom";  
const drawerWidth = 240;

const useStyles = makeStyles({
    root: {
        backgroundColor: "#fff",
        position:"fixed",
        height:"100vh",
        width: drawerWidth ,
        left: "0px"
    },
  });

function ResponsiveDrawer(props) {
    const {screen} = props;
    const classes = useStyles();  
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
 
    const drawer = (
        <div>
        <Toolbar />
        <List>
            {SideBarData.map((value, index) => (
                <ListItem key={index}>
                    <Link to={value.link} style={{textDecoration:"none",fontSize:"20px",color:"#4949c0"}}>{value.title}</Link>
                </ListItem>
            ))}
        </List>
        </div>
    );

    const container = screen !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
              <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
        >
        </AppBar>
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            >
            {drawer}
            </Drawer>
            <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
            >
            {drawer}
            </Drawer>
        </Box>
        
        </Box> 
        </div>
        
    );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
