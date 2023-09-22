import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const NavComponent = ({text, icon, href, onClick}) => {
  return <ListItemButton
    href={href}
    onClick ={onClick}
    >
    <ListItemIcon>
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItemButton>;
}

export default NavComponent;
