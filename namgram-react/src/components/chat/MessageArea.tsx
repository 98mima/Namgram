import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import  Divider  from '@material-ui/core/Divider';
import  Fab   from '@material-ui/core/Fab';
import  TextField  from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/SendOutlined'
import useChat from '../../services/chatHooks';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    chatSection: {
      width: '100%',
      height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
      height: '70vh',
      overflowY: 'auto'
    }
  });

function MessageArea(props: {roomId: string}) {
    const classes = useStyles();
    const [newMessage, setNewMessage] = useState("");
    const { messages, sendMessage } = useChat(props.roomId);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.currentTarget.value);
    }

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage("");
      };
    
    return (
            <Grid item xs={9}>
                <List className={classes.messageArea}>
                    {messages.map((message, i) => (
                    <ListItem key={i}>
                         <Grid container>
                             <Grid item xs={12}>
                                 {/*//@ts-ignore*/}
                                 <ListItemText primary={message.body}></ListItemText>
                             </Grid>
                             {/* <Grid item xs={12}>
                                 <ListItemText secondary="09:30"></ListItemText>
                             </Grid> */}
                         </Grid>
                     </ListItem>
                    ))}
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField value={newMessage} onChange={onChange} label="Type Something" fullWidth />
                    </Grid>
                    <Grid xs={1}>
                        <Fab onClick={handleSendMessage} color="primary" aria-label="add"><SendIcon /></Fab>
                    </Grid>
                </Grid>
            </Grid>
    )
}

export default MessageArea
