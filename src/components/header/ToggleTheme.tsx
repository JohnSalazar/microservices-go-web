import Brightness5Icon from '@mui/icons-material/Brightness5'
import ModeNightIcon from '@mui/icons-material/ModeNight'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'

import useColorMode from '@/hooks/useColorMode'

function ToggleTheme() {
  const theme = useTheme()
  const colorMode = useColorMode()

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))

  const DarkTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }))

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 1,
      }}
    >
      <IconButton
        sx={{ ml: 1 }}
        color="inherit"
        onClick={colorMode.toggleColorMode}
      >
        {theme.palette.mode === 'dark' ? (
          <LightTooltip title="Light mode">
            <Brightness5Icon />
          </LightTooltip>
        ) : (
          <DarkTooltip title="Dark mode">
            <ModeNightIcon />
          </DarkTooltip>
        )}
      </IconButton>
      {theme.palette.mode} mode
    </Box>
  )
}

export default ToggleTheme
