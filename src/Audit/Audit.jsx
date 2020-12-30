import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
	selectFilter,
	textFilter,
} from "react-bootstrap-table2-filter";

import { Navbar, Nav, Table } from "react-bootstrap";

class Auditpage extends React.Component {
	constructor(props) {
		super();
		this.state = {
			timeToggle: 12,
		};
		this.timeToggleHandler = this.timeToggleHandler.bind(this);
	}

	componentDidMount() {
		this.props.getUsers();
	}

	handleDeleteUser(id) {
		return (e) => this.props.deleteUser(id);
	}

	timeToggleHandler(e) {
		let time;
		if (+e.target.value === 12) {
			time = 12;
		} else {
			time = 24;
		}
		this.setState((curr) => ({ ...curr, timeToggle: time }));
	}

	render() {
		const { user, users } = this.props;
		const columns = [
			{
				dataField: "_id",
				text: "ID",
				sort: true,
			},
			{
				dataField: "role",
				text: "Role",
				filter: selectFilter({
					options: {
						User: "User",
						Auditor: "Auditor",
					},
					// defaultValue: "User",
				}),
			},
			{
				dataField: "createdDate",
				text: "Created At",
				sort: true,
				formatter: (column, row, rowIndex, extraData) => {
					if (extraData === 24) {
						return moment(Date.parse(column)).format("DD/MM/YYYY, HH:mm:ss");
					}
					return new Date(Date.parse(column)).toLocaleString("en-IN");
				},
				formatExtraData: this.state.timeToggle,
			},
			{
				dataField: "fullName",
				text: "Name",
				sort: true,
				filter: textFilter(),
			},
			{
				dataField: "id",
				text: "Action",
				formatter: (column) => {
					return (
						<span>
							<a onClick={this.handleDeleteUser(column)}>Delete</a>
						</span>
					);
				},
				align: "center",
			},
		];

		const defaultSorted = [
			{
				dataField: "createdDate",
				order: "desc",
			},
		];

		return (
			<React.Fragment>
				<Navbar bg="dark" variant="dark" style={{ margin: "0px" }}>
					<Navbar.Brand></Navbar.Brand>
					<Nav className="mr-auto">
						<Nav.Link>
							<Link to="/">Home</Link>
						</Nav.Link>
						<Nav.Link href="#features">Auditor</Nav.Link>
						<Nav.Link>
							<Link to="/login">Logout</Link>
						</Nav.Link>
					</Nav>
				</Navbar>
				<div className="col-md-12">
					<div className="jumbotron">
						<h1>Hi {user.firstName}!</h1>
						<p>You're logged in with React!!</p>
						<h3>All login audit :</h3>
						<select onChange={this.timeToggleHandler}>
							<option value="12">Show 12 hr</option>
							<option value="24">Show 24 hr</option>
						</select>
						{/* <button onClick={this.timeToggleHandler}>
						{this.state.timeToggle ? "Show 12 hr" : "Show 24 hr"}
					</button> */}
						{users.loading && <em>Loading users...</em>}
						{users.error && (
							<span className="text-danger">ERROR: {users.error}</span>
						)}
						{users.items && (
							<React.Fragment>
								<BootstrapTable
									keyField="_id"
									data={users.items}
									columns={columns}
									pagination={paginationFactory()}
									defaultSorted={defaultSorted}
									filter={filterFactory()}
									filterPosition="top"
									striped
								/>
								{/* <Table style={{ width: "100%" }} striped bordered>
							<thead>
								<tr>
									<th>ID</th>
									<th>Role</th>
									<th>Created at</th>
									<th>Name</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.items.map((user, index) => (
									<tr key={user.id}>
										<td>{user.id}</td>
										<td>{user.role}</td>
										<td>
											{this.state.timeToggle
												? moment(user.createdDate).format(
														"DD/MM/YYYY, HH:mm:ss"
												  )
												: new Date(user.createdDate).toLocaleString("en-IN")}
										</td>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>
											{user.deleting ? (
												<em> - Deleting...</em>
											) : user.deleteError ? (
												<span className="text-danger">
													- ERROR: {user.deleteError}
												</span>
											) : (
												<span>
													<a onClick={this.handleDeleteUser(user.id)}>Delete</a>
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</Table> */}
							</React.Fragment>
						)}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

function mapState(state) {
	const { users, authentication } = state;
	const { user } = authentication;
	if (users.items) {
		users.items.map((user) => {
			user.fullName = `${user.firstName} ${user.lastName}`;
			return user;
		});
	}
	return { user, users };
}

const actionCreators = {
	getUsers: userActions.getAll,
	deleteUser: userActions.delete,
};

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
