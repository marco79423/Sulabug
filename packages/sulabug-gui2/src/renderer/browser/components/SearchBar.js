import React, {useEffect, useRef, useState} from 'react'
import {withRouter} from 'react-router-dom'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {fromEvent} from 'rxjs'
import {filter} from 'rxjs/operators'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
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
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}))

function SearchBar({history}) {
  const theme = useTheme()
  const classes = useStyles(theme)
  const inputRef = useRef()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fromEvent(inputRef.current, 'keyup').pipe(filter(event => event.key === 'Enter'))
      .subscribe(searchComic)
  }, [])

  const searchComic = () => {
    history.push(`/browser/browse?pattern=${searchTerm}`)
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className={classes.root}>
      <Input
        inputRef={inputRef}
        autoFocus={true}
        placeholder="請輸入想試看的漫畫……"
        onChange={handleChange}
        className={classes.input}
        disableUnderline
        inputProps={{
          'aria-label': 'Description',
        }}
      />
      <Button variant="contained" size="small" color="secondary" className={classes.button}
              onClick={searchComic}>
        搜尋
      </Button>
    </div>
  )
}

export default withRouter(SearchBar)
