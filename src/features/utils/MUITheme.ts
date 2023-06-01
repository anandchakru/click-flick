import { pink, teal } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const defaultTheme = createTheme({
  palette: {
    // https://mui.com/material-ui/customization/color/
    primary: {
      main: pink['A700'],
    },
    secondary: {
      main: teal['A700'],
    },
  },
})
const { breakpoints } = defaultTheme

const theme = {
  ...defaultTheme,
  overrides: {
    MuiTypography: {
      h1: {
        fontSize: "5rem",
        [breakpoints.down("xs")]: {
          fontSize: "3rem"
        }
      }
    }
  }
}

export default theme