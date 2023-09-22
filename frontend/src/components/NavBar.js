import List from '@mui/material/List'
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataObjectIcon from '@mui/icons-material/DataObject';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import NavComponent from './NavComponent'
import useCookie from './useCookie';

const NavBar = () => {

  const {clearCookies} = useCookie();

  return <List>

      <NavComponent
        text = "Questions"
        icon = {<DashboardIcon />}
        href = "../questionpage"
      />
      <NavComponent
        text = "User Profile"
        icon = {<PersonIcon />}
        href = "../profile"
      />
      <NavComponent
        text = "Admin View"
        icon = {<DataObjectIcon />}
        href = "../adminview"
      />
      
      <NavComponent
        text = "Log Out"
        icon = {<LogoutIcon />}
        href = "../"
        onClick={clearCookies}
      />
  </List>;
}

export default NavBar;

