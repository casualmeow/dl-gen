import { NavLink } from "react-router";

export const NavigationPages = () => {
    return (
        <NavLink to="/">Home</NavLink>
        <NavLink to="/edit/:fileId">Edit</NavLink>
    )
}
