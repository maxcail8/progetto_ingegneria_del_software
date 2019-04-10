import React from "react";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import PropTypes from "prop-types";
import axios from "axios";
import AutoComplete from "./AutoComplete";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	title: {
		fontSize: 20,
		fontWeight: 700,
	},
	avatar: {
		width: 30,
		height: 30,
	},
	button: {
		fonSize: 14,
		color: '#009688',
	}
};

class InviteDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchInput: "",
			history: [],
			searchedForInput: false,
			matchingUsers: [],
			users: [],
			inviteIds: [],
			fetchedUsers: false
		};
	}
	componentDidMount() {
		const userId = JSON.parse(localStorage.getItem("user")).id;
		axios
			.get("/profiles?searchBy=visibility&visible=true")
			.then(res => {
				const users = res.data.filter(user => user.user_id !== userId);
				users.forEach(user => {
					user.name = user.given_name + " " + user.family_name;
				});
				this.setState({ fetchedGroups: true, users });
				this.handleSearch("");

			})
			.catch(error => {
				console.log(error);
				this.setState({ fetchedGroups: true });
			});
	}
	handleKeyPress = e => {
		if (e.key === "Enter") {
			this.handleSearch(this.state.searchInput);
		}
	};
	handleSearch = value => {
		value = value.toLowerCase().trim();
		const users = this.state.users;
		const matchingUsers = [];
		users.forEach(user => {
			if (user.name.toLowerCase().includes(value)) {
				matchingUsers.push(user);
			}
		});
		this.setState({
			searchedForInput: true,
			searchInput: value,
			matchingUsers: matchingUsers
		});
	};
	onInputChange = event => {
		this.setState({ searchInput: event.target.value, searchedForInput: false });
		if (event.target.value === "") this.handleSearch("");
	};
	handleInvite = () => {
		if (this.state.inviteIds.length > 0) {
			this.props.handleInvite(this.state.inviteIds);
		} else {
			this.props.handleClose();
		}
		this.setState({
			inviteIds: [],
			searchInput: "",
			searchedForInput: false,
			matchingUsers: []
		});
	};
	handleSelect = id => {
		const inviteIds = this.state.inviteIds;
		const indexOf = inviteIds.indexOf(id);
		if (indexOf === -1) {
			inviteIds.push(id);
		} else {
			inviteIds.splice(indexOf, 1);
		}
		this.setState({ inviteIds: inviteIds });
	};
	handleClose = () => {
		this.props.handleClose()
	}
	render() {
		const texts = Texts[this.props.language].inviteModal;
		const { classes } = this.props;
		return (
			<Dialog 
			onClose={this.handleClose}
			aria-labelledby="invite user dialog"
			open={this.props.isOpen}
			fullWidth={true}
		  >
				<DialogTitle className={classes.title}>{texts.header}</DialogTitle>
				<input
					className="inviteDialogInput"
					type="search"
					value={this.state.searchInput}
					placeholder={texts.search}
					onChange={this.onInputChange}
					onKeyPress={this.handleKeyPress}
				/>
				<DialogContent>
					{!this.state.searchedForInput ? (
						<AutoComplete
							searchInput={this.state.searchInput}
							entities={this.state.users}
							handleSearch={this.handleSearch}
						/>
					) : 
					<List>
						{this.state.matchingUsers.map( user => {
							const selected = this.state.inviteIds.includes(user.user_id);
							return <ListItem button onClick={() => this.handleSelect(user.user_id)} key={user.user_id} selected={selected}>
								<ListItemAvatar>
									<Avatar className={classes.avatar} src={user.image.path} sizes="small"/>
								</ListItemAvatar>
								<ListItemText primary={`${user.given_name} ${user.family_name}`} />
								<ListItemIcon>
									<i className="fas fa-circle inviteSelect" style={selected?{}:{display:'none'}}/>
								</ListItemIcon>
							</ListItem>
							})}
					</List>
					}
				</DialogContent>
				<DialogActions>
					<Button  onClick={this.handleClose} className={classes.button}>
						{texts.cancel} 
					</Button>
					<Button onClick={this.handleInvite} className={classes.button}>
						{texts.invite}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

InviteDialog.propTypes = {
	isOpen: PropTypes.bool,
	handleClose: PropTypes.func,
	handleInvite: PropTypes.func
};

export default withLanguage(withStyles(styles)(InviteDialog));