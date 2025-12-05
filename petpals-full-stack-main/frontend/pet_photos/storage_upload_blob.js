import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../src/firebaseClient";

export async function uploadBlob(file, path = "some-child") {
  if (!file) throw new Error("No file provided to uploadBlob");
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return snapshot;
}