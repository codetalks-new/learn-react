import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { RouteComponentProps, RouteProps, Redirect, withRouter, RouteChildrenProps } from "react-router";

interface MenuLinkProps {
  label: string;
  to: string;
  activeOnlyWhenExact?: boolean;
}

const MenuLink = ({ label, to, activeOnlyWhenExact }: MenuLinkProps) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }: RouteChildrenProps) => (
      <div className={match ? "active" : ""}>
        {match ? ">" : ""}
        <Link to={to}>{label}</Link>
      </div>
    )}
  ></Route>
);

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;

interface UserParams {
  userId: string;
}
const User = ({ match }: RouteComponentProps<UserParams>) => <h3>传递的用户 ID:{match!.params.userId}</h3>;
const Users = ({ match }: RouteComponentProps) => (
  <div>
    <h2>Users</h2>
    <ul>
      <li>
        <MenuLink to={`${match!.url}/jack`} activeOnlyWhenExact={true} label="Jack Ma" />
      </li>
      <li>
        <MenuLink to={`${match!.url}/pony`} label="Pony Ma" />
      </li>
    </ul>
    <Switch>
      <Route path={`${match!.path}/:userId`} component={User} />
      <Route path={match!.path}>
        <h3>请选择一个人物</h3>
      </Route>
    </Switch>
  </div>
);

const Navigation = () => (
  <nav>
    <ul>
      <li>
        <NavLink to="/" activeClassName="App-link active">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className="App-link">
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/users" className="App-link">
          Users
        </NavLink>
      </li>
      <li>
        <NavLink to="/orders/desc" className="App-link">
          Orders
        </NavLink>
      </li>
      <li>
        <NavLink to="/orders/abc" className="App-link">
          Orders with abc direction
        </NavLink>
      </li>
    </ul>
  </nav>
);

const Orders = ({ match }: RouteComponentProps<{ direction: "asc" | "desc" }>) => (
  <div>
    <h3>只允许 asc/desc 作为参数 : {match.params.direction}</h3>
  </div>
);

const fakeAuth = {
  isAuthenticated: false,
  authenticase(cb: Function) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); //fake async
  },
  signout(cb: Function) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

interface LoginState {
  redirectToReffer: boolean;
}
class Login extends Component<RouteComponentProps, LoginState> {
  state = {
    redirectToReffer: false
  };

  login = () => {
    fakeAuth.authenticase(() => {
      this.setState({ redirectToReffer: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReffer } = this.state;
    if (redirectToReffer) {
      return <Redirect to={from} />;
    }
    return (
      <div>
        <p>你必须登录之后才能查看此页面 {from.pathname}</p>
        <button onClick={this.login}>登录</button>
      </div>
    );
  }
}

const PrivateRoute = ({ component, ...rest }: RouteProps) => {
  console.info("component:", component);
  return (
    <Route
      {...rest}
      render={props => {
        console.info("props:", props);
        return fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        );
      }}
    ></Route>
  );
};

const RawAuthButton = ({ history }: RouteComponentProps) =>
  fakeAuth.isAuthenticated ? (
    <p>
      欢迎来到 CodeTalks 的编程实验室
      <button
        onClick={() => {
          fakeAuth.signout(() => history.push("/"));
        }}
      >
        注销
      </button>
    </p>
  ) : (
    <p>你尚未登录!</p>
  );

const AuthButton = withRouter(RawAuthButton);

const BasicApp: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <AuthButton />
        <Navigation />
        <main>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users" component={Users} />
            <PrivateRoute path="/orders/:direction(asc|desc)" component={Orders} />
            <Route path="/login" component={Login} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

const sideBarRoutes: any[] = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: "/bubblegum",
    exact: true,
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: "/shoelaces",
    exact: true,
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
];

const SideBarApp = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div style={{ padding: "10px", width: "40%", background: "#f0f0f0" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/bubblegum">Bubblegum</Link>
            </li>
            <li>
              <Link to="/shoelaces">Shoelaces</Link>
            </li>
          </ul>
          {sideBarRoutes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />
          ))}
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          {sideBarRoutes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.main} />
          ))}
        </div>
      </div>
    </Router>
  );
};

export default SideBarApp;
