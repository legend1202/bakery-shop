import { StackProps } from '@mui/material/Stack';
import { Theme, SxProps } from '@mui/material/styles';
import { ListItemButtonProps } from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

export type SlotProps = {
  gap?: number;
  rootItem?: SxProps<Theme>;
  subItem?: SxProps<Theme>;
  subheader?: SxProps<Theme>;
  currentRole?: string;
};

export type NavItemStateProps = {
  depth?: number;
  open?: boolean;
  active?: boolean;
  hasChild?: boolean;
  currentRole?: string;
  externalLink?: boolean;
};

export type NavItemBaseProps = {
  title: string;
  path: string;
  icon?: React.ReactElement;
  info?: React.ReactElement;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  color?: string;
  children?: any;
};

export type NavItemProps = ListItemButtonProps &
  NavItemStateProps &
  NavItemBaseProps & {
    slotProps?: SlotProps;
  };

export type NavListProps = {
  data: NavItemBaseProps;
  userRole?: string;
  depth: number;
  color?: string;
  slotProps?: SlotProps;
};

export type NavSubListProps = {
  data: NavItemBaseProps[];
  depth: number;
  slotProps?: SlotProps;
};

export type NavGroupProps = {
  subheader?: string;
  roles?: string[];
  userRole?: string;
  items: NavItemBaseProps[];
  slotProps?: SlotProps;
  color?: string;
};

export type NavProps = StackProps & {
  data: {
    subheader: string;
    roles?: string[];
    color?: string;
    items: NavItemBaseProps[];
  }[];
  slotProps?: SlotProps;
};
