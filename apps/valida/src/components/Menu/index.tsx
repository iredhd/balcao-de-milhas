import * as React from 'react';
import Button from '@mui/material/Button';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const Menu = ({children, options, disabled}: React.PropsWithChildren & { disabled?: boolean, options: { label: string, onClick: () => void }[] }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="menu-button"
        aria-controls={open ? 'menu-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={!!disabled}
      >
        {children}
      </Button>
      <MuiMenu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
          {
            options.map((option, index) => 
              <MenuItem key={index.toString()} onClick={option.onClick}>{option.label}</MenuItem>
            )
          }
      </MuiMenu>
    </div>
  );
}