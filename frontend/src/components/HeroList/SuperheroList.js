import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import css from "./SuperheroList.module.css"; 
const SuperheroList = () => {
  const [superheroes, setSuperheroes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSuperheroes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/superheroes?page=${currentPage}&limit=5`
        );
        setSuperheroes(response.data.superheroes);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching superheroes:", error);
      }
    };

    fetchSuperheroes();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={css.superheroContainer}>
      <div className={css.superheroHeader}>
        <h1>Superheroes List</h1>
        <Link to="/add" className={css.addLink}>Add New Superhero</Link>
      </div>

        <ul className={css.superheroList}>
    {superheroes.map(hero => (
      <li key={hero._id} className={css.superheroItem}>
        <Link to={`/superhero/${hero._id}`} className={css.superheroCard}>
          <img
            src={hero.images[0]}
            alt={hero.nickname}
            className={css.superheroImage}
          />
          <span className={css.superheroName}>{hero.nickname}</span>
        </Link>
      </li>
    ))}
  </ul>


      <div className={css.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className={css.paginationButton}>
          Previous
        </button>
        <span className={css.paginationSpan}>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className={css.paginationButton}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SuperheroList;
