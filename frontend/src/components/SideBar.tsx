import React from 'react'
import {PagesName} from './Container'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import generateIcon from "../helpers/generateIcon"
import { useRouter } from 'next/router'
interface Props {
    title: string
    pages: PagesName
}




const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

function SideBar(props:Props) {
    const [dense, setDense] = React.useState(false);
    const router = useRouter()


    return (
        <Grid item xs={15} md={2}>
          <Demo>
            <List dense={dense}>
              {Object.keys(props.pages).map((key, index) => (
                  <>
                  <ListItemButton onClick={() => {router.push(key)}}>
                  <ListItem>
                  <ListItemIcon>
                    {generateIcon(props.pages[key])}
                  </ListItemIcon>
                  <ListItemText
                    primary={props.pages[key]}
                  />
                </ListItem>
                </ListItemButton>
                <Divider variant="inset" component="li" />
                </>
              ))
              }
            </List>
          </Demo>
        </Grid>
    )
}

export default SideBar
