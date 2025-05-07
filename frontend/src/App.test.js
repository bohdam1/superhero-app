
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./components/HeroList/SuperheroList", () => () => <div>Hero List</div>);
jest.mock("./components/HeroDetails/SuperheroDetails", () => () => <div>Hero Details</div>);
jest.mock("./components/HeroForm/SuperheroForm", () => () => <div>Hero Form</div>);

describe("App routing", () => {
  test("renders SuperheroList on default route (/)", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Hero List")).toBeInTheDocument();
  });

  test("renders SuperheroDetails on /superhero/:id", () => {
    render(
      <MemoryRouter initialEntries={["/superhero/123"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Hero Details")).toBeInTheDocument();
  });

  test("renders SuperheroForm on /add", () => {
    render(
      <MemoryRouter initialEntries={["/add"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Hero Form")).toBeInTheDocument();
  });

  test("renders SuperheroForm on /edit/:id", () => {
    render(
      <MemoryRouter initialEntries={["/edit/456"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Hero Form")).toBeInTheDocument();
  });
});
