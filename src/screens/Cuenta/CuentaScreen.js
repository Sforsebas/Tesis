import React, {useState, useEffect} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {UserLoggedScreen} from "./UserLoggedScreen";
import {UserGuestScreen} from "./UserGuestScreen";
import {LoadingModal} from "../../components";

export function CuentaScreen() {
    const [hasLogged, setHasLogged] = useState(null);

useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        setHasLogged(user ? true : false);
    });
}, []);

if (hasLogged === null) {
    return <LoadingModal show text="Cargando" />;
}

    return hasLogged ? <UserLoggedScreen /> : <UserGuestScreen />;
}