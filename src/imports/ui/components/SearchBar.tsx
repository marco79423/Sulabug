import * as React from 'react'
import {createStyles, Theme, withStyles} from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    display: 'flex',
  },
  inputWrapper: {
    flex: 1,
    background: theme.palette.background.paper,
  },
  input: {
    flex: 1,
    background: theme.palette.background.paper,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
  },
})

interface PropsTypes {
  classes: any
}

class SearchBar extends React.Component<PropsTypes, {}> {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Input
          placeholder="想「試看」的漫畫……"
          className={classes.input}
          disableUnderline
          inputProps={{
            'aria-label': 'Description',
          }}
        />
        <Button variant="contained" size="small" color="secondary" className={classes.button}>
          搜尋
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(SearchBar)
