import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import css from "./SuperheroDetails.module.css"; 

const SuperheroDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [superhero, setSuperhero] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/superheroes/${id}`)
      .then((response) => setSuperhero(response.data))
      .catch((error) =>
        console.error("Error fetching superhero details:", error)
      );
  }, [id]);

  const handleEdit = async () => {
    try {
      
      const response = await axios.patch(
        `http://localhost:5000/api/superheroes/${id}`,
        {
          nickname: superhero.nickname,
          real_name: superhero.real_name,
          origin_description: superhero.origin_description,
          superpowers: superhero.superpowers,
          catch_phrase: superhero.catch_phrase,
        }
      );
      
      setSuperhero(response.data);
      setIsEditing(false); 
      alert("Superhero updated successfully!");
  
    } catch (error) {
      console.error("Error updating superhero:", error);
      alert("Error updating superhero.");
    }
  };

  const handleAddImages = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/superheroes/${id}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuperhero(response.data); 
    } catch (error) {
      console.error("Error adding images:", error);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/superheroes/${id}/images/delete`,
        { imageUrl }
      );
      setSuperhero((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== imageUrl),
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this superhero?"
    );
    if (confirm) {
      try {
        await axios.delete(`http://localhost:5000/api/superheroes/${id}`);
        navigate("/"); 
      } catch (error) {
        console.error("Error deleting superhero:", error);
      }
    }
  };

  if (!superhero) return <div>Loading...</div>;

  return (
    <div className={css.superheroDetailsContainer}>
      <button onClick={() => navigate(-1)} className={css.backButton}>
        Назад
      </button>

      <div className={css.imageGallery}>
        {superhero.images?.map((img, index) => (
          <div key={index} className={css.imageItem}>
            <img
              src={img}
              alt={`Superhero ${index}`}
              className={css.imagePreview}
            />
            <button
              onClick={() => handleDeleteImage(img)}
              className={css.deleteImageButton}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {isEditing ? (
  <div className={css.editContainer}>
    <input
      className={css.inputField}
      type="text"
      value={superhero.nickname}
      onChange={(e) =>
        setSuperhero({ ...superhero, nickname: e.target.value })
      }
      placeholder="Nickname"
    />
    <input
      className={css.inputField}
      type="text"
      value={superhero.real_name}
      onChange={(e) =>
        setSuperhero({ ...superhero, real_name: e.target.value })
      }
      placeholder="Real Name"
    />
    <textarea
      className={css.textareaField}
      value={superhero.origin_description}
      onChange={(e) =>
        setSuperhero({ ...superhero, origin_description: e.target.value })
      }
      placeholder="Origin Description"
    />
    <input
      className={css.inputField}
      type="text"
      value={superhero.superpowers}
      onChange={(e) =>
        setSuperhero({ ...superhero, superpowers: e.target.value })
      }
      placeholder="Superpowers"
    />
    <input
      className={css.inputField}
      type="text"
      value={superhero.catch_phrase}
      onChange={(e) =>
        setSuperhero({ ...superhero, catch_phrase: e.target.value })
      }
      placeholder="Catchphrase"
    />
    <button onClick={handleEdit} className={css.saveButton}>
      Save
    </button>
  </div>
) : (
  <div>
    <h1 className={css.superheroName}>{superhero.nickname}</h1>
    <p className={css.superheroDetail}>
      <strong>Real Name:</strong> {superhero.real_name}
    </p>
    <p className={css.superheroDetail}>
      <strong>Origin:</strong> {superhero.origin_description}
    </p>
    <p className={css.superheroDetail}>
      <strong>Superpowers:</strong> {superhero.superpowers}
    </p>
    <p className={css.superheroDetail}>
      <strong>Catchphrase:</strong> {superhero.catch_phrase}
    </p>
    
  </div>
)}

    <div className={css.controls}>
        <label className={css.fileUploadLabel}>
          Додати файл
          <input
            type="file"
            multiple
            onChange={(e) => handleAddImages(e.target.files)}
            accept="image/*"
            className={css.superheroFileInput}
          />
        </label>
        <button
      onClick={() => setIsEditing(true)}
      className={css.editButton}
    >
      Edit
    </button>
        <button onClick={handleDelete} className={css.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default SuperheroDetails;
