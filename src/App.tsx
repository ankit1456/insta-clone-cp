import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import Post from "./components/Post";
import { Post as PostModel } from "./models/Post";
import { db, auth } from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  Unsubscribe,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Modal, Fade, Box, Backdrop, Button, Input } from "@mui/material";

import { FirebaseError } from "@firebase/util";
import { AUTH_TYPE } from "./models/authType";
import ImageUpload from "./components/ImageUpload";
import Stories from "./components/Stories";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  minWidth: "300px",
  maxWidth: "450px",
};

const btnStyle = {
  backgroundColor: "#4CB5F9",
  color: "#fff",
};

function App() {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authType, setAuthType] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleOpen = (authType: string) => {
    setAuthType(authType);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        try {
          const newPosts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as PostModel[];
          setPosts(newPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      },
      (error) => {
        console.error("Error subscribing to posts:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      (authUser: User | null) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [username, user]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (authType === AUTH_TYPE.SIGN_UP) {
      try {
        const authUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(authUser.user, {
          displayName: username,
        });
        setEmail("");
        setPassword("");
        setUsername("");

        setOpen(false);
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          alert(error.message);
        }
      }
    } else if (authType === AUTH_TYPE.SIGN_IN) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setOpen(false);
        setEmail("");
        setPassword("");
      } catch (error) {
        if (error instanceof FirebaseError) {
          alert(error.message);
        }
      }
    }
  };

  return (
    <div className="app">
      <Modal
        className="auth__modal"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form className="app__signUp" onSubmit={handleAuth}>
              <center>
                <img
                  className="app__headerImage"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzFj87v7cdZAMuQzMol5zsNpdwU87kaGE270YOjLf8vIklU9dfvQnZ_yKE5AiLvgttPA&usqp=CAU"
                  alt="logo"
                />
              </center>

              {authType === AUTH_TYPE.SIGN_UP && (
                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button className="btn" sx={btnStyle} type="submit">
                {authType === AUTH_TYPE.SIGN_UP ? "Sign up" : "Sign in"}
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
      <div className="app__header">
        <div className="app__headerContainer">
          <img
            className="app__headerImage"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzFj87v7cdZAMuQzMol5zsNpdwU87kaGE270YOjLf8vIklU9dfvQnZ_yKE5AiLvgttPA&usqp=CAU"
            alt="logo"
          />
          {user ? (
            <Button
              className="btn"
              sx={btnStyle}
              onClick={() => auth.signOut()}
            >
              Sign out
            </Button>
          ) : (
            <div className="app__authContainer">
              <Button
                className="btn"
                sx={btnStyle}
                onClick={() => handleOpen(AUTH_TYPE.SIGN_IN)}
              >
                Sign in
              </Button>
              <Button
                className="btn"
                sx={btnStyle}
                onClick={() => handleOpen(AUTH_TYPE.SIGN_UP)}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
      <Stories />
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h4>Sorry ,You need to login to upload and to add comment🙂</h4>
      )}
      <div className="app__posts">
        {posts?.map((post) => (
          <Post postId={post.id} key={post.id} post={post} user={user} />
        ))}
      </div>
    </div>
  );
}

export default App;
