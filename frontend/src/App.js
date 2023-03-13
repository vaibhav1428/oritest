import { useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  async function postImage({ image, description }) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("customname", description);

    const result = await axios.post("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return result.data;  
  }

  const submit = async (event) => {
    event.preventDefault();
    const result = await postImage({ image: file, description });
    setImages([result.image, ...images]);
  };
  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };



  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input
          value={description}
          placeholder="please enter custom name of image"
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit-image</button>
      </form>

      {images.map((image) => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}
    </div>
  );
}

export default App;
