import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import css from "./SuperheroForm.module.css"; 

const SuperheroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    real_name: "",
    origin_description: "",
    superpowers: "",
    catch_phrase: "",
    images: [""] 
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/superheroes/${id}`)
        .then(response => setFormData(response.data))
        .catch(error => console.error("Error fetching superhero:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nickname", formData.nickname);
    data.append("real_name", formData.real_name);
    data.append("origin_description", formData.origin_description);
    data.append("superpowers", formData.superpowers);
    data.append("catch_phrase", formData.catch_phrase);
  
    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }
  
    axios.post("http://localhost:5000/api/superheroes", data)
      .then(() => navigate("/"))
      .catch(error => console.error("Error adding superhero:", error));
  };

  return (
    <div className={css.pageContainer}>
      <div className={css.formContainer}>
        <form onSubmit={handleSubmit} className={css.superheroForm}>
          <h1 className={css.superheroHeader}>Create/Update Superhero</h1>
          
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Nickname"
            className={css.superheroInput}
          />
          
          <input
            type="text"
            name="real_name"
            value={formData.real_name}
            onChange={handleChange}
            placeholder="Real Name"
            className={css.superheroInput}
          />
          
          <textarea
            name="origin_description"
            value={formData.origin_description}
            onChange={handleChange}
            placeholder="Origin Description"
            className={css.superheroTextarea}
          />
          
          <input
            type="text"
            name="superpowers"
            value={formData.superpowers}
            onChange={handleChange}
            placeholder="Superpowers"
            className={css.superheroInput}
          />
          
          <input
            type="text"
            name="catch_phrase"
            value={formData.catch_phrase}
            onChange={handleChange}
            placeholder="Catchphrase"
            className={css.superheroInput}
          />
          
          <input
            type="file"
            name="images"
            multiple
            onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.files }))}
            accept="image/*"
            className={css.superheroFileInput}
          />
          
          <button type="submit" className={css.superheroSubmitButton}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default SuperheroForm;
