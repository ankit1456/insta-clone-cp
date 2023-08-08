import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import "../css/imageUpload.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  StorageError,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface ImageUploadProps {
  username: string;
}
const ImageUpload = ({ username }: ImageUploadProps) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please choose a image");
      return;
    }

    setIsUploading(true);
    const storageRef = ref(storage, `images/${image?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    try {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percent);
        },
        (err: StorageError) => {
          console.log(err);
          alert("Error uploading image. Please try again.");
          setIsUploading(false);
        },
        async () => {
          // download url
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption,
            imageUrl: url,
            username,
          });

          setIsUploading(false);
          setProgress(0);
          setCaption("");
          setImage(null);
        }
      );
    } catch (error) {
      console.log(error);
      alert("Error creating post. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="create">
      <form onSubmit={handleUpload}>
        <div className="create__input">
          <input
            type="text"
            placeholder="What is in your mind"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
        </div>
        {image && (
          <div className="imageupload__progress">
            <progress value={progress} max="100" />
          </div>
        )}

        {image && <img className="create__imgPreview" src={preview} />}
        <br />
        <div className="create__second">
          <div className="create__second-a">
            <label htmlFor="file">
              <CameraAltIcon className="camera" />
            </label>
            <input
              type="file"
              className="file"
              onChange={handleChange}
              id="file"
              disabled={isUploading}
            />
          </div>
          <div className="create__second-b">
            <input
              type="submit"
              value={isUploading ? "Uploading..." : "Create"}
              className="btn-sweet"
              disabled={isUploading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ImageUpload;
