import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    User as FirebaseUser, 
    Auth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
    , signOut as firebaseSignOut
} from "firebase/auth"; 

export interface User extends FirebaseUser {}

const provider = new GoogleAuthProvider();

// Google login
export const signIn = async (auth: Auth) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        
        return { token, user };
    } catch (err) {
        const error = err as Record<string, unknown>;
        const code = error.code as string;
        const message = error.message as string;
        const customData = error.customData as Record<string, string>;
        const email = customData?.email;

        console.log(
            `An error ${code} occurred when logging user with email: ${email} with message: ${message}`,
        );
        throw err;
    }
};

// email signup
export const signUpWithEmailPassword = async (auth: Auth, email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Email Sign Up Error:", error);
        throw error;
    }
};

// email login
export const logInWithEmailPassword = async (auth: Auth, email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Email Log In Error:", error);
        throw error;
    }
};

// logout
export const signOut = async (auth: Auth) => {
    await firebaseSignOut(auth);
};