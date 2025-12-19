"use client";

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Component Imports
import { Menu, SubMenu, MenuItem } from "@menu/vertical-menu";

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";
import { useAbility, useAbilityLoading } from '@/contexts/AbilityContext';

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import VerticalMenuSkeleton from './VerticalMenuSkeleton';

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }) => {
  const ability = useAbility();

  const isLoading = useAbilityLoading();
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();

  const { isBreakpointReached, transitionDuration } = verticalNavOptions;
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: "bs-full overflow-y-auto overflow-x-hidden",
          onScroll: (container) => scrollMenu(container, false),
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: (container) => scrollMenu(container, true),
        })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{
          icon: <i className="tabler-circle text-xs" />,
        }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href="/dashboard" icon={<i className="tabler-smart-home" />}>
          Dashboard
        </MenuItem>
        {isLoading ? (
          <VerticalMenuSkeleton />
        ) : (
          <>
            {/* Roles */}
            {(ability.can('create', 'Role') || ability.can('read', 'Role')) && (
              <SubMenu label="Roles" icon={<i className="tabler-shield" />}>
                {ability.can('create', 'Role') && (
                  <MenuItem href="/roles/create">New Role</MenuItem>
                )}
                {ability.can('read', 'Role') && (
                  <MenuItem href="/roles">Role List</MenuItem>
                )}
              </SubMenu>
            )}

            {/* Admins */}
            {(ability.can('create', 'Admin') || ability.can('read', 'Admin')) && (
              <SubMenu label="Admins" icon={<i className="tabler-users" />}>
                {ability.can('create', 'Admin') && (
                  <MenuItem href="/admins/create">New Admin</MenuItem>
                )}
                {ability.can('read', 'Admin') && (
                  <MenuItem href="/admins">Admin List</MenuItem>
                )}
              </SubMenu>
            )}

            {/* Categories */}
            {ability.can('read', 'Category') && (
              <MenuItem href="/categories" icon={<i className="tabler-apps" />}>
                Categories
              </MenuItem>
            )}

            {/* Achievements */}
            {ability.can('read', 'Achievement') && (
              <MenuItem href="/achievements" icon={<i className="tabler-award" />}>
                Achievements
              </MenuItem>
            )}

            {/* Languages */}
            {ability.can('read', 'Language') && (
              <MenuItem href="/languages" icon={<i className="tabler-abc" />}>
                Languages
              </MenuItem>
            )}

            {/* Experts */}
            {(ability.can('create', 'Expert') || ability.can('read', 'Expert')) && (
              <SubMenu label="Experts" icon={<i className="tabler-users" />}>
                {ability.can('create', 'Expert') && (
                  <MenuItem href="/experts/create">New Expert</MenuItem>
                )}
                {ability.can('read', 'Expert') && (
                  <MenuItem href="/experts">Expert List</MenuItem>
                )}
              </SubMenu>
            )}

            {/* Client/Users */}
            {ability.can('read', 'User') && (
              <MenuItem href="/users" icon={<i className="tabler-user" />}>
                Client
              </MenuItem>
            )}

            {/* Bookings */}
            {ability.can('read', 'Booking') && (
              <>
                <MenuItem href="/bookings" icon={<i className="tabler-brand-booking" />}>
                  Bookings
                </MenuItem>

                <MenuItem href="/expert-payouts" icon={<i className="tabler-transaction-dollar" />}>
                  Expert Payouts
                </MenuItem>
              </>
            )}

            {/* Transactions */}
            {ability.can('read', 'Transaction') && (
              <MenuItem href="/transactions" icon={<i className="tabler-currency-dollar" />}>
                Transactions
              </MenuItem>
            )}

            {/* Pages */}
            {(ability.can('create', 'Page') || ability.can('read', 'Page')) && (
              <SubMenu label="Pages" icon={<i className="tabler-brand-pagekit" />}>
                {ability.can('create', 'Page') && (
                  <MenuItem href="/pages/create">New Page</MenuItem>
                )}
                {ability.can('read', 'Page') && (
                  <MenuItem href="/pages">Page List</MenuItem>
                )}
              </SubMenu>
            )}

            {ability.can('menu-manage', 'Miscellaneous') && (
              <MenuItem href="/menus" icon={<i className="tabler-menu-2" />}>
                Menus
              </MenuItem>
            )}

            {ability.can('contact-manage', 'Miscellaneous') && (
              <SubMenu label="Contact Us" icon={<i className="tabler-message-user" />}>
                <MenuItem href="/contacts">Contact List</MenuItem>
                <MenuItem href="/contacts/subjects">Contact Subjects</MenuItem>
              </SubMenu>
            )}

            {ability.can('setting-manage', 'Miscellaneous') && (
              <MenuItem href="/site-settings" icon={<i className="tabler-settings" />}>
                Site Settings
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
