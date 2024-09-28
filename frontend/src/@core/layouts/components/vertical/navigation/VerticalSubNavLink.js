// ** Next Imports
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import Collapse from '@mui/material/Collapse'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'

// ** Styled Components
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity 0.25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, #FFFFFF 94%)`
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }) => {
  // ** Hooks
  const router = useRouter()
  const IconTag = item.icon

  const [subTitleOpen, setSubTitleOpen] = useState(false)

  const handleSubTitleOpen = () => {
    setSubTitleOpen(prev => !prev)
    console.log("subTitleOpen============>", subTitleOpen)
  }

  const isNavLinkActive = (path) => {
    if (router.pathname === path || handleURLQueries(router, path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{
          mt: 1.5,

          // px: '0 !important' ,
          py: '10px'
        }}
      >
        <MenuNavLink
          component={'a'}
          className={isNavLinkActive() ? 'active' : ''}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
            if (navVisible) {
              toggleNavVisibility()
            }
          }}
          sx={{
            pl: 5.5,
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
          }}
        >
          <ListItemIcon
            sx={{
              mr: 2.5,
              color: 'text.primary',
              transition: 'margin .25s ease-in-out'
            }}
            onClick = {handleSubTitleOpen}
          >
            <UserIcon icon={IconTag} />
          </ListItemIcon>

          <MenuItemTextMetaWrapper
            onClick = {handleSubTitleOpen}
          >
            <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
      </ListItem>
      <Collapse in={subTitleOpen} timeout='auto' unmountOnExit>
        <List>
          {
            item.subTitle.map((subItem, index) => (
              <ListItem
                key={index}
                disablePadding
                className='nav-link'
                disabled={item.disabled || false}
                sx={{
                  mt: 1.5,
                  ml:5,

                  // px: '0 !important' ,
                  py: '10px'
                }}
              >
                <Link passHref href={subItem.path === undefined ? '/' : `${subItem.path}`}>
                  <MenuNavLink
                    component={'a'}
                    className={isNavLinkActive(subItem.path) ? 'active' : ''}
                    {...(item.openInNewTab ? { target: '_blank' } : null)}
                    onClick={e => {
                      if (item.path === undefined) {
                        e.preventDefault()
                        e.stopPropagation()
                      }
                      if (navVisible) {
                        toggleNavVisibility()
                      }
                    }}
                    sx={{
                      pl: 5.5,
                      ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        mr: 2.5,
                        color: 'text.primary',
                        transition: 'margin .25s ease-in-out'
                      }}
                    >
                      <UserIcon icon={subItem.icon} />
                    </ListItemIcon>

                    <MenuItemTextMetaWrapper>
                      <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{subItem.title}</Typography>
                      {item.badgeContent ? (
                        <Chip
                          label={item.badgeContent}
                          color={item.badgeColor || 'primary'}
                          sx={{
                            height: 20,
                            fontWeight: 500,
                            marginLeft: 1.25,
                            '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                          }}
                        />
                      ) : null}
                    </MenuItemTextMetaWrapper>
                  </MenuNavLink>
                </Link>
              </ListItem>
            ))
          }
        </List>

      </Collapse>
    </>
  )
}

export default VerticalNavLink
