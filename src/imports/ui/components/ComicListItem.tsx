import * as React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import ListItem from "@material-ui/core/ListItem/ListItem";


const styles = theme => ({
    root: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: theme.spacing.unit * 2,
    },
    card: {
        display: 'flex',
    },
    subheading: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 120,
        height: 150,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    saveIcon: {
        marginRight: theme.spacing.unit,
    },
})

interface PropsTypes {
    classes: any,
}

export class ComicListItem extends React.Component<PropsTypes, {}> {
    render() {
        const {classes} = this.props
        return (
            <ListItem className={classes.root}>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image="http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg"
                        title="Live from space album cover"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography variant="headline">Name</Typography>
                            <Typography className={classes.subheading} variant="subheading" color="textSecondary">
                                Author | SF | Catalog | Status
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.actions}>
                            <Button size="small"><SaveIcon className={classes.saveIcon}/> 下載</Button>
                        </CardActions>
                    </div>
                </Card>
            </ListItem>
        )
    }
}

export default withStyles(styles)(ComicListItem)
