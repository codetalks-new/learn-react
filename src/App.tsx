import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { RouteComponentProps } from "react-router";

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
        <Link to={`${match!.url}/jack`}>Jack Ma</Link>
      </li>
      <li>
        <Link to={`${match!.url}/pony`}>Pony Ma</Link>
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
    </ul>
  </nav>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users" component={Users} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
