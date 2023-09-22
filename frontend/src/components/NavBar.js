import List from '@mui/material/List'
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PersonIcon from '@mui/icons-material/Person';
import NavComponent from './NavComponent'

const NavBar = () => {
  return <List>

      <NavComponent
        icon = {<DashboardIcon />}
      />
      <NavComponent
        text = "User Profile"
        icon = {<PersonIcon />}
      />
      <NavComponent
        text = "Admin View"
        icon = {<DataObjectIcon />}
      />

  </List>;
}

export default NavBar;

