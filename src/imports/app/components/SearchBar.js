import * as React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

const styles = (theme) => createStyles({
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

class SearchBar extends React.Component {

  state = {
    searchTerm: '',
  }

  searchComic = () => {
    this.props.searchComic(this.state.searchTerm)
  }

  handleChange = () => {
    this.setState({
      searchTerm: event.target.value
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Input
          placeholder="想試看的漫畫……"
          onChange={this.handleChange}
          className={classes.input}
          disableUnderline
          inputProps={{
            'aria-label': 'Description',
          }}
        />
        <Button variant="contained" size="small" color="secondary" className={classes.button}
                onClick={this.searchComic}>
          搜尋
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(SearchBar)
