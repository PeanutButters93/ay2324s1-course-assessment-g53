import List from '@mui/material/List'
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PersonIcon from '@mui/icons-material/Person';
import NavComponent from './NavComponent'

const NavBar = () => {
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

  </List>;
}

export default NavBar;

