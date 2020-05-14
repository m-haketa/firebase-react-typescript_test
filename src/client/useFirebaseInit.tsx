import { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import firebaseConfig from './firebase_config.json';

export const useFireBase = (): firebase.auth.UserCredential | undefined => {
  const [user, setUser] = useState<firebase.auth.UserCredential>();

  useEffect(() => {
    console.log('setuser async');
    firebase.initializeApp(firebaseConfig);

    firebase
      .auth()
      .signInAnonymously()
      .then((u) => {
        setUser(u);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return user;
};
